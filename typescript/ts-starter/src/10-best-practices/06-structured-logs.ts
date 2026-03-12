// Structured logs: Build a small flow with two functions and pass an operationId through them. 
// Add pino logs at each stage, ensuring every log line contains the same operationId for correlation.

import pino from "pino";
const logger = pino();

function processPayment(operationId: string, amount: number) {
  logger.info({ operationId, amount }, "Processing payment");
}

function checkout(operationId: string) {
  logger.info({ operationId }, "Starting checkout flow");
  processPayment(operationId, 100);
}

const reqId = "req-999";
checkout(reqId);
