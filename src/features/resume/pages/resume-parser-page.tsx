import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ResumeUpload } from '@/features/resume/components/resume-upload'
import { ResumeScoreCard } from '@/features/resume/components/resume-score'
import { resumeService } from '@/services/resume.service'
import { useResumeStore } from '@/store/resume-store'

export default function ResumeParserPage() {
  const { parsedData, resumeScore, setParsedData, setResumeScore, setUploading, setParsing, setAnalyzing, isUploading, isParsing, isAnalyzing } = useResumeStore()

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeService.upload('temp', file),
    onSuccess: async (resume) => {
      setUploading(false)
      setParsing(true)
      try {
        const data = await resumeService.parse(resume.id)
        setParsedData(data)
        setParsing(false)
        setAnalyzing(true)
        const score = await resumeService.analyze(resume.id, '')
        setResumeScore(score)
        toast.success('Resume analyzed successfully')
      } catch {
        toast.error('Failed to analyze resume')
      } finally {
        setAnalyzing(false)
      }
    },
    onError: () => {
      setUploading(false)
      toast.error('Failed to upload resume')
    },
  })

  const handleUpload = (file: File) => {
    setUploading(true)
    uploadMutation.mutate(file)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Resume Parser"
        description="Upload and analyze resumes with AI"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeUpload onUpload={handleUpload} isUploading={isUploading} />
            </CardContent>
          </Card>

          {isParsing && (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-3 text-sm text-muted-foreground">Parsing resume with AI...</p>
              </CardContent>
            </Card>
          )}

          {parsedData && !isParsing && (
            <Card>
              <CardHeader>
                <CardTitle>Parsed Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{parsedData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{parsedData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{parsedData.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{parsedData.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Experience</p>
                    <p className="text-sm font-medium">{parsedData.totalYearsExperience} years</p>
                  </div>
                </div>

                {parsedData.summary && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Summary</p>
                      <p className="text-sm">{parsedData.summary}</p>
                    </div>
                  </>
                )}

                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.certifications.map((cert) => (
                      <Badge key={cert} variant="outline">{cert}</Badge>
                    ))}
                  </div>
                </div>

                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <ResumeScoreCard score={resumeScore} isLoading={isAnalyzing} />
        </div>
      </div>
    </motion.div>
  )
}
