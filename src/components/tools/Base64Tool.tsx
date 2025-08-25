import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Base64Tool() {
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
      const encodedResult = btoa(unescape(encodeURIComponent(input)))
      setEncoded(encodedResult)

      // Try to decode to validate if it's valid base64
      try {
        const decodedResult = decodeURIComponent(escape(atob(input)))
        setDecoded(decodedResult)
        setError('')
      } catch {
        // Input is not valid base64, clear decode result
        setDecoded('')
        setError('')
      }
    } catch (err) {
      setEncoded('')
      setError('Invalid input for encoding')
    }
  }, [input])

  const handleDecode = (base64Input: string) => {
    if (!base64Input.trim()) {
      setDecoded('')
      setError('')
      return
    }

    try {
      const result = decodeURIComponent(escape(atob(base64Input)))
      setDecoded(result)
      setError('')
    } catch {
      setDecoded('')
      setError('Invalid Base64 input')
    }
  }

  return (
    <ToolWrapper title="Base64 Encoder/Decoder">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="mt-6">
          <InputOutput
            inputLabel="Text to Encode"
            outputLabel="Base64 Encoded"
            inputValue={input}
            outputValue={encoded}
            onInputChange={setInput}
            placeholder="Enter text to encode to Base64..."
            showDownload={true}
            downloadFilename="encoded.txt"
          />
        </TabsContent>

        <TabsContent value="decode" className="mt-6">
          <InputOutput
            inputLabel="Base64 to Decode"
            outputLabel="Decoded Text"
            inputValue={input}
            outputValue={decoded}
            onInputChange={(value) => {
              setInput(value)
              handleDecode(value)
            }}
            placeholder="Enter Base64 string to decode..."
            error={error}
            showDownload={true}
            downloadFilename="decoded.txt"
          />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}