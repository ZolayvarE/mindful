const storage = {};

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
  if (storage[input] && storage[input].callbacks) {
    storage[input].callbacks.push(callback);
  } else {
    throw new Error('Could not find the item: "' + input + '"" in storage');
  }
};

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

const updateStorage = (input, value) => {
  input = validateInput(input, value);
  for (var key in input) {
    _updateStorage(key, input[key]);
  }
};

const searchStorage = (input) => {
  if (storage[input] !== undefined) {
    return storage[input].value;
  } else {
    console.error(new Error('Could not find the item: "' + input + '" in storage'));
  }
};

const initializeReactComponent = (component, props, context, updater) => {
  if (component.__proto__.name === '') {
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
mindful.set = updateStorage;
mindful.get = searchStorage;
mindful.subscribe = registerComponent;

module.exports = mindful;

























