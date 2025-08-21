// DBデータ
export const mockDbArray = [
  {
    id: 1,
    name: 'テスト商品1',
    count: 5,
    url: 'https://example.com/1',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  },
  {
    id: 2,
    name: 'テスト商品2',
    count: 10,
    url: 'https://example.com/2',
    created_at: new Date('2023-01-02'),
    updated_at: new Date('2023-01-02'),
  },
];

export const mockDbData = mockDbArray[0];

export const mockUpdatedDbData = {
  ...mockDbData,
  count: 6,
};

// APIデータ
export const mockApiData = [
  {
    id: 1,
    name: 'テスト商品',
    count: 5,
    url: 'https://example.com',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  },
];

export const mockUpdatedApiData = {
  ...mockApiData[0],
  count: 6,
};
