const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi : "3.0.0",
        info: {
            title: "Todo API",
            version: "1.0.0",
            description: "Todo API Documentation"
        },
        components:{
            securitySchemes : {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;