import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", taskRoutes);
app.get("/", (req, res) => res.send("Hello World"));

app.listen(5000, () => {
  console.log(`Hello world on http://127.0.0.1:5000`);
});
