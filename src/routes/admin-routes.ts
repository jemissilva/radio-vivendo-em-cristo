import { RequestHandler, Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  bannerSchema,
  contentSchema,
  eventSchema,
  loginSchema,
  messageStatusSchema,
  prayerStatusSchema,
  programSchema,
  scheduleSchema,
} from "../lib/validators";
import { z } from "zod";
import {
  createBanner,
  createContent,
  createEvent,
  createProgram,
  createScheduleEntry,
  deleteBanner,
  deleteContent,
  deleteEvent,
  deleteProgram,
  deleteScheduleEntry,
  getDashboardPayload,
  listBanners,
  listContent,
  listEvents,
  listMessages,
  listPrayerRequests,
  listPrograms,
  listSchedule,
  getStreamStatus,
  loginAdmin,
  updateBanner,
  updateContent,
  updateEvent,
  updateMessageStatus,
  updatePrayerRequestStatus,
  updateProgram,
  updateScheduleEntry,
  updateStreamStatus,
} from "../services/admin-service";

export const adminRouter = Router();
const getRouteParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
const requireAdminOrEditor = requireRole("admin", "content_editor") as RequestHandler;
const requireAdminOrOperator = requireRole("admin", "radio_operator") as RequestHandler;
const requireAdminOrModerator = requireRole("admin", "moderator") as RequestHandler;
const requireAdminOnly = requireRole("admin") as RequestHandler;

adminRouter.post("/auth/login", async (request, response, next) => {
  try {
    const payload = loginSchema.parse(request.body);
    response.json(await loginAdmin(payload.email, payload.password));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/auth/logout", requireAuth, async (_request, response) => {
  response.json({ message: "Logout realizado com sucesso" });
});

adminRouter.use(requireAuth);

adminRouter.get("/dashboard", async (_request, response, next) => {
  try {
    response.json(await getDashboardPayload());
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/programs", async (_request, response, next) => {
  try {
    response.json(await listPrograms());
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/programs", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.status(201).json(await createProgram(programSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/programs/:id", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.json(await updateProgram(getRouteParam(request.params.id), programSchema.partial().parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/programs/:id", requireAdminOnly, async (request, response, next) => {
  try {
    await deleteProgram(getRouteParam(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/schedule", async (_request, response, next) => {
  try {
    response.json(await listSchedule());
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/schedule", requireAdminOrOperator, async (request, response, next) => {
  try {
    response.status(201).json(await createScheduleEntry(scheduleSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/schedule/:id", requireAdminOrOperator, async (request, response, next) => {
  try {
    response.json(await updateScheduleEntry(getRouteParam(request.params.id), scheduleSchema.partial().parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/schedule/:id", requireAdminOnly, async (request, response, next) => {
  try {
    await deleteScheduleEntry(getRouteParam(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/content", async (_request, response, next) => {
  try {
    response.json(await listContent());
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/content", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.status(201).json(await createContent(contentSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/content/:id", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.json(await updateContent(getRouteParam(request.params.id), contentSchema.partial().parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/content/:id", requireAdminOnly, async (request, response, next) => {
  try {
    await deleteContent(getRouteParam(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/events", async (_request, response, next) => {
  try {
    response.json(await listEvents());
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/events", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.status(201).json(await createEvent(eventSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/events/:id", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.json(await updateEvent(getRouteParam(request.params.id), eventSchema.partial().parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/events/:id", requireAdminOnly, async (request, response, next) => {
  try {
    await deleteEvent(getRouteParam(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/banners", async (_request, response, next) => {
  try {
    response.json(await listBanners());
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/banners", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.status(201).json(await createBanner(bannerSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/banners/:id", requireAdminOrEditor, async (request, response, next) => {
  try {
    response.json(await updateBanner(getRouteParam(request.params.id), bannerSchema.partial().parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/banners/:id", requireAdminOnly, async (request, response, next) => {
  try {
    await deleteBanner(getRouteParam(request.params.id));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/messages", requireAdminOrModerator, async (_request, response, next) => {
  try {
    response.json(await listMessages());
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/messages/:id", requireAdminOrModerator, async (request, response, next) => {
  try {
    response.json(await updateMessageStatus(getRouteParam(request.params.id), messageStatusSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/prayer-requests", requireAdminOrModerator, async (_request, response, next) => {
  try {
    response.json(await listPrayerRequests());
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/prayer-requests/:id", requireAdminOrModerator, async (request, response, next) => {
  try {
    response.json(await updatePrayerRequestStatus(getRouteParam(request.params.id), prayerStatusSchema.parse(request.body)));
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/stream", async (_request, response, next) => {
  try {
    response.json(await getStreamStatus());
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/stream", requireAdminOrOperator, async (request, response, next) => {
  try {
    response.json(
      await updateStreamStatus(
        z
          .object({
            isLive: z.boolean().optional(),
            streamUrl: z.string().url().optional(),
            fallbackUrl: z.string().url().optional(),
            currentTrack: z.string().min(1).optional(),
            bitrateKbps: z.number().int().nonnegative().optional(),
          })
          .parse(request.body),
      ),
    );
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/live", requireAdminOrOperator, async (request, response, next) => {
  try {
    response.json(
      await updateStreamStatus(
        z
          .object({
            isLive: z.boolean().optional(),
            streamUrl: z.string().url().optional(),
            fallbackUrl: z.string().url().optional(),
            currentTrack: z.string().min(1).optional(),
            bitrateKbps: z.number().int().nonnegative().optional(),
          })
          .parse(request.body),
      ),
    );
  } catch (error) {
    next(error);
  }
});