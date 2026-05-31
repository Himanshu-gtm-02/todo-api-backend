process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION");
    console.log(err);

    process.exit(1);
})



require('dotenv').config();//this must load first so we have put it here

const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

app.use(helmet());


app.use(express.json({
    limit: "10kb"
}));

app.use(express.urlencoded({
    extended : true,
    limit: "10kb"
}))

app.use(cookieParser());

app.use(cors({
    origin : 'https://localhost:5173',
    credentials : true
}));


const loggermiddleware = require('./middlewares/loggerMiddleware')
const router = require('./routes/noteRoutes');
const connectDB = require('./config/db')
const { notFound, errorMiddleware } = require('./middlewares/errorMiddleware')
const Router = require('./routes/authRoutes');


app.use(loggermiddleware);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Todo API is running"
    });
});
app.use('/api', router);
app.use('/api/auth',Router);

app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorMiddleware);



connectDB();
//add new note



//get particular note


//update particular note


//Delete any note

const server = app.listen(PORT, () => {
    logger.info(`server is running on PORT ${PORT}`);
})


//unhandledrejection adding here

process.on("unhandledRejection",(err) => {
    console.error("UNHANDLED REJECTION");
    console.error(err);

    server.close(() => {
        process.exit(1);
    })
})

