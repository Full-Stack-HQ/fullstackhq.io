---
layout: post
title: The No Tears Cypress Setup
image: /images/uploads/tim-gouw-1k9t5yiz2wu-unsplash.jpg
imageCreditText: Photo by Tim Gouw on Unsplash
imageCreditLink: 'https://unsplash.com/photos/1K9T5YiZ2WU'
author: David Seybold
tags:
  - front-end
date: 2019-11-16T00:24:11.722Z
draft: false
---
Testing the user interface of a web application is one of the most frustrating aspects of developing. Tests are usually flaky, hard to write, and even harder to debug when something isn't working. Most current solutions like Protractor and Nightwatch are based on Selenium. This adds maintaining a Selenium grid or using a third-party grid, to the list of things to keep track of. It is not fun for anyone involved.
 
Enter Cypress. 
 
Cypress is a relatively new player to the E2E testing field, having only been around since 2015, but it is already taking the front-end community by storm. It makes writing E2E tests feel more like you are writing application code, resulting in better tests and better development experience. I won't spend any more time explaining how great Cypress is as I will assume that if you are here trying to set it up, that you have at least already been convinced or are ready to try it out for yourself.
 
While Cypress is awesome, when I was setting up my implementation I found that there were a lot of different resources on how to set up different parts of the framework. If I wanted to see how to add Typescript I needed to go to one place, then for cucumber somewhere else, and another for anything else I wanted to add. Sometimes the different setups would clash and I ended up spending a lot of time trying to debug problems with my setup that could have been avoided.
 
My goal with this walkthrough is to show you an easy way to setup Cypress. I am going to show you how to add Typescript, configure multiple configuration files for different environments, and how to add cucumber support. Finally, I will talk about running Cypress inside a CI environment.
 
### Install Cypress
Before we do anything we need to install Cypress. I will be starting on a brand new Angular application but I won't be showing anything specific to Angular in this walkthrough so you can use an Angular, React, or just a plain npm project to follow along.
```sh
➜ npm install -D cypress
```
This may take a few minutes as it will install the Javascript package and the Cypress binary needed to execute tests. The install does not create the folder structure we need for Cypress, this instead happens the first time that you start Cypress. So let's go ahead and add an npm script that we will use throughout this post to start Cypress and go ahead and run it when you are done.
```json
"cypress:open": "$(npm bin)/cypress open"
```
When this command is run it will open the Cypress UI. Since this is the first time we are running it, it will generate the folder structure and some sample tests that we can use to test how Cypress works. Once the UI opens feel free to spend some time familiarizing yourself with the test runner. When you are done, kill the test runner and let's look at what was generated.
 
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
Cypress is an E2E testing framework, but also has a node process that can be used to extend some of the functionality of Cypress. This would include configuring file pre-processors or loading configurations, both of which I will cover later on.
 
###### support
Out of the box, Cypress provides the `support/index.js` file that will be run before every spec file. It can be used for a number of things such as a global beforeEach hook, overrides, and setting up custom commands which I will demonstrate as part of this post.
 
### Write Your Tests in Typescript
By default, Cypress expects your tests to be written in Javascript. This is fine however, I am a big advocate for writing as much of your codebase as in Typescript as possible. Just like the code of your main application, your tests should be easy to maintain and easy for someone who has never seen your codebase to be able to easily understand what is happening. Typescript allows for your code to be more self-documenting than just plain Javascript.
 
To write our tests in Typescript we need to take advantage of the plugin capability of Cypress. We are going to add a file pre-processor that will transpile any Typescript files we have to Javascript before running the tests. To do this we will need to install a few dependencies. 
```sh
➜ npm install -D ts-loader @cypress/webpack-preprocessor webpack typescript
```
You may have already installed some of these or they could exist as part of a transient dependency.
 
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
We also need to add a basic `tsconfig.json` file to our cypress directory. This is a basic one that you can use. They most important part is the `cypress` inside the types array as this is how your IDE will be able to use intellisense.
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
Now, we need to tell Cypress to pre-process our test files with webpack and our webpack config. As you may have guessed from the earlier explanations of the file structure, this occurs inside the plugins directory in the `index.js` file. I am going to create a new file inside the plugins directory called `preprocess.js` inside which I will do all of the pre-processing logic that we need to do. It helps to simplify the `index.js` file.
 
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
That's it. Now we should be able to write our tests in Typescript. Let's not take my word for it though. We should add a sample test to verify everything is working correctly. Go ahead and remove all of the sample tests that were created by the initialization process. Create a folder called `google` and a file inside that called `search.spec.ts` with these contents.
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
This is a super simple test that goes to the Google Images page and searches for cat pictures, because who doesn't love a good cat picture. To test this, in your terminal run `npm run cypress:open` which is the command we configured earlier. The Cypress test runner should open and you should be able to select our new test and run it. It should pass.

### Separate Environment Configurations
Most established applications have at least two environments: a place to test new code (QA) and then the customer facing application (prod). Some applications will have more, sometimes up to seven and it is important to be able to run your tests against any and all environments that you need to.

Cypress can do this through the use of custom configuration files that we create and then read in for each test. This is another example of extending the Cypress framework and as such most of the logic we add will be done in the plugins `index.js` file. 

We will start out by creating our configuration files. Unlike most of the folders we have worked with so far, there is not a prescribed standard for where these should go. Since we are extending Cypress, we have the option of putting them wherever we want. For this example, I am going to create a folder inside the plugins directory called `config`. We will be setting up three environments local, qa, and prod. So let's create three files `local.js`, `qa.js`, and `prod.js` and paste this into each of them. 
```js
module.exports = {
  baseUrl: '',
  env: {}
};
```
This is a basic configuration file that is setup in the Cypress format. The `baseUrl` field here represents the URL of the site that is under test. This value is used by a number of Cypress commands, most notably `.visit()`. With a `baseUrl` set in the config you can navigate to a route on the application simply by doing `cy.visit('/route')` instead of having to enter the full application URL. This allows us to make our tests environment agnostic.

In your application, you can put the address of your environments, I will be continuing with the Google example that we setup earlier and will use `https://google.com` as my `baseUrl` in the prod config file. This will be all we will add here. The `env` parameter can be used to set environment variables for your tests that you want to be available. This is handy for passwords or other test data that could also be passed in from outside the tests.

So now we have our config files and we need to load them into the tests depending on the environment that they are being run in. To do this we will modify the plugins `index.js` to look like this:
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

### Custom Commands
Another aspect of Cypress that further enhances the developer experience and the reusability of tests is the ability to add custom commands. This is especially useful for functionalities like login or interacting with a common element across your application. Luckily, Cypress makes it extremely easy to add our own custom commands. 

Earlier I mentioned that the support directory was a handy place to configure our custom commands and it is that which we will do now. First, let's create a folder underneath the support directory called `commands` and an `index.ts` file inside that. 

For this example, I am going to create a custom command to enter text inside the search box on the Google search page. A consumer of this command should be able to call `cy.searchGoogle('text to search')`. Under the commands directory, create a new file called `search-google.ts` and paste the following code into it. (Don't worry, I will explain what is happening)
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

The next line is where we tell Cypress about our function and make it a command. The `Cypress.Commands.add` function takes two arguments here. The first is the name of the command. This would be how you want the command to be called. The second argument is the function that will be called when the command is invoked. After that line, your command is ready to be used, however if you are using Typescript (and I hope you are) your IDE won't know about the command.

To make sure that the intellisense works for the IDE we need to use a Typescript feature called interface merging. Essentially, we add on our command declaration to the Cypress namespace and the `Chainable` interface that all of the Cypress commands already exist on. After doing that we can use our command just like any of the other Cypress commands with intellisense and everything.


The code up to this point can be found in [this](https://github.com/Full-Stack-HQ/base-cypress-setup/tree/no-cucumber) git repository on the `no-cucumber` branch.

### Cucumber Setup
As we have seen so far Cypress gives us the ability to write end-to-end tests similarly to how we would write unit tests. This is one way of writing your tests, however a lot of you might be coming from using Cucumber in your end-to-end tests. This is not something that Cypress provides support for out of the box however, similar to how we setup Typescript we can use a pre-processor to enable the use of Cucumber. If you have been following along so far, go ahead and delete the google folder that we had created earlier, as we will be setting up the tests a little differently for cucumber. 

First things first, let's install the pre-processor that we will use.
```sh
➜ npm install -D cypress-cucumber-preprocessor
```
Now, there are three configuration items we need to do before we can start writing our feature files and step definitions. First, change the `cypress.json` file to look like this:
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
The cypress-cucumber-preprocessor uses cosmiconfig which pulls information from the `package.json` which is why we put it there.

Lastly, since we are using webpack to pre-process our files we will add a few lines to our webpack config and we will be ready to go. Add this object to the rules array. 
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

