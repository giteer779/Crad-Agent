import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mysql from "mysql2/promise";
import cors from "cors";
import os from "os";
import path from "path";

// Load environment variables (.env file is assumed to be in the backend folder or workspace root)
// We check root directory as fallback
dotenv.config({ path: path.join(process.cwd(), ".env") });
dotenv.config();

// Memory buffer for logs
const logBuffer: { timestamp: string; type: "info" | "warn" | "error"; message: string }[] = [];

function addLog(type: "info" | "warn" | "error", ...args: any[]) {
  const message = args.map(arg => {
    if (arg instanceof Error) {
      return arg.stack || arg.message;
    }
    return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
  }).join(' ');
  logBuffer.push({
    timestamp: new Date().toISOString(),
    type,
    message
  });
  if (logBuffer.length > 200) {
    logBuffer.shift();
  }
}

// Override console methods to capture them
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

console.log = (...args) => {
  originalLog(...args);
  addLog("info", ...args);
};
console.warn = (...args) => {
  originalWarn(...args);
  addLog("warn", ...args);
};
console.error = (...args) => {
  originalError(...args);
  addLog("error", ...args);
};

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Helper to get local network IPv4 address
function getNetworkIp(): string | null {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

// Database connection pool
let pool: mysql.Pool | null = null;

function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "card_agent_db",
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// Database schema auto-migration
async function initDatabase() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_DATABASE || "card_agent_db";
  const port = Number(process.env.DB_PORT) || 3306;
  
  try {
    // Attempt database creation if it does not exist
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    
    const db = getDbPool();
    // Create conversations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(255) PRIMARY KEY,
        preset_id VARCHAR(255) NOT NULL,
        agent_name VARCHAR(255) NOT NULL,
        agent_role TEXT NOT NULL,
        temperature FLOAT NOT NULL,
        model VARCHAR(255) NOT NULL,
        grounding BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    
    // Create messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        timestamp VARCHAR(255) NOT NULL,
        sources TEXT DEFAULT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log(`Database "${database}" initialized successfully.`);
  } catch (err: any) {
    console.warn("Database initialization failed (running in offline/disconnected database mode):", err.message);
  }
}

// Lazy-initialize Google GenAI client to prevent crash if key is missing during startup
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fetch system running logs
app.get("/api/logs", (req, res) => {
  res.json(logBuffer);
});

// Clear system running logs
app.delete("/api/logs", (req, res) => {
  logBuffer.length = 0;
  res.json({ success: true });
});

// Check key exists API endpoint
app.get("/api/config", (req, res) => {
  res.json({
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Fetch saved conversation list
app.get("/api/conversations", async (req, res) => {
  try {
    const db = getDbPool();
    const [rows] = await db.query("SELECT * FROM conversations ORDER BY updated_at DESC");
    res.json(rows);
  } catch (err: any) {
    console.warn("Failed to fetch conversations from DB:", err.message);
    res.json([]); // Return empty list gracefully if DB is offline
  }
});

// Create a new conversation session
app.post("/api/conversations", async (req, res) => {
  try {
    const { id, preset_id, agent_name, agent_role, temperature, model, grounding } = req.body;
    const db = getDbPool();
    await db.query(
      "INSERT INTO conversations (id, preset_id, agent_name, agent_role, temperature, model, grounding) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, preset_id, agent_name, agent_role, temperature, model, grounding ? 1 : 0]
    );
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create conversation: " + err.message });
  }
});

// Load message history for a conversation
app.get("/api/conversations/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDbPool();
    const [rows]: any = await db.query("SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC", [id]);
    const messages = rows.map((r: any) => ({
      id: r.id,
      role: r.role,
      content: r.content,
      timestamp: r.timestamp,
      sources: r.sources ? JSON.parse(r.sources) : []
    }));
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch messages: " + err.message });
  }
});

// Delete a conversation session
app.delete("/api/conversations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDbPool();
    await db.query("DELETE FROM conversations WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete conversation: " + err.message });
  }
});

// Update a conversation session configurations
app.put("/api/conversations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { agent_name, agent_role, temperature, model, grounding } = req.body;
    const db = getDbPool();
    await db.query(
      "UPDATE conversations SET agent_name = ?, agent_role = ?, temperature = ?, model = ?, grounding = ? WHERE id = ?",
      [agent_name, agent_role, temperature, model, grounding ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(550).json({ error: "Failed to update conversation: " + err.message });
  }
});

// Proxy Gemini API route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, temperature, model, grounding, conversationId, userMessageId, assistantMessageId, apiKey } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Save user's message to DB if connection & ids are available
    if (conversationId && userMessageId) {
      try {
        const lastUserMsg = messages[messages.length - 1];
        if (lastUserMsg) {
          const db = getDbPool();
          await db.query(
            "INSERT INTO messages (id, conversation_id, role, content, timestamp, sources) VALUES (?, ?, ?, ?, ?, ?)",
            [userMessageId, conversationId, lastUserMsg.role, lastUserMsg.content, new Date().toISOString(), null]
          );
        }
      } catch (dbErr: any) {
        console.warn("Could not save user message to DB:", dbErr.message);
      }
    }

    let ai: GoogleGenAI;
    if (apiKey && typeof apiKey === "string" && apiKey.trim() !== "") {
      ai = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } else {
      ai = getAiClient();
    }

    // Map conversation messages to Gemini contents structure
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Build model config
    const config: any = {
      systemInstruction: systemInstruction || "You are a helpful AI Assistant in the Command Center.",
    };

    if (temperature !== undefined) {
      config.temperature = Number(temperature);
    }

    if (grounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const chosenModel = model || "gemini-3.5-flash";

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents,
      config,
    });

    const text = response.text || "";

    // Extract grounding sources search URLs if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks
      ? groundingMetadata.groundingChunks
          .map((c: any) => ({
            title: c.web?.title || c.web?.uri || "Web Grounding Source",
            uri: c.web?.uri || "",
          }))
          .filter((s: any) => s.uri)
      : [];

    // Save assistant's response to DB
    if (conversationId && assistantMessageId) {
      try {
        const db = getDbPool();
        await db.query(
          "INSERT INTO messages (id, conversation_id, role, content, timestamp, sources) VALUES (?, ?, ?, ?, ?, ?)",
          [assistantMessageId, conversationId, "assistant", text, new Date().toISOString(), sources ? JSON.stringify(sources) : null]
        );
        // Update updated_at of the conversation to keep order accurate
        await db.query("UPDATE conversations SET updated_at = NOW() WHERE id = ?", [conversationId]);
      } catch (dbErr: any) {
        console.warn("Could not save assistant response to DB:", dbErr.message);
      }
    }

    res.json({
      content: text,
      sources,
    });
  } catch (error: any) {
    console.error("Gemini API server proxy error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during the assistant query.",
    });
  }
});

// Start Express Server
async function start() {
  // Initialize database schema
  await initDatabase();

  app.listen(PORT, "0.0.0.0", () => {
    const networkIp = getNetworkIp();
    console.log("\n  ⚙️  Command Center API Backend Server is ready:");
    console.log(`  - Local:   http://localhost:${PORT}`);
    if (networkIp) {
      console.log(`  - Network: http://${networkIp}:${PORT}`);
    }
    console.log("");
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
