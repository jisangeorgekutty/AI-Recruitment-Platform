import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PageHeader } from '@/components/page-header'
import { Avatar } from '@/components/ui/avatar'
import { Search, MapPin, Heart, Briefcase, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const sampleJobs = [
  { id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$150k - $220k', type: 'Full-time', remote: 'Hybrid', skills: ['React', 'TypeScript', 'GraphQL'], posted: '2 days ago' },
  { id: '2', title: 'Full Stack Developer', company: 'Stripe', location: 'Remote', salary: '$130k - $190k', type: 'Full-time', remote: 'Remote', skills: ['Node.js', 'React', 'PostgreSQL'], posted: '1 week ago' },
  { id: '3', title: 'Product Designer', company: 'Figma', location: 'San Francisco, CA', salary: '$120k - $180k', type: 'Full-time', remote: 'On-site', skills: ['Figma', 'UI/UX', 'Design Systems'], posted: '3 days ago' },
  { id: '4', title: 'Backend Engineer', company: 'Amazon', location: 'Seattle, WA', salary: '$140k - $200k', type: 'Full-time', remote: 'Hybrid', skills: ['Java', 'AWS', 'Microservices'], posted: '5 days ago' },
  { id: '5', title: 'DevOps Engineer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$160k - $240k', type: 'Full-time', remote: 'Remote', skills: ['Kubernetes', 'Terraform', 'CI/CD'], posted: '1 day ago' },
  { id: '6', title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$180k - $300k', type: 'Full-time', remote: 'On-site', skills: ['Python', 'PyTorch', 'NLP'], posted: 'Just now' },
]

export default function CandidateJobSearchPage() {
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const toggleSaved = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    toast.success(saved.has(id) ? 'Removed from saved' : 'Job saved!')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Find Your Next Role" description="Discover opportunities that match your skills" />
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by title, skill, or company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select options={[{ value: '', label: 'All Types' }, { value: 'full-time', label: 'Full-time' }, { value: 'contract', label: 'Contract' }, { value: 'internship', label: 'Internship' }]} className="w-36" />
        <Select options={[{ value: '', label: 'All Locations' }, { value: 'remote', label: 'Remote' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'on-site', label: 'On-site' }]} className="w-36" />
        <Button variant="outline">More Filters</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sampleJobs.map((job) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
            <Card className="cursor-pointer h-full hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Avatar name={job.company} size="lg" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold truncate">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type}</span>
                        <Badge variant="secondary" className="text-[10px]">{job.remote}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.map((skill) => (<Badge key={skill} variant="outline" className="text-[10px]">{skill}</Badge>))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{job.posted}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleSaved(job.id)} className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-accent">
                    <Heart className={cn('h-4 w-4', saved.has(job.id) && 'fill-red-500 text-red-500')} />
                  </button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">Quick Apply</Button>
                  <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
