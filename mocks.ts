import { InventoryItem } from './types.js';

export const mockInventoryData: InventoryItem[] = [
  {
    id: 1,
    name: 'ティッシュペーパー',
    count: 5,
    url: 'https://example.com/tissue',
  },
  { id: 2, name: '洗剤', count: 3, url: 'https://example.com/detergent' },
  { id: 3, name: 'シャンプー', count: 2, url: 'https://example.com/shampoo' },
  { id: 4, name: '米', count: 10, url: 'https://example.com/rice' },
  { id: 5, name: '醤油', count: 1, url: 'https://example.com/soysauce' },
];
