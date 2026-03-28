import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Header } from "../components/Header";
import { CheckoutDialog } from "../components/CheckoutDialog";
import { mockItems } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Star,
  Shield,
  Clock,
  Package,
  Heart,
} from "lucide-react";

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = mockItems.find((i) => i.id === id);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<"rent" | "buy">("rent");

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl mb-2">Item not found</h2>
            <Button onClick={() => navigate("/")}>Go back home</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleRent = () => {
    setCheckoutType("rent");
    setCheckoutOpen(true);
  };

  const handleBuy = () => {
    setCheckoutType("buy");
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 hover:bg-white"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl">{item.title}</h1>
                {item.owner.verified && (
                  <Badge className="bg-blue-500 gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{item.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {item.category}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Size: {item.size}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {item.condition}
              </Badge>
            </div>

            <Separator />

            {/* Owner Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.owner.avatar} alt={item.owner.name} />
                    <AvatarFallback>{item.owner.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.owner.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {item.owner.rating}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {item.owner.distance} km away • {item.owner.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Fast Delivery</p>
                      <p className="text-sm text-gray-600">
                        Expected within 15-30 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">10km Radius</p>
                      <p className="text-sm text-gray-600">
                        Available for local delivery only
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Pricing & Actions */}
            <div className="space-y-4">
              {item.forRent && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Rent per day</p>
                    <p className="text-2xl">${item.rentPrice}</p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleRent}
                    disabled={!item.available}
                  >
                    Rent Now
                  </Button>
                </div>
              )}

              {item.forSale && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Buy price</p>
                    <p className="text-2xl">${item.price}</p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={handleBuy}
                    disabled={!item.available}
                  >
                    Buy Now
                  </Button>
                </div>
              )}

              {!item.available && (
                <p className="text-center text-sm text-red-600">
                  This item is currently not available
                </p>
              )}
            </div>

            {/* Additional Info */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Additional Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">{item.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium">{item.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition</span>
                    <span className="font-medium">{item.condition}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        type={checkoutType}
        item={item}
      />
    </div>
  );
}