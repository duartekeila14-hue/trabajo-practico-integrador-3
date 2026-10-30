import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { startDB } from "./src/config/db.js";
import { Router } from "./src/routes/category.routes.js";
import { Router } from "./src/routes/event.routes.js";
import { Router } from "./src/routes/user.routes.js";
import { Router } from "./src/routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3003;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//rutas
app.use("/api", userRouter);
app.use("/api", taskRouter);
app.use("/api", roleRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor listo en el puerto ${PORT}`);
});