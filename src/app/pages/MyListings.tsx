import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

export function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const response = await api.getAllItems();
      const allItems = response.items || [];
      
      // Filter only user's items (items with owner.id === "current-user")
      const userItems = allItems.filter((item: any) => item.owner?.id === "current-user");
      setListings(userItems);
    } catch (error) {
      console.error("Error loading listings:", error);
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    try {
      const item = listings.find(l => l.id === itemId);
      await api.updateItem(itemId, { available: !item.available });
      toast.success("Item availability updated");
      loadListings();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await api.deleteItem(itemId);
      toast.success("Item removed from listings");
      loadListings();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const calculateEarnings = () => {
    // This would come from orders in a real app
    return listings.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">My Listings</h1>
            <p className="text-gray-600">
              Manage your clothing items for rent or sale
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/list-item")}>
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-1">{listings.length}</p>
              <p className="text-sm text-gray-600">Total Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-1">
                {listings.filter((l) => l.available).length}
              </p>
              <p className="text-sm text-gray-600">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-1">${calculateEarnings()}</p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {listings.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge variant="outline">Size: {item.size}</Badge>
                      <Badge variant="outline">{item.condition}</Badge>
                      <Badge variant="outline">{item.brand}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      {item.forRent && (
                        <div>
                          <span className="text-gray-600">Rent:</span>
                          <span className="font-medium ml-1">
                            ${item.rentPrice}/day
                          </span>
                        </div>
                      )}
                      {item.forSale && (
                        <div>
                          <span className="text-gray-600">Sale:</span>
                          <span className="font-medium ml-1">
                            ${item.price}
                          </span>
                        </div>
                      )}
                      <div className="ml-auto">
                        <span className="text-gray-600 mr-2">12 views</span>
                        <span className="text-gray-600">3 inquiries</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          Available:
                        </span>
                        <Switch
                          checked={item.available}
                          onCheckedChange={() =>
                            handleToggleAvailability(item.id)
                          }
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => navigate(`/item/${item.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {listings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Plus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 mb-4">No items listed yet</p>
                <Button onClick={() => navigate("/list-item")}>
                  List Your First Item
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}