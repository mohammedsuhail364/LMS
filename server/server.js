require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./routes/auth-routes");
const mediaRoutes = require("./routes/instructor-routes/mediaRoutes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/courseRoutes");
const getStudentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const __dirname = path.resolve();

/* ✅ Use proper cors config */
const corsOptions = {
  origin: process.env.CLIENT_URL, // allow your Vercel frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

/* ✅ Parse JSON */
app.use(express.json());

/* ✅ Error handling */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

/* ✅ Database connection */
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((e) => console.error(e));

/* ✅ Routes */
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", getStudentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientPath));

  // SPA fallback (THIS is the key)
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

/* ✅ Start server */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
