#Mindful

A user friendly library for globalization of React state management.

##Installation

```bash
npm install mindful --save
```

##How to use

```jsx
import React from 'react';
import { Link } from 'react-router';
import mindful from '../scripts/mindful';

var NavBar = (props) => {
  return (
    <div className='NavBar'>
      <h1 className='Logo'>
        <Link to='/'>
          { mindful.get('roomName') || 'TableTale' }
        </Link>
      </h1>
    </div>
  );
};

export default mindful(NavBar, 'roomName');

```