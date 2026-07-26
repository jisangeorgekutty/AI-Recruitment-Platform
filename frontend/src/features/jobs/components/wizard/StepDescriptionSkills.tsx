import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useJobStore } from '@/store/job-store'
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle, Code } from 'lucide-react'

export function StepDescriptionSkills() {
  const { wizardDraft, setWizardDraft, setActiveWizardStep } = useJobStore()

  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillExp, setNewSkillExp] = useState(2)
  const [newSkillMandatory, setNewSkillMandatory] = useState(true)

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return
    const updatedSkills = [
      ...wizardDraft.skills,
      {
        skillName: newSkillName.trim(),
        minimumYearsExperience: newSkillExp,
        isMandatory: newSkillMandatory,
        displayOrder: wizardDraft.skills.length + 1,
      },
    ]
    setWizardDraft({ skills: updatedSkills })
    setNewSkillName('')
    setNewSkillExp(2)
    setNewSkillMandatory(true)
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = wizardDraft.skills.filter((_, i) => i !== index)
    setWizardDraft({ skills: updatedSkills })
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wizardDraft.description) return
    setActiveWizardStep(4)
  }

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Role Overview & Required Skill Sets</h3>
        <p className="text-sm text-muted-foreground">Describe duties, responsibilities, and skill requirements for candidate evaluation.</p>
      </div>

      <Textarea
        id="description"
        label="Job Overview & Summary *"
        placeholder="Introduce your team, mission, and what makes this role unique..."
        rows={4}
        value={wizardDraft.description}
        onChange={(e) => setWizardDraft({ description: e.target.value })}
        required
      />

      <Textarea
        id="requirements"
        label="Key Requirements"
        placeholder="e.g. 5+ years React experience, Bachelor degree in CS or equivalent (one item per line)..."
        rows={3}
        value={wizardDraft.requirements}
        onChange={(e) => setWizardDraft({ requirements: e.target.value })}
      />

      <Textarea
        id="responsibilities"
        label="Key Responsibilities"
        placeholder="e.g. Build and scale customer dashboard features, Mentor junior engineers (one item per line)..."
        rows={3}
        value={wizardDraft.responsibilities}
        onChange={(e) => setWizardDraft({ responsibilities: e.target.value })}
      />

      {/* Skill Tags Builder */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Code className="h-4 w-4 text-primary" />
          <span>Skill Tagging & Minimum Experience Requirements</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 items-end">
          <div className="sm:col-span-2">
            <Input
              id="skillName"
              label="Skill Name"
              placeholder="e.g. React, TypeScript, C#, AWS"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="skillExp"
              label="Min Exp (Years)"
              type="number"
              value={newSkillExp}
              onChange={(e) => setNewSkillExp(Number(e.target.value))}
            />
          </div>
          <div>
            <Button type="button" variant="outline" className="w-full" onClick={handleAddSkill}>
              <Plus className="mr-1 h-4 w-4" /> Add Skill
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={newSkillMandatory}
              onChange={(e) => setNewSkillMandatory(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border text-primary"
            />
            Mark added skill as mandatory requirement
          </label>
        </div>

        {wizardDraft.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {wizardDraft.skills.map((skill, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  skill.isMandatory
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground'
                }`}
              >
                <span>{skill.skillName}</span>
                <span className="text-[10px] opacity-75">({skill.minimumYearsExperience}y+)</span>
                {skill.isMandatory && <CheckCircle className="h-3 w-3 text-primary" />}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="hover:text-destructive transition-colors ml-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No skills added yet. Add skill tags above.</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setActiveWizardStep(2)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit" disabled={!wizardDraft.description}>
          Next: Screening Criteria <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
