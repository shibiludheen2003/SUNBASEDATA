import express from 'express';
import bodyParser  from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import Routes from './routers/Routes.js'
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* MONGOOSE */
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        console.log('Database is connected');
    } catch (err) {
        console.error(`Database connection error: ${err.message}`);
    }
};

/* ROUTES */
app.use('/',Routes)

/* Connect to the database when the application starts */
connectToDatabase();


/* Start the server */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
