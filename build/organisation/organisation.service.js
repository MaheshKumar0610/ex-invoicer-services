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
exports.OrganisationService = void 0;
const appConfig_1 = require("../configs/appConfig");
const database_1 = require("../utils/database");
const docSequencing_1 = __importStar(require("../utils/docSequencing"));
const exceptionhandler_1 = require("../utils/exceptionhandler");
const messages_1 = require("../utils/messages");
const responseObjects_1 = require("../utils/responseObjects");
const organisation_entity_1 = require("./organisation.entity");
class OrganisationService {
    dbConnPromise;
    organisationRepository;
    orgEmployeeRepository;
    constructor() {
        this.dbConnPromise = this.initDBConnection();
        this.organisationRepository = this.getRepositories(appConfig_1.dbConfig.db.organisation.orgDetails.collection);
        this.orgEmployeeRepository = this.getRepositories(appConfig_1.dbConfig.db.organisation.orgEmployees.collection);
    }
    async initDBConnection() {
        try {
            console.info("Organisation DB Constructor Init()..");
            return await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.organisation.name);
        }
        catch (error) {
            console.log("Caught Error", error);
            throw new Error(`Caught DB Connection Constructor error: ${error}`);
        }
    }
    async getRepositories(collection) {
        console.info('calling repos..');
        const dbConn = await this.dbConnPromise;
        return await dbConn.collection(collection);
    }
    async checkOrgContactExists(orgContactNumber, orgEmailAddress) {
        const collection = await this.organisationRepository;
        const record = await collection.find({
            $or: [
                { orgContactNumber: orgContactNumber },
                { orgEmailAddress: orgEmailAddress }
            ]
        }).toArray();
        return record.length > 0;
    }
    async createOrganisation(body) {
        const organisation = new organisation_entity_1.Organisation;
        if (await this.checkOrgContactExists(body.orgContactNumber, body.orgEmailAddress)) {
            return (0, responseObjects_1.GenericAPIReponse)(409, messages_1.DataExistsErrorMessage);
        }
        else {
            //OTP verification of Phone Number
            organisation.orgId = await docSequencing_1.default.getNextIndexOf(docSequencing_1.Doc.ORGANISATION);
            organisation.orgName = body.orgName;
            organisation.orgAddress = {
                doorNumber: body.orgAddress.doorNumber,
                addressLine1: body.orgAddress.addressLine1,
                addressLine2: body.orgAddress.addressLine2,
                addressLine3: body.orgAddress.addressLine3,
                locality: body.orgAddress.locality,
                city: body.orgAddress.city,
                state: body.orgAddress.state,
                pincode: body.orgAddress.pincode,
            };
            organisation.orgContactNumber = body.orgContactNumber;
            organisation.orgEmailAddress = body.orgEmailAddress;
            organisation.createdAt = new Date();
            organisation.orgConfigs = {
                orgPrefix: body.orgConfigs.orgPrefix
            };
            try {
                const collection = await this.organisationRepository;
                await collection.insertOne(organisation);
                return (0, responseObjects_1.createAPIReponse)(201, messages_1.createRecordSuccessMessage);
            }
            catch (error) {
                console.error(error);
                throw new exceptionhandler_1.InboundDataMisMatchException(`Request is not Valid: ${error}`);
            }
        }
    }
    async getOrganisationDetails(orgId) {
        const collection = await this.organisationRepository;
        const record = await collection.find({
            orgId: orgId
        }).toArray();
        return record;
    }
    async checkOrgExists(orgId) {
        const collection = await this.organisationRepository;
        return (await collection.find({ orgId: orgId }).toArray()).length > 0;
    }
    async updateOrganisationInfo(orgId, body) {
        const collection = await this.organisationRepository;
        try {
            if (await this.checkOrgExists(orgId)) {
                if (Object.keys(body).length === 0) {
                    return new exceptionhandler_1.BadRequestData(messages_1.ApiBodyInvalid);
                }
                const updatedRecord = await collection.findOneAndUpdate({ orgId }, { $set: {
                        ...body,
                        updatedAt: new Date()
                    }
                }, { new: true });
                return await collection.find({ orgId: orgId }).toArray();
            }
            else {
                return (0, responseObjects_1.GenericAPIReponse)(200, `${orgId} - Record Does not Exists`);
            }
        }
        catch (error) {
            console.error(error);
            throw new exceptionhandler_1.ApiDbErrors(`Error while updating record for ${orgId}`);
        }
    }
}
exports.OrganisationService = OrganisationService;
