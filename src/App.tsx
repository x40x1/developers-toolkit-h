import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Code, Hash, Database, Shuffle, Calculator, Zap } from '@phosphor-icons/react'

// Tool Components
import Base64Tool from '@/components/tools/Base64Tool'
import URLEncoderTool from '@/components/tools/URLEncoderTool'
import HTMLEntityTool from '@/components/tools/HTMLEntityTool'
import UnicodeEscapeTool from '@/components/tools/UnicodeEscapeTool'
import HashTool from '@/components/tools/HashTool'
import AESEncryptionTool from '@/components/tools/AESEncryptionTool'
import JSONFormatterTool from '@/components/tools/JSONFormatterTool'
import YAMLConverterTool from '@/components/tools/YAMLConverterTool'
import XMLFormatterTool from '@/components/tools/XMLFormatterTool'
import CSVConverterTool from '@/components/tools/CSVConverterTool'
import UUIDGeneratorTool from '@/components/tools/UUIDGeneratorTool'
import PasswordGeneratorTool from '@/components/tools/PasswordGeneratorTool'
import LoremIpsumTool from '@/components/tools/LoremIpsumTool'
import RegexTesterTool from '@/components/tools/RegexTesterTool'
import NumberBaseTool from '@/components/tools/NumberBaseTool'
import JWTDecoderTool from '@/components/tools/JWTDecoderTool'

function App() {
  const [activeCategory, setActiveCategory] = useState('encoding')

  const toolCategories = {
    encoding: {
      name: 'Encoding & Decoding',
      icon: Code,
      tools: [
        { component: Base64Tool, title: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings' },
        { component: URLEncoderTool, title: 'URL Encoder/Decoder', description: 'URL encode and decode strings' },
        { component: HTMLEntityTool, title: 'HTML Entity Encoder/Decoder', description: 'Convert HTML entities' },
        { component: UnicodeEscapeTool, title: 'Unicode Escape', description: 'Unicode escape and unescape' }
      ]
    },
    crypto: {
      name: 'Cryptography & Hashing',
      icon: Hash,
      tools: [
        { component: HashTool, title: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes' },
        { component: AESEncryptionTool, title: 'AES Encryption/Decryption', description: 'Encrypt and decrypt with AES' },
        { component: JWTDecoderTool, title: 'JWT Decoder', description: 'Decode and validate JWT tokens' }
      ]
    },
    data: {
      name: 'Data Converters',
      icon: Database,
      tools: [
        { component: JSONFormatterTool, title: 'JSON Formatter/Validator', description: 'Format and validate JSON' },
        { component: YAMLConverterTool, title: 'YAML Converter', description: 'Convert between JSON and YAML' },
        { component: XMLFormatterTool, title: 'XML Formatter', description: 'Format and validate XML' },
        { component: CSVConverterTool, title: 'CSV Converter', description: 'Convert between CSV and JSON' }
      ]
    },
    generators: {
      name: 'Generators',
      icon: Zap,
      tools: [
        { component: UUIDGeneratorTool, title: 'UUID Generator', description: 'Generate UUIDs and GUIDs' },
        { component: PasswordGeneratorTool, title: 'Password Generator', description: 'Generate secure passwords' },
        { component: LoremIpsumTool, title: 'Lorem Ipsum Generator', description: 'Generate placeholder text' },
        { component: RegexTesterTool, title: 'Regex Tester', description: 'Test regular expressions' }
      ]
    },
    math: {
      name: 'Number Systems',
      icon: Calculator,
      tools: [
        { component: NumberBaseTool, title: 'Number Base Converter', description: 'Convert between number bases' }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            DevTools Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Essential developer utilities for encoding, encryption, conversion, and generation - 
            all processed securely in your browser
          </p>
          <Badge variant="secondary" className="mt-4">
            100% Client-Side • No Data Transmitted
          </Badge>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          {/* Category Navigation */}
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {Object.entries(toolCategories).map(([key, category]) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon size={18} />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Tool Categories */}
          {Object.entries(toolCategories).map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3 mb-2">
                  <category.icon size={28} className="text-primary" />
                  {category.name}
                </h2>
                <Separator />
              </div>

              <div className="grid gap-8">
                {category.tools.map((tool, index) => {
                  const ToolComponent = tool.component
                  return (
                    <Card key={index} className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ToolComponent />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <Separator className="mb-6" />
          <p>
            All tools run entirely in your browser. No data is sent to any server. 
            Built with security and privacy in mind.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App