require('dotenv').config();
import express from "express";
import cors from 'cors'

import mongoose, { mongo } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI)

export const db = mongoose.connection;
db.on('error', console.error.bind(console,"Mongo db connection error"))
db.once("open",()=>{
    console.log("MongoDB connected");
    
});


const app: express.Application = express();
const port = process.env.PORT || 80;
app.use(cors)
app.use(express.json());
app.use('/api', router)
app.listen(port,()=>{
    console.log(`server listening at port: ${port}`);
    
})
