---
layout: post
title: "Angular Lazy Loading: the what, how, and why"
image: /images/uploads/lazy.jpg
imageCreditText: Photo by Martina Misar-Tummeltshammer on Unsplash
imageCreditLink: https://unsplash.com/s/photos/cat-yawning?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
author: David Seybold
date: 2019-11-11T07:03:47.149Z
tags: 
  - front-end
draft: false
---
As any front-end application grows in size the organization and architecture of the code become that much more important. For a simple application that has maybe one or two pages, with not too much business logic, we can get away with bad practices without too much of an adverse effect. At a larger scale, these effects become magnified and can significantly impact your application. Lazy loading in Angular is one tool in your toolbelt that you can use to create an application that will scale easily as the application grows. 

### Why add lazy loading?
When you compile an Angular application, the Angular compiler creates a javascript bundle which is used to run your application on the client. These bundles include all of the transpiled javascript, the HTML, and CSS that you have written. As the amount of features in your application grows, the amount of code also grows. This results in a large bundle size that will end up being served to your end-user. Most ordinary users will have no idea what a bundle of code is much less care about how big it is, however they will care about how long it takes for your application to load. The size of the javascript bundle has a direct correlation to the time that it takes for your page to load. Smaller bundle, quicker page load and a bigger bundle results in a longer page load.

Why should you care about how long it takes your page to load? Well, studies have shown that most people won't wait around longer than 5 seconds for your page to load and some will wait even less. If your application is slow to load then your customers will be less likely to stay on your site which translates into fewer conversions. 

### What is lazy loading?
So now I've got you convinced. You need lazy loading in your application. Only one problem, you still don't know what lazy loading is so let's fix that. 

Without lazy loading, an Angular application gets served as one main javascript bundle that contains all of the code that you wrote and any that it depends on by imports. When you navigate to your application the server will serve the entire bundle to the client which, depending on its size and the speed of the client's internet connection, could take a bit to load.

Lazy loading allows you to split your javascript bundle into smaller chunks that get loaded incrementally only when a user needs the code involved. For example, let's say I have an application that I am building to manage a restaurant. It has two main functionalities: staff management and inventory. The landing page of the application is a dashboard that shows a summary of inventory and staff, with links to the respective pages for inventory and staff management. 

When someone first loads the page they do not need the code that is specific to inventory management or staff management. All they need is the code that will allow them to view the dashboard. If they were to click on a link that navigates them to the staff management part of the application then that code should be retrieved, but there is still no need to load the inventory management specific code. 

By loading only the code that is required when initially visiting the page we can significantly speed up the page load and by extension improve the end-user experience.

### Let's Give it a Shot
So far I've told you what lazy loading is and why it is important but I still have not explained how to implement it. I will use the restaurant management application that I talked about earlier to demonstrate the implementation. The example app will not be a fully built out application, but will be enough to show you how to add lazy loading.

First things first, I am going to create a new Angular application using the Angular CLI. 

```sh
➜ ng new lazy-loading-tutorial && cd lazy-loading-tutorial
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? SCSS [ http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax ]
```
I chose to add routing to the application so that it automatically creates a routing module and I am using SCSS. If you are following along feel free to use whatever stylesheet format you prefer.

Next, I am going to add three modules that I will use to organize my application: dashboard, staff, and inventory. Then serve the application to see it in the browser.
```sh
➜ ng generate module Dashboard
➜ ng generate module Staff --routing
➜ ng generate module Inventory --routing
➜ ng serve
```
I created the Staff and Inventory modules with routing so that a routing module is created in the directory. The Dashboard module is loaded when first visiting the site so there is no need to add routes and lazy load it.

Let's create our dashboard component and wire it up to the app routing so that it gets loaded when someone visits the root of our application. 

```sh
➜ ng generate component Dashboard --module=Dashboard
```
I added a component to the Dashboard module and I have modified the routes array in the `app-routing.module.ts` file to look like this.

```ts
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  }
]
```
Here we have set up a route so that the root path of our application gets redirected to the `/dashboard` route which will load our DashboardComponent. Inside the DashboardComponent we would display a summary of the state of our restaurant which would include staff present and low inventory. For the sake of this tutorial, I will only add two links to the Dashboard. One to direct us to staff management (`/staff`) and the other to inventory management (`/inventory`). 

Next let's setup the staff management module for lazy loading. I am going to add three components to the Staff module: StaffList, StaffDetail, and Report, and configure routing for each one inside `staff-routing.module.ts`. When I am done this is my routes array inside the `staff-routing.module.ts` file: 
```ts
//staff-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: StaffListComponent,
  },
  {
    path: 'reports',
    component: ReportComponent,
  },
  {
    path: ':id',
    component: StaffDetailsComponent,
  }
]
```
And this is the routes array in the `app-routing.module.ts` file:
```ts
// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '/staff',
    loadChildren: () => import('./staff/staff.module').then(mod => mod.StaffModule),
  }
]
```
The routes in the `staff-routing.module.ts` file don't look any different than we normally see in an application without lazy loading. However, there is a large difference in the route that we have added to the `app-routing.module.ts` routes array. Here we are are using the `loadChildren` attribute and a function that includes a dynamic import statement to tell Angular where the routes for the children of this URL path are. 

If you are reading this and have a pre-Angular 8 application, this is what it would look like instead:
```ts
{
 path: '/staff',
 loadChildren: './staff/staff.module#StaffModule'
}
```
This syntax has been deprecated in Angular 8 so you should be mindful which version you are using to know which one should be used. 

At this point, the staff management side of the application has been implemented using lazy loading. If you open up the network tab and navigate to `/staff` you should see a separate javascript chunk being loaded after the main chunk got loaded on the initial page load.

Go ahead and wire up the inventory management part of the application on your own. If you need some help, reference the completed exercise [here](https://github.com/Full-Stack-HQ/lazy-loading-tutorial). There should be two components: an InventoryList and OrderInventoryItems component. The InventoryList would display a list of all the inventory in the restaurant however ours will only contain a link to the OrderInventoryItems component. Don't forget to update the `app-routing.module.ts` file for the new lazy loaded module.

When you are done with this, take a look at the network tab in the dev tools console when navigating between routes. You should see the different chunks getting loaded separately.

### Guarding Module Loads
For certain lazy loaded modules, it might be necessary to prevent them from being loaded if the end-user does not have permission to view them. Maybe that section of the application is very sensitive so we don't even want the source code to be seen by someone without permission to view the content. This can be accomplished by creating a Service that implements the `CanLoad` interface. 

Here is what that looks like: 
```ts
@Injectable({
 providedIn: 'root'
})
export class ManageInventoryGuard implements CanLoad {

  constructor() { }

  canLoad(route: Route): boolean {
    return this.isAdmin();
  }

  private isAdmin(): boolean {
    return true;
  }
}
```
We can see here that we only want to allow users that are an admin to be able to manage the inventory of our restaurant. We also want to make sure they don't see any secure business logic that would happen if the bundle got loaded. If you were doing this in a real application you would want to add the necessary logic to determine if the person is an admin instead of always returning `true`.

### Preloading Lazy Loaded Modules
Now that we have set up lazy loading, some of our modules will only be loaded when navigating to a specific route. This means there may be a small delay when navigating to that route because it first has to load the module and then it will execute any startup logic that you have for the page being displayed. Depending on your network speed, the size of the module, and how much startup logic you have, the page could take a bit longer than it would if you did not have lazy loading implemented. The goal with lazy loading is to speed up the initial page load, but we don't want to sacrifice the speed and user experience of the rest of the application. Enter, preloading. Preloading allows us to get all of the benefits of lazy loading but also makes sure that there is no gap in user experience. 

We can configure the Angular router to preload any modules that we want to be immediately available to the application. First, Angular loads the main bundle that we need to load the landing page of our application. Normally, no other bundles would be loaded yet but with preloading after the main bundle gets loaded Angular will asynchronously load the bundles that we have marked to be preloaded behind the scenes.

Preloading works based on a preloading strategy that is provided. By default, there are only two strategies: don't preload any modules, or preload all modules that are lazy loaded. Our application already does not preload any modules, but let's go ahead and configure it to. Make the following change to your AppRoutingModule:

```ts
@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { preloadingStrategy: PreloadAllModules },
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Here we are specifying that we want to use the PreloadAllModules strategy when preloading our modules. When you go to the browser you should see that one of our lazy loaded modules is loaded as well as the main module. Now the astute among you might be wondering why only one of our lazy loaded modules gets preloaded when I just got done saying that all of them should get preloaded. This is because of the route guard that we configured in the last section. Our CanLoad guard takes precedence over the preloading strategy that we have specified.

If we want to only preload a subset of the modules that we have configured to be lazy loaded we can create a custom preloading strategy. I won't explain how to do that as the Angular docs have a good explanation [here](https://angular.io/guide/router#custom-preloading-strategy).

### Common Problems with Lazy Loading Implementation
###### 1. Error: BrowserModule has already been loaded.

If you are starting from scratch this error is not something that you should see, but if you are refactoring an existing project to use lazy loading it is more likely to occur. Many projects that are not built from the beginning with lazy loading in mind (or an understanding of NgModules) can be difficult to refactor to use lazy loading. They wind up in a web of dependencies with modules getting imported that aren't needed which in turn bring in other modules and so on. It becomes hard to keep track of what is needed for a module to work and what is not.

If you see this error it is important to check any module that gets lazily loaded, and its dependencies to see if they import either BrowserModule or BrowserAnimationsModule. Both of these should only be imported once in your application and the best place to do that would be in your AppModule. If you have a module that you want to lazy load and it currently has BrowserModule imported you should try importing the CommonModule. The CommonModule provides functionality you might need like `ngIf` and `ngFor`. The BrowserModule re-exports the CommonModule, so if you remove the BrowserModule you will most likely need to add CommonModule to your imports array. 

###### 2. Issues with providers

When adding lazy loading to an application it is important to understand how dependency injection works in Angular. The Angular [docs](https://angular.io/guide/dependency-injection) on the subject are an excellent resource. Things like interceptors, services, and other Injectable classes can sometimes behave differently than how you might expect them to if they are provided in more than one module. This is especially true for lazy loaded modules.

### Wrap-up

By now you should have some understanding of what lazy loading is and how to add it to your application. It is an essential part of any Angular application as it allows for a better user experience. I also find that it allows for better code organization which enhances the developer experience. It really is a win-win.

### Resources
1. [Tutorial Source Code](https://github.com/Full-Stack-HQ/lazy-loading-tutorial)
2. [Angular Documentation for lazy loading](https://angular.io/guide/router#milestone-6-asynchronous-routing)