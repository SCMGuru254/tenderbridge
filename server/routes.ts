import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/jobs", async (_req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs from storage:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    const id = parseInt(req.params.id as string);
    const job = await storage.getJob(id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  const httpServer = createServer(app);
  return httpServer;
}
