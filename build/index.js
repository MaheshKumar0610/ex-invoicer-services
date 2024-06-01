"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const employees_controller_1 = __importDefault(require("./employees/employees.controller"));
const inventory_controller_1 = __importDefault(require("./inventory/inventory.controller"));
const organisation_controller_1 = __importDefault(require("./organisation/organisation.controller"));
const billing_controller_1 = __importDefault(require("./billing/billing.controller"));
// import { connectDB } from "./utils/database"
const app = (0, express_1.default)();
const handler = (0, serverless_http_1.default)(app);
app.use(express_1.default.json());
app.use('/v1/employees', employees_controller_1.default);
app.use('/v1/inventory', inventory_controller_1.default);
app.use('/v1/billing', billing_controller_1.default);
app.use('/v1/organisation', organisation_controller_1.default);
exports.handler = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLooop = false;
        // const dbConnection = await connectDB();
        const result = await handler(event, context);
        return {
            statusCode: result.statusCode,
            body: result.body
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Internal Server Error - ${error}` })
        };
    }
};
// app.listen(3000, () => {
//     console.log("Server Started")
// })
