const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const db = require("../db");

router.get("/db-structure/interfaces", (req, res) => {
  const sql = `
    SELECT p.name as column_name, p.type as data_type
    FROM pragma_table_info('interfaces') p
  `;

  db(sql)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.get("/", (req, res) => {
  res.json({
    message: "API is working!",
    availableEndpoints: ["/api/groups", "/api/metrics"],
  });
});

router.get("/groups", (req, res) => {
  let sql = fs
    .readFileSync(path.resolve(process.env.BASEDIR, "sql/groups.sql"))
    .toString();

  db(sql)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

router.get("/metrics", (req, res) => {
  let sql = fs
    .readFileSync(path.resolve(process.env.BASEDIR, "sql/metrics.sql"))
    .toString();
  db(sql)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

router.get("/nodes", (req, res) => {
  const sql = fs
    .readFileSync(path.resolve(process.env.BASEDIR, "sql/nodes.sql"))
    .toString();

  db(sql)
    .then((data) => {
      const processed = data.map((node) => {
        const safeParse = (jsonString, defaultValue = []) => {
          try {
            return jsonString ? JSON.parse(jsonString) : defaultValue;
          } catch {
            return defaultValue;
          }
        };

        const metrics = safeParse(node.metrics);
        const lastMetric = metrics[metrics.length - 1] || null;

        return {
          id: node.id,
          name: node.name,
          status: {
            color: node.status_color || "#cccccc",
            description: node.status_description || "Unknown status",
          },
          groups: safeParse(node.groups),
          applications: safeParse(node.applications),
          interfaces: safeParse(node.interfaces).filter((i) => i.id !== null), // Фильтрация null интерфейсов
          admin: node.admin ? safeParse(node.admin, null) : null,
          metrics: metrics,
          last_metrics: lastMetric
            ? {
                datetime: lastMetric.datetime,
                cpu: lastMetric.cpu,
                memory: lastMetric.memory,
                disk: lastMetric.disk,
              }
            : null,
        };
      });

      res.json(processed);
    })
    .catch((err) => {
      console.error("SQL Error:", err);
      res.status(500).json({
        error: "Database error",
        details: err.message,
        hint: "Please check the database structure and SQL query syntax",
      });
    });
});

module.exports = router;
