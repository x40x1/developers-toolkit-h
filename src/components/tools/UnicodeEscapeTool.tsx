import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function UnicodeEscapeTool() {
  const [input, setInput] = useState('')
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')
  const [error, setError] = useState('')

  const encodeUnicode = (text: string): string => {
    return text
      .split('')
      .map(char => {
        const code = char.charCodeAt(0)
        if (code > 127) {
          return '\\u' + code.toString(16).padStart(4, '0')
        }
        return char
      })
      .join('')
  }

  const decodeUnicode = (text: string): string => {
    try {
      return text.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
      })
    } catch (err) {
      throw new Error('Invalid Unicode escape sequence')
    }
  }

  useEffect(() => {
    if (!input.trim()) {
      setEncoded('')
      setDecoded('')
      setError('')
      return
    }

    try {
      setEncoded(encodeUnicode(input))
      setDecoded(decodeUnicode(input))
      setError('')
    } catch (err) {
      setError('Invalid Unicode escape sequence')
      setDecoded('')
    }
  }, [input])

  return (
    <ToolWrapper title="Unicode Escape Tool">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Escape</TabsTrigger>
          <TabsTrigger value="decode">Unescape</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="mt-6">
          <InputOutput
            inputLabel="Text to Unicode Escape"
            outputLabel="Unicode Escaped"
            inputValue={input}
            outputValue={encoded}
            onInputChange={setInput}
            placeholder="Enter text with Unicode characters..."
          />
        </TabsContent>

        <TabsContent value="decode" className="mt-6">
          <InputOutput
            inputLabel="Unicode Escaped Text"
            outputLabel="Unescaped Text"
            inputValue={input}
            outputValue={decoded}
            onInputChange={setInput}
            placeholder="Enter Unicode escaped text (e.g., \\u0048\\u0065\\u006C\\u006C\\u006F)..."
            error={error}
          />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}