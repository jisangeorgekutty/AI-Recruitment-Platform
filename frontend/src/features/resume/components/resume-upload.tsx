import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeUploadProps {
  onUpload: (file: File) => void
  isUploading?: boolean
  accept?: Record<string, string[]>
}

export function ResumeUpload({ onUpload, isUploading, accept }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0])
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all',
        isDragActive || dragOver
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50',
        isUploading && 'pointer-events-none opacity-60',
      )}
      onDragEnter={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        ) : isDragActive ? (
          <Upload className="h-12 w-12 text-primary" />
        ) : (
          <FileText className="h-12 w-12 text-muted-foreground" />
        )}
        <div>
          {isUploading ? (
            <p className="text-sm font-medium">Uploading resume...</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop resume or click to browse'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, DOC, DOCX up to 10MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
