export function successResponse(res, data, message = "Success") {
  return res.status(200).json({ status: "success", message, data });
}

export function errorResponse(res, message = "Something went wrong", code = 500) {
  return res.status(code).json({ status: "error", message });
}
