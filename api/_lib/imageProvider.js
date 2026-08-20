// ------------------------------------------------------------------
// IMAGE PROVIDER ABSTRACTION
// ------------------------------------------------------------------
// This is the ONE place the app calls to turn a room photo + a
// design prompt into a redesigned room image. The UI and the API
// route never talk to an image provider directly — they only call
// generateRoomDesignImage() below. That means a real provider can be
// plugged in later without touching any other file.
//
// >>> TODO (developer setup step — not done yet) <<<
// No image-generation provider is connected. To enable real AI room
// visualization:
//   1. Pick a provider that supports image-to-image / image editing
//      (e.g. an OpenAI image model, Google's Gemini image model, or
//      Stability AI's image-to-image endpoint).
//   2. Add its secret key as a Vercel Environment Variable named
//      IMAGE_PROVIDER_API_KEY — Vercel dashboard → your project →
//      Settings → Environment Variables. NEVER put this key in any
//      file under /src (that code ships to the browser).
//   3. Replace the body of generateRoomDesignImage() below with a
//      real fetch() call to that provider, reading the key from
//      process.env.IMAGE_PROVIDER_API_KEY (server-side only).
//   4. Return { imageUrl: "..." } or { imageBase64: "..." } — the
//      API route and the frontend already expect one of those two
//      shapes, so no other file needs to change.
// ------------------------------------------------------------------

export async function generateRoomDesignImage(roomImageBase64, designPrompt) {
  const apiKey = process.env.IMAGE_PROVIDER_API_KEY;

  if (!apiKey) {
    const err = new Error(
      "Image generation provider is not configured yet. Add IMAGE_PROVIDER_API_KEY in Vercel's Environment Variables and implement generateRoomDesignImage() in api/_lib/imageProvider.js."
    );
    err.code = "PROVIDER_NOT_CONFIGURED";
    throw err;
  }

  // >>> Real provider call goes here once IMAGE_PROVIDER_API_KEY exists <<<
  //
  // Example shape (replace with your chosen provider's real request —
  // every provider's request/response format is different):
  //
  // const response = await fetch("https://api.your-image-provider.com/v1/edits", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${apiKey}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     image: roomImageBase64,
  //     prompt: designPrompt,
  //   }),
  // });
  // const data = await response.json();
  // return { imageUrl: data.output_url };

  throw new Error(
    "IMAGE_PROVIDER_API_KEY is set, but generateRoomDesignImage() still needs the real provider call implemented (see TODO above)."
  );
}
