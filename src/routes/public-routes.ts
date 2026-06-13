import { Router } from "express";
import {
  getContentBySlugPayload,
  getContentPayload,
  getEventsPayload,
  getLivePayload,
  getProgramsPayload,
  getSchedulePayload,
} from "../services/public-service";
import { createContactMessage, createPrayerRequest } from "../services/admin-service";
import { contactSchema, prayerRequestSchema } from "../lib/validators";
import { AppError } from "../lib/errors";

export const publicRouter = Router();

publicRouter.get("/live", async (_request, response, next) => {
  try {
    response.json(await getLivePayload());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/schedule", async (_request, response, next) => {
  try {
    response.json(await getSchedulePayload());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/programs", async (_request, response, next) => {
  try {
    response.json(await getProgramsPayload());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/content", async (_request, response, next) => {
  try {
    response.json(await getContentPayload());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/content/:slug", async (request, response, next) => {
  try {
    const item = await getContentBySlugPayload(request.params.slug);
    if (!item) {
      throw new AppError(404, "Conteúdo não encontrado");
    }
    response.json(item);
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/events", async (_request, response, next) => {
  try {
    response.json(await getEventsPayload());
  } catch (error) {
    next(error);
  }
});

publicRouter.post("/contact", async (request, response, next) => {
  try {
    const payload = contactSchema.parse(request.body);
    const message = await createContactMessage(payload);
    response.status(201).json({
      message: "Mensagem recebida com sucesso",
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

publicRouter.post("/prayer-requests", async (request, response, next) => {
  try {
    const payload = prayerRequestSchema.parse(request.body);
    const prayerRequest = await createPrayerRequest(payload);
    response.status(201).json({
      message: "Pedido de oração recebido com sucesso",
      data: prayerRequest,
    });
  } catch (error) {
    next(error);
  }
});