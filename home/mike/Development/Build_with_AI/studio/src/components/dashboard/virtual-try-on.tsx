"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, CheckCircle, User, Shirt, Image as ImageIcon } from "lucide-react";
import { useWardrobe } from "@/contexts/wardrobe-context";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const generationSteps = [
  "Warming up the AI stylist...",
  "Analyzing your photo...",
  "Selecting the perfect fabric textures...",
  "Draping the clothing realistically...",
  "Matching lighting and shadows...",
  "Adding the final touches...",
  "Almost there!",
];

export default function VirtualTryOn() {
  const [loading, setLoading] = useState(false);
  const [generationMessage, setGenerationMessage] = useState(generationSteps[0]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { userPhotos, wardrobeItems, getImageDataUri, isLoading: isWardrobeLoading } = useWardrobe();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [selectedUserPhoto, setSelectedUserPhoto] = useState<string>("");
  const [selectedWardrobeItems, setSelectedWardrobeItems] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let i = 0;
      setGenerationMessage(generationSteps[i]);
      interval = setInterval(() => {
        i = (i + 1) % generationSteps.length;
        setGenerationMessage(generationSteps[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

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

      const generatedImage = result.tryOnImageDataUri || result.tryOnImage || null;
      setResultImage(generatedImage);

      if (generatedImage && session?.accessToken) {
        await fetch('/api/save-outfit', {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
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

  return (
    <Card className="w-full mx-auto border-2 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">AI Magic Try-On</h1>
            <p className="text-lg text-muted-foreground mt-2">Visualize how different clothing items look on your photo.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                        <div className="p-3 bg-primary/10 rounded-lg"><User className="w-6 h-6 text-primary" /></div>
                        <h3 className="font-semibold text-xl">Select Your Photo</h3>
                    </CardHeader>
                    <CardContent className="p-4">
                        <ScrollArea className="h-48 w-full rounded-md border">
                            <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {isWardrobeLoading && Array.from({length: 5}).map((_, i) => <div key={i} className="relative aspect-square bg-muted rounded-md animate-pulse" />)}
                                {userPhotos.map(photo => (
                                <div key={photo.id} className="relative aspect-square flex-shrink-0 group" onClick={() => handlePhotoSelect(photo.url)}>
                                    <Image src={photo.url} alt={photo.fileName} fill className={cn("object-cover rounded-md cursor-pointer transition-all border-4", selectedUserPhoto === photo.url ? "border-primary" : "border-transparent group-hover:border-primary/30")} />
                                    {selectedUserPhoto === photo.url && (
                                    <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5 shadow-lg">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                        <div className="p-3 bg-primary/10 rounded-lg"><Shirt className="w-6 h-6 text-primary" /></div>
                        <h3 className="font-semibold text-xl">Select Wardrobe Item(s)</h3>
                    </CardHeader>
                    <CardContent className="p-4">
                        <ScrollArea className="h-48 w-full rounded-md border">
                            <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {isWardrobeLoading && Array.from({length: 10}).map((_, i) => <div key={i} className="relative aspect-square bg-muted rounded-md animate-pulse" />)}
                                {wardrobeItems.map(item => (
                                <div key={item.id} className="relative aspect-square flex-shrink-0 group" onClick={() => handleWardrobeSelect(item.url)}>
                                    <Image src={item.url} alt={item.fileName} fill className={cn("object-cover rounded-md cursor-pointer transition-all border-4", selectedWardrobeItems.includes(item.url) ? "border-primary" : "border-transparent group-hover:border-primary/30")} />
                                    {selectedWardrobeItems.includes(item.url) && (
                                    <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5 shadow-lg">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !selectedUserPhoto || selectedWardrobeItems.length === 0} 
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-3"
                >
                    {loading ? 'Generating...' : 'Generate Try-On Image'}
                    <Wand2 className="h-5 w-5" />
                </Button>
            </div>

            <div className="space-y-4 sticky top-24">
                 <h3 className="font-semibold text-xl text-center">The Magic Happens Here!</h3>
                <div className="relative w-full aspect-[4/5] rounded-xl border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden shadow-inner">
                    {loading ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium animate-pulse">{generationMessage}</p>
                    </div>
                    ) : resultImage ? (
                    <Image src={resultImage} alt="Virtual try-on result" fill className="object-contain" />
                    ) : (
                    <div className="text-center text-muted-foreground p-6">
                        <ImageIcon className="mx-auto h-16 w-16 mb-4 text-primary/30" />
                        <p className="text-lg font-medium">Your Virtual Try-On will appear here!</p>
                        <p className="text-sm">Select a photo and wardrobe items to get started.</p>
                    </div>
                    )}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
