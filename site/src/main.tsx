import { hydrate } from 'preact';
import { App } from './app';
import './site.css';

const root = document.getElementById('root');
// Hydrates the prerendered markup in production. In dev the root is empty, so this is a plain render.
if (root) hydrate(<App />, root);
