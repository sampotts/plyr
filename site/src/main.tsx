import { hydrateRoot } from 'react-dom/client';
import { App } from './app';
import './site.css';

const root = document.getElementById('root');
if (root) hydrateRoot(root, <App />);
