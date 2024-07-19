import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowDown } from 'lucide-react'


function MyAlert() {
  return (
    <div>
    <Alert variant={"destructive"}>
        <ArrowDown  className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
        You can add components and dependencies to your app using the cli.
        </AlertDescription>
    </Alert>
  </div>
  )
}

export default MyAlert