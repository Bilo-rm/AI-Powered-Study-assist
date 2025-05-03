const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
//const fileRoutes = require("./routes/fileRoutes");
//const nlpRoutes = require('./routes/nlpRoutes');
const errorHandler = require('./middleware/errorHandler');
const aiRoutes = require("./routes/aiRoutes");
const userRoutes = require("./routes/usersRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user",userRoutes);
//app.use('/api/files', fileRoutes);
//pp.use('/api/nlp', nlpRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);
module.exports = app;