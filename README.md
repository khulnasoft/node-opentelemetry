# Node.js Kengine OpenTelemetry SDK
[![Documentation][docs_badge]][docs]
[![Latest Release][release_badge]][release]
[![License][license_badge]][license]

Instrument your Node.js applications with OpenTelemetry and send the traces to [Kengine](https://kengine.khulnasoft.com).

![](./traces.png)

  
## Getting Started 

Check out the [documentation](https://kengine.khulnasoft.com/docs/sending-data/opentelemetry/).

## Example

```javascript
import { KengineSDK } from '@khulnasoft/node-opentelemetry';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';


const sdk = new KengineSDK({
  instrumentations: [    
    getNodeAutoInstrumentations(),
  ],
});

sdk.start();
```

## Configuration

The KengineSDK class takes the following configuration options

| Field            | Type                    | Description                          |
| ---------------- | ----------------------- | ------------------------------------ |
| instrumentations | InstrumentationOption[] | An array of instrumentation options. |
| kengineKey      | string (optional)       | The Kengine key.                    |
| collectorUrl     | string (optional)       | The URL of the collector.            |
| service          | string (optional)       | The service name.                    |
| namespace        | string (optional)       | The namespace.                       |

## License

&copy; Kengine Limited, 2023

Distributed under MIT License (`The MIT License`).

See [LICENSE](LICENSE) for more information.

<!-- Badges -->

[docs]: https://kengine.khulnasoft.com/docs/
[docs_badge]: https://img.shields.io/badge/docs-reference-blue.svg?style=flat-square
[release]: https://github.com/khulnasoft/node-opentelemetry/releases/latest
[release_badge]: https://img.shields.io/github/release/khulnasoft/node-opentelemetry.svg?style=flat-square&ghcache=unused
[license]: https://opensource.org/licenses/MIT
[license_badge]: https://img.shields.io/github/license/khulnasoft/node-opentelemetry.svg?color=blue&style=flat-square&ghcache=unused
