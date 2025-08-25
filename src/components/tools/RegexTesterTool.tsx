import { useState, useEffect } from 'react'
import { ToolWrapper } from '@/components/ToolWrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, AlertTriangle, BookOpen } from '@phosphor-icons/react'

interface Match {
  match: string
  index: number
  groups?: string[]
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [isValidRegex, setIsValidRegex] = useState(true)
  const [error, setError] = useState('')
  const [selectedExample, setSelectedExample] = useState('')

  const examples = [
    {
      name: 'Email Validation',
      pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      flags: 'g',
      testString: 'Contact us at john@example.com or support@company.org for help.',
      description: 'Matches email addresses'
    },
    {
      name: 'Phone Numbers (US)',
      pattern: '\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}',
      flags: 'g',
      testString: 'Call (555) 123-4567 or 555-987-6543 or 5551234567',
      description: 'Matches US phone numbers in various formats'
    },
    {
      name: 'URLs',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      flags: 'g',
      testString: 'Visit https://www.example.com or http://google.com for more info.',
      description: 'Matches HTTP and HTTPS URLs'
    },
    {
      name: 'HTML Tags',
      pattern: '<\\/?[a-z][a-z0-9]*[^<>]*>',
      flags: 'gi',
      testString: '<div class="container"><p>Hello <strong>world</strong>!</p></div>',
      description: 'Matches HTML tags'
    },
    {
      name: 'Hexadecimal Colors',
      pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
      flags: 'g',
      testString: 'Colors: #fff, #000000, #ff5733, and #RGB are used in CSS.',
      description: 'Matches hex color codes'
    },
    {
      name: 'IPv4 Addresses',
      pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      flags: 'g',
      testString: 'Server IPs: 192.168.1.1, 10.0.0.1, 255.255.255.255, and 999.999.999.999 (invalid)',
      description: 'Matches valid IPv4 addresses'
    },
    {
      name: 'Credit Card Numbers',
      pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b',
      flags: 'g',
      testString: 'Cards: 4532-1234-5678-9012, 4532 1234 5678 9012, 4532123456789012',
      description: 'Matches credit card number patterns'
    },
    {
      name: 'Date (MM/DD/YYYY)',
      pattern: '\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12][0-9]|3[01])\\/(19|20)\\d\\d\\b',
      flags: 'g',
      testString: 'Dates: 01/15/2023, 12/31/1999, 2/29/2024, 13/40/2023 (invalid)',
      description: 'Matches dates in MM/DD/YYYY format'
    }
  ]

  const flagOptions = [
    { value: 'g', label: 'g (global)', description: 'Find all matches' },
    { value: 'i', label: 'i (ignore case)', description: 'Case-insensitive matching' },
    { value: 'm', label: 'm (multiline)', description: '^$ match line breaks' },
    { value: 's', label: 's (dotall)', description: '. matches newlines' },
    { value: 'u', label: 'u (unicode)', description: 'Full unicode support' },
    { value: 'y', label: 'y (sticky)', description: 'Match from lastIndex' }
  ]

  const testRegex = () => {
    if (!pattern || !testString) {
      setMatches([])
      setIsValidRegex(true)
      setError('')
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const foundMatches: Match[] = []
      let match

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.length > 1 ? Array.from(match).slice(1) : undefined
          })
          
          // Prevent infinite loop on empty matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
        }
      } else {
        match = regex.exec(testString)
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.length > 1 ? Array.from(match).slice(1) : undefined
          })
        }
      }

      setMatches(foundMatches)
      setIsValidRegex(true)
      setError('')
    } catch (err) {
      setMatches([])
      setIsValidRegex(false)
      setError(err instanceof Error ? err.message : 'Invalid regular expression')
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      testRegex()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [pattern, flags, testString])

  const applyExample = (example: typeof examples[0]) => {
    setPattern(example.pattern)
    setFlags(example.flags)
    setTestString(example.testString)
    setSelectedExample(example.name)
  }

  const highlightMatches = (text: string, matches: Match[]): React.ReactNode => {
    if (matches.length === 0) return text

    const elements: React.ReactNode[] = []
    let lastIndex = 0

    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index))
      }

      // Add highlighted match
      elements.push(
        <mark
          key={i}
          className="bg-accent text-accent-foreground px-1 rounded"
          title={`Match ${i + 1}: "${match.match}"`}
        >
          {match.match}
        </mark>
      )

      lastIndex = match.index + match.match.length
    })

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex))
    }

    return <>{elements}</>
  }

  return (
    <ToolWrapper title="Regular Expression Tester">
      <div className="space-y-6">
        {/* Examples */}
        <div className="space-y-2">
          <Label>Quick Examples</Label>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <Button
                key={index}
                size="sm"
                variant={selectedExample === example.name ? "default" : "outline"}
                onClick={() => applyExample(example)}
                className="text-xs"
              >
                {example.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pattern Input */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="pattern">Regular Expression Pattern</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <Input
                id="pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter your regex pattern..."
                className={`font-mono ${isValidRegex ? '' : 'border-red-500'}`}
              />
              <span className="text-muted-foreground">/</span>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="flags"
                className="w-20 font-mono"
                maxLength={6}
              />
            </div>
            {!isValidRegex && (
              <div className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
          </div>

          {/* Flag Help */}
          <div className="text-sm text-muted-foreground">
            <strong>Flags:</strong> {flagOptions.map(flag => `${flag.label} - ${flag.description}`).join(' • ')}
          </div>

          {/* Test String */}
          <div className="grid gap-2">
            <Label htmlFor="test-string">Test String</Label>
            <Textarea
              id="test-string"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test your regex against..."
              rows={4}
              className="font-mono text-sm"
            />
          </div>
        </div>

        {/* Results */}
        {pattern && testString && (
          <div className="space-y-4">
            <Separator />
            
            {/* Match Summary */}
            <div className="flex items-center gap-4">
              {isValidRegex ? (
                <Badge variant={matches.length > 0 ? "secondary" : "outline"} className={matches.length > 0 ? "text-green-600 bg-green-50" : ""}>
                  {matches.length > 0 ? (
                    <>
                      <CheckCircle size={14} className="mr-1" />
                      {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                    </>
                  ) : (
                    'No matches found'
                  )}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangle size={14} className="mr-1" />
                  Invalid regex
                </Badge>
              )}
            </div>

            {/* Highlighted Text */}
            {isValidRegex && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test String with Matches Highlighted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm p-3 bg-muted rounded-md whitespace-pre-wrap leading-relaxed">
                    {highlightMatches(testString, matches)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Match Details */}
            {matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Match Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matches.map((match, index) => (
                      <div key={index} className="border rounded-md p-3 bg-muted">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Match {index + 1}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Position {match.index}
                          </Badge>
                        </div>
                        <div className="font-mono text-sm">
                          <strong>Text:</strong> "{match.match}"
                        </div>
                        {match.groups && match.groups.length > 0 && (
                          <div className="font-mono text-sm mt-2">
                            <strong>Capture Groups:</strong>
                            <ul className="ml-4 mt-1">
                              {match.groups.map((group, groupIndex) => (
                                <li key={groupIndex} className="text-muted-foreground">
                                  Group {groupIndex + 1}: "{group}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <div className="flex items-start gap-2">
            <BookOpen size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              <strong>Quick Reference:</strong> Use \d for digits, \w for word characters, \s for whitespace, 
              + for one or more, * for zero or more, ? for optional, {"{n,m}"} for quantity ranges, 
              [abc] for character classes, (group) for capture groups, and (?:group) for non-capturing groups.
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  )
}