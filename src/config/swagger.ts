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
    components: {
      schemas: {
        Availability: {
          type: "object",
          properties: {
            days: {
              type: "object",
              properties: {
                monday: { type: "boolean" },
                tuesday: { type: "boolean" },
                wednesday: { type: "boolean" },
                thursday: { type: "boolean" },
                friday: { type: "boolean" },
                saturday: { type: "boolean" },
                sunday: { type: "boolean" },
              },
              additionalProperties: false,
            },
            time: {
              type: "array",
              items: {
                type: "string",
                enum: ["morning", "afternoon", "evening", "night"],
              },
            },
          },
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:4000/api", // 👈 adjust based on your base path
        description: "Local server",
      },
      {
        url: "https://admin-panel-auwc.onrender.com/api/",
        description: "Production server",
      }
    ],
  },
  apis: ["./src/routes/*.ts", "./src/modules/**/*.ts"], // 👈 points to your routes
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
