import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shuffle } from '@phosphor-icons/react'

export default function AESEncryptionTool() {
  const [plaintext, setPlaintext] = useState('')
  const [ciphertext, setCiphertext] = useState('')
  const [encryptKey, setEncryptKey] = useState('')
  const [decryptKey, setDecryptKey] = useState('')
  const [encrypted, setEncrypted] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const [encryptError, setEncryptError] = useState('')
  const [decryptError, setDecryptError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const generateKey = () => {
    const array = new Uint8Array(32) // 256 bits
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  const encryptText = async (text: string, key: string): Promise<string> => {
    if (!text || !key) return ''
    
    try {
      if (key.length !== 64) {
        throw new Error('Key must be 64 characters (256 bits) long')
      }

      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      
      // Convert hex key to ArrayBuffer
      const keyBytes = new Uint8Array(key.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      )

      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12))
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
      )

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encryptedData), iv.length)
      
      return Array.from(combined, byte => byte.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const decryptText = async (cipherHex: string, key: string): Promise<string> => {
    if (!cipherHex || !key) return ''
    
    try {
      if (key.length !== 64) {
        throw new Error('Key must be 64 characters (256 bits) long')
      }

      // Convert hex strings to ArrayBuffer
      const cipherBytes = new Uint8Array(cipherHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
      const keyBytes = new Uint8Array(key.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )

      // Extract IV and encrypted data
      const iv = cipherBytes.slice(0, 12)
      const encryptedData = cipherBytes.slice(12)

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedData
      )

      const decoder = new TextDecoder()
      return decoder.decode(decryptedData)
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Invalid ciphertext or key'}`)
    }
  }

  useEffect(() => {
    if (plaintext && encryptKey) {
      setIsProcessing(true)
      encryptText(plaintext, encryptKey)
        .then(result => {
          setEncrypted(result)
          setEncryptError('')
        })
        .catch(error => {
          setEncrypted('')
          setEncryptError(error.message)
        })
        .finally(() => setIsProcessing(false))
    } else {
      setEncrypted('')
      setEncryptError('')
    }
  }, [plaintext, encryptKey])

  useEffect(() => {
    if (ciphertext && decryptKey) {
      setIsProcessing(true)
      decryptText(ciphertext, decryptKey)
        .then(result => {
          setDecrypted(result)
          setDecryptError('')
        })
        .catch(error => {
          setDecrypted('')
          setDecryptError(error.message)
        })
        .finally(() => setIsProcessing(false))
    } else {
      setDecrypted('')
      setDecryptError('')
    }
  }, [ciphertext, decryptKey])

  return (
    <ToolWrapper title="AES Encryption/Decryption">
      <div className="mb-4 p-3 bg-muted rounded-md text-sm">
        <strong>Security Notice:</strong> This tool uses AES-256-GCM encryption. 
        Keys are 256-bit (64 hex characters). Never share your encryption keys.
      </div>
      
      <Tabs defaultValue="encrypt" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="mt-6 space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="encrypt-key">Encryption Key (256-bit hex)</Label>
              <Input
                id="encrypt-key"
                value={encryptKey}
                onChange={(e) => setEncryptKey(e.target.value)}
                placeholder="Enter 64-character hex key or generate one..."
                className="font-mono text-sm"
              />
            </div>
            <Button 
              onClick={() => setEncryptKey(generateKey())}
              variant="outline"
              size="sm"
              className="mb-0"
            >
              <Shuffle size={16} />
              Generate
            </Button>
          </div>
          
          {encryptKey && encryptKey.length !== 64 && (
            <Badge variant="destructive" className="text-xs">
              Key must be exactly 64 characters
            </Badge>
          )}

          <InputOutput
            inputLabel="Text to Encrypt"
            outputLabel="Encrypted Data (Hex)"
            inputValue={plaintext}
            outputValue={isProcessing ? 'Encrypting...' : encrypted}
            onInputChange={setPlaintext}
            placeholder="Enter text to encrypt..."
            error={encryptError}
            outputRows={6}
          />
        </TabsContent>

        <TabsContent value="decrypt" className="mt-6 space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="decrypt-key">Decryption Key (256-bit hex)</Label>
              <Input
                id="decrypt-key"
                value={decryptKey}
                onChange={(e) => setDecryptKey(e.target.value)}
                placeholder="Enter the same key used for encryption..."
                className="font-mono text-sm"
              />
            </div>
          </div>

          {decryptKey && decryptKey.length !== 64 && (
            <Badge variant="destructive" className="text-xs">
              Key must be exactly 64 characters
            </Badge>
          )}

          <InputOutput
            inputLabel="Encrypted Data (Hex)"
            outputLabel="Decrypted Text"
            inputValue={ciphertext}
            outputValue={isProcessing ? 'Decrypting...' : decrypted}
            onInputChange={setCiphertext}
            placeholder="Enter hex-encoded encrypted data..."
            error={decryptError}
            outputRows={4}
          />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}