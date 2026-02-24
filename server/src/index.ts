import app from "./app";
import datasource from "./datasource";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function startApp() {
  console.log(`⏳ starting server`);

  try {
    await datasource.initialize();
    console.log(`✅ connected to Sqlite db`);

    const server = app.listen(port, () => {
      console.log(`🚀 server started on port ${port}`);
    });

    server.on("error", (err) => {
      console.error(`🚨 unable to start server on port ${port}`, err);
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error(`🚨 unable to connect to db: ${message}`);
  }
}

startApp();
