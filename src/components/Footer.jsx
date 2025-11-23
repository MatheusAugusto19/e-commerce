import React from 'react';
import './Footer.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavigation = (hash) => {
    window.location.hash = hash;
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sobre a Loja</h3>
          <p>
            Somos uma loja online dedicada a oferecermos os melhores produtos
            de tecnologia com preços competitivos e atendimento excepcional.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" title="Facebook">
              f
            </a>
            <a href="#" className="social-link" title="Twitter">
              𝕏
            </a>
            <a href="#" className="social-link" title="Instagram">
              📷
            </a>
            <a href="#" className="social-link" title="LinkedIn">
              in
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Menu Rápido</h3>
          <ul className="footer-links">
            <li>
              <button onClick={() => handleNavigation('')}>
                🏠 Home
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('#carrinho')}>
                🛒 Carrinho
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('#favoritos')}>
                ❤️ Favoritos
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('#pedidos')}>
                📦 Meus Pedidos
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Informações</h3>
          <ul className="footer-links">
            <li>
              <a href="#">📋 Sobre Nós</a>
            </li>
            <li>
              <a href="#">📞 Contato</a>
            </li>
            <li>
              <a href="#">🛡️ Políticas de Privacidade</a>
            </li>
            <li>
              <a href="#">📜 Termos de Serviço</a>
            </li>
            <li>
              <a href="#">↩️ Devoluções</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <ul className="contact-info">
            <li>
              <strong>Email:</strong>
              <a href="mailto:suporte@ecommerce.com">suporte@ecommerce.com</a>
            </li>
            <li>
              <strong>Telefone:</strong>
              <a href="tel:+5511999999999">(11) 9 9999-9999</a>
            </li>
            <li>
              <strong>Endereço:</strong>
              <p>São Paulo, SP - Brasil</p>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Formas de Pagamento</h3>
          <div className="payment-methods">
            <span className="payment-icon" title="Crédito">
              💳
            </span>
            <span className="payment-icon" title="Débito">
              🏧
            </span>
            <span className="payment-icon" title="Pix">
              📱
            </span>
            <span className="payment-icon" title="Boleto">
              📄
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <div className="footer-credits">
          <p>
            © {currentYear} E-Commerce. Todos os direitos reservados. | Feito
            com ❤️ por{' '}
            <strong>
              <a href="https://github.com/MatheusAugusto19" target="_blank" rel="noopener noreferrer">
                MatheusAugusto19
              </a>
            </strong>
          </p>
          <div className="footer-badges">
            <span className="badge">✨ React 19</span>
            <span className="badge">⚡ Vite</span>
            <span className="badge">🎨 SCSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
