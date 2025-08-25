import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/co
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// Tool Components - importing just one for debugging

  return (

// Tool Components - importing just one for debugging
import Base64Tool from '@/components/tools/Base64Tool'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
          </CardContent>
          <h1 className="text-4xl font-bold text-foreground mb-4">
  )
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Testing single component import

        </div>

        <Card className="shadow-sm">

            <CardTitle className="text-xl">Base64 Encoder/Decoder</CardTitle>
            <CardDescription>Encode and decode Base64 strings</CardDescription>
          </CardHeader>

            <Base64Tool />

        </Card>

    </div>

}

export default App