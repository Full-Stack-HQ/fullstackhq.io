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
draft: true
---
Testing the user interface of a web application is one of the most frustrating aspects of developing. Tests are usually flaky, hard to write, and even harder to debug when something isn't working. Most current solutions like Protractor and Nightwatch are based on Selenium. This adds maintaining a Selenium grid, or using a third-party grid, to the list of things to keep track of. It is not fun for anyone involved.

Enter Cypress. 

Cypress is a relatively new player to the E2E testing field, having only been around since 2015, but it is already taking the front-end community by storm. It makes writing E2E tests feel more like you are writing application code, resulting in better tests and a better development experience. I won't spend any more time explaining how great Cypress is as I will assume that if you are here trying to set it up, that you have at least already been convinced or are ready to try it out for yourself.

While Cypress is awesome, when I was setting up my implementation I found that there was a lot of different resources on how to setup different parts of the framework. If I wanted to see how to add Typescript I needed to go to one place, then for cucumber somewhere else, and another for anything else I wanted to add. Sometimes the different setups would clash and I ended up spending a lot of time trying to debug problems with my setup that could have been avoided.

My goal with this walkthrough is to show you an easy way to setup Cypress. I am going to show you how to add Typescript, configure multiple configuration files for different environments, and how to add cucumber support. Finally, I will talk about running Cypress inside a CI environment.

### Install Cypress
Before we do anything we need to install Cypress. I will be starting on a brand new Angular application but I won't be showing anything specific to Angular in this walkthrough so you can use an Angular, React, or just a plain npm project to follow along.
```sh
➜ npm install -D cypress
```
This may take a few minutes as it will install the Javascript package and the Cypress binary needed to execute tests. The install does not create the folder structure we need for Cypress, this instead happens the first time that you start Cypress. So let's go ahead and add a npm script that we will use throughout this post to start Cypress and go ahead and run it when you are done.
```json
"cypress:open": "$(npm bin)/cypress open"
```
When this command is run it will open the Cypress UI. Since this is the first time we are running it, it will generate the folder structure and some sample tests that we can use to test how Cypress works. Once the UI opens feel free to spend some time familiarizing yourself with the test runner. When you are done, kill the test runner and let's look at what was generated.

### File structure
After initialization, there will be a `cypress` folder that gets initialized inside the root directory of your application. Inside that folder, four more will also have been created. 
###### fixtures
The fixtures folder is where you can store static data used throughout your tests. This can include test data or mock responses. We won't spend much time talking about this part of Cypress, but if you are interested in learning more I would start [here](https://docs.cypress.io/guides/core-concepts/writing-and-organ
izing-tests.html#Fixture-Files).

###### integration
This folder is where all of your tests will live.

###### plugins
Cypress is a E2E testing framework, but also has a node process that can be used to extend some of the functionality of Cypress. This would include configuring file pre-processors or loading configurations, both of which I will cover later on.

###### support
Out of the box Cypress provides the `support/index.js` file that will be run before every spec file. It can be used for a number of things such as a global beforeEach hook, overrides, and setting up custom commands which I will demonstrate as part of this post.

### Write Your Tests in Typescript
