"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const categories = [
  { id: "all", name: "All Items", count: 120 },
  { id: "fruits", name: "Fruits", count: 15 },
  { id: "vegetables", name: "Vegetables", count: 18 },
  { id: "meat", name: "Meat & Poultry", count: 12 },
  { id: "seafood", name: "Seafood", count: 8 },
  { id: "dairy", name: "Dairy & Eggs", count: 10 },
  { id: "bakery", name: "Bakery", count: 14 },
  { id: "beverages", name: "Beverages", count: 20 },
  { id: "snacks", name: "Snacks & Candy", count: 16 },
  { id: "frozen", name: "Frozen Foods", count: 12 },
  { id: "pantry", name: "Pantry Staples", count: 25 },
  { id: "health", name: "Health & Beauty", count: 8 },
  { id: "household", name: "Household Items", count: 15 },
  { id: "baby", name: "Baby Care", count: 6 },
  { id: "pet", name: "Pet Supplies", count: 5 },
]

interface ItemFilterProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  onClearFilters: () => void
}

export function ItemFilter({ selectedCategories, onCategoryChange, onClearFilters }: ItemFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === "all") {
      onCategoryChange([])
      return
    }

    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]

    onCategoryChange(newCategories)
  }

  const hasActiveFilters = selectedCategories.length > 0

  return (
    <Card className="border-black/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-4 pb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-4 w-4" />
                Categories
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedCategories.length}
                  </Badge>
                )}
              </CardTitle>
            </Button>
          </CollapsibleTrigger>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1 pt-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId)
                return category ? (
                  <Badge key={categoryId} variant="outline" className="text-xs">
                    {category.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleCategoryToggle(categoryId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null
              })}
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-auto p-1 text-xs">
                Clear all
              </Button>
            </div>
          )}
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={
                      category.id === "all" ? selectedCategories.length === 0 : selectedCategories.includes(category.id)
                    }
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <label
                    htmlFor={category.id}
                    className="flex flex-1 cursor-pointer items-center justify-between text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
