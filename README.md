#Mindful

A user friendly library for global management of React state.

##How to use
Mindful can be installed using npm:
```bash
npm install mindful --save
```

Mindful must be imported as f
```js
import mindful from 'mindful';
```
This exposes the Mindful API that has access to a variety of [methods](https://github.com/ZolayvarE/mindful#api).



##Example Usage

The following example attaches Mindful to a plain stateless React component.
```js
import React from 'react';
import { Link } from 'react-router';
import mindful from 'mindful';

var MessageBox = (props) => {
  return (
    <div>
      <h1>
        { mindful.get('message') }
      </h1>
      <form>
        <input type="text" id="messageInput">
        </input>
      </form>
    </div>
  );
};

export default mindful(MessageBox, 'message');

```


##API Reference

####mindful( *reactComponent*, *[key1, key2, ... ]* )
Mindful itself is a function that wraps React components passed into it, and rerenders them when any of the values, which are associated with the passed in keys, change.


####mindful.set( *key*, *value* ) 
Stores the given key/value pair in Mindful's global storage

####mindful.get( *key* ) 
Returns the value associated with the given key in storage.

```js
mindful.set('color', 'red');
mindful.get('color') //=> Should return 'red'.
```


####mindful.retain( *key*, *value* )
Acts the same as Mindful.set, but the data persists after page reload.

```js
mindful.set('temporaryValue', 10);
mindful.retain('persistentValue', 20);
// Page reloads
mindful.get('temporaryValue') //=> Should return undefined.
mindful.get('persistentValue') //=> Should return 20.
```


####mindful.forget( *key* )
Deletes the given key from the global storage. *(This trumps* mindful.retain*)*


####mindful.update( *key*, *callback* )
Maps the given key/value pair in global storage based on the passed in callback.

```js
mindful.set('number', 10);
mindful.update('number', function (value) {
  return value * 2;
})
mindful.get('number') //=> Should return 20.
```


####mindful.toggle( *key* )
Inverses the boolean value stored at the given key.
```js
mindful.set('loggedIn', false);
mindful.toggle('loggedIn');
mindful.get('loggedIn') //=> Should return true.
```
