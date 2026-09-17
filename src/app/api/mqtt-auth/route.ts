import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.password !== "Miacon2") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the environment variables from Vercel
    return NextResponse.json({
      url: process.env.MQTT_BROKER_URL || "",
      username: process.env.MQTT_USERNAME || "",
      password: process.env.MQTT_PASSWORD || "",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
