import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen} from '@testing-library/react';
import PageViewNumbers from './PageViewNumbers';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<PageViewNumbers />, div);
	ReactDOM.unmountComponentAtNode(div);
});

test('call pageview compoennt with props', () => {
  render(<PageViewNumbers name="/home" total={2} text="views" />)
  expect(screen.getByText('/home 2 views')).toBeInTheDocument()
})