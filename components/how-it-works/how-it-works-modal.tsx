'use client'

import { useState } from 'react'
import { Info, Image, ChevronRight, ChevronLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getAppSteps, hasHowItWorksContent, Step } from './step-content'

interface StepContentProps {
  step: Step
  stepIndex: number
}

function StepContent({ step, stepIndex }: StepContentProps) {
  const isIntro = stepIndex === 0
  
  return (
    <div className="flex flex-col items-center text-center">
      {/* Media Placeholder */}
      <div className="w-full max-w-md aspect-video rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center mb-6">
        <div className="flex flex-col items-center gap-2 text-zinc-600">
          <Image className="h-12 w-12" />
          <span className="text-sm">GIF placeholder</span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-zinc-100 mb-3">
        {step.title}
      </h3>
      
      {/* Description */}
      <p className={cn(
        "text-base leading-relaxed max-w-sm",
        isIntro ? "text-zinc-300" : "text-zinc-400"
      )}>
        {step.description}
      </p>
    </div>
  )
}

interface HowItWorksModalProps {
  appSlug: string
  communityName: string
}

export function HowItWorksModal({ appSlug, communityName }: HowItWorksModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  
  const steps = getAppSteps(appSlug, communityName)
  
  // Don't render if no content for this app
  if (!hasHowItWorksContent(appSlug) || steps.length === 0) {
    return null
  }
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset to first step when closing
      setCurrentStep(0)
    }
  }
  
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-xs"
        >
          <Info className="h-3.5 w-3.5" />
          <span>How it works</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg p-0" hideCloseButton>
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">How it works</DialogTitle>
        
        {/* Close button */}
        <DialogClose className="absolute right-3 top-3 p-1.5 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        {/* Step Content */}
        <div className="p-6 pt-10">
          <StepContent step={steps[currentStep]} stepIndex={currentStep} />
        </div>
        
        {/* Footer with navigation */}
        <div className="border-t border-zinc-800/50 p-4">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentStep 
                    ? "bg-blue-500 w-6" 
                    : "bg-zinc-700 hover:bg-zinc-600"
                )}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={isFirstStep}
              className={cn(
                "gap-1 text-zinc-400",
                isFirstStep && "invisible"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              size="sm"
              onClick={isLastStep ? () => handleOpenChange(false) : handleNext}
              className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLastStep ? 'Got it' : 'Next'}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowItWorksModal
