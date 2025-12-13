"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Factor = {
  label: string;
  value: number;
};

export default function Home() {
  const [factors, setFactors] = useState<Factor[]>([
    { label: "Restaurants nearby", value: 3 },
    { label: "Attractions & sights", value: 3 },
    { label: "Distance to city center", value: 3 },
    { label: "Distance to beach", value: 3 },
    { label: "Public transport access", value: 3 },
  ]);

  const updateFactor = (index: number, newValue: number) => {
    const updated = [...factors];
    updated[index].value = newValue;
    setFactors(updated);
  };

  return (
    <main className="min-h-screen bg-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">SpotScore</CardTitle>
          <CardDescription>
            Customize what matters to you, then calculate a personalized score.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Location input */}
          <Input placeholder="Enter address or place name…" />

          {/* Factors */}
          <div className="space-y-5">
            {factors.map((factor, index) => (
              <div key={factor.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{factor.label}</span>
                  <span className="font-medium">{factor.value}</span>
                </div>

                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[factor.value]}
                  onValueChange={(v) => updateFactor(index, v[0])}
                />
              </div>
            ))}
          </div>

          <Button className="w-full">
            Calculate score
          </Button>

          {/* Dummy result */}
          <div className="text-center pt-4">
            <div className="text-sm text-muted-foreground">
              Your SpotScore
            </div>
            <div className="text-4xl font-bold">
              8.6
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
