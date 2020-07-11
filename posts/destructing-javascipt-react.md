---
title: Tips on destructing objects in JavaScript & React
date: 3/7/2020
---

## Tips on destructing objects in JavaScript & React

### Props destructing in React Component

```javascript
// Instead of:

import React from "react";

const MyComponent = (props) => {
  const { id, name, anotherProp, moreProps } = props;

  return <div>Yes {name}</div>;
};

// we do:

import React from "react";

const MyComponent = ({ id, name, anotherProp, moreProps }) => {
  
  return <div>Yes {name}</div>;
};
```

### Destructing nested objects

```javascript
const patient = {
  id: 339,
  fullname: "Dimitris Trechas",
  age: 30,
  education: {
    degree: "Bachelors",
  },
};

const { id } = patient;
console.log(id); // 339

const { fullname: name } = patient;
console.log(name); // Dimitris Trechas

const {
  education: { degree },
} = patient;
console.log(degree); // Bachelors

// https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8
```
