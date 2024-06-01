"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoOptions = void 0;
exports.mongoOptions = {
    // poolSize: 10,
    ssl: true,
    // sslValidate: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: false,
    migrations: [],
    logging: true,
    subscribers: [],
    entities: [],
    migrationsRun: false
};
