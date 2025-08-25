import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle } from '@phosphor-icons/react'

export default function XMLFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [indent, setIndent] = useState(2)

  const formatXML = (xmlString: string, spaces: number = 2): { formatted: string, isValid: boolean, error?: string } => {
    if (!xmlString.trim()) {
      return { formatted: '', isValid: false }
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlString, 'application/xml')
      
      // Check for parsing errors
      const errorNode = doc.querySelector('parsererror')
      if (errorNode) {
        return { 
          formatted: '', 
          isValid: false, 
          error: errorNode.textContent || 'XML parsing error' 
        }
      }

      // Format the XML
      const serializer = new XMLSerializer()
      const formatted = formatXMLString(serializer.serializeToString(doc), spaces)
      
      return { formatted, isValid: true }
    } catch (err) {
      return { 
        formatted: '', 
        isValid: false, 
        error: err instanceof Error ? err.message : 'Invalid XML' 
      }
    }
  }

  const formatXMLString = (xml: string, indent: number): string => {
    const reg = /(>)(<)(\/*)/g
    xml = xml.replace(reg, '$1\r\n$2$3')
    
    let formatted = ''
    let pad = 0
    
    xml.split('\r\n').forEach(node => {
      let indentStr = ''
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indentStr = ' '.repeat(pad * indent)
      } else if (node.match(/^<\/\w/)) {
        pad--
        indentStr = ' '.repeat(pad * indent)
      } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
        indentStr = ' '.repeat(pad * indent)
        pad++
      } else {
        indentStr = ' '.repeat(pad * indent)
      }
      
      formatted += indentStr + node + '\n'
    })
    
    return formatted.slice(0, -1) // Remove last newline
  }

  const minifyXML = (xmlString: string): { minified: string, isValid: boolean, error?: string } => {
    if (!xmlString.trim()) {
      return { minified: '', isValid: false }
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlString, 'application/xml')
      
      const errorNode = doc.querySelector('parsererror')
      if (errorNode) {
        return { 
          minified: '', 
          isValid: false, 
          error: errorNode.textContent || 'XML parsing error' 
        }
      }

      const serializer = new XMLSerializer()
      let minified = serializer.serializeToString(doc)
      
      // Remove extra whitespace
      minified = minified.replace(/>\s+</g, '><').trim()
      
      return { minified, isValid: true }
    } catch (err) {
      return { 
        minified: '', 
        isValid: false, 
        error: err instanceof Error ? err.message : 'Invalid XML' 
      }
    }
  }

  useEffect(() => {
    const result = formatXML(input, indent)
    setOutput(result.formatted)
    setIsValid(result.isValid)
    setError(result.error || '')
  }, [input, indent])

  const handleMinify = () => {
    const result = minifyXML(input)
    if (result.isValid) {
      setOutput(result.minified)
      setError('')
    } else {
      setError(result.error || 'Invalid XML')
    }
  }

  const handleFormat = (spaces: number) => {
    setIndent(spaces)
  }

  return (
    <ToolWrapper title="XML Formatter & Validator">
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
                    Valid XML
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle size={14} className="mr-1" />
                    Invalid XML
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        <InputOutput
          inputLabel="XML Input"
          outputLabel="Formatted XML"
          inputValue={input}
          outputValue={output}
          onInputChange={setInput}
          placeholder='Enter XML to format and validate...\n\nExample:\n<root><person><name>John</name><age>30</age></person></root>'
          error={error}
          success={isValid && input.trim() ? 'Valid' : undefined}
          inputRows={8}
          outputRows={8}
          showDownload={true}
          downloadFilename="formatted.xml"
        />

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <strong>XML Error:</strong> {error}
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}