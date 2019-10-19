export interface WebsiteConfig {
  title: string;
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
  description: 'A Blog dedicated to busting the Full-Stack myth.',
  coverImage: 'blog-cover.jpg',
  logo: 'ghost-logo.png',
  lang: 'en',
  siteUrl: 'https://fullstackhq.io',
  facebook: '',
  twitter: 'https://twitter.com/full_stack_hq',
  showSubscribe: true,
  mailchimpName: 'b_b8e63fd1a9dc032f08808fa81_406859c1ec',
  googleSiteVerification: '',
  footer: '',
};

export default config;
