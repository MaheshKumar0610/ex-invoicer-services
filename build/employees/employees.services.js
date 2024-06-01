"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const appConfig_1 = require("../configs/appConfig");
const database_1 = require("../utils/database");
const exceptionhandler_1 = require("../utils/exceptionhandler");
const employees_entity_1 = require("./employees.entity");
const responseObjects_1 = require("../utils/responseObjects");
const messages_1 = require("../utils/messages");
class EmployeesService {
    // private employeeService = new EmployeesService()
    dbConnPromise;
    employeesRepository;
    constructor() {
        this.dbConnPromise = this.initDBConnection();
        this.employeesRepository = this.getRepositories(appConfig_1.dbConfig.db.users.employees.collection);
    }
    async initDBConnection() {
        try {
            console.info("Employees DB Constructor Init()..");
            return await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.users.name);
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
    async checkDataAlreadyExists(username, primaryContactNumber, email) {
        const repo = await this.employeesRepository;
        const record = await repo.find({
            $or: [
                { username: username },
                { primaryContactNumber: primaryContactNumber },
                { secondaryContactNumber: primaryContactNumber },
                { emailAddress: email }
            ]
        }).toArray();
        return record.length > 0;
    }
    async createEmployees(body) {
        const employees = new employees_entity_1.Employees();
        if (await this.checkDataAlreadyExists(body.username, body.primaryContactNumber, body.emailAddress)) {
            return (0, responseObjects_1.GenericAPIReponse)(409, messages_1.DataExistsErrorMessage);
        }
        else {
            employees.username = body.username;
            employees.primaryContactNumber = body.primaryContactNumber;
            employees.firstname = body.firstname;
            employees.lastname = body.lastname;
            employees.emailAddress = body.emailAddress;
            if (body.secondaryContactNumber) {
                employees.secondaryContactNumber = body.secondaryContactNumber;
            }
            if (body.dateOfBirth) {
                employees.dateOfBirth = body.dateOfBirth;
            }
            if (body.address) {
                employees.address = body.address;
            }
            if (body.qualification) {
                employees.qualification = body.qualification;
            }
            if (body.skillset) {
                employees.skillset = body.skillset;
            }
            employees.salary = body.salary;
            employees.emergencyContact = body.emergencyContact;
            if (body.emergencyAddress) {
                employees.emergencyAddress = body.emergencyAddress;
            }
            employees.emergencyRelationship = body.emergencyRelationship;
            employees.createdAt = new Date();
            try {
                const repo = await this.employeesRepository;
                await repo.insertOne(employees);
                return (0, responseObjects_1.createAPIReponse)(201, messages_1.createRecordSuccessMessage);
            }
            catch (error) {
                console.error(error);
                throw new exceptionhandler_1.InboundDataMisMatchException(`Request is not Valid: ${error}`);
            }
        }
    }
    async getEmployeesAll() {
        try {
            const repo = await this.employeesRepository;
            const employees = await repo.find({}).toArray();
            return employees;
        }
        catch (error) {
            console.error('Error on GET all employees:', error);
            throw new Error('Unable to retrieve employees');
        }
    }
    async getEmployeesField(searchField, searchValue) {
        try {
            if (!searchField || !searchValue) {
                throw new exceptionhandler_1.InboundDataMisMatchException(`Search Field or Value missing in Query params`);
            }
            const repo = await this.employeesRepository;
            const employees = await repo.find({
                [searchField]: searchValue
            }).toArray();
            return employees;
        }
        catch (error) {
            console.error('Error on GET all employees:', error);
            throw new Error('Unable to retrieve employees');
        }
    }
    async getEmployeebyAny(searchValue) {
        try {
            if (!searchValue) {
                throw new Error(`Search value is required`);
            }
            const collection = await this.employeesRepository;
            const regex = new RegExp(searchValue, 'i');
            const record = await collection.find({
                $or: [
                    { username: regex },
                    { firstname: regex },
                    { lastname: regex },
                    { email: regex },
                    { dateOfBirth: regex },
                    { primaryContactNumber: regex },
                    { secondaryContactNumber: regex },
                    { address: regex },
                    { qualification: regex },
                    { employmentStatus: regex },
                    { salary: regex },
                    { skillset: regex },
                    { emergencyContact: regex },
                    { emergencyAddress: regex },
                    { emergencyRelationship: regex },
                ]
            }).toArray();
            if (record.length > 0) {
                return record[0]; // return the first document
            }
            else {
                throw new Error(`No record found`);
            }
        }
        catch (error) {
            console.error(error);
            throw new Error(`Unable to retrieve`);
        }
    }
    async checkUsernameExists(username) {
        const collection = await this.employeesRepository;
        const record = await collection.find({
            username: username
        }).toArray();
        return record.length > 0;
    }
    async updateEmployeeInfo(username, body) {
        const collection = await this.employeesRepository;
        try {
            if (await this.checkUsernameExists(username)) {
                if (Object.keys(body).length === 0) {
                    return new exceptionhandler_1.BadRequestData(messages_1.ApiBodyInvalid);
                }
                const updatedRecord = await collection.findOneAndUpdate({ username }, { $set: {
                        ...body,
                        updatedAt: new Date()
                    }
                }, { new: true });
                return await collection.find({ username: username }).toArray();
            }
            else {
                return (0, responseObjects_1.GenericAPIReponse)(200, `${username} - Record does not exists`);
            }
        }
        catch (error) {
            console.error(error);
            throw new exceptionhandler_1.ApiDbErrors(`Error while updating record for ${username}`);
        }
    }
    async deleteEmployeeRecord(username) {
        const collection = await this.employeesRepository;
        console.log("we got username", username);
        try {
            if (await this.checkUsernameExists(username)) {
                await collection.deleteOne({ username });
                if (!await this.checkUsernameExists(username)) {
                    return (0, responseObjects_1.GenericAPIReponse)(204, messages_1.requestProcessSuccess);
                }
                else {
                    return (0, responseObjects_1.GenericAPIReponse)(500, messages_1.InternalServerError);
                }
            }
            else {
                return (0, responseObjects_1.GenericAPIReponse)(200, `${username} - Record does not exists`);
            }
        }
        catch (error) {
            console.error(error);
            throw new exceptionhandler_1.ApiDbErrors(`Error while deleting record for ${username}`);
        }
    }
}
exports.EmployeesService = EmployeesService;
