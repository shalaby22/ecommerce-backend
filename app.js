//installing express
const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();



// connecting with database
const connectToDB = require("./config/db.js")
connectToDB();

//security
const cors = require("cors");
const helmet = require("helmet");
app.use(helmet());
app.use(cors());


//Logging & Monitoring
const morgan = require("morgan")
const logger = require("./config/logger.js")
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));


const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const productsRoute = require("./routes/products");
const categoriesRoute = require("./routes/categories.js");
const cartRoute = require("./routes/cart.js");
const ordersRoute = require("./routes/orders.js");


app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", ordersRoute);

const { notFound, errHandler } = require("./middlewares/errors");
app.use(notFound);
app.use(errHandler);

// app execution
app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
  );
});
