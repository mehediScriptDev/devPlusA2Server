export const successResponse = <T>(message: string, data: T) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, errors?: unknown) => ({
  success: false,
  message,
  errors,
});
