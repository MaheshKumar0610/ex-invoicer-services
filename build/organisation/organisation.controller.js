"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organisation_service_1 = require("./organisation.service");
const exceptionhandler_1 = require("../utils/exceptionhandler");
const OrganisationController = express_1.default.Router();
const service = new organisation_service_1.OrganisationService();
OrganisationController.post('/create', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const body = request.body;
    const employees = await service.createOrganisation(body);
    response.json(employees);
}));
OrganisationController.get('/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const employees = await service.getOrganisationDetails(id);
    response.json(employees);
}));
OrganisationController.put('/update/:id', (0, exceptionhandler_1.ControllerHandler)(async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    const employees = await service.updateOrganisationInfo(id, body);
    response.json(employees);
}));
exports.default = OrganisationController;
