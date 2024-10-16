const { AppError } = require("../errors/errors");

const errorMiddlewear = (err, req, res, next) => {
    if (err instanceof AppError && err.isOperational) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        console.error('ERROR 💥', err); 
        res.status(500).json({ message: 'Something went wrong' });
    }
};


module.exports = { errorMiddlewear }
