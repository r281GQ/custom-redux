const sampleReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1;
    case 'DEC':
      return state - 1;
    default:
      return state;
  }
};

const UNINIT = 'UNINIT';

const sample = {
  appState: UNINIT,
  filter: {
    radius: 0,
    city: ''
  }
};

const appState = (state = UNINIT, action) => {
  switch (action.type) {
    case 'INIT_APP':
      return 'INIT_APP';
    default:
      return state;
  }
};

const filter = (
  state = {
    radius: 0,
    city: ''
  },
  action
) => {
  switch (action.type) {
    case 'SET_RADIUS':
      return Object.assign({}, state, { radius: action.payload });
    case 'SET_CITY':
      return Object.assign({}, state, { city: action.payload });
    default:
      return state;
  }
};

const combine = reducers => {
  const names = Object.keys(reducers);

  const assemble = (state, action) =>
    names.reduce((sum, item) => {
      sum[item] = reducers[item](state ? state[item] : undefined, action);
      return sum;
    }, {});

  const initialState = assemble(undefined, { type: 'INIT' });

  return (state = initialState, action) => assemble(state, action);
};

const createStore = reducer => {
  let currentState = reducer(undefined, { type: 'INIT' });

  const listeners = [];

  const dispatch = action => {
    currentState = reducer(currentState, action);
    listenerchrs.forEach(listener => listener(currentState));
  };

  const getState = () => currentState;

  const subscribe = listener => {
    listeners.push(listener);

    return {
      unSubscribe: () => listeners.splice(listeners.indexOf(listener), 1)
    };
  };

  return {
    dispatch,
    getState,
    subscribe
  };
};

const reducers = combine({
  appState,
  filter
});

const sampleStore = createStore(reducers);

const printSubscription = sampleStore.subscribe(store => console.log(store));

sampleStore.dispatch({ type: 'INIT_APP' });

sampleStore.dispatch({ type: 'SET_CITY', payload: 'Bristol' });
