import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id || !ObjectId.isValid(id)) {
    return new NextResponse('Invalid image ID', { status: 400 });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(process.env.MONGODB_DB);
    const image = await db.collection('uploads').findOne({
      _id: new ObjectId(id)
    });

    if (!image || !image.data) {
      return new NextResponse('Image not found', { status: 404 });
    }

    return new NextResponse(image.data.buffer, {
      headers: {
        'Content-Type': image.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}