import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { ItemDetails } from "./pages/ItemDetails";
import { Profile } from "./pages/Profile";
import { ListItem } from "./pages/ListItem";
import { MyListings } from "./pages/MyListings";
import { Deliveries } from "./pages/Deliveries";
import { Orders } from "./pages/Orders";
import { Sellers } from "./pages/Sellers";
import { SellerProfile } from "./pages/SellerProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/item/:id",
    Component: ItemDetails,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/list-item",
    Component: ListItem,
  },
  {
    path: "/my-listings",
    Component: MyListings,
  },
  {
    path: "/deliveries",
    Component: Deliveries,
  },
  {
    path: "/orders",
    Component: Orders,
  },
  {
    path: "/sellers",
    Component: Sellers,
  },
  {
    path: "/seller/:sellerId",
    Component: SellerProfile,
  },
]);