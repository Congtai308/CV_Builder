import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { resumeSchema } from "@/lib/resume/schema";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const resume = await Resume.findById(id).lean();

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("GET resume error:", error);

    return NextResponse.json(
      { message: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const result = resumeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid resume data",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectDB();

    const resume = await Resume.findByIdAndUpdate(
      id,
      { $set: result.data },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("PUT resume error:", error);

    return NextResponse.json(
      { message: "Failed to update resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const resume = await Resume.findByIdAndDelete(id).lean();

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("DELETE resume error:", error);

    return NextResponse.json(
      { message: "Failed to delete resume" },
      { status: 500 }
    );
  }
}