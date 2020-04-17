import React from 'react';
import ReactDOM from 'react-dom';
import { Snaaake } from './snaaake';
import './main.css';

ReactDOM.render(
  <Snaaake width={20} height={20} scale={24} />,
  document.getElementById('root')
);
