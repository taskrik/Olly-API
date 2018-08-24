import "reflect-metadata";
import { Action, BadRequestError, useKoaServer } from "routing-controllers";
import setupDb from "./db";
import * as Koa from "koa";
import { verify } from "./jwt";
import UserController from "./users/controller";
import LoginController from "./logins/controller";
import WeeklyUpdateController from "./weeklyUpdates/controller";
import SlackbotController from "./slackbot/controller";
import CompanyController from "./companies/controller";
import { bot } from './slackbot/bot'
require('dotenv').config()

const app = new Koa();
const port = process.env.PORT || 4000;
let time = `${new Date().getHours()}:${new Date().getMinutes()}`;

useKoaServer(app, {
  cors: true,
  controllers: [
    UserController,
    LoginController,
    WeeklyUpdateController,
    CompanyController,
	SlackbotController
  ],
  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");
      try {
        return !!(token && verify(token));
      } catch (e) {
        throw new BadRequestError(e);
      }
    }
    return false;
  }
});

setupDb()
  .then(_ => {
    app.listen(port);
    console.log(`Listening on port ${port}  @ ${time}`);
    bot
  })
  .catch(err => console.error(err));


