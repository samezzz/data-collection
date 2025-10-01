"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SpeechToTextInputEnhanced } from "@/components/speech-to-text-input-enhanced"
import { CameraCapture } from "@/components/camera-capture"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface FormData {
  photo: string
  fullName: string
  phoneNumber: string
  location: string
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    photo: "",
    fullName: "",
    phoneNumber: "",
    location: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formKey, setFormKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "")
    return cleaned.length === 10
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.photo) newErrors.photo = "Photo is required"
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits"
    }
    if (!formData.location.trim()) newErrors.location = "Location is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast("Validation Error", {
        description: "Please fill in all required fields correctly."
      })
      return
    }

    // Set loading state
    setIsSubmitting(true)

    // Submit form
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      // Show success toast with more details
      toast.success("Registration Successful!", {
        description: `Convert ${formData.fullName} has been registered successfully.`,
        duration: 5000,
      });

      // Small delay before resetting to show the success state
      setTimeout(() => {
        // Reset all form data and UI states
        setFormData({
          photo: "",
          fullName: "",
          phoneNumber: "",
          location: "",
        });
        setErrors({});
        
        // Force re-render of child components by updating a key
        setFormKey(prev => prev + 1);
        setIsSubmitting(false);
      }, 1500);

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Submission Error", {
        description: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  }
    

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Convert&apos;s Information</CardTitle>
        <CardDescription>Use the microphone button to fill fields with your voice</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <Label className="text-center block">
              Photo <span className="text-destructive">*</span>
            </Label>
            <CameraCapture 
              key={`camera-${formKey}`}
              onCapture={(imageData) => handleInputChange("photo", imageData)} 
              error={errors.photo} 
            />
          </div>
          
          {/* Full Name with Enhanced STT */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <SpeechToTextInputEnhanced
              key={`fullName-${formKey}`}
              id="fullName"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
              placeholder="Enter your full name"
              error={errors.fullName}
              enableGeminiFilter={true}
              fieldType="name"
            />
          </div>

          {/* Phone Number with Enhanced STT */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <SpeechToTextInputEnhanced
              key={`phoneNumber-${formKey}`}
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(value) => {
                // Clean and limit to 10 digits
                const cleaned = value.replace(/\D/g, "").slice(0, 10)
                handleInputChange("phoneNumber", cleaned)
              }}
              placeholder="Enter 10-digit phone number"
              error={errors.phoneNumber}
              enableGeminiFilter={false} // Don't filter phone numbers
            />
          </div>

          {/* Location with Enhanced STT */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <SpeechToTextInputEnhanced
              key={`location-${formKey}`}
              id="location"
              value={formData.location}
              onChange={(value) => handleInputChange("location", value)}
              placeholder="Enter your location"
              error={errors.location}
              enableGeminiFilter={true}
              fieldType="location"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Convert"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
