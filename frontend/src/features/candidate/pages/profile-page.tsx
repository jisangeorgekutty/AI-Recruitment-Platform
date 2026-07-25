import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { Plus, X, Link2, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

import { AvatarUpload } from '@/components/ui/avatar-upload'

export default function CandidateProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'])
  const [newSkill, setNewSkill] = useState('')
  const [languages, setLanguages] = useState(['English (Native)', 'Spanish (Professional)'])
  const [newLanguage, setNewLanguage] = useState('')

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()])
      setNewLanguage('')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="My Profile" description="Manage your personal and professional information" />

      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <AvatarUpload
              name="John Doe"
              currentSrc={avatarUrl}
              size="xl"
              onImageChange={(uri) => setAvatarUrl(uri)}
            />
            <div className="flex-1 sm:pb-2">
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-sm text-muted-foreground">Senior Frontend Engineer</p>
            </div>
            <Button onClick={() => toast.success('Profile updated')}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        tabs={[
          { value: 'personal', label: 'Personal Info' },
          { value: 'experience', label: 'Experience' },
          { value: 'education', label: 'Education' },
          { value: 'skills', label: 'Skills' },
          { value: 'social', label: 'Social Links' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabPanel value="personal" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your contact details</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="firstName" label="First Name" defaultValue="John" />
              <Input id="lastName" label="Last Name" defaultValue="Doe" />
              <Input id="email" label="Email" defaultValue="john.doe@email.com" type="email" />
              <Input id="phone" label="Phone" defaultValue="+1 (555) 123-4567" />
              <Input id="location" label="Location" defaultValue="San Francisco, CA" />
              <Input id="title" label="Current Title" defaultValue="Senior Frontend Engineer" />
            </div>
            <Textarea id="bio" label="Professional Summary" defaultValue="Experienced frontend engineer with 8+ years building scalable web applications..." rows={4} />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="skills" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Skills & Languages</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Skills</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button onClick={() => setSkills(skills.filter((s) => s !== skill))} className="ml-1 rounded-full p-0.5 hover:bg-muted"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <Button variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">Languages</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="gap-1 pr-1">
                    {lang}
                    <button
                      onClick={() => setLanguages(languages.filter((l) => l !== lang))}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a language (e.g. French - Native)..."
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                />
                <Button variant="outline" onClick={addLanguage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="social" activeTab={activeTab}>
        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="github" label="GitHub" placeholder="https://github.com/username" defaultValue="https://github.com/johndoe" />
            <Input id="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/username" defaultValue="https://linkedin.com/in/johndoe" />
            <Input id="portfolio" label="Portfolio" placeholder="https://yourportfolio.com" defaultValue="https://johndoe.dev" />
            <Input id="website" label="Website" placeholder="https://yourwebsite.com" />
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="experience" activeTab={activeTab}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Work Experience</CardTitle>
            <Button size="sm" variant="outline"><Plus className="mr-2 h-4 w-4" />Add</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { company: 'Tech Corp', role: 'Senior Frontend Engineer', period: '2022 - Present', desc: 'Leading frontend architecture for the main product.' },
              { company: 'Startup Inc', role: 'Frontend Developer', period: '2019 - 2022', desc: 'Built and shipped multiple customer-facing features.' },
            ].map((exp) => (
              <div key={exp.company}>
                <div className="flex justify-between">
                  <div><p className="font-medium">{exp.role}</p><p className="text-sm text-muted-foreground">{exp.company}</p></div>
                  <span className="text-xs text-muted-foreground">{exp.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{exp.desc}</p>
                <Separator className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value="education" activeTab={activeTab}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button size="sm" variant="outline"><Plus className="mr-2 h-4 w-4" />Add</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { school: 'UC Berkeley', degree: 'B.S. Computer Science', period: '2015 - 2019' },
            ].map((edu) => (
              <div key={edu.school}>
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.school}</p>
                <p className="text-xs text-muted-foreground">{edu.period}</p>
                <Separator className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabPanel>
    </motion.div>
  )
}
