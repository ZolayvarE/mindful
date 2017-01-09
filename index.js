const storage = {};

const persistentStorage = JSON.parse(localStorage._mindful || '{}') || {};

const validateInput = (input, value) => {
  if (typeof input === 'function') {
    throw new Error('Input cannot be a function!');
  } else if (Array.isArray(input)) {
    throw new Error('Input cannot be an array!');
  } else if (typeof input !== 'object') {
    var validInput = {};
    validInput[input] = value;
    return validInput;
  } else {
    return input;
  }
};


const _upsert = (key, value) => {
  if (storage[key] === undefined) {
    storage[key] = {
      value: value,
      subscribers: new Map,
    };
  } else {
    storage[key].value = value;
    storage[key].subscribers.forEach((subscriber) => {
      if (subscriber.isStateless() || subscriber.isMounted()) {
        subscriber.render();
      }
    });
  }
};


const setValueInStorage = (input, value) => {
  input = validateInput(input, value);
  for (var key in input) {
    _upsert(key, input[key]);
  }
};

const searchForValueInStorage = (input) => {
  if (storage[input] !== undefined) {
    return storage[input].value;
  }
};


const subscribeToValue = (component, key, updater, instance, callback) => {
  if (!storage[key]) {
    setValueInStorage(key, undefined);
  }

  if (storage[key] && storage[key].subscribers) {
    storage[key].subscribers.set(component, {
      render: callback,
      isMounted: () => {
        return updater.isMounted(instance);
      },
      isStateless: () => {
        return !component.__proto__.name;
      }
    });
  }
};


const updateValueInStorage = (input, callback) => {
  let oldValue = searchForValueInStorage(input);
  let newValue = callback(oldValue);
  setValueInStorage(input, newValue);
};


const toggleValueInStorage = function (input) {
  updateValueInStorage(function (value) {
    return !value;
  });
};


const persistValueInStorage = (input, value) => {
  input = validateInput(input, value);
  for (var key in input) {
    _upsert(key, input[key]);
    persistentStorage[key] = input[key];
  }
  localStorage._mindful = JSON.stringify(persistentStorage);
};


const clearValueFromStorage = (input) => {
  if (storage[input]) {
    setValueInStorage(input, undefined);
  }

  if (persistentStorage[input]) {
    delete persistentStorage[input];
    localStorage._mindful = JSON.stringify(persistentStorage);
  }
};


const mapGlobalStateToProps = (props, values) => {
  var newProps = {};
  for (var key in props) {
    newProps[key] = props[key];
  }

  values.forEach(function (value) {
    newProps[value] = searchForValueInStorage(value);
  });

  return newProps;
};


const initializeReactComponent = (component, props, context, updater) => {
  let initialized;
  if (!component.__proto__.name) {
    initialized = component(props, context, updater);
  } else {
    initialized = new component(props, context, updater);
  }
  return initialized;
};


const registerComponent = (component, ...keys) => {
  if (Array.isArray(keys[0])) {
    keys = keys[0];
  }
  return (props, context, updater) => {
    var saved = initializeReactComponent(component, props, context, updater);
    keys.forEach((key) => {
      subscribeToValue(component, key, updater, saved, () => {
        updater.enqueueForceUpdate(saved._owner ? saved._owner._instance : saved);
      });
    });
    return saved;
  };
};


setValueInStorage(persistentStorage);


const mindful = registerComponent;
mindful.set = setValueInStorage;
mindful.get = searchForValueInStorage;
mindful.retain = persistValueInStorage;
mindful.update = updateValueInStorage;
mindful.forget = clearValueFromStorage;
mindful.toggle = toggleValueInStorage;
mindful.subscribe = registerComponent;

module.exports = mindful;


























