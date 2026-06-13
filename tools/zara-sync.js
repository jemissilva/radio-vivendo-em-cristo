const fs = require("fs");
const path = require("path");

const ZARA_FILE_PATH = process.env.ZARA_FILE_PATH;
const API_URL = process.env.API_URL || "https://radio-vivendo-em-cristo.onrender.com/api/admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const STATUS_FILE = path.resolve(__dirname, "zara-sync-status.json");

let cachedToken = null;
let lastContent = null;

function log(message) {
  console.log(`[zara-sync] ${new Date().toISOString()} ${message}`);
}

async function login() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha no login: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  cachedToken = data.token;
  log("Login administrativo realizado com sucesso.");
  return cachedToken;
}

async function getToken() {
  if (cachedToken) {
    return cachedToken;
  }
  return login();
}

async function sendTrack(currentTrack) {
  const token = await getToken();
  const response = await fetch(`${API_URL}/live`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentTrack,
    }),
  });

  if (response.status === 401) {
    cachedToken = null;
    log("Token expirado, renovando autenticação.");
    return sendTrack(currentTrack);
  }

  if (!response.ok) {
    throw new Error(`Falha ao enviar faixa: ${response.status} ${await response.text()}`);
  }

  const now = new Date().toISOString();
  fs.writeFileSync(
    STATUS_FILE,
    JSON.stringify(
      {
        currentTrack,
        lastSyncTime: now,
        connected: true,
      },
      null,
      2,
    ),
  );
  log(`Faixa sincronizada: ${currentTrack}`);
}

function readCurrentSong() {
  if (!ZARA_FILE_PATH) {
    throw new Error("ZARA_FILE_PATH não configurado.");
  }
  if (!fs.existsSync(ZARA_FILE_PATH)) {
    throw new Error(`Arquivo não encontrado: ${ZARA_FILE_PATH}`);
  }
  return fs.readFileSync(ZARA_FILE_PATH, "utf8").trim();
}

async function syncIfChanged() {
  try {
    const content = readCurrentSong();
    if (!content || content === lastContent) {
      return;
    }
    lastContent = content;
    await sendTrack(content);
  } catch (error) {
    fs.writeFileSync(
      STATUS_FILE,
      JSON.stringify(
        {
          currentTrack: lastContent || "",
          lastSyncTime: new Date().toISOString(),
          connected: false,
          error: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      ),
    );
    log(error instanceof Error ? error.message : String(error));
  }
}

function startWatcher() {
  log(`Monitorando arquivo: ${ZARA_FILE_PATH}`);
  syncIfChanged();

  try {
    fs.watch(ZARA_FILE_PATH, { persistent: true }, () => {
      void syncIfChanged();
    });
  } catch {
    log("fs.watch indisponível, usando polling a cada 5 segundos.");
  }

  setInterval(() => {
    void syncIfChanged();
  }, 5000);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórios.");
}

startWatcher();