import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { protectRoute } from "./middleware/auth.middleware";
import documentRoute from "./routes/document.route";
import roomRoute from "./routes/room.route";
import shareRoute from "./routes/share.route";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use((req, _res, next) => {
  console.log("Incoming cookies:", req.cookies);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000", // dev
      "https://flowdraw.shivamte.me", // prod
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  console.log(req.user);

  res.json("hi there");
});

app.use("/api/documents", protectRoute, documentRoute);
app.use("/api/room", protectRoute, roomRoute);
app.use("/api/share", shareRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`http-server running on port ${PORT}`);
});
