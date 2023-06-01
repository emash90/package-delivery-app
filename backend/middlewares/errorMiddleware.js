const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 404;

    res.status(statusCode);
    console.log("errorHandler", err);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};
