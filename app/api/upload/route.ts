import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file received in request");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with sanitization
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const sanitizedName =
      Date.now().toString() + "-" + Math.random().toString(36).substring(2);
    const fileName = `${sanitizedName}.${fileExt}`;

    console.log("Attempting upload with filename:", fileName);

    // Create storage reference
    const storageRef = ref(storage, `business-photos/${fileName}`);

    try {
      // Upload file
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: file.type,
      });
      console.log("Upload successful:", snapshot);

      // Get download URL
      const url = await getDownloadURL(storageRef);
      console.log("Download URL obtained:", url);

      return NextResponse.json({ url });
    } catch (uploadError: any) {
      console.error(
        "Firebase upload error:",
        uploadError.message,
        uploadError.code
      );
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("General upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
