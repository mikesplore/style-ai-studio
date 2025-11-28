import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Palette, Scan, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/common/header';
import Logo from '@/components/common/logo';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8 animate-fade-in">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                    Your Personal AI Stylist.
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl">
                    Upload your clothes, take a photo, and see yourself in new outfits in seconds. Your virtual wardrobe awaits.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                    <Button 
                      asChild 
                      size="lg" 
                      className="shadow-lg transition-all hover:scale-105 hover:shadow-xl h-11 sm:h-12 text-sm sm:text-base"
                    >
                      <Link href="/dashboard">
                        Try it Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      size="lg" 
                      variant="outline" 
                      className="transition-all hover:scale-105 h-11 sm:h-12 text-sm sm:text-base"
                    >
                      <Link href="/business/dashboard">
                        For Businesses
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 animate-fade-in-delay">
                    {heroImage && (
                      <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        priority
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-16 sm:py-20 lg:py-24">
              {/* Section Header */}
              <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  How It Works
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                  A simple and magical process to redefine your style.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
                <div className="space-y-4 text-center">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full transition-transform hover:scale-110">
                    <span className="font-bold text-xl sm:text-2xl">1</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold">Upload Your Wardrobe</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Add photos of yourself and your clothing items. We'll digitize your closet.
                  </p>
                </div>

                <div className="space-y-4 text-center">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full transition-transform hover:scale-110">
                    <span className="font-bold text-xl sm:text-2xl">2</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold">Select & Generate</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Pick a photo of yourself and the clothes you want to try on.
                  </p>
                </div>

                <div className="space-y-4 text-center sm:col-span-2 lg:col-span-1">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full transition-transform hover:scale-110">
                    <span className="font-bold text-xl sm:text-2xl">3</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold">See the Magic</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Our AI generates a realistic image of you wearing the selected outfit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo />
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              &copy; {new Date().getFullYear()} StyleAI Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}