import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Upload, ArrowLeft, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

export function ListItem() {
  const navigate = useNavigate();
  const [forRent, setForRent] = useState(true);
  const [forSale, setForSale] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    brand: "",
    condition: "",
    rentPrice: "",
    salePrice: "",
  });

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location detected for 10km delivery radius");
        },
        (error) => {
          const errorMessage = error.message || "Location access denied";
          console.error("Error getting location:", {
            code: error.code,
            message: errorMessage,
            PERMISSION_DENIED: error.code === 1,
            POSITION_UNAVAILABLE: error.code === 2,
            TIMEOUT: error.code === 3,
          });
          setLocationError("Please enable location access for accurate delivery");
          // Don't show error toast on mount - just log it
        },
        {
          timeout: 10000,
          maximumAge: 300000,
          enableHighAccuracy: false,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setSelectedImages((prev) => [...prev, ...newImages]);
              toast.success(`${files.length} image(s) uploaded successfully`);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!formData.category || !formData.condition) {
      toast.error("Please select category and condition");
      return;
    }

    if (!forRent && !forSale) {
      toast.error("Item must be available for rent or sale");
      return;
    }
    
    setLoading(true);
    
    try {
      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        size: formData.size,
        brand: formData.brand,
        condition: formData.condition,
        image: selectedImages[0],
        images: selectedImages,
        price: forSale ? Number(formData.salePrice) : 0,
        rentPrice: forRent ? Number(formData.rentPrice) : 0,
        available: true,
        forRent,
        forSale,
        owner: {
          id: "current-user",
          name: "You",
          rating: 5.0,
          verified: true,
          location: location ? `${location.lat}, ${location.lng}` : "Your Location",
          distance: 0,
        },
      };
      
      const response = await api.createItem(itemData);
      console.log("Item created:", response);
      toast.success("Item listed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating item:", error);
      toast.error("Failed to list item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">List Your Clothing</CardTitle>
            <p className="text-sm text-gray-600">
              Share your wardrobe with people nearby
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photos *</Label>
                
                {/* Image Previews */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Area */}
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer block"
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB • Multiple images allowed
                  </p>
                  {selectedImages.length > 0 && (
                    <p className="text-sm text-blue-600 mt-2">
                      {selectedImages.length} image(s) selected
                    </p>
                  )}
                </label>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Designer Leather Jacket"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your item, its condition, and any special features..."
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Category and Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jackets">Jackets</SelectItem>
                      <SelectItem value="Dresses">Dresses</SelectItem>
                      <SelectItem value="Shirts">Shirts</SelectItem>
                      <SelectItem value="Pants">Pants</SelectItem>
                      <SelectItem value="Suits">Suits</SelectItem>
                      <SelectItem value="Shoes">Shoes</SelectItem>
                      <SelectItem value="Coats">Coats</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Input
                    id="size"
                    name="size"
                    placeholder="e.g., M, L, 32, 10"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
              </div>

              {/* Brand and Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="e.g., Zara, H&M"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    required
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Availability Options */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Availability</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Available for Rent</Label>
                    <p className="text-sm text-gray-600">
                      Let people rent your item per day
                    </p>
                  </div>
                  <Switch checked={forRent} onCheckedChange={setForRent} />
                </div>

                {forRent && (
                  <div className="space-y-2 ml-4">
                    <Label htmlFor="rentPrice">Rent Price per Day ($) *</Label>
                    <Input
                      id="rentPrice"
                      name="rentPrice"
                      type="number"
                      placeholder="25"
                      min="1"
                      required={forRent}
                      value={formData.rentPrice}
                      onChange={(e) => setFormData({ ...formData, rentPrice: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Available for Sale</Label>
                    <p className="text-sm text-gray-600">
                      Let people buy your item
                    </p>
                  </div>
                  <Switch checked={forSale} onCheckedChange={setForSale} />
                </div>

                {forSale && (
                  <div className="space-y-2 ml-4">
                    <Label htmlFor="salePrice">Sale Price ($) *</Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      placeholder="250"
                      min="1"
                      required={forSale}
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Listing..." : "List Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}