import React from 'react';
import ReactDOM from 'react-dom';
import { Snaaake } from './snaaake';
import './main.css';

ReactDOM.render(
  <Snaaake width={24} height={24} scale={20} />,
  document.getElementById('root')
);
