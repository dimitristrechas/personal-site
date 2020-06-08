---
title: My React Notes
description: A small bio
---

# My React Notes

### How to extract logic to custom react hook

```jsx
// We start here: [https://reactjs.org/docs/hooks-custom.html](https://reactjs.org/docs/hooks-custom.html)

import { useState } from "react";

const useExitTransition = () => {
  const [exitTransition, setExitTransition] = useState(false);
  const onExit = () => {
    setExitTransition(true);
    const timer = setTimeout(() => {
      window.location.assign(
        window.location.origin + window.location.pathname + "#/"
      );
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  };
  return [exitTransition, onExit];
};

export default useExitTransition;

// use as: const [exitTransition, onExit] = useExitTransition();
```

### Props destructing in Component arguments

```jsx
//Instead of:

import React from "react";

const MyComponent = (props) => {
  const { id, name, anotherProp, moreProps } = props;
  return <div>Yes {name}</div>;
};

//we do:

import React from "react";
const MyComponent = ({ id, name, anotherProp, moreProps }) => {
  return <div>Yes {name}</div>;
};
```

### A state object variable should be initialized with null useState(null)

```jsx
const [myObject, setMyObject] = useState(null);

// if we set the init value to {} then the following code is executed:
if (myObject) {  // do something}

/*
we do this because there is no easy way to check if an object is empty
check this: [https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object](https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object)
*/
```

### Destructing nested objects

```jsx
const user = {
  id: 339,
  name: "Fred",
  age: 42,
  education: { degree: "Masters" },
};

const {
  education: { degree },
} = user;

console.log(degree); // Masters

// [https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8](https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8)
```
