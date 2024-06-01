"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const appConfig_1 = require("../configs/appConfig");
const database_1 = require("../utils/database");
const docSequencing_1 = __importStar(require("../utils/docSequencing"));
const exceptionhandler_1 = require("../utils/exceptionhandler");
const messages_1 = require("../utils/messages");
const responseObjects_1 = require("../utils/responseObjects");
const inventory_entity_1 = require("./inventory.entity");
class InventoryService {
    dbConnPromise;
    inventoryRepository;
    skuRepository;
    constructor() {
        this.dbConnPromise = this.initDBConnection();
        this.inventoryRepository = this.getRepositories(appConfig_1.dbConfig.db.inventory.collection.inventory);
        this.skuRepository = this.getRepositories(appConfig_1.dbConfig.db.inventory.collection.sku);
    }
    async getRepositories(collection) {
        console.info('calling repos..');
        const dbConn = await this.dbConnPromise;
        return await dbConn.collection(collection);
    }
    async initDBConnection() {
        try {
            console.info("Inventory DB Constructor Init()..");
            return await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.inventory.name);
        }
        catch (error) {
            console.log("Caught Error", error);
            throw new Error(`Caught DB Connection Constructor error: ${error}`);
        }
    }
    async checkProductNameExists(productName) {
        const dbConn = await this.dbConnPromise;
        const collection = await dbConn.collection(appConfig_1.dbConfig.db.inventory.collection.inventory).find({
            productName: productName
        }).toArray();
        return collection.length > 0;
    }
    async getModelIdUnits(modelId) {
        const collectionRepos = await this.skuRepository;
        const collection = await collectionRepos.find({
            modelId: modelId
        }).toArray();
        return collection[0].units;
    }
    async createInventory(body) {
        const inventory = new inventory_entity_1.Inventory;
        if (await this.checkProductNameExists(body.productName)) {
            return (0, responseObjects_1.GenericAPIReponse)(409, messages_1.DataExistsErrorMessage);
        }
        else {
            inventory.productId = await docSequencing_1.default.getNextIndexOf(docSequencing_1.Doc.PRODUCTINVENTORY);
            inventory.productName = body.productName;
            inventory.productDescription = body.productDescription;
            inventory.category = body.category;
            inventory.type = body.type;
            inventory.printRequired = body.printrequired;
            inventory.printDetails = body.printDetails;
            inventory.createdAt = new Date();
            // inventory.productImages = body.productImages || undefined
            inventory.SKU = [];
            for (const sku of body.SKU) {
                const { modelId, units } = sku;
                inventory.SKU.push(`${modelId}: ${units}`);
            }
            try {
                const collection = await this.inventoryRepository;
                // console.log("inventory schema: ", inventory)
                await collection.insertOne(inventory);
                return (0, responseObjects_1.createAPIReponse)(201, messages_1.createRecordSuccessMessage);
            }
            catch (error) {
                console.error(error);
                throw new exceptionhandler_1.InboundDataMisMatchException(`Problem Processing Request: ${error}`);
            }
        }
    }
    async createStockUnits(body) {
        const sku = new inventory_entity_1.StockUnits;
        if (await this.checkStockModelExists(body.modelId)) {
            return (0, responseObjects_1.GenericAPIReponse)(409, messages_1.DataExistsErrorMessage);
        }
        else {
            sku.modelId = body.modelId;
            sku.color = body.color;
            sku.material = body.material || '';
            sku.weight = body.weight || 0;
            sku.dimensions = body.dimensions || '';
            sku.inStock = body.inStock;
            sku.ratePerUnit = body.ratePerUnit;
            sku.units = body.units;
            sku.createdAt = new Date();
            try {
                const collection = await this.skuRepository;
                await collection.insertOne(sku);
                return (0, responseObjects_1.createAPIReponse)(201, messages_1.createRecordSuccessMessage);
            }
            catch (error) {
                console.error(error);
                throw new exceptionhandler_1.InboundDataMisMatchException(`Problem Processing Request: ${error}`);
            }
        }
    }
    async checkStockModelExists(modelId) {
        const collectionRepos = await this.skuRepository;
        const collection = await collectionRepos.find({
            modelId: modelId
        }).toArray();
        return collection.length > 0;
    }
    async checkProductIdExists(productId) {
        const repo = await this.inventoryRepository;
        const collection = await repo.find({ productId: productId }).toArray();
        return collection.length > 0;
    }
    async updateInventory(productId, body) {
        const collection = await this.inventoryRepository;
        try {
            if (!await this.checkProductIdExists) {
                return new exceptionhandler_1.BadRequestData(messages_1.DataNotFound);
            }
            await collection.findOneAndUpdate({ productId }, { $set: {
                    ...body,
                    updatedAt: new Date()
                }
            }, { new: true });
            return await collection.find({ productId: productId }).toArray();
        }
        catch (error) {
            console.error(error);
            throw new exceptionhandler_1.InboundDataMisMatchException(`Problem Processing Request: ${error}`);
        }
        return null;
    }
    async updateStockUnits(modelId, body) {
        const collection = await this.skuRepository;
        try {
            if (!await this.checkStockModelExists) {
                return new exceptionhandler_1.BadRequestData(messages_1.DataNotFound);
            }
            await collection.findOneAndUpdate({ modelId }, { $set: {
                    ...body,
                    updatedAt: new Date()
                }
            }, { new: true });
            return await collection.find({ modelId: modelId }).toArray();
        }
        catch (error) {
            console.error(error);
            throw new exceptionhandler_1.InboundDataMisMatchException(`Problem Processing Request: ${error}`);
        }
        return null;
    }
    async getInventorybyID(productId) {
        const collection = await this.inventoryRepository;
        const record = await collection.find({ productId: productId }).toArray();
        return record;
    }
    async getStockUnitbyID(modelId) {
        const collection = await this.skuRepository;
        const record = await collection.find({ modelId: modelId }).toArray();
        return record;
    }
    async getAllProductInventory() {
        const collection = await this.inventoryRepository;
        const record = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return record;
    }
    async getAllSKU() {
        const collection = await this.skuRepository;
        const record = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return record;
    }
    async updateSKUnits(modelId, units) {
        const collection = await this.skuRepository;
        try {
            // Find the document with the specified modelId
            const document = await collection.findOne({ modelId });
            if (!document) {
                throw new Error(`Model with ID ${modelId} not found`);
            }
            // Calculate the new units value
            const newUnits = document.units - units;
            if (newUnits < 0) {
                throw new exceptionhandler_1.InboundDataMisMatchException(`Not enough units in stock for model ID ${modelId}`);
            }
            // Update the document with the new units value
            await collection.findOneAndUpdate({ modelId }, {
                $set: {
                    units: newUnits,
                    updatedAt: new Date()
                }
            }, { returnOriginal: false });
            return true;
        }
        catch (error) {
            console.error(error);
            throw new exceptionhandler_1.InboundDataMisMatchException(`Problem Processing Request: ${error}`);
        }
    }
    // async deleteInventoryProduct(productId: string){
    //     const collection = await this.inventoryRepository
    //     const record = await collection.deleteOne({ productId: productId })
    //     return record
    // }
    async deleteInventoryProduct(productIds) {
        const collection = await this.inventoryRepository;
        const result = await collection.deleteMany({ productId: { $in: productIds } });
        return result.deletedCount || 0;
    }
    // async deleteSKU(modelId: string){
    //     const collection = await this.skuRepository
    //     const record = await collection.deleteOne({ modelId: modelId })
    //     return record
    // }
    async deleteSKU(modelIds) {
        const collection = await this.skuRepository;
        const result = await collection.deleteMany({ modelId: { $in: modelIds } });
        return result.deletedCount || 0;
    }
}
exports.InventoryService = InventoryService;
