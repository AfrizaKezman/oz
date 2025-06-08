import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req) {
  try {
    const { userId, scanId, description } = await req.json();
    
    const { db } = await connectToDatabase();

    // Create consultation request
    const consultation = {
      userId,
      scanId,
      description,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptedBy: null,
      chatId: null
    };

    const result = await db.collection("consultations").insertOne(consultation);

    return NextResponse.json({
      success: true,
      consultationId: result.insertedId.toString(),
      message: "Permintaan konsultasi berhasil dikirim"
    });

  } catch (error) {
    console.error("Consultation request error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat permintaan konsultasi" },
      { status: 500 }
    );
  }
}