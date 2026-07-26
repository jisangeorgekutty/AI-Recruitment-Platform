import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { ResumeUpload } from '@/features/resume/components/resume-upload'
import { FileText, Download, Trash2, CheckCircle2, Star, TrendingUp, AlertCircle, Lightbulb, Loader2 } from 'lucide-react'
import { candidateResumeService, type CandidateResumeItem } from '@/services/candidate-resume.service'
import { useResumeStore } from '@/store/resume-store'
import toast from 'react-hot-toast'

export default function CandidateResumePage() {
  const [resumes, setResumes] = useState<CandidateResumeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fetchResumes = async () => {
    setIsLoading(true)
    try {
      const data = await candidateResumeService.getMyResumes()
      setResumes(data || [])
    } catch (err: any) {
      toast.error('Failed to load resumes.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const isPrimary = resumes.length === 0
      await candidateResumeService.uploadResume(file, isPrimary)
      toast.success('Resume uploaded successfully!')
      fetchResumes()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSetPrimary = async (id: number) => {
    try {
      await candidateResumeService.setPrimary(id)
      toast.success('Primary resume updated!')
      fetchResumes()
    } catch (err: any) {
      toast.error('Failed to update primary resume.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await candidateResumeService.deleteResume(id)
      toast.success('Resume deleted successfully!')
      fetchResumes()
    } catch (err: any) {
      toast.error('Failed to delete resume.')
    }
  }

  const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Resume Management" description="Upload, analyze, and manage your resumes" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>PDF, DOC, or DOCX up to 10MB</CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeUpload onUpload={handleUpload} />
              {isUploading && (
                <div className="flex items-center gap-2 mt-3 text-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading and storing your document...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Uploaded Resumes</CardTitle>
              <CardDescription>Manage your saved primary and custom resumes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center p-6 text-muted-foreground gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
                  No resumes uploaded yet. Upload a resume above to start applying!
                </div>
              ) : (
                resumes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border p-4 hover:border-primary/50 transition-all">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate">{r.fileName}</p>
                        {r.isPrimary && <Badge variant="success" className="text-xs">Primary Default</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(r.fileSize / (1024 * 1024)).toFixed(2)} MB • {new Date(r.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!r.isPrimary && (
                        <Button variant="ghost" size="sm" onClick={() => handleSetPrimary(r.id)} title="Set as primary default">
                          <Star className="h-4 w-4 text-amber-500" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => window.open(r.fileUrl, '_blank')}>
                        <Download className="mr-1 h-3.5 w-3.5" /> Download
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>ATS Compatibility Check</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Keyword Match', score: 78, color: 'bg-amber-500' },
                { label: 'Format Compatibility', score: 95, color: 'bg-emerald-500' },
                { label: 'Section Completeness', score: 85, color: 'bg-primary' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>AI Resume Score</CardTitle></CardHeader>
            <CardContent className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <span className="text-4xl font-bold text-primary">82</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">/100</p>
              <p className="mt-1 text-xs text-muted-foreground">Good score! Some improvements recommended.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>AI Suggestions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: TrendingUp, text: 'Add more quantifiable achievements', type: 'improvement' },
                { icon: AlertCircle, text: 'Missing key skills: GraphQL, Docker', type: 'warning' },
                { icon: Lightbulb, text: 'Consider adding a professional summary', type: 'suggestion' },
                { icon: CheckCircle2, text: 'Experience section is well structured', type: 'success' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <item.icon className={`h-4 w-4 mt-0.5 ${item.type === 'success' ? 'text-emerald-500' : item.type === 'warning' ? 'text-amber-500' : 'text-primary'}`} />
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
