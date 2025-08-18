import { app } from './app.js';
import { testPrismaConnection } from './config/prisma.js';

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  try {
    await testPrismaConnection();
  } catch (error) {
    console.error(
      'Failed to connect to database. Server will continue without database connection.',
      error
    );
  }
});
