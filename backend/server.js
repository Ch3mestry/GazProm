const express = require("express");
const cors = require("cors");

const server = express();
const port = 23456;

// ✅ ВАЖНО: подключаем CORS до всех маршрутов
server.use(cors());
server.use(express.json());

process.env.BASEDIR = process.cwd();
server.use("/api", require("./routes"));

server.listen(port, () => {
  console.log(`✅ Server listening at http://127.0.0.1:${port}`);
});
