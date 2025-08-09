/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, UserIcon, MapPin, Phone, Mail } from "lucide-react"
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
import { toast } from "sonner"

interface User {
  _id?: string
  id?: string
  firstName?: string
  lastName?: string
  name?: string // Keep for backward compatibility
  email?: string
  phone?: string
  address?: string
  estate?: string
  status?: string
  joinDate?: string
  createdAt?: string
  avatar?: string
  bio?: string
  userType?: "user" | "vendor" | "rider" | "admin"
}

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
  user: User | null
}

export function EditUserModal({ isOpen, onClose, onSave, user }: EditUserModalProps) {
  const [formData, setFormData] = useState<User>({
    _id: "",
    id: "",
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    estate: "",
    status: "",
    joinDate: "",
    avatar: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      // Handle both combined name and separate firstName/lastName
      const firstName = user.firstName || (user.name ? user.name.split(' ')[0] : '')
      const lastName = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : '')
      
      setFormData({
        ...user,
        firstName,
        lastName,
        // Keep the original name as backup
        name: user.name || `${firstName} ${lastName}`.trim(),
        joinDate: user.joinDate || user.createdAt?.split('T')[0] || '',
      })
    }
  }, [user, isOpen])

  const handleInputChange = (field: keyof User, value: any) => {
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

    if (!formData.firstName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName || '',
        name: `${formData.firstName} ${formData.lastName || ''}`.trim(), // Combined name for backward compatibility
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        address: formData.address,
        estate: formData.estate,
      }

      // Use the correct ID field (some records use _id, others use id)
      const userId = formData._id || formData.id
      if (!userId) {
        throw new Error('User ID not found')
      }

      // Await the API call
      const response = await updateProfile(userId, updatedProfile)
      
      if (response) {
        // Create the updated user object with all current form data
        const updatedUser: User = {
          ...formData, // Keep all current form data
          ...updatedProfile, // Apply the updates
          ...(response.data || response), // Merge API response
        }
        
        toast.success('User profile updated successfully')
        
        // Pass the complete updated user data to the parent component
        onSave(updatedUser)
        onClose()
      } else {
        throw new Error('Update failed - no response from server')
      }
    } catch (error: any) {
      console.error("Error saving user:", error)
      
      // More specific error handling
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error updating user profile'
      
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
        name: "",
        email: "",
        phone: "",
        address: "",
        estate: "",
        status: "",
        joinDate: "",
        avatar: "",
        bio: "",
      })
    }
  }, [isOpen])

  if (!user) return null

  const displayName = formData.firstName && formData.lastName 
    ? `${formData.firstName} ${formData.lastName}` 
    : formData.name || 'User'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit User Profile
          </DialogTitle>
          <DialogDescription>Update user information and account settings</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="text-lg">
                {formData.firstName ? formData.firstName[0] : <UserIcon className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label className="text-sm font-medium">Profile Picture</Label>
              <p className="text-xs text-gray-500">User ID: {formData._id || formData.id}</p>
              <p className="text-xs text-gray-500">Member since: {formData.joinDate}</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Basic Information
            </h3>

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

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Account Status</Label>
              <Select value={formData.status || ''} onValueChange={(value) => handleInputChange("status", value)}>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Home Address</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Estate Ave, Block A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estate">Estate</Label>
              <Input
                id="estate"
                value={formData.estate || ""}
                onChange={(e) => handleInputChange("estate", e.target.value)}
                placeholder="harmony estate"
              />
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