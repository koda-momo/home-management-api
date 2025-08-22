// stockModel用モックデータ
export const mockStockList = [
  {
    id: 1,
    name: '商品1',
    count: 10,
    url: 'https://example.com/1',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: '商品2',
    count: 5,
    url: 'https://example.com/2',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const mockStockData = {
  id: 1,
  name: '商品1',
  count: 10,
  url: 'https://example.com/1',
  created_at: new Date(),
  updated_at: new Date(),
};

export const mockStockUpdateData = {
  id: 1,
  name: '商品1',
  count: 15,
  url: 'https://example.com/1',
  created_at: new Date(),
  updated_at: new Date(),
};
