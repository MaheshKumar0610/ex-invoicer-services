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
exports.Billing = void 0;
const typeorm_1 = require("typeorm");
let Billing = class Billing {
    billingId;
    billName;
    contactNo;
    emailAddress;
    billAddress;
    particulars;
    total;
    status;
    docPath;
    generatedAt;
    updatedAt;
};
exports.Billing = Billing;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Billing.prototype, "billingId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Billing.prototype, "billName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Billing.prototype, "contactNo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Billing.prototype, "emailAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], Billing.prototype, "billAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Array)
], Billing.prototype, "particulars", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], Billing.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Billing.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Billing.prototype, "docPath", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Billing.prototype, "generatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Billing.prototype, "updatedAt", void 0);
exports.Billing = Billing = __decorate([
    (0, typeorm_1.Entity)()
], Billing);
/*
export class BillingParticulars{
    @Column()
    productId!: string

    @Column()
    productName!: string

    @Column('float')
    rate!: number

    @Column()
    units!: number

    @Column('float')
    amount!: number
}


export class BillingAddress{
    @Column()
    doorNumber!: string

    @Column()
    address1!: string

    @Column()
    address2!: string

    @Column()
    city!: string

    @Column()
    state!: string

    @Column()
    zipCode!: string
}*/ 
