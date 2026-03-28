import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Star, MapPin, Shield, Search, Package, TrendingUp } from "lucide-react";
import { api } from "../lib/api";

interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location: string;
  itemCount: number;
  totalRentals: number;
  joinedDate: string;
  bio?: string;
}

export function Sellers() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = sellers.filter((seller) =>
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSellers(filtered);
    } else {
      setFilteredSellers(sellers);
    }
  }, [searchQuery, sellers]);

  const loadSellers = async () => {
    setLoading(true);
    try {
      // Get all items and extract unique sellers
      const response = await api.getAllItems();
      const items = response.items || [];
      
      // Group items by seller
      const sellerMap = new Map<string, any>();
      
      items.forEach((item: any) => {
        if (item.owner && item.owner.id) {
          const sellerId = item.owner.id;
          if (!sellerMap.has(sellerId)) {
            sellerMap.set(sellerId, {
              id: sellerId,
              name: item.owner.name,
              avatar: item.owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sellerId}`,
              rating: item.owner.rating || 4.5,
              reviewCount: Math.floor(Math.random() * 50) + 10,
              verified: item.owner.verified || false,
              location: item.owner.location || "Location not set",
              itemCount: 1,
              totalRentals: Math.floor(Math.random() * 100) + 20,
              joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
              bio: `Passionate about fashion and sustainable clothing. Renting out my wardrobe to help others look their best!`,
            });
          } else {
            const seller = sellerMap.get(sellerId);
            seller.itemCount += 1;
          }
        }
      });

      const sellersArray = Array.from(sellerMap.values());
      // Sort by rating and item count
      sellersArray.sort((a, b) => {
        if (b.verified !== a.verified) return b.verified ? 1 : -1;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.itemCount - a.itemCount;
      });

      setSellers(sellersArray);
      setFilteredSellers(sellersArray);
    } catch (error) {
      console.error("Error loading sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSellerClick = (sellerId: string) => {
    navigate(`/seller/${sellerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Seller Directory</h1>
          <p className="text-gray-600">
            Browse trusted sellers and discover their unique collections
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search sellers by name or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{sellers.length}</p>
                <p className="text-sm text-gray-600">Active Sellers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl">
                  {sellers.filter((s) => s.verified).length}
                </p>
                <p className="text-sm text-gray-600">Verified Sellers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl">
                  {sellers.reduce((sum, s) => sum + s.itemCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sellers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading sellers...</p>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No sellers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSellers.map((seller) => (
              <Card
                key={seller.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSellerClick(seller.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={seller.avatar} alt={seller.name} />
                      <AvatarFallback>{seller.name[0]}</AvatarFallback>
                    </Avatar>

                    {/* Name & Badge */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <h3 className="font-semibold">{seller.name}</h3>
                        {seller.verified && (
                          <Badge className="bg-blue-500 h-5 w-5 p-0 flex items-center justify-center">
                            <Shield className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{seller.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-600">
                        ({seller.reviewCount})
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      {seller.location}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 w-full p-3 bg-gray-50 rounded-lg mb-4">
                      <div>
                        <p className="text-lg font-semibold">{seller.itemCount}</p>
                        <p className="text-xs text-gray-600">Items</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{seller.totalRentals}</p>
                        <p className="text-xs text-gray-600">Rentals</p>
                      </div>
                    </div>

                    {/* View Button */}
                    <Button className="w-full" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
