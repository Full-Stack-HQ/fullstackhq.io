import { graphql } from 'gatsby';
import IndexLayout from '../layouts';
import Wrapper from '../components/Wrapper';
import SiteNav from '../components/header/SiteNav';
import { SiteHeader, outer, inner, SiteMain, ImageLabel, postInner } from '../styles/shared';
import * as React from 'react';
import { css } from '@emotion/core';

import { PostFullHeader, PostFullTitle, NoImage, PostFull } from '../templates/post';
import { PostFullContent } from '../components/PostContent';
import Footer from '../components/Footer';
import Helmet from 'react-helmet';
import { pageBreaks } from '../styles/page-breaks';

const PageTemplate = css`
  .site-main {
    background: #fff;
    padding-bottom: 4vw;
  }
  @media (max-width: ${pageBreaks.large}) {
    img {
      width: unset;
    }
  }
  
`;

const DevTypesWrapperStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 3rem;
  img {
    margin-bottom: 0;
  }
  
  @media (max-width: ${pageBreaks.medium}) {
    grid-template-columns: 1fr;
  }
`;

interface AboutProps {
  data: {
    fullStackMyth: {
      childImageSharp: {
        fixed: any;
      };
    };
    frontend: {
      childImageSharp: {
        fixed: any;
      };
    };
    backend: {
      childImageSharp: {
        fixed: any;
      };
    };
    devops: {
      childImageSharp: {
        fixed: any;
      };
    };
    tshaped: {
      childImageSharp: {
        fixed: any;
      };
    };
  }
}

const About: React.FC<AboutProps> = props => { 
  return (
    <IndexLayout>
      <Helmet>
        <title>About</title>
      </Helmet>
      <Wrapper css={PageTemplate}>
        <header css={[outer, SiteHeader]}>
          <div css={inner}>
            <SiteNav />
          </div>
        </header>
        <main id="site-main" className="site-main" css={[SiteMain, outer]}>
          <article className="post page" css={[PostFull, NoImage, postInner]}>
            <PostFullHeader>
              <PostFullTitle>Welcome to Full-Stack HQ</PostFullTitle>
            </PostFullHeader>

            <PostFullContent className="post-full-content">
              <div className="post-content">
                <p>
                  The existence of full-stack developers is one of the most debated topics in web development. 
                  A lot of people think it's impossible for someone to have sufficient knowledge in the entire stack 
                  to be able to call themselves a full-stack developer. This is what they generally think of. 
                </p>
                <img src={props.data.fullStackMyth.childImageSharp.fixed.src} />
                <p>
                  Let's call these people "square" developers. They can be asked to write the front-end, back-end, 
                  and handle DevOps for an application and will do all of them excellently. These developers are so rare 
                  they might as well be a myth. 
                </p>

                <p>Most other developers fall into one of these other categories or a variation of one of them:</p>
                <div css={DevTypesWrapperStyles}>
                  <div>
                    <img src={props.data.devops.childImageSharp.fixed.src} />
                    <div css={ImageLabel}>DevOps Engineer</div>
                  </div>
                  <div>
                    <img src={props.data.frontend.childImageSharp.fixed.src} />
                    <div css={ImageLabel}>Front-End Engineer</div>
                  </div>
                  <div>
                    <img src={props.data.backend.childImageSharp.fixed.src} />
                    <div css={ImageLabel}>Back-End Engineer</div>
                  </div>
                </div>
                <p>
                  These developers are hired as a front-end engineer or a back-end engineer and are only expected to 
                  contribute in that way. This is fine for some people, especially entry level developers who are still 
                  working on being proficient in just one of the levels of the web stack. But for developers who want to climb 
                  the corporate ladder, create the next unicorn startup, or just become more valuable to their teams, having a 
                  knowledge of all parts of the stack is crucial.
                </p>
                <p>
                  I am extremely passionate about learning and I believe it is essential as a software developer, given how 
                  fast things change in this industry. The hope behind Full-Stack HQ is to help developers expand their 
                  breadth of knowledge in areas that might be outside of their current comfort zone, or to dive deeper in their main 
                  area of strength. My goal is to help create "T-shaped" developers that have an expertise in at least one area, 
                  and knowledge of all other areas. 
                </p>

                <img src={props.data.tshaped.childImageSharp.fixed.src} />

                <p>Have fun and happy developing!</p>

                <p>- David Seybold</p>
              </div>
            </PostFullContent>
          </article>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
}

export default About;

export const query = graphql`
  query {
    fullStackMyth: file(relativePath: { eq: "full-stack-myth.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
    devops: file(relativePath: { eq: "devops-dev.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
    backend: file(relativePath: { eq: "back-end-dev.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
    frontend: file(relativePath: { eq: "front-end-dev.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
    tshaped: file(relativePath: { eq: "t-shaped-dev.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;
