import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Browse", path: "/browse" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-bold text-lg leading-none">A</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">Andy Homecare Connect</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-border mx-2"></div>
          <Link href="/register">
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
              Join Community
            </Button>
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-background px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block text-sm font-medium p-2 rounded-md ${
                location === link.path ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
