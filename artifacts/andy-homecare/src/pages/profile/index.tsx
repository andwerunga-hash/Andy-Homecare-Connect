import { useParams, Link } from "wouter";
import { useGetUser } from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, CheckCircle2, ShieldAlert, Share2, ArrowLeft, Calendar, Briefcase, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : 0;
  const { data: user, isLoading, error } = useGetUser(userId);
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user?.fullName} - Andy Homecare Connect`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to your clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="animate-pulse space-y-8 w-full max-w-3xl">
            <div className="h-64 bg-muted rounded-3xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-48 bg-muted rounded-xl"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-muted-foreground mb-8">The user profile you are looking for does not exist or has been removed.</p>
          <Link href="/browse">
            <Button>Browse Profiles</Button>
          </Link>
        </main>
      </div>
    );
  }

  const isHousekeeper = user.role === "housekeeper";
  const initials = user.fullName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Navbar />

      <div className="bg-primary text-primary-foreground py-4 hidden md:block">
        <div className="container mx-auto px-4 flex items-center text-sm font-medium opacity-80">
          <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>{user.fullName}</span>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        <Link href="/browse" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-6 md:hidden">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
        </Link>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Left Column: Photo & Quick Actions */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 to-accent"></div>
              
              <Avatar className="w-32 h-32 mx-auto border-4 border-white bg-muted shadow-md relative z-10 mb-4">
                <AvatarImage src={user.photoUrl || undefined} alt={user.fullName} className="object-cover" />
                <AvatarFallback className="text-3xl bg-accent text-primary font-bold">{initials}</AvatarFallback>
              </Avatar>
              
              <h1 className="text-2xl font-extrabold text-foreground mb-1 relative z-10">{user.fullName}</h1>
              
              <Badge variant={isHousekeeper ? "default" : "secondary"} className="mb-4 uppercase text-[10px] tracking-wider font-bold">
                {isHousekeeper ? "Housekeeper" : "Employer"}
              </Badge>

              <div className="flex items-center justify-center text-muted-foreground text-sm font-medium mb-6">
                <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                {user.county}
              </div>

              {user.paymentVerified ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-primary rounded-full text-sm font-bold border border-primary/20 mb-6">
                  <CheckCircle2 className="w-4 h-4" /> ID & Payment Verified
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-bold border border-yellow-200 mb-6">
                  <ShieldAlert className="w-4 h-4" /> Pending Verification
                </div>
              )}

              <Button variant="outline" className="w-full rounded-full font-bold" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" /> Share Profile
              </Button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
              <h3 className="font-bold text-lg mb-4 border-b border-border pb-3">Contact Details</h3>
              
              {user.paymentVerified ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Phone</p>
                      <a href={`tel:${user.phone}`} className="text-foreground font-bold hover:text-primary transition-colors">{user.phone}</a>
                    </div>
                  </div>
                  
                  {user.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email</p>
                        <a href={`mailto:${user.email}`} className="text-foreground font-bold hover:text-primary transition-colors break-all">{user.email}</a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <ShieldAlert className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    Contact information is hidden until this profile is verified.
                  </p>
                  {!user.paymentVerified && (
                    <Link href={`/payment?userId=${user.id}`}>
                      <Button className="w-full font-bold bg-primary text-primary-foreground">Verify Now to Unlock</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
              <h2 className="text-xl font-bold mb-4">About Me</h2>
              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground">
                <p>{user.bio || `Hi, I'm ${user.fullName}. I'm registered on Andy Homecare Connect.`}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-bold text-lg text-foreground">Expectations & Experience</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Monthly Salary</p>
                    <p className="text-lg font-bold text-foreground">Ksh {user.salaryExpectation.toLocaleString()}</p>
                  </li>
                  {user.experience && (
                    <li>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Experience</p>
                      <p className="font-medium text-foreground">{user.experience}</p>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-bold text-lg text-foreground">Availability</h3>
                </div>
                <p className="font-medium text-foreground">{user.availability || "Not specified"}</p>
                
                {user.languages && (
                  <div className="mt-6">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Languages</p>
                    <p className="font-medium text-foreground">{user.languages}</p>
                  </div>
                )}
              </div>
            </div>

            {isHousekeeper && user.skills && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
                <h3 className="font-bold text-lg mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.split(',').map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm bg-accent/50 text-primary font-semibold border-none">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Mobile Fixed CTA */}
      {!user.paymentVerified && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border shadow-lg z-50">
          <Link href={`/payment?userId=${user.id}`}>
            <Button className="w-full h-12 text-base font-bold bg-primary text-primary-foreground shadow-md rounded-full">
              Verify Now to Unlock Contact
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
