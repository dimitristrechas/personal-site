---
title: 3 tips for a better React experience
date: 3/7/2020
---

### Props destructing in Component arguments

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

### A state object variable should be initialized with null (unless reasons)

```javascript
const [myObject, setMyObject] = useState(null);

// if we set the init value to {} then the following code is executed:

if (myObject) {
  // do something
}

// I do this because there is no "pretty" way to check if an object is empty
// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
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
