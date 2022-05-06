const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

module.exports = {
	app: app,
	jwt: jwt,
};

// config
app.use(bodyParser.json());

app.use("/images", express.static("./images"));

//routes
const usersRoutes = require("./api/routes/users");
const userConfigurationRoutes = require("./api/routes/userConfiguration");
const userPicturesRoutes = require("./api/routes/userPictures");
const authRoutes = require("./api/routes/auth");

const chatsRoutes = require("./api/routes/chats");
const filtersRoutes = require("./api/routes/filters");
const connectionsRoutes = require("./api/routes/connections");
const notificationsRoutes = require("./api/routes/notifications");
const dataFromSetsToClientRoute = require("./api/routes/dataFromSetsToClient");

app.use("/users", usersRoutes);
app.use("/userConfiguration", userConfigurationRoutes);
app.use("/userPictures", userPicturesRoutes);
app.use("/auth", authRoutes);

app.use("/chats", chatsRoutes);
app.use("/filters", filtersRoutes);
app.use("/connections", connectionsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/dataFromSetsToClient", dataFromSetsToClientRoute);
