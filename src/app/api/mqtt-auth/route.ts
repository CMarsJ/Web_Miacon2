import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Return the MQTT credentials from Vercel environment variables
    return NextResponse.json({
      url: process.env.MQTT_BROKER_URL || "",
      username: process.env.MQTT_USERNAME || "",
      password: process.env.MQTT_PASSWORD || "",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
