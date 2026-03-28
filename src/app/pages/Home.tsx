import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { ItemCard } from "../components/ItemCard";
import { Stories } from "../components/Stories";
import { mockItems, mockStories } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { api } from "../lib/api";
import { toast } from "sonner";

export function Home() {
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState(mockItems);
  const [loading, setLoading] = useState(false);
  const categories = ["All", "Jackets", "Dresses", "Shirts", "Pants", "Suits", "Shoes", "Coats"];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await api.getAllItems();
      const dbItems = response.items || [];
      
      // Combine database items with mock items for demo
      if (dbItems.length > 0) {
        setItems([...dbItems, ...mockItems]);
      } else {
        setItems(mockItems);
      }
    } catch (error) {
      console.error("Error loading items:", error);
      // Use mock items as fallback
      setItems(mockItems);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = category === "All" 
    ? items 
    : items.filter(item => item.category === category);

  const handleAddStory = () => {
    toast.info("Story upload feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Stories Section */}
      <Stories stories={mockStories} onAddStory={handleAddStory} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Discover Clothing Near You</h1>
          <p className="text-gray-600">
            Rent or buy from people within 10km • Delivered in 30 minutes
          </p>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="mb-8">
          <TabsList className="flex-wrap h-auto gap-2">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="rounded-full">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No items found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}