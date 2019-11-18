export interface WebsiteConfig {
  title: string;
  slogan: string;
  description: string;
  coverImage: string;
  logo: string;
  /**
   * Specifying a valid BCP 47 language helps screen readers announce text properly.
   * See: https://dequeuniversity.com/rules/axe/2.2/valid-lang
   */
  lang: string;
  /**
   * blog full path, no ending slash!
   */
  siteUrl: string;
  /**
   * full url, no username
   */
  facebook?: string;
  /**
   * full url, no username
   */
  twitter?: string;
  /**
   * full url, no username
   */
  github?: string;
  /**
   * hide or show all email subscribe boxes
   */
  showSubscribe: boolean;
  /**
   * create a list on mailchimp and then create an embeddable signup form. this is the form action
   */
  mailchimpAction?: string;
  /**
   * this is the hidden input field name
   */
  mailchimpName?: string;
  /**
   * name and id of the mailchimp email field
   */
  mailchimpEmailFieldName?: string;
  /**
  /**
   * Meta tag for Google Webmaster Tools
   */
  googleSiteVerification?: string;
  /**
  /**
   * Appears alongside the footer, after the credits
   */
  footer?: string;
}

const config: WebsiteConfig = {
  title: 'Full-Stack HQ',
  slogan: 'Learn. Build. Share. Repeat.',
  description: 'Learn. Build. Share. Repeat. At Full-Stack HQ we want to be the resource that helps you take your skills to the next level.',
  coverImage: 'blog-cover.jpg',
  logo: 'full-stack-hq-logo.png',
  lang: 'en',
  siteUrl: 'https://fullstackhq.io',
  // facebook: '',
  // twitter: 'https://twitter.com/full_stack_hq',
  // github: 'https://github.com/Full-Stack-HQ',
  showSubscribe: true,
  mailchimpName: 'b_b8e63fd1a9dc032f08808fa81_406859c1ec',
  googleSiteVerification: '',
  footer: '',
};

export default config;
