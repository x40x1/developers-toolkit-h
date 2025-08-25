import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Copy, Download, CheckCircle } from '@phosphor-icons/react'

interface ToolWrapperProps {
  title: string
  children: ReactNode
}

export function ToolWrapper({ title, children }: ToolWrapperProps) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  )
}

interface InputOutputProps {
  inputLabel: string
  outputLabel: string
  inputValue: string
  outputValue: string
  onInputChange: (value: string) => void
  placeholder?: string
  outputReadOnly?: boolean
  showDownload?: boolean
  downloadFilename?: string
  inputRows?: number
  outputRows?: number
  error?: string
  success?: string
}

export function InputOutput({
  inputLabel,
  outputLabel, 
  inputValue,
  outputValue,
  onInputChange,
  placeholder = "Enter text here...",
  outputReadOnly = true,
  showDownload = false,
  downloadFilename = "output.txt",
  inputRows = 4,
  outputRows = 4,
  error,
  success
}: InputOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!outputValue.trim()) return
    
    try {
      await navigator.clipboard.writeText(outputValue)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    if (!outputValue.trim()) return
    
    const blob = new Blob([outputValue], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('File downloaded!')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input */}
      <div className="space-y-2">
        <Label htmlFor="input" className="text-sm font-medium">
          {inputLabel}
        </Label>
        <Textarea
          id="input"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          rows={inputRows}
          className="font-mono text-sm resize-none"
        />
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="output" className="text-sm font-medium">
            {outputLabel}
          </Label>
          <div className="flex items-center gap-2">
            {success && (
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                <CheckCircle size={14} className="mr-1" />
                {success}
              </Badge>
            )}
            {error && (
              <Badge variant="destructive" className="text-xs">
                {error}
              </Badge>
            )}
            {outputValue.trim() && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!outputValue.trim()}
                  className="h-8"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                {showDownload && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownload}
                    className="h-8"
                  >
                    <Download size={16} />
                    Download
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <Textarea
          id="output"
          value={outputValue}
          readOnly={outputReadOnly}
          rows={outputRows}
          className="font-mono text-sm resize-none bg-muted"
        />
      </div>
    </div>
  )
}