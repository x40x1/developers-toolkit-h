import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function YAMLConverterTool() {
  const [jsonInput, setJsonInput] = useState('')
  const [yamlInput, setYamlInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [yamlOutput, setYamlOutput] = useState('')
  const [jsonToYamlError, setJsonToYamlError] = useState('')
  const [yamlToJsonError, setYamlToJsonError] = useState('')

  // Simple YAML to JSON converter (basic implementation)
  const yamlToJson = (yamlText: string): { json: string, error?: string } => {
    if (!yamlText.trim()) {
      return { json: '' }
    }

    try {
      // This is a very basic YAML parser - for a production app, use a proper YAML library
      // Handle simple key-value pairs and basic structures
      const lines = yamlText.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))
      const result: any = {}
      
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':')
          const value = valueParts.join(':').trim()
          
          const cleanKey = key.trim().replace(/^-\s*/, '')
          
          // Try to parse value as JSON
          let parsedValue: any = value
          if (value.startsWith('"') && value.endsWith('"')) {
            parsedValue = value.slice(1, -1)
          } else if (value === 'true') {
            parsedValue = true
          } else if (value === 'false') {
            parsedValue = false
          } else if (value === 'null') {
            parsedValue = null
          } else if (!isNaN(Number(value)) && value !== '') {
            parsedValue = Number(value)
          }
          
          result[cleanKey] = parsedValue
        }
      }

      return { json: JSON.stringify(result, null, 2) }
    } catch (err) {
      return { json: '', error: `YAML parsing error: ${err instanceof Error ? err.message : 'Unknown error'}` }
    }
  }

  // Simple JSON to YAML converter
  const jsonToYaml = (jsonText: string): { yaml: string, error?: string } => {
    if (!jsonText.trim()) {
      return { yaml: '' }
    }

    try {
      const obj = JSON.parse(jsonText)
      
      const convertToYaml = (obj: any, indent: number = 0): string => {
        const spaces = '  '.repeat(indent)
        let yaml = ''

        if (obj === null) {
          return 'null'
        } else if (typeof obj === 'string') {
          return obj.includes('\n') || obj.includes('"') ? `"${obj}"` : obj
        } else if (typeof obj === 'number' || typeof obj === 'boolean') {
          return obj.toString()
        } else if (Array.isArray(obj)) {
          yaml = '\n'
          for (const item of obj) {
            yaml += `${spaces}- ${convertToYaml(item, indent + 1)}\n`
          }
          return yaml.slice(0, -1) // Remove last newline
        } else if (typeof obj === 'object') {
          yaml = '\n'
          for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
              yaml += `${spaces}${key}:${convertToYaml(value, indent + 1)}\n`
            } else {
              yaml += `${spaces}${key}: ${convertToYaml(value, indent + 1)}\n`
            }
          }
          return yaml.slice(0, -1) // Remove last newline
        }

        return String(obj)
      }

      const yamlResult = convertToYaml(obj).replace(/^\n/, '') // Remove leading newline
      return { yaml: yamlResult }
    } catch (err) {
      return { yaml: '', error: `JSON parsing error: ${err instanceof Error ? err.message : 'Unknown error'}` }
    }
  }

  useEffect(() => {
    if (jsonInput.trim()) {
      const result = jsonToYaml(jsonInput)
      setYamlOutput(result.yaml)
      setJsonToYamlError(result.error || '')
    } else {
      setYamlOutput('')
      setJsonToYamlError('')
    }
  }, [jsonInput])

  useEffect(() => {
    if (yamlInput.trim()) {
      const result = yamlToJson(yamlInput)
      setJsonOutput(result.json)
      setYamlToJsonError(result.error || '')
    } else {
      setJsonOutput('')
      setYamlToJsonError('')
    }
  }, [yamlInput])

  return (
    <ToolWrapper title="YAML Converter">
      <div className="mb-4 p-3 bg-muted rounded-md text-sm">
        <strong>Note:</strong> This is a basic YAML converter suitable for simple structures. 
        For complex YAML with advanced features, use a dedicated YAML processor.
      </div>

      <Tabs defaultValue="json-to-yaml" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
          <TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-yaml" className="mt-6">
          <InputOutput
            inputLabel="JSON Input"
            outputLabel="YAML Output"
            inputValue={jsonInput}
            outputValue={yamlOutput}
            onInputChange={setJsonInput}
            placeholder='Enter JSON to convert to YAML...\n\nExample:\n{\n  "name": "John",\n  "age": 30,\n  "hobbies": ["reading", "coding"]\n}'
            error={jsonToYamlError}
            inputRows={8}
            outputRows={8}
            showDownload={true}
            downloadFilename="converted.yaml"
          />
        </TabsContent>

        <TabsContent value="yaml-to-json" className="mt-6">
          <InputOutput
            inputLabel="YAML Input"
            outputLabel="JSON Output"
            inputValue={yamlInput}
            outputValue={jsonOutput}
            onInputChange={setYamlInput}
            placeholder='Enter YAML to convert to JSON...\n\nExample:\nname: John\nage: 30\nhobbies:\n  - reading\n  - coding'
            error={yamlToJsonError}
            inputRows={8}
            outputRows={8}
            showDownload={true}
            downloadFilename="converted.json"
          />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}