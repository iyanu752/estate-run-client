"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createProduct, updateProduct } from "@/service/productService"
import { toast } from "sonner"

interface Item {
  id?: string
  name: string
  category?: string
  price: number
  unit?: string
  quantity: number
  description?: string
  inStock?: boolean
  image?: string
  ownerId?: string
  isAvailable?: boolean
}

interface AddEditItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Item) => void
  item?: Item | null 
  mode: "add" | "edit"
  ownerId: string 
}

const categories = [
  "Fruits",
  "Vegetables",
  "Meat & Poultry",
  "Seafood",
  "Dairy & Eggs",
  "Bakery",
  "Beverages",
  "Snacks & Candy",
  "Frozen Foods",
  "Pantry Staples",
  "Health & Beauty",
  "Household Items",
  "Baby Care",
  "Pet Supplies",
]

const units = [
  "per lb",
  "per kg",
  "each",
  "dozen",
  "bunch",
  "bag",
  "box",
  "bottle",
  "can",
  "jar",
  "pack",
  "gallon",
  "liter",
  "oz",
  "loaf",
]

export function AddEditItemModal({ isOpen, onClose, onSave, item, mode, ownerId }: AddEditItemModalProps) {
  const [formData, setFormData] = useState<Item>({
    name: "",
    category: "",
    price: 0,
    unit: "",
    quantity: 0,
    description: "",
    inStock: true,
    image: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (item && mode === "edit") {
      setFormData(item)
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        unit: "",
        quantity: 0,
        description: "",
        inStock: true,
        image: "",
      })
    }
  }, [item, mode, isOpen])

  const handleInputChange = (field: keyof Item, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name.trim() || !formData.category || formData.price <= 0 || !formData.unit) {
    toast.warning("Please fill in all required fields");
    return;
  }

  setIsLoading(true);

  try {
    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: formData.price,
      isAvailable: formData.inStock,
      stock: formData.quantity,
      image: formData.image,
      unit: formData.unit,
      ownerId: ownerId, // this should come from context or props
    };

    let response;

    if (mode === "edit" && item?.id) {  
      response = await updateProduct(item.id, payload);
      toast.success("Item updated successfully")
    } else {
      response = await createProduct(payload);
      toast.success("Item created successfully")
    }

    if (response?.product) {
      onSave(response.product);
    }

    onClose();
  } catch (error) {
    console.error("Error saving item:", error);
    alert("An error occurred while saving the item");
  } finally {
    setIsLoading(false);
  }
};


  const handleImageUpload = () => {
    // In a real app, this would handle file upload
    alert("Image upload functionality would be implemented here")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "add" ? <Plus className="h-5 w-5" /> : null}
            {mode === "add" ? "Add New Item" : "Edit Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add a new item to your inventory" : "Update the item details and inventory information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                {formData.image ? (
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Product"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <Button type="button" variant="outline" onClick={handleImageUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Fresh Apples"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing and Units */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  className="pl-8"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity in Stock</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the product, its quality, origin, etc."
              rows={3}
            />
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <Label htmlFor="inStock" className="text-base font-medium">
                Available for Sale
              </Label>
              <p className="text-sm text-gray-500">Toggle to make this item available or unavailable to customers</p>
            </div>
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => handleInputChange("inStock", checked)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : mode === "add" ? "Add Item" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
