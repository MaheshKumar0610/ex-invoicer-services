"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employees_services_1 = require("./employees.services");
const exceptionhandler_1 = require("../utils/exceptionhandler");
const EmployeesController = express_1.default.Router();
const service = new employees_services_1.EmployeesService();
EmployeesController.post('/create', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const body = request.body;
    const employees = await service.createEmployees(body);
    response.json(employees);
}));
EmployeesController.get('/list', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const employees = await service.getEmployeesAll();
    response.json(employees);
}));
EmployeesController.get('/any/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const employees = await service.getEmployeebyAny(id);
    response.json(employees);
}));
EmployeesController.get('/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const employees = await service.getEmployeesField(id.split('=')[0], id.split('=')[1]);
    response.json(employees);
}));
EmployeesController.put('/update/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    const employees = await service.updateEmployeeInfo(id, body);
    response.json(employees);
}));
EmployeesController.delete('/delete/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const employees = await service.deleteEmployeeRecord(id);
    response.json(employees);
}));
exports.default = EmployeesController;
