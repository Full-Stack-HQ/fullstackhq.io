
export interface FormInputState {
  value: string;
  errorMessage?: string;
}

export interface FormInputs {
  [key: string]: FormInputState;
}