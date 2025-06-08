import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("orders").insertOne({
      ...data,
      createdAt: new Date(), // pastikan ada timestamp
    });
    return Response.json({ success: true, id: result.insertedId });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

// (Opsional) Tambahkan GET untuk mengambil data orders (misal untuk admin/user)
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const url = new URL(req.url);
    const user = url.searchParams.get("user");
    let filter = {};
    if (user) filter.user = user;
    const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray();
    return Response.json({ success: true, orders });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}