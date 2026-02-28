import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsage } from "@/lib/usage";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const userId = session?.user?.email ?? `anon:${ip}`;
  const tier = session ? "pro" : "free";
  const usage = getUsage(userId, tier as "free" | "pro");

  return Response.json(usage);
}
