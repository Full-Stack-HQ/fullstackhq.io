import React from "react";
import { StaticQuery, graphql } from "gatsby";
import styled from '@emotion/styled';
import Img from 'gatsby-image';
import { Link } from "@reach/router";

const NoPostsWrapper = styled.div`
  margin-bottom: 2em;
  margin-top: 2em;
  text-align: center;
`;

const NoPostsImage = styled.div`
  margin: auto;
  max-width: 800px;
`;

const ContributingMessage = styled.div`

`;

interface NoPostsQuery {
  blankImage: {
    childImageSharp: {
      fluid: any;
    }
  }
}

const NoPosts = () => {
  return (
    <StaticQuery
      query={graphql`
        query NoPostsQuery {
          blankImage: file(relativePath: { eq: "empty-paper.jpg" }) {
            childImageSharp {
              # Specify the image processing specifications right in the query.
              # Makes it trivial to update as your page's design changes.
              fluid(maxWidth: 400) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={({ blankImage }: NoPostsQuery) => (
        <NoPostsWrapper>
          <NoPostsImage>
            <Img
            alt="Empty paper"
            style={{ height: '100%'}}
            fluid={blankImage.childImageSharp.fluid}
            />
          </NoPostsImage>
          <ContributingMessage>
            <p>There's nothing here yet!</p>
            <p>
              We are hard at work creating meaningful posts, but haven't gotten around to creating 
              any here.
            </p>
            <p>If you are interested in helping us out and contributing, find out more info <Link to="/contributing">here</Link>.</p>
          </ContributingMessage>
        </NoPostsWrapper>
      )}
    />
  );
};

export default NoPosts;