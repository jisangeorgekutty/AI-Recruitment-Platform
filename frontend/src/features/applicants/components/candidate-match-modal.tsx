import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { jobService } from '@/services/job.service'
import { useJobMatchStore } from '@/store/job-match-store'
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw, X, Award, Briefcase, Zap } from 'lucide-react'

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

export function CandidateMatchModal() {
  const queryClient = useQueryClient()
  const { selectedApplicationId, isMatchModalOpen, closeMatchModal, activeMatchResult, setActiveMatchResult } = useJobMatchStore()

  const { data: matchData, isLoading, refetch } = useQuery({
    queryKey: ['jobMatch', selectedApplicationId],
    queryFn: () => (selectedApplicationId ? jobService.getMatchScore(selectedApplicationId) : null),
    enabled: !!selectedApplicationId && isMatchModalOpen,
  })

  const currentResult = matchData ?? activeMatchResult

  const recalculateMutation = useMutation({
    mutationFn: (appId: number) => jobService.recalculateMatchScore(appId),
    onSuccess: (data) => {
      setActiveMatchResult(data)
      queryClient.invalidateQueries({ queryKey: ['jobMatch', selectedApplicationId] })
      toast.success('AI Match score recalculated!')
    },
    onError: () => {
      toast.error('Failed to recalculate match score.')
    },
  })

  if (!isMatchModalOpen) return null

  const getRecommendationBadge = (fit?: string) => {
    switch (fit) {
      case 'Strong Fit':
        return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 px-3 py-1 font-semibold text-xs"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Strong Fit</Badge>
      case 'Low Fit':
        return <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/30 px-3 py-1 font-semibold text-xs"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Low Fit</Badge>
      default:
        return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 px-3 py-1 font-semibold text-xs"><Zap className="w-3.5 h-3.5 mr-1" /> Potential Fit</Badge>
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">AI Candidate Match & Skill Gap Analysis</h3>
                <p className="text-xs text-muted-foreground">Automated job fit breakdown powered by AI Engine</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={closeMatchModal}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {isLoading ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
                <p className="text-sm font-medium text-muted-foreground">Analyzing candidate profile against job requirements...</p>
              </div>
            ) : currentResult ? (
              <>
                {/* Score Breakdown Cards */}
                <div className="flex items-center justify-between gap-4">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <ScoreRing value={currentResult.overallMatchPercentage} label="Overall Match" color="#6366f1" />
                    <ScoreRing value={currentResult.skillMatchPercentage} label="Skill Match" color="#10b981" />
                    <ScoreRing value={currentResult.experienceMatchPercentage} label="Experience Fit" color="#f59e0b" />
                  </div>
                  <div className="flex flex-col items-end gap-2 pr-2">
                    <span className="text-xs text-muted-foreground font-medium">Evaluation Result</span>
                    {getRecommendationBadge(currentResult.recommendationFit)}
                  </div>
                </div>

                {/* Candidate Executive Summary */}
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                  <CardContent className="p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> Candidate AI Overview
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed font-normal">
                      {currentResult.candidateAiSummary || 'No summary available.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Skill Match Breakdown */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <span>Matched Required Skills ({currentResult.matchedSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentResult.matchedSkills.length > 0 ? (
                        currentResult.matchedSkills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 px-2.5 py-1 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No required skills matched.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      <span>Skill Gaps / Missing Requirements ({currentResult.missingSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentResult.missingSkills.length > 0 ? (
                        currentResult.missingSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30 px-2.5 py-1 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No skill gaps identified! Excellent match.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No match score evaluation data available.</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
            <Button
              variant="outline"
              size="sm"
              disabled={recalculateMutation.isPending || !selectedApplicationId}
              onClick={() => selectedApplicationId && recalculateMutation.mutate(selectedApplicationId)}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${recalculateMutation.isPending ? 'animate-spin' : ''}`} />
              Recalculate AI Match
            </Button>
            <Button variant="default" size="sm" onClick={closeMatchModal}>
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
