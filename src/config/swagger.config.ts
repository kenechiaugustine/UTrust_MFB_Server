import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'UTrust Banking App API',
    version: '1.0.0',
    description:
      'API documentation for the banking application. It allows users to manage accounts, perform transactions, and more.',
    contact: {
      name: 'API Support',
      url: 'http://www.example.com/support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 4001}/api/v1`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      // If you use JWT tokens, you can define it here
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  // If you use security schemes, you can apply them globally
  // security: [
  //   {
  //     bearerAuth: [],
  //   },
  // ],
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  // Path to the API docs. The JSDoc comments are in these files.
  // Make sure to adjust the path to where your route files are.
  apis: ['./src/routes/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);