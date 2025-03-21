PORT = process.env.PORT || 3000
HTTP_STATUS_CODES = {
    BAD_REQUEST : 400,
    UNAUTHORISED : 401,
    FORBIDDEN : 403,
    NOT_FOUND : 404,
    UNPROCESSABLE_CONTENT : 422,
    INTERNAL_SERVER_ERROR : 500,
    OK : 200
}

JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
SALT_ROUNDS = process.env.SALT_ROUNDS || 10
AES_SECRET_KEY = process.env.AES_SECRET_KEY
module.exports = {
    PORT,
    HTTP_STATUS_CODES,
    SALT_ROUNDS,
    JWT_SECRET_KEY,
    AES_SECRET_KEY
}