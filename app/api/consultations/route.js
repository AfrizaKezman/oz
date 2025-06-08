import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// Add common headers and response helpers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

const createResponse = (data, status = 200) => {
  return NextResponse.json(data, { 
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const { db } = await connectToDatabase();

    if (username) {
      const consultation = await db.collection("consultations").findOne(
        { username },
        {
          sort: { updatedAt: -1 },
          projection: {
            messages: {
              $slice: -50 // Get last 50 messages only
            },
            status: 1,
            updatedAt: 1,
            createdAt: 1
          }
        }
      );

      // Transform consultation data with safe message handling
      const transformedConsultation = consultation ? {
        ...consultation,
        _id: consultation._id.toString(),
        messages: (consultation.messages || []).map(msg => ({
          ...msg,
          _id: msg._id ? msg._id.toString() : new ObjectId().toString() // Provide fallback ID
        }))
      } : null;

      return createResponse({
        success: true,
        consultation: transformedConsultation
      });
    }

    // Get all consultations for doctor's dashboard
    const consultations = await db.collection("consultations")
      .find({})
      .sort({ updatedAt: -1 })
      .project({
        username: 1,
        messages: { $slice: -1 },
        status: 1,
        updatedAt: 1,
        createdAt: 1,
        unreadCount: {
          $size: {
            $filter: {
              input: "$messages",
              cond: { $eq: ["$$this.status", "unread"] }
            }
          }
        }
      })
      .toArray();

    // Transform consultations with safe message handling
    const transformedConsultations = consultations.map(c => ({
      ...c,
      _id: c._id.toString(),
      messages: (c.messages || []).map(msg => ({
        ...msg,
        _id: msg._id ? msg._id.toString() : new ObjectId().toString() // Provide fallback ID
      }))
    }));

    return createResponse({
      success: true,
      consultations: transformedConsultations
    });

  } catch (error) {
    console.error("Error in GET /api/consultations:", error);
    return createResponse(
      { 
        success: false, 
        error: "Gagal mengambil data konsultasi",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      500
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, username, role } = body;

    if (!content?.trim() || !username) {
      return createResponse(
        { success: false, error: "Data tidak lengkap" },
        400
      );
    }

    const { db } = await connectToDatabase();
    const messageId = new ObjectId();
    const timestamp = new Date();

    const result = await db.collection("consultations").findOneAndUpdate(
      { username },
      {
        $push: { 
          messages: {
            _id: messageId,
            content: content.trim(),
            role: role || 'user',
            timestamp: timestamp.toISOString(),
            status: 'unread'
          }
        },
        $set: { 
          status: 'active',
          updatedAt: timestamp
        },
        $setOnInsert: { 
          username,
          createdAt: timestamp
        }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );

    if (!result.value) {
      throw new Error("Failed to save message");
    }

    return createResponse({
      success: true,
      consultation: {
        ...result.value,
        _id: result.value._id.toString(),
        messages: result.value.messages.map(msg => ({
          ...msg,
          _id: msg._id.toString()
        }))
      }
    });

  } catch (error) {
    console.error("Error in POST /api/consultations:", error);
    return createResponse(
      { success: false, error: "Gagal mengirim pesan" },
      500
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}