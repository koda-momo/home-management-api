import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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

  if ((id || name) && filteredData.length === 0) {
    return res.status(404).json({
      status: 404,
      message: 'Item not found',
      data: [],
    });
  }

  res.json({
    status: 200,
    message: 'Success',
    data: filteredData,
  });
});

app.post('/api/v1/item/count/add', (req: Request, res: Response) => {
  const { id, count } = req.body;

  if (!id || count === undefined || count === null) {
    return res.status(400).json({
      status: 400,
      message: 'id and count are required',
      data: null,
    });
  }

  if (typeof id !== 'number' || typeof count !== 'number') {
    return res.status(400).json({
      status: 400,
      message: 'id and count must be numbers',
      data: null,
    });
  }

  if (count <= 0) {
    return res.status(400).json({
      status: 400,
      message: 'count must be positive',
      data: null,
    });
  }

  const item = mockInventoryData.find((item) => item.id === id);
  if (!item) {
    return res.status(404).json({
      status: 404,
      message: 'Item not found',
      data: null,
    });
  }

  const newCount = item.count + count;
  if (newCount >= 21) {
    return res.status(400).json({
      status: 400,
      message: 'Cannot add count: total would exceed limit of 20',
      data: null,
    });
  }

  res.json({
    status: 200,
    message: 'Count added successfully',
    data: {
      id: item.id,
      name: item.name,
      count: newCount,
      url: item.url,
    },
  });
});

app.post('/api/v1/item/count/delete', (req: Request, res: Response) => {
  const { id, count } = req.body;

  if (!id || count === undefined || count === null) {
    return res.status(400).json({
      status: 400,
      message: 'id and count are required',
      data: null,
    });
  }

  if (typeof id !== 'number' || typeof count !== 'number') {
    return res.status(400).json({
      status: 400,
      message: 'id and count must be numbers',
      data: null,
    });
  }

  if (count <= 0) {
    return res.status(400).json({
      status: 400,
      message: 'count must be positive',
      data: null,
    });
  }

  const item = mockInventoryData.find((item) => item.id === id);
  if (!item) {
    return res.status(404).json({
      status: 404,
      message: 'Item not found',
      data: null,
    });
  }

  const newCount = item.count - count;
  if (newCount < 0) {
    return res.status(400).json({
      status: 400,
      message: 'Cannot delete count: result would be negative',
      data: null,
    });
  }

  res.json({
    status: 200,
    message: 'Count deleted successfully',
    data: {
      id: item.id,
      name: item.name,
      count: newCount,
      url: item.url,
    },
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
