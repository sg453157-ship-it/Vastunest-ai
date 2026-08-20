import { generateRoomDesignImage } from "./_lib/imageProvider.js";

// POST /api/generate-room-design
// Body: { roomImage: string (data URL or base64), prompt: string }
// This route runs on the server only — the browser never sees
// IMAGE_PROVIDER_API_KEY. It simply validates the request and
// delegates to generateRoomDesignImage() in _lib/imageProvider.js.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed", message: "Use POST." });
    return;
  }

  const { roomImage, prompt } = req.body || {};

  if (!roomImage || !prompt) {
    res.status(400).json({
      error: "bad_request",
      message: "Both roomImage and prompt are required.",
    });
    return;
  }

  try {
    const result = await generateRoomDesignImage(roomImage, prompt);
    res.status(200).json(result);
  } catch (err) {
    if (err.code === "PROVIDER_NOT_CONFIGURED") {
      res.status(501).json({ error: "not_configured", message: err.message });
      return;
    }
    console.error("generate-room-design error:", err);
    res.status(500).json({
      error: "generation_failed",
      message: "Something went wrong while generating the design. Please try again.",
    });
  }
}
