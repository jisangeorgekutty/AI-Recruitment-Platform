import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { User, Briefcase, DollarSign, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Code2, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import { candidateService } from '@/services/candidate.service'
import { useAuthStore } from '@/store/auth-store'

export default function CandidateOnboardingPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('mid')
  const [targetRole, setTargetRole] = useState('')
  const [expectedSalaryMin, setExpectedSalaryMin] = useState('')
  const [expectedSalaryMax, setExpectedSalaryMax] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [skillsList, setSkillsList] = useState<string[]>([])

  const handleAddSkill = () => {
    if (skillsInput.trim() && !skillsList.includes(skillsInput.trim())) {
      setSkillsList([...skillsList, skillsInput.trim()])
      setSkillsInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill))
  }

  const handleComplete = async () => {
    try {
      setIsSubmitting(true)

      const expYears = experienceLevel === 'entry' ? 1 : experienceLevel === 'senior' ? 7 : experienceLevel === 'lead' ? 10 : 4

      // 1. Save Candidate Personal Profile Info to MySQL database
      await candidateService.updatePersonalInfo({
        currentTitle: headline || targetRole || 'Software Professional',
        targetRole: targetRole || undefined,
        experienceLevel: experienceLevel || undefined,
        expectedSalaryMin: expectedSalaryMin ? parseFloat(expectedSalaryMin) : undefined,
        expectedSalaryMax: expectedSalaryMax ? parseFloat(expectedSalaryMax) : undefined,
        summary: bio || undefined,
        yearsOfExperience: expYears,
      })

      // 2. Save Candidate Skills to MySQL database
      for (const skill of skillsList) {
        if (skill.trim()) {
          await candidateService.addSkill({ name: skill.trim(), proficiency: 'Intermediate' }).catch(() => {})
        }
      }

      // 3. Mark Onboarding Completed flag on ApplicationUser in MySQL
      const updatedUser = await authService.completeOnboarding()
      setUser(updatedUser)

      toast.success('Welcome aboard! Your candidate profile is ready.')
      navigate('/candidate/dashboard', { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to complete onboarding.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-6">
        
        {/* Progress Bar & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Candidate Welcome Wizard
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Let's set up your profile</h1>
          <p className="text-sm text-muted-foreground">Complete these quick steps so our AI can match you with high-paying opportunities</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6">
          {[
            { num: 1, label: 'Profile & Bio' },
            { num: 2, label: 'Role & Salary' },
            { num: 3, label: 'Skills & Finish' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step >= s.num
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground border'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <Card className="shadow-lg border overflow-hidden">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> Personal Headline & Bio
                    </CardTitle>
                    <CardDescription>Tell recruiters who you are and what you do</CardDescription>
                  </CardHeader>

                  <Input
                    id="headline"
                    label="Professional Headline"
                    placeholder="e.g. Senior Full Stack Engineer | React & .NET Specialist"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />

                  <Select
                    id="experienceLevel"
                    label="Experience Level"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    options={[
                      { value: 'entry', label: 'Entry Level (0-2 yrs)' },
                      { value: 'mid', label: 'Mid Level (3-5 yrs)' },
                      { value: 'senior', label: 'Senior Level (6-9 yrs)' },
                      { value: 'lead', label: 'Lead / Principal / Executive (10+ yrs)' },
                    ]}
                  />

                  <Textarea
                    id="bio"
                    label="Short Professional Bio"
                    placeholder="A brief summary of your expertise, career highlights, and passion..."
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" /> Target Role & Salary Expectations
                    </CardTitle>
                    <CardDescription>Specify the roles you are aiming for and your salary expectations</CardDescription>
                  </CardHeader>

                  <Input
                    id="targetRole"
                    label="Target Job Title / Role"
                    placeholder="e.g. Frontend Engineer, Product Manager, DevOps Specialist"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      id="expectedSalaryMin"
                      label="Minimum Expected Salary ($/yr)"
                      type="number"
                      placeholder="e.g. 80000"
                      value={expectedSalaryMin}
                      onChange={(e) => setExpectedSalaryMin(e.target.value)}
                    />
                    <Input
                      id="expectedSalaryMax"
                      label="Maximum Target Salary ($/yr)"
                      type="number"
                      placeholder="e.g. 130000"
                      value={expectedSalaryMax}
                      onChange={(e) => setExpectedSalaryMax(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" /> Key Skills & Final Confirmation
                    </CardTitle>
                    <CardDescription>Add tags for technologies and competencies you excel at</CardDescription>
                  </CardHeader>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Top Skills</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add skill (e.g. Python, SQL, AWS)"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <Button type="button" variant="outline" onClick={handleAddSkill}>Add</Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {skillsList.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-destructive text-primary/70 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4 space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Ready to Launch!
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clicking <strong>Complete Setup</strong> will finalize your candidate profile and redirect you to your personalized job portal.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              {step > 1 ? (
                <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button size="sm" onClick={() => setStep(step + 1)}>
                  Next Step <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleComplete} disabled={isSubmitting}>
                  {isSubmitting ? 'Completing...' : 'Complete Setup & Launch'}
                  <CheckCircle2 className="ml-1.5 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
