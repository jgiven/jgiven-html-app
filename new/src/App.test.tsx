import { render, screen } from '@testing-library/react';
import App from './App';


//Nice wrapper library for testing https://testing-library.com/docs/ecosystem-user-event/
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

