import { useState } from 'react'
import { ToolWrapper } from '@/components/ToolWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Copy, Shuffle, CheckCircle } from '@phosphor-icons/react'

export default function UUIDGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const [version, setVersion] = useState('4')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const generateUUIDv1 = (): string => {
    // Simplified UUID v1 implementation (timestamp-based)
    const timestamp = Date.now()
    const randomPart = Math.random().toString(16).substring(2, 14)
    const timestampHex = timestamp.toString(16).padStart(12, '0')
    
    return `${timestampHex.substring(0, 8)}-${timestampHex.substring(8, 12)}-1${randomPart.substring(0, 3)}-8${randomPart.substring(3, 6)}-${randomPart.substring(6, 12)}${Math.random().toString(16).substring(2, 8)}`
  }

  const generateNil = (): string => {
    return '00000000-0000-0000-0000-000000000000'
  }

  const generateMax = (): string => {
    return 'ffffffff-ffff-ffff-ffff-ffffffffffff'
  }

  const generateUUID = (version: string): string => {
    switch (version) {
      case '1':
        return generateUUIDv1()
      case '4':
        return generateUUIDv4()
      case 'nil':
        return generateNil()
      case 'max':
        return generateMax()
      default:
        return generateUUIDv4()
    }
  }

  const handleGenerate = () => {
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID(version))
    }
    setUuids(newUuids)
    setCopiedIndex(null)
    toast.success(`Generated ${count} UUID${count > 1 ? 's' : ''}`)
  }

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopiedIndex(index)
      toast.success('UUID copied to clipboard!')
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      toast.error('Failed to copy UUID')
    }
  }

  const handleCopyAll = async () => {
    if (uuids.length === 0) return
    
    try {
      await navigator.clipboard.writeText(uuids.join('\n'))
      toast.success('All UUIDs copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy UUIDs')
    }
  }

  const validateUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const nilRegex = /^0{8}-0{4}-0{4}-0{4}-0{12}$/
    const maxRegex = /^f{8}-f{4}-f{4}-f{4}-f{12}$/i
    
    return uuidRegex.test(uuid) || nilRegex.test(uuid) || maxRegex.test(uuid)
  }

  return (
    <ToolWrapper title="UUID/GUID Generator">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid gap-2">
            <Label htmlFor="version">UUID Version</Label>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">Version 4 (Random)</SelectItem>
                <SelectItem value="1">Version 1 (Timestamp)</SelectItem>
                <SelectItem value="nil">Nil UUID</SelectItem>
                <SelectItem value="max">Max UUID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="count">Count</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-[100px]"
            />
          </div>

          <Button onClick={handleGenerate} className="flex items-center gap-2">
            <Shuffle size={16} />
            Generate
          </Button>

          {uuids.length > 0 && (
            <Button variant="outline" onClick={handleCopyAll} className="flex items-center gap-2">
              <Copy size={16} />
              Copy All
            </Button>
          )}
        </div>

        {/* Version Info */}
        <div className="grid gap-2 text-sm text-muted-foreground">
          {version === '4' && (
            <Badge variant="secondary">
              Randomly generated UUID - most commonly used
            </Badge>
          )}
          {version === '1' && (
            <Badge variant="secondary">
              Timestamp-based UUID - includes time and node information
            </Badge>
          )}
          {version === 'nil' && (
            <Badge variant="outline">
              Special nil UUID - all zeros
            </Badge>
          )}
          {version === 'max' && (
            <Badge variant="outline">
              Special max UUID - all F's
            </Badge>
          )}
        </div>

        {/* Generated UUIDs */}
        {uuids.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Generated UUIDs
                <Badge variant="outline">{uuids.length} generated</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <code className="font-mono text-sm select-all">
                      {uuid}
                    </code>
                    {validateUUID(uuid) && (
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(uuid, index)}
                    className="h-8"
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* UUID Info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <strong>About UUIDs:</strong> Universally Unique Identifiers (UUIDs) are 128-bit values 
          used to uniquely identify objects. Version 4 UUIDs are randomly generated and are the most 
          commonly used format.
        </div>
      </div>
    </ToolWrapper>
  )
}