/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Clock,
  Edit,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Trash,
  DollarSign,
  User,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { AddEditItemModal } from "@/comp/add-edit-item-modal";
import { OrderDetailsModal } from "@/comp/order-details-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupermarket, updateStatus } from "@/service/supermarketService";
import { getProductsByVendor, deleteProduct } from "@/service/productService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data for orders
const initialOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-06-16",
    items: 5,
    total: 34.95,
    status: "Pending",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-06-15",
    items: 3,
    total: 21.47,
    status: "Completed",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2023-06-15",
    items: 7,
    total: 52.3,
    status: "Pending",
  },
];

// Mock data for revenue and orders by date filter
const revenueData = {
  today: { revenue: 234.5, orders: 12 },
  week: { revenue: 1567.8, orders: 89 },
  month: { revenue: 4890.25, orders: 342 },
  year: { revenue: 12450.75, orders: 1456 },
  total: { revenue: 15678.9, orders: 1789 },
};

// Define the supermarket type
interface Supermarket {
  _id?: string;
  name?: string;
  address?: string;
  status?: string;
  opentime?: string;
  closetime?: string;
  description?: string;
  pendingOrders?: number;
  ownerId?: string;
}

// Define the product/item type based on your API response
interface Product {
  _id?: string;
  id?: string;
  name: string;
  category?: string;
  price: number;
  unit?: string;
  inStock: boolean;
  quantity?: number;
  image?: string;
  description?: string;
  isAvailable?: boolean
  // Add any other fields your API returns
}

export default function VendorDashboard() {
  const [dateFilter, setDateFilter] = useState("month");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [supermarket, setSupermarket] = useState<Supermarket>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Separate loading states for better UX
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const supermarketName =
    supermarket?.name || (isLoading ? "Loading..." : "No Name");
  const supermarketStatus = supermarket?.status || "closed";
  const supermarketOpenTime = supermarket?.opentime || "";
  const supermarketCloseTime = supermarket?.closetime || "";
  const supermarketDescription = supermarket?.description || "";
  const supermarketId = supermarket?._id;
  const pendingOrders = supermarket?.pendingOrders || 0;
  const vendorId = supermarket?.ownerId || "";
  const [isOpen, setIsOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [items, setItems] = useState<Product[]>([]);
  const [orders, setOrders] = useState(initialOrders);

  // Debug logging
  useEffect(() => {
    console.log("Component state updated:", {
      isLoading,
      error,
      supermarket,
      supermarketName,
      hasData: Object.keys(supermarket).length > 0,
      vendorId,
      itemsCount: items.length,
    });
  }, [isLoading, error, supermarket, supermarketName, vendorId, items]);

  useEffect(() => {
    setIsOpen(supermarketStatus === "open");
  }, [supermarketStatus]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getSupermarketInfo();
  }, []);

  // Fixed: Only fetch products when we have a valid vendorId
  useEffect(() => {
    if (vendorId && !isLoading) {
      console.log("Fetching products for vendor:", vendorId);
      fetchVendorProducts();
    }
  }, [vendorId, isLoading]);

  const getCurrentData = () => {
    return revenueData[dateFilter as keyof typeof revenueData];
  };

  const getSupermarketInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supermarketRes = await getSupermarket();
      let supermarketData = supermarketRes;

      if (supermarketRes && supermarketRes.data) {
        supermarketData = supermarketRes.data;
      }
      if (Array.isArray(supermarketData) && supermarketData.length > 0) {
        supermarketData = supermarketData[0];
      }
      if (supermarketData && typeof supermarketData === "object") {
        setSupermarket(supermarketData);
        console.log("Supermarket data loaded:", supermarketData);
      } else {
        setError("No supermarket data found");
      }
    } catch (error) {
      console.error("Error fetching supermarket:", error);
      setError("Failed to load supermarket data");
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };

  const getUser = () => {
    try {
      const userString = localStorage.getItem("user");

      if (userString) {
        const user = JSON.parse(userString);
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
      } else {
        setFirstName("");
        setLastName("");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setFirstName("");
      setLastName("");
    }
  };

  // const updateItem = async (productId: string, updatedItem: Product) => {
  //   try {
  //     const response = await updateProduct(productId, updatedItem);
  //     if (response.status === 200) {
  //       toast.success("Item updated successfully")
  //       setItems( prevItems => prevItems.map(item => item._id === productId ? updatedItem : item) )
  //     }
  //   }catch(error) {
  //     toast.error("Failed to update item")
  //     console.error("Error updating item: ", error)
  //   }
  // }

  const fetchVendorProducts = async () => {
    try {
      setIsLoadingProducts(true);
      console.log("Fetching products for vendor ID:", vendorId);
      const vendorProductsRes = await getProductsByVendor(vendorId);
      let productsArray = [];
      if (vendorProductsRes && vendorProductsRes.product) {
        productsArray = vendorProductsRes.product;
        console.log("Found products in response.product:", productsArray);
      } else if (vendorProductsRes && vendorProductsRes.products) {
        productsArray = vendorProductsRes.products;
        console.log("Found products in response.products:", productsArray);
      } else if (vendorProductsRes && Array.isArray(vendorProductsRes)) {
        productsArray = vendorProductsRes;
        console.log("Response is direct array:", productsArray);
      } else if (
        vendorProductsRes &&
        vendorProductsRes.data &&
        Array.isArray(vendorProductsRes.data)
      ) {
        productsArray = vendorProductsRes.data;
        console.log("Found products in response.data:", productsArray);
      } else if (vendorProductsRes && typeof vendorProductsRes === "object") {
        const possibleArrays = [
          "product",
          "products",
          "data",
          "items",
          "results",
        ];
        for (const prop of possibleArrays) {
          if (
            vendorProductsRes[prop] &&
            Array.isArray(vendorProductsRes[prop])
          ) {
            productsArray = vendorProductsRes[prop];
            console.log(`Found products in response.${prop}:`, productsArray);
            break;
          }
        }
      }

      if (productsArray && productsArray.length > 0) {
        const transformedProducts = productsArray.map((product: Product, index: number) => ({
          id: product._id || product.id || index + 1,
          _id: product._id,
          name: product.name || "Unnamed Product",
          category: product.category || "Uncategorized",
          price:
            typeof product.price === "number"
              ? product.price
              : parseFloat(product.price) || 0,
          unit: product.unit || "each",
          inStock:
            product.isAvailable !== undefined
              ? product.isAvailable
              : product.inStock !== undefined
              ? product.inStock
              : (product.inStock || product.quantity) > 0,
          quantity:
            product.inStock !== undefined
              ? product.inStock
              : typeof product.quantity === "number"
              ? product.quantity
              : (product.quantity) || 0,
          image: product.image || "/placeholder.svg?height=100&width=100",
          description: product.description || "",
        }));

        console.log("Transformed products:", transformedProducts);
        setItems(transformedProducts);
      } else {
        console.log("No products found or empty array");
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      setItems([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const getFilterLabel = () => {
    switch (dateFilter) {
      case "today":
        return "Today's";
      case "week":
        return "This Week's";
      case "month":
        return "This Month's";
      case "year":
        return "This Year's";
      case "total":
        return "Total";
      default:
        return "This Month's";
    }
  };

  const handleAddItem = (newItem: any) => {
    const item = {
      ...newItem,
      id: Math.max(...items.map((i) => Number(i.id) || 0)) + 1,
    };
    setItems([...items, item]);
    // Optionally refresh the products list from the server
    fetchVendorProducts();
  };

  const handleEditItem = (updatedItem: any) => {
    setItems(
      items.map((item) =>
        item.id === updatedItem.id || item._id === updatedItem._id
          ? updatedItem
          : item
      )
    );
    setSelectedItem(null);
    // Optionally refresh the products list from the server
    fetchVendorProducts();
  };

  const handleDeleteItem = async (itemId: number | string) => {
    setItems(items.filter((item) => item.id !== itemId && item._id !== itemId));
    try {
      await deleteProduct(itemId as string);
      toast.success("Product deleted successfully");
      fetchVendorProducts();
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const handleEditClick = (item: Product) => {
    setSelectedItem(item);
    setIsEditItemModalOpen(true);
  };

  const handleOrderDetailsClick = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      )
    );
  };

  const handleStoreStatusChange = async (checked: boolean) => {
    setIsOpen(checked);

    try {
      const newStatus = checked ? "open" : "closed";
      const updateStatusRes = await updateStatus(supermarketId, newStatus);

      if (updateStatusRes) {
        setSupermarket((prev) => ({ ...prev, status: newStatus }));
        console.log(`Successfully updated status to: ${newStatus}`);
      } else {
        setIsOpen(!checked);
        console.error("Failed to update supermarket status");
      }
    } catch (error) {
      setIsOpen(!checked);
      console.error("Error updating supermarket status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-base">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            Debug: Loading={isLoading.toString()}, HasData=
            {Object.keys(supermarket).length > 0}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-base">{error}</p>
          <Button onClick={getSupermarketInfo}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            Estate Run
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
            <span className="text-xs sm:text-sm font-medium hidden md:block">
              {firstName && lastName
                ? `Welcome, ${firstName} ${lastName}`
                : "Welcome"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                getSupermarketInfo();
                if (vendorId) fetchVendorProducts();
              }}
              className="text-xs hidden lg:flex"
            >
              Refresh Data
            </Button>
            <a href="/profile/vendor">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <User className="h-4 w-4" />
                <span className="sr-only">Profile</span>
              </Button>
            </a>
            <a href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-8 w-8"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-2">
              <div className="text-sm font-medium py-2">
                {firstName && lastName
                  ? `Welcome, ${firstName} ${lastName}`
                  : "Welcome"}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  getSupermarketInfo();
                  if (vendorId) fetchVendorProducts();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-xs"
              >
                Refresh Data
              </Button>
              <a href="/profile/vendor" className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </a>
              <a href="/" className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start">
          {/* Store Info Card */}
          <Card className="border-black/10 lg:w-1/3">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base sm:text-lg pr-2">
                  {supermarketName}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <img
                src="/placeholder.svg"
                alt={supermarketName}
                className="mb-3 h-[120px] sm:h-[150px] w-full rounded-md object-cover"
              />
              <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                {supermarketDescription || "No description available"}
              </p>
              {(supermarketOpenTime || supermarketCloseTime) && (
                <div className="mb-4 flex items-center text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {supermarketOpenTime} - {supermarketCloseTime}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">
                  Store Status
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      isOpen ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                  <Switch
                    checked={isOpen}
                    onCheckedChange={handleStoreStatusChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1">
            {/* Date Filter */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                Dashboard Overview
              </h2>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="total">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-4 sm:mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Revenue */}
              <Card className="border-black/10">
                <CardHeader className="p-3 sm:p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                    {getFilterLabel()} Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-bold text-green-600 truncate">
                      ₦{getCurrentData().revenue.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Orders */}
              <Card className="border-black/10">
                <CardHeader className="p-3 sm:p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                    {getFilterLabel()} Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-bold">
                      {getCurrentData().orders}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Average Order Value */}
              <Card className="border-black/10">
                <CardHeader className="p-3 sm:p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                    Avg. Order Value
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-bold truncate">
                      ₦
                      {(
                        getCurrentData().revenue / getCurrentData().orders
                      ).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Orders */}
              <Card className="border-black/10">
                <CardHeader className="p-3 sm:p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">
                    Pending Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-bold">
                      {pendingOrders}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-3 h-auto">
                <TabsTrigger
                  value="inventory"
                  className="text-xs sm:text-sm py-2"
                >
                  Inventory ({items.length})
                </TabsTrigger>
                <TabsTrigger value="orders" className="text-xs sm:text-sm py-2">
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="text-xs sm:text-sm py-2"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="border-none p-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3 className="text-base sm:text-lg font-bold">
                    Inventory Management
                    {isLoadingProducts && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Loading products...)
                      </span>
                    )}
                  </h3>
                  <Button
                    size="sm"
                    className="w-fit"
                    onClick={() => setIsAddItemModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {/* Show loading state for products */}
                {isLoadingProducts && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-500">Loading products...</p>
                  </div>
                )}

                {/* Show empty state */}
                {!isLoadingProducts && items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-base mb-2">No products found</p>
                    <p className="text-sm">
                      {vendorId
                        ? "Add your first product to get started"
                        : "Vendor ID not available"}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setIsAddItemModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </div>
                )}

                {/* Mobile Card View */}
                {!isLoadingProducts && items.length > 0 && (
                  <div className="block sm:hidden space-y-4">
                    {items.map((item) => (
                      <Card
                        key={item._id || item.id}
                        className="border-gray-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-12 w-12 rounded object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-sm truncate">
                                    {item.name}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {item.category}
                                  </p>
                                </div>
                                <Badge
                                  variant={item.inStock ? "default" : "outline"}
                                  className={`text-xs ${
                                    item.inStock
                                      ? "bg-green-600"
                                      : "text-red-500"
                                  }`}
                                >
                                  {item.inStock ? "In Stock" : "Out of Stock"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <span className="font-medium">
                                    ₦{item.price.toFixed(2)}
                                  </span>
                                  <span className="text-gray-500 ml-2">
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEditClick(item)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500"
                                      >
                                        <Trash className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete the product
                                          and you will not be able to recover
                                          it.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-600 hover:bg-red-700 text-white"
                                          onClick={() => {
                                            const id = item._id ?? item.id;
                                            if (id !== undefined)
                                              handleDeleteItem(id);
                                          }}
                                        >
                                          Yes, delete it
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Desktop Table View */}
                {!isLoadingProducts && items.length > 0 && (
                  <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left">
                          <th className="px-4 py-3 font-medium text-sm">
                            Product
                          </th>
                          <th className="px-4 py-3 font-medium text-sm">
                            Category
                          </th>
                          <th className="px-4 py-3 font-medium text-sm">
                            Price
                          </th>
                          <th className="px-4 py-3 font-medium text-sm">
                            Quantity
                          </th>
                          <th className="px-4 py-3 font-medium text-sm">
                            Status
                          </th>
                          <th className="px-4 py-3 font-medium text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr
                            key={item._id || item.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-10 w-10 rounded object-cover flex-shrink-0"
                                />
                                <div>
                                  <div className="font-medium text-sm">
                                    {item.name}
                                  </div>
                                  {item.description && (
                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {item.category || "Uncategorized"}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              ₦{item.price.toFixed(2)}
                              {item.unit && (
                                <span className="text-xs text-gray-500 ml-1">
                                  /{item.unit}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={item.inStock ? "default" : "outline"}
                                className={`text-xs ${
                                  item.inStock
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "text-red-500 border-red-200"
                                }`}
                              >
                                {item.inStock ? "In Stock" : "Out of Stock"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                  onClick={() => handleEditClick(item)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500"
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the product and you
                                        will not be able to recover it.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        onClick={() => {
                                          const id = item._id ?? item.id;
                                          if (id !== undefined)
                                            handleDeleteItem(id);
                                        }}
                                      >
                                        Yes, delete it
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="orders" className="border-none p-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3 className="text-base sm:text-lg font-bold">
                    Order Management
                  </h3>
                </div>

                {/* Mobile Order Cards */}
                <div className="block sm:hidden space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-sm">{order.id}</h4>
                            <p className="text-xs text-gray-500">
                              {order.customer}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === "Pending" ? "outline" : "default"
                            }
                            className={`text-xs ${
                              order.status === "Pending"
                                ? "text-yellow-500 border-yellow-200"
                                : "bg-green-600"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="text-gray-500">{order.date}</span>
                          <span className="font-medium">
                           ₦{order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {order.items} items
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleOrderDetailsClick(order)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Orders Table */}
                <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-4 py-3 font-medium text-sm">
                          Order ID
                        </th>
                        <th className="px-4 py-3 font-medium text-sm">
                          Customer
                        </th>
                        <th className="px-4 py-3 font-medium text-sm">Date</th>
                        <th className="px-4 py-3 font-medium text-sm">Items</th>
                        <th className="px-4 py-3 font-medium text-sm">Total</th>
                        <th className="px-4 py-3 font-medium text-sm">
                          Status
                        </th>
                        <th className="px-4 py-3 font-medium text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {order.customer}
                          </td>
                          <td className="px-4 py-3 text-sm">{order.date}</td>
                          <td className="px-4 py-3 text-sm">{order.items}</td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ₦{order.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                order.status === "Pending"
                                  ? "outline"
                                  : "default"
                              }
                              className={`text-xs ${
                                order.status === "Pending"
                                  ? "text-yellow-500 border-yellow-200"
                                  : "bg-green-600"
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleOrderDetailsClick(order)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty Orders State */}
                {orders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-base mb-2">No orders yet</p>
                    <p className="text-sm">
                      Orders will appear here when customers place them
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      {supermarket?.ownerId && (
        <AddEditItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          onSave={handleAddItem}
          mode="add"
          ownerId={supermarket?.ownerId}
        />
      )}

      {supermarket?.ownerId && (
        <AddEditItemModal
          isOpen={isEditItemModalOpen}
          onClose={() => {
            setIsEditItemModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleEditItem}
          item={
            selectedItem
              ? {
                  ...selectedItem,
                  category: selectedItem.category ?? "Uncategorized",
                  unit: selectedItem.unit ?? "unit",
                  quantity: selectedItem.quantity ?? 0,
                  inStock: selectedItem.inStock ?? false,
                }
              : null
          }
          mode="edit"
          ownerId={supermarket.ownerId}
        />
      )}

      <OrderDetailsModal
        isOpen={isOrderDetailsModalOpen}
        onClose={() => {
          setIsOrderDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <footer className="border-t border-gray-200 py-4 sm:py-6">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Estate Run. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
