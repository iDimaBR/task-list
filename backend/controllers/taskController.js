import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "../utils/responses.js";

const prisma = new PrismaClient();

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [{ done: "asc" }, { createdAt: "desc" }],
    });
    return successResponse(res, tasks);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const createTask = async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return errorResponse(res, "Text is required", 400);

  try {
    const task = await prisma.task.create({ data: { text } });
    return successResponse(res, task, "Task created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;

  if (!text?.trim() && done === undefined) return errorResponse(res, "Nothing to update", 400);

  const dataToUpdate = {};
  if (text?.trim()) dataToUpdate.text = text;
  if (done !== undefined) dataToUpdate.done = done;

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
    return successResponse(res, task, "Task updated successfully");
  } catch (error) {
    if (error.code === "P2025") return errorResponse(res, "Task not found", 404);
    return errorResponse(res, error.message);
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!id) return errorResponse(res, "ID is required", 400);

  try {
    await prisma.task.delete({ where: { id: Number(id) } });
    return successResponse(res, null, "Task deleted successfully");
  } catch (error) {
    if (error.code === "P2025") return errorResponse(res, "Task not found", 404);
    return errorResponse(res, error.message);
  }
};
