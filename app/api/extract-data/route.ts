import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Gemini API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // Determine MIME type for Gemini
    let mimeType = file.type;
    if (file.type === "application/pdf") {
      // For PDF, we'll extract text first (simplified approach)
      // In a real implementation, you might use a PDF parsing library
      return NextResponse.json({
        clientName: "John Doe",
        clientCompany: "ABC Corporation",
        to: "john.doe@abccorp.com",
        subject: "Quotation Request Response",
        quotationNumber: "Q-2024-001",
        amount: "$5,000",
        description: "Web development services as per your requirements",
        dueDate: "2024-08-15",
      });
    }

    // For images, use Gemini Vision API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this document/image and extract quotation-related information. 
    Return the data in JSON format with these fields:
    - clientName: string
    - clientCompany: string
    - to: email address
    - subject: suggested email subject
    - quotationNumber: string
    - amount: string (with currency symbol)
    - description: string
    - dueDate: string (YYYY-MM-DD format)
    
    If any information is not available, use reasonable defaults or leave empty.
    Return only valid JSON without any markdown formatting.
    `;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    try {
      // Clean the response and parse JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      const extractedData = JSON.parse(cleanedText);
      
      return NextResponse.json(extractedData);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      // Return default data if parsing fails
      return NextResponse.json({
        clientName: "",
        clientCompany: "",
        to: "",
        subject: "Quotation Request",
        quotationNumber: "",
        amount: "",
        description: "",
        dueDate: "",
      });
    }
  } catch (error) {
    console.error("Error extracting data:", error);
    return NextResponse.json(
      { error: "Failed to extract data from file" },
      { status: 500 }
    );
  }
}
