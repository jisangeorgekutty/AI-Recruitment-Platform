import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Bot, X, Sparkles, User, Briefcase, Video, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { interviewService } from '@/services/interview.service'
import { candidateService } from '@/services/candidate.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface ScheduleInterviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScheduleInterviewModal({ isOpen, onClose }: ScheduleInterviewModalProps) {
  const queryClient = useQueryClient()

  // Fetch real candidates from API
  const { data: apiCandidatesData } = useQuery({
    queryKey: ['candidates-select'],
    queryFn: () => candidateService.list({ pageSize: 50 }),
    enabled: isOpen,
  })

  const rawCandidates = (apiCandidatesData as any)?.data || (apiCandidatesData as any)?.items || (Array.isArray(apiCandidatesData) ? apiCandidatesData : [])
  const candidatesList = Array.isArray(rawCandidates) ? rawCandidates : []

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('')
  const [jobApplicationId, setJobApplicationId] = useState<number>(1)
  const [candidateName, setCandidateName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [title, setTitle] = useState('AI Automated Screening Session')
  const [interviewType, setInterviewType] = useState('ai_screening')
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0])
  const [scheduledTime, setScheduledTime] = useState('10:00')
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle Candidate Selection from Dropdown
  const handleSelectCandidate = (candId: string) => {
    setSelectedCandidateId(candId)
    if (!candId) return

    const cand = candidatesList.find((c: any) => String(c.id) === String(candId))
    if (cand) {
      const name = cand.name || cand.candidateName || `${cand.firstName || ''} ${cand.lastName || ''}`.trim() || ''
      const rawRole = cand.position || cand.jobTitle || cand.targetRole || cand.currentTitle || cand.role || ''
      const role = (rawRole && rawRole.toLowerCase() !== 'position') ? rawRole : ''
      const appId = cand.applicationId || cand.id || 1

      setCandidateName(name)
      setJobTitle(role)
      setJobApplicationId(Number(appId) || 1)
      setTitle(role ? `AI Screening - ${role}` : 'AI Automated Screening Session')
    }
  }

  useEffect(() => {
    if (isOpen && candidatesList.length > 0 && !selectedCandidateId) {
      handleSelectCandidate(String(candidatesList[0].id))
    }
  }, [isOpen, candidatesList])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateName.trim()) {
      toast.error('Please enter or select candidate name.')
      return
    }

    setIsSubmitting(true)
    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString()
      await interviewService.create({
        jobApplicationId,
        title: title.trim() || (jobTitle ? `AI Screening - ${jobTitle}` : 'AI Automated Screening Session'),
        interviewType,
        scheduledAt,
        durationMinutes,
        candidateName,
        jobTitle,
      } as any)

      toast.success(`Interview scheduled for ${candidateName}! AI Screening questions generated.`)
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      onClose()
    } catch {
      toast.error('Failed to schedule interview.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">Schedule Interview</h2>
                <p className="text-xs text-slate-400">Schedule AI screening or technical interview for candidate</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-200">
            {/* Candidate Dropdown Selector (if candidate applications exist) */}
            {candidatesList.length > 0 ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-indigo-400" /> Select Applied Candidate
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Auto-fills candidate details</span>
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => handleSelectCandidate(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  {candidatesList.map((cand: any) => {
                    const cName = cand.name || cand.candidateName || `${cand.firstName || ''} ${cand.lastName || ''}`.trim() || 'Candidate'
                    const rawRole = cand.position || cand.jobTitle || cand.targetRole || cand.currentTitle || cand.role || ''
                    const cRole = (rawRole && rawRole.toLowerCase() !== 'position') ? rawRole : ''
                    return (
                      <option key={cand.id} value={cand.id}>
                        {cName}{cRole ? ` — ${cRole}` : ''}
                      </option>
                    )
                  })}
                </select>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400" />
                <span>No applied candidates found in system yet. Enter candidate details directly below.</span>
              </div>
            )}

            {/* Selected Candidate Summary Badge */}
            {candidateName && (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <User className="h-3.5 w-3.5 text-indigo-400" /> {candidateName}
                  </div>
                  {jobTitle ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Briefcase className="h-3.5 w-3.5 text-purple-400" /> {jobTitle}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">No job position specified</div>
                  )}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  Selected Candidate
                </span>
              </div>
            )}

            {/* Candidate Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-indigo-400" /> Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter candidate full name..."
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Job Position Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-purple-400" /> Job Position
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Interview Title */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Interview Session Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Type & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-indigo-400" /> Interview Type
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ai_screening">AI Screening (Automated)</option>
                  <option value="technical">Technical Deep Dive</option>
                  <option value="video">Video Call</option>
                  <option value="panel">Panel Round</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-purple-400" /> Duration
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? (
                  <>
                    <Bot className="mr-2 h-4 w-4 animate-spin" /> Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" /> Schedule Interview
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
