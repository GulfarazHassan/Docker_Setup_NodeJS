const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');
let RedisStore = require('connect-redis')(session);
const { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`,
    legacyMode: true,
});

redisClient.connect()
    .then(() => {
        console.log('redis connected')
    })
    .catch(e => console.log("error redis : ", e))

const app = express();
app.use(express.json());
app.use(cors())
const port = process.env.PORT || 3000;

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const retryConnect = () => {
    mongoose.connect(mongoURL, { useNewUrlParser: true })
        .then(() => console.log("Successfully connected"))
        .catch(e => {
            console.log("error :: ", e);
            setTimeout(retryConnect, 5000);
        })
}

retryConnect();
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}));
app.set('trust proxy')
app.get("/api/v1", (req, res) => {
    console.log('yah it ran')
    res.send(`<h2>Hello12 321 ${process.env.NODE_ENV}</h2>`)
})

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
    console.log(`listing on port ${port}`)
})