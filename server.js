const express = require('express');
const cors =require('cors');
const path = require('path');
const expressSession = require('express-session');

const app = express();
const http = require('http').createServer(app);

const session = expressSession({
    secret: 'coding',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
app.use(express.json())
app.use(session)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const postRoutes = require('./api/post/post.routes')
const userRoutes = require('./api/user/user.routes')
const authRoutes = require('./api/auth/auth.routes')
const {connectSockets} = require('./services/socket.service')
// const reviewRoutes = require('./api/review/review.routes')

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/post',postRoutes);
connectSockets(http,session)

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
app.get('/**',(req,res) =>{
    res.sendFile(path.join(__dirname, 'public','index.html'));
})
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})