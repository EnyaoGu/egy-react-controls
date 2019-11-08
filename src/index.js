import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import DevPanel from './controls/DevPanel.jsx';

window.addEventListener('load', () => {
	ReactDOM.render(<DevPanel></DevPanel>, document.getElementById('root'));
}, { once: true });
