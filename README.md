#Mindful

A user friendly library for globalization of React state management.

##How to use
Mindful can be installed using npm as follows:
```bash
npm install mindful --save
```

Then, Mindful must be imported as follows:
```js
import mindful from 'mindful';
```
This exposes the Mindful API that has access to a variety of [methods](https://github.com/ZolayvarE/mindful#api).



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

####Mindful( *reactComponent*, *[key1, key2, ...]* )
Mindful itself is a function that wraps reactComponents passed into it, and rerenders them when any of the keys passed in change.


####Mindful.set( *key*, *value* ) 
Stores the given key/value pair in Mindful's global storage
####Mindful.get( *key* ) 
Returns the value associated with the given key in storage.

```js
mindful.set('color', 'red');
mindful.get('color') //=> Should return 'red'.
```


####Mindful.retain( *key*, *value* )
Acts the same as Mindful.set, but the data persists after page reload.

```js
mindful.set('temporaryValue', 10);
mindful.retain('persistentValue', 20);
// Page reloads
mindful.get('temporaryValue') //=> Should return undefined.
mindful.get('persistentValue') //=> Should return 20.
```


####Mindful.forget( *key* )
Deletes the given key from the global storage. *(This trumps* mindful.retain*)*


####Mindful.update( *key*, *callback* )
Maps the given key/value pair in global storage based on the passed in callback.

```js
mindful.set('number', 10);
mindful.update('number', function (value) {
  return value * 2;
})
mindful.get('number') //=> Should return 20.
```


####Mindful.toggle( *key* )
Inverses the boolean value stored at the given key.
```js
mindful.set('loggedIn', false);
mindful.toggle('loggedIn');
mindful.get('loggedIn') //=> Should return true.
```
