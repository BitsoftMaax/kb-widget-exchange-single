import { render, screen } from '@testing-library/react';
import AppExchangeSingle from './App';

test('renders learn react link', () => {
  render(<AppExchangeSingle />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
