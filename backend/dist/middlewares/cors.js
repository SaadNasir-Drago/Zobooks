"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 204,
    methods: 'GET, POST, PUT, DELETE',
    credentials: true // Allows cookies to be sent
};
