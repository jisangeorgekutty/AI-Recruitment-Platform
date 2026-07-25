import { useRef, useState, type ChangeEvent } from 'react'
import { Camera } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AvatarUploadProps {
  name: string
  currentSrc?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onImageChange?: (imageUri: string, file: File) => void
}

export function AvatarUpload({
  name,
  currentSrc,
  size = 'xl',
  className,
  onImageChange,
}: AvatarUploadProps) {
  const [previewSrc, setPreviewSrc] = useState<string | undefined>(currentSrc)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewSrc(result)
      toast.success('Avatar image updated!')
      onImageChange?.(result, file)
    }
    reader.readAsDataURL(file)
  }

  const triggerSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('relative inline-block group cursor-pointer', className)} onClick={triggerSelect}>
      <Avatar name={name} src={previewSrc} size={size} className="ring-4 ring-background shadow-md transition-opacity group-hover:opacity-90" />
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <Camera className="h-5 w-5 text-white drop-shadow" />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          triggerSelect()
        }}
        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background hover:scale-110 transition-transform"
        title="Upload new avatar"
      >
        <Camera className="h-3.5 w-3.5" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
