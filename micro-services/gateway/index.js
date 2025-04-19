require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Microservice configuration
const SERVICES = {
  user: {
    target: "http://localhost:5001",
    endpoints: ["/api/users", "/api/auth"],
  },
  order: {
    target: "http://localhost:5002",
    endpoints: ["/api/orders"],
  },
  supplier: {
    target: "http://13.50.231.80:5003",
    endpoints: ["/api/suppliers"],
  },
  inventory: {
    target: "http://localhost:5004",
    endpoints: ["/api/inventory"],
  },
  points: {
    target: "http://localhost:5005",
    endpoints: ["/api/points"],
  },
};

// Create Express app
const app = express();
const port = 5010;

// Middleware - ORDER MATTERS!
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(bodyParser.json()); // Explicit body parser for JSON
app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded bodies

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Set up proxy for each service
Object.entries(SERVICES).forEach(([serviceName, config]) => {
  config.endpoints.forEach((endpoint) => {
    app.use(
      endpoint,
      createProxyMiddleware({
        target: config.target,
        changeOrigin: true,
        pathRewrite: {
          [`^${endpoint}`]: "",
        },
        on: {
          proxyReq: (proxyReq, req, res) => {
            console.log(
              `Proxying ${req.method} request to ${serviceName} service: ${req.path}`
            );

            // Special handling for POST/PUT requests
            if (["POST", "PUT", "PATCH"].includes(req.method)) {
              if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader("Content-Type", "application/json");
                proxyReq.setHeader(
                  "Content-Length",
                  Buffer.byteLength(bodyData)
                );
                proxyReq.write(bodyData);
              }
            }
          },
          error: (err, req, res) => {
            console.error(`Proxy error for ${serviceName} service:`, err);
            res
              .status(502)
              .json({ error: `Bad Gateway to ${serviceName} service` });
          },
        },
      })
    );
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(port, () => {
  console.log(`Gateway service running on port ${port}`);
  console.log("Available routes:");
  Object.entries(SERVICES).forEach(([serviceName, config]) => {
    config.endpoints.forEach((endpoint) => {
      console.log(
        `- ${endpoint}* -> ${serviceName} service (${config.target})`
      );
    });
  });
});
