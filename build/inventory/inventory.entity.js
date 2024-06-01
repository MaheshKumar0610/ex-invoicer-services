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
exports.StockUnits = exports.Inventory = void 0;
const typeorm_1 = require("typeorm");
let Inventory = class Inventory {
    // @Column()
    // orgId!: string
    productId;
    productName;
    productDescription;
    category;
    type;
    SKU;
    printRequired;
    printDetails;
    productImages;
    createdAt;
    updatedAt;
};
exports.Inventory = Inventory;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventory.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventory.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventory.prototype, "productDescription", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventory.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventory.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Array)
], Inventory.prototype, "SKU", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Inventory.prototype, "printRequired", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventory.prototype, "printDetails", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], Inventory.prototype, "productImages", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Inventory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Inventory.prototype, "updatedAt", void 0);
exports.Inventory = Inventory = __decorate([
    (0, typeorm_1.Entity)()
], Inventory);
let StockUnits = class StockUnits {
    modelId;
    color;
    material;
    weight;
    dimensions;
    inStock;
    ratePerUnit;
    units;
    createdAt;
    updatedAt;
};
exports.StockUnits = StockUnits;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockUnits.prototype, "modelId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockUnits.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockUnits.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StockUnits.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockUnits.prototype, "dimensions", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], StockUnits.prototype, "inStock", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StockUnits.prototype, "ratePerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StockUnits.prototype, "units", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], StockUnits.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], StockUnits.prototype, "updatedAt", void 0);
exports.StockUnits = StockUnits = __decorate([
    (0, typeorm_1.Entity)()
], StockUnits);
