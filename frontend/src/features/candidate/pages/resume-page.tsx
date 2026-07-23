import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { ResumeUpload } from '@/features/resume/components/resume-upload'
import { Separator } from '@/components/ui/separator'
import { Upload, Download, FileText, TrendingUp, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CandidateResumePage() {
  const handleUpload = (file: File) => {
    toast.success('Resume uploaded successfully!')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Resume Management" description="Upload, analyze, and improve your resume" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Upload Resume</CardTitle><CardDescription>PDF, DOC, or DOCX up to 10MB</CardDescription></CardHeader>
            <CardContent>
              <ResumeUpload onUpload={handleUpload} />
            </CardContent>
          </Card>

          {false ? null : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Current Resume</CardTitle><CardDescription>Last updated 2 days ago</CardDescription></div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Download</Button>
                  <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" />Replace</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border p-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">resume_john_doe_2026.pdf</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                  <Badge variant="success">Uploaded</Badge>
                </div>
              </CardContent>
            </Card>
          )}

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

          <Button className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download ATS Report
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
