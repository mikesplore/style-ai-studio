import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StyleRecommender from "@/components/dashboard/style-recommender";
import VirtualTryOn from "@/components/dashboard/virtual-try-on";
import WardrobeManager from "@/components/dashboard/wardrobe-manager";
import { Bot, Scan, Shirt } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="try-on" className="w-full">
        <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-3 md:w-[600px] h-auto p-1 bg-muted/50 rounded-full">
              <TabsTrigger value="recommender" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all">
                <Bot className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Recommender</span>
                <span className="sm:hidden">Style</span>
              </TabsTrigger>
              <TabsTrigger value="try-on" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all">
                <Scan className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Virtual Try-On</span>
                <span className="sm:hidden">Try-On</span>
              </TabsTrigger>
              <TabsTrigger value="wardrobe" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md transition-all">
                <Shirt className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">My Wardrobe</span>
                <span className="sm:hidden">Wardrobe</span>
              </TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="recommender" className="mt-8">
          <StyleRecommender />
        </TabsContent>
        <TabsContent value="try-on" className="mt-8">
          <VirtualTryOn />
        </TabsContent>
        <TabsContent value="wardrobe" className="mt-8">
          <WardrobeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
