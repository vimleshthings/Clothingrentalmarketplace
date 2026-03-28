import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ClothingItem } from "../data/mockData";
import { MapPin, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ClothingItem;
  type: "rent" | "buy";
}

export function CheckoutDialog({
  open,
  onOpenChange,
  item,
  type,
}: CheckoutDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: "",
  });

  const price = type === "rent" ? item.rentPrice : item.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = {
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.image,
        type,
        totalAmount: price,
        deliveryAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          notes: formData.notes,
        },
        deliveryTime: "15-30 mins",
      };

      await api.createOrder(order);
      
      toast.success(
        `Order placed successfully! Delivery expected in 15-30 minutes.`
      );
      onOpenChange(false);
      
      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Order</DialogTitle>
          <DialogDescription>
            {type === "rent" ? "Rental" : "Purchase"} • Delivery within 30 minutes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Order Summary */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {type === "rent" ? "Rental" : "Purchase"}
              </p>
              <p className="text-xl font-semibold">${price}</p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  required
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Delivery Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="E.g., Ring doorbell twice, leave at front desk"
                rows={3}
              />
            </div>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Fast Delivery</p>
              <p className="text-blue-700">
                Expected delivery within 15-30 minutes to addresses within 10km
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CreditCard className="h-5 w-5 text-green-600" />
            <div className="text-sm">
              <p className="font-medium text-green-900">Cash on Delivery</p>
              <p className="text-green-700">
                Pay ${price} when your order arrives
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Placing Order..." : `Place Order - $${price}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
