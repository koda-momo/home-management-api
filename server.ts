import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

interface InventoryItem {
  id: number;
  name: string;
  count: number;
  url: string;
}

const mockInventoryData: InventoryItem[] = [
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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.get('/api/v1/item', (req: Request, res: Response) => {
  const { id, name } = req.query;

  let filteredData = mockInventoryData;

  if (id) {
    const itemId = parseInt(id as string);
    if (isNaN(itemId)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid id parameter',
        data: [],
      });
    }
    filteredData = mockInventoryData.filter((item) => item.id === itemId);
  } else if (name) {
    const itemName = name as string;
    filteredData = mockInventoryData.filter((item) =>
      item.name.toLowerCase().includes(itemName.toLowerCase())
    );
  }

  res.json({
    status: 200,
    message: 'Success',
    data: filteredData,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
