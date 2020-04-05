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
    },
    {
      name: "Events",
      description: "Endpoints for events"
    },
    {
      name: "Notifications",
      description: "Endpoints for notifications"
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
            name: "code",
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
            name: "refresh_token",
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
    "/v1/events/list": {
      post: {
        tags: [
          "Events"
        ],
        summary: "List events",
        description: "List events",
        operationId: "eventList",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/EventList"
            }
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        },
        security: [
          {
            api_key: []
          }
        ]
      },
    },
    "/v1/events/list/allpages": {
      post: {
        tags: [
          "Events"
        ],
        summary: "List all events",
        description: "List all events",
        operationId: "eventAllList",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/EventListAllPages"
            }
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        },
        security: [
          {
            api_key: []
          }
        ]
      },
    },
    "/v1/events/channel/new": {
      post: {
        tags: [
          "Notifications"
        ],
        summary: "Create Events Notifications Channel",
        description: "Create Events Notifications Channel",
        operationId: "channelNew",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/ChannelNew"
            }
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        },
        security: [
          {
            api_key: []
          }
        ]
      },
    },
    "/v1/channels/renew": {
      post: {
        tags: [
          "Notifications"
        ],
        summary: "Renew All Events Notifications Channels",
        description: "Renew All Events Notifications Channels",
        operationId: "renewAllEvents Notifications",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/ChannelRenew"
            }
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        },
        security: [
          {
            api_key: []
          }
        ]
      },
    },
    "/v1/events/channel/stop": {
      post: {
        tags: [
          "Notifications"
        ],
        summary: "Remove Events Notifications Channel",
        description: "Remove Events Notifications Channel",
        operationId: "removeEventsNotifications",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/ChannelRemove"
            }
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        },
        security: [
          {
            api_key: []
          }
        ]
      },
    },
    "/v1/token/cancel-sync": {
      post: {
        tags: [
          "Auth"
        ],
        summary: "Cancel Calendar Synchronization",
        description: "Cancel Calendar Synchronization",
        operationId: "cancelCalendarSynchronization",
        produces: [
          "application/json"
        ],
        parameters: [
          {
            in: "body",
            name: "body",
            required: false,
            schema: {
              $ref: "#/definitions/Empty"
            }
          }
        ],
        responses: {
          200: {
            description: "Success Response",
          },
          400: {
            description: "Error Response"
          }
        },
        security: [
          {
            api_key: []
          }
        ]
      },
    },
  },
  securityDefinitions: {
    api_key: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  definitions: {
    EventList: {
      type: "object",
      properties: {
        maxResults: {
          type: "integer",
          format: "int64"
        },
        timeMin: {
          type: "string",
          format: "date-time"
        },
        timeMax: {
          type: "string",
          format: "date-time"
        },
        singleEvents: {
          type: "boolean",
          default: false
        },
        nextPageToken: {
          type: "string"
        },
        nextSyncToken: {
          type: "string"
        }
      }
    },
    EventListAllPages: {
      type: "object",
      properties: {
        maxResults: {
          type: "integer",
          format: "int64"
        },
        timeMin: {
          type: "string",
          format: "date-time"
        },
        timeMax: {
          type: "string",
          format: "date-time"
        },
        singleEvents: {
          type: "boolean",
          default: false
        },
        nextSyncToken: {
          type: "string"
        }
      }
    },
    ChannelNew: {
      type: "object",
      properties: {
        expirationHours: {
          type: "integer",
          format: "int64"
        }
      }
    },
    ChannelRenew: {
      type: "object",
      properties: {
        expirationHours: {
          type: "integer",
          format: "int64"
        }
      }
    },
    ChannelRemove: {
      type: "object",
      properties: {
      }
    },
    Empty: {
      type: "object",
      properties: {
      }
    },
  }
};
