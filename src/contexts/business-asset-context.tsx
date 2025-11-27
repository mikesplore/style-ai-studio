"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";


export type UploadedImage = {
  id: string;
  url: string;
  fileName: string;
  dataUri: string;
  driveFileId?: string;
};

type BusinessAssetContextType = {
  mannequinImages: UploadedImage[];
  productImages: UploadedImage[];
  addMannequinImages: (files: FileList) => Promise<void>;
  addProductImages: (files: FileList) => Promise<void>;
  removeMannequinImage: (id: string) => void;
  removeProductImage: (id: string) => void;
  getImageDataUri: (url: string) => Promise<string>;
  isLoading: boolean;
};

const BusinessAssetContext = createContext<BusinessAssetContextType | undefined>(undefined);

export function BusinessAssetProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [mannequinImages, setMannequinImages] = useState<UploadedImage[]>([]);
  const [productImages, setProductImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getImageDataUri = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) {
      return url;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch image. Status: ${response.status}`);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to fetch image as data URI:", error);
      throw error;
    }
  };
  
  const loadFromDrive = async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const [mannequinRes, productRes] = await Promise.all([
        fetch("/api/drive?folderType=mannequinImages"),
        fetch("/api/drive?folderType=productImages"),
      ]);

      if (mannequinRes.ok) {
        const { files } = await mannequinRes.json();
        const drivePhotos: UploadedImage[] = files.map((file: any) => ({
          id: file.id,
          url: file.thumbnailLink.replace('=s220', '=s1024'), // Use larger thumbnail
          fileName: file.name,
          driveFileId: file.id,
          dataUri: "",
        }));
        setMannequinImages(drivePhotos);
      }

      if (productRes.ok) {
        const { files } = await productRes.json();
        const driveItems: UploadedImage[] = files.map((file: any) => ({
          id: file.id,
          url: file.thumbnailLink.replace('=s220', '=s1024'),
          fileName: file.name,
          driveFileId: file.id,
          dataUri: "",
        }));
        setProductImages(driveItems);
      }
    } catch (error) {
      console.error("Error loading from Drive:", error);
      toast({ variant: "destructive", title: "Could not load from Google Drive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (session?.accessToken) {
      loadFromDrive();
    } else {
      setIsLoading(false);
    }
  }, [session?.accessToken]);


  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processAndUploadFiles = async (files: FileList, folderType: 'mannequinImages' | 'productImages') => {
      if (!session?.accessToken) {
      toast({ variant: "destructive", title: "Please sign in to upload files."});
      return;
    }

    toast({ title: `Uploading ${files.length} file(s)...`});
    
    const newImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const dataUri = await fileToDataUri(file);
        
        const driveResponse = await fetch("/api/drive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name, fileData: dataUri, folderType }),
        });

        if (!driveResponse.ok) {
          throw new Error(`Failed to upload to Google Drive: ${file.name}`);
        }

        const driveResult = await driveResponse.json();

        return {
          id: driveResult.id,
          url: driveResult.thumbnailLink.replace('=s220', '=s1024'),
          fileName: file.name,
          dataUri: "", // Don't store large data URI in state
          driveFileId: driveResult.id,
        };
      })
    );

    if (folderType === 'mannequinImages') {
      setMannequinImages((prev) => [...prev, ...newImages]);
    } else {
      setProductImages((prev) => [...prev, ...newImages]);
    }

    toast({ variant: 'default', title: "Upload complete!", description: `${files.length} file(s) saved to Google Drive.` });
  };

  const addMannequinImages = async (files: FileList) => {
    await processAndUploadFiles(files, "mannequinImages");
  };



  const addProductImages = async (files: FileList) => {
    await processAndUploadFiles(files, "productImages");
  };
  
  const removeMannequinImage = (id: string) => {
    setMannequinImages((prev) => prev.filter((img) => img.id !== id));
    // TODO: Also delete from server
  };

  const removeProductImage = (id: string) => {
    setProductImages((prev) => prev.filter((img) => img.id !== id));
    // TODO: Also delete from server
  };

  return (
    <BusinessAssetContext.Provider
      value={{
        mannequinImages,
        productImages,
        addMannequinImages,
        addProductImages,
        removeMannequinImage,
        removeProductImage,
        getImageDataUri,
        isLoading,
      }}
    >
      {children}
    </BusinessAssetContext.Provider>
  );
}

export function useBusinessAssets() {
  const context = useContext(BusinessAssetContext);
  if (context === undefined) {
    throw new Error("useBusinessAssets must be used within a BusinessAssetProvider");
  }
  return context;
}
