export default {
  swagger: "2.0",
  info: {
    description: "Api con los acceso al calendario de google pero con Office365",
    version: "1.0.0",
    title: "IRIS API"
  },
 /* host: "petstore.swagger.io",
  basePath: "/v2",*/
  tags: [
    {
      name: "Auth",
      description: "Endpoints for auth"
    }
  ],
  schemes: [
    "http",
    "https"
  ],
  paths: {
    "/v1/auth-url": {
      get: {
        tags: [
          "Auth"
        ],
        summary: "Get authentication URL",
        description: "Get authentication URL",
        operationId: "authUrl",
        produces: [
          "application/json"
        ],
        parameters: [
        ],
        responses: {
          200: {
            description: "Success Response",
          }
        }
      }
    },
    "/v1/token": {
      get: {
        tags: [
          "Auth"
        ],
        summary: "Get user’s OAuth token from authorization code",
        description: "Get user’s OAuth token from authorization code",
        operationId: "token",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            name: "CODE",
            in: "query",
            required: true,
            type: "string"
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        }
      }
    },
    "/v1/token/refresh": {
      get: {
        tags: [
          "Auth"
        ],
        summary: "Refresh user’s OAuth token from refresh token",
        description: "Refresh user’s OAuth token from refresh token",
        operationId: "tokenRefresh",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            name: "REFRESH_TOKEN",
            in: "query",
            required: true,
            type: "string"
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        }
      }
    }
  },
  securityDefinitions: {
  },
  definitions: {
  }
};
