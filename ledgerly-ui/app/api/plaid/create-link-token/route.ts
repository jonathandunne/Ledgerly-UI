import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

export const runtime = "nodejs";

const env = process.env.PLAID_ENV ?? "sandbox";
const configuration = new Configuration({
  basePath: (PlaidEnvironments as any)[env],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID ?? "",
      "PLAID-SECRET": process.env.PLAID_SECRET ?? "",
    },
  },
});
const client = new PlaidApi(configuration);

export async function GET() {
  try {
    // Validate env vars before calling Plaid
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      const missing = [];
      if (!process.env.PLAID_CLIENT_ID) missing.push("PLAID_CLIENT_ID");
      if (!process.env.PLAID_SECRET) missing.push("PLAID_SECRET");
      console.error("Missing Plaid env vars:", missing);
      return NextResponse.json({ error: `Missing env vars: ${missing.join(", ")}` }, { status: 500 });
    }

    const clientUserId = process.env.PLAID_CLIENT_USER_ID ?? `${Date.now()}`;
    const response = await client.linkTokenCreate({
      user: { client_user_id: clientUserId },
      client_name: "Ledgerly",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Plaid linkTokenCreate error:", err?.response?.data ?? err.message ?? err);
    return NextResponse.json({ error: "failed to create link token", details: err?.message }, { status: 500 });
  }
}
