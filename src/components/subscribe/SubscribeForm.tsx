import { darken, desaturate, lighten, mix } from 'polished';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import addToMailchimp from 'gatsby-plugin-mailchimp'

import { colors } from '../../styles/colors';
import config from '../../website-config';
import useSubscribeForm from './useSubscribeForm';
import { FormInputState, FormInputs } from '../../models/forms';

const SubscribeFormStyles = css`
  @media (max-width: 500px) {
    -ms-flex-direction: column;
    flex-direction: column;
  }
`;

const SubscribeEmail = styled.input`
  display: block;
  padding: 10px;
  width: 100%;
  /* border: color(var(--lightgrey) l(+7%)) 1px solid; */
  border: ${lighten('0.07', colors.lightgrey)};
  color: ${colors.midgrey};
  font-size: 1.8rem;
  line-height: 1em;
  font-weight: normal;
  user-select: text;
  border-radius: 5px;
  transition: border-color 0.15s linear;

  -webkit-appearance: none;
  :focus {
    outline: 0;
    /* border-color: color(var(--lightgrey) l(-2%)); */
    border-color: ${darken('0.02', colors.lightgrey)};
  }
`;

const SubscribeFormButton = styled.button`
  display: inline-block;
  margin: 0 0 0 10px;
  padding: 0 20px;
  height: 41px;
  outline: none;
  color: #fff;
  font-size: 1.5rem;
  line-height: 37px;
  font-weight: 400;
  text-align: center;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1);
  /* background: linear-gradient(
    color(var(--blue) whiteness(+7%)),
    color(var(--blue) lightness(-7%) saturation(-10%)) 60%,
    color(var(--blue) lightness(-7%) saturation(-10%)) 90%,
    color(var(--blue) lightness(-4%) saturation(-10%))
  ); */
  background: linear-gradient(
    ${mix('0.1', '#fff', colors.blue)},
    ${desaturate('0.1', darken('0.07', colors.blue))} 60%,
    ${desaturate('0.1', darken('0.07', colors.blue))} 90%,
    ${desaturate('0.1', darken('0.04', colors.blue))}
  );
  border-radius: 5px;
  box-shadow: 0 0 0 1px inset rgba(0, 0, 0, 0.14);

  -webkit-font-smoothing: subpixel-antialiased;

  :active,
  :focus {
    /* background: color(var(--blue) lightness(-9%) saturation(-10%)); */
    background: ${desaturate('0.1', darken('0.09', colors.blue))};
  }
  @media (max-width: 500px) {
    margin: 10px 0 0;
    width: 100%;
  }
`;

const FormGroup = styled.div`
  flex-grow: 1;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const subscribeFormInitialState: FormInputs = {
  email: {
    value: ''
  }
}

const MAILCHIMP_SUCCESS = 'success';
const MAILCHIMP_ERROR = 'error';

interface MailChimpResponse {
  result: string;
  msg: string;
}

interface SubscribeFormProps {
  key: number;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ key }: SubscribeFormProps) => {

  const subscribe = () => {
    addToMailchimp(inputs.email.value)
      .then((response: MailChimpResponse) => {
        setSubscribeResult(response.result);
      })
      .catch(error => {
        setSubscribeResult(MAILCHIMP_ERROR);
      });
    
  };

  const { inputs, handleChange, handleSubmit } = useSubscribeForm(subscribeFormInitialState, subscribe);
  const [ subscribeResult, setSubscribeResult ] = useState('');

  return (
    <>
    { !!subscribeResult && <div>Your submission has been received.</div> }
    { !subscribeResult && <form
      noValidate
      css={SubscribeFormStyles}
      id="mc-embedded-subscribe-form"
      name="mc-embedded-subscribe-form"
      target="_blank"
      onSubmit={handleSubmit}
      key={key}
    >
      {/* This is required for the form to work correctly  */}
      <FormGroup className="form-group">
        <SubscribeEmail
          className="subscribe-email"
          type="email"
          name="email"
          id="email"
          placeholder="youremail@example.com"
          onChange={handleChange}
          value={inputs.email.value}
          required
        />
        { inputs.email.errorMessage && <div>{inputs.email.errorMessage}</div> }
      </FormGroup>
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name={config.mailchimpName} tabIndex={-1} />
      </div>
      <SubscribeFormButton type="submit">
        <span>Subscribe</span>
      </SubscribeFormButton>
      
    </form>}
    </>
  );
};

export default SubscribeForm;
