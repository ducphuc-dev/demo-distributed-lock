// import responseCode from "./responseCode";
// import { NotFoundError, ValidationError, SyntaxError, QueryDBError } from "./customError";

export class AppError extends Error {
    protected statusCode: Number;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
    logger() {
        //log error
    }
    sendMail() {
        //send email
    }
    executeAll() {
        this.logger();
        this.sendMail();
    }

}

