import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const pendingScans = await db.collection("scans")
      .find({ 
        status: "pending",
        deletedAt: { $exists: false } 
      })
      .sort({ createdAt: -1 })
      .project({
        imageUrl: 1,
        description: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        _id: 1
      })
      .toArray();

    const formattedScans = pendingScans.map(scan => ({
      _id: scan._id.toString(),
      imageUrl: scan.imageUrl,
      description: scan.description || {
        location: 'Tidak ditentukan',
        duration: '0',
        pain: '0'
      },
      status: scan.status,
      username: scan.username,
      createdAt: new Date(scan.createdAt).toLocaleString('id-ID'),
      updatedAt: scan.updatedAt ? 
        new Date(scan.updatedAt).toLocaleString('id-ID') : 
        new Date(scan.createdAt).toLocaleString('id-ID')
    }));

    return NextResponse.json({
      success: true,
      scans: formattedScans
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data scan" },
      { status: 500 }
    );
  }
}