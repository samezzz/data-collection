"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RotateCcw } from "lucide-react"
import Image from "next/image"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  error?: string
}

export function CameraCapture({ onCapture, error }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string>("")

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 640 },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraError("")
    } catch (err) {
      console.error("[v0] Camera access error:", err)
      setCameraError("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image data
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)
        onCapture(imageData)

        // Stop camera after capture
        stopCamera()
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    onCapture("")
    startCamera()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Circular preview container */}
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary bg-muted">
          {!isClient ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : capturedImage ? (
            <Image 
            src={capturedImage || "/placeholder.svg"} 
            alt="Captured" 
            className="w-full h-full object-cover"
            width={192}
            height={192}
          />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Error messages */}
      {(cameraError || error) && <p className="text-sm text-destructive text-center">{cameraError || error}</p>}

      {/* Capture/Retake button */}
      {capturedImage ? (
        <Button type="button" onClick={retakePhoto} variant="outline" size="lg" className="gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Retake Photo
        </Button>
      ) : (
        <Button
          type="button"
          onClick={capturePhoto}
          disabled={!stream || !!cameraError}
          size="lg"
          className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Camera className="h-4 w-4" />
          Capture Photo
        </Button>
      )}
    </div>
  )
}
