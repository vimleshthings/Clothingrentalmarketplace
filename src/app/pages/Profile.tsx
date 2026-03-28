import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { currentUser, mockItems } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ItemCard } from "../components/ItemCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Star,
  MapPin,
  Shield,
  Package,
  Heart,
  Settings,
  Edit,
  DollarSign,
  LogOut,
  ListChecks,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function Profile() {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const userId = "current-user";
      
      // Load user's listings
      const itemsResponse = await api.getAllItems();
      const allItems = itemsResponse.items || [];
      const userItems = allItems.filter((item: any) => item.owner?.id === userId);
      setMyListings(userItems);
      
      // Load favorites
      const favResponse = await api.getFavorites(userId);
      const favoriteIds = favResponse.favorites || [];
      const favoriteItems = allItems.filter((item: any) => favoriteIds.includes(item.id));
      setFavorites(favoriteItems);
      
      // Load revenue
      const revenueResponse = await api.getRevenue(userId);
      setRevenue(revenueResponse.revenue || 0);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteChange = () => {
    loadProfileData();
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
    // In a real app, clear session/tokens here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl">{currentUser.name}</h1>
                      {currentUser.verified && (
                        <Badge className="bg-blue-500 gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{currentUser.rating}</span>
                        <span>(32 reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {currentUser.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl mb-1">{myListings.length}</p>
                    <p className="text-sm text-gray-600">Listed Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl mb-1">18</p>
                    <p className="text-sm text-gray-600">Completed Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl mb-1">5</p>
                    <p className="text-sm text-gray-600">Active Rentals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl mb-1 text-green-600">${revenue}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings" className="gap-2">
              <Package className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl">My Listed Items</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={() => navigate("/my-listings")}>
                  <ListChecks className="h-4 w-4" />
                  Manage Listings
                </Button>
                <Button onClick={() => navigate("/list-item")}>Add New Item</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myListings.map((item) => (
                <ItemCard key={item.id} item={item} onFavoriteChange={handleFavoriteChange} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <h2 className="text-xl">Saved Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item) => (
                <ItemCard key={item.id} item={item} isFavorite={true} onFavoriteChange={handleFavoriteChange} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}