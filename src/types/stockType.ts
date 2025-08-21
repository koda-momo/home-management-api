interface StockData {
  id: number;
  name: string;
  count: number;
  url: string;
}

export interface StockDbData extends StockData {
  created_at: Date;
  updated_at: Date;
}

export interface StockApiData extends StockData {
  createdAt: Date;
  updatedAt: Date;
}
