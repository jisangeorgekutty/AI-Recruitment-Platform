import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/empty-state'
import { Users, Plus, Mail, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin' as const },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'recruiter' as const },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'interviewer' as const },
]

export default function CompanyPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Company"
        description="Manage your company profile and team"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Update your company information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="companyName" label="Company Name" defaultValue="Acme Corp" placeholder="Company name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="website" label="Website" defaultValue="https://acme.com" placeholder="https://" />
              <Select
                id="industry"
                label="Industry"
                options={[
                  { value: '', label: 'Select industry' },
                  { value: 'technology', label: 'Technology' },
                  { value: 'healthcare', label: 'Healthcare' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'education', label: 'Education' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                id="size"
                label="Company Size"
                options={[
                  { value: '1-10', label: '1-10 employees' },
                  { value: '11-50', label: '11-50 employees' },
                  { value: '51-200', label: '51-200 employees' },
                  { value: '201-1000', label: '201-1000 employees' },
                  { value: '1000+', label: '1000+ employees' },
                ]}
              />
            </div>
            <Textarea id="description" label="Description" placeholder="Tell us about your company..." rows={4} />
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Company profile updated')}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar name={member.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
