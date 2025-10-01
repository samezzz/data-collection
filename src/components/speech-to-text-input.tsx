"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpeechToTextInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
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

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function SpeechToTextInput({ id, value, onChange, placeholder, error }: SpeechToTextInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [, setTranscript] = useState("")
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsSupported(false)
        console.log("[v0] Speech recognition not supported in this browser")
      }
    }
  }, [])

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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log("[v0] Speech recognition result received")
      const results = event.results[0]
      const transcribedText = results[0].transcript

      setTranscript(transcribedText)
      onChange(transcribedText)

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
    onChange("")
    startRecording()
  }

  const selectAlternative = (alt: string) => {
    onChange(alt)
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
          disabled={!isSupported}
          className={cn("shrink-0", isRecording && "animate-pulse")}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          <span className="sr-only">{isRecording ? "Stop recording" : "Start voice input"}</span>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span>Listening...</span>
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
