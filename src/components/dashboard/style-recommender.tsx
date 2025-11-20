"use client";

import { useState } from "react";
import Image from "next/image";
import { getOutfitRecommendations } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { GenerateOutfitRecommendationsOutput } from "@/ai/flows/generate-outfit-recommendations";
import { Heart, Loader2, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

type Recommendation = GenerateOutfitRecommendationsOutput[0];

export default function StyleRecommender() {
  const [stylePreferences, setStylePreferences] = useState(
    "I like a minimalist, comfortable style. Neutral colors like black, white, and beige are my favorite. I prefer casual and smart-casual looks."
  );
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] =
    useState<GenerateOutfitRecommendationsOutput>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);
    const result = await getOutfitRecommendations({ stylePreferences });
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setRecommendations(result);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Style Recommendations</CardTitle>
        <CardDescription>
          Describe your style, and our AI will generate personalized outfit
          recommendations for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="style-preferences">My Style Preferences</Label>
            <Textarea
              id="style-preferences"
              value={stylePreferences}
              onChange={(e) => setStylePreferences(e.target.value)}
              placeholder="e.g., I love vintage, bohemian style with earthy tones..."
              rows={4}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Recommendations
          </Button>
        </form>
      </CardContent>
      {(loading || recommendations.length > 0) && (
        <CardFooter className="flex flex-col items-start gap-4">
          <h3 className="text-lg font-semibold">
            {loading ? "Generating..." : "Your Recommendations"}
          </h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-[400px]" />
                  </CardContent>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              recommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[3/4]">
        <Image
          src={recommendation.outfitImageDataUri}
          alt={recommendation.outfitDescription}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Outfit Idea</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {recommendation.outfitDescription}
        </p>
        <div className="mt-4">
          <Label className="text-xs">Confidence Score</Label>
          <div className="flex items-center gap-2">
            <Progress value={recommendation.confidenceScore * 100} className="w-full" />
            <span className="text-sm font-medium">{Math.round(recommendation.confidenceScore * 100)}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
        </Button>
        <Button variant="outline">
          <Star className="mr-2 h-4 w-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
