import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * 🤖 GEMINI AI SCANNER ROUTE
 * Yeh route image receive karega, Gemini ko bhejega, aur Odometer Reading wapas karega.
 */

// API Key Load Karo (Server Side Environment Variable)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Data Receive Karo
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // 2. Image ko Bytes mein convert karo (Gemini format)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // 3. AI Model Select Karo (Gemini 1.5 Flash - Fastest & Cheapest)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Prompt Engineering (The Magic ✨)
    // Hum AI ko strict instruction de rahe hain ki sirf digits extract kare.
    const prompt = `
      Analyze this image of a vehicle dashboard/odometer.
      Extract the numeric odometer reading.
      Rules:
      1. Return ONLY the number (digits). 
      2. Do NOT include units like 'km' or 'miles'.
      3. Do NOT include decimals unless clearly visible.
      4. If the image is blurry or not an odometer, return exactly "ERROR".
    `;

    // 5. Generate Content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type || "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text().trim();

    // 6. Validation
    if (responseText === "ERROR" || isNaN(Number(responseText))) {
      return NextResponse.json(
        { error: "Could not read odometer. Please try again." }, 
        { status: 422 }
      );
    }

    // Success! Number wapas bhejo
    return NextResponse.json({ reading: responseText });

  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return NextResponse.json(
      { error: "AI Service Failed. Check Server Logs." }, 
      { status: 500 }
    );
  }
}