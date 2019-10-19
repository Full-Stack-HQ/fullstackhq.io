import { FormEvent, useState } from "react";
import { FormInputs } from "../../models/forms";

const VALID_EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const useSubscribeForm = (initialValues: FormInputs, callback: () => void) => {

  const [ inputs, setInputs ] = useState(initialValues);

  const reset = () => {
    Object.keys(inputs).forEach(inputName => {
      inputs[inputName].value = '';
      inputs[inputName].errorMessage = '';
    });
    setInputs(inputs);
  };

  const handleSubmit = (event: FormEvent<Element>) => {
    if (event) {
      event.preventDefault();
    }

    console.log('submit')

    const errorMessage = getErrorMessage('email', inputs.email.value);
    if (errorMessage) {
      setInputs(inputs => ({
          ...inputs,
          email: {
            value: inputs.email.value,
            errorMessage,
          },
        })
      );
    } else {
      callback();
    }
    
  };

  const handleChange = (event: FormEvent<Element>) => {
    event.persist();
    console.log('change')
    const { name, value } = (event.target);
    setInputs(inputs => {
      return {
        ...inputs,
        [name]: {
          value,
          errorMessage: ''
        }
      };
    });
  };

  return {
    handleSubmit,
    handleChange,
    inputs,
    reset,
  };
};

function getErrorMessage(inputName: string, value: string): string | undefined {
  console.log('getErrorMessage');
  switch (inputName) {
    case 'email': 
      if (!value) {
        return 'Please enter an email.'
      }
      return VALID_EMAIL_REGEX.test(value) ? undefined : 'Email is not valid!';
    default:
      return undefined;
  }
}

export default useSubscribeForm;