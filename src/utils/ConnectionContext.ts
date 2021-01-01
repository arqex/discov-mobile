import {createContext} from 'react';

interface ConnectionContextValue {
  isConnected: boolean
}

// Reuse the same object to no to trigger unnecessary re-renders
let contextValue: ConnectionContextValue = {
  isConnected: true
};

const Context = createContext( contextValue );

const ConnectionContext = {
  Context,
  Provider: Context.Provider,
  Consumer: Context.Consumer,
  getValue: () => contextValue,
  // Root set the value when there is connection and the api is initialized
  setValue: (value: ConnectionContextValue) => contextValue = value
}

export default ConnectionContext;