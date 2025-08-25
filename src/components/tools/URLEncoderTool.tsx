import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function URLEncoderTool() {
  const [input, setInput] = useState('')
  const [encoded, setEncoded] = useState('')
  const [decoded, setDecoded] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!input.trim()) {
      setEncoded('')
      setDecoded('')
      setError('')
      return
    }

    try {
      // Encode
      const encodedResult = encodeURIComponent(input)
      setEncoded(encodedResult)

      // Try to decode to validate
      try {
        const decodedResult = decodeURIComponent(input)
        setDecoded(decodedResult)
        setError('')
      } catch {
        setDecoded('')
        setError('')
      }
    } catch (err) {
      setEncoded('')
      setError('Invalid input for encoding')
    }
  }, [input])

  const handleDecode = (urlInput: string) => {
    if (!urlInput.trim()) {
      setDecoded('')
      setError('')
      return
    }

    try {
      const result = decodeURIComponent(urlInput)
      setDecoded(result)
      setError('')
    } catch {
      setDecoded('')
      setError('Invalid URL encoded input')
    }
  }

  return (
    <ToolWrapper title="URL Encoder/Decoder">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="mt-6">
          <InputOutput
            inputLabel="Text to URL Encode"
            outputLabel="URL Encoded"
            inputValue={input}
            outputValue={encoded}
            onInputChange={setInput}
            placeholder="Enter text to URL encode..."
          />
        </TabsContent>

        <TabsContent value="decode" className="mt-6">
          <InputOutput
            inputLabel="URL Encoded Text to Decode"
            outputLabel="Decoded Text"
            inputValue={input}
            outputValue={decoded}
            onInputChange={(value) => {
              setInput(value)
              handleDecode(value)
            }}
            placeholder="Enter URL encoded text to decode..."
            error={error}
          />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}