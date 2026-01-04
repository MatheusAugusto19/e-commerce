import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the footer with current year', () => {
    render(
      <Router>
        <Footer />
      </Router>
    );

    const currentYear = new Date().getFullYear();
    const textElement = screen.getByText(`© ${currentYear} E-Commerce. Todos os direitos reservados. | Feito com ❤️ por`);
    expect(textElement).toBeInTheDocument();
  });
});
