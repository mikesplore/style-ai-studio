
import { auth } from "@/auth";
import { GoogleDriveService } from "@/lib/google-drive";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await request.json();
    if (!fileId) {
        return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    const driveService = new GoogleDriveService(session.accessToken);
    await driveService.deleteFile(fileId);

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting from Drive:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
