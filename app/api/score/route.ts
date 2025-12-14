import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const factors = body.factors as {
    key: string;
    enabled: boolean;
    weight: number;
  }[];

  const active = factors.filter((f) => f.enabled);

  if (active.length === 0) {
    return NextResponse.json({ score: null });
  }

  let totalWeight = 0;

  active.forEach((f) => {
    totalWeight += f.weight;
  });

  const maxWeight = active.length * 5;

  const score = Math.round((totalWeight / maxWeight) * 100);

  return NextResponse.json({ score });
}
