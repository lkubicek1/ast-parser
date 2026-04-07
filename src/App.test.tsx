import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the parser workspace', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /tokens/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /syntax tree/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /filtered data/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/enter boolean expression/i)).toBeInTheDocument();
});
