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
import { Loader2, Wand2, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";
import { useWardrobe } from "@/contexts/wardrobe-context";

export default function VirtualTryOn() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { userPhotos, wardrobeItems, addUserPhotos, addWardrobeItems, getImageDataUri } = useWardrobe();
  const { toast } = useToast();

  const [selectedUserPhoto, setSelectedUserPhoto] = useState<string>("");
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState<string>("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserPhoto || !selectedWardrobeItem) {
      toast({
        variant: "destructive",
        title: "Missing Images",
        description: "Please select both a photo of you and a wardrobe item.",
      });
      return;
    }

    setLoading(true);
    setResultImage(null);

    try {
      const userPhoto = userPhotos.find((p) => p.url === selectedUserPhoto);
      const wardrobeItem = wardrobeItems.find((w) => w.url === selectedWardrobeItem);

      if (!userPhoto || !wardrobeItem) {
        throw new Error("Selected images not found");
      }

      const userPhotoDataUri = userPhoto.dataUri || await getImageDataUri(userPhoto.url);
      const outfitImageDataUri = wardrobeItem.dataUri || await getImageDataUri(wardrobeItem.url);

      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhotoDataUri,
          outfitImageDataUri,
        }),
      });

      const result = await response.json();

      if (!response.ok || "error" in result) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result?.error || "Failed to generate try-on",
        });
      } else {
        setResultImage(result.tryOnImageDataUri || result.tryOnImage || null);
        toast({ title: "Success!", description: "Try-on generated successfully" });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate try-on. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">Virtual Try-On</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          See how clothing looks on you with AI-powered visualization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-md">1</span>
                  <label className="font-semibold text-xl">Your Photo</label>
              </div>
              {userPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <p className="text-sm text-muted-foreground mb-3">Upload your photo first</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('user-photo-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <input
                    id="user-photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && addUserPhotos(e.target.files)}
                  />
                </div>
              ) : (
                <>
                  <Select value={selectedUserPhoto} onValueChange={setSelectedUserPhoto}>
                    <SelectTrigger className="h-12 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select your photo" />
                    </SelectTrigger>
                    <SelectContent>
                      {userPhotos.map(photo => (
                        <SelectItem key={photo.id} value={photo.url}>{photo.fileName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedUserPhoto && (
                    <div className="p-3">
                      <Image src={selectedUserPhoto} alt="Selected user" width={150} height={150} className="rounded-lg object-cover mx-auto shadow-md" />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-md">2</span>
                  <label className="font-semibold text-xl">Wardrobe Item</label>
              </div>
              {wardrobeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <p className="text-sm text-muted-foreground mb-3">Upload a wardrobe item</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('wardrobe-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Item
                  </Button>
                  <input
                    id="wardrobe-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && addWardrobeItems(e.target.files)}
                  />
                </div>
              ) : (
                <>
                  <Select value={selectedWardrobeItem} onValueChange={setSelectedWardrobeItem}>
                    <SelectTrigger className="h-12 border-2 hover:border-accent/50 transition-colors">
                      <SelectValue placeholder="Select a wardrobe item" />
                    </SelectTrigger>
                    <SelectContent>
                      {wardrobeItems.map(item => (
                        <SelectItem key={item.id} value={item.url}>{item.fileName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWardrobeItem && (
                    <div className="p-3">
                      <Image src={selectedWardrobeItem} alt="Selected item" width={150} height={150} className="rounded-lg object-cover mx-auto shadow-md" />
                    </div>
                  )}
                </>
              )}
            </div>
            <Button type="submit" disabled={loading || !selectedUserPhoto || !selectedWardrobeItem} className="w-full h-12 text-base shadow-lg shadow-primary/30 hover:shadow-xl transition-all disabled:opacity-50">
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              Generate Try-On
            </Button>
          </form>
          <div className="flex flex-col items-center justify-start space-y-3">
              <div className="flex items-center gap-3 self-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-md">3</span>
                  <h3 className="font-semibold text-xl">Result</h3>
              </div>
            <div className="relative w-full max-w-[350px] aspect-[3/4] rounded-xl border-2 border-dashed border-muted flex items-center justify-center bg-card overflow-hidden shadow-inner">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : resultImage ? (
                <Image
                  src={resultImage}
                  alt="Virtual try-on result"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center text-muted-foreground p-6">
                  <Wand2 className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-base font-medium">Your generated image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
