import { useState, useEffect } from 'react'
import { ToolWrapper, InputOutput } from '@/components/ToolWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, AlertTriangle, Clock, Shield, Eye } from '@phosphor-icons/react'

interface JWTHeader {
  alg: string
  typ: string
  [key: string]: any
}

interface JWTPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: any
}

interface DecodedJWT {
  header: JWTHeader
  payload: JWTPayload
  signature: string
  isValid: boolean
  error?: string
}

export default function JWTDecoderTool() {
  const [jwtInput, setJwtInput] = useState('')
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState('')

  const decodeJWT = (token: string): DecodedJWT | null => {
    if (!token.trim()) {
      return null
    }

    try {
      const parts = token.trim().split('.')
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.')
      }

      const [headerPart, payloadPart, signaturePart] = parts

      // Decode header
      const headerDecoded = atob(headerPart.replace(/-/g, '+').replace(/_/g, '/'))
      const header: JWTHeader = JSON.parse(headerDecoded)

      // Decode payload
      const payloadDecoded = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'))
      const payload: JWTPayload = JSON.parse(payloadDecoded)

      return {
        header,
        payload,
        signature: signaturePart,
        isValid: true
      }
    } catch (err) {
      return {
        header: {} as JWTHeader,
        payload: {} as JWTPayload,
        signature: '',
        isValid: false,
        error: err instanceof Error ? err.message : 'Failed to decode JWT'
      }
    }
  }

  useEffect(() => {
    if (!jwtInput.trim()) {
      setDecoded(null)
      setError('')
      return
    }

    const result = decodeJWT(jwtInput)
    if (result) {
      setDecoded(result)
      setError(result.error || '')
    }
  }, [jwtInput])

  const formatTimestamp = (timestamp: number): string => {
    try {
      return new Date(timestamp * 1000).toLocaleString()
    } catch {
      return 'Invalid date'
    }
  }

  const isExpired = (exp?: number): boolean => {
    if (!exp) return false
    return Date.now() / 1000 > exp
  }

  const isNotValidYet = (nbf?: number): boolean => {
    if (!nbf) return false
    return Date.now() / 1000 < nbf
  }

  const getTimeUntilExpiry = (exp?: number): string => {
    if (!exp) return ''
    
    const now = Date.now() / 1000
    const diff = exp - now
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzM4NTQ4MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

  const loadSample = () => {
    setJwtInput(sampleJWT)
  }

  return (
    <ToolWrapper title="JWT Decoder & Validator">
      <div className="space-y-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="jwt-input">JWT Token</Label>
            <Button size="sm" variant="outline" onClick={loadSample}>
              Load Sample
            </Button>
          </div>
          <Textarea
            id="jwt-input"
            value={jwtInput}
            onChange={(e) => setJwtInput(e.target.value)}
            placeholder="Paste your JWT token here..."
            rows={4}
            className="font-mono text-sm"
          />
          
          {error && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {decoded && decoded.isValid && (
          <div className="space-y-6">
            <Separator />

            {/* Token Status */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                <CheckCircle size={14} className="mr-1" />
                Valid JWT Format
              </Badge>
              
              {decoded.payload.exp && (
                <Badge 
                  variant={isExpired(decoded.payload.exp) ? "destructive" : "outline"}
                  className={isExpired(decoded.payload.exp) ? "" : "text-green-600 bg-green-50"}
                >
                  <Clock size={14} className="mr-1" />
                  {isExpired(decoded.payload.exp) ? 'Expired' : `Expires in ${getTimeUntilExpiry(decoded.payload.exp)}`}
                </Badge>
              )}

              {decoded.payload.nbf && isNotValidYet(decoded.payload.nbf) && (
                <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">
                  <Clock size={14} className="mr-1" />
                  Not valid yet
                </Badge>
              )}

              <Badge variant="outline">
                <Shield size={14} className="mr-1" />
                {decoded.header.alg} Algorithm
              </Badge>
            </div>

            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  Header
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="font-mono text-sm bg-muted p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Algorithm:</span>
                    <span className="font-mono">{decoded.header.alg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span className="font-mono">{decoded.header.typ}</span>
                  </div>
                  {Object.entries(decoded.header)
                    .filter(([key]) => !['alg', 'typ'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span className="font-mono">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-500 rounded"></span>
                  Payload (Claims)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="font-mono text-sm bg-muted p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
                
                {/* Standard Claims */}
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-sm">Standard Claims:</h4>
                  <div className="grid gap-2 text-sm">
                    {decoded.payload.iss && (
                      <div className="flex justify-between">
                        <span className="font-medium">Issuer (iss):</span>
                        <span className="font-mono">{decoded.payload.iss}</span>
                      </div>
                    )}
                    {decoded.payload.sub && (
                      <div className="flex justify-between">
                        <span className="font-medium">Subject (sub):</span>
                        <span className="font-mono">{decoded.payload.sub}</span>
                      </div>
                    )}
                    {decoded.payload.aud && (
                      <div className="flex justify-between">
                        <span className="font-medium">Audience (aud):</span>
                        <span className="font-mono">
                          {Array.isArray(decoded.payload.aud) 
                            ? decoded.payload.aud.join(', ') 
                            : decoded.payload.aud}
                        </span>
                      </div>
                    )}
                    {decoded.payload.exp && (
                      <div className="flex justify-between">
                        <span className="font-medium">Expires (exp):</span>
                        <span className="font-mono">
                          {formatTimestamp(decoded.payload.exp)}
                          {isExpired(decoded.payload.exp) && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Expired
                            </Badge>
                          )}
                        </span>
                      </div>
                    )}
                    {decoded.payload.nbf && (
                      <div className="flex justify-between">
                        <span className="font-medium">Not Before (nbf):</span>
                        <span className="font-mono">
                          {formatTimestamp(decoded.payload.nbf)}
                          {isNotValidYet(decoded.payload.nbf) && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-yellow-100 text-yellow-800">
                              Not Yet Valid
                            </Badge>
                          )}
                        </span>
                      </div>
                    )}
                    {decoded.payload.iat && (
                      <div className="flex justify-between">
                        <span className="font-medium">Issued At (iat):</span>
                        <span className="font-mono">{formatTimestamp(decoded.payload.iat)}</span>
                      </div>
                    )}
                    {decoded.payload.jti && (
                      <div className="flex justify-between">
                        <span className="font-medium">JWT ID (jti):</span>
                        <span className="font-mono">{decoded.payload.jti}</span>
                      </div>
                    )}
                  </div>

                  {/* Custom Claims */}
                  {Object.keys(decoded.payload).some(key => !['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'].includes(key)) && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Custom Claims:</h4>
                      <div className="grid gap-2 text-sm">
                        {Object.entries(decoded.payload)
                          .filter(([key]) => !['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span className="font-mono break-all">{JSON.stringify(value)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span>
                  Signature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm bg-muted p-3 rounded-md break-all">
                  {decoded.signature}
                </div>
                <div className="mt-3 text-sm text-muted-foreground flex items-start gap-2">
                  <Eye size={14} className="mt-0.5 flex-shrink-0" />
                  <span>
                    The signature is used to verify that the sender of the JWT is who it says it is 
                    and to ensure that the message wasn't changed along the way. To verify the signature, 
                    you need the secret key used to sign the token.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Warning */}
        <div className="text-xs text-muted-foreground p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <strong>Security Notice:</strong> This tool only decodes JWT tokens and does not verify signatures. 
          Never share JWT tokens containing sensitive information. In production, always verify JWT signatures 
          server-side using the appropriate secret or public key.
        </div>

        {/* Help */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <strong>About JWTs:</strong> JSON Web Tokens (JWT) are a compact, URL-safe means of representing 
          claims between two parties. They consist of three parts: header.payload.signature, each base64url encoded.
        </div>
      </div>
    </ToolWrapper>
  )
}