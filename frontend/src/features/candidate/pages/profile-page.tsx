import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabPanel } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { Plus, X, Trash2, FileText, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { candidateService } from '@/services/candidate.service'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ErrorState } from '@/components/error-state'

export default function CandidateProfilePage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('personal')

  // Personal Info Form State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [expectedSalaryMin, setExpectedSalaryMin] = useState<string>('')
  const [expectedSalaryMax, setExpectedSalaryMax] = useState<string>('')
  const [location, setLocation] = useState('')
  const [summary, setSummary] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState(0)

  // Social Links State
  const [gitHubUrl, setGitHubUrl] = useState('')
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  // Skills & Languages Inputs
  const [newSkill, setNewSkill] = useState('')
  const [newLanguage, setNewLanguage] = useState('')

  // Experience Form State
  const [showExpForm, setShowExpForm] = useState(false)
  const [expTitle, setExpTitle] = useState('')
  const [expCompany, setExpCompany] = useState('')
  const [expLocation, setExpLocation] = useState('')
  const [expStartDate, setExpStartDate] = useState('')
  const [expEndDate, setExpEndDate] = useState('')
  const [expIsCurrent, setExpIsCurrent] = useState(false)
  const [expDescription, setExpDescription] = useState('')

  // Education Form State
  const [showEduForm, setShowEduForm] = useState(false)
  const [eduInstitution, setEduInstitution] = useState('')
  const [eduDegree, setEduDegree] = useState('')
  const [eduFieldOfStudy, setEduFieldOfStudy] = useState('')
  const [eduStartDate, setEduStartDate] = useState('')
  const [eduEndDate, setEduEndDate] = useState('')
  const [eduIsCurrent, setEduIsCurrent] = useState(false)
  const [eduGrade, setEduGrade] = useState('')
  const [eduDescription, setEduDescription] = useState('')

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['candidate-my-profile'],
    queryFn: candidateService.getMyProfile,
  })

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setPhone(profile.phone || '')
      setCurrentTitle(profile.currentTitle || '')
      setTargetRole(profile.targetRole || '')
      setExperienceLevel(profile.experienceLevel || '')
      setExpectedSalaryMin(profile.expectedSalaryMin ? profile.expectedSalaryMin.toString() : '')
      setExpectedSalaryMax(profile.expectedSalaryMax ? profile.expectedSalaryMax.toString() : '')
      setLocation(profile.location || '')
      setSummary(profile.summary || '')
      setYearsOfExperience(profile.yearsOfExperience || 0)

      setGitHubUrl(profile.socialLinks?.gitHubUrl || '')
      setLinkedInUrl(profile.socialLinks?.linkedInUrl || '')
      setPortfolioUrl(profile.socialLinks?.portfolioUrl || '')
      setWebsiteUrl(profile.socialLinks?.websiteUrl || '')
    }
  }, [profile])

  // Mutations
  const updatePersonalInfoMutation = useMutation({
    mutationFn: candidateService.updatePersonalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      toast.success('Personal information saved!')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to save personal info.'),
  })

  const updateSocialLinksMutation = useMutation({
    mutationFn: candidateService.updateSocialLinks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      toast.success('Social links saved!')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to save social links.'),
  })

  const addSkillMutation = useMutation({
    mutationFn: candidateService.addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      setNewSkill('')
      toast.success('Skill added!')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to add skill.'),
  })

  const deleteSkillMutation = useMutation({
    mutationFn: candidateService.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      toast.success('Skill removed!')
    },
  })

  const addLanguageMutation = useMutation({
    mutationFn: candidateService.addLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      setNewLanguage('')
      toast.success('Language added!')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to add language.'),
  })

  const deleteLanguageMutation = useMutation({
    mutationFn: candidateService.deleteLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      toast.success('Language removed!')
    },
  })

  const addExperienceMutation = useMutation({
    mutationFn: candidateService.addExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      setShowExpForm(false)
      setExpTitle('')
      setExpCompany('')
      setExpLocation('')
      setExpStartDate('')
      setExpEndDate('')
      setExpIsCurrent(false)
      setExpDescription('')
      toast.success('Experience added!')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to add experience.'),
  })

  const deleteExperienceMutation = useMutation({
    mutationFn: candidateService.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      toast.success('Experience deleted!')
    },
  })

  const addEducationMutation = useMutation({
    mutationFn: candidateService.addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      setShowEduForm(false)
      setEduInstitution('')
      setEduDegree('')
      setEduFieldOfStudy('')
      setEduStartDate('')
      setEduEndDate('')
      setEduIsCurrent(false)
      setEduGrade('')
      setEduDescription('')
      toast.success('Education added!')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to add education.'),
  })

  const deleteEducationMutation = useMutation({
    mutationFn: candidateService.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
      toast.success('Education deleted!')
    },
  })

  const handleAvatarFileSelect = async (file: File) => {
    try {
      const res = await candidateService.uploadAvatar(file)
      if (res) {
        queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
        toast.success('Avatar updated successfully!')
      } else {
        toast.error('Failed to upload avatar.')
      }
    } catch (err: unknown) {
      const resData = (err as { response?: { data?: { message?: string; title?: string } } })?.response?.data
      const msg = resData?.message || resData?.title || (err as Error)?.message || 'Failed to upload avatar.'
      toast.error(msg)
    }
  }

  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await candidateService.uploadResume(file)
      if (res) {
        queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })
        toast.success('Resume uploaded successfully!')
      } else {
        toast.error('Failed to upload resume.')
      }
    } catch (err: unknown) {
      const resData = (err as { response?: { data?: { message?: string; title?: string } } })?.response?.data
      const msg = resData?.message || resData?.title || (err as Error)?.message || 'Failed to upload resume.'
      toast.error(msg)
    }
  }

  if (isLoading) return <LoadingSkeleton type="detail" />
  if (error || !profile) return <ErrorState onRetry={() => queryClient.invalidateQueries({ queryKey: ['candidate-my-profile'] })} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="My Profile" description="Manage your personal and professional profile details" />

      {/* Header Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <AvatarUpload
              name={profile.fullName || `${profile.firstName} ${profile.lastName}`}
              currentSrc={profile.avatarUrl}
              size="xl"
              onImageChange={(_uri, file) => handleAvatarFileSelect(file)}
            />
            <div className="flex-1 sm:pb-2">
              <h2 className="text-xl font-bold">{profile.fullName || `${profile.firstName} ${profile.lastName}`}</h2>
              <p className="text-sm text-muted-foreground">{profile.currentTitle || 'No title set'}</p>
            </div>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg"
              >
                <FileText className="h-4 w-4" />
                View Resume
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs
        tabs={[
          { value: 'personal', label: 'Personal Info' },
          { value: 'experience', label: 'Experience' },
          { value: 'education', label: 'Education' },
          { value: 'skills', label: 'Skills & Languages' },
          { value: 'social', label: 'Social Links' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 1. Personal Info Tab */}
      <TabPanel value="personal" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your contact details and professional summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="firstName" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input id="lastName" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <Input id="email" label="Email" value={profile.email} disabled />
              <Input id="phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
              <Input id="title" label="Current Title" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" />
              <Input id="targetRole" label="Target Role / Job Title" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Full Stack Engineer" />
              
              <Select
                id="experienceLevel"
                label="Experience Level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                options={[
                  { value: '', label: 'Select Experience Level' },
                  { value: 'entry', label: 'Entry Level (0-2 yrs)' },
                  { value: 'mid', label: 'Mid Level (3-5 yrs)' },
                  { value: 'senior', label: 'Senior Level (6-9 yrs)' },
                  { value: 'lead', label: 'Lead / Principal / Executive (10+ yrs)' },
                ]}
              />
              <Input id="yearsOfExperience" label="Years of Experience" type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(Number(e.target.value))} />
              <Input id="expectedSalaryMin" label="Minimum Expected Salary ($/yr)" type="number" value={expectedSalaryMin} onChange={(e) => setExpectedSalaryMin(e.target.value)} placeholder="e.g. 80000" />
              <Input id="expectedSalaryMax" label="Maximum Target Salary ($/yr)" type="number" value={expectedSalaryMax} onChange={(e) => setExpectedSalaryMax(e.target.value)} placeholder="e.g. 130000" />
              <Input id="location" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New York, NY" />
            </div>

            <Textarea
              id="summary"
              label="Professional Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of your background and achievements..."
              rows={4}
            />

            <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Resume Document</label>
                <div className="flex flex-wrap items-center gap-3">
                  {profile.resumeUrl ? (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/30 bg-primary/5 text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-all"
                    >
                      <FileText className="h-4 w-4" />
                      View Uploaded Resume
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No resume uploaded yet</span>
                  )}

                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-accent transition-all">
                    <Upload className="h-4 w-4" />
                    {profile.resumeUrl ? 'Update Resume' : 'Upload Resume'}
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileSelect} className="hidden" />
                  </label>
                </div>
              </div>

              <Button
                loading={updatePersonalInfoMutation.isPending}
                onClick={() =>
                  updatePersonalInfoMutation.mutate({
                    firstName,
                    lastName,
                    phone,
                    currentTitle,
                    targetRole: targetRole || undefined,
                    experienceLevel: experienceLevel || undefined,
                    expectedSalaryMin: expectedSalaryMin ? parseFloat(expectedSalaryMin) : undefined,
                    expectedSalaryMax: expectedSalaryMax ? parseFloat(expectedSalaryMax) : undefined,
                    location,
                    summary,
                    yearsOfExperience,
                  })
                }
              >
                Save Personal Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* 2. Experience Tab */}
      <TabPanel value="experience" activeTab={activeTab}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Manage your employment history</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowExpForm(!showExpForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {showExpForm && (
              <div className="p-4 border rounded-xl bg-muted/30 space-y-4 mb-6">
                <h4 className="font-semibold text-sm">Add New Experience</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Job Title" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="Software Engineer" />
                  <Input label="Company" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Acme Inc" />
                  <Input label="Location" value={expLocation} onChange={(e) => setExpLocation(e.target.value)} placeholder="San Francisco, CA" />
                  <Input label="Start Date" type="date" value={expStartDate} onChange={(e) => setExpStartDate(e.target.value)} />
                  <Input label="End Date" type="date" value={expEndDate} onChange={(e) => setExpEndDate(e.target.value)} disabled={expIsCurrent} />
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="expCurrent" checked={expIsCurrent} onChange={(e) => setExpIsCurrent(e.target.checked)} />
                    <label htmlFor="expCurrent" className="text-sm font-medium">Currently work here</label>
                  </div>
                </div>
                <Textarea label="Description" value={expDescription} onChange={(e) => setExpDescription(e.target.value)} rows={3} />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowExpForm(false)}>Cancel</Button>
                  <Button
                    loading={addExperienceMutation.isPending}
                    onClick={() =>
                      addExperienceMutation.mutate({
                        title: expTitle,
                        company: expCompany,
                        location: expLocation,
                        startDate: expStartDate || new Date().toISOString(),
                        endDate: expIsCurrent ? undefined : expEndDate || undefined,
                        isCurrent: expIsCurrent,
                        description: expDescription,
                      })
                    }
                  >
                    Save Experience
                  </Button>
                </div>
              </div>
            )}

            {profile.experiences.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No experience entries added yet.</p>
            ) : (
              profile.experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{exp.title}</p>
                      <p className="text-sm text-muted-foreground">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} -{' '}
                        {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                      </span>
                      <button
                        onClick={() => deleteExperienceMutation.mutate(exp.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {exp.description && <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{exp.description}</p>}
                  <Separator className="mt-4" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* 3. Education Tab */}
      <TabPanel value="education" activeTab={activeTab}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>Manage your academic degrees and background</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowEduForm(!showEduForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {showEduForm && (
              <div className="p-4 border rounded-xl bg-muted/30 space-y-4 mb-6">
                <h4 className="font-semibold text-sm">Add New Education</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Institution / School" value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} placeholder="Stanford University" />
                  <Input label="Degree" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="Bachelor of Science" />
                  <Input label="Field of Study" value={eduFieldOfStudy} onChange={(e) => setEduFieldOfStudy(e.target.value)} placeholder="Computer Science" />
                  <Input label="Grade / GPA" value={eduGrade} onChange={(e) => setEduGrade(e.target.value)} placeholder="3.8 / 4.0" />
                  <Input label="Start Date" type="date" value={eduStartDate} onChange={(e) => setEduStartDate(e.target.value)} />
                  <Input label="End Date" type="date" value={eduEndDate} onChange={(e) => setEduEndDate(e.target.value)} disabled={eduIsCurrent} />
                </div>
                <Textarea label="Description" value={eduDescription} onChange={(e) => setEduDescription(e.target.value)} rows={2} />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowEduForm(false)}>Cancel</Button>
                  <Button
                    loading={addEducationMutation.isPending}
                    onClick={() =>
                      addEducationMutation.mutate({
                        institution: eduInstitution,
                        degree: eduDegree,
                        fieldOfStudy: eduFieldOfStudy,
                        startDate: eduStartDate || new Date().toISOString(),
                        endDate: eduIsCurrent ? undefined : eduEndDate || undefined,
                        isCurrent: eduIsCurrent,
                        grade: eduGrade,
                        description: eduDescription,
                      })
                    }
                  >
                    Save Education
                  </Button>
                </div>
              </div>
            )}

            {profile.educations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No education entries added yet.</p>
            ) : (
              profile.educations.map((edu) => (
                <div key={edu.id} className="relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</p>
                      <p className="text-sm text-muted-foreground">{edu.institution} {edu.grade ? `• Grade: ${edu.grade}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric' })} -{' '}
                        {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric' }) : ''}
                      </span>
                      <button
                        onClick={() => deleteEducationMutation.mutate(edu.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {edu.description && <p className="mt-2 text-sm text-muted-foreground">{edu.description}</p>}
                  <Separator className="mt-4" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* 4. Skills & Languages Tab */}
      <TabPanel value="skills" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Skills & Languages</CardTitle>
            <CardDescription>Manage key competencies and spoken languages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-semibold mb-3">Technical & Professional Skills</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="gap-1.5 py-1 px-3">
                    {skill.name}
                    <button
                      onClick={() => deleteSkillMutation.mutate(skill.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="Add a skill (e.g. React, C#)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), newSkill.trim() && addSkillMutation.mutate({ name: newSkill.trim() }))}
                />
                <Button
                  variant="outline"
                  loading={addSkillMutation.isPending}
                  onClick={() => newSkill.trim() && addSkillMutation.mutate({ name: newSkill.trim() })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold mb-3">Languages</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.languages.map((lang) => (
                  <Badge key={lang.id} variant="secondary" className="gap-1.5 py-1 px-3">
                    {lang.name}
                    <button
                      onClick={() => deleteLanguageMutation.mutate(lang.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="Add a language (e.g. English - Native)..."
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), newLanguage.trim() && addLanguageMutation.mutate({ name: newLanguage.trim() }))}
                />
                <Button
                  variant="outline"
                  loading={addLanguageMutation.isPending}
                  onClick={() => newLanguage.trim() && addLanguageMutation.mutate({ name: newLanguage.trim() })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* 5. Social Links Tab */}
      <TabPanel value="social" activeTab={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>Social & Web Links</CardTitle>
            <CardDescription>Add links to your external portfolios and social profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="github" label="GitHub URL" placeholder="https://github.com/username" value={gitHubUrl} onChange={(e) => setGitHubUrl(e.target.value)} />
            <Input id="linkedin" label="LinkedIn URL" placeholder="https://linkedin.com/in/username" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} />
            <Input id="portfolio" label="Portfolio URL" placeholder="https://yourportfolio.com" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
            <Input id="website" label="Website URL" placeholder="https://yourwebsite.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />

            <div className="pt-2 flex justify-end">
              <Button
                loading={updateSocialLinksMutation.isPending}
                onClick={() =>
                  updateSocialLinksMutation.mutate({
                    gitHubUrl,
                    linkedInUrl,
                    portfolioUrl,
                    websiteUrl,
                  })
                }
              >
                Save Social Links
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabPanel>
    </motion.div>
  )
}
