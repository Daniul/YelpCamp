class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); //Calls the Error constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;