const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// API
app.post("/api/criar-pix", require("./api/criar-pix"));
app.get("/api/status", require("./api/status"));

// Front-end
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
