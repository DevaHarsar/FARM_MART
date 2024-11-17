import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"; // Keep your styles
import { Provider } from "react-redux"; // Import Redux Provider
import { store } from "./state/Store"; // Import your Redux store

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// // src/index.jsx
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import './index.css'
// import { AuthProvider } from './context/AuthContext';

// ReactDOM.render(
//   <AuthProvider>
//     <App />
//   </AuthProvider>,
//   document.getElementById('root')
// );
