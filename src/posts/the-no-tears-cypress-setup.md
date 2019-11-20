---
layout: post
title: The No Tears Cypress Setup
image: /images/uploads/tim-gouw-1k9t5yiz2wu-unsplash.jpg
imageCreditText: Photo by Tim Gouw on Unsplash
imageCreditLink: 'https://unsplash.com/photos/1K9T5YiZ2WU'
author: David Seybold
tags:
  - front-end
date: 2019-11-20T12:00:11.722Z
draft: false
---
 Testing the user interface of a web application is one of the most frustrating aspects of web development. Tests are usually flaky, hard to write, and even harder to debug when something isn't working. Most current solutions like Protractor and Nightwatch are based on Selenium. This adds maintaining a Selenium grid or using a third-party grid, to the list of things to keep track of and maintain. It is not fun for anyone involved.
 
Enter Cypress. 
 
Cypress is a relatively new player to the end-to-end testing field, having only been around since 2015, but it is already taking the front-end community by storm. It makes writing tests feel more like you are writing application code, resulting in better tests and a better development experience. I won't spend any more time explaining how great Cypress is as I will assume that if you are here trying to set it up, that you have at least already been convinced or are ready to try it out for yourself.
 
While Cypress is awesome, when I was setting up my implementation I found that there were a lot of different resources on how to set up parts of the framework. If I wanted to see how to add Typescript I needed to go to one place, then for cucumber somewhere else, and another for anything else I wanted to add. Sometimes the different setups would clash and I ended up spending a lot of time trying to debug problems with my setup that could have been avoided.
 
My goal with this walk-through is to show you an easy way to set up Cypress. I am going to show you how to add Typescript, configure multiple configuration files for different environments, and how to add cucumber support. By the end of the article, you should be well on your way to writing your tests having already gotten the hassle of setup out of the way.
 
### Install Cypress
Before we do anything we need to install Cypress. I will be starting on a brand new Angular application but I won't be showing anything specific to Angular in this walk-through so you can use an Angular, React, or just a plain npm project to follow along.
```sh
➜ npm install -D cypress
```
This may take a few minutes as it will install the Javascript package and the Cypress binary needed to execute tests. The install does not create the folder structure we need for Cypress, this instead happens the first time that you start Cypress. So let's go ahead and add an npm script that we will use throughout this post to start Cypress. Go ahead and run it when you are done.
```json
"cypress:open": "$(npm bin)/cypress open"
```
When this command is run it will open the Cypress test runner. Since this is the first time we are running it, it will generate the folder structure and some sample tests that we can use to test how Cypress works. Once the UI opens feel free to spend some time familiarizing yourself with the test runner. When you are done, kill the test runner and let's look at what was generated.
 
### File structure
After initialization, there will be a `cypress` folder that gets initialized inside the root directory of your application. Inside that folder, four more will also have been created. 
```
- cypress
 |- fixtures
 |- integration
 |- plugins
 |- support
```
###### fixtures
The fixtures folder is where you can store static data used throughout your tests. This can include test data or mock responses. We won't spend much time talking about this part of Cypress, but if you are interested in learning more I would start [here](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Fixture-Files).
 
###### integration
This folder is where all of your tests will live. The sample tests that you experimented with earlier will all have been generated here.
 
###### plugins
Cypress has a node process that can be used to extend some of its functionality. This includes configuring file pre-processors or loading configurations, both of which I will cover later on.
 
###### support
Out of the box, Cypress provides the `support/index.js` file that will be run before every spec file. It can be used for several things such as a global beforeEach hook, overrides, and setting up custom commands which I will demonstrate as part of this post.
 
### Write Your Tests in Typescript
By default, Cypress expects your tests to be written in Javascript. This is fine however, I am a big advocate for writing as much of your codebase in Typescript as possible. Just like the code of your main application, your tests should be easy to maintain and easy for someone who has never seen your codebase to be able to understand what is happening.
 
To write our tests in Typescript we need to take advantage of the plugin capability of Cypress. We are going to add a file pre-processor that will transpile any Typescript files we have to Javascript before running the tests. To do this we will need to install a few dependencies. 
```sh
➜ npm install -D ts-loader @cypress/webpack-preprocessor @babel/core @babel/preset-env babel-loader webpack typescript
```
You may have already installed some of these or they could exist as part of a transient dependency inside your project.
 
Next, we will create a webpack config file inside our cypress folder with the following contents:
```js
// cypress/webpack.config.js
module.exports = {
  resolve: {
    extensions: [".ts", ".js"]
  },
  node: { fs: "empty", child_process: "empty", readline: "empty" },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
          loader: "ts-loader"
          }
        ]
      }
    ]
  }
};
```
Here we will be telling webpack to use the `ts-loader` package to transpile all of the `.ts` files. There are other possible loaders that you could use here, if you prefer, however this setup will work as is.

We also need to add a `tsconfig.json` file to our cypress directory. This is a basic one that you can use. They most important part is the `cypress` inside the types array as this is how your IDE will be able to use intellisense. If you would like to maintain consistency with the rest of your Typescript application, you can extend your base `tsconfig.json` and simply add the Cypress types to here.
```json
{
  "compilerOptions": {
  "strict": true,
  "baseUrl": "../node_modules",
  "target": "es5",
  "lib": ["es5", "dom"],
  "types": ["cypress"]
  },
  "include": [
    "**/*.ts"
  ]
}
```
Now, we need to tell Cypress to pre-process our test files with webpack and our webpack config. As you may have guessed from the earlier explanations of the file structure, this occurs inside the plugins directory in the `index.js` file. I am going to create a new file inside the plugins directory called `preprocess.js` inside which I will do all of the pre-processing logic that we need to do. It is not necessary to create a separate file, but it helps to simplify the `index.js` file.
 
Here is the contents of that file:
```js
const webpack = require('@cypress/webpack-preprocessor')
 
const options = {
 webpackOptions: require("../webpack.config.js")
};
 
module.exports = webpack(options)
```
In this file, we are passing the webpack config that we created earlier, into the Cypress webpack pre-processor. Cypress still doesn't know about our pre-processor yet. To do that we will have to import our preprocess file into the `index.js` file and add one more line.
```js
const preprocess = require('./preprocess');
 
module.exports = (on, config) => {
 on("file:preprocessor", preprocess);
}
```
That's it. Now we should be able to write our tests in Typescript. Let's not take my word for it though. We should add a sample test to verify everything is working correctly. Go ahead and remove all of the tests that were created by the initialization process. Create a folder called `google` and a file inside that called `search.spec.ts` with these contents.
```ts
// cypress/google/search.spec.ts
describe('When I visit Google', () => {
  beforeEach(() => {
    cy.visit('https://google.com/imghp')
  });
  
  it('I should be able to search', () => {
    cy.get('input[title="Search"]')
      .type('cat pictures{enter}');
  })
});
```
This is a super simple test that goes to the Google Images page and searches for cat pictures, because who doesn't love a good cat picture. To test this, in your terminal run `npm run cypress:open` which is the command we configured earlier. The Cypress test runner should open and you should be able to select our new test and run it. It _should_ pass. If for some reason it doesn't, go back and double check that you have added everything correctly. I know from personal experience that it is easy to make a small typo that throws off everything.
 
### Separate Environment Configurations
Most established applications have at least two environments: a place to test new code (QA) and then the customer-facing application (prod). Some applications will have more, sometimes up to seven and it is important to be able to run your tests against all environments that you need to.
 
Cypress can do this through the use of custom configuration files that we create and then read in for each test. This is another example of extending the Cypress framework and as such most of the logic we add will be done in the plugins `index.js` file. 
 
We will start by creating our configuration files. Unlike most of the folders we have worked with so far, there is not a prescribed standard for where these should go. Since we are extending Cypress, we have the option of putting them wherever we want. For this example, I am going to create a folder inside the plugins directory called `config`. We will be setting up three environments local, qa, and prod. So let's create three files `local.js`, `qa.js`, and `prod.js` and paste this into each of them. 
```js
// cypress/plugins/config/{prod|qa|local}.js
module.exports = {
 baseUrl: '',
 env: {}
};
```
This is a basic configuration file that is set up in the Cypress format. The `baseUrl` field here represents the URL of the site that is under test. This value is used by several Cypress commands, most notably `.visit()`. With a `baseUrl` set in the config, you can navigate to a route on the application simply by doing `cy.visit('/route')` instead of having to enter the full application URL. This allows us to make our tests environment agnostic.
 
I will be continuing with the Google example that we set up earlier and will use `https://google.com` as my `baseUrl` in the prod config file. In your application, you can put the URL for your own application environments. The `env` parameter can be used to set environment variables for your tests that you want to be available. This is handy for passwords or other test data that could also be passed in from outside the tests. For the purposes of this setup, I won't add any.
 
So now we have our config files, but we need to load them into the tests depending on the environment that they are being run in. To do this we will modify the plugins `index.js` to look like this:
```js
const preprocess = require('./preprocess');
 
module.exports = (on, config) => {
 
  on("file:preprocessor", preprocess);
  
  const targetEnv = config.env.TARGET_ENV || 'qa';
  
  const environmentConfig = require(`./config/${targetEnv}`);
  
  return {
  ...config,
  ...environmentConfig,
  };
}
```
We have only added a few lines to the file, but they are doing a lot. The first new line we see is 
```js
const targetEnv = config.env.TARGET_ENV || 'qa';
```
Here we are setting a variable `targetEnv` based on the value of an environment variable that we will be passing into the tests called `TARGET_ENV`. We are also defaulting to qa if you forget to pass one in.
```js
const environmentConfig = require(`./config/${targetEnv}`);
```
This is the next line where we are dynamically reading in one of the config files that we created based on the name. I am not doing any validation on the value of the `targetEnv` variable, which could be a problem if it is passed in wrong. After this line we now have our custom config read in and all we have to do is return it.
```js
return {
  ...config,
  ...environmentConfig,
};
```
I am using the spread operator to expand both the config that gets passed in and our custom config so that I end up with all of the config variables that were passed into the tests as well as those in our custom config. This means we preserve variables such as `TARGET_ENV` which we pass in from outside the tests.

To run the tests and pass in the `TARGET_ENV` variable run our earlier created npm script like this: `npm run cypress:open -- -e TARGET_ENV=prod`.
 
### Custom Commands
Another aspect of Cypress that further enhances the developer experience and the re-usability of tests is the ability to add custom commands. This is especially useful for functionalities like log in or interacting with a common element across your application. Luckily, Cypress makes it extremely easy to add custom commands. 
 
Earlier I mentioned that the support directory was a handy place to configure our custom commands and it is that which we will do now. First, let's create a folder underneath the support directory called `commands` and an `index.ts` file inside that. Inside the `index.ts` file add `export * from './search-google';`. This will be what we call our file with the custom command. For any future commands that you add, you will want to make sure to export them in this file as well.
 
For this example, I am going to create a custom command to enter text inside the search box on the Google search page. A consumer of this command should be able to call `cy.searchGoogle('text to search')`. Under the commands directory, go ahead and create our `search-google.ts` file and paste the following code into it (don't worry, I will explain what is happening).
```ts
export function searchGoogle(searchText: string): void {
  cy.get('input[title="Search"]')
    .type(`${searchText}{enter}`);
}
 
Cypress.Commands.add('searchGoogle', searchGoogle);
 
declare global {
  namespace Cypress {
    interface Chainable {
      searchGoogle: typeof searchGoogle 
    }
  }
}
```
First, we define a function `searchGoogle` that takes a string, types it into the search input, and presses enter to search. There is nothing here that is much different than how you would write it in a normal test. 
 
The next line is where we tell Cypress about our function and make it a command. The `Cypress.Commands.add` function takes two arguments here. The first is the name of the command, which is how you want the command to be called. The second argument is the function that will be called when the command is invoked. After that line, your command is ready to be used, however, if you are using Typescript (and I hope you are) your IDE won't know about the command.
 
To make sure that the IntelliSense works for the IDE we need to use a Typescript feature called interface merging. Essentially, we add on our command declaration to the Cypress namespace and the `Chainable` interface that all of the Cypress commands already exist on. After doing that we can use our command just like any of the other Cypress commands with IntelliSense and everything.
 
### Cucumber Setup
As we have seen so far Cypress gives us the ability to write end-to-end tests similarly to how we would write unit tests. This is one way of writing your tests, however, a lot of you might be coming from using Cucumber in your end-to-end tests. This is not something that Cypress provides support for out of the box however, similar to how we setup Typescript we can use a pre-processor to enable the use of Cucumber. If you have been following along so far go ahead and delete the google folder that we had created earlier as we will be setting up the tests a little differently for cucumber. 
 
First things first, let's install the pre-processor that we need.
```sh
➜ npm install -D cypress-cucumber-preprocessor
```
There are three configuration items we need to do before we can start writing our feature files and step definitions. First, change the `cypress.json` file to look like this:
```json
{
 "testFiles": "**/*.feature"
}
```
This tells Cypress where to find our test files. Next, we need to configure the pre-processor to use non-global step definitions. This is one thing about the Cypress cucumber implementation that is excellent. Being able to have step definitions that are not global makes writing our feature files and tests much easier as we do not have to worry about collisions. To enable this, add the following to your `package.json`:
```json
"cypress-cucumber-preprocessor": {
  "nonGlobalStepDefinitions": true
}
```
We put the configuration here because cypress-cucumber-preprocessor uses cosmiconfig which pulls information from the `package.json`.
 
Lastly, since we are using webpack to pre-process our files we will add a few lines to our webpack config and we will be ready to go. Add this object to the rules array of the `webpack.config.js` file:
```js
{
  test: /\.feature$/,
  use: [
    {
      loader: "cypress-cucumber-preprocessor/loader"
    }
  ]
}
```
Now let's write some tests!
 
Inside the integration folder, I am going to create a `search.feature` file and a `search` folder. The name of the feature file and the directory should match exactly as this is how the cucumber pre-processor finds the step definitions for each feature file when using non-global step definitions.

Once again, my test examples are going to involve searching Google. Here is my `search.feature` file and the step definition I've created inside the search folder.
```feature
# cypress/integration/search.feature
Feature: Google Search

  Test searching google
  
  Scenario: Search for cats
    Given I open Google home page
    Then I search for cats
```
```ts
// cypress/integration/search/search.spec.ts
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I open Google home page', () => {
  cy.visit('/')
});

Then(/^I search for (.*)$/, (text: string) => {
  cy.searchGoogle(text);
});
```
If you are familiar with Cucumber then there is nothing here that should be too shocking. When you run `npm run cypress:open -- -e TARGET_ENV=prod` you should see the option to run our `search.feature` file. 

Now, let's say that we want to add another feature file to test searching Google Images. Here is my feature file and step definition:
```feature
# cypress/integration/images.feature
Feature: Google Images

  Test searching google images
  
  Scenario: Search for cat pictures
    Given I open Google images page
    Then I search for cat pictures
```
```ts
// cypress/integration/images/images.spec.ts
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I open Google images page', () => {
  cy.visit('/imghp')
});

Then(/^I search for (.*)$/, (text: string) => {
  cy.searchGoogle(text);
});
```
The astute among you might notice that we have one step definition that is completely duplicated between the two files. This is in both since we have turned global step definitions off earlier. While it is nice to not have to worry about clashing step definitions, we also don't want to have completely duplicated code. 

Luckily, the cypress-cucumber-preprocessor allows us to create a `integration/common` folder where we can put step definitions that are common between multiple feature files. We can then completely remove the duplicated step definition and put it in a file inside that folder and our tests should still pass.

Time to celebrate! We're done!

I know this was a long article with a lot of content that was thrown at you, but at this point you should have a setup for Cypress that allows you to use Cucumber, Typescript, custom commands, and varying configuration files when writing your tests.

### Resources
1. [Cypress w/o Cucumber Source Code](https://github.com/Full-Stack-HQ/base-cypress-setup/tree/no-cucumber)
2. [Cypress w/ Cucumber Source Code](https://github.com/Full-Stack-HQ/base-cypress-setup/tree/cucumber)
3. [Cypress Documentation](https://docs.cypress.io/guides/getting-started/installing-cypress.html)
4. [Webpack Preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor)
5. [Cucumber Preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor)
