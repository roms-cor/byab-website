import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";

const contactFormSchema = insertContactSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(200),
  message: z.string().trim().max(5000).nullable().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    const parsed = contactFormSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(", ") });
    }

    try {
      const submission = await storage.createContactSubmission(parsed.data);
      return res.status(201).json({ ok: true, id: submission.id });
    } catch (err) {
      console.error("Failed to save contact submission:", err);
      return res.status(500).json({ message: "Failed to save your message. Please try again." });
    }
  });

  return httpServer;
}
