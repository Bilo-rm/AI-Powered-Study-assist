const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const nlpRoutes = require('./routes/nlpRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/nlp', nlpRoutes);

app.use(errorHandler);
module.exports = app;