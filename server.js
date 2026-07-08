const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const allowedOrigin = process.env.CORS_ORIGIN || "*";

app.use(cors({
  origin: allowedOrigin
}));

app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "katyusha-api",
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    status: "healthy"
  });
});

app.post("/api/leads", (req, res) => {
  const body = req.body;

  console.log("Incoming lead:", JSON.stringify(body, null, 2));

  if (!body || body.consent !== true) {
    return res.status(400).json({
      ok: false,
      error: "CONSENT_REQUIRED"
    });
  }

  const name = body.data?.name?.trim();
  const phone = body.data?.phone?.trim();
  const email = body.data?.email?.trim();

  if (!name) {
    return res.status(400).json({
      ok: false,
      error: "NAME_REQUIRED"
    });
  }

  if (!phone && !email) {
    return res.status(400).json({
      ok: false,
      error: "CONTACT_REQUIRED"
    });
  }

  return res.status(200).json({
    ok: true,
    message: "Lead accepted in test mode",
    receivedAt: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "NOT_FOUND"
  });
});

app.listen(PORT, HOST, () => {
  console.log(`katyusha-api listening on http://${HOST}:${PORT}`);
});
