import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/stat-card'
import { Send, Briefcase, Calendar, TrendingUp, ArrowRight, Star, FileText, Bell } from 'lucide-react'
import { useCandidateStore } from '@/features/candidate/store/candidate-store'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function CandidateDashboardPage() {
  const navigate = useNavigate()
  const { applications, savedJobs, profileCompletion, aiResumeScore } = useCandidateStore()
  const { user } = { user: { name: 'John Doe' } }

  const activeApps = applications.filter((a) => a.status !== 'rejected' && a.status !== 'hired').length
  const upcomingInterviews = 2
  const offersCount = 1

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Welcome */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-primary/20">
        <CardContent className="flex items-start justify-between p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's what's happening with your job search today.</p>
          </div>
          <Button onClick={() => navigate('/candidate/jobs')}>
            Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Applications" value={activeApps} icon={<Send className="h-6 w-6" />} />
        <StatCard title="Saved Jobs" value={savedJobs.length} icon={<Briefcase className="h-6 w-6" />} />
        <StatCard title="Upcoming Interviews" value={upcomingInterviews} icon={<Calendar className="h-6 w-6" />} />
        <StatCard title="Offers Received" value={offersCount} icon={<TrendingUp className="h-6 w-6" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Completion & AI Score */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Profile Completion</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Complete your profile</span>
                <span className="font-bold">{profileCompletion}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${profileCompletion}%` }} />
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/candidate/profile')}>
                Complete Profile <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">AI Resume Score</CardTitle></CardHeader>
            <CardContent className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <span className="text-3xl font-bold text-primary">{aiResumeScore ?? '--'}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Based on ATS compatibility</p>
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => navigate('/candidate/resume')}>
                Improve Score <Star className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/candidate/applications')}>
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Send className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No applications yet</p>
                <Button size="sm" className="mt-3" onClick={() => navigate('/candidate/jobs')}>
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center gap-3 rounded-xl border p-3">
                    <Avatar name={app.company} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{app.company}</p>
                    </div>
                    <Badge variant={app.status === 'offer' || app.status === 'hired' ? 'success' : app.status === 'rejected' ? 'destructive' : 'info'}>
                      {app.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm">Recommended for You</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/candidate/jobs')}>
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/candidate/jobs')}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={`Company ${i}`} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Senior Frontend Engineer</p>
                      <p className="text-xs text-muted-foreground">Tech Corp • Remote</p>
                      <p className="mt-2 text-sm font-semibold text-primary">$120k - $180k</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-[10px]">React</Badge>
                        <Badge variant="secondary" className="text-[10px]">TypeScript</Badge>
                        <Badge variant="secondary" className="text-[10px]">Node.js</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
