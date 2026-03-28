import { Link, useLocation } from "react-router";
import { Search, User, Package, Truck, Plus, Home, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-rose-500" />
            <span className="text-xl font-semibold">StyleShare</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for clothing..."
                className="pl-10 rounded-full"
              />
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Browse</span>
              </Button>
            </Link>
            <Link to="/list-item">
              <Button
                variant={isActive("/list-item") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">List Item</span>
              </Button>
            </Link>
            <Link to="/orders">
              <Button
                variant={isActive("/orders") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </Button>
            </Link>
            <Link to="/deliveries">
              <Button
                variant={isActive("/deliveries") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">Deliveries</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            <Link to="/sellers">
              <Button
                variant={isActive("/sellers") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Sellers</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}