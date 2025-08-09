/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Truck, Phone, Mail, Star } from "lucide-react"
import { updateProfile } from "@/service/profileService"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Rider {
  id?: string
  _id?: string
  firstName?: string
  lastName?: string
  name?: string // Keep for backward compatibility
  email?: string
  phone?: string
  status?: "Active" | "Inactive" | "Suspended" | "Offline" | "active" | "inactive" | "suspended" | "offline"
  rating?: number
  totalDeliveries?: number
  assignedOrders?: number
  joinDate?: string
  createdAt?: string
  avatar?: string
  bankAccountName?: string
  bankAccountNumber?: number | string
  bankName?: string
  // routingNumber?: string
  // Optional nested structure for backward compatibility
  // bankDetails?: {
  //   bankAccountName?: string
  //   bankAccountNumber?: number | string
  //   bankName?: string
  //   // routingNumber?: string
  // // }
}

interface EditRiderModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rider: Rider) => void
  rider: Rider | null
}

export function EditRiderModal({ isOpen, onClose, onSave, rider }: EditRiderModalProps) {
  const [formData, setFormData] = useState<Rider>({
    id: "",
    _id: "",
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    status: "Active",
    rating: 0,
    totalDeliveries: 0,
    assignedOrders: 0,
    joinDate: "",
    avatar: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",
    // routingNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (rider && isOpen) {
      // Handle both combined name and separate firstName/lastName
      const riderName = rider.name || `${rider.firstName || ''} ${rider.lastName || ''}`.trim()
      const firstName = rider.firstName || (riderName ? riderName.split(' ')[0] : '')
      const lastName = rider.lastName || (riderName ? riderName.split(' ').slice(1).join(' ') : '')

      // Handle bank details - check both nested and flat structure
      const bankAccountName = rider.bankAccountName || rider.bankAccountName || ""
      const bankAccountNumber = rider.bankAccountNumber || rider.bankAccountNumber || ""
      const bankName = rider.bankName
      // const routingNumber = rider.routingNumber || rider.bankDetails?.routingNumber || ""

      setFormData({
        ...rider,
        firstName,
        lastName,
        name: riderName || `${firstName} ${lastName}`.trim(),
        joinDate: rider.joinDate || rider.createdAt?.split('T')[0] || '',
        bankAccountName,
        bankAccountNumber,
        bankName,
        // routingNumber,
      })
    }
  }, [rider, isOpen])

  const handleInputChange = (field: keyof Rider, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      
      // Auto-update the combined name when firstName or lastName changes
      if (field === 'firstName' || field === 'lastName') {
        const firstName = field === 'firstName' ? value : prev.firstName || ''
        const lastName = field === 'lastName' ? value : prev.lastName || ''
        updated.name = `${firstName} ${lastName}`.trim()
      }
      
      return updated
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName?.trim() || !formData.email?.trim()) {
      toast.error("Please fill in all required fields")
      return
    }
    try {
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName || '',
        name: `${formData.firstName} ${formData.lastName || ''}`.trim(), // Combined for backward compatibility
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        // Include bank details if any are provided
        ...(formData.bankAccountName || formData.bankAccountNumber || formData.bankName ? {
          bankAccountName: formData.bankAccountName || "",
          bankAccountNumber: formData.bankAccountNumber || "",
          bankName: formData.bankName || "",
          // routingNumber: formData.routingNumber || "",
        } : {})
      }

      const riderId = formData._id || formData.id
      if (!riderId) {
        throw new Error('Rider ID not found')
      }
       setIsLoading(true)
      const response = await updateProfile(riderId, updatedProfile)
      if (response) {
        const updatedRider: Rider = {
          ...formData,
          ...updatedProfile,
          ...(response.data || response) 
        }
        toast.success('Rider profile updated successfully')
        onSave(updatedRider)
        onClose()
      } else {
        throw new Error('Update failed - no response from server')
      }
    } catch (error: any) {
      console.error("Error saving rider:", error)
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error updating rider profile'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        id: "",
        _id: "",
        firstName: "",
        lastName: "",
        name: "",
        email: "",
        phone: "",
        status: "Active",
        rating: 0,
        totalDeliveries: 0,
        assignedOrders: 0,
        joinDate: "",
        avatar: "",
        bankAccountName: "",
        bankAccountNumber: "",
        bankName: "",
        // routingNumber: "",
      })
    }
  }, [isOpen])

  if (!rider) return null

  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}` 
    : formData.name || 'Rider'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Rider Profile
          </DialogTitle>
          <DialogDescription>Update rider information and delivery settings</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="text-lg">
                {formData.firstName ? formData.firstName[0] : <Truck className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-sm font-medium">Rider Profile</Label>
                <Badge variant="outline" className="text-xs">
                  ID: {formData.id || formData._id}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>Member since: {formData.joinDate}</div>
                <div>Total Deliveries: {formData.totalDeliveries}</div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  Rating: {formData.rating}
                </div>
                <div>Assigned Orders: {formData.assignedOrders}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status || ''} onValueChange={(value) => handleInputChange("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="suspended">suspended</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="offline">offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Performance Stats (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-4 w-4" />
                Performance Stats
              </h3>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-gray-600">Rating</Label>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold">{formData.rating || 0}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-gray-600">Total Deliveries</Label>
                    <p className="text-lg font-semibold">{formData.totalDeliveries || 0}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-gray-600">Assigned Orders</Label>
                    <p className="text-lg font-semibold">{formData.assignedOrders || 0}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-gray-600">Status</Label>
                    <Badge variant={formData.status?.toLowerCase() === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {formData.status || 'Active'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Details (Optional)</h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Account Name</Label>
                <Input
                  id="bankAccountName"
                  value={formData.bankAccountName || ""}
                  onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
                  placeholder="Enter account holder name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber || ""}
                  onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                  placeholder="Enter account number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName || ""}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  value={formData.routingNumber || ""}
                  onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                  placeholder="Enter routing number"
                />
              </div> */}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}