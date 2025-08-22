import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin Panel API",
      version: "1.0.0",
      description: "API documentation for Admin Panel backend",
    },
    servers: [
      {
        url: "http://localhost:4000/api", // 👈 adjust based on your base path
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/modules/**/*.ts"], // 👈 points to your routes
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
