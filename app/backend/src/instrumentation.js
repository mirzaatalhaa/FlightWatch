import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';

import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

import {
  BatchLogRecordProcessor
} from '@opentelemetry/sdk-logs';

import { logs } from '@opentelemetry/api-logs';


// -------------------------
// Traces
// -------------------------

const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-collector:4317'
});


// -------------------------
// Metrics
// -------------------------

const metricExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4317'
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000
});


// -------------------------
// Logs
// -------------------------

const logExporter = new OTLPLogExporter({
  url: 'http://otel-collector:4317'
});

const logProcessor = new BatchLogRecordProcessor({
  exporter: logExporter
});

const sdk = new NodeSDK({
  traceExporter,

  metricReader,
  
  logRecordProcessors: [logProcessor],

  instrumentations: [
    getNodeAutoInstrumentations()
  ]
});

sdk.start();

const logger = logs.getLogger('flightwatch');


// -------------------------
// Test application log
// -------------------------

logger.emit({
  severityText: 'INFO',
  body: 'FlightWatch OpenTelemetry logging initialized'
});

console.log('✓ OpenTelemetry initialized');