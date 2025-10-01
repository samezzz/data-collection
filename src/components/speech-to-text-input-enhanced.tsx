"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, RotateCcw, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpeechToTextInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  enableGeminiFilter?: boolean
  fieldType?: "name" | "location"
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface FilteredTranscription {
  originalText: string;
  filteredText: string;
  confidence: number;
  type: "name" | "location" | "other";
  officialLocation?: string;
  nameValidation?: {
    isValid: boolean;
    confidence: number;
    suggestedName?: string;
    nameType?: "day-name" | "traditional" | "modern" | "surname";
    meaning?: string;
    alternatives?: string[];
  };
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function SpeechToTextInputEnhanced({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  error, 
  enableGeminiFilter = true,
  fieldType = "name"
}: SpeechToTextInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [filteredResult, setFilteredResult] = useState<FilteredTranscription | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsSupported(false)
        console.log("[v0] Speech recognition not supported in this browser")
      }
    }
  }, [])

  const filterTranscriptionWithGemini = async (transcription: string): Promise<FilteredTranscription> => {
    try {
      const response = await fetch("/api/filter-transcription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription, fieldType }),
      })

      if (!response.ok) {
        throw new Error("Failed to filter transcription")
      }

      return await response.json()
    } catch (error) {
      console.error("Error filtering transcription:", error)
      return {
        originalText: transcription,
        filteredText: transcription,
        confidence: 0.0,
        type: "other"
      }
    }
  }

  const startRecording = () => {
    if (!isSupported) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      console.log("[v0] Speech recognition result received")
      const results = event.results[0]
      const transcribedText = results[0].transcript

      setTranscript(transcribedText)
      
            
      // If Gemini filtering is enabled, filter the transcription
      if (enableGeminiFilter) {
        setIsFiltering(true)
        try {
          const filtered = await filterTranscriptionWithGemini(transcribedText)
          setFilteredResult(filtered)
          // Always use the AI-filtered text for the input field
          onChange(filtered.filteredText)
        } catch (error) {
          console.error("Error filtering transcription:", error)
          onChange(transcribedText)
        } finally {
          setIsFiltering(false)
        }
      } else {
        onChange(transcribedText)
      }

      // Get alternative transcriptions if available
      const alts: string[] = []
      for (let i = 1; i < Math.min(results.length, 4); i++) {
        if (results[i].transcript !== transcribedText) {
          alts.push(results[i].transcript)
        }
      }

      // Show alternatives if confidence is low or alternatives exist
      if (results[0].confidence < 0.8 || alts.length > 0) {
        setAlternatives(alts)
        setShowAlternatives(true)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log("[v0] Speech recognition error:", event.error)
      setIsRecording(false)
      if (event.error === "no-speech") {
        alert("No speech detected. Please try again.")
      } else if (event.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone access in your browser settings.")
      } else {
        alert(`Error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      console.log("[v0] Speech recognition ended")
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
    setShowAlternatives(false)
    setFilteredResult(null)
    console.log("[v0] Speech recognition started")
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const retryRecording = () => {
    setTranscript("")
    setAlternatives([])
    setShowAlternatives(false)
    setFilteredResult(null)
    onChange("")
    startRecording()
  }

  const selectAlternative = (alt: string) => {
    if (enableGeminiFilter) {
      // Filter the alternative as well
      setIsFiltering(true)
      filterTranscriptionWithGemini(alt).then((filtered) => {
        setFilteredResult(filtered)
        // Always use the AI-filtered text for the input field
        onChange(filtered.filteredText)
        setIsFiltering(false)
      }).catch(() => {
        onChange(alt)
        setIsFiltering(false)
      })
    } else {
      onChange(alt)
    }
    setShowAlternatives(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("flex-1", error && "border-destructive")}
        />
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isSupported || isFiltering}
          className={cn("shrink-0", isRecording && "animate-pulse")}
        >
          {isFiltering ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isFiltering ? "Filtering..." : isRecording ? "Stop recording" : "Start voice input"}
          </span>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span>Listening...</span>
        </div>
      )}

      {isFiltering && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>AI is filtering your transcription...</span>
        </div>
      )}

    {filteredResult && filteredResult.type !== "other" && (
            <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                            <div className="flex items-center gap-2 text-sm text-green-700">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">
                  AI detected: {filteredResult.type === "name" ? "Ghanaian name" : "Ghanaian location"}
                </span>
              </div>
              <div className="mt-1 text-sm text-green-600">
                <span className="line-through opacity-60">{filteredResult.originalText}</span>
                <span className="ml-2 font-medium">{filteredResult.filteredText}</span>
              </div>
              
              {/* Name validation information */}
              {filteredResult.nameValidation && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <div className="flex items-center gap-1 text-blue-700 font-medium mb-1">
                    <span>✅</span>
                    <span>Name Validation: {filteredResult.nameValidation.isValid ? 'Valid' : 'Needs Review'}</span>
                  </div>
                  <div className="text-blue-600 text-xs">
                    Type: {filteredResult.nameValidation.nameType} • 
                    Confidence: {Math.round(filteredResult.nameValidation.confidence * 100)}%
                  </div>
                  {filteredResult.nameValidation.meaning && (
                    <div className="text-blue-500 text-xs mt-1">
                      Meaning: {filteredResult.nameValidation.meaning}
                    </div>
                  )}
                  {filteredResult.nameValidation.alternatives && filteredResult.nameValidation.alternatives.length > 0 && (
                    <div className="text-blue-500 text-xs mt-1">
                      Similar names: {filteredResult.nameValidation.alternatives.join(', ')}
                    </div>
                  )}
                </div>
              )}
              
              {filteredResult.officialLocation && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <div className="flex items-center gap-1 text-blue-700 font-medium mb-1">
                    <span>📍</span>
                    <span>Official Location Found:</span>
                  </div>
                  <div className="text-blue-600">
                    {filteredResult.officialLocation}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    (Reference only - not added to form)
                  </div>
                </div>
              )}
              <div className="mt-1 text-xs text-green-500">
                Confidence: {Math.round(filteredResult.confidence * 100)}%
              </div>
            </div>
          )}

      {showAlternatives && alternatives.length > 0 && (
        <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Did you mean something else?</p>
            <Button type="button" variant="ghost" size="sm" onClick={retryRecording} className="h-8">
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
          <Select onValueChange={selectAlternative}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an alternative" />
            </SelectTrigger>
            <SelectContent>
              {alternatives.map((alt, index) => (
                <SelectItem key={index} value={alt}>
                  {alt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
