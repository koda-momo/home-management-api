export interface ErrorResponse extends Error {
  statusCode: number;
}

export interface GasUsageData {
  amount: string;
}
