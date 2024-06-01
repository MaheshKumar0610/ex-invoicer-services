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
exports.OrgEmployeesAssociation = exports.Organisation = void 0;
const typeorm_1 = require("typeorm");
let Organisation = class Organisation {
    orgId;
    orgName;
    orgDescription;
    orgAddress;
    orgContactNumber;
    orgEmailAddress;
    orgConfigs;
    createdAt;
    updatedAt;
};
exports.Organisation = Organisation;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organisation.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organisation.prototype, "orgName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organisation.prototype, "orgDescription", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], Organisation.prototype, "orgAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Organisation.prototype, "orgContactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organisation.prototype, "orgEmailAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], Organisation.prototype, "orgConfigs", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], Organisation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], Organisation.prototype, "updatedAt", void 0);
exports.Organisation = Organisation = __decorate([
    (0, typeorm_1.Entity)()
], Organisation);
let OrgEmployeesAssociation = class OrgEmployeesAssociation {
    orgId;
    users;
};
exports.OrgEmployeesAssociation = OrgEmployeesAssociation;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrgEmployeesAssociation.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], OrgEmployeesAssociation.prototype, "users", void 0);
exports.OrgEmployeesAssociation = OrgEmployeesAssociation = __decorate([
    (0, typeorm_1.Entity)()
], OrgEmployeesAssociation);
