const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const authRouter = require("./controllers/auth");
const vasRouter = require("./controllers/logs");
const usersRouter = require("./controllers/users");

const connectToDB = require("./dbConnect");

app.get("/express_backend", (req, res) => {
  res.json({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

(async () => {
  const client = await connectToDB();
  app.use("/auth", authRouter({ client }));
  app.use("/vas", vasRouter({ client }));
  app.use("/users", usersRouter({ client }));

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
})();
