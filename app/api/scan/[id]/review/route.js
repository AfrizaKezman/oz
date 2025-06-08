import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/app/lib/mongodb";

// GET handler for fetching scan details
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToDatabase();
    
    const scan = await db.collection("scans").findOne({ 
      _id: new ObjectId(id) 
    });

    if (!scan) {
      return NextResponse.json(
        { success: false, error: "Scan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scan: {
        ...scan,
        _id: scan._id.toString()
      }
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data scan" },
      { status: 500 }
    );
  }
}

// POST handler for submitting review
export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { diagnosis, recommendation, reviewedBy } = await req.json();

    // Validate required fields
    if (!diagnosis || !recommendation || !reviewedBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Data review tidak lengkap" 
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Update scan with review information
    const result = await db.collection("scans").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'reviewed',
          updatedAt: new Date(),
          reviewInfo: {
            diagnosis,
            recommendation,
            reviewedBy,
            reviewedAt: new Date(),
            severity: null // You can add severity assessment if needed
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Scan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch updated scan
    const updatedScan = await db.collection("scans").findOne({ 
      _id: new ObjectId(id) 
    });

    return NextResponse.json({
      success: true,
      message: "Review berhasil disimpan",
      scan: {
        ...updatedScan,
        _id: updatedScan._id.toString()
      }
    });

  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal menyimpan review" 
      },
      { status: 500 }
    );
  }
}