// DBデータ
export const mockDbArray = [
  {
    id: 1,
    name: 'テスト商品1',
    count: 5,
    url: 'https://example.com/1',
    created_at: new Date('2023-01-01T00:00:00+09:00'),
    updated_at: new Date('2023-01-01T00:00:00+09:00'),
  },
  {
    id: 2,
    name: 'テスト商品2',
    count: 10,
    url: 'https://example.com/2',
    created_at: new Date('2023-01-02T00:00:00+09:00'),
    updated_at: new Date('2023-01-02T00:00:00+09:00'),
  },
];

export const mockDbData = mockDbArray[0];

export const mockUpdatedDbData = {
  ...mockDbData,
  count: 6,
};

// APIデータ
export const mockApiData = {
  id: 1,
  name: 'テスト商品1',
  count: 5,
  url: 'https://example.com/1',
  createdAt: new Date('2023-01-01T00:00:00+09:00'),
  updatedAt: new Date('2023-01-01T00:00:00+09:00'),
};

export const mockUpdatedApiData = {
  ...mockApiData,
  count: 6,
};
