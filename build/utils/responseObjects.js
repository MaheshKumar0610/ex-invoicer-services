"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericAPIReponse = exports.createAPIReponse = void 0;
const createAPIReponse = (statusCode, message) => {
    return {
        status: statusCode,
        message: message
    };
};
exports.createAPIReponse = createAPIReponse;
const GenericAPIReponse = (statusCode, message) => {
    return {
        status: statusCode,
        message: message
    };
};
exports.GenericAPIReponse = GenericAPIReponse;
