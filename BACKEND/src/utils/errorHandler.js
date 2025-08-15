
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.code === 11000) {
        statusCode = 409; 
        const field = Object.keys(err.keyValue)[0];
        message = `The ${field} '${err.keyValue[field]}' is already in use. Please choose another one.`;
    }

    if (err.name === 'ValidationError') {
        statusCode = 400; 
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404; 
        message = 'Resource not found or invalid ID.';
    }


    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};