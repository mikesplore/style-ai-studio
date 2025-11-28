"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, CheckCircle, User, Shirt, AlertCircle, Info, Download } from "lucide-react";
import { useWardrobe } from "@/contexts/wardrobe-context";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const generationSteps = [
    "Warming up the AI stylist...",
    "Analyzing your photo...",
    "Selecting the perfect outfit...",
    "Draping the virtual fabric...",
    "Adjusting for a perfect fit...",
    "Rendering the final image...",
    "Almost there...",
];

const DAILY_LIMIT = 3;

export default function VirtualTryOn() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(generationSteps[0]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { userPhotos, wardrobeItems, getImageDataUri } = useWardrobe();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [selectedUserPhoto, setSelectedUserPhoto] = useState<string>("");
  const [selectedWardrobeItems, setSelectedWardrobeItems] = useState<string[]>([]);
  
  const [generationCount, setGenerationCount] = useState(0);
  const [isLimitLoading, setIsLimitLoading] = useState(true);

  const fetchGenerationCount = async () => {
    if (!session) return;
    setIsLimitLoading(true);
    try {
      const response = await fetch('/api/user/limit');
      if (response.ok) {
        const data = await response.json();
        setGenerationCount(data.count);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch daily generation limit.' });
      }
    } catch (error) {
      console.error("Could not fetch daily generation limit", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch daily generation limit.' });
    } finally {
      setIsLimitLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerationCount();
  }, [session]);

  const canGenerate = generationCount < DAILY_LIMIT;

  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (loading) {
          let i = 0;
          setLoadingText(generationSteps[i]);
          interval = setInterval(() => {
              i = (i + 1) % generationSteps.length;
              setLoadingText(generationSteps[i]);
          }, 2500);
      }
      return () => clearInterval(interval);
  }, [loading]);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `style-ai-try-on-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWardrobeSelect = (itemUrl: string) => {
    setSelectedWardrobeItems(prev => 
      prev.includes(itemUrl) ? prev.filter(url => url !== itemUrl) : [...prev, itemUrl]
    );
  };
  
  const handlePhotoSelect = (itemUrl: string) => {
    setSelectedUserPhoto(itemUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserPhoto || selectedWardrobeItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Selections",
        description: "Please select your photo and at least one wardrobe item.",
      });
      return;
    }
    
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to generate a virtual try-on.",
      });
      return;
    }

    if (!canGenerate) {
      toast({
        variant: "destructive",
        title: "Daily Limit Reached",
        description: `You have reached your daily limit of ${DAILY_LIMIT} generations. Please try again tomorrow.`,
      });
      return;
    }

    setLoading(true);
    setResultImage(null);

    try {
      const userPhotoDataUri = await getImageDataUri(selectedUserPhoto);
      
      const outfitImageDataUris = await Promise.all(
        selectedWardrobeItems.map(url => getImageDataUri(url))
      );

      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPhotoDataUri, outfitImageDataUris }),
      });

      const result = await response.json();

      if (!response.ok || "error" in result) {
        throw new Error(result?.error || "Failed to generate try-on");
      }
      
      await fetch('/api/user/limit', { method: 'POST' });
      setGenerationCount(prev => prev + 1);

      const generatedImage = result.tryOnImageDataUri || null;
      setResultImage(generatedImage);

      if (generatedImage && session?.accessToken) {
        await fetch('/api/save-outfit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageDataUri: generatedImage, fileName: `try-on-${Date.now()}.png` }),
        });
        toast({ title: "Success!", description: "Try-on generated and saved to your history." });
      } else {
        toast({ title: "Success!", description: "Try-on generated successfully." });
      }

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const hasPrerequisites = userPhotos.length > 0 && wardrobeItems.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <Card className="border-2 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-3">
              AI Magic Try-On
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Visualize how different clothing items look on your photo.
            </p>
          </div>
          
          {/* Prerequisites Alert */}
          {!hasPrerequisites && (
            <Alert className="mb-6 sm:mb-8 max-w-3xl mx-auto border-accent/50 bg-accent/10">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
              <AlertTitle className="font-semibold text-sm sm:text-base">
                Upload Your Photos First
              </AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                To get started, please add photos of yourself and your clothing in the{" "}
                <Link href="/dashboard/wardrobe" className="font-medium underline text-accent-foreground hover:opacity-80 transition-opacity">
                  My Wardrobe
                </Link>{" "}
                tab.
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Left Column - Selection Panel */}
            <div className="space-y-5 sm:space-y-6">
              {/* User Photo Selection */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                  1. Select Your Photo
                </h3>
                <ScrollArea className="h-40 sm:h-48 w-full rounded-lg border bg-muted/30 p-3 sm:p-4">
                  <div className="flex space-x-3 sm:space-x-4">
                    {userPhotos.length > 0 ? (
                      userPhotos.map(photo => (
                        <button
                          key={photo.id}
                          onClick={() => handlePhotoSelect(photo.url)}
                          className="relative aspect-[3/4] h-32 sm:h-36 flex-shrink-0 group"
                        >
                          <Image 
                            src={photo.url} 
                            alt={photo.fileName} 
                            fill 
                            className={cn(
                              "object-cover rounded-md cursor-pointer transition-all border-4 group-hover:scale-[1.02]",
                              selectedUserPhoto === photo.url 
                                ? "border-primary shadow-lg" 
                                : "border-transparent hover:border-primary/30"
                            )}
                            sizes="(max-width: 640px) 128px, 144px"
                          />
                          {selectedUserPhoto === photo.url && (
                            <div className="absolute top-1 right-1 bg-primary rounded-full p-1 shadow-md">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-32 sm:h-36 text-muted-foreground">
                        <User className="w-8 h-8 sm:w-10 sm:h-10 mb-2"/>
                        <p className="text-xs sm:text-sm">Your photos will appear here</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Wardrobe Selection */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                  2. Select Wardrobe Item(s)
                </h3>
                <ScrollArea className="h-40 sm:h-48 w-full rounded-lg border bg-muted/30 p-3 sm:p-4">
                  <div className="flex space-x-3 sm:space-x-4">
                    {wardrobeItems.length > 0 ? (
                      wardrobeItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleWardrobeSelect(item.url)}
                          className="relative aspect-square h-32 sm:h-36 flex-shrink-0 group"
                        >
                          <Image 
                            src={item.url} 
                            alt={item.fileName} 
                            fill 
                            className={cn(
                              "object-cover rounded-md cursor-pointer transition-all border-4 group-hover:scale-[1.02]",
                              selectedWardrobeItems.includes(item.url) 
                                ? "border-primary shadow-lg" 
                                : "border-transparent hover:border-primary/30"
                            )}
                            sizes="(max-width: 640px) 128px, 144px"
                          />
                          {selectedWardrobeItems.includes(item.url) && (
                            <div className="absolute top-1 right-1 bg-primary rounded-full p-1 shadow-md">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-32 sm:h-36 text-muted-foreground">
                        <Shirt className="w-8 h-8 sm:w-10 sm:h-10 mb-2"/>
                        <p className="text-xs sm:text-sm">Your wardrobe items will appear here</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Daily Limit Alert */}
              <Alert className="border-muted-foreground/20 bg-muted/20">
                <Info className="h-4 w-4" />
                <AlertTitle className="text-sm sm:text-base">Daily Limit</AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">
                  {isLimitLoading ? (
                    'Loading your limit...'
                  ) : (
                    `You can generate ${Math.max(0, DAILY_LIMIT - generationCount)} more image${DAILY_LIMIT - generationCount !== 1 ? 's' : ''} today. Your limit will reset tomorrow.`
                  )}
                </AlertDescription>
              </Alert>

              {/* Generate Button */}
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !selectedUserPhoto || selectedWardrobeItems.length === 0 || !canGenerate || isLimitLoading} 
                className="w-full h-12 sm:h-14 text-sm sm:text-base lg:text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3"
              >
                {loading ? 'Generating...' : 'Generate Try-On Image'}
                <Wand2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Right Column - Result Preview */}
            <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-24">
              <h3 className="font-semibold text-base sm:text-lg text-center">
                3. See The Magic Happen!
              </h3>
              <div className="relative w-full aspect-[4/5] rounded-xl border-2 border-dashed flex items-center justify-center bg-muted/30 overflow-hidden shadow-inner">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4 text-center px-4">
                    <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium animate-pulse">
                      {loadingText}
                    </p>
                  </div>
                ) : resultImage ? (
                  <Image 
                    src={resultImage} 
                    alt="Virtual try-on result" 
                    fill 
                    className="object-cover animate-fade-in" 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="text-center text-muted-foreground p-6">
                    <Wand2 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3 text-primary/70" />
                    <p className="text-sm sm:text-base font-medium">
                      Your Virtual Try-On will appear here!
                    </p>
                  </div>
                )}
              </div>
              
              {/* Download Button */}
              {resultImage && !loading && (
                <Button 
                  onClick={handleDownload} 
                  className="w-full h-11 sm:h-12" 
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}