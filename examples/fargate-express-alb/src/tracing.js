const { KengineSDK } = require('@khulnasoft/node-opentelemetry');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');


const sdk = new KengineSDK({
  instrumentations: [    
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook(request) {
          if(request.headers['user-agent']?.includes('HealthChecker')) {
            return true
          }
          return false
        }
      }
    }),
  ],
});

sdk.start();