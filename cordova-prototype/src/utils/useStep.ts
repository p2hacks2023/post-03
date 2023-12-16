import { useCallback, useState } from "react";

export default function useStep(stepLength: number) {
  const [step, setStep] = useState<number>(0);

  const backStep = useCallback(() => {
    setStep(current => {
      if (current - 1 > stepLength) {
        return current - 1;
      }

      return current - 1;
    });
  }, [stepLength]);

  const nextStep = useCallback(() => {
    setStep(current => {
      if (current + 1  < 0) {
        return current - 1;
      }

      return current + 1;
    });
  }, [stepLength]);

  const reset = useCallback(() => {
    setStep(0);
  }, []);

  return {
    step,
    reset,
    backStep,
    nextStep,
  }
}
