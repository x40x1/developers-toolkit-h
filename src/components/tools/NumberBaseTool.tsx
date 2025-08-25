import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function NumberBaseTool() {
  const [inputValue, setInputValue] = useState('')
  const [inputBase, setInputBase] = useState(10)
  const [binary, setBinary] = useState('')
  const [octal, setOctal] = useState('')
  const [decimal, setDecimal] = useState('')
  const [hexadecimal, setHexadecimal] = useState('')
  const [error, setError] = useState('')

  const convertNumber = (value: string, fromBase: number) => {
    if (!value.trim()) {
      setBinary('')
      setOctal('')
      setDecimal('')
      setHexadecimal('')
      setError('')
      return
    }

    try {
      // Remove any whitespace and convert to lowercase for hex
      const cleanValue = value.replace(/\s/g, '').toLowerCase()
      
      // Validate input for the given base
      const validChars = '0123456789abcdef'.slice(0, fromBase)
      if (!cleanValue.split('').every(char => validChars.includes(char))) {
        throw new Error(`Invalid character for base ${fromBase}`)
      }

      // Convert to decimal first
      const decimalValue = parseInt(cleanValue, fromBase)
      
      if (isNaN(decimalValue)) {
        throw new Error('Invalid number')
      }

      // Check for reasonable limits to prevent performance issues
      if (decimalValue > Number.MAX_SAFE_INTEGER) {
        throw new Error('Number too large')
      }

      if (decimalValue < 0) {
        throw new Error('Negative numbers not supported')
      }

      // Convert to all bases
      setBinary(decimalValue.toString(2))
      setOctal(decimalValue.toString(8))
      setDecimal(decimalValue.toString(10))
      setHexadecimal(decimalValue.toString(16).toUpperCase())
      setError('')

    } catch (err) {
      setBinary('')
      setOctal('')
      setDecimal('')
      setHexadecimal('')
      setError(err instanceof Error ? err.message : 'Invalid input')
    }
  }

  useEffect(() => {
    convertNumber(inputValue, inputBase)
  }, [inputValue, inputBase])

  const handleInputChange = (value: string, base: number) => {
    setInputValue(value)
    setInputBase(base)
  }

  const formatBinaryWithSpaces = (binary: string): string => {
    // Add spaces every 4 bits for readability
    return binary.replace(/(.{4})/g, '$1 ').trim()
  }

  const getBitCount = (binary: string): number => {
    return binary.length
  }

  const getByteCount = (binary: string): number => {
    return Math.ceil(binary.length / 8)
  }

  return (
    <ToolWrapper title="Number Base Converter">
      <div className="space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Input Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="binary-input">Binary (Base 2)</Label>
                <Input
                  id="binary-input"
                  value={inputBase === 2 ? inputValue : binary}
                  onChange={(e) => handleInputChange(e.target.value, 2)}
                  placeholder="e.g., 1010"
                  className="font-mono"
                />
                <div className="text-xs text-muted-foreground">
                  Use digits: 0, 1
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="octal-input">Octal (Base 8)</Label>
                <Input
                  id="octal-input"
                  value={inputBase === 8 ? inputValue : octal}
                  onChange={(e) => handleInputChange(e.target.value, 8)}
                  placeholder="e.g., 755"
                  className="font-mono"
                />
                <div className="text-xs text-muted-foreground">
                  Use digits: 0-7
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="decimal-input">Decimal (Base 10)</Label>
                <Input
                  id="decimal-input"
                  value={inputBase === 10 ? inputValue : decimal}
                  onChange={(e) => handleInputChange(e.target.value, 10)}
                  placeholder="e.g., 255"
                  className="font-mono"
                />
                <div className="text-xs text-muted-foreground">
                  Use digits: 0-9
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hex-input">Hexadecimal (Base 16)</Label>
                <Input
                  id="hex-input"
                  value={inputBase === 16 ? inputValue : hexadecimal}
                  onChange={(e) => handleInputChange(e.target.value, 16)}
                  placeholder="e.g., FF"
                  className="font-mono"
                />
                <div className="text-xs text-muted-foreground">
                  Use digits: 0-9, A-F
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {inputValue.trim() && !error && (
          <>
            <Separator />
            
            <div className="grid gap-4">
              {/* Conversion Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversion Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label>Binary (Base 2)</Label>
                        <Badge variant="outline" className="text-xs">
                          {getBitCount(binary)} bits
                        </Badge>
                      </div>
                      <div className="font-mono text-sm p-3 bg-muted rounded-md break-all">
                        <span className="text-muted-foreground mr-2">0b</span>
                        {formatBinaryWithSpaces(binary)}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Octal (Base 8)</Label>
                      <div className="font-mono text-sm p-3 bg-muted rounded-md break-all">
                        <span className="text-muted-foreground mr-2">0o</span>
                        {octal}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Decimal (Base 10)</Label>
                      <div className="font-mono text-sm p-3 bg-muted rounded-md break-all">
                        {decimal}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Hexadecimal (Base 16)</Label>
                      <div className="font-mono text-sm p-3 bg-muted rounded-md break-all">
                        <span className="text-muted-foreground mr-2">0x</span>
                        {hexadecimal}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Number Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Decimal Value:</span>
                      <span className="font-mono">{decimal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Binary Length:</span>
                      <span className="font-mono">{getBitCount(binary)} bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Byte Count:</span>
                      <span className="font-mono">{getByteCount(binary)} byte{getByteCount(binary) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Hex Length:</span>
                      <span className="font-mono">{hexadecimal.length} digit{hexadecimal.length !== 1 ? 's' : ''}</span>
                    </div>
                    {parseInt(decimal) <= 255 && (
                      <div className="flex justify-between">
                        <span className="font-medium">Fits in:</span>
                        <span className="text-green-600">8-bit byte (0-255)</span>
                      </div>
                    )}
                    {parseInt(decimal) <= 65535 && parseInt(decimal) > 255 && (
                      <div className="flex justify-between">
                        <span className="font-medium">Fits in:</span>
                        <span className="text-green-600">16-bit word (0-65535)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Common Values Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Values Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-4 gap-2 font-medium text-muted-foreground border-b pb-2">
                <span>Decimal</span>
                <span>Binary</span>
                <span>Octal</span>
                <span>Hex</span>
              </div>
              {[
                [0, '0', '0', '0'],
                [1, '1', '1', '1'],
                [8, '1000', '10', '8'],
                [16, '10000', '20', '10'],
                [32, '100000', '40', '20'],
                [64, '1000000', '100', '40'],
                [128, '10000000', '200', '80'],
                [255, '11111111', '377', 'FF'],
                [256, '100000000', '400', '100'],
                [512, '1000000000', '1000', '200'],
                [1024, '10000000000', '2000', '400']
              ].map(([dec, bin, oct, hex], index) => (
                <div key={index} className="grid grid-cols-4 gap-2 font-mono text-xs py-1 hover:bg-muted rounded">
                  <span>{dec}</span>
                  <span className="text-blue-600">{bin}</span>
                  <span className="text-green-600">{oct}</span>
                  <span className="text-purple-600">{hex}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <strong>Usage Tips:</strong> Enter a number in any base and see its representation in all other bases. 
          This tool is useful for programming, digital electronics, and computer science applications. 
          Maximum supported value is {Number.MAX_SAFE_INTEGER.toLocaleString()}.
        </div>
      </div>
    </ToolWrapper>
  )
}