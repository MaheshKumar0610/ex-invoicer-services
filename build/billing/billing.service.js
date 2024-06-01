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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const pdf_lib_1 = require("pdf-lib");
const appConfig_1 = require("../configs/appConfig");
const inventory_service_1 = require("../inventory/inventory.service");
const database_1 = require("../utils/database");
const docSequencing_1 = __importStar(require("../utils/docSequencing"));
const exceptionhandler_1 = require("../utils/exceptionhandler");
const messages_1 = require("../utils/messages");
const responseObjects_1 = require("../utils/responseObjects");
const billing_entity_1 = require("./billing.entity");
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = require("fs");
class BillingService {
    dbConnPromise;
    billingRepository;
    // private inventoryRepository: Promise<any>
    inventoryService;
    constructor() {
        this.dbConnPromise = this.initDBConnection();
        this.billingRepository = this.getRepositories(appConfig_1.dbConfig.db.billing.collection.billing);
        // this.inventoryRepository = this.getRepositories(dbConfig.db.inventory.collection.inventory)
        this.inventoryService = new inventory_service_1.InventoryService();
    }
    async initDBConnection() {
        try {
            console.info('Billing DB init()...');
            return await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.billing.name);
        }
        catch (error) {
            console.error(error);
            throw new Error(`Caught DB Connection Constructor error: ${error}`);
        }
    }
    async getRepositories(collection) {
        console.log("callingBilling Repos...", collection);
        const dbConn = await this.dbConnPromise;
        return await dbConn.collection(collection);
    }
    // GET all invoices api
    async getAllInvoices() {
        const collection = await this.billingRepository;
        const records = await collection.find({}).toArray();
        return records;
    }
    //GET invoice by ID
    async getInvoiceById(billingId) {
        const collection = await this.billingRepository;
        const record = await collection.find({ billingId: billingId }).toArray();
        return record;
    }
    //Update Status of an Invoice
    async updateInvoiceStatus(billingId, status) {
        const collection = await this.billingRepository;
        try {
            await collection.findOneAndUpdate({ billingId: billingId }, {
                $set: {
                    status: status,
                    updatedAt: new Date()
                }
            }, { returnOriginal: false });
            return await collection.find({ billingId: billingId }).toArray();
        }
        catch (error) {
            throw new Error(`Problem processing Request ${error}`);
        }
    }
    async fetchProductDetails(productId) {
        const record = await this.inventoryService.getInventorybyID(productId);
        return record;
    }
    async processSKUs(productDetails, particularUnits) {
        const skuStatusArray = [];
        for (const sku of productDetails.SKU) {
            const [modelId, reqUnits] = sku.split(":");
            const modelDetails = await this.inventoryService.getStockUnitbyID(modelId);
            const inStock = modelDetails[0].inStock;
            skuStatusArray.push({
                modelId,
                requiredUnits: reqUnits * particularUnits,
                inStock,
            });
        }
        return skuStatusArray;
    }
    async createInvoice(body) {
        const billing = new billing_entity_1.Billing;
        const skuStatusArrays = [];
        let result;
        try {
            billing.billingId = await docSequencing_1.default.getNextIndexOf(docSequencing_1.Doc.INVOICE);
            billing.billName = body.billName;
            billing.contactNo = body.contactNo || '';
            billing.emailAddress = body.emailAddress || '';
            billing.billAddress = body.billAddress;
            const particularsWithDetails = await Promise.all(body.particulars.map(async (particular) => {
                const productDetails = await this.fetchProductDetails(particular.productId);
                const amount = particular.rate * particular.units;
                const result = await this.processSKUs(productDetails[0], particular.units);
                skuStatusArrays.push(...result);
                return {
                    ...particular,
                    productName: productDetails ? productDetails[0].productName : 'Unknown',
                    amount
                };
            }));
            billing.total = particularsWithDetails.reduce((acc, item) => acc + item.amount, 0);
            billing.particulars = particularsWithDetails;
            billing.status = body.status || '';
            billing.generatedAt = new Date();
            const flag = !skuStatusArrays.some(sku => !sku.inStock);
            if (!flag) {
                return (0, responseObjects_1.createAPIReponse)(207, 'Stock Not Available');
            }
            else {
                const collection = await this.billingRepository;
                // console.log("what do we have here?:",skuStatusArrays)
                //update SKU units
                for (const sku of skuStatusArrays) {
                    const unitsUpdate = await this.inventoryService.updateSKUnits(sku.modelId, sku.requiredUnits);
                    if (!unitsUpdate) {
                        throw new exceptionhandler_1.InboundDataMisMatchException(`Problem Processing Request while updating units`);
                    }
                }
                const pdfPath = await this.generatePDFInvoice(billing);
                //doc path saving
                billing.docPath = pdfPath;
                if (body.emailAddress) {
                    await this.sendInvoiceEmail(body.emailAddress, pdfPath);
                }
                // console.log(billing)
                await collection.insertOne(billing);
                return (0, responseObjects_1.createAPIReponse)(201, messages_1.createRecordSuccessMessage);
            }
        }
        catch (error) {
            throw new exceptionhandler_1.InboundDataMisMatchException(`Problem Processing Request ${error}`);
        }
    }
    async generatePDFInvoice(billing) {
        const pdfDoc = await pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage();
        const fontSize = 12;
        const lineHeight = fontSize * 1.2;
        const address = billing.billAddress;
        const addressText = `${address.doorNumber}, ${address.address1}, ${address.address2}, ${address.city}, ${address.state}, ${address.zipcode}`;
        const lines = addressText.split(',');
        const maxX = 550;
        const startX = 400;
        let startY = 700;
        let currentY = startY;
        for (const line of lines) {
            // If the line exceeds the maximum width, split it into multiple lines
            const lineFragments = page.drawText(line, {
                x: startX,
                y: currentY,
                size: fontSize,
                color: (0, pdf_lib_1.rgb)(0, 0, 0), // Black color
            });
            // Move to the next line
            currentY -= lineHeight;
            if (currentY < 50) {
                // Start a new page if the next line exceeds the boundary
                const newPage = pdfDoc.addPage();
                currentY = startY;
            }
        }
        currentY -= 50;
        page.drawText(`Sera - IBMS - INVOICE TEST`, { x: 250, y: 750, size: fontSize });
        page.drawText(`Invoice for ${billing.billName},    Ph: ${billing.contactNo}`, { x: 50, y: 700, size: fontSize });
        page.drawText(`email: ${billing.emailAddress}`, { x: 50, y: 680, size: fontSize });
        const font = await pdfDoc.embedFont('Helvetica-Bold');
        page.drawText(`Total: ${billing.total}`, { x: 50, y: 50, size: fontSize, font });
        page.drawText(`Signature: ${billing.status}`, { x: 500, y: 80, size: fontSize });
        const columnWidths = [50, 200, 350, 400, 450]; // Adjust the widths as needed
        // Define column headers
        const headers = ['Product Code', 'Product Name', 'Rate', 'Unit', 'Amount'];
        // Draw column headers
        for (let i = 0; i < headers.length; i++) {
            page.drawText(headers[i], { x: columnWidths[i], y: currentY, size: fontSize });
        }
        // Move to the next line
        currentY -= lineHeight;
        // Draw particulars
        for (const particular of billing.particulars) {
            const particularText = `${particular.productId},${particular.productName},${particular.rate},${particular.units},${particular.amount}`;
            const columns = particularText.split(',');
            // Draw each column
            for (let i = 0; i < columns.length; i++) {
                page.drawText(columns[i], { x: columnWidths[i], y: currentY, size: fontSize });
            }
            // Move to the next line
            currentY -= lineHeight;
        }
        const pdfBytes = await pdfDoc.save();
        const pdfPath = path_1.default.join('/Users/sathishvenkat/Desktop/Invoices', `/invoice_${billing.billingId}.pdf`);
        console.log("PDF PATH....", pdfPath);
        await fs_1.promises.writeFile(pdfPath, pdfBytes);
        return pdfPath;
    }
    async sendInvoiceEmail(emailAddress, pdfPath) {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: 'joshcreatives@outlook.com',
                pass: 'nikon@5300'
            }
        });
        const mailOptions = {
            from: 'joshcreatives@outlook.com',
            to: emailAddress,
            subject: 'Your Invoice',
            text: 'Please find attached your invoice.',
            attachments: [
                {
                    filename: path_1.default.basename(pdfPath),
                    path: pdfPath
                }
            ]
        };
        await transporter.sendMail(mailOptions);
    }
}
exports.BillingService = BillingService;
