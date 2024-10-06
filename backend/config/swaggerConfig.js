const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student-Activities-API-Docs',
            version: '1.0.0',
            description: '',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    // The is not the original path. The path is from node_modules package
    apis: ['./api/route/**.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;