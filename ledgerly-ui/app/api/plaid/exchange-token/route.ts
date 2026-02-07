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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { public_token } = body ?? {};
    if (!public_token) {
      return NextResponse.json({ error: "public_token missing" }, { status: 400 });
    }

    const resp = await client.itemPublicTokenExchange({ public_token });
    return NextResponse.json(resp.data);
  } catch (err: any) {
    console.error("Plaid itemPublicTokenExchange error:", err?.response?.data ?? err.message ?? err);
    return NextResponse.json({ error: "failed to exchange token" }, { status: 500 });
  }
}
