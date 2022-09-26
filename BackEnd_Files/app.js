const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const expressWinston = require("express-winston");
const { infoLogger } = require("./utils/logger");
const { errLogger } = require("./utils/logger");

module.exports = {
  app: app,
  jwt: jwt,
};

expressWinston.requestWhitelist.push("body"); //--------------------NOTE - remove after tests!!-----------------
app.use(
  expressWinston.logger({
    winstonInstance: infoLogger,
    statusLevels: true,
  })
);

app.use(
  expressWinston.logger({
    winstonInstance: errLogger,
    statusLevels: true,
  })
);

// config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static("./images"));

const usersRoutes = require("./api/routes/users");
const userConfigurationRoutes = require("./api/routes/userConfiguration");
const userPicturesRoutes = require("./api/routes/userPictures");
const authRoutes = require("./api/routes/auth");
const chatsRoutes = require("./api/routes/chats");
const messagesRoutes = require("./api/routes/messages");
const filtersRoutes = require("./api/routes/filters");
const notificationsRoutes = require("./api/routes/notifications");
const dataFromSetsToClientRoute = require("./api/routes/dataFromSetsToClient");
const friendRequestRoute = require("./api/routes/friendRequest");
const userLocation = require("./api/routes/userLocation");
const userStatus = require("./api/routes/userStatus");

app.use("/users", usersRoutes);
app.use("/userConfiguration", userConfigurationRoutes);
app.use("/userPictures", userPicturesRoutes);
app.use("/auth", authRoutes);
app.use("/chats", chatsRoutes);
app.use("/messages", messagesRoutes);
app.use("/filters", filtersRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/dataFromSetsToClient", dataFromSetsToClientRoute);
app.use("/friendRequest", friendRequestRoute);
app.use("/userLocation", userLocation);
app.use("/userStatus", userStatus);

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
