import { useState } from 'react'
import { ToolWrapper } from '@/components/ToolWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Shuffle, Copy, CheckCircle } from '@phosphor-icons/react'

export default function LoremIpsumTool() {
  const [output, setOutput] = useState('')
  const [count, setCount] = useState(5)
  const [unit, setUnit] = useState('paragraphs')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [copied, setCopied] = useState(false)

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'nemo',
    'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit', 'sed',
    'quia', 'consequuntur', 'magni', 'dolores', 'ratione', 'sequi', 'neque',
    'porro', 'quisquam', 'est', 'qui', 'dolorem', 'adipisci', 'numquam', 'eius',
    'modi', 'tempora', 'incidunt', 'magnam', 'quaerat', 'voluptatem', 'aliquam',
    'quamdo', 'eligendi', 'optio', 'cumque', 'nihil', 'impedit', 'quo', 'minus',
    'maxime', 'placeat', 'facere', 'possimus', 'omnis', 'voluptas', 'assumenda',
    'est', 'omnis', 'dolor', 'repellendus', 'temporibus', 'autem', 'quibusdam',
    'officiis', 'debitis', 'necessitatibus', 'saepe', 'eveniet', 'voluptates',
    'repudiandae', 'recusandae', 'itaque', 'earum', 'rerum', 'hic', 'tenetur',
    'sapiente', 'delectus', 'reiciendis', 'maiores', 'alias', 'perferendis',
    'doloribus', 'asperiores', 'repellat'
  ]

  const getRandomWords = (wordCount: number): string => {
    const words: string[] = []
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
    }
    return words.join(' ')
  }

  const generateSentence = (wordCount: number = Math.floor(Math.random() * 10) + 5): string => {
    const sentence = getRandomWords(wordCount)
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  }

  const generateParagraph = (sentenceCount: number = Math.floor(Math.random() * 5) + 3): string => {
    const sentences: string[] = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  const generateText = () => {
    let result = ''

    switch (unit) {
      case 'words':
        result = getRandomWords(count)
        if (startWithLorem && count >= 2) {
          const words = result.split(' ')
          words[0] = 'Lorem'
          words[1] = 'ipsum'
          result = words.join(' ')
        }
        break

      case 'sentences':
        const sentences: string[] = []
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence())
        }
        result = sentences.join(' ')
        if (startWithLorem) {
          result = result.replace(/^[A-Z][a-z]+/, 'Lorem')
          result = result.replace(/^(Lorem\s+)[a-z]+/, '$1ipsum')
        }
        break

      case 'paragraphs':
        const paragraphs: string[] = []
        for (let i = 0; i < count; i++) {
          let paragraph = generateParagraph()
          if (i === 0 && startWithLorem) {
            paragraph = paragraph.replace(/^[A-Z][a-z]+\s+[a-z]+/, 'Lorem ipsum')
          }
          paragraphs.push(paragraph)
        }
        result = paragraphs.join('\n\n')
        break

      case 'list':
        const listItems: string[] = []
        for (let i = 0; i < count; i++) {
          listItems.push(`• ${generateSentence()}`)
        }
        result = listItems.join('\n')
        break

      default:
        result = generateParagraph()
    }

    setOutput(result)
    toast.success(`Generated ${count} ${unit}`)
  }

  const handleCopy = async () => {
    if (!output.trim()) return
    
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast.success('Lorem Ipsum copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  const presetConfigs = [
    { name: 'Short Paragraph', unit: 'paragraphs', count: 1 },
    { name: 'Article', unit: 'paragraphs', count: 5 },
    { name: 'Long Article', unit: 'paragraphs', count: 10 },
    { name: 'Single Sentence', unit: 'sentences', count: 1 },
    { name: 'List Items', unit: 'list', count: 5 },
    { name: '50 Words', unit: 'words', count: 50 },
  ]

  const applyPreset = (preset: { unit: string, count: number }) => {
    setUnit(preset.unit)
    setCount(preset.count)
  }

  const getWordCount = (text: string): number => {
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

  const getCharCount = (text: string): number => {
    return text.length
  }

  const getParagraphCount = (text: string): number => {
    return text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
  }

  return (
    <ToolWrapper title="Lorem Ipsum Generator">
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid gap-4">
          <div className="flex flex-wrap items-end gap-4">
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

            <div className="grid gap-2">
              <Label htmlFor="unit">Generate</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  <SelectItem value="list">List Items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateText} className="flex items-center gap-2">
              <Shuffle size={16} />
              Generate
            </Button>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium self-center">Presets:</span>
            {presetConfigs.map((preset, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => applyPreset(preset)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="start-with-lorem"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="start-with-lorem" className="text-sm font-normal">
              Start with "Lorem ipsum"
            </Label>
          </div>
        </div>

        {/* Output */}
        {output && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Generated Text
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getWordCount(output)} words
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getCharCount(output)} chars
                  </Badge>
                  {unit === 'paragraphs' && (
                    <Badge variant="outline" className="text-xs">
                      {getParagraphCount(output)} paragraphs
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="h-8"
                  >
                    {copied ? (
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                rows={Math.min(20, Math.max(8, output.split('\n').length))}
                className="font-sans text-sm resize-none bg-muted"
              />
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <strong>About Lorem Ipsum:</strong> Lorem ipsum is placeholder text commonly used in the printing 
          and typesetting industry. It's derived from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum 
          et Malorum" by Cicero, written in 45 BC.
        </div>
      </div>
    </ToolWrapper>
  )
}