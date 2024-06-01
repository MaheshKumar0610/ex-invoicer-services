"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDbErrors = exports.BadRequestData = exports.DataExistsException = exports.StockUnitsNotAvailable = exports.InboundDataMisMatchException = exports.ControllerHandler = void 0;
const ControllerHandler = (fn) => (request, response, next) => {
    return Promise.resolve(fn(request, response, next)).catch(next);
};
exports.ControllerHandler = ControllerHandler;
class InboundDataMisMatchException extends Error {
    message;
    statusCode = 405;
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.InboundDataMisMatchException = InboundDataMisMatchException;
class StockUnitsNotAvailable extends Error {
    message;
    statusCode = 207;
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.StockUnitsNotAvailable = StockUnitsNotAvailable;
class DataExistsException extends Error {
    message;
    statusCode = 409;
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.DataExistsException = DataExistsException;
class BadRequestData extends Error {
    message;
    statusCode = 400;
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.BadRequestData = BadRequestData;
class ApiDbErrors extends Error {
    message;
    statusCode = 500;
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.ApiDbErrors = ApiDbErrors;
