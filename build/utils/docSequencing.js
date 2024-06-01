"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doc = void 0;
const appConfig_1 = require("../configs/appConfig");
const database_1 = require("./database");
var Doc;
(function (Doc) {
    Doc[Doc["PRODUCTINVENTORY"] = 0] = "PRODUCTINVENTORY";
    Doc[Doc["SKU"] = 1] = "SKU";
    Doc[Doc["PRICING"] = 2] = "PRICING";
    Doc[Doc["DISCOUNT"] = 3] = "DISCOUNT";
    Doc[Doc["PRODUCTIMAGES"] = 4] = "PRODUCTIMAGES";
    Doc[Doc["EMPLOYEES"] = 5] = "EMPLOYEES";
    Doc[Doc["CUSTOMERS"] = 6] = "CUSTOMERS";
    Doc[Doc["INVOICE"] = 7] = "INVOICE";
    Doc[Doc["ORGANISATION"] = 8] = "ORGANISATION";
})(Doc || (exports.Doc = Doc = {}));
async function getNextIndexOf(doc) {
    if (doc === Doc.PRODUCTINVENTORY) {
        const dbConn = await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.inventory.name);
        const collection = await dbConn.collection(appConfig_1.dbConfig.db.inventory.collection.inventory).find().sort({ productId: -1 }).limit(1).toArray();
        return collection.length > 0 ? IncrementKey(collection[0].productId) : 'PRD-001-00001';
    }
    if (doc === Doc.INVOICE) {
        const dbConn = await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.billing.name);
        const collection = await dbConn.collection(appConfig_1.dbConfig.db.billing.collection.billing).find().sort({ billingId: -1 }).limit(1).toArray();
        return collection.length > 0 ? IncrementKey(collection[0].billingId) : 'INV-001-00001';
    }
    if (doc === Doc.EMPLOYEES) {
        const dbConn = await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.inventory.name);
        const collection = await dbConn.collection(appConfig_1.dbConfig.db.inventory.collection.inventory).find().sort({ empId: -1 }).limit(1).toArray();
        return collection ? IncrementKey(collection.empId) : 'EMP-001-00001';
    }
    if (doc === Doc.ORGANISATION) {
        const dbConn = await (0, database_1.getDBConnection)(appConfig_1.dbConfig.db.organisation.name);
        const collection = await dbConn.collection(appConfig_1.dbConfig.db.organisation.orgDetails.collection).find().sort({ orgId: -1 }).limit(1).toArray();
        return collection.length > 0 ? IncrementTwoPadding(collection[0].orgId) : 'ORG-00001';
    }
    throw new Error(`Error while Doc Sequencing`);
}
const IncrementTwoPadding = (value, padding = 5) => {
    var splits = value.split("-");
    return `${splits[0]}-${String((parseInt(splits[1]) + 1)).padStart(padding, '0')}`;
};
const IncrementKey = (value, padding = 5) => {
    console.log("What happend0", value);
    var splits = value.split("-");
    console.log("What happend", splits);
    return `${splits[0]}-${splits[1]}-${String((parseInt(splits[2]) + 1)).padStart(padding, '0')}`;
};
const DocSequence = { getNextIndexOf };
exports.default = DocSequence;
