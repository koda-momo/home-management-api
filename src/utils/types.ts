export interface InventoryItem {
  id: number;
  name: string;
  count: number;
  url: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
