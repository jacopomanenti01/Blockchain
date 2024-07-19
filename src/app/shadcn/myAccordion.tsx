import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

function MyAccordion() {
  return (
    
    <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
        <AccordionTrigger>provo</AccordionTrigger>
        <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
        <AccordionTrigger>rpova</AccordionTrigger>
        <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
    </AccordionItem>
    </Accordion>

  )
}

export default MyAccordion