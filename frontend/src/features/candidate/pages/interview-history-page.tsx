import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import {
  History,
  Calendar,
  Star,
  MessageSquare,
  Award,
  Bot,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  ChevronRight,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { interviewService } from '@/services/interview.service'
import { useInterviewStore } from '@/store/interview-store'
import { AIScorecardModal } from '@/features/interviews/components/ai-scorecard-modal'
import { CandidateScreeningRoom } from '@/features/interviews/components/candidate-screening-room'
import type { Interview } from '@/types'

export default function CandidateInterviewHistoryPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { setInterviews, setActiveScorecardInterview, setActiveScreeningInterview } = useInterviewStore()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['candidate-interviews'],
    queryFn: () => interviewService.list({ pageSize: 50 }),
  })

  const interviews: Interview[] = Array.isArray(data)
    ? data
    : (data?.data ?? data?.items ?? [])

  useEffect(() => {
    if (interviews.length > 0) {
      setInterviews(interviews)
    }
  }, [interviews, setInterviews])

  // Filter interviews by status tab and search query
  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'completed') return item.status === 'completed'
    if (activeTab === 'scheduled') return item.status === 'scheduled' || item.status === 'confirmed' || item.status === 'in_progress'
    if (activeTab === 'cancelled') return item.status === 'cancelled'
    return true
  })

  // Compute metrics
  const totalCount = interviews.length
  const completedCount = interviews.filter((i) => i.status === 'completed').length
  const scheduledCount = interviews.filter((i) => i.status === 'scheduled' || i.status === 'confirmed' || i.status === 'in_progress').length
  
  const scorecardsWithScores = interviews
    .map((i) => i.scorecard?.overallScore)
    .filter((score): score is number => typeof score === 'number' && score > 0)
  
  const avgScore = scorecardsWithScores.length > 0
    ? Math.round(scorecardsWithScores.reduce((acc, curr) => acc + curr, 0) / scorecardsWithScores.length)
    : 0

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="success"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>
      case 'scheduled':
      case 'confirmed':
        return <Badge variant="info"><Clock className="mr-1 h-3 w-3" /> Scheduled</Badge>
      case 'in_progress':
        return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30"><Bot className="mr-1 h-3 w-3" /> In Screening</Badge>
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ai_screening':
        return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">AI Screening</Badge>
      case 'technical':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Technical Deep Dive</Badge>
      case 'behavioral':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Behavioral / Culture</Badge>
      default:
        return <Badge variant="outline">{type.replace('_', ' ')}</Badge>
    }
  }

  if (error && interviews.length === 0) {
    return <ErrorState onRetry={refetch} />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Interview History & AI Scorecards"
        description="Track past technical screenings, AI performance scorecards, and upcoming interview sessions"
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 border-slate-800 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <History className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{totalCount}</p>
            <p className="text-xs text-slate-400">Total Interviews</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{completedCount}</p>
            <p className="text-xs text-slate-400">Completed Sessions</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{scheduledCount}</p>
            <p className="text-xs text-slate-400">Upcoming / Active</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-100">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</p>
            <p className="text-xs text-slate-400">Avg AI Match Rating</p>
          </div>
        </Card>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Tabs
          tabs={[
            { value: 'all', label: `All (${totalCount})` },
            { value: 'completed', label: `Completed (${completedCount})` },
            { value: 'scheduled', label: `Scheduled (${scheduledCount})` },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by role or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900/60 border-slate-800 text-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <LoadingSkeleton type="list" count={4} />
      ) : filteredInterviews.length === 0 ? (
        <EmptyState
          icon={<History className="h-12 w-12 text-slate-500" />}
          title="No interview history found"
          description={
            searchQuery
              ? 'No interviews match your search criteria.'
              : 'Your scheduled and completed interview sessions will appear here.'
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-lg overflow-hidden"
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Info Column */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar name={item.companyName || item.jobTitle} size="lg" className="mt-1" />
                    
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-100 truncate">{item.jobTitle}</h3>
                        {getStatusBadge(item.status)}
                        {getTypeBadge(item.type)}
                      </div>

                      <p className="text-sm font-medium text-purple-300">
                        {item.companyName || 'TechCorp'} • <span className="text-slate-400 font-normal">{item.title}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {formatDate(item.date, 'long')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {item.startTime} ({item.duration} mins)
                        </span>
                      </div>

                      {/* AI Executive Summary / Notes Preview if available */}
                      {item.scorecard?.executiveSummary && (
                        <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <p className="line-clamp-2">{item.scorecard.executiveSummary}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Scorecard / Actions Column */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 gap-3 min-w-[200px]">
                    {item.scorecard ? (
                      <div className="text-left md:text-right space-y-1">
                        <div className="flex items-center gap-2 md:justify-end">
                          <span className="text-2xl font-black text-indigo-400">{item.scorecard.overallScore}%</span>
                          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-xs">
                            {item.scorecard.recommendation}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400">AI Match Evaluation</p>
                      </div>
                    ) : item.status === 'scheduled' || item.status === 'in_progress' ? (
                      <div className="text-left md:text-right">
                        <Badge variant="outline" className="text-purple-400 border-purple-500/30 bg-purple-500/10">
                          Ready for Screening
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-left md:text-right">
                        <span className="text-xs text-slate-500">No scorecard generated</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {item.scorecard ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                          onClick={() => setActiveScorecardInterview(item)}
                        >
                          <Award className="mr-1.5 h-4 w-4 text-purple-400" />
                          View Scorecard
                        </Button>
                      ) : (item.status === 'scheduled' || item.status === 'in_progress') ? (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20"
                          onClick={() => setActiveScreeningInterview(item)}
                        >
                          <Bot className="mr-1.5 h-4 w-4" />
                          Launch Screening
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-slate-200"
                          onClick={() => setActiveScorecardInterview(item)}
                        >
                          Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Global Modals for Scorecard & Screening Room */}
      <AIScorecardModal />
      <CandidateScreeningRoom />
    </motion.div>
  )
}
