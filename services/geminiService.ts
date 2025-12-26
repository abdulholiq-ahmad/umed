import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization to prevent crash on module load if env is missing
let aiInstance: GoogleGenerativeAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY || '';
    // If apiKey is empty, this might throw later, but we avoid module-level crash
    aiInstance = new GoogleGenerativeAI(apiKey);
  }
  return aiInstance;
};

export const analyzeMedicalDocument = async (base64Image: string, userContext: string) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");

    const ai = getAI();
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      },
      {
        text: `Role: Siz "UMED" ilovasi uchun yuqori malakali tibbiy AI assistentisiz.
        Context: Foydalanuvchi (${userContext}) o'z tibbiy hujjati yoki alomatining rasmini yukladi.
        Task: Rasmni tahlil qiling va shifokorga taqdim etish uchun strukturalashgan hisobot tayyorlang.

        Output JSON format (Strictly clean JSON, no markdown):
        {
          "title": "Qisqa tibbiy sarlavha (masalan: Qon tahlili: Umumiy)",
          "summary": "Bemor tushunadigan oddiy tilda 2 gaplik xulosa.",
          "doctorNotes": "SHIFOKOR UCHUN: Texnik terminlar, aniqlangan patologiyalar yoki e'tibor berish kerak bo'lgan ko'rsatkichlar ro'yxati (Professional tilda).",
          "riskLevel": "Low" | "Medium" | "High",
          "recommendation": "Bemorga keyingi qadam uchun qisqa ko'rsatma (masalan: Kardiologga uchrashish zarur)."
        }

        Agar rasm tibbiy bo'lmasa: {"error": "Tibbiy ma'lumot aniqlanmadi"}`
      },
    ]);

    const response = await result.response;
    const text = response.text() || '';
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw {
        title: "Tahlil Xatosi",
        summary: "Tasvirni to'liq o'qib bo'lmadi. Iltimos, sifatliroq rasm yuklang.",
        doctorNotes: "AI tasvirni aniqlay olmadi.",
        riskLevel: "Low",
        recommendation: "Qayta urinib ko'ring."
    };
  }
};

export const getHealthInsights = async (history: string) => {
  try {
     const apiKey = process.env.API_KEY;
     if (!apiKey) throw new Error("API Key is missing");

     const ai = getAI();
     const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

     const result = await model.generateContent(
       `Quyidagi bemor tarixini tahlil qiling va qisqacha tendentsiya tahlilini bering: ${history}. Javob o'zbek tilida, ruhlantiruvchi va professional bo'lsin.`
     );

     const response = await result.response;
     return response.text();
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Ayni paytda tahlil yaratib bo'lmadi.";
  }
};

export const chatWithAI = async (message: string, context: string) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");

    const ai = getAI();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(
      `Siz UMED ilovasida professional oilaviy shifokor maslahatchisisiz.

      Bemor ma'lumotlari: ${context}

      Foydalanuvchi savoli: ${message}

      Qoidalar:
      1. Javob qisqa, aniq va O'zbek tilida bo'lsin.
      2. Agar savol jiddiy kasallik haqida bo'lsa, albatta shifokorga ko'rinishni maslahat bering.
      3. Do'stona, ammo professional ohangda gapiring.`
    );

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Chat Error:", error);
    return "Uzr, ayni damda bog'lana olmadim. Iltimos, keyinroq urinib ko'ring.";
  }
};
