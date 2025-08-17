import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

interface FormProviderProps {
  children: ReactNode;
}

interface FormProps {
  data: { [key: string]: number | null };
}

interface FormContextProps {
  form: FormProps | undefined;
  setForm: React.Dispatch<React.SetStateAction<FormProps | undefined>>;
}

export const FormContext = createContext<FormContextProps | undefined>(undefined);

export function FormProvider({ children }: FormProviderProps) {
  const [form, setForm] = useState<FormProps | undefined>(undefined);

  return (
    <FormContext.Provider value={{ form, setForm }}>
      {children}
    </FormContext.Provider>
  )
}