import React from "react"
import styled from "@emotion/styled";
import { css } from '@emotion/core';
import Search from "emotion-icons/fa-solid/Search"
import Algolia from "emotion-icons/fa-brands/Algolia"

export const Root = styled.div`
  position: relative;
  display: grid;
  grid-gap: 1em;
`

export const SearchIcon = styled(Search)`
  width: 1em;
  pointer-events: none;
`

const focus = props => css`
  background: white;
  color: #003366;
  cursor: text;
  width: 5em;
  + ${SearchIcon} {
    color: #003366;
    margin: 0.3em;
  }
`;

const collapse = props => css`
  width: 0;
  cursor: pointer;
  color: #add8e6;
  margin-left: ${props.focus ? `-1.6em` : `-1em`};
  padding-left: ${props.focus ? `1.6em` : `1em`};
  ::placeholder {
    color: #808080;
  }
  + ${SearchIcon} {
    color: white;
  }
`;


const expand = props => css`
  background: #D3D3D3;
  width: 6em;
  margin-left: -1.6em;
  padding-left: 1.6em;
  + ${SearchIcon} {
    margin: 0.3em;
  }
`;

export const Input = styled.input`
  outline: none;
  border: none;
  font-size: 1em;
  background: transparent;
  transition: box-shadow .4s ease, background .4s ease;
  border-radius: 16px;
  {highlight-next-line}
  ${props => (props.collapse ? collapse : expand)};
`

export const Form = styled.form`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`

export const HitsWrapper = styled.div`
  display: ${props => (props.show ? `grid` : `none`)};
  max-height: 80vh;
  overflow: scroll;
  z-index: 2;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  right: 0;
  top: calc(100% + 0.5em);
  width: 80vw;
  max-width: 30em;
  box-shadow: 0 0 5px 0;
  padding: 0.7em 1em 0.4em;
  background: white;
  border-radius: 16px;
  > * + * {
    padding-top: 1em !important;
    border-top: 2px solid #a9a9a9;
  }
  li + li {
    margin-top: 0.7em;
    padding-top: 0.7em;
    border-top: 1px solid #D3D3D3;
  }
  * {
    margin-top: 0;
    padding: 0;
  }
  ul {
    list-style: none;
  }
  mark {
    color: #add8e6;
    background: #003366;
  }
  header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3em;
    h3 {
      color: white;
      background: #D3D3D3;
      padding: 0.1em 0.4em;
      border-radius: 16px;
    }
  }
  h3 {
    margin: 0 0 0.5em;
  }
  h4 {
    margin-bottom: 0.3em;
  }
`

export const PoweredBy = () => (
  <span css={{
    fontSize: '0.6em',
    textAlign: 'end',
    padding: 0
    }}>
    Powered by{` `}
    <a href="https://algolia.com">
      <Algolia size="1em" /> Algolia
    </a>
  </span>
)