import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ErrorMiddleware from "./middleware/Error.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: 200,
    success: true,
    message: "Welcome to the Message Hub",
  });
});

app.use("/api", routes);

app.use(ErrorMiddleware);


export default app;
