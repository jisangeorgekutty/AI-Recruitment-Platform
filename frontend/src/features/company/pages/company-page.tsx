import { useState, useRef, useEffect, type ChangeEvent, type DragEvent } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Upload, Building2, Trash2, Globe, CheckCircle2, Users, Plus, MapPin, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { companyService } from '@/services/company.service'
import { useCompanyStore } from '@/store/company-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'


/* 
// Preserved for future team management features:
const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin' as const },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'recruiter' as const },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'interviewer' as const },
]
*/

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

export default function CompanyPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setCompany, updateCompanyState, setLogoUrl: setStoreLogoUrl } = useCompanyStore()

  // Fetch Company Profile from Backend API
  const { data: profile, isLoading } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyService.getProfile,
  })

  // State
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [size, setSize] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [establishedYear, setEstablishedYear] = useState<string>('')
  const [registrationNumber, setRegistrationNumber] = useState('')

  // Sync profile data when loaded from database
  useEffect(() => {
    if (profile) {
      setCompany(profile)
      setCompanyName(profile.companyName || profile.name || '')
      const logo = profile.companyLogoUrl || profile.logo || localStorage.getItem('company_logo') || ''
      setLogoUrl(logo)
      setStoreLogoUrl(logo)
      setWebsite(profile.website || '')
      setIndustry(profile.industry || '')
      setSize(profile.companySize || profile.size || '')
      setDescription(profile.description || '')
      setLocation(profile.location || '')
      setContactEmail(profile.contactEmail || '')
      setContactPhone(profile.contactPhone || '')
      setEstablishedYear(profile.establishedYear ? profile.establishedYear.toString() : '')
      setRegistrationNumber(profile.registrationNumber || '')
    }
  }, [profile, setCompany, setStoreLogoUrl])

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: companyService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['company-profile'], data)
      updateCompanyState(data)
      toast.success('Company profile updated successfully!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update company profile.')
    },
  })

  // Upload Logo Mutation
  const uploadLogoMutation = useMutation({
    mutationFn: companyService.uploadLogo,
    onSuccess: (logoPath) => {
      setLogoUrl(logoPath)
      setStoreLogoUrl(logoPath)
      updateCompanyState({ companyLogoUrl: logoPath })
      queryClient.invalidateQueries({ queryKey: ['company-profile'] })
      toast.success('Company logo uploaded successfully!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to upload logo.')
    },
  })

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, SVG, WEBP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo image size must be less than 5MB.')
      return
    }

    uploadLogoMutation.mutate(file)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoUrl('')
    localStorage.removeItem('company_logo')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    updateProfileMutation.mutate({
      companyName,
      companyLogoUrl: '',
      website,
      industry,
      companySize: size,
      description,
      location,
      contactEmail,
      contactPhone,
      establishedYear: establishedYear ? parseInt(establishedYear, 10) : undefined,
      registrationNumber,
    })
    toast.success('Company logo removed.')
  }

  const handleSaveProfile = () => {
    if (!companyName.trim()) {
      toast.error('Company Name is required.')
      return
    }

    updateProfileMutation.mutate({
      companyName,
      companyLogoUrl: logoUrl,
      website,
      industry,
      companySize: size,
      description,
      location,
      contactEmail,
      contactPhone,
      establishedYear: establishedYear ? parseInt(establishedYear, 10) : undefined,
      registrationNumber,
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Manage your organization details, branding, contact info, and company preferences"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Company Branding & Logo Upload Card */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Company Branding
              </CardTitle>
              <CardDescription>Upload your official company logo for job postings and candidate views</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Logo Preview & Upload Box */}
              <div className="flex flex-col items-center justify-center text-center">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition-all duration-200 ${
                    isDragging
                      ? 'border-primary bg-primary/10 scale-105'
                      : logoUrl
                      ? 'border-border bg-card hover:border-primary/50'
                      : 'border-muted-foreground/30 bg-muted/30 hover:border-primary hover:bg-accent/50'
                  }`}
                >
                  {logoUrl ? (
                    <div className="relative h-full w-full flex items-center justify-center">
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="max-h-full max-w-full object-contain rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white drop-shadow-md" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Building2 className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-foreground">Click to upload logo</p>
                        <p className="text-[10px] text-muted-foreground">or drag & drop here</p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <p className="mt-3 text-xs text-muted-foreground">
                  PNG, JPG, SVG, or WEBP (Max 5MB)
                </p>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadLogoMutation.isPending}
                    className="gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploadLogoMutation.isPending
                      ? 'Uploading...'
                      : logoUrl
                      ? 'Change Logo'
                      : 'Upload Logo'}
                  </Button>

                  {logoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Branding Preview Badge */}
              <div className="rounded-xl border bg-muted/40 p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background border shadow-xs overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                  ) : (
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{companyName || 'Your Company'}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {website ? website.replace(/^https?:\/\//, '') : 'website.com'}
                  </p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Company Details & Contact Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update organization profile, location, contact, and description details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="companyName"
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                />
                <Input
                  id="website"
                  label="Website URL"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://acme.com"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    { value: '', label: 'Select Company Size' },
                    { value: '1-10', label: '1-10 employees' },
                    { value: '11-50', label: '11-50 employees' },
                    { value: '51-200', label: '51-200 employees' },
                    { value: '201-1000', label: '201-1000 employees' },
                    { value: '1000+', label: '1000+ employees' },
                  ]}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="location"
                  label="Headquarters / Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA or Remote"
                />
                <Input
                  id="establishedYear"
                  label="Established Year"
                  type="number"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  placeholder="e.g. 2020"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="contactEmail"
                  label="Contact Email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="hr@company.com"
                />
                <Input
                  id="contactPhone"
                  label="Contact Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <Input
                id="registrationNumber"
                label="Registration Number / Tax ID (Optional)"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. US-123456789"
              />

              <Textarea
                id="description"
                label="Company Description & Culture"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell candidates about your company mission, products, and culture..."
                rows={5}
              />

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending || isLoading}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 
          // Preserved for future team management feature:
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Team Members
                </CardTitle>
                <CardDescription>Manage your company recruitment team</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
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
          */}
        </div>
      </div>
    </motion.div>
  )
}
