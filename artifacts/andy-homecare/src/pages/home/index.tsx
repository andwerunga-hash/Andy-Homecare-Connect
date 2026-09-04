import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetPlatformStats, useGetFeaturedUsers } from "@workspace/api-client-react";
import { UserCard } from "@/components/shared/user-card";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  ShieldCheck,
  Users,
  MapPin,
  ArrowRight,
  HeartHandshake,
  Search,
  CheckCircle2,
  BriefcaseBusiness,
  Sparkles,
  Star,
} from "lucide-react";
import heroImage from "@assets/generated_images/hero-homecare.jpg";

export function Home() {
  const { data: stats } = useGetPlatformStats();
  const { data: featuredHousekeepers, isLoading: isFeaturedLoading } =
    useGetFeaturedUsers({ role: "housekeeper" });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/30">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent blur-3xl" />

          <div className="container mx-auto px-4 py-14 md:py-20 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
              <div className="relative z-10 max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/90 px-4 py-2 text-sm font-semibold text-primary shadow-md backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                  Connecting homes with trusted people
                </div>

                <h1 className="mb-6 text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                  Trusted help for a{" "}
                  <span className="text-primary">happier home.</span>
                </h1>

                <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Andy Homecare Connect makes it easier for families and
                  hardworking homecare professionals to find each other,
                  connect directly and build trusted working relationships.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="h-14 w-full rounded-full px-8 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                    >
                      Find a Housekeeper
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full rounded-full border-2 bg-white px-8 text-base font-bold transition-all hover:-translate-y-0.5 hover:bg-accent sm:w-auto"
                    >
                      I am looking for work
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Verified profiles
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Trusted connections
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Growing across Kenya
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">
                <div className="absolute -inset-5 rounded-[2.5rem] bg-primary/10 blur-xl" />
                <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-accent/80" />
                <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-primary/10" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                  <img
                    src={heroImage}
                    alt="Happy Kenyan family with homecare professional"
                    className="aspect-[4/4.3] w-full rounded-[1.6rem] object-cover"
                  />

                  <div className="absolute bottom-7 left-7 right-7 flex items-center gap-4 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <HeartHandshake className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Growing community
                      </p>
                      <p className="text-lg font-extrabold">
                        {stats?.verifiedHousekeepers
                          ? `${stats.verifiedHousekeepers.toLocaleString()}+ verified profiles`
                          : "Trusted homecare professionals"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST / STATS */}
        <section className="border-y border-border/50 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-10">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                A growing network
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="group rounded-2xl border border-border/60 bg-background p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
                <Users className="mx-auto mb-3 h-6 w-6 text-primary" />
                <p className="text-3xl font-black">
                  {stats?.totalHousekeepers
                    ? stats.totalHousekeepers.toLocaleString()
                    : "2,500+"}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Housekeepers
                </p>
              </div>

              <div className="rounded-2xl bg-background p-5 text-center">
                <ShieldCheck className="mx-auto mb-3 h-6 w-6 text-primary" />
                <p className="text-3xl font-black">
                  {stats?.verifiedHousekeepers
                    ? stats.verifiedHousekeepers.toLocaleString()
                    : "1,800+"}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Verified profiles
                </p>
              </div>

              <div className="rounded-2xl bg-background p-5 text-center">
                <HeartHandshake className="mx-auto mb-3 h-6 w-6 text-primary" />
                <p className="text-3xl font-black">
                  {stats?.totalEmployers
                    ? stats.totalEmployers.toLocaleString()
                    : "3,200+"}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Employers
                </p>
              </div>

              <div className="rounded-2xl bg-background p-5 text-center">
                <MapPin className="mx-auto mb-3 h-6 w-6 text-primary" />
                <p className="text-3xl font-black">
                  {stats?.countiesCovered || "47"}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Counties covered
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY ANDY */}
        <section className="bg-background py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="mb-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-bold text-primary">
                Why Andy Homecare Connect?
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                A simpler way to find the right connection
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Whether you need dependable help at home or you're looking for
                a good employer, we've designed the experience around trust,
                simplicity and direct connections.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="group rounded-3xl border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Verified Profiles</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Approved profiles help create confidence before making a
                  connection.
                </p>
              </div>

              <div className="group rounded-3xl border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Easy Discovery</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Browse available professionals and find people who match
                  your needs.
                </p>
              </div>

              <div className="group rounded-3xl border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Real Opportunities</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Give homecare professionals a place to showcase their skills
                  and find opportunities.
                </p>
              </div>

              <div className="group rounded-3xl border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <HeartHandshake className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Direct Connection</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Connect directly without unnecessary middlemen between
                  families and professionals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-bold text-primary">
                  Simple by design
                </div>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                  How it works
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Getting started takes just a few simple steps. Create your
                  profile, complete verification and start connecting.
                </p>

                <Link href="/register">
                  <Button className="mt-7 h-12 rounded-full px-7 font-bold">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="group rounded-3xl border border-border/60 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground">
                    1
                  </div>
                  <h3 className="mb-2 text-lg font-bold">Create a profile</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Register as an employer or housekeeper and tell us about
                    yourself.
                  </p>
                </div>

                <div className="rounded-3xl border bg-background p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground">
                    2
                  </div>
                  <h3 className="mb-2 text-lg font-bold">Get verified</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Complete the required verification process to build trust.
                  </p>
                </div>

                <div className="rounded-3xl border bg-background p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground">
                    3
                  </div>
                  <h3 className="mb-2 text-lg font-bold">Connect</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Discover suitable matches and connect directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROFILES */}
        <section className="bg-background py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-primary">
                  <Star className="h-4 w-4" />
                  Meet our community
                </div>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                  Featured Housekeepers
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Discover dedicated professionals ready to bring their skills
                  and experience to your home.
                </p>
              </div>

              <Link href="/browse">
                <Button
                  variant="outline"
                  className="group rounded-full font-bold"
                >
                  View All Profiles
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {isFeaturedLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[360px] animate-pulse rounded-3xl bg-muted/60"
                  />
                ))}
              </div>
            ) : featuredHousekeepers && featuredHousekeepers.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredHousekeepers.slice(0, 4).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-white py-16 text-center shadow-sm">
                <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No featured profiles found at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-zinc-950 py-24 text-white md:py-28">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80">
                <HeartHandshake className="h-4 w-4" />
                Your next connection could be here
              </div>

              <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                Ready to find the right match?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
                Join Andy Homecare Connect and take the next step toward a
                trusted homecare connection.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-14 w-full rounded-full px-9 text-base font-bold sm:w-auto"
                  >
                    Create Your Profile
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-full rounded-full border-white/20 bg-white/5 px-9 text-base font-bold text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    Browse Profiles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
