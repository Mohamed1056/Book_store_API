import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.js';
import connection from './conn/conn.js';
import bookRouter from './routes/book.js';
import favouriteRouter from './routes/favourite.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/order.js';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

connection(); // Call the connection function

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); 

// Logging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

app.use('/api/v1', userRouter);
app.use('/api/v1', bookRouter);
app.use('/api/v1', favouriteRouter);
app.use('/api/v1', cartRouter);
app.use('/api/v1', orderRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
