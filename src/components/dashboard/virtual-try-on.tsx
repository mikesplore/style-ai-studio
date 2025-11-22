"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Upload, Shirt, User, ArrowRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useWardrobe } from "@/contexts/wardrobe-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

export default function VirtualTryOn() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { userPhotos, wardrobeItems, addUserPhotos, addWardrobeItems, getImageDataUri } = useWardrobe();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [selectedUserPhoto, setSelectedUserPhoto] = useState<string>("");
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserPhoto || !selectedWardrobeItem) {
      toast({
        variant: "destructive",
        title: "Missing Selections",
        description: "Please select both your photo and a wardrobe item to generate a try-on.",
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
      const userPhoto = userPhotos.find((p) => p.url === selectedUserPhoto);
      const wardrobeItem = wardrobeItems.find((w) => w.url === selectedWardrobeItem);

      if (!userPhoto || !wardrobeItem) throw new Error("Selected images not found");

      const userPhotoDataUri = userPhoto.dataUri || await getImageDataUri(userPhoto.url);
      const outfitImageDataUri = wardrobeItem.dataUri || await getImageDataUri(wardrobeItem.url);

      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPhotoDataUri, outfitImageDataUri }),
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

  const InputCard = ({
    title,
    icon,
    items,
    selectedValue,
    onValueChange,
    onUpload,
    uploadId,
    placeholder,
  }: {
    title: string;
    icon: React.ReactNode;
    items: { url: string; id: string; fileName: string }[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    onUpload: (files: FileList) => void;
    uploadId: string;
    placeholder: string;
  }) => (
    <Card className="flex flex-col h-full bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {icon}
          <span className="text-xl">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow items-center justify-center space-y-4">
        {items.length > 0 ? (
          <>
            <Select value={selectedValue} onValueChange={onValueChange}>
              <SelectTrigger className="h-12 border-2 hover:border-primary/50 transition-colors">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {items.map(item => (
                  <SelectItem key={item.id} value={item.url}>{item.fileName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-full aspect-square rounded-lg bg-muted overflow-hidden mt-4 border">
              {selectedValue ? (
                <Image src={selectedValue} alt="Selected item" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4 text-center">
                  Select an image to see a preview
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors w-full h-full">
            <p className="text-sm text-muted-foreground mb-3">Upload an image to start</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById(uploadId)?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <input
              id={uploadId}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && onUpload(e.target.files)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full mx-auto border-0 shadow-none">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold tracking-tight">Virtual Try-On</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          See how clothing looks on you with AI-powered visualization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          <InputCard
            title="Your Photo"
            icon={<User className="h-6 w-6 text-primary" />}
            items={userPhotos}
            selectedValue={selectedUserPhoto}
            onValueChange={setSelectedUserPhoto}
            onUpload={addUserPhotos}
            uploadId="user-photo-upload-main"
            placeholder="Select your photo"
          />
          
          <InputCard
            title="Wardrobe Item"
            icon={<Shirt className="h-6 w-6 text-primary" />}
            items={wardrobeItems}
            selectedValue={selectedWardrobeItem}
            onValueChange={setSelectedWardrobeItem}
            onUpload={addWardrobeItems}
            uploadId="wardrobe-item-upload-main"
            placeholder="Select a wardrobe item"
          />

          <div className="flex flex-col space-y-4 lg:col-span-1 h-full">
            <Card className="flex flex-col flex-grow h-full bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Wand2 className="h-6 w-6 text-accent" />
                  <span className="text-xl">AI Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow items-center justify-center">
                <div className="relative w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted overflow-hidden shadow-inner">
                  {loading ? (
                    <Skeleton className="w-full h-full" />
                  ) : resultImage ? (
                    <Image src={resultImage} alt="Virtual try-on result" fill className="object-cover" />
                  ) : (
                    <div className="text-center text-muted-foreground p-6">
                      <p className="text-base font-medium">Your generated image will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        <div className="mt-8">
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !selectedUserPhoto || !selectedWardrobeItem} 
            className="w-full max-w-md mx-auto h-14 text-lg shadow-lg shadow-primary/30 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Try-On
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}