import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Sobre a Loja</h3>
          <p>
            Somos uma loja online dedicada a oferecermos os melhores produtos
            de tecnologia com preços competitivos e atendimento excepcional.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} title="Facebook">
              f
            </a>
            <a href="#" className={styles.socialLink} title="Twitter">
              𝕏
            </a>
            <a href="#" className={styles.socialLink} title="Instagram">
              📷
            </a>
            <a href="#" className={styles.socialLink} title="LinkedIn">
              in
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Menu Rápido</h3>
          <ul className={styles.footerLinks}>
            <li>
              <Link to="/">
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/cart">
                🛒 Carrinho
              </Link>
            </li>
            <li>
              <Link to="/wishlist">
                ❤️ Favoritos
              </Link>
            </li>
            <li>
              <Link to="/orders">
                📦 Meus Pedidos
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Informações</h3>
          <ul className={styles.footerLinks}>
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

        <div className={styles.footerSection}>
          <h3>Contato</h3>
          <ul className={styles.contactInfo}>
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

        <div className={styles.footerSection}>
          <h3>Formas de Pagamento</h3>
          <div className={styles.paymentMethods}>
            <span className={styles.paymentIcon} title="Crédito">
              💳
            </span>
            <span className={styles.paymentIcon} title="Débito">
              🏧
            </span>
            <span className={styles.paymentIcon} title="Pix">
              📱
            </span>
            <span className={styles.paymentIcon} title="Boleto">
              📄
            </span>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerDivider}></div>
        <div className={styles.footerCredits}>
          <p>
            © {currentYear} E-Commerce. Todos os direitos reservados. | Feito
            com ❤️ por{' '}
            <strong>
              <a href="https://github.com/MatheusAugusto19" target="_blank" rel="noopener noreferrer">
                MatheusAugusto19
              </a>
            </strong>
          </p>
          <div className={styles.footerBadges}>
            <span className={styles.badge}>✨ React 19</span>
            <span className={styles.badge}>⚡ Vite</span>
            <span className={styles.badge}>🎨 SCSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
