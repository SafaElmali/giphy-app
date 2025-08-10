import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Your New React App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This app is set up with Vite, TypeScript, and shadcn/ui.
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  )
}