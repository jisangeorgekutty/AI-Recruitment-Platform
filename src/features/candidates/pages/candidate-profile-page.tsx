import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Star } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ErrorState } from '@/components/error-state'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import { candidateService } from '@/services/candidate.service'
import { STAGE_LABELS } from '@/features/candidates/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: candidate, isLoading, error } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidateService.getById(id!),
    enabled: !!id,
  })

  if (error) return <ErrorState onRetry={() => queryClient.invalidateQueries({ queryKey: ['candidate', id] })} />

  if (isLoading || !candidate) return <LoadingSkeleton type="detail" />

  return (
    <div className="space-y-6">
      <PageHeader
        title=""
        actions={
          <Button variant="outline" onClick={() => navigate('/candidates')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar name={candidate.name} src={candidate.avatar} size="xl" />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold">{candidate.name}</h1>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn('h-4 w-4', i < candidate.rating ? 'fill-amber-400 text-amber-400' : 'text-muted')}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">{candidate.position}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground justify-center sm:justify-start">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{candidate.email}</span>
                {candidate.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{candidate.phone}</span>}
                {candidate.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.location}</span>}
              </div>
            </div>
            <Badge variant={candidate.stage === 'hired' ? 'success' : candidate.stage === 'rejected' ? 'destructive' : 'info'} className="text-sm px-4 py-1.5">
              {STAGE_LABELS[candidate.stage]}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4 justify-center sm:justify-start">
            {candidate.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'experience', label: 'Experience' },
          { value: 'education', label: 'Education' },
          { value: 'notes', label: 'Notes' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabPanel value="overview" activeTab={activeTab}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Experience</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {candidate.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(exp.startDate, 'short')} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate, 'short') : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
                  <Separator className="mt-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Education</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {candidate.education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-medium">{edu.degree} in {edu.field}</p>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(edu.startDate, 'short')} - {edu.endDate ? formatDate(edu.endDate, 'short') : 'Present'}
                  </p>
                  <Separator className="mt-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabPanel>

      <TabPanel value="experience" activeTab={activeTab}>
        <Card>
          <CardContent className="p-6 space-y-6">
            {candidate.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(exp.startDate, 'short')} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate, 'short') : ''}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="education" activeTab={activeTab}>
        <Card>
          <CardContent className="p-6 space-y-6">
            {candidate.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(edu.startDate, 'short')} - {edu.endDate ? formatDate(edu.endDate, 'short') : 'Present'}
                </p>
                {edu.gpa && <p className="text-sm mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="notes" activeTab={activeTab}>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{candidate.notes || 'No notes added yet.'}</p>
          </CardContent>
        </Card>
      </TabPanel>
    </div>
  )
}
