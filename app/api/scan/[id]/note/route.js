import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { notes } = await req.json();

    const { db } = await connectToDatabase();

    const result = await db.collection("scans").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          additionalNotes: notes,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Scan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scan: {
        ...result,
        _id: result._id.toString()
      }
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui catatan" },
      { status: 500 }
    );
  }
}