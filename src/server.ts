/* eslint-disable no-console */
import { app } from './app';
import { testPrismaConnection } from './config/prisma';

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
