import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ResumeScore } from '@/types'

interface ResumeScoreProps {
  score: ResumeScore | null
  isLoading: boolean
}

function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="88" height="88" className="transform -rotate-90">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{value}%</span>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  )
}

export function ResumeScoreCard({ score, isLoading }: ResumeScoreProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Resume Score</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!score) {
    return (
      <Card>
        <CardHeader><CardTitle>Resume Score</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Upload a resume to see the AI-powered score</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Resume Score</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <ScoreRing value={score.overall} label="Overall" color="#818cf8" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ScoreRing value={score.skills} label="Skills" color="#34d399" />
          <ScoreRing value={score.experience} label="Experience" color="#fbbf24" />
          <ScoreRing value={score.education} label="Education" color="#60a5fa" />
          <ScoreRing value={score.achievements} label="Achievements" color="#f472b6" />
        </div>
        {score.recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recommendations</p>
            <ul className="space-y-1">
              {score.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
