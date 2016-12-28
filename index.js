const storage = {};

const persistentStorage = JSON.parse(localStorage.mindful || '{}') || {};

const _updateStorage = (key, value) => {
  if (storage[key] === undefined) {
    storage[key] = {
      value: null,
      callbacks: [],
    };
  }

  storage[key].value = value;
  storage[key].callbacks.forEach((callback) => {
    callback();
  });
};

for (var key in persistentStorage) {
  _updateStorage(key, persistentStorage[key]);
}

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

const subscribeToValue = (input, callback) => {
  if (!storage[input]) {
    _updateStorage(input, undefined);
  }

  if (storage[input] && storage[input].callbacks) {
    storage[input].callbacks.push(callback);
  }
};

const setStorage = (input, value) => {
  input = validateInput(input, value);
  for (var key in input) {
    _updateStorage(key, input[key]);
  }
};

const updateStorage = (input, callback) => {
  setStorage(input, callback(storage[input].value));
};

const updatePersistentStorage = (input, value) => {
  input = validateInput(input, value);
  for (var key in input) {
    _updateStorage(key, input[key]);
    persistentStorage[key] = input[key];
  }
  localStorage.mindful = JSON.stringify(persistentStorage);
};

const searchStorage = (input) => {
  if (storage[input] !== undefined) {
    return storage[input].value;
  }
};

const clearStorage = (input) => {
  if (storage[input]) {
    setStorage(input, undefined);
  }

  if (persistentStorage[input]) {
    delete persistentStorage[input];
    localStorage.mindful = JSON.stringify(persistentStorage);
  }
};

const initializeReactComponent = (component, props, context, updater) => {
  if (!component.__proto__.name) {
    return component(props, context, updater);
  } else {
    return new component(props, context, updater);
  }
};

const registerComponent = (component, ...keys) => {
  if (Array.isArray(keys[0])) {
    keys = keys[0];
  }

  return (props, context, updater) => {
    var saved = initializeReactComponent(component, props, context, updater);
    keys.forEach((key) => {
      subscribeToValue(key, () => {
        updater.enqueueForceUpdate(saved._owner ? saved._owner._instance : saved);
      });
    });
    return saved;
  };
};

const mindful = registerComponent;
mindful.set = setStorage;
mindful.get = searchStorage;
mindful.update = updateStorage;
mindful.remove = clearStorage;
mindful.retain = updatePersistentStorage;
mindful.forget = clearStorage;
mindful.subscribe = registerComponent;

module.exports = mindful;


























