import { Link } from "react-router";
import { useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { ClothingItem } from "../data/mockData";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { api } from "../lib/api";
import { toast } from "sonner";

interface ItemCardProps {
  item: ClothingItem;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
}

export function ItemCard({ item, isFavorite = false, onFavoriteChange }: ItemCardProps) {
  const [favorited, setFavorited] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      const userId = "current-user";
      
      if (favorited) {
        await api.removeFromFavorites(userId, item.id);
        toast.success("Removed from favorites");
      } else {
        await api.addToFavorites(userId, item.id);
        toast.success("Added to favorites");
      }
      
      setFavorited(!favorited);
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/item/${item.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={handleFavoriteClick}
            disabled={loading}
          >
            <Heart 
              className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Not Available
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium line-clamp-1">{item.title}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {item.owner.rating}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{item.owner.distance} km away</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {item.size}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {item.condition}
            </Badge>
          </div>
          <div className="flex items-end justify-between">
            <div>
              {item.forRent && (
                <div className="text-sm">
                  <span className="font-semibold">${item.rentPrice}</span>
                  <span className="text-xs text-gray-600">/day</span>
                </div>
              )}
              {item.forSale && (
                <div className="text-xs text-gray-600">
                  Buy: ${item.price}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              {item.forRent && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">
                  Rent
                </Badge>
              )}
              {item.forSale && (
                <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                  Buy
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}