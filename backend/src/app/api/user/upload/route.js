import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const runtime = "nodejs"; // IMPORTANT (so fs works)

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image"); // must be "image"

    if (!file) {
      return NextResponse.json({ message: "No file uploaded. Field name must be 'image'." }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ message: "Only image files are allowed (jpg, png, webp, gif)." }, { status: 400 });
    }

    // Create unguessable filename
    const ext = file.type === "image/jpeg" ? "jpg"
      : file.type === "image/png" ? "png"
      : file.type === "image/webp" ? "webp"
      : file.type === "image/gif" ? "gif"
      : "img";

    const randomName = crypto.randomBytes(16).toString("hex") + "." + ext;

    // Save to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadPath = path.join(process.cwd(), "public", "uploads", randomName);

    await fs.writeFile(uploadPath, buffer);

    // Return public URL path
    return NextResponse.json({ imageUrl: `/uploads/${randomName}` }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Upload failed", error: err.message }, { status: 500 });
  }
}
