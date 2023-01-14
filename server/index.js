const express = require("express");
// const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// app.use(express.static(path.resolve(__dirname, "../client/build")));
// All other GET requests not handled before will return our React app

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

app.get("/express_backend", (req, res) => {
  res.json({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
