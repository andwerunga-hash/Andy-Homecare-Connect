import { User } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Briefcase, Calendar, CheckCircle2 } from "lucide-react";

export function UserCard({ user }: { user: User }) {
  const isHousekeeper = user.role === "housekeeper";
  const initials = user.fullName.substring(0, 2).toUpperCase();

  return (
    <Link href={`/profile/${user.id}`} className="block h-full transition-transform hover:-translate-y-1 hover-elevate">
      <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card hover:shadow-md transition-shadow">
        <CardHeader className="p-0">
          <div className="h-24 bg-gradient-to-r from-primary/10 to-accent w-full relative">
            {user.paymentVerified && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Verified</span>
              </div>
            )}
          </div>
          <div className="px-5 pb-2 relative flex justify-between items-end -mt-10">
            <Avatar className="w-20 h-20 border-4 border-card bg-muted shadow-sm">
              <AvatarImage src={user.photoUrl || undefined} alt={user.fullName} className="object-cover" />
              <AvatarFallback className="text-xl bg-accent text-primary font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <Badge variant={isHousekeeper ? "default" : "secondary"} className="mb-2 uppercase text-[10px] tracking-wider font-bold">
              {isHousekeeper ? "Housekeeper" : "Employer"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="px-5 py-3 flex-1 flex flex-col">
          <h3 className="font-bold text-lg leading-tight mb-1 text-card-foreground line-clamp-1">{user.fullName}</h3>
          
          <div className="space-y-2 mt-3 flex-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 shrink-0 text-primary/70" />
              <span className="truncate">{user.county}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 mr-2 shrink-0 text-primary/70" />
              <span className="font-medium text-foreground">Ksh {user.salaryExpectation.toLocaleString()}/mo</span>
            </div>

            {user.availability && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2 shrink-0 text-primary/70" />
                <span className="truncate">{user.availability}</span>
              </div>
            )}
          </div>

          {isHousekeeper && user.skills && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {user.skills.split(',').slice(0, 3).map((skill, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-muted/50 text-muted-foreground font-normal border-border/50">
                  {skill.trim()}
                </Badge>
              ))}
              {user.skills.split(',').length > 3 && (
                <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground font-normal border-border/50">
                  +{user.skills.split(',').length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="px-5 py-4 border-t border-border/50 bg-muted/20 mt-auto">
          <span className="text-sm font-medium text-primary w-full text-center hover:underline">View Profile</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
