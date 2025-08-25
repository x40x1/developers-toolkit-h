import { useState, useEffect } from 'react'
import { ToolWrapper } from '@/components/ToolWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Shuffle, Copy, CheckCircle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

export default function PasswordGeneratorTool() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [customSymbols, setCustomSymbols] = useState('!@#$%^&*()_+-=[]{}|;:,.<>?')
  const [generatedPasswords, setGeneratedPasswords] = useKV<string[]>('password-history', [])
  const [copied, setCopied] = useState(false)

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const similarChars = 'il1Lo0O'

  const generatePassword = () => {
    let chars = ''
    
    if (includeUppercase) {
      chars += excludeSimilar ? uppercase.replace(/[OOIL]/g, '') : uppercase
    }
    if (includeLowercase) {
      chars += excludeSimilar ? lowercase.replace(/[oil]/g, '') : lowercase
    }
    if (includeNumbers) {
      chars += excludeSimilar ? numbers.replace(/[10]/g, '') : numbers
    }
    if (includeSymbols) {
      chars += customSymbols
    }

    if (chars.length === 0) {
      toast.error('Please select at least one character type')
      return
    }

    let password = ''
    const passwordLength = length[0]
    
    // Ensure at least one character from each selected type
    const requiredChars = []
    if (includeUppercase) requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)])
    if (includeLowercase) requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)])
    if (includeNumbers) requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)])
    if (includeSymbols) requiredChars.push(customSymbols[Math.floor(Math.random() * customSymbols.length)])

    // Fill the rest randomly
    for (let i = requiredChars.length; i < passwordLength; i++) {
      requiredChars.push(chars[Math.floor(Math.random() * chars.length)])
    }

    // Shuffle the array
    for (let i = requiredChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]]
    }

    password = requiredChars.slice(0, passwordLength).join('')
    setPassword(password)
    
    // Add to history (keep last 10)
    setGeneratedPasswords(prev => [password, ...prev.slice(0, 9)])
    
    toast.success('Password generated!')
  }

  const calculateStrength = (pass: string): { score: number, text: string, color: string } => {
    let score = 0
    if (pass.length >= 8) score += 1
    if (pass.length >= 12) score += 1
    if (/[a-z]/.test(pass)) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 2) return { score, text: 'Weak', color: 'text-red-600' }
    if (score <= 4) return { score, text: 'Medium', color: 'text-yellow-600' }
    return { score, text: 'Strong', color: 'text-green-600' }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Password copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy password')
    }
  }

  const handleClearHistory = () => {
    setGeneratedPasswords([])
    toast.success('Password history cleared')
  }

  const strength = password ? calculateStrength(password) : null

  useEffect(() => {
    // Generate initial password
    generatePassword()
  }, [])

  return (
    <ToolWrapper title="Password Generator">
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid gap-6">
          {/* Length */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Password Length</Label>
              <Badge variant="outline">{length[0]} characters</Badge>
            </div>
            <Slider
              value={length}
              onValueChange={setLength}
              max={128}
              min={4}
              step={1}
              className="w-full"
            />
          </div>

          {/* Character Types */}
          <div className="grid gap-3">
            <Label>Character Types</Label>
            <div className="grid gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
                <Label htmlFor="uppercase" className="text-sm font-normal">
                  Uppercase Letters (A-Z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
                <Label htmlFor="lowercase" className="text-sm font-normal">
                  Lowercase Letters (a-z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
                <Label htmlFor="numbers" className="text-sm font-normal">
                  Numbers (0-9)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
                <Label htmlFor="symbols" className="text-sm font-normal">
                  Symbols
                </Label>
              </div>
            </div>
          </div>

          {/* Custom Symbols */}
          {includeSymbols && (
            <div className="grid gap-2">
              <Label htmlFor="custom-symbols">Custom Symbols</Label>
              <Input
                id="custom-symbols"
                value={customSymbols}
                onChange={(e) => setCustomSymbols(e.target.value)}
                className="font-mono"
              />
            </div>
          )}

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclude-similar"
              checked={excludeSimilar}
              onCheckedChange={setExcludeSimilar}
            />
            <Label htmlFor="exclude-similar" className="text-sm font-normal">
              Exclude similar characters (i, l, 1, L, o, 0, O)
            </Label>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generatePassword} className="w-full flex items-center gap-2">
          <Shuffle size={16} />
          Generate New Password
        </Button>

        {/* Generated Password */}
        {password && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Generated Password
                {strength && (
                  <Badge variant="outline" className={strength.color}>
                    {strength.text}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <code className="font-mono text-lg flex-1 select-all break-all">
                  {password}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(password)}
                  className="h-8 flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Password History */}
        {generatedPasswords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Recent Passwords
                <div className="flex gap-2">
                  <Badge variant="outline">{generatedPasswords.length}</Badge>
                  <Button size="sm" variant="outline" onClick={handleClearHistory}>
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {generatedPasswords.map((pass, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm">
                    <code className="font-mono flex-1 truncate select-all">
                      {pass}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(pass)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <strong>Security Notice:</strong> Passwords are generated locally in your browser and are not sent anywhere. 
          For maximum security, use long passwords with mixed character types.
        </div>
      </div>
    </ToolWrapper>
  )
}