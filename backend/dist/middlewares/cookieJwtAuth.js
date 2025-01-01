"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieJwtAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const cookieJwtAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        if (decodedToken && decodedToken.user_id) {
            req.body.user_id = parseInt(decodedToken.user_id, 10);
        }
        next();
    }
    catch (error) {
        res.clearCookie("token");
        return res.status(403).send("Token expired or invalid.");
    }
};
exports.cookieJwtAuth = cookieJwtAuth;
