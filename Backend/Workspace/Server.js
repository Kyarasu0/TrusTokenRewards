import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from "url";

// ====== __dirname を復元 ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== dotenv ======
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ====== Routes directory ======
const routesDir = path.join(__dirname, "Routes");

const app = express();

// ========== 初期設定 ==========
const PORT = process.env.PORT || 5000;

// ========== use系 ==========
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "..", "Frontend", "dist")));
app.use("/Icons", express.static(path.join(__dirname, "Icons")));

// ========== Routes ==========
const files = fs.readdirSync(routesDir);

for (const file of files) {

    // jsファイルだけ対象
    if (!file.endsWith(".js")) continue;

    // APIエンドポイント
    const routeName = path.basename(file, ".js");
    const routePath = `/${routeName}`;

    // ESM import
    const routeModule = await import(path.join(routesDir, file));
    const route = routeModule.default || routeModule;

    app.use(routePath, route);

    console.log(`Route mounted: ${routePath}`);
}

// ========== listen ==========
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});