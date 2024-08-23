const cookieParser = require("cookie-parser");
const app = require("./app");

app.use(cookieParser());
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
dotenv.config({ path: "server/config/config.env" });

connectDatabase();
app.listen(4000, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
