import { config } from "dotenv";
config({ path: './config/config.env' })
import { initiateApp } from "./src/utils/initiateApp.js";
import express from 'express'
const app = express()

initiateApp(app, express)