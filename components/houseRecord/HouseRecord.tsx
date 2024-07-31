import React, { Children } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '../ui/button'
import Link from 'next/link'


interface HouseRecordProps {
  children : React.ReactNode,
  label: string,
  title: string,
  backButtonHrf: string

}
  

function HouseRecord({label, title, backButtonHrf, children}:HouseRecordProps) {
  return (
    <Card className="xl:w-1/4 md:w-1/2 shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter>
        <Button  variant="link" size="sm" >
          <Link href={backButtonHrf} >
          {label}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default HouseRecord