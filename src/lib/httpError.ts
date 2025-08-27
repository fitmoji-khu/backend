export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message?: string) {
        super(message ?? '');   
        this.statusCode = statusCode;
        this.name = new.target.name; 
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequest extends HttpError {
    constructor(message?: string) {
        super(400, message);
    }
}

export class Unauthorized extends HttpError {
    constructor(message?: string) {
        super(401, message);
    }
}

export class NotFound extends HttpError {
    constructor(message?: string) {
        super(404, message);
    }
}

export class ServerError extends HttpError {
	constructor(message?: string) {
		super(500, message);
	}
}