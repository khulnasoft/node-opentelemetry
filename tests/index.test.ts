import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { getLocal, completionCheckers, MockedEndpoint, CompletedRequest } from 'mockttp';
import { KengineSDK } from "../src/index";
import { trace } from "@opentelemetry/api"
import { getSpans, waitForCollector } from './utils/otel';

describe("Test KengineSDK for opentelemetry", async () => {

    const mockServer = getLocal();
    beforeEach(() => mockServer.start())
    afterEach(() => mockServer.stop())


    it("Traces are recieved", async () => {
        const collector = await mockServer.forAnyRequest().once().thenReply(200, "Ok");
        const kengineKey = "love is magic"
        const sdk = new KengineSDK({
            collectorUrl: mockServer.url,
            serverless: true,
            kengineKey: kengineKey,
        })

        sdk.start();

        // Create a span

        const span = trace.getTracer("test").startSpan("test");


        span.end();


        const [request] = await waitForCollector(collector)

        expect(request.headers["x-api-key"]).toBe(kengineKey);
    })
});
