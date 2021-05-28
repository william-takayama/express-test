// import { IndexController } from "./controller/index.controller";

import express from "express";

(async function bootstrap() {
  // const { appRoutes } = await require("./routes");
  const app = express();
  const PORT = 3000;
  // const HOST = "0.0.0.0";

  // app.get("/", IndexController.welcome);
  app.get("/", () => {
    res.send("Hello World");
  });
  app.listen(PORT, () => {
    console.log(`[server]: server is running at http://localhost:${PORT}`);
  });

  // const { loadRoutes } = await import('@beyounglabs/alfred');

  // await loadRoutes(app, appRoutes);
})();
