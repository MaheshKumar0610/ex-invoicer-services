"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employees = void 0;
// src/entities/User.ts
const typeorm_1 = require("typeorm");
let Employees = class Employees {
    username;
    firstname;
    lastname;
    dateOfBirth;
    emailAddress;
    primaryContactNumber;
    secondaryContactNumber;
    address;
    qualification;
    employmentStatus;
    salary;
    skillset;
    emergencyContact;
    emergencyAddress;
    emergencyRelationship;
    createdAt;
    updatedAt;
};
exports.Employees = Employees;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employees.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employees.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employees.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Employees.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employees.prototype, "emailAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employees.prototype, "primaryContactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employees.prototype, "secondaryContactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Employees.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employees.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employees.prototype, "employmentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employees.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ array: true }),
    __metadata("design:type", Array)
], Employees.prototype, "skillset", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employees.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Employees.prototype, "emergencyAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employees.prototype, "emergencyRelationship", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz'),
    __metadata("design:type", Date)
], Employees.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz'),
    __metadata("design:type", Date)
], Employees.prototype, "updatedAt", void 0);
exports.Employees = Employees = __decorate([
    (0, typeorm_1.Entity)()
], Employees);
