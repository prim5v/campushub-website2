import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Home, Search, Building2, User, Menu, X, LogOut, ShoppingCart, ClipboardList } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/listings", label: "Browse Rooms", icon: Search },
    { href: "/landlord", label: "For Landlords", icon: Building2 },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingCart }, // New Marketplace link
  ];

  const { user, logout } = useAuth();

  // Filter nav links based on role
  const filteredNavLinks = navLinks.filter(link => {
    if (link.href === "/landlord" && user?.role === "comrade") return false;
    return true;
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground" data-testid="logo-text">
              Campus<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {filteredNavLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="gap-2"
                  data-testid={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Profile / Auth buttons */}
        <div className="hidden md:flex items-center gap-3 relative">

          {/* Make Room Request Button */}
          <Link href="/room-request">
            <Button className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Make Request
            </Button>
          </Link>

          {!user ? (
            <>
              <Link href="/signin">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                >
                  {user.username?.[0]?.toUpperCase() || "U"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                    <Link href="/profile">
                      <button className="w-full text-left px-4 py-3 hover:bg-muted flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-muted flex items-center gap-2 text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-2">
            {filteredNavLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}

            <div className="pt-4 border-t border-border/50 space-y-2">
            <Link href="/room-request">
              <Button className="w-full justify-start gap-2">
                <ClipboardList className="w-4 h-4" />
                Make Room Request
              </Button>
            </Link>
              {!user ? (
                <>
                  <Link href="/signin">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
