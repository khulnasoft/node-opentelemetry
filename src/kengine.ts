import { BatchSpanProcessor, NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { detectResourcesSync, ResourceAttributes } from '@opentelemetry/resources';
import { awsEc2Detector, awsEcsDetector, awsLambdaDetector } from '@opentelemetry/resource-detector-aws'
import { VercelDetector } from './resources/vercel.ts';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { InstrumentationOption, registerInstrumentations } from '@opentelemetry/instrumentation';
import { existsSync } from 'fs';

type KengineSDKOpts = {
    instrumentations?: InstrumentationOption[],
    collectorUrl?: string,
    kengineKey?: string,
    service?: string,
    namespace?: string,
    serverless?: boolean
}


/**
 * KengineSDK is a wrapper around the OpenTelemetry NodeSDK that configures it to send traces to Kengine.
 * 
 * @param {KengineSDKOpts} options
 * @param {InstrumentationOption[]} options.instrumentations - The OpenTelemetry instrumentations to enable.
 * @param {string} options.collectorUrl - The URL of the Kengine collector. Defaults to https://otel.khulnasoft.com/v1
 * @param {string} options.kengineKey - The Kengine API key. Defaults to the KENGINE_KEY environment variable.
 * @param {string} options.service - The name of the service. 
 * @param {string} options.namespace - The namespace of the service.
 * @param {boolean} options.serverless - Whether or not the service is running in a serverless environment. Defaults to false.
 * 
 */
export class KengineSDK {
    options: KengineSDKOpts;
    attributes: ResourceAttributes;
    constructor(options: KengineSDKOpts) {
        options.serverless = options.serverless || false;
        options.collectorUrl = options.collectorUrl || process.env.COLLECTOR_URL || "https://otel.khulnasoft.com/v1";
        options.kengineKey = options.kengineKey || process.env.KENGINE_API_KEY || process.env.KENGINE_KEY
 

        this.options = options;
    }

    start() {
        if (!this.options.kengineKey) {
            console.warn('KengineSDK: No Kengine API key provided. Traces will not be sent to Kengine.');
            return;
        }

        let collectorUrl = this.options.collectorUrl;


        const provider = new NodeTracerProvider({
            resource: detectResourcesSync({
                detectors: [awsEcsDetector, awsEc2Detector, awsLambdaDetector, new VercelDetector()],
            }),
            forceFlushTimeoutMillis: 500,
        });



        // If the kengine extension is running, we need to use the sandbox collector.
        if (existsSync('/opt/extensions/kengine')) {
            collectorUrl = 'http://sandbox:4323/otel';
        }

        const exporter = new OTLPTraceExporter({
            url: collectorUrl,
            headers: {
                "x-api-key": this.options.kengineKey || process.env.KENGINE_KEY || process.env.KENGINE_OTEL_KEY,
            },
        });

        const spanProcessor = this.options.serverless ? new SimpleSpanProcessor(exporter) : new BatchSpanProcessor(exporter, {
            maxQueueSize: 100,
            maxExportBatchSize: 5,
        });

        provider.addSpanProcessor(spanProcessor);
        provider.register();

        registerInstrumentations({
            instrumentations: [
                ...this.options.instrumentations || []
            ]
        });
        return provider;
    }
}
