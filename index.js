import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mediaRoutes from "./routes/mediaRoutes.js";

const app = express();

// Enable CORS for http://localhost:3001
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need to handle cookies or authentication headers
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use your routes
app.use("/", mediaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
