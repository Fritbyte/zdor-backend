import express, {Request, Response} from 'express';

const app = express();
const port = process.env.PORT || 3000;

import mysql from 'mysql2/promise'

async function connectDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'mysql',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'password',
            database: process.env.MYSQL_DATABASE || 'dev'
        });
        console.log('Connected to MySQL');
        await connection.end();
    } catch (error) {
        console.error('MySQL connection error:', error);
    }
}

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express with TypeScript!');
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await connectDB();
});