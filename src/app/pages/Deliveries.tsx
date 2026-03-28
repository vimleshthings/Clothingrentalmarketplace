import { useState } from "react";
import { Header } from "../components/Header";
import { mockOrders } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Clock,
  MapPin,
  Package,
  CheckCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export function Deliveries() {
  const [orders] = useState(mockOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "in-transit":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "returned":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAcceptDelivery = (orderId: string) => {
    toast.success("Delivery accepted! Navigate to pickup location.");
  };

  const handleCompleteDelivery = (orderId: string) => {
    toast.success("Delivery marked as completed!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Delivery Dashboard</h1>
          <p className="text-gray-600">
            Manage pickups and deliveries within 10km radius
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-1">
                {orders.filter((o) => o.status === "pending").length}
              </p>
              <p className="text-sm text-gray-600">Pending Deliveries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-1">
                {orders.filter((o) => o.status === "in-transit").length}
              </p>
              <p className="text-sm text-gray-600">In Transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-1">24</p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Deliveries */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={order.item.image}
                    alt={order.item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{order.item.title}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Order #{order.id} • {order.type === "rent" ? "Rental" : "Purchase"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">
                          ${order.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={order.customer.avatar}
                            alt={order.customer.name}
                          />
                          <AvatarFallback>
                            {order.customer.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-xs">Customer</p>
                          <p className="text-gray-600">{order.customer.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium text-xs">Distance</p>
                          <p className="text-gray-600">
                            {order.customer.distance} km • {order.customer.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium text-xs">Delivery Time</p>
                          <p className="text-gray-600">{order.deliveryTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium text-xs">Type</p>
                          <p className="text-gray-600">
                            {order.type === "rent" ? "Rental" : "Sale"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleAcceptDelivery(order.id)}
                          className="gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept Delivery
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <Navigation className="h-4 w-4" />
                          Navigate
                        </Button>
                      )}
                      {order.status === "in-transit" && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteDelivery(order.id)}
                          className="gap-2 bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark as Delivered
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No active deliveries</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Delivery Guidelines</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• All deliveries must be completed within 30 minutes</li>
                  <li>• Only accept deliveries within 10km radius</li>
                  <li>• Verify customer identity before handover</li>
                  <li>• For rentals, schedule return pickup time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
