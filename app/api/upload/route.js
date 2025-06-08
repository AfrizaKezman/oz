import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { Binary } from "mongodb";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
    try {
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

        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        
        // Store file in MongoDB
        const result = await db.collection('uploads').insertOne({
            filename,
            contentType: file.type,
            uploadDate: new Date(),
            data: new Binary(buffer)
        });

        // Create API endpoint URL for retrieving the image
        const imageUrl = `/api/images/${result.insertedId}`;

        return NextResponse.json({
            success: true,
            imageUrl,
            size: buffer.length,
            type: file.type,
            _id: result.insertedId
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: "Terjadi kesalahan saat upload" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}