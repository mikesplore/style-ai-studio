// src/contexts/wardrobe-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export type UploadedImage = {
  id: string;
  url: string; // This will be the local URL for display
  fileName: string;
  dataUri: string; // Base64 data URI, used temporarily for uploads
  driveFileId?: string; // Google Drive file ID
};

type WardrobeContextType = {
  userPhotos: UploadedImage[];
  wardrobeItems: UploadedImage[];
  addUserPhotos: (files: FileList) => Promise<void>;
  addWardrobeItems: (files: FileList) => Promise<void>;
  removeUserPhoto: (id: string) => void;
  removeWardrobeItem: (id: string) => void;
  getImageDataUri: (url: string) => Promise<string>;
  isLoading: boolean;
};

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [userPhotos, setUserPhotos] = useState<UploadedImage[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch an image URL and convert it to a data URI
  const getImageDataUri = async (url: string): Promise<string> => {
    // Check if it's already a data URI
    if (url.startsWith('data:')) {
      return url;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}. Status: ${response.status}`);
      }
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
      const [userPhotosRes, wardrobeItemsRes] = await Promise.all([
        fetch("/api/drive?folderType=userPhotos"),
        fetch("/api/drive?folderType=wardrobeItems"),
      ]);

      if (userPhotosRes.ok) {
        const { files } = await userPhotosRes.json();
        const drivePhotos: UploadedImage[] = files.map((file: any) => ({
          id: file.id,
          url: file.thumbnailLink.replace('=s220', '=s1024'), // Use larger thumbnail
          fileName: file.name,
          driveFileId: file.id,
          dataUri: "",
        }));
        setUserPhotos(drivePhotos);
      }

      if (wardrobeItemsRes.ok) {
        const { files } = await wardrobeItemsRes.json();
        const driveItems: UploadedImage[] = files.map((file: any) => ({
          id: file.id,
          url: file.thumbnailLink.replace('=s220', '=s1024'),
          fileName: file.name,
          driveFileId: file.id,
          dataUri: "",
        }));
        setWardrobeItems(driveItems);
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
  
  const processAndUploadFiles = async (
    files: FileList,
    folderType: "userPhotos" | "wardrobeItems"
  ) => {
    if (!session?.accessToken) {
      toast({ variant: "destructive", title: "Please sign in to upload files."});
      return;
    }

    toast({ title: `Uploading ${files.length} file(s)...`});

    const newImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const dataUri = await fileToDataUri(file);

        // Upload to Google Drive
        const driveResponse = await fetch("/api/drive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileData: dataUri,
            folderType,
          }),
        });

        if (!driveResponse.ok) {
          throw new Error(`Failed to upload to Google Drive: ${file.name}`);
        }

        const driveResult = await driveResponse.json();

        return {
          id: driveResult.id,
          url: driveResult.thumbnailLink.replace('=s220', '=s1024'), // Use local URL for immediate display
          fileName: file.name,
          dataUri: "", // Don't store large data URI in state
          driveFileId: driveResult.id,
        };
      })
    );

    if (folderType === "userPhotos") {
      setUserPhotos((prev) => [...prev, ...newImages]);
    } else {
      setWardrobeItems((prev) => [...prev, ...newImages]);
    }

    toast({ variant: 'default', title: "Upload complete!", description: `${files.length} file(s) saved to Google Drive.` });
  };


  const addUserPhotos = async (files: FileList) => {
    await processAndUploadFiles(files, "userPhotos");
  };

  const addWardrobeItems = async (files: FileList) => {
    await processAndUploadFiles(files, "wardrobeItems");
  };

  const removeUserPhoto = (id: string) => {
    setUserPhotos((prev) => prev.filter((img) => img.id !== id));
    // TODO: Add API call to delete from Drive
  };

  const removeWardrobeItem = (id: string) => {
    setWardrobeItems((prev) => prev.filter((img) => img.id !== id));
    // TODO: Add API call to delete from Drive
  };

  return (
    <WardrobeContext.Provider
      value={{
        userPhotos,
        wardrobeItems,
        addUserPhotos,
        addWardrobeItems,
        removeUserPhoto,
        removeWardrobeItem,
        getImageDataUri,
        isLoading,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error("useWardrobe must be used within a WardrobeProvider");
  }
  return context;
}
