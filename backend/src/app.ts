import express from "express";
import cors from "cors";

//app
const app = express();

//use
app.use(express.json());
app.use(cors);

export default app;
