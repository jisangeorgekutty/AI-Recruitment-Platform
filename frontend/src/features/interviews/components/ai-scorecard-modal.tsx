import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Brain,
  FileText,
  UserCheck,
  X,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useInterviewStore } from '@/store/interview-store'
import { interviewService } from '@/services/interview.service'
import type { InterviewScorecard } from '@/types'
import toast from 'react-hot-toast'

export function AIScorecardModal() {
  const { activeScorecardInterview, isScorecardModalOpen, setScorecardModalOpen } = useInterviewStore()

  const [scorecard, setScorecard] = useState<InterviewScorecard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showQuestionBreakdown, setShowQuestionBreakdown] = useState(false)

  useEffect(() => {
    if (!isScorecardModalOpen || !activeScorecardInterview) return

    const loadScorecard = async () => {
      setIsLoading(true)
      try {
        const sc = await interviewService.getScorecard(activeScorecardInterview.id)
        setScorecard(sc)
      } catch {
        toast.error('Failed to load candidate AI scorecard.')
      } finally {
        setIsLoading(false)
      }
    }

    loadScorecard()
  }, [isScorecardModalOpen, activeScorecardInterview])

  if (!isScorecardModalOpen || !activeScorecardInterview) return null

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'Strong Hire':
      case 'strong_hire':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 text-sm font-semibold">
            <CheckCircle className="mr-1.5 h-4 w-4" /> Strong Hire
          </Badge>
        )
      case 'Hire':
      case 'hire':
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 px-3 py-1 text-sm font-semibold">
            <CheckCircle className="mr-1.5 h-4 w-4" /> Recommended Hire
          </Badge>
        )
      case 'Consider':
      case 'maybe':
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1 text-sm font-semibold">
            <AlertTriangle className="mr-1.5 h-4 w-4" /> Consider / Further Review
          </Badge>
        )
      default:
        return (
          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 px-3 py-1 text-sm font-semibold">
            <XCircle className="mr-1.5 h-4 w-4" /> Not Recommended
          </Badge>
        )
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">AI Candidate Evaluation Scorecard</h2>
                <p className="text-xs text-slate-400">
                  {activeScorecardInterview.candidateName} • {activeScorecardInterview.jobTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-1" /> Print / Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onClick={() => setScorecardModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <Sparkles className="h-8 w-8 text-purple-400 animate-spin" />
                <p className="text-sm text-slate-400">Generating AI Evaluation Scorecard Summary...</p>
              </div>
            ) : scorecard ? (
              <>
                {/* Composite Banner */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">AI Recommendation</span>
                    <div>{getRecommendationBadge(scorecard.recommendation)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-3xl font-extrabold text-indigo-400">{scorecard.overallScore}%</span>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Fit Match</p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-slate-850 border-slate-800 p-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Technical Depth</span>
                      <span className="font-semibold text-indigo-400">{scorecard.technicalScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${scorecard.technicalScore}%` }} />
                    </div>
                  </Card>

                  <Card className="bg-slate-850 border-slate-800 p-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Soft Skills & Clarity</span>
                      <span className="font-semibold text-purple-400">{scorecard.softSkillScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${scorecard.softSkillScore}%` }} />
                    </div>
                  </Card>

                  <Card className="bg-slate-850 border-slate-800 p-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Problem Solving</span>
                      <span className="font-semibold text-emerald-400">{scorecard.problemSolvingScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${scorecard.problemSolvingScore}%` }} />
                    </div>
                  </Card>
                </div>

                {/* Executive AI Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Brain className="h-4 w-4 text-purple-400" /> Executive AI Assessment Summary
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                    {scorecard.executiveSummary}
                  </div>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Key Strengths */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Identified Key Strengths
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {scorecard.keyStrengths.map((str, idx) => (
                        <li key={idx} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Areas for Growth / Weaknesses
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {scorecard.keyWeaknesses.map((wk, idx) => (
                        <li key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Question Breakdown Toggle */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-850"
                    onClick={() => setShowQuestionBreakdown((prev) => !prev)}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-400" /> View Question-by-Question Answers & Feedback
                    </span>
                    {showQuestionBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>

                  {showQuestionBreakdown && activeScorecardInterview.questions && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-3">
                      {activeScorecardInterview.questions.map((q, idx) => (
                        <div key={q.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-400 font-medium">
                            <span>Q{idx + 1}: {q.questionText}</span>
                            <Badge variant="outline" className="text-[10px]">{q.category}</Badge>
                          </div>
                          {q.answer && (
                            <div className="mt-1 space-y-1 text-slate-300">
                              <p className="italic bg-slate-900 p-2 rounded border border-slate-800">
                                "{q.answer.candidateResponseText}"
                              </p>
                              <p className="text-indigo-400">
                                <strong>Feedback:</strong> {q.answer.aiFeedbackText}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {/* Footer Action Controls */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300" onClick={() => setScorecardModalOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
                onClick={() => {
                  toast.success(`Candidate ${activeScorecardInterview.candidateName} moved to next round!`)
                  setScorecardModalOpen(false)
                }}
              >
                <UserCheck className="mr-1.5 h-4 w-4" /> Move Candidate to Next Stage
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
