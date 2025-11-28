
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
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              Your Personal AI Stylist.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Upload your clothes, take a photo, and see yourself in new outfits in seconds. Your virtual wardrobe awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="shadow-lg transition-transform hover:scale-105">
                <Link href="/dashboard">
                  Try it Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="transition-transform hover:scale-105">
                <Link href="/business/dashboard">
                  For Businesses
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl shadow-primary/10 animate-fade-in-delay">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                priority
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                How It Works
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                A simple and magical process to redefine your style.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                  <span className="font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold">Upload Your Wardrobe</h3>
                <p className="text-muted-foreground">Add photos of yourself and your clothing items. We'll digitize your closet.</p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                  <span className="font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold">Select & Generate</h3>
                <p className="text-muted-foreground">Pick a photo of yourself and the clothes you want to try on.</p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                  <span className="font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold">See the Magic</h3>
                <p className="text-muted-foreground">Our AI generates a realistic image of you wearing the selected outfit.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between">
          <Logo />
          <p className="mt-4 sm:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StyleAI Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
