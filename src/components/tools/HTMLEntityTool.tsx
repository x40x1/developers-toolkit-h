import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HTMLEntityTool() {
  const [input, setInput] = useState('')
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')

  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  const htmlEntitiesReverse: { [key: string]: string } = Object.fromEntries(
    Object.entries(htmlEntities).map(([k, v]) => [v, k])
  )

  const encodeHtmlEntities = (text: string): string => {
    return text.replace(/[&<>"'\/`=]/g, (match) => htmlEntities[match] || match)
  }

  const decodeHtmlEntities = (text: string): string => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x60;/g, '`')
      .replace(/&#x3D;/g, '=')
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
  }

  useEffect(() => {
    if (!input.trim()) {
      setEncoded('')
      setDecoded('')
      return
    }

    // Always try both operations
    setEncoded(encodeHtmlEntities(input))
    setDecoded(decodeHtmlEntities(input))
  }, [input])

  return (
    <ToolWrapper title="HTML Entity Encoder/Decoder">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="mt-6">
          <InputOutput
            inputLabel="Text to HTML Encode"
            outputLabel="HTML Encoded"
            inputValue={input}
            outputValue={encoded}
            onInputChange={setInput}
            placeholder="Enter text with HTML characters to encode..."
          />
        </TabsContent>

        <TabsContent value="decode" className="mt-6">
          <InputOutput
            inputLabel="HTML Entities to Decode"
            outputLabel="Decoded Text"
            inputValue={input}
            outputValue={decoded}
            onInputChange={setInput}
            placeholder="Enter HTML entities to decode..."
          />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}