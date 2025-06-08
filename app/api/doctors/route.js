import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Fetch all doctors or specific doctor
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    const { db } = await connectToDatabase();

    // If ID is provided, fetch specific doctor
    if (id) {
      const doctor = await db.collection("users").findOne(
        { _id: new ObjectId(id), role: "doctor" },
        { projection: { password: 0 } } // Exclude password
      );

      if (!doctor) {
        return NextResponse.json(
          { success: false, error: "Dokter tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, doctor });
    }

    // Fetch all active doctors
    const doctors = await db.collection("users")
      .find({ 
        role: "doctor",
        active: true 
      })
      .project({ 
        password: 0,
        email: 0,
        // Only return necessary fields
        name: 1,
        specialty: 1,
        hospital: 1,
        image: 1,
        description: 1,
        available: 1
      })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      doctors,
      count: doctors.length
    });

  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data dokter" },
      { status: 500 }
    );
  }
}

// POST - Add new doctor
export async function POST(req) {
  try {
    const doctorData = await req.json();
    const { db } = await connectToDatabase();

    const result = await db.collection("users").insertOne({
      ...doctorData,
      role: "doctor",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      doctorId: result.insertedId,
      message: "Dokter berhasil ditambahkan"
    });

  } catch (error) {
    console.error("Error adding doctor:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan dokter" },
      { status: 500 }
    );
  }
}

// PATCH - Update doctor status/info
export async function PATCH(req) {
  try {
    const { id, ...updateData } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID dokter diperlukan" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id), role: "doctor" },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Dokter tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data dokter berhasil diperbarui"
    });

  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data dokter" },
      { status: 500 }
    );
  }
}