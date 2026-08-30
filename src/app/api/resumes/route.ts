import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { resumeSchema } from "@/lib/resume/schema";

// GET /api/resumes
export async function GET() {
  try {
    await connectDB();

    const resumes = await Resume.find({})
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error("GET /api/resumes error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể lấy danh sách CV",
      },
      { status: 500 }
    );
  }
}

// POST /api/resumes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("POST /api/resumes body:", body);

    const result = resumeSchema.safeParse(body);

    if (!result.success) {
      console.error(
        "Resume validation error:",
        result.error.flatten()
      );

      return NextResponse.json(
        {
          message: "Dữ liệu CV không hợp lệ",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectDB();

    const resume = await Resume.create(result.data);

    return NextResponse.json(resume, {
      status: 201,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    return NextResponse.json(
      {
        message: "Failed to create resume",
      },
      {
        status: 500,
      }
    );
  }
}