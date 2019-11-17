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

