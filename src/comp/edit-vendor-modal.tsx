/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Building, Phone, Mail, MapPin, Clock } from "lucide-react"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/service/profileService"
import { toast } from "sonner"

interface Vendor {
  _id?: string
  id?: string
  firstName?: string
  lastName?: string
  owner?: string // Keep for backward compatibility
  supermarketName?: string
  superMarketName?: string // Handle both naming conventions
  supermarket_name?: string
  name?: string
  closeTime?: string
  openTime?: string
  description?: string
  businessDescription?: string
  isOpen?: boolean
  bankName?: string
  bankAccountNumber?: number
  bankAccountName?: string
  email?: string
  phone?: string
  businessPhone?: string
  address?: string
  businessAddress?: string
  status?: "Active" | "Inactive" | "Suspended" | "Pending"
  items?: number
  joinDate?: string
  createdAt?: string
  avatar?: string
}

interface EditVendorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vendor: Vendor) => void
  vendor: Vendor | null
}

const timeSlots = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
]

export function EditVendorModal({ isOpen, onClose, onSave, vendor }: EditVendorModalProps) {
  const [formData, setFormData] = useState<Vendor>({
    _id: "",
    id: "",
    firstName: "",
    lastName: "",
    owner: "",
    supermarketName: "",
    email: "",
    phone: "",
    address: "",
    openTime: "8:00 AM",
    closeTime: "9:00 PM",
    isOpen: true,
    description: "",
    status: "Active",
    bankName: "",
    bankAccountNumber: 0,
    bankAccountName: "",
    items: 0,
    joinDate: "",
    avatar: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (vendor && isOpen) {
      // Handle different naming conventions and extract firstName/lastName from owner
      const ownerName = vendor.owner || vendor.name || ''
      const firstName = vendor.firstName || (ownerName ? ownerName.split(' ')[0] : '')
      const lastName = vendor.lastName || (ownerName ? ownerName.split(' ').slice(1).join(' ') : '')
      
      // Handle different supermarket name conventions
      const supermarketName = vendor.supermarketName || 
                             vendor.superMarketName || 
                             vendor.supermarket_name || 
                             vendor.name || 
                             'Unknown Supermarket'

      setFormData({
        ...vendor,
        firstName,
        lastName,
        owner: ownerName || `${firstName} ${lastName}`.trim(),
        supermarketName,
        phone: vendor.phone || vendor.businessPhone || '',
        address: vendor.address || vendor.businessAddress || '',
        description: vendor.description || vendor.businessDescription || '',
        joinDate: vendor.joinDate || vendor.createdAt?.split('T')[0] || '',
      })
    }
  }, [vendor, isOpen])

  const handleInputChange = (field: keyof Vendor, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      
      // Auto-update the combined owner name when firstName or lastName changes
      if (field === 'firstName' || field === 'lastName') {
        const firstName = field === 'firstName' ? value : prev.firstName || ''
        const lastName = field === 'lastName' ? value : prev.lastName || ''
        updated.owner = `${firstName} ${lastName}`.trim()
      }
      
      return updated
    })
  }

  const handleNestedChange = (field: keyof Vendor, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.supermarketName?.trim() || !formData.firstName?.trim() || !formData.email?.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName || '',
        owner: `${formData.firstName} ${formData.lastName || ''}`.trim(), // Combined for backward compatibility
        supermarketName: formData.supermarketName,
        superMarketName: formData.supermarketName, // Handle both naming conventions
        email: formData.email,
        phone: formData.phone,
        businessPhone: formData.phone, // Handle both naming conventions
        address: formData.address,
        businessAddress: formData.address, // Handle both naming conventions
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        isOpen: formData.isOpen,
        description: formData.description,
        businessDescription: formData.description, // Handle both naming conventions
        status: formData.status,
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankAccountName: formData.bankAccountName,
      }

      // Use the correct ID field
      const vendorId = formData._id || formData.id
      if (!vendorId) {
        throw new Error('Vendor ID not found')
      }

      // Await the API call
      const response = await updateProfile(vendorId, updatedProfile)
      
      if (response) {
        // Create updated vendor object with response data
        const updatedVendor: Vendor = {
          ...formData,
          ...updatedProfile,
          ...(response.data || response) // Merge API response
        }
        
        toast.success('Vendor profile updated successfully')  
        onSave(updatedVendor)
        onClose()
      } else {
        throw new Error('Update failed - no response from server')
      }
    } catch (error: any) {
      console.error("Error saving vendor:", error)
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error updating vendor profile'
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        _id: "",
        id: "",
        firstName: "",
        lastName: "",
        owner: "",
        supermarketName: "",
        email: "",
        phone: "",
        address: "",
        openTime: "8:00 AM",
        closeTime: "9:00 PM",
        isOpen: true,
        description: "",
        status: "Active",
        bankName: "",
        bankAccountNumber: 0,
        bankAccountName: "",
        items: 0,
        joinDate: "",
        avatar: "",
      })
    }
  }, [isOpen])

  if (!vendor) return null

  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}` 
    : formData.owner || 'Vendor Owner'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Vendor Profile
          </DialogTitle>
          <DialogDescription>Update vendor information and business settings</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="text-lg">
                {formData.firstName ? formData.firstName[0] : <Building className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label className="text-sm font-medium">Business Logo</Label>
              <p className="text-xs text-gray-500">Vendor ID: {formData._id || formData.id}</p>
              <p className="text-xs text-gray-500">Member since: {formData.joinDate}</p>
              <p className="text-xs text-gray-500">Total Items: {formData.items}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-4 w-4" />
                Business Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supermarketName">Business Name *</Label>
                  <Input
                    id="supermarketName"
                    value={formData.supermarketName || ''}
                    onChange={(e) => handleInputChange("supermarketName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Owner First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Owner Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Business Status</Label>
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
                      <SelectItem value="Pending">Pending Approval</SelectItem>
                      <SelectItem value="pending">pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your business..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </h3>

              <div className="space-y-4">
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
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessPhone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessAddress"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="pl-10"
                      placeholder="456 Estate Plaza, Ground Floor"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Operating Hours
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="openTime">Opening Time</Label>
                <Select
                  value={formData.openTime || "8:00 AM"}
                  onValueChange={(value) => handleNestedChange("openTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeTime">Closing Time</Label>
                <Select
                  value={formData.closeTime || "9:00 PM"}
                  onValueChange={(value) => handleNestedChange("closeTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOpen"
                    checked={formData.isOpen || false}
                    onCheckedChange={(checked) => handleNestedChange("isOpen", checked)}
                  />
                  <Label htmlFor="isOpen" className="font-medium">
                    Currently Open
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Details (Optional)</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={formData.bankAccountName || ""}
                  onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="number"
                  value={formData.bankAccountNumber || ""}
                  onChange={(e) => handleInputChange("bankAccountNumber", Number(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName || ""}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                />
              </div>
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