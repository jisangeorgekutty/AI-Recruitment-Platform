import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { ResumeUpload } from '@/features/resume/components/resume-upload'
import { recruiterTalentService } from '@/services/recruiter-talent.service'
import type { RecruiterParsedResumeItem } from '@/services/recruiter-talent.service'
import { Sparkles, FileText, CheckCircle2, AlertTriangle, HelpCircle, Award, Check, RefreshCw, Users, Search, Trash2, Calendar, Mail, Phone, MapPin } from 'lucide-react'

function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border shadow-sm">
      <div className="relative flex items-center justify-center">
        <svg width="80" height="80" className="transform -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-base font-extrabold">{value}%</span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  )
}

export default function ResumeParserPage() {
  const queryClient = useQueryClient()
  const [activeMainTab, setActiveMainTab] = useState('upload')
  const [currentParsed, setCurrentParsed] = useState<RecruiterParsedResumeItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Query saved company talent pool
  const { data: talentPoolData, isLoading: isLoadingPool } = useQuery({
    queryKey: ['recruiterTalentPool', searchTerm],
    queryFn: () => recruiterTalentService.getTalentPool(searchTerm),
  })

  const talentList = talentPoolData?.items ?? talentPoolData?.data ?? []

  // Upload & AI Parse Mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => recruiterTalentService.uploadAndParse(file),
    onSuccess: (data) => {
      setCurrentParsed(data)
      queryClient.invalidateQueries({ queryKey: ['recruiterTalentPool'] })
      toast.success('Resume parsed with AI and saved to Talent Pool!')
    },
    onError: () => {
      toast.error('Failed to parse and upload resume document.')
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => recruiterTalentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterTalentPool'] })
      if (currentParsed && currentParsed.id === currentParsed.id) {
        setCurrentParsed(null)
      }
      toast.success('Candidate resume removed from talent pool.')
    },
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="AI Resume Parser & Talent Pool"
        description="Parse external resumes with AI, extract candidate details & ATS fit scores, and save to your Company Talent Pool."
      />

      <Tabs
        tabs={[
          { value: 'upload', label: 'AI Resume Parser & Analyzer' },
          { value: 'talent-pool', label: 'Company Talent Pool', count: talentList.length },
        ]}
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
      />

      {/* Tab 1: AI Resume Parser & Analyzer */}
      <TabPanel value="upload" activeTab={activeMainTab}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Upload Box */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Upload External Candidate Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeUpload onUpload={(file) => uploadMutation.mutate(file)} isUploading={uploadMutation.isPending} />
              </CardContent>
            </Card>

            {/* Spinner */}
            {uploadMutation.isPending && (
              <Card className="border-indigo-500/30 bg-indigo-500/5">
                <CardContent className="py-10 text-center space-y-3">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-sm font-semibold text-foreground">Parsing resume with AI Engine...</p>
                  <p className="text-xs text-muted-foreground">Extracting candidate contact info, skills, experience, and computing ATS scores</p>
                </CardContent>
              </Card>
            )}

            {/* Structured Extracted Data */}
            {currentParsed && !uploadMutation.isPending && (
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    Extracted Candidate Details
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    Saved to Talent Pool
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Candidate Name</p>
                      <p className="font-semibold">{currentParsed.candidateName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Title</p>
                      <p className="font-semibold">{currentParsed.currentTitle || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                      <p className="font-medium">{currentParsed.candidateEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                      <p className="font-medium">{currentParsed.candidatePhone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                      <p className="font-medium">{currentParsed.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Years of Experience</p>
                      <p className="font-semibold">{currentParsed.yearsOfExperience} years</p>
                    </div>
                  </div>

                  {currentParsed.summary && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 font-semibold">Executive Professional Summary</p>
                        <p className="text-sm text-foreground/90 leading-relaxed">{currentParsed.summary}</p>
                      </div>
                    </>
                  )}

                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">Extracted Skills ({currentParsed.skills.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentParsed.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side: ATS Scorecard */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  AI ATS Compatibility Scorecard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {uploadMutation.isPending ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-muted" />
                    <p className="mt-3 text-xs text-muted-foreground">Evaluating scores...</p>
                  </div>
                ) : currentParsed ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <ScoreRing value={currentParsed.atsOverallScore} label="Overall Score" color="#6366f1" />
                      <ScoreRing value={currentParsed.atsKeywordScore} label="Keywords" color="#10b981" />
                      <ScoreRing value={currentParsed.atsFormatScore} label="Formatting" color="#f59e0b" />
                      <ScoreRing value={currentParsed.atsCompletenessScore} label="Completeness" color="#ec4899" />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-500" />
                        AI Analysis & Recommendations
                      </p>
                      <div className="space-y-2">
                        {currentParsed.atsSuggestions.map((sug, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-card border text-xs leading-relaxed space-y-1">
                            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px]">
                              Insight
                            </Badge>
                            <p className="text-foreground/90 font-medium">{sug}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-muted-foreground space-y-2">
                    <Sparkles className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm font-medium">No Resume Analyzed Yet</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Upload any PDF or Word resume document to parse candidate details and generate AI ATS scorecards.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabPanel>

      {/* Tab 2: Company Talent Pool */}
      <TabPanel value="talent-pool" activeTab={activeMainTab}>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search talent pool candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Total Saved Candidates: <strong className="text-foreground font-semibold">{talentList.length}</strong>
            </span>
          </div>

          {isLoadingPool ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
              <p className="text-sm">Loading company talent pool...</p>
            </div>
          ) : talentList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground space-y-3">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <h3 className="text-base font-semibold">No Talent Pool Resumes Found</h3>
                <p className="text-xs max-w-sm mx-auto">
                  {searchTerm ? 'No candidates match your search query.' : 'Parsed candidate resumes will automatically save here into your private company talent pool.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {talentList.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-all border-muted/80">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-base">{item.candidateName}</h4>
                        <p className="text-xs text-muted-foreground">{item.currentTitle || 'Software Professional'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-500/15 text-indigo-600 border-indigo-500/30 text-xs font-bold">
                          {item.atsOverallScore}% ATS Score
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                          onClick={() => deleteMutation.mutate(item.id)}
                          title="Delete from talent pool"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3" />{item.candidateEmail}</span>
                      {item.candidatePhone && <span className="flex items-center gap-1 truncate"><Phone className="w-3 h-3" />{item.candidatePhone}</span>}
                      {item.location && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" />{item.location}</span>}
                      <span className="flex items-center gap-1 truncate"><Calendar className="w-3 h-3" />{new Date(item.parsedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px]">
                          {skill}
                        </Badge>
                      ))}
                      {item.skills.length > 5 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{item.skills.length - 5}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5"
                        onClick={() => {
                          setCurrentParsed(item)
                          setActiveMainTab('upload')
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        View Full AI Analysis
                      </Button>
                      {item.documentUrl && (
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-indigo-600 hover:underline"
                        >
                          Download Resume
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabPanel>
    </motion.div>
  )
}
