import { useState } from "react"
import { ArrowLeft, Clock, LogOut, Plus, Search, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ItemFilter } from "@/comp/item-filter"
import { useParams } from "react-router-dom"
// Mock data for supermarket
const supermarket = {
  id: 1,
  name: "Fresh Mart",
  description: "Your everyday grocery store with fresh produce",
  isOpen: true,
  openTime: "8:00 AM",
  closeTime: "9:00 PM",
  image: "/placeholder.svg?height=200&width=400",
}

// Mock data for items
const items = [
  {
    id: 1,
    name: "Fresh Apples",
    category: "fruits",
    categoryLabel: "Fruits",
    price: 2.99,
    unit: "per lb",
    inStock: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    category: "bakery",
    categoryLabel: "Bakery",
    price: 3.49,
    unit: "loaf",
    inStock: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Organic Milk",
    category: "dairy",
    categoryLabel: "Dairy",
    price: 4.99,
    unit: "gallon",
    inStock: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Chicken Breast",
    category: "meat",
    categoryLabel: "Meat",
    price: 6.99,
    unit: "per lb",
    inStock: false,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Spinach",
    category: "vegetables",
    categoryLabel: "Vegetables",
    price: 2.49,
    unit: "bunch",
    inStock: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Pasta",
    category: "pantry",
    categoryLabel: "Pantry Staples",
    price: 1.99,
    unit: "16 oz",
    inStock: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 7,
    name: "Orange Juice",
    category: "beverages",
    categoryLabel: "Beverages",
    price: 3.99,
    unit: "64 oz",
    inStock: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 8,
    name: "Potato Chips",
    category: "snacks",
    categoryLabel: "Snacks",
    price: 2.49,
    unit: "bag",
    inStock: true,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function SupermarketPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams<{ id: string }>()
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<Array<{ id: number; quantity: number }>>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category)
    return matchesSearch && matchesCategory
  })

  const addToCart = (itemId: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === itemId)
      if (existingItem) {
        return prev.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prev, { id: itemId, quantity: 1 }]
      }
    })
  }

  const getItemQuantity = (itemId: number) => {
    const item = cart.find((item) => item.id === itemId)
    return item ? item.quantity : 0
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <a href="/dashboard/user">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </a>
            <h1 className="text-xl font-bold tracking-tight">{supermarket.name} {supermarket.id}</h1>
            <Badge
              variant={supermarket.isOpen ? "default" : "outline"}
              className={supermarket.isOpen ? "bg-green-600" : "text-gray-500"}
            >
              {supermarket.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <a href="/cart">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Cart ({totalItems})</span>
              </Button>
            </a>
            <a href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <img
            src={supermarket.image || "/placeholder.svg"}
            alt={supermarket.name}
            className="h-[100px] w-[200px] rounded-md object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{supermarket.name}</h2>
            <p className="text-gray-600">{supermarket.description}</p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              {supermarket.openTime} - {supermarket.closeTime}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="mb-4 text-xl font-bold">Available Items</h3>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <ItemFilter
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              onClearFilters={() => setSelectedCategories([])}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-black/10">
                <CardContent className="p-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="mx-auto h-[100px] w-[100px] object-cover"
                  />
                </CardContent>
                <CardContent className="p-4">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.categoryLabel}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500"> / {item.unit}</span>
                    </div>
                    {!item.inStock && (
                      <Badge variant="outline" className="text-red-500">
                        Out of stock
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  {getItemQuantity(item.id) > 0 ? (
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">Qty: {getItemQuantity(item.id)}</span>
                      <Button onClick={() => addToCart(item.id)} disabled={!item.inStock} size="sm">
                        Add More
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => addToCart(item.id)} className="w-full" disabled={!item.inStock}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Estate Run. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
