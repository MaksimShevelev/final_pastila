import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose"; 
import cors from "cors";

import routerAPI from "./routes/index.js"; 

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const port = process.env.PORT || 3000;
const dburi = process.env.MONGODB_URI;

mongoose.connect(dburi, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error({ error });
});

db.once("open", () => {
  console.log("Connection con la DB Correcta");
});

routerAPI(app);

app.listen(port, () => {
  console.log(chalk.green(`Servidor Web en el puerto ${port}`));
});
