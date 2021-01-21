const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv").config({ path: "./config.env" });

//Checking for uncaughtexception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!  Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();
//middleware
app.use(express.urlencoded({ extended: true }));

//Server port
const port = process.env.PORT || 5000;

app.get("/api/rates", (req, res) => {
  //Destructured base and currency from query paramters
  const { base, currency } = req.query;

  //Checking if there is no base or no currency
  if (base === undefined || currency === undefined) {
    res.status(400).json({
      nobaseorcurrency: "Please provide a base and a currency",
    });
  }
  //url
  const url = process.env.URL;
  axios
    .get(`${url}base=${base}&symbols=${currency}`)
    .then((response) => {
      res.status(200).json({ results: response.data });
    })
    .catch((error) => {
      res.status(404).json({
        notfound: `The requested base ${base} or currency(ies) ${currency} was not found, please try another one`,
      });
    });
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    urlnotfound: `Hello!!! ${req.originalUrl} was not found on this server, please add /base(add a base)/currency(add a curency)`,
  });
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
//For any unhandled rejection, server closes gracefully
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//This for heroku, when it wants the deno to sleep, to avoid sudden shutdown of server
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Server shutting down!");

  server.close(() => {
    console.log("Process terminated!");
  });
});
