import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/app/lib/mongodb";

const SCAN_STATUS = {
    PENDING: 'pending',
    REVIEWED: 'reviewed',
    CANCELLED: 'cancelled'
};

export async function POST(req) {
    try {
        const scanData = await req.json();
        
        // Validate required fields
        const requiredFields = ['imageUrl', 'description', 'username'];
        const missingFields = requiredFields.filter(field => !scanData[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Data tidak lengkap: ${missingFields.join(', ')}` 
                },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();

        // Create scan document with proper structure
        const scan = {
            username: scanData.username,
            imageUrl: scanData.imageUrl,
            description: {
                location: scanData.description.location,
                duration: scanData.description.duration,
                pain: parseInt(scanData.description.pain),
                symptoms: scanData.description.symptoms || [],
                notes: scanData.description.notes || ''
            },
            status: SCAN_STATUS.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            reviewInfo: {
                reviewedBy: null,
                reviewedAt: null,
                diagnosis: null,
                severity: null,
                recommendation: null
            }
        };

        const result = await db.collection("scans").insertOne(scan);

        return NextResponse.json({
            success: true,
            scanId: result.insertedId.toString(),
            message: "Scan berhasil disimpan",
            scan: {
                ...scan,
                _id: result.insertedId
            }
        });

    } catch (error) {
        console.error("Scan submission error:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Terjadi kesalahan saat menyimpan data scan" 
            },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const scanId = searchParams.get('id');
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                { success: false, error: "Username diperlukan" },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        
        // If scanId is provided, return specific scan for the user
        if (scanId) {
            const scan = await db.collection("scans").findOne({ 
                _id: new ObjectId(scanId),
                username: username
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
        }

        // Return all scans for the user
        const scans = await db.collection("scans")
            .find({ username: username })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ 
            success: true, 
            scans: scans.map(scan => ({
                ...scan,
                _id: scan._id.toString()
            }))
        });

    } catch (error) {
        console.error("Get scans error:", error);
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data scan" },
            { status: 500 }
        );
    }
}