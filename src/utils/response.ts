export const successResponse = (data: any, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = "Error", statusCode = 400) => ({
  success: false,
  message,
  statusCode,
});
