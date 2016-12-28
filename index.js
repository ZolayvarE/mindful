const storage = {};

const persistentStorage = JSON.parse(localStorage.mindful || '{}') || {};


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
      callbacks: [],
    };
  } else {
    storage[key].value = value;
    storage[key].callbacks.forEach((callback) => {
      callback();
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


const subscribeToValue = (input, callback) => {
  if (!storage[input]) {
    setValueInStorage(input, undefined);
  }

  if (storage[input] && storage[input].callbacks) {
    storage[input].callbacks.push(callback);
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
  localStorage.mindful = JSON.stringify(persistentStorage);
};


const clearValueFromStorage = (input) => {
  if (storage[input]) {
    setValueInStorage(input, undefined);
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


























