import React from "react";
import IndexLayout from '../layouts';
import { Helmet } from "react-helmet";
import Wrapper from "../components/Wrapper";
import SiteNav from "../components/header/SiteNav";
import { inner, SiteHeader, outer, SiteMain, postInner } from "../styles/shared";
import { NoImage, PostFull,PostFullHeader, PostFullTitle, } from "../templates/post";
import { PostFullContent } from "../components/PostContent";
import Footer from '../components/Footer';

interface ContributingProps {

}

const Contributing: React.FC<ContributingProps> = props => {
  return (
    <IndexLayout>
      <Helmet>
        <title>Contributing</title>
      </Helmet>

      <Wrapper>
      <header css={[outer, SiteHeader]}>
        <div css={inner}>
          <SiteNav />
        </div>
      </header>
      <main css={[SiteMain, outer, {background: '#fff', paddingBottom: '4vw'}]}>
        <article css={[PostFull, NoImage, postInner]}>
          <PostFullHeader>
            <PostFullTitle>How to Contribute</PostFullTitle>
          </PostFullHeader>

          <PostFullContent className="post-full-content">
            <p>
              Full-Stack HQ was created to help educate developers learn the entire stack of web development. 
              It is almost impossible to be an expert on the whole stack, and I recognize that I have not mastered 
              the entirety of any level of the stack. With that being said, I welcome contributions from talented developers 
              who share my passion for learning and teaching others.
            </p>
            <p>
              Some specific topics to write about:
            </p>
            <ul>
              <li>Front-End Frameworks (React, Angular, Vue)</li>
              <li>Web Application Architecture</li>
              <li>Backend Technologies (Spring Boot, Ruby on Rails, Golang, etc.)</li>
              <li>CICD</li>
              <li>Databases (SQL and NoSQL)</li>
              <li>Cloud Providers (GCP, AWS, Azure)</li>
            </ul>
            <p>
              If you are interested in contributing, please send an email to <a href="mailto: david@fullstackhq.io">david@fullstackhq.io</a>. 
              Let me know what you are interested in writing about and when to expect your first post to be done. I will let you 
              know what the next steps are from there.
            </p>
            <p>
              Thanks for your interest in making Full-Stack HQ better!
            </p>
          </PostFullContent>
        </article>
      </main>
      <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

export default Contributing;