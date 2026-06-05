export const successResponse = (message, data) => ({
    success: true,
    message,
    data,
});
export const errorResponse = (message, errors) => ({
    success: false,
    message,
    errors,
});
//# sourceMappingURL=response.js.map