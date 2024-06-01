"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billing_service_1 = require("./billing.service");
const exceptionhandler_1 = require("../utils/exceptionhandler");
const BillingController = express_1.default.Router();
const service = new billing_service_1.BillingService;
BillingController.post('/create', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const body = request.body;
    const record = await service.createInvoice(body);
    response.json(record);
}));
BillingController.get('/list', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const record = await service.getAllInvoices();
    response.json(record);
}));
BillingController.get('/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const record = await service.getInvoiceById(id);
    response.json(record);
}));
BillingController.put('/update/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    const record = await service.updateInvoiceStatus(id, body.status);
    response.json(record);
}));
exports.default = BillingController;
