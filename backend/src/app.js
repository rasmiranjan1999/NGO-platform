import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import memberRoutes from "./routes/member.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import newsRoutes from "./routes/news.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import teamRoutes from "./routes/team.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// CORS Configuration - Allow production domain
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://bkss.mrrs.in',
    'https://bkss.mrrs.in'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Upload Folder
app.use("/uploads", express.static("uploads"));

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BKSS Backend Running",
    version: "1.0.0",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/admins", adminRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;