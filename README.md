#Mindful

A user friendly library for globalization of React state management.

##Installation

```bash
npm install mindful --save
```

##Example Usage

The following example attaches Mindful to a plain stateless React component.
```jsx
import React from 'react';
import { Link } from 'react-router';
import mindful from 'mindful';

var NavBar = (props) => {
  return (
    <div className='NavBar'>
      <h1 className='Logo'>
        <Link to='/'>
          { mindful.get('roomName') }
        </Link>
      </h1>
    </div>
  );
};

export default mindful(NavBar, 'roomName');

```

##API

```js
import mindful from 'mindful';
```
This exposes the Mindful API that has access to the following methods:


###Mindful.set( *key*, *value* ) 
Stores the given key/value pair in Mindful's global storage
###Mindful.get( *key* ) 
Returns the value associated with the given key in storage.

**Example**
```js
mindful.set('color', 'red');
mindful.get('color') //=> Should return 'red'.
```


###Mindful.retain( *key*, *value* )
Acts the same as Mindful.set, but the data persists after page reload.
**Example**
```js
mindful.set('temporaryValue', 10);
mindful.retain('persistentValue', 20);
// Page reloads
mindful.get('temporaryValue') //=> Should return undefined.
mindful.get('persistentValue') //=> Should return 20.
```


###Mindful.forget( *key* )
Deletes the given key from the global storage.

**(This trumps mindful.retain)**


###Mindful.update( *key*, *callback* )
Maps the given key/value pair in global storage based on the passed in callback.

**Example**
```js
mindful.set('number', 10);
mindful.update('number', function (value) {
  return value * 2;
})
mindful.get('number') //=> Should return 20.
```


###Mindful.toggle( *key* )
Inverses the boolean value stored at the given key.
```js
mindful.set('loggedIn', false);
mindful.toggle('loggedIn');
mindful.get('loggedIn') //=> Should return true.
```
