import type { OpenAPIV3 } from "openapi-types";

export const openApiSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Tasks REST API",
    version: "1.0.0",
    description: "Production-quality task management API",
  },
  paths: {
    "/tasks": {
      get: {
        summary: "List all tasks",
        tags: ["Tasks"],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10, maximum: 100 },
          },
          {
            name: "completed",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
          },
        ],
        responses: {
          "200": { description: "Paginated list of tasks" },
        },
      },
      post: {
        summary: "Create a task",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTask" },
            },
          },
        },
        responses: {
          "201": { description: "Task created" },
          "400": { description: "Validation error" },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateTask: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 1, maxLength: 200 },
          completed: { type: "boolean", default: false },
        },
      },
    },
  },
};
