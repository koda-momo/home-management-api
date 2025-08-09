export interface InventoryItem {
  id: number;
  name: string;
  count: number;
  url: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
