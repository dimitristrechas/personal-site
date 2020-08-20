---
title: A basic Header/Main/Footer Web page layout
date: 13/8/2020
tags: css
---

## A basic Header/Main/Footer Web page layout

The following gists showcase a basic web page layout with a fixed height header, a footer that stays on the bottom regardless of the main content height.

### Using css grid

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Static Template</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      /* The important part is here! */
      .app-container {
        display: grid;
        height: 100vh;
        grid-template-rows: auto 1fr auto;
      }
      header {
        height: 4rem;
        background-color: teal;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        font-size: 2rem;
        font-weight: 500
      }
      footer {
        text-align: center;
        font-size: 0.875rem;
        padding: 0.5rem 0;
      }
    </style>
  </head>
  <body>
    <div class="app-container">
      <header>A very nice header</header>
      <main></main>
      <footer>All rights reserved<footer />
    </div>
  </body>
</html>
```

### Using flex direction column

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Static Template</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
       /* The important part is here! */
      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      header {
        height: 4rem;
        background-color: teal;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        font-size: 2rem;
        font-weight: 500
      }
      /* and here */
      main {
       flex-grow: 1;
      }
      footer {
        text-align: center;
        font-size: 0.875rem;
        padding: 0.5rem 0;
      }
    </style>
  </head>
  <body>
    <div class="app-container">
      <header>A very nice header</header>
      <main></main>
      <footer>All rights reserved<footer />
    </div>
  </body>
</html>
```
