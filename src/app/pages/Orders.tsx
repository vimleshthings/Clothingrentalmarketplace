import { useState } from "react";
import { Header } from "../components/Header";
import { mockOrders } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Clock, MapPin, Package, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function Orders() {
  const [orders] = useState(mockOrders);

  const activeOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "returned"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "returned"
  );

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

  const handleCancelOrder = (orderId: string) => {
    toast.success("Order cancelled successfully");
  };

  const handleRequestReturn = (orderId: string) => {
    toast.success("Return pickup scheduled within 30 minutes");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">My Orders</h1>
          <p className="text-gray-600">Track your rentals and purchases</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Package className="h-4 w-4" />
              Active ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <Clock className="h-4 w-4" />
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No active orders</p>
                  <Button className="mt-4" onClick={() => window.location.href = "/"}>
                    Browse Items
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={order.item.image}
                        alt={order.item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">
                                {order.item.title}
                              </h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Order #{order.id} •{" "}
                              {order.type === "rent" ? "Rental" : "Purchase"}
                            </p>
                          </div>
                          <p className="text-xl">${order.totalAmount}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span>ETA: {order.deliveryTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-600" />
                            <span>
                              {order.item.owner.distance} km •{" "}
                              {order.item.owner.location}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative pt-2">
                          <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                            <span>Confirmed</span>
                            <span>In Transit</span>
                            <span>Delivered</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-blue-500 transition-all duration-500 ${
                                order.status === "confirmed"
                                  ? "w-1/3"
                                  : order.status === "in-transit"
                                  ? "w-2/3"
                                  : order.status === "delivered"
                                  ? "w-full"
                                  : "w-0"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel Order
                            </Button>
                          )}
                          {order.type === "rent" &&
                            order.status === "delivered" && (
                              <Button
                                size="sm"
                                className="gap-2"
                                onClick={() => handleRequestReturn(order.id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                                Request Return Pickup
                              </Button>
                            )}
                          <Button size="sm" variant="outline">
                            Contact Seller
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No completed orders yet</p>
                </CardContent>
              </Card>
            ) : (
              completedOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={order.item.image}
                        alt={order.item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">
                                {order.item.title}
                              </h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Order #{order.id} •{" "}
                              {order.type === "rent" ? "Rental" : "Purchase"}
                            </p>
                          </div>
                          <p className="text-xl">${order.totalAmount}</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            Order Again
                          </Button>
                          <Button size="sm" variant="outline">
                            Leave Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
