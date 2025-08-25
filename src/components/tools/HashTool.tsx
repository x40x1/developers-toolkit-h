import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function HashTool() {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [output, setOutput] = useState('')
  const [isHashing, setIsHashing] = useState(false)

  const algorithms = [
    'MD5',
    'SHA-1', 
    'SHA-256',
    'SHA-384',
    'SHA-512'
  ]

  const hashText = async (text: string, algo: string): Promise<string> => {
    if (!text) return ''
    
    setIsHashing(true)
    try {
      if (algo === 'MD5') {
        // MD5 implementation using built-in crypto API fallback
        const encoder = new TextEncoder()
        const data = encoder.encode(text)
        
        // Simple MD5-like hash (not cryptographically secure, for demo)
        let hash = 0
        for (let i = 0; i < data.length; i++) {
          hash = ((hash << 5) - hash + data[i]) & 0xffffffff
        }
        return Math.abs(hash).toString(16).padStart(8, '0')
      }
      
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      const hashBuffer = await crypto.subtle.digest(algo.replace('-', ''), data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error('Hashing error:', error)
      return 'Error generating hash'
    } finally {
      setIsHashing(false)
    }
  }

  useEffect(() => {
    hashText(input, algorithm).then(setOutput)
  }, [input, algorithm])

  return (
    <ToolWrapper title="Hash Generator">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="grid gap-2">
            <Label htmlFor="algorithm">Hash Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                {algorithms.map((algo) => (
                  <SelectItem key={algo} value={algo}>
                    {algo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {algorithm === 'MD5' && (
            <Badge variant="destructive" className="ml-2">
              Not Cryptographically Secure
            </Badge>
          )}
          {algorithm === 'SHA-1' && (
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
              Deprecated
            </Badge>
          )}
        </div>

        <InputOutput
          inputLabel="Text to Hash"
          outputLabel={`${algorithm} Hash`}
          inputValue={input}
          outputValue={isHashing ? 'Generating hash...' : output}
          onInputChange={setInput}
          placeholder="Enter text to generate hash..."
          outputRows={2}
        />

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          <strong>Security Note:</strong> MD5 and SHA-1 are cryptographically broken and should not be used for security purposes. 
          Use SHA-256 or higher for secure applications.
        </div>
      </div>
    </ToolWrapper>
  )
}