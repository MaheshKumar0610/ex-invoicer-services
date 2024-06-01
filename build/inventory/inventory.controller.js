"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventory_service_1 = require("./inventory.service");
const exceptionhandler_1 = require("../utils/exceptionhandler");
const InventoryController = express_1.default.Router();
const service = new inventory_service_1.InventoryService();
/** Inventory Controller */
InventoryController.post('/create', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const body = request.body;
    const inventory = await service.createInventory(body);
    response.json(inventory);
}));
InventoryController.get('/list', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const record = await service.getAllProductInventory();
    response.json(record);
}));
InventoryController.get('/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const record = await service.getInventorybyID(id);
    response.json(record);
}));
InventoryController.put('/update/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    const record = await service.updateInventory(id, body);
    response.json(record);
}));
InventoryController.delete('/product/delete', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    // const { id } = request.params
    const body = request.body;
    if (!Array.isArray(body) || body.length === 0) {
        return response.status(400).json({ error: 'Invalid request body. Please provide an array of SKU IDs.' });
    }
    const deletedCount = await service.deleteInventoryProduct(body);
    response.json({ deletedCount });
}));
/** SKU Controller */
InventoryController.post('/sku/create', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const body = request.body;
    const sku = await service.createStockUnits(body);
    response.json(sku);
}));
InventoryController.get('/sku/list', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const record = await service.getAllSKU();
    response.json(record);
}));
InventoryController.get('/sku/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const record = await service.getStockUnitbyID(id);
    response.json(record);
}));
InventoryController.put('/sku/update/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    const record = await service.updateStockUnits(id, body);
    response.json(record);
}));
InventoryController.delete('/sku/delete', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const body = request.body;
    if (!Array.isArray(body) || body.length === 0) {
        return response.status(400).json({ error: 'Invalid request body. Please provide an array of SKU IDs.' });
    }
    const deletedCount = await service.deleteSKU(body);
    response.json({ deletedCount });
}));
exports.default = InventoryController;
