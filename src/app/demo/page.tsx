"use client"

import { useState } from "react"
import { SpeechToTextInputEnhanced } from "@/components/speech-to-text-input-enhanced"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sparkles, Mic } from "lucide-react"

export default function DemoPage() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [enableGeminiFilter, setEnableGeminiFilter] = useState(true)
  const [nameError, setNameError] = useState("")
  const [locationError, setLocationError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setNameError("Name is required")
      return
    }
    if (!location.trim()) {
      setLocationError("Location is required")
      return
    }

    setNameError("")
    setLocationError("")

    alert(`Data collected successfully!\nName: ${name}\nLocation: ${location}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI-Enhanced Data Collection</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of Gemini AI filtering for Ghanaian names and locations. 
            Speak naturally and let AI convert your speech to proper Ghanaian names and places.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Input Demo
              </CardTitle>
              <CardDescription>
                Try speaking a Ghanaian name or location to see AI filtering in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="gemini-filter"
                    checked={enableGeminiFilter}
                    onCheckedChange={setEnableGeminiFilter}
                  />
                  <Label htmlFor="gemini-filter">
                    Enable AI Filtering ({enableGeminiFilter ? "ON" : "OFF"})
                  </Label>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Try saying:</strong><br />
                    • "Kwame" (Ghanaian name)<br />
                    • "Akosua" (Ghanaian name)<br />
                    • "Accra" (Ghanaian city)<br />
                    • "Kumasi" (Ghanaian city)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Understanding the AI filtering process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <strong>Speech Recognition:</strong> Your voice is converted to text
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <strong>AI Analysis:</strong> Gemini AI analyzes the text for Ghanaian names/locations
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <strong>Smart Correction:</strong> Text is converted to proper Ghanaian names/places
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Collection Form</CardTitle>
            <CardDescription>
              Use voice input to fill out the form with AI-enhanced accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <SpeechToTextInputEnhanced
                  id="name"
                  value={name}
                  onChange={setName}
                  placeholder="Speak or type your name..."
                  error={nameError}
                  enableGeminiFilter={enableGeminiFilter}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <SpeechToTextInputEnhanced
                  id="location"
                  value={location}
                  onChange={setLocation}
                  placeholder="Speak or type your location..."
                  error={locationError}
                  enableGeminiFilter={enableGeminiFilter}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Data
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Google Gemini AI • Built with Next.js and React</p>
        </div>
      </div>
    </div>
  )
}
