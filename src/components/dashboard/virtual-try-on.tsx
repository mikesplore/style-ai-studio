"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Upload, CheckCircle, Plus } from "lucide-react";
import { useWardrobe } from "@/contexts/wardrobe-context";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const Stepper = () => (
    <div className="flex items-center justify-center w-full my-8">
        <div className="flex items-center">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                <p className="mt-2 text-sm text-foreground">Your Inputs</p>
            </div>
            <div className="flex-auto border-t-2 border-primary w-24 mx-4"></div>
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
                <p className="mt-2 text-sm text-foreground text-center">Select Wardrobe<br/>Item(s)</p>
            </div>
            <div className="flex-auto border-t-2 border-border w-24 mx-4"></div>
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-border rounded-full flex items-center justify-center text-muted-foreground font-bold">3</div>
                <p className="mt-2 text-sm text-muted-foreground">See The Result</p>
            </div>
        </div>
    </div>
);


export default function VirtualTryOn() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { userPhotos, wardrobeItems, addUserPhotos, addWardrobeItems, getImageDataUri } = useWardrobe();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [selectedUserPhoto, setSelectedUserPhoto] = useState<string>("");
  const [selectedWardrobeItems, setSelectedWardrobeItems] = useState<string[]>([]);

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
      const userPhoto = userPhotos.find((p) => p.url === selectedUserPhoto);
      if (!userPhoto) throw new Error("Selected user photo not found");

      const userPhotoDataUri = userPhoto.dataUri || await getImageDataUri(userPhoto.url);
      
      const outfitImageDataUris = await Promise.all(
        selectedWardrobeItems.map(async (url) => {
          const item = wardrobeItems.find((w) => w.url === url);
          if (!item) throw new Error(`Wardrobe item with url ${url} not found`);
          return item.dataUri || await getImageDataUri(item.url);
        })
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

  return (
    <Card className="w-full mx-auto border-2 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-4">
            <h1 className="text-4xl font-bold tracking-tight">AI Magic Try-On: See It To Believe!</h1>
            <p className="text-lg text-muted-foreground mt-2">Visualize how different clothing items look on your photo.</p>
        </div>
        
        <Stepper />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <h3 className="font-semibold text-xl">Your Inputs</h3>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-32 aspect-[3/4] rounded-md bg-muted overflow-hidden border-2">
                                {selectedUserPhoto ? <Image src={selectedUserPhoto} alt="Selected user photo" fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><User className="w-8 h-8 text-muted-foreground" /></div> }
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">Upload Your Photo</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => document.getElementById('user-photo-upload-main')?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choose Photo
                                </Button>
                                <input id="user-photo-upload-main" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && addUserPhotos(e.target.files)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <h4 className="font-medium mb-2">Select Wardrobe Item(s)</h4>
                    <ScrollArea className="h-40 w-full rounded-md border p-4">
                        <div className="flex space-x-4">
                            {wardrobeItems.map(item => (
                            <div key={item.id} className="relative aspect-square h-28 flex-shrink-0" onClick={() => handleWardrobeSelect(item.url)}>
                                <Image src={item.url} alt={item.fileName} fill className={cn("object-cover rounded-md cursor-pointer transition-all border-2", selectedWardrobeItems.includes(item.url) ? "border-primary" : "border-transparent")} />
                                {selectedWardrobeItems.includes(item.url) && (
                                <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <Button variant="outline" className="mt-2 w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add More
                    </Button>
                </div>
            </div>

            <div className="space-y-4 sticky top-24">
                 <h3 className="font-semibold text-xl text-center">The Magic Happens Here!</h3>
                <div className="relative w-full aspect-[4/5] rounded-xl border-2 border-dashed flex items-center justify-center bg-muted overflow-hidden shadow-inner">
                    {loading ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating your try-on...</p>
                    </div>
                    ) : resultImage ? (
                    <Image src={resultImage} alt="Virtual try-on result" fill className="object-cover" />
                    ) : (
                    <div className="text-center text-muted-foreground p-6">
                        <Wand2 className="mx-auto h-12 w-12 mb-2 text-primary" />
                        <p className="text-base font-medium">Your Virtual Try-On will appear here!</p>
                    </div>
                    )}
                </div>
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !selectedUserPhoto || selectedWardrobeItems.length === 0} 
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-3"
                >
                    {loading ? 'Generating...' : 'Generate Try-On Image'}
                    <Wand2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

const UploadPlaceholder = ({ onUpload, uploadId, label }: { onUpload: (files: FileList) => void; uploadId: string; label:string; }) => (
    <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors w-full h-full">
        <p className="text-sm text-muted-foreground mb-3">{label}</p>
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
  );
  
const InputSection = ({ title, items, selectedItem, onSelect, onUpload, uploadId, children }: { title: string, items: any[], selectedItem: string, onSelect: (url: string) => void, onUpload: (files: FileList) => void, uploadId: string, children: React.ReactNode }) => (
    <div className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="relative w-full aspect-[4/5] rounded-lg bg-muted overflow-hidden border-2">
        {selectedItem && <Image src={selectedItem} alt="Selected item" fill className="object-cover" />}
        {items.length === 0 && (
           <UploadPlaceholder onUpload={onUpload} uploadId={uploadId} label={`Upload a photo to get started`}/>
        )}
      </div>
      {children}
    </div>
);
