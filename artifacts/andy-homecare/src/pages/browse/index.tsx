import { Link, useLocation } from "wouter";
import { KENYA_COUNTIES } from "@/lib/counties";
import { useListUsers } from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { UserCard } from "@/components/shared/user-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Browse() {
  const [searchParams, setSearchParams] = useState({
    role: "housekeeper" as "housekeeper" | "employer",
    county: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useListUsers({
    role: searchParams.role,
    ...(searchParams.county !== "all" ? { county: searchParams.county } : {}),
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(u => 
      u.fullName.toLowerCase().includes(lower) || 
      (u.skills && u.skills.toLowerCase().includes(lower))
    );
  }, [users, searchTerm]);

  // Unique counties from data or pre-defined list
  const counties = KENYA_COUNTIES;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar / Filters (Desktop) */}
          <aside className="w-full md:w-64 shrink-0 hidden md:block space-y-6 sticky top-24">
            <div>
              <h2 className="text-lg font-bold mb-4">Filters</h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">Looking For</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={searchParams.role === "housekeeper" ? "default" : "outline"} 
                      onClick={() => setSearchParams(p => ({ ...p, role: "housekeeper" }))}
                      className={`text-xs h-9 ${searchParams.role === "housekeeper" ? "bg-primary" : ""}`}
                    >
                      House Helps
                    </Button>
                    <Button 
                      variant={searchParams.role === "employer" ? "default" : "outline"} 
                      onClick={() => setSearchParams(p => ({ ...p, role: "employer" }))}
                      className={`text-xs h-9 ${searchParams.role === "employer" ? "bg-primary" : ""}`}
                    >
                      Employers
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">Location</Label>
                  <Select 
                    value={searchParams.county} 
                    onValueChange={(val) => setSearchParams(p => ({ ...p, county: val }))}
                  >
                    <SelectTrigger className="bg-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Select County" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Kenya</SelectItem>
                      {counties.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                {searchParams.role === "housekeeper" ? "Find House Helps" : "Find Employers"}
              </h1>

              <div className="flex gap-2 w-full sm:w-auto">
                {/* Mobile Filter Trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden bg-white shrink-0">
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader className="mb-6 text-left">
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine your search results</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="font-semibold text-foreground">Looking For</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant={searchParams.role === "housekeeper" ? "default" : "outline"} 
                            onClick={() => setSearchParams(p => ({ ...p, role: "housekeeper" }))}
                            className={searchParams.role === "housekeeper" ? "bg-primary" : ""}
                          >
                            House Helps
                          </Button>
                          <Button 
                            variant={searchParams.role === "employer" ? "default" : "outline"} 
                            onClick={() => setSearchParams(p => ({ ...p, role: "employer" }))}
                            className={searchParams.role === "employer" ? "bg-primary" : ""}
                          >
                            Employers
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="font-semibold text-foreground">Location</Label>
                        <Select 
                          value={searchParams.county} 
                          onValueChange={(val) => setSearchParams(p => ({ ...p, county: val }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select County" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Kenya</SelectItem>
                            {counties.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search names or skills..." 
                    className="pl-9 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[360px] bg-muted animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  Showing {filteredUsers.length} results
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border mt-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No profiles found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  We couldn't find any profiles matching your current filters. Try adjusting your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchParams({ role: "housekeeper", county: "all" });
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
