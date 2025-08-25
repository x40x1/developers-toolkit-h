import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CSVConverterTool() {
  const [csvInput, setCsvInput] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [csvOutput, setCsvOutput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [csvToJsonError, setCsvToJsonError] = useState('')
  const [jsonToCsvError, setJsonToCsvError] = useState('')

  const csvToJson = (csvText: string): { json: string, error?: string } => {
    if (!csvText.trim()) {
      return { json: '' }
    }

    try {
      const lines = csvText.trim().split('\n')
      if (lines.length === 0) {
        return { json: '[]' }
      }

      // Parse CSV (basic implementation)
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = []
        let current = ''
        let inQuotes = false
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"'
              i++ // Skip next quote
            } else {
              inQuotes = !inQuotes
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        
        result.push(current.trim())
        return result
      }

      const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ''))
      const data = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        
        const values = parseCSVLine(line)
        const obj: any = {}
        
        headers.forEach((header, index) => {
          let value: any = values[index] || ''
          
          // Remove quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1)
          }
          
          // Try to parse as number or boolean
          if (value === 'true') {
            value = true
          } else if (value === 'false') {
            value = false
          } else if (value && !isNaN(Number(value))) {
            value = Number(value)
          }
          
          obj[header] = value
        })
        
        data.push(obj)
      }

      return { json: JSON.stringify(data, null, 2) }
    } catch (err) {
      return { 
        json: '', 
        error: `CSV parsing error: ${err instanceof Error ? err.message : 'Unknown error'}` 
      }
    }
  }

  const jsonToCsv = (jsonText: string): { csv: string, error?: string } => {
    if (!jsonText.trim()) {
      return { csv: '' }
    }

    try {
      const data = JSON.parse(jsonText)
      
      if (!Array.isArray(data)) {
        return { csv: '', error: 'JSON must be an array of objects' }
      }

      if (data.length === 0) {
        return { csv: '' }
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>()
      data.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => allKeys.add(key))
        }
      })

      const headers = Array.from(allKeys)
      
      // Escape CSV value
      const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) {
          return ''
        }
        
        const str = String(value)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      // Create CSV
      let csv = headers.map(escapeCSV).join(',') + '\n'
      
      data.forEach(obj => {
        const row = headers.map(header => {
          const value = obj && typeof obj === 'object' ? obj[header] : ''
          return escapeCSV(value)
        }).join(',')
        csv += row + '\n'
      })

      return { csv: csv.trim() }
    } catch (err) {
      return { 
        csv: '', 
        error: `JSON parsing error: ${err instanceof Error ? err.message : 'Unknown error'}` 
      }
    }
  }

  useEffect(() => {
    if (csvInput.trim()) {
      const result = csvToJson(csvInput)
      setJsonOutput(result.json)
      setCsvToJsonError(result.error || '')
    } else {
      setJsonOutput('')
      setCsvToJsonError('')
    }
  }, [csvInput])

  useEffect(() => {
    if (jsonInput.trim()) {
      const result = jsonToCsv(jsonInput)
      setCsvOutput(result.csv)
      setJsonToCsvError(result.error || '')
    } else {
      setCsvOutput('')
      setJsonToCsvError('')
    }
  }, [jsonInput])

  return (
    <ToolWrapper title="CSV Converter">
      <Tabs defaultValue="csv-to-json" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="csv-to-json">CSV → JSON</TabsTrigger>
          <TabsTrigger value="json-to-csv">JSON → CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="csv-to-json" className="mt-6">
          <InputOutput
            inputLabel="CSV Input"
            outputLabel="JSON Output"
            inputValue={csvInput}
            outputValue={jsonOutput}
            onInputChange={setCsvInput}
            placeholder='Enter CSV to convert to JSON...\n\nExample:\nname,age,city\nJohn,30,New York\nJane,25,Los Angeles'
            error={csvToJsonError}
            inputRows={8}
            outputRows={8}
            showDownload={true}
            downloadFilename="converted.json"
          />
        </TabsContent>

        <TabsContent value="json-to-csv" className="mt-6">
          <InputOutput
            inputLabel="JSON Input (Array of Objects)"
            outputLabel="CSV Output"
            inputValue={jsonInput}
            outputValue={csvOutput}
            onInputChange={setJsonInput}
            placeholder='Enter JSON array to convert to CSV...\n\nExample:\n[\n  {"name": "John", "age": 30, "city": "New York"},\n  {"name": "Jane", "age": 25, "city": "Los Angeles"}\n]'
            error={jsonToCsvError}
            inputRows={8}
            outputRows={8}
            showDownload={true}
            downloadFilename="converted.csv"
          />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}