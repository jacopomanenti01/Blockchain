"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "../../createNFT/components/multi-step-form";
import type { Context } from "react";
import type { UseMultiStepFormTypeOptions } from "../../../app/types/multi-step-form";

interface MultiStepNavButtonsProps<T> {
    previousLabel: string;
    nextLabel: string;
    endStepLabel: string;
    context: Context<T>;
    debug?: boolean;
    onNext?: () => void;
}

function MultiStepNavButtons<T extends UseMultiStepFormTypeOptions<any>>({ previousLabel, nextLabel, endStepLabel, debug = false, context, onNext }: MultiStepNavButtonsProps<T>) {
    const { currentStep, isFirstStep, isLastStep, nextStep, previousStep } = useMultiStepForm(context);

    const handleNextClick = async () => {
        if (onNext) {
            await onNext();
        }
        if (!isLastStep) {
            nextStep();
        }
    };

    return (
        <div className='flex flex-row w-full justify-between mt-4'>
            {debug && (<pre className="flex justify-center items-center absolute w-32 h-32 right-2 bottom-2 bg-yellow-400 text-black text-sm border-2 rounded-md">{`Current Step: ${currentStep}`}</pre>)}
            <Button
                variant={'default'}
                size={'sm'}
                onClick={() => {
                    previousStep();
                }}
                type="button"
                className={cn(`${isFirstStep ? "invisible" : "visible"}`)}
            >
                {previousLabel}
            </Button>
            <Button
                variant={'default'}
                size={'sm'}
                onClick={handleNextClick}
                type={isLastStep ? "submit" : "button"}
            >
                {`${isLastStep ? endStepLabel : nextLabel}`}
            </Button>
        </div>
    );
}

export default MultiStepNavButtons;
