
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/header';
import Logo from '@/components/common/logo';
import { ArrowRight, Scan, Shirt, Wand2, Star, Users, Shield, Mail, MessageSquare, HelpCircle, ExternalLink, Github, Twitter, Instagram } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Content */}
                <div className="space-y-6 lg:space-y-8 animate-fade-in text-center lg:text-left">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    Redefine Your Style with AI.
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                    See yourself in new outfits instantly. Your personal stylist is just a click away.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                    <Button 
                      asChild 
                      size="lg" 
                      className="shadow-lg transition-all hover:scale-105 hover:shadow-xl h-12 text-base"
                    >
                      <Link href="/dashboard">
                        Try For Free <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      size="lg" 
                      variant="outline" 
                      className="transition-all hover:scale-105 h-12 text-base"
                    >
                      <Link href="/business/dashboard">
                        Explore Business Tools
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative w-full max-w-md mx-auto lg:max-w-none animate-fade-in-delay">
                  <div className="relative aspect-square rounded-full overflow-hidden shadow-2xl shadow-primary/10 border-8 border-background">
                    <Image
                      src="https://images.unsplash.com/photo-1552664199-fd31f7431a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdHlsaXNoJTIwd29tYW4lMjBtaW5pbWFsfGVufDB8fHx8MTc2NzE1ODIzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="A stylish woman in a bright, modern outfit looking at her phone"
                      fill
                      unoptimized
                      priority
                      className="object-cover"
                      data-ai-hint="stylish woman"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-20 sm:py-24 lg:py-28">
              {/* Section Header */}
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                  A Magical Experience
                </h2>
                <p className="text-lg text-muted-foreground">
                  Simple, intuitive, and powerful.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="space-y-4 p-6 rounded-2xl bg-background/50 hover:bg-background transition-all hover:shadow-xl hover:scale-105">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">1. Upload Your Closet</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Quickly digitize your wardrobe by adding photos of yourself and your clothing items.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-2xl bg-background/50 hover:bg-background transition-all hover:shadow-xl hover:scale-105">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                    <Scan className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">2. Select & Combine</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Choose a photo of yourself and mix-and-match any items from your virtual closet.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-2xl bg-background/50 hover:bg-background transition-all hover:shadow-xl hover:scale-105 sm:col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">3. Generate Your Look</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our AI generates a realistic image of you wearing the selected outfit in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="w-full bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-20 sm:py-24 lg:py-28">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                  Loved by Style Enthusiasts
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of users creating amazing virtual try-ons
                </p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                  <p className="text-muted-foreground">Virtual Try-Ons Created</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Happy Users</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">99%</div>
                  <p className="text-muted-foreground">Satisfaction Rate</p>
                </div>
              </div>

              {/* Testimonials */}
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-background/50 border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm leading-relaxed">
                      "StyleAI has completely transformed how I shop for clothes. I can see how outfits look on me before buying!"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">Fashion Blogger</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/50 border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm leading-relaxed">
                      "The AI technology is incredible. It's like having a personal stylist available 24/7. Absolutely love it!"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Mike Chen</p>
                        <p className="text-xs text-muted-foreground">Business Owner</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/50 border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm leading-relaxed">
                      "Perfect for my business! I can create professional catalog images without expensive photoshoots."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Emma Rodriguez</p>
                        <p className="text-xs text-muted-foreground">Boutique Owner</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-20 sm:py-24 lg:py-28">
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <Badge variant="secondary" className="mb-4">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </Badge>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to know about StyleAI Studio
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="item-1" className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left">
                      How accurate are the virtual try-ons?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our AI technology provides highly realistic results by analyzing body proportions, clothing fit, and lighting. While results are very accurate, they're meant to give you a great preview of how outfits might look.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left">
                      Is my data secure and private?
                    </AccordionTrigger>
                    <AccordionContent>
                      Absolutely! We take privacy seriously. Your photos are encrypted, stored securely in Google Drive, and never shared with third parties. You have full control over your data and can delete it anytime.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left">
                      What types of clothing work best?
                    </AccordionTrigger>
                    <AccordionContent>
                      StyleAI works great with most clothing types including tops, dresses, jackets, and accessories. For best results, use clear, well-lit photos with clothing laid flat or on hangers.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left">
                      Can I use this for my business?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes! StyleAI includes business tools for creating professional catalog images. Upload your products and mannequin photos to generate stunning marketing materials without expensive photoshoots.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left">
                      How many try-ons can I generate?
                    </AccordionTrigger>
                    <AccordionContent>
                      You can generate up to 3 virtual try-ons per day with our free tier. This helps us manage server costs while letting you explore the technology. More usage options may be available in the future.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Trust/Security Section */}
        <section className="w-full bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-20 sm:py-24 lg:py-28">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                  Your Privacy & Security Matter
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Built with enterprise-grade security and privacy protection. Your data stays yours.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary/10 text-primary rounded-2xl">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">End-to-End Encryption</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All your photos and data are encrypted both in transit and at rest using industry-standard security protocols.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary/10 text-primary rounded-2xl">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">No Data Sharing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We never sell, share, or use your personal photos for any purpose other than generating your virtual try-ons.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary/10 text-primary rounded-2xl">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">Full Control</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You own your data completely. Delete your account and all associated data anytime with just one click.
                  </p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex justify-center items-center gap-8 mt-16 opacity-60">
                <div className="text-sm font-medium">Powered by:</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-500"></div>
                  <span className="text-sm font-medium">Google Cloud</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-500"></div>
                  <span className="text-sm font-medium">Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-20 sm:py-24 lg:py-28">
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 lg:p-12 border-2 border-primary/20">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Stay Updated with StyleAI
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Be the first to know about new features, styling tips, and exclusive early access to upcoming tools.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 bg-background"
                    />
                    <Button className="shadow-lg hover:shadow-xl transition-all">
                      <Mail className="mr-2 h-4 w-4" />
                      Subscribe
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    No spam, unsubscribe anytime. We respect your privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Enhanced Footer */}
      <footer className="w-full border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="py-12 lg:py-16">
            {/* Main footer content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <Logo />
                <p className="text-muted-foreground mt-4 max-w-md leading-relaxed">
                  Redefine your style with AI-powered virtual try-ons. Create stunning looks instantly and discover your perfect style.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                      Virtual Try-On
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/wardrobe" className="text-muted-foreground hover:text-foreground transition-colors">
                      My Wardrobe
                    </Link>
                  </li>
                  <li>
                    <Link href="/business/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                      Business Tools
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/history" className="text-muted-foreground hover:text-foreground transition-colors">
                      Style History
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom footer */}
            <div className="pt-8 border-t border-border">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="text-sm text-muted-foreground text-center lg:text-left">
                  <p>&copy; {new Date().getFullYear()} StyleAI Studio. All rights reserved.</p>
                  <p className="mt-1">Powered by Google Cloud & Gemini AI</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    All Systems Operational
                  </Link>
                  <Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
