import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetPlatformStats, useGetFeaturedUsers } from "@workspace/api-client-react";
import { UserCard } from "@/components/shared/user-card";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ShieldCheck, Users, MapPin, ArrowRight, HeartHandshake } from "lucide-react";
import heroImage from "@assets/generated_images/hero-homecare.jpg";

export function Home() {
  const { data: stats } = useGetPlatformStats();
  const { data: featuredHousekeepers, isLoading: isFeaturedLoading } = useGetFeaturedUsers({ role: "housekeeper" });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,var(--tw-colors-primary)_0,transparent_100%)] mix-blend-multiply"></div>
          
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary text-sm font-semibold mb-6 tracking-wide border border-primary/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Kenya's Most Trusted Network
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight">
                Find Reliable Help.<br/>
                <span className="text-primary relative inline-block">
                  Build a Safer Home.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Connect directly with vetted, dedicated house helps across Kenya. No hidden agency fees. Just honest work and happy families.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-bold">
                    Find a House Help
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-full font-bold border-border/60 hover:bg-muted">
                    I am looking for work
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>ID Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Community Rated</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 lg:ml-auto w-full max-w-[500px] mx-auto hidden md:block">
              <div className="absolute -inset-4 bg-gradient-to-tr from-accent/50 to-transparent rounded-[2.5rem] -z-10 transform rotate-3"></div>
              <div className="absolute -inset-4 bg-gradient-to-bl from-secondary/10 to-transparent rounded-[2.5rem] -z-10 transform -rotate-2"></div>
              
              <img 
                src={heroImage} 
                alt="Happy Kenyan family with house help" 
                className="rounded-3xl shadow-2xl object-cover w-full aspect-[4/5] border border-white/20"
              />
              
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Successful Matches</p>
                  <p className="text-xl font-bold text-foreground">{stats?.verifiedEmployers ? (stats.verifiedEmployers + 1200).toLocaleString() : "1,200+"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-12 bg-white border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/40">
              <div className="px-4">
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">{stats?.totalHousekeepers ? stats.totalHousekeepers.toLocaleString() : "2,500+"}</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Registered Helps</p>
              </div>
              <div className="px-4">
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">{stats?.verifiedHousekeepers ? stats.verifiedHousekeepers.toLocaleString() : "1,800+"}</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verified Profiles</p>
              </div>
              <div className="px-4">
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">{stats?.totalEmployers ? stats.totalEmployers.toLocaleString() : "3,200+"}</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Families</p>
              </div>
              <div className="px-4">
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">{stats?.countiesCovered ? stats.countiesCovered : "47"}</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Counties</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-background relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Andy Connect Works</h2>
              <p className="text-muted-foreground text-lg">We've simplified the process so you can focus on building a great working relationship.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-border/60 -z-10"></div>
              
              <div className="text-center relative">
                <div className="w-20 h-20 mx-auto bg-white border-4 border-background shadow-md rounded-full flex items-center justify-center text-primary mb-6 relative z-10">
                  <span className="text-2xl font-black">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Create a Profile</h3>
                <p className="text-muted-foreground leading-relaxed">Register as an employer or a housekeeper. Tell us what you need or what skills you offer.</p>
              </div>
              
              <div className="text-center relative">
                <div className="w-20 h-20 mx-auto bg-white border-4 border-background shadow-md rounded-full flex items-center justify-center text-primary mb-6 relative z-10">
                  <span className="text-2xl font-black">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Verified</h3>
                <p className="text-muted-foreground leading-relaxed">Pay a small, one-time verification fee of Ksh 100 via Mpesa to unlock direct contacts.</p>
              </div>
              
              <div className="text-center relative">
                <div className="w-20 h-20 mx-auto bg-white border-4 border-background shadow-md rounded-full flex items-center justify-center text-primary mb-6 relative z-10">
                  <span className="text-2xl font-black">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Connect Directly</h3>
                <p className="text-muted-foreground leading-relaxed">Call or email your matches directly. No middlemen, no commission fees taken from salaries.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROFILES */}
        <section className="py-24 bg-white border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured House Helps</h2>
                <p className="text-muted-foreground text-lg">Meet some of the dedicated professionals ready to help manage your home.</p>
              </div>
              <Link href="/browse">
                <Button variant="ghost" className="group font-semibold text-primary hover:text-primary hover:bg-accent/50 rounded-full pl-6 pr-4">
                  View All Profiles <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {isFeaturedLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[360px] bg-muted/50 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : featuredHousekeepers && featuredHousekeepers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredHousekeepers.slice(0, 4).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border/60">
                <p className="text-muted-foreground">No featured profiles found at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-colors-primary)_0,transparent_40%)] opacity-30"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to find the perfect match?</h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join thousands of Kenyan families and dedicated professionals building stronger homes together.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-secondary hover:bg-secondary/90 text-white font-bold border-none">
                Create Your Profile Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
