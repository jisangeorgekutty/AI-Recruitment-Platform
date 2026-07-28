import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Sparkles, CheckCircle2, AlertTriangle, X, Award, Briefcase, GraduationCap } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { candidateService } from '@/services/candidate.service'
import { useCandidateStore } from '@/store/candidate-store'
import type { Candidate } from '@/types'

function CompareRing({ value, label }: { value?: number; label: string }) {
  if (value === undefined || value === null) {
    return (
      <div className="flex flex-col items-center p-2 rounded-xl bg-muted/30 border text-center">
        <span className="text-xs text-muted-foreground font-semibold">N/A</span>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
    )
  }

  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="flex flex-col items-center p-2.5 rounded-xl bg-card border shadow-sm">
      <div className="relative flex items-center justify-center">
        <svg width="56" height="56" className="transform -rotate-90">
          <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 22}
            strokeDashoffset={(2 * Math.PI * 22) * (1 - value / 100)}
          />
        </svg>
        <span className="absolute text-xs font-bold">{value}%</span>
      </div>
      <span className="text-[11px] font-semibold text-muted-foreground mt-1">{label}</span>
    </div>
  )
}

export default function CandidateComparisonPage() {
  const navigate = useNavigate()
  const { comparisonCandidates, toggleComparisonSelection, clearComparison } = useCandidateStore()

  const appIds = comparisonCandidates.map((id) => Number(id)).filter((n) => !isNaN(n))

  const { data: candidates, isLoading, error, refetch } = useQuery({
    queryKey: ['candidates-compare', appIds],
    queryFn: () => candidateService.compareCandidates(appIds),
    enabled: appIds.length > 0,
  })

  if (comparisonCandidates.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Candidate Comparison"
          description="Side-by-side analysis of top applicants"
          actions={
            <Button variant="outline" onClick={() => navigate('/recruiter/candidates')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Candidates
            </Button>
          }
        />
        <Card className="py-16 text-center">
          <CardContent className="space-y-4">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No candidates selected for comparison</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Select candidates using the checkboxes on the list or pipeline view to compare them side-by-side.
              </p>
            </div>
            <Button onClick={() => navigate('/recruiter/candidates')}>Browse Candidates</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) return <ErrorState onRetry={refetch} />
  if (isLoading) return <LoadingSkeleton type="list" count={3} />

  const list = candidates ?? []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <PageHeader
        title="Side-by-Side Candidate Comparison"
        description={`Comparing ${list.length} candidate${list.length > 1 ? 's' : ''} across match scores, skills, and experience`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearComparison}>
              <X className="mr-2 h-4 w-4" />
              Clear Selection
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/recruiter/candidates')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Candidates
            </Button>
          </div>
        }
      />

      {/* Grid Layout for Side-by-Side Columns */}
      <div
        className="grid gap-6 overflow-x-auto pb-4"
        style={{
          gridTemplateColumns: `repeat(${Math.max(list.length, 1)}, minmax(300px, 1fr))`,
        }}
      >
        {list.map((candidate: Candidate) => {
          const overall = candidate.matchScoreOverall ?? candidate.resumeScore

          return (
            <Card key={candidate.id} className="h-full relative flex flex-col shadow-sm border-primary/20">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
                onClick={() => toggleComparisonSelection(candidate.id)}
                title="Remove from comparison"
              >
                <X className="h-4 w-4" />
              </Button>

              <CardContent className="p-6 space-y-6 flex-1">
                {/* Header Info */}
                <div className="flex flex-col items-center text-center pt-2 space-y-2">
                  <Avatar name={candidate.name} src={candidate.avatar} size="xl" />
                  <div>
                    <h3 className="text-lg font-bold">{candidate.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{candidate.position}</p>
                    {candidate.location && <p className="text-[11px] text-muted-foreground mt-0.5">{candidate.location}</p>}
                  </div>

                  {candidate.recommendationFit && (
                    <Badge
                      className={
                        candidate.recommendationFit === 'Strong Fit'
                          ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                          : candidate.recommendationFit === 'Low Fit'
                          ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                      }
                    >
                      {candidate.recommendationFit}
                    </Badge>
                  )}
                </div>

                {/* Score Rings */}
                <div className="border-t pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
                    AI Match Scores
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <CompareRing value={overall} label="Overall" />
                    <CompareRing value={candidate.matchScoreSkill} label="Skill Fit" />
                    <CompareRing value={candidate.matchScoreExperience} label="Exp Fit" />
                  </div>
                </div>

                {/* AI Summary */}
                {candidate.candidateAiSummary && (
                  <div className="border-t pt-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Overview</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                      {candidate.candidateAiSummary}
                    </p>
                  </div>
                )}

                {/* Matched Required Skills */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <span>Matched Skills ({(candidate.matchedSkills ?? []).length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(candidate.matchedSkills ?? candidate.skills ?? []).length > 0 ? (
                      (candidate.matchedSkills ?? candidate.skills ?? []).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[10px] px-2 py-0.5"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500 inline" />
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">None recorded</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills / Gaps */}
                {candidate.missingSkills && candidate.missingSkills.length > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Skill Gaps ({candidate.missingSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {candidate.missingSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] px-2 py-0.5"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Briefcase className="h-4 w-4 text-indigo-500" />
                    <span>Work Experience</span>
                  </div>
                  <div className="space-y-2">
                    {(candidate.experience ?? []).length > 0 ? (
                      (candidate.experience ?? []).slice(0, 3).map((exp: any, i: number) => (
                        <div key={exp.id || i} className="text-xs border-l-2 border-primary/30 pl-2.5 py-0.5">
                          <p className="font-medium truncate">{exp.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{exp.company}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No experience listed</p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <GraduationCap className="h-4 w-4 text-purple-500" />
                    <span>Education</span>
                  </div>
                  <div className="space-y-2">
                    {(candidate.education ?? []).length > 0 ? (
                      (candidate.education ?? []).slice(0, 2).map((edu: any, i: number) => (
                        <div key={edu.id || i} className="text-xs border-l-2 border-purple-500/30 pl-2.5 py-0.5">
                          <p className="font-medium truncate">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{edu.institution}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No education listed</p>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4 border-t mt-auto">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold"
                    onClick={() => navigate(`/recruiter/candidates/${candidate.id}`)}
                  >
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}
