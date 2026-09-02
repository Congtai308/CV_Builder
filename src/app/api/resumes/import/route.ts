import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { resumeSchema } from "@/lib/resume/schema";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

/*
 * =========================================================
 * PROMPT
 * =========================================================
 */

function buildPrompt(rawText: string) {
  return `Bạn là công cụ trích xuất dữ liệu CV. Dưới đây là nội dung text thô trích từ 1 file PDF CV/Resume. Hãy đọc và trả về DUY NHẤT một JSON object hợp lệ (không kèm giải thích, không markdown code fence) đúng theo cấu trúc sau:

{
  "personal": {
    "name": string,
    "title": string,
    "email": string,
    "phone": string,
    "location": string,
    "website": string,
    "github": string,
    "linkedin": string
  },
  "summary": string,
  "education": [
    {
      "id": string (tự sinh chuỗi ngẫu nhiên),
      "school": string,
      "degree": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "description": string
    }
  ],
  "experience": [
    {
      "id": string (tự sinh chuỗi ngẫu nhiên),
      "company": string,
      "position": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "description": string[] (mỗi phần tử là 1 bullet point)
    }
  ],
  "projects": [
    {
      "id": string (tự sinh chuỗi ngẫu nhiên),
      "name": string,
      "role": string,
      "url": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "description": string[]
    }
  ],
  "skills": {
    "languages": string (danh sách phân cách bởi dấu phẩy),
    "frameworks": string,
    "tools": string,
    "databases": string,
    "cloud": string
  },
  "certifications": [
    {
      "id": string (tự sinh chuỗi ngẫu nhiên),
      "name": string,
      "issuer": string,
      "year": string
    }
  ]
}

QUY TẮC:
- Nếu không tìm thấy thông tin nào, để giá trị là chuỗi rỗng "" (không được bỏ field, không được null).
- Với các trường mảng, nếu không có thông tin thì trả về mảng rỗng [].
- KHÔNG bịa đặt thông tin không có trong văn bản gốc.
- CHỈ trả về JSON thuần túy, không thêm bất kỳ chữ nào khác trước hoặc sau, không bọc trong markdown code fence.

Nội dung CV:
"""
${rawText}
"""`;
}

/*
 * =========================================================
 * POST
 * =========================================================
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Không có file được gửi lên." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Chỉ hỗ trợ file PDF." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File PDF quá lớn (giới hạn 10MB)." },
        { status: 400 }
      );
    }

    /*
     * TRÍCH XUẤT TEXT TỪ PDF
     */

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const t1 = Date.now();
const parsed = await pdfParse(buffer);
console.log("PDF parse time:", Date.now() - t1, "ms");

let rawText = parsed.text.trim();

if (rawText.length > 8000) {
  rawText = rawText.slice(0, 8000);
}
    
    
    // Giới hạn để giảm thời gian xử lý, CV thường không cần quá 8000 ký tự
    
    if (!rawText) {
      return NextResponse.json(
        {
          message:
            "Không đọc được nội dung từ file PDF này (có thể là file scan ảnh, không phải PDF text).",
        },
        { status: 400 }
      );
    }

    /*
     * GỌI GEMINI API
     */

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        temperature: 0.2,
      },
    });

    const t2 = Date.now();
    const result = await model.generateContent(buildPrompt(rawText));
    console.log("Gemini call time:", Date.now() - t2, "ms");
    const responseText = result.response.text();

    /*
     * PARSE JSON TỪ RESPONSE
     */

    let extractedData: unknown;

    try {
      const cleaned = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
    
      extractedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error(
        "JSON parse error:",
        parseError,
        "Response length:",
        responseText.length,
        "Last 200 chars:",
        responseText.slice(-200)
      );
    
      return NextResponse.json(
        {
          message:
            "CV của bạn có nội dung khá dài, AI chưa xử lý hết được. Vui lòng thử lại hoặc rút gọn bớt nội dung PDF.",
        },
        { status: 502 }
      );
    }

    /*
     * VALIDATE BẰNG ZOD
     */

    const validated = resumeSchema.safeParse(extractedData);

    if (!validated.success) {
      console.error("Validation error:", validated.error.flatten());

      return NextResponse.json(
        {
          message: "Dữ liệu trích xuất không hợp lệ.",
          errors: validated.error.flatten(),
        },
        { status: 422 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (error) {
    console.error("Import resume error:", error);

    return NextResponse.json(
      { message: "Không thể import CV. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}