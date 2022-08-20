const CodeError = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409, // ConflictError
  SERVER_ERROR: 500,
};

const CodeSuccess = {
  OK: 200,
  CREATED: 201,
};

module.exports = {
  CodeError,
  CodeSuccess,
};
