"use client"

import { useState, useRef } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: File) => void
  showCropper: (show: boolean) => void
}

export default function ImageCropper({ image, onCropComplete, showCropper }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  })
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return

    const canvas = document.createElement("canvas")
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    canvas.width = completedCrop.width
    canvas.height = completedCrop.height

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    )

    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Canvas is empty")
      }
      const file = new File([blob], "cropped-image.jpeg", { type: "image/jpeg" })
      onCropComplete(file)
      showCropper(false)
    }, "image/jpeg")
  }

  return (
    <Dialog open={true} onOpenChange={() => showCropper(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={1}>
            <img ref={imgRef} src={image || "/placeholder.svg"} alt="Crop preview" className="max-h-[60vh] w-auto" />
          </ReactCrop>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => showCropper(false)}>
              Cancel
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={getCroppedImg}>
              Crop & Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
