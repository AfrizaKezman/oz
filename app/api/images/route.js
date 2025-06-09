import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !ObjectId.isValid(id)) {
      return new NextResponse('Invalid image ID', { status: 400 });
    }

    const { db } = await connectToDatabase();
    const image = await db.collection('uploads').findOne({
      _id: new ObjectId(id)
    });

    if (!image?.data) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Set proper headers for image response
    return new NextResponse(image.data.buffer, {
      headers: {
        'Content-Type': image.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': image.data.buffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      },
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}