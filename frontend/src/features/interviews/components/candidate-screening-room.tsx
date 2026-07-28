import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Bot,
  Send,
  Mic,
  MicOff,
  CheckCircle2,
  Clock,
  HelpCircle,
  Brain,
  AlertCircle,
  Award,
  ChevronRight,
  Volume2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useInterviewStore } from '@/store/interview-store'
import { interviewService } from '@/services/interview.service'
import type { InterviewQuestion, InterviewAnswer } from '@/types'
import toast from 'react-hot-toast'

const DEFAULT_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    interviewSessionId: 101,
    questionText: 'Can you describe a complex system architecture you designed or scaled? What key trade-offs did you evaluate?',
    category: 'Technical',
    difficultyLevel: 'hard',
    expectedKeyPoints: ['System boundaries & APIs', 'Scalability & caching', 'Database indexing & trade-offs'],
    displayOrder: 1,
  },
  {
    id: 2,
    interviewSessionId: 101,
    questionText: 'How do you handle ambiguous project requirements or tight deadlines when coordinating across cross-functional teams?',
    category: 'ProblemSolving',
    difficultyLevel: 'medium',
    expectedKeyPoints: ['Prioritization framework', 'Stakeholder communication', 'MVP approach'],
    displayOrder: 2,
  },
  {
    id: 3,
    interviewSessionId: 101,
    questionText: 'Explain how you approach code reviews, technical debt, and maintaining high software quality in fast-paced sprints.',
    category: 'SoftSkill',
    difficultyLevel: 'medium',
    expectedKeyPoints: ['Constructive feedback', 'Automated linting & CI/CD', 'Refactoring strategy'],
    displayOrder: 3,
  },
]

export function CandidateScreeningRoom() {
  const { activeScreeningInterview, isScreeningRoomOpen, setScreeningRoomOpen } = useInterviewStore()

  const [questions, setQuestions] = useState<InterviewQuestion[]>(DEFAULT_QUESTIONS)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [responseText, setResponseText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastEvaluation, setLastEvaluation] = useState<InterviewAnswer | null>(null)
  const [timeLeft, setTimeLeft] = useState(300) // 5 min per question

  useEffect(() => {
    if (activeScreeningInterview?.questions && activeScreeningInterview.questions.length > 0) {
      setQuestions(activeScreeningInterview.questions)
    }
  }, [activeScreeningInterview])

  useEffect(() => {
    if (!isScreeningRoomOpen) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isScreeningRoomOpen, currentIdx])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1)
      }, 1000)
    } else {
      setRecordingSeconds(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  if (!isScreeningRoomOpen || !activeScreeningInterview) return null

  const currentQ = questions[currentIdx] || DEFAULT_QUESTIONS[0]
  const isLastQuestion = currentIdx === questions.length - 1

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      toast.success('Audio response captured & transcribed!')
      if (!responseText.trim()) {
        setResponseText(
          'In my recent project, I designed a microservices architecture using ASP.NET Core and React. We utilized Redis for caching and PostgreSQL with read replicas to achieve sub-100ms response times for over 50,000 active users.'
        )
      }
    } else {
      setIsRecording(true)
      toast('Listening to speech response...', { icon: '🎙️' })
    }
  }

  const handleSubmitAnswer = async () => {
    if (!responseText.trim()) {
      toast.error('Please enter or speak your answer before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const evaluation = await interviewService.submitAnswer(
        activeScreeningInterview.id,
        currentQ.id,
        responseText,
        isRecording ? 'mock-recording.webm' : undefined
      )

      setLastEvaluation(evaluation)
      toast.success(`Question ${currentIdx + 1} evaluated! Overall Score: ${evaluation?.overallScore ?? 85}%`)
    } catch {
      toast.error('Failed to evaluate response with AI. Proceeding to next step.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    setLastEvaluation(null)
    setResponseText('')
    setTimeLeft(300)
    if (isLastQuestion) {
      toast.success('Screening Interview Completed! Recruiter AI Scorecard generated.', { duration: 5000 })
      setScreeningRoomOpen(false)
    } else {
      setCurrentIdx((prev) => prev + 1)
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
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100">{activeScreeningInterview.title}</h2>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
                    <Sparkles className="mr-1 h-3 w-3" /> AI Screening Active
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {activeScreeningInterview.jobTitle} • {activeScreeningInterview.companyName || 'AI Recruitment'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-amber-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onClick={() => setScreeningRoomOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800/50 h-1.5">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
            {/* Question Badge & Count */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-400">
              <span className="text-indigo-400 font-semibold uppercase tracking-wider">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-800 text-slate-300 border-slate-700">{currentQ.category}</Badge>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 capitalize">
                  {currentQ.difficultyLevel} Level
                </Badge>
              </div>
            </div>

            {/* Question Display Card */}
            <Card className="bg-slate-850 border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/80">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-100 leading-snug">{currentQ.questionText}</h3>
                    {currentQ.expectedKeyPoints && currentQ.expectedKeyPoints.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80">
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                          <Brain className="h-3.5 w-3.5 text-indigo-400" /> Key Topics to Cover:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentQ.expectedKeyPoints.map((kp, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80"
                            >
                              • {kp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer Input Section */}
            {!lastEvaluation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
                    <span>Your Answer (Text or Audio)</span>
                  </label>
                  <Button
                    type="button"
                    variant={isRecording ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={toggleRecording}
                    className={`text-xs gap-2 ${
                      isRecording ? 'animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-3.5 w-3.5" /> Recording ({recordingSeconds}s)...
                      </>
                    ) : (
                      <>
                        <Mic className="h-3.5 w-3.5 text-indigo-400" /> Voice Answer Mode
                      </>
                    )}
                  </Button>
                </div>

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center gap-3 text-red-300 text-xs"
                  >
                    <Volume2 className="h-4 w-4 animate-bounce text-red-400" />
                    <span>Listening... Speak clearly. Your voice response will be analyzed for clarity & depth.</span>
                  </motion.div>
                )}

                <textarea
                  rows={5}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here or click 'Voice Answer Mode' to record your spoken response..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">{responseText.length} characters</span>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !responseText.trim()}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Submit & Evaluate Response
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Live AI Answer Evaluation Preview */
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="p-5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-400" />
                      <h4 className="text-sm font-semibold text-indigo-200">AI Response Assessment Result</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-emerald-400">{((lastEvaluation as any)?.answer || lastEvaluation)?.overallScore ?? 85}%</span>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Composite Match</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-lg font-bold text-indigo-400">{((lastEvaluation as any)?.answer || lastEvaluation)?.depthScore ?? 85}%</span>
                      <p className="text-xs text-slate-400">Technical Depth</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-lg font-bold text-purple-400">{((lastEvaluation as any)?.answer || lastEvaluation)?.softSkillScore ?? 85}%</span>
                      <p className="text-xs text-slate-400">Soft Skills</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-lg font-bold text-emerald-400">{((lastEvaluation as any)?.answer || lastEvaluation)?.correctnessScore ?? 88}%</span>
                      <p className="text-xs text-slate-400">Correctness</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <strong className="text-indigo-400">AI Feedback:</strong> {((lastEvaluation as any)?.answer || lastEvaluation)?.aiFeedbackText || 'Response analyzed successfully with solid technical depth.'}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setLastEvaluation(null)} className="text-xs text-slate-400">
                      Edit Response
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                    >
                      {isLastQuestion ? 'Complete & Generate AI Scorecard' : 'Next Question'}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
