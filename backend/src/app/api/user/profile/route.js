import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

async function ensureProfileFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PROFILE_FILE);
  } catch {
    const defaultProfile = {
      id: 1,
      firstName: "",
      lastName: "",
      email: "",
      profileImage: ""
    };
    await fs.writeFile(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2));
  }
}

export async function GET() {
  await ensureProfileFile();
  const data = await fs.readFile(PROFILE_FILE, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function PUT(req) {
  await ensureProfileFile();
  const body = await req.json();

  const { firstName, lastName, email, profileImage } = body;

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { message: "firstName, lastName, and email are required." },
      { status: 400 }
    );
  }

  const existing = JSON.parse(await fs.readFile(PROFILE_FILE, "utf-8"));

  const updated = {
    ...existing,
    firstName,
    lastName,
    email,
    profileImage: profileImage ?? existing.profileImage
  };

  await fs.writeFile(PROFILE_FILE, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
