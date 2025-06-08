import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET(req, { params }) {
    try {
        const { id } = params;

        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        
        const file = await db.collection('uploads').findOne({
            _id: new ObjectId(id)
        });

        if (!file) {
            return NextResponse.json(
                { error: "Image not found" },
                { status: 404 }
            );
        }

        // Create response with proper content type
        return new NextResponse(file.data.buffer, {
            headers: {
                'Content-Type': file.contentType,
                'Cache-Control': 'public, max-age=31536000',
            },
        });

    } catch (error) {
        console.error("Error retrieving image:", error);
        return NextResponse.json(
            { error: "Failed to retrieve image" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}