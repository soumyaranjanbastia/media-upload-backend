// index.js
import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";

const app = express();
const PORT = 3005;

// Middleware
// app.use(json());
// app.use(cors());
app.use(express.json({ limit: "50mb" })); // Set the limit based on your requirements
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need to handle cookies or authentication headers
  })
);
app.use("/v1", postRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
