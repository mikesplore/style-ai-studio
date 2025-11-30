
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, CheckCircle, ImageIcon, Download, Sparkles, AlertCircle } from "lucide-react";
import { useBusinessAssets } from "@/contexts/business-asset-context";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "../ui/textarea";

const generationSteps = [
    "Briefing the AI stylist...",
    "Selecting the best angles...",
    "Setting up virtual lighting...",
    "Composing the shot...",
    "Rendering the final catalog image...",
    "Polishing the final look...",
];

export default function CatalogGenerator() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(generationSteps[0]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [catalogStyle, setCatalogStyle] = useState("A clean, bright, and professional look for an e-commerce website. Use a plain light gray background.");
  const { mannequinImages, productImages, getImageDataUri } = useBusinessAssets();
  const { toast } = useToast();

  const [selectedMannequin, setSelectedMannequin] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

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
    link.download = `catalog-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMannequinSelect = (itemUrl: string) => {
    setSelectedMannequin(itemUrl);
  };

  const handleProductSelect = (itemUrl: string) => {
    setSelectedProduct(itemUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMannequin || !selectedProduct) {
      toast({
        variant: "destructive",
        title: "Missing Selections",
        description: "Please select a mannequin and a product.",
      });
      return;
    }

    setLoading(true);
    setResultImage(null);

    try {
      const mannequinImage = await getImageDataUri(selectedMannequin);
      const productImage = await getImageDataUri(selectedProduct);

      const response = await fetch('/api/business-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          catalogStyleDescription: catalogStyle,
          mannequinImage,
          productImage,
        }),
      });

      const result = await response.json();

      if (!response.ok || "error" in result) {
        throw new Error(result?.error || "Failed to generate catalog image");
      }

      setResultImage(result.catalogImage || null);
      toast({ title: "Success!", description: "Catalog image generated successfully." });

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
  
  const hasPrerequisites = mannequinImages.length > 0 && productImages.length > 0;

  // Empty state - no assets uploaded yet
  if (!hasPrerequisites) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Upload Business Assets</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Upload mannequin and product photos to start creating professional catalog images.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard/wardrobe">
            <ImageIcon className="mr-2 h-5 w-5" />
            Go to Asset Manager
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Left Panel - Selections */}
      <div className="flex-1 flex flex-col min-w-0 lg:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Catalog</h2>
          <Badge variant="secondary" className="text-xs">
            Business Tools
          </Badge>
        </div>

        {/* Selection sections */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Mannequin Selection */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-sm font-medium">Mannequin</span>
              {selectedMannequin && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
            </div>
            <ScrollArea className="flex-1 rounded-lg border bg-muted/20">
              <div className="flex gap-2 p-3">
                {mannequinImages.map(photo => (
                  <button
                    key={photo.id}
                    onClick={() => handleMannequinSelect(photo.url)}
                    className={cn(
                      "relative h-24 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      selectedMannequin === photo.url 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <Image 
                      src={photo.url} 
                      alt={photo.fileName} 
                      fill 
                      className="object-cover"
                      sizes="64px"
                    />
                    {selectedMannequin === photo.url && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
                {mannequinImages.length === 0 && (
                  <div className="flex items-center justify-center w-full py-6 text-muted-foreground">
                    <ImageIcon className="w-6 h-6 mr-2" />
                    <span className="text-sm">No mannequins yet</span>
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Product Selection */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-sm font-medium">Product</span>
              {selectedProduct && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
            </div>
            <ScrollArea className="flex-1 rounded-lg border bg-muted/20">
              <div className="flex gap-2 p-3">
                {productImages.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleProductSelect(item.url)}
                    className={cn(
                      "relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      selectedProduct === item.url 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <Image 
                      src={item.url} 
                      alt={item.fileName} 
                      fill 
                      className="object-cover"
                      sizes="96px"
                    />
                    {selectedProduct === item.url && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-primary drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
                {productImages.length === 0 && (
                  <div className="flex items-center justify-center w-full py-6 text-muted-foreground">
                    <ImageIcon className="w-6 h-6 mr-2" />
                    <span className="text-sm">No products yet</span>
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Style Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-sm font-medium">Catalog Style</span>
            </div>
            <Textarea 
              value={catalogStyle} 
              onChange={e => setCatalogStyle(e.target.value)} 
              placeholder="e.g., Dark, moody, high-fashion editorial..." 
              rows={3} 
              disabled={loading}
              className="resize-none"
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !selectedMannequin || !selectedProduct} 
          className="w-full mt-4 h-12 text-base font-semibold"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Catalog
            </>
          )}
        </Button>
      </div>

      {/* Right Panel - Result */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
            <span className="text-xl font-semibold">Result</span>
          </div>
          {resultImage && !loading && (
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
        
        <div className="flex-1 rounded-xl border-2 border-dashed bg-muted/20 flex items-center justify-center overflow-hidden relative min-h-[300px] lg:min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Wand2 className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm text-muted-foreground font-medium animate-pulse max-w-[200px]">
                {loadingText}
              </p>
            </div>
          ) : resultImage ? (
            <Image 
              src={resultImage} 
              alt="Generated catalog image" 
              fill 
              className="object-contain p-2" 
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8" />
              </div>
              <p className="font-medium">Your catalog image will appear here</p>
              <p className="text-sm mt-1">Select assets and style, then generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

    