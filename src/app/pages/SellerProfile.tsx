import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ItemCard } from "../components/ItemCard";
import {
  Star,
  MapPin,
  Shield,
  ArrowLeft,
  Package,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { api } from "../lib/api";

export function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellerData();
  }, [sellerId]);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      // Get all items and filter by seller
      const response = await api.getAllItems();
      const allItems = response.items || [];
      
      const sellerItems = allItems.filter((item: any) => item.owner?.id === sellerId);
      setItems(sellerItems);

      if (sellerItems.length > 0) {
        const firstItem = sellerItems[0];
        setSeller({
          id: sellerId,
          name: firstItem.owner.name,
          avatar: firstItem.owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sellerId}`,
          rating: firstItem.owner.rating || 4.5,
          reviewCount: Math.floor(Math.random() * 50) + 10,
          verified: firstItem.owner.verified || false,
          location: firstItem.owner.location || "Location not set",
          itemCount: sellerItems.length,
          totalRentals: Math.floor(Math.random() * 100) + 20,
          joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          bio: `Passionate about fashion and sustainable clothing. I believe in sharing quality pieces and helping others discover their style. All my items are well-maintained and ready for your next event or everyday wear.`,
          responseTime: "Within 2 hours",
          categories: [...new Set(sellerItems.map((item: any) => item.category))],
        });
      }
    } catch (error) {
      console.error("Error loading seller data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteChange = () => {
    loadSellerData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Seller not found</p>
          <div className="text-center mt-4">
            <Button onClick={() => navigate("/sellers")}>Back to Sellers</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate("/sellers")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sellers
        </Button>

        {/* Seller Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32">
                <AvatarImage src={seller.avatar} alt={seller.name} />
                <AvatarFallback className="text-3xl">{seller.name[0]}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 w-full">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl">{seller.name}</h1>
                      {seller.verified && (
                        <Badge className="bg-blue-500 gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{seller.rating.toFixed(1)}</span>
                        <span>({seller.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {seller.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 mb-6">{seller.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-gray-600" />
                      <p className="text-2xl">{seller.itemCount}</p>
                    </div>
                    <p className="text-sm text-gray-600">Items Listed</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                      <p className="text-2xl">{seller.totalRentals}</p>
                    </div>
                    <p className="text-sm text-gray-600">Total Rentals</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <p className="text-2xl">
                        {Math.floor((Date.now() - new Date(seller.joinedDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">Months Active</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <p className="text-2xl">{seller.rating.toFixed(1)}</p>
                    </div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                  </div>
                </div>

                {/* Categories */}
                {seller.categories && seller.categories.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Specializes in:</p>
                    <div className="flex flex-wrap gap-2">
                      {seller.categories.map((category: string) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller's Items */}
        <div className="mb-4">
          <h2 className="text-2xl mb-1">Available Items</h2>
          <p className="text-gray-600">
            Browse {seller.name}'s collection and rent or purchase directly
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">This seller hasn't listed any items yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
