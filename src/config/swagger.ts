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
        ,
        Plan: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "integer", description: "price in cents" },
            interval: { type: "string", enum: ["MONTHLY", "YEARLY"] },
            features: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        PlanCreate: {
          type: "object",
          required: ["name", "price", "interval"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "integer" },
            interval: { type: "string", enum: ["MONTHLY", "YEARLY"] },
            features: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] }
          }
        },
        PlanUpdate: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "integer" },
            interval: { type: "string", enum: ["MONTHLY", "YEARLY"] },
            features: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] }
          }
        },
        Bank: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            accountName: { type: "string" },
            accountNo: { type: "string" },
            type: { type: "string", enum: ["BANK", "WALLET"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        BankCreate: {
          type: "object",
          required: ["name", "accountName", "accountNo", "type"],
          properties: {
            name: { type: "string" },
            accountName: { type: "string" },
            accountNo: { type: "string" },
            type: { type: "string", enum: ["BANK", "WALLET"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] }
          }
        },
        BankUpdate: {
          type: "object",
          properties: {
            name: { type: "string" },
            accountName: { type: "string" },
            accountNo: { type: "string" },
            type: { type: "string", enum: ["BANK", "WALLET"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] }
          }
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
