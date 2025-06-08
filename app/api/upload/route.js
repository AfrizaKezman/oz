import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req) {
    try {
        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "File tidak ditemukan" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP" },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename with sanitization
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}-${sanitizedName}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Save file with error handling
        try {
            await writeFile(filepath, buffer);
        } catch (writeError) {
            console.error("File write error:", writeError);
            return NextResponse.json(
                { success: false, error: "Gagal menyimpan file" },
                { status: 500 }
            );
        }

        // Return success with relative URL
        return NextResponse.json({
            success: true,
            imageUrl: `/uploads/${filename}`,
            size: buffer.length,
            type: file.type
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan saat upload" },
            { status: 500 }
        );
    }
}