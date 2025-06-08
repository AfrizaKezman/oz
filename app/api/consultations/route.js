import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();

    // Get all consultations for doctor's dashboard
    const consultations = await db.collection("consultations")
      .find({})
      .sort({ updatedAt: -1 })
      .project({
        _id: 1,
        username: 1,
        messages: 1,
        status: 1,
        updatedAt: 1,
        createdAt: 1
      })
      .toArray();

    return NextResponse.json({
      success: true,
      consultations: consultations.map(c => ({
        ...c,
        _id: c._id.toString()
      }))
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data konsultasi" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, username, role } = body;

    if (!content || !username) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("consultations").findOneAndUpdate(
      { username },
      {
        $push: { 
          messages: {
            content,
            role: role || 'user',
            timestamp: new Date().toISOString()
          }
        },
        $set: { 
          status: 'unread',
          updatedAt: new Date()
        },
        $setOnInsert: { 
          username,
          createdAt: new Date()
        }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );

    return NextResponse.json({
      success: true,
      messages: result.messages
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}