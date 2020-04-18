import React from 'react';
import ReactDOM from 'react-dom';
import { Snaaake } from './snaaake';
import './main.css';

ReactDOM.render(
  <Snaaake width={18} height={18} scale={24} />,
  document.getElementById('root')
);
