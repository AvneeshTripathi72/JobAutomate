// Vercel serverless entry point for the Tilcons ATS + CRM backend.
//
// Vercel serves the compiled frontend (dist/public) as static files and routes
// every /api/* request to this function (see vercel.json). The Express app is
// built once per warm instance and reused across invocations.
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { storage } from "../server/storage";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

let ready: Promise<void> | null = null;

function ensureReady() {
  if (!ready) {
    ready = (async () => {
      await storage.init();
      await registerRoutes(app);

      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
      });
    })().catch((err) => {
      // Reset so the next invocation retries initialization.
      ready = null;
      throw err;
    });
  }
  return ready;
}

export default async function handler(req: Request, res: Response) {
  await ensureReady();
  return (app as any)(req, res);
}
