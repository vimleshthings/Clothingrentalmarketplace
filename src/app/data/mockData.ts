export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  verified: boolean;
  location: string;
  distance: number; // in km
}

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  brand: string;
  condition: string;
  image: string;
  price: number;
  rentPrice: number;
  available: boolean;
  forRent: boolean;
  forSale: boolean;
  owner: User;
}

export interface Order {
  id: string;
  item: ClothingItem;
  type: "rent" | "buy";
  status: "pending" | "confirmed" | "in-transit" | "delivered" | "returned";
  deliveryTime: string;
  customer: User;
  totalAmount: number;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mzc2NDgxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    verified: true,
    location: "Downtown",
    distance: 2.3,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/flagged/photo-1596479042555-9265a7fa7983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mzc4Nzc0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    verified: true,
    location: "Midtown",
    distance: 4.7,
  },
];

export const mockItems: ClothingItem[] = [
  {
    id: "1",
    title: "Designer Leather Jacket",
    description: "Premium leather jacket in excellent condition. Perfect for casual or semi-formal occasions.",
    category: "Jackets",
    size: "M",
    brand: "Zara",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1762289441987-de54678962c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc3Mzg1NjM1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    price: 250,
    rentPrice: 25,
    available: true,
    forRent: true,
    forSale: true,
    owner: mockUsers[0],
  },
  {
    id: "2",
    title: "Elegant Evening Dress",
    description: "Beautiful evening dress perfect for weddings and formal events. Dry cleaned and ready to wear.",
    category: "Dresses",
    size: "S",
    brand: "H&M",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1759893362613-8bb8bb057af1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBib3V0aXF1ZXxlbnwxfHx8fDE3NzM4MjQ4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 180,
    rentPrice: 35,
    available: true,
    forRent: true,
    forSale: true,
    owner: mockUsers[1],
  },
  {
    id: "3",
    title: "Casual Linen Shirt",
    description: "Comfortable linen shirt for summer days. Breathable and stylish.",
    category: "Shirts",
    size: "L",
    brand: "Uniqlo",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1704899507578-c7c33d6baf85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc3Mzg1NjQ0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    price: 45,
    rentPrice: 8,
    available: true,
    forRent: true,
    forSale: true,
    owner: mockUsers[0],
  },
  {
    id: "4",
    title: "Premium Denim Jeans",
    description: "High-quality denim with perfect fit. Barely worn, like new condition.",
    category: "Pants",
    size: "32",
    brand: "Levi's",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzM3ODU2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 89,
    rentPrice: 15,
    available: true,
    forRent: true,
    forSale: true,
    owner: mockUsers[1],
  },
  {
    id: "5",
    title: "Classic Formal Suit",
    description: "Professional two-piece suit perfect for business meetings and formal occasions.",
    category: "Suits",
    size: "42R",
    brand: "Hugo Boss",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1771323626487-54a69a0de04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBzdWl0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzczODMwMzIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 450,
    rentPrice: 60,
    available: true,
    forRent: true,
    forSale: true,
    owner: mockUsers[0],
  },
  {
    id: "6",
    title: "Designer Sneakers",
    description: "Limited edition sneakers in pristine condition. Perfect for streetwear enthusiasts.",
    category: "Shoes",
    size: "10",
    brand: "Nike",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1618153478389-b2ed8de18ed3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzM4MzA3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 200,
    rentPrice: 20,
    available: true,
    forRent: true,
    forSale: false,
    owner: mockUsers[1],
  },
  {
    id: "7",
    title: "Summer Floral Dress",
    description: "Light and airy summer dress with beautiful floral pattern. Perfect for beach vacations.",
    category: "Dresses",
    size: "M",
    brand: "Mango",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1602303894456-398ce544d90b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzczODM1NjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 65,
    rentPrice: 12,
    available: true,
    forRent: true,
    forSale: true,
    owner: mockUsers[0],
  },
  {
    id: "8",
    title: "Warm Winter Coat",
    description: "Heavy-duty winter coat to keep you warm in cold weather. High-quality insulation.",
    category: "Coats",
    size: "L",
    brand: "North Face",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1760533091973-1262bf57d244?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBjb2F0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzczODU2NDUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 320,
    rentPrice: 40,
    available: true,
    forRent: true,
    forSale: true,
    owner: mockUsers[1],
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD001",
    item: mockItems[0],
    type: "rent",
    status: "confirmed",
    deliveryTime: "15 mins",
    customer: mockUsers[1],
    totalAmount: 25,
  },
  {
    id: "ORD002",
    item: mockItems[1],
    type: "buy",
    status: "in-transit",
    deliveryTime: "8 mins",
    customer: mockUsers[0],
    totalAmount: 180,
  },
  {
    id: "ORD003",
    item: mockItems[4],
    type: "rent",
    status: "pending",
    deliveryTime: "25 mins",
    customer: mockUsers[1],
    totalAmount: 60,
  },
];

export const currentUser: User = {
  id: "current",
  name: "You",
  avatar: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mzc2NDgxNHww&ixlib=rb-4.1.0&q=80&w=1080",
  rating: 5.0,
  verified: true,
  location: "Your Location",
  distance: 0,
};

// Mock story data for Instagram-style stories
export const mockStories = [
  {
    id: "story-1",
    user: mockUsers[0],
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-showing-her-outfit-of-the-day-50933-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?w=100&h=100&fit=crop",
    itemId: "1",
    itemTitle: "Designer Leather Jacket",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    viewed: false,
  },
  {
    id: "story-2",
    user: mockUsers[0],
    video: "https://assets.mixkit.co/videos/preview/mixkit-elegant-woman-in-a-black-dress-50932-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?w=100&h=100&fit=crop",
    itemId: "7",
    itemTitle: "Summer Floral Dress",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    viewed: false,
  },
  {
    id: "story-3",
    user: mockUsers[1],
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-with-casual-clothes-showing-himself-50936-large.mp4",
    thumbnail: "https://images.unsplash.com/flagged/photo-1596479042555-9265a7fa7983?w=100&h=100&fit=crop",
    itemId: "4",
    itemTitle: "Premium Denim Jeans",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    viewed: false,
  },
  {
    id: "story-4",
    user: mockUsers[1],
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-red-shirt-50934-large.mp4",
    thumbnail: "https://images.unsplash.com/flagged/photo-1596479042555-9265a7fa7983?w=100&h=100&fit=crop",
    itemId: "5",
    itemTitle: "Classic Formal Suit",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    viewed: true,
  },
];