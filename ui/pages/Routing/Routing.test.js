import React from 'react';
import {Routing} from './Routing';
import { createRoot } from 'react-dom/client';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<Routing />);
  root.unmount();
});
