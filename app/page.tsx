"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MapView from "@/components/MapView";


type Factor = {
  key: string;
  label: string;
  enabled: boolean;
  weight: number; // 1–5 importance
  group: "location" | "lifestyle" | "transport";
  icon: string;
};

export default function Home() {
  const [factors, setFactors] = useState<Factor[]>([
    // 📍 LOCATION
    {
      key: "city_center",
      label: "Distance from city center",
      enabled: false,
      weight: 1,
      group: "location",
      icon: "🏙️",
    },
    {
      key: "water",
      label: "Distance from sea / lake",
      enabled: false,
      weight: 1,
      group: "location",
      icon: "🌊",
    },

    // 🚇 TRANSPORT
    {
      key: "public_transport",
      label: "Public transport access",
      enabled: false,
      weight: 1,
      group: "transport",
      icon: "🚇",
    },
    {
      key: "airport",
      label: "Distance from airport",
      enabled: false,
      weight: 1,
      group: "transport",
      icon: "✈️",
    },
    {
      key: "train_station",
      label: "Distance from train station",
      enabled: false,
      weight: 1,
      group: "transport",
      icon: "🚆",
    },

    // 🍽️ LIFESTYLE
    {
      key: "restaurants",
      label: "Restaurants nearby",
      enabled: false,
      weight: 1,
      group: "lifestyle",
      icon: "🍽️",
    },
    {
      key: "cafes",
      label: "Cafes nearby",
      enabled: false,
      weight: 1,
      group: "lifestyle",
      icon: "☕",
    },
    {
      key: "nightlife",
      label: "Nightlife nearby",
      enabled: false,
      weight: 1,
      group: "lifestyle",
      icon: "🌙",
    },
    {
      key: "parks",
      label: "Parks nearby",
      enabled: false,
      weight: 1,
      group: "lifestyle",
      icon: "🌳",
    },
    {
      key: "grocery",
      label: "Grocery stores nearby",
      enabled: false,
      weight: 1,
      group: "lifestyle",
      icon: "🛒",
    },
  ]);

  const groups = {
    location: "📍 Location",
    transport: "🚇 Transport",
    lifestyle: "🍽️ Lifestyle",
  };

  const scoreColor = (score: number) => {
    if (score < 40) return "text-red-500";
    if (score < 60) return "text-orange-500";
    if (score < 80) return "text-blue-500";
    return "text-green-500";
  };
  const breakdownBarColor = (value: number) => {
  if (value < 4) return "bg-gray-300";
  if (value < 6) return "bg-blue-300";
  if (value < 8) return "bg-blue-500";
  return "bg-green-500";
};

  const getMockFactorScore = (key: string) => {
  const mockScores: Record<string, number> = {
    city_center: 7.4,
    water: 5.2,
    public_transport: 8.8,
    airport: 6.1,
    train_station: 7.0,
    restaurants: 8.6,
    cafes: 7.9,
    nightlife: 6.5,
    parks: 8.2,
    grocery: 9.1,
  };

  return mockScores[key] ?? 6.0;
};


  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleFactor = (index: number) => {
    const updated = [...factors];
    updated[index].enabled = !updated[index].enabled;
    setFactors(updated);
  };

  const updateWeight = (index: number, value: number) => {
    const updated = [...factors];
    updated[index].weight = value;
    setFactors(updated);
  };

  const calculateScore = async () => {
    setLoading(true);

    const response = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        factors: factors.map((f) => ({
          key: f.key,
          enabled: f.enabled,
          weight: f.weight,
        })),
      }),
    });

    const data = await response.json();
    setScore(data.score);
    setLoading(false);
  };

  return (
  <main className="min-h-screen bg-muted p-6">
    <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-3rem)]">

      {/* LEFT COLUMN – SpotScore */}
      <div className="overflow-y-auto">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-2xl">SpotScore</CardTitle>
            <CardDescription>
              Select what matters to you and adjust the importance of each factor.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Input placeholder="Enter address or place name…" />

            {/* FACTOR GROUPS */}
            <div className="space-y-6">
              {Object.entries(groups).map(([groupKey, groupLabel]) => (
                <div key={groupKey} className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {groupLabel}
                  </h3>

                  {factors
                    .filter((f) => f.group === groupKey)
                    .map((factor) => {
                      const index = factors.findIndex(
                        (f) => f.key === factor.key
                      );

                      return (
                        <div
                          key={factor.key}
                          className={`rounded-lg border p-4 transition ${
                            factor.enabled
                              ? "bg-background"
                              : "bg-muted/50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={factor.enabled}
                                onCheckedChange={() =>
                                  toggleFactor(index)
                                }
                              />
                              <span className="text-lg">{factor.icon}</span>
                              <span className="text-sm font-medium">
                                {factor.label}
                              </span>
                            </div>

                            <span className="text-sm font-semibold">
                              {factor.enabled ? factor.weight : "-"}
                            </span>
                          </div>

                          <input
                            type="range"
                            min={1}
                            max={5}
                            value={factor.weight}
                            disabled={!factor.enabled}
                            onChange={(e) =>
                              updateWeight(index, Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={calculateScore}
              disabled={loading}
            >
              {loading ? "Calculating…" : "Calculate score"}
            </Button>

            {/* FINAL SPOTSCORE + BREAKDOWN */}
            {score !== null && (
              <>
                <div className="text-center mt-8">
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    Your SpotScore
                  </div>
                  <div className={`text-6xl font-bold ${scoreColor(score)}`}>
                    {score}
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Score breakdown
                  </h4>

                  {factors
                    .filter((f) => f.enabled)
                    .map((factor) => {
                      const factorScore = getMockFactorScore(factor.key);

                      return (
                        <div
                          key={factor.key}
                          className="flex items-center gap-4"
                        >
                          <div className="w-40 text-sm flex items-center gap-2">
                            <span>{factor.icon}</span>
                            <span>{factor.label}</span>
                          </div>

                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full ${breakdownBarColor(
                                factorScore
                              )}`}
                              style={{
                                width: `${factorScore * 10}%`,
                              }}
                            />
                          </div>

                          <div className="w-12 text-right text-sm font-medium">
                            {factorScore.toFixed(1)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN – MAP */}
      <div className="h-full rounded-xl overflow-hidden border">
        <MapView />
      </div>

    </div>
  </main>
);
}
