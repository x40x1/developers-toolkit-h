import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle } from '@phosphor-icons/react'

export default function JSONFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [indent, setIndent] = useState(2)

  const formatJSON = (jsonString: string, spaces: number = 2): { formatted: string, isValid: boolean, error?: string } => {
    if (!jsonString.trim()) {
      return { formatted: '', isValid: false }
    }

    try {
      const parsed = JSON.parse(jsonString)
      const formatted = JSON.stringify(parsed, null, spaces)
      return { formatted, isValid: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON'
      return { formatted: '', isValid: false, error: errorMessage }
    }
  }

  const minifyJSON = (jsonString: string): { minified: string, isValid: boolean, error?: string } => {
    if (!jsonString.trim()) {
      return { minified: '', isValid: false }
    }

    try {
      const parsed = JSON.parse(jsonString)
      const minified = JSON.stringify(parsed)
      return { minified, isValid: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON'
      return { minified: '', isValid: false, error: errorMessage }
    }
  }

  useEffect(() => {
    const result = formatJSON(input, indent)
    setOutput(result.formatted)
    setIsValid(result.isValid)
    setError(result.error || '')
  }, [input, indent])

  const handleMinify = () => {
    const result = minifyJSON(input)
    if (result.isValid) {
      setOutput(result.minified)
      setError('')
    } else {
      setError(result.error || 'Invalid JSON')
    }
  }

  const handleFormat = (spaces: number) => {
    setIndent(spaces)
    const result = formatJSON(input, spaces)
    setOutput(result.formatted)
    setIsValid(result.isValid)
    setError(result.error || '')
  }

  const getLineCount = (text: string): number => {
    return text ? text.split('\n').length : 0
  }

  const getCharCount = (text: string): number => {
    return text.length
  }

  return (
    <ToolWrapper title="JSON Formatter & Validator">
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Format:</span>
            <Button
              size="sm"
              variant={indent === 2 ? "default" : "outline"}
              onClick={() => handleFormat(2)}
            >
              2 Spaces
            </Button>
            <Button
              size="sm"
              variant={indent === 4 ? "default" : "outline"}
              onClick={() => handleFormat(4)}
            >
              4 Spaces
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMinify}
            >
              Minify
            </Button>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2">
            {input.trim() && (
              <>
                {isValid ? (
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    <CheckCircle size={14} className="mr-1" />
                    Valid JSON
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle size={14} className="mr-1" />
                    Invalid JSON
                  </Badge>
                )}
                
                <Badge variant="outline" className="text-xs">
                  {getLineCount(input)} lines
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getCharCount(input)} chars
                </Badge>
              </>
            )}
          </div>
        </div>

        <InputOutput
          inputLabel="JSON Input"
          outputLabel="Formatted JSON"
          inputValue={input}
          outputValue={output}
          onInputChange={setInput}
          placeholder='Enter JSON to format and validate...\n\nExample:\n{"name": "John", "age": 30, "city": "New York"}'
          error={error}
          success={isValid && input.trim() ? 'Valid' : undefined}
          inputRows={8}
          outputRows={8}
          showDownload={true}
          downloadFilename="formatted.json"
        />

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <strong>JSON Error:</strong> {error}
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}