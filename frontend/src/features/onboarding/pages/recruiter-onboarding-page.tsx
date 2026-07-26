import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Building2, Upload, Globe, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, MapPin, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import { companyService } from '@/services/company.service'
import { useAuthStore } from '@/store/auth-store'
import { useCompanyStore } from '@/store/company-store'

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select Industry' },
  { value: 'technology', label: 'Technology & Software' },
  { value: 'healthcare', label: 'Healthcare & Life Sciences' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'education', label: 'Education & EdTech' },
  { value: 'manufacturing', label: 'Manufacturing & Engineering' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'realestate', label: 'Real Estate & Construction' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'automotive', label: 'Automotive & Transportation' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'legal', label: 'Legal & Professional Services' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'nonprofit', label: 'Non-profit & Government' },
  { value: 'other', label: 'Other Industry' },
]

export default function RecruiterOnboardingPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { setCompany, setLogoUrl: setStoreLogoUrl } = useCompanyStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [companyName, setCompanyName] = useState('Acme Corp')
  const [website, setWebsite] = useState('https://acme.com')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [industry, setIndustry] = useState('technology')
  const [size, setSize] = useState('51-200')
  const [location, setLocation] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [description, setDescription] = useState('')

  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setIsUploadingLogo(true)
        const uploadedLogoUrl = await companyService.uploadLogo(file)
        setLogoUrl(uploadedLogoUrl)
        setStoreLogoUrl(uploadedLogoUrl)
        toast.success('Logo uploaded successfully!')
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to upload logo.')
      } finally {
        setIsUploadingLogo(false)
      }
    }
  }

  const handleComplete = async () => {
    if (!companyName.trim()) {
      toast.error('Company Name is required')
      return
    }

    try {
      setIsSubmitting(true)

      // Save company profile
      const savedCompany = await companyService.updateProfile({
        companyName,
        website,
        companyLogoUrl: logoUrl,
        industry,
        companySize: size,
        location,
        contactEmail,
        description,
      }).catch(() => null)

      if (savedCompany) {
        setCompany(savedCompany)
      }

      // Complete onboarding
      const updatedUser = await authService.completeOnboarding()
      setUser(updatedUser)

      toast.success('Organization setup completed!')
      navigate('/recruiter/dashboard', { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to complete recruiter onboarding.')
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
            <Sparkles className="h-3.5 w-3.5" /> Employer Setup Wizard
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Set up your company workspace</h1>
          <p className="text-sm text-muted-foreground">Add your company branding and details to start posting jobs and hiring top talent</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6">
          {[
            { num: 1, label: 'Company & Logo' },
            { num: 2, label: 'Industry & Size' },
            { num: 3, label: 'Location & Description' },
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
                      <Building2 className="h-5 w-5 text-primary" /> Company Name & Logo
                    </CardTitle>
                    <CardDescription>Enter your official company branding visible to applicants</CardDescription>
                  </CardHeader>

                  <Input
                    id="companyName"
                    label="Company Name"
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />

                  <Input
                    id="website"
                    label="Company Website"
                    placeholder="https://acme.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />

                  <div className="flex flex-col items-center justify-center pt-2">
                    <label className="text-xs font-semibold text-foreground mb-2 self-start">Company Logo (Optional)</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 hover:border-primary transition-colors overflow-hidden"
                    >
                      {isUploadingLogo ? (
                        <div className="flex flex-col items-center space-y-1 text-primary animate-pulse">
                          <Upload className="h-6 w-6 animate-bounce" />
                          <span className="text-[10px]">Uploading...</span>
                        </div>
                      ) : logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center space-y-1 text-muted-foreground">
                          <Upload className="h-6 w-6" />
                          <span className="text-[10px]">Upload Logo</span>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
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
                      <Globe className="h-5 w-5 text-primary" /> Industry & Organization Size
                    </CardTitle>
                    <CardDescription>Categorize your business type and team scale</CardDescription>
                  </CardHeader>

                  <Select
                    id="industry"
                    label="Industry Category"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    options={INDUSTRY_OPTIONS}
                  />

                  <Select
                    id="size"
                    label="Company Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    options={[
                      { value: '1-10', label: '1-10 employees' },
                      { value: '11-50', label: '11-50 employees' },
                      { value: '51-200', label: '51-200 employees' },
                      { value: '201-1000', label: '201-1000 employees' },
                      { value: '1000+', label: '1000+ employees' },
                    ]}
                  />
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
                      <MapPin className="h-5 w-5 text-primary" /> Location & Description
                    </CardTitle>
                    <CardDescription>Tell candidates where you are located and about your company culture</CardDescription>
                  </CardHeader>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      id="location"
                      label="Headquarters Location"
                      placeholder="San Francisco, CA or Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <Input
                      id="contactEmail"
                      label="HR / Contact Email"
                      type="email"
                      placeholder="careers@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>

                  <Textarea
                    id="description"
                    label="Company Description"
                    placeholder="Tell candidates about your company mission and vision..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div className="rounded-xl border bg-muted/30 p-4 space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Ready to Launch Employer Portal!
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clicking <strong>Complete Setup</strong> will finalize your employer profile and redirect you to the recruiter dashboard.
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
