import { useState } from "react";
import useStore from "../store/useStore";
import styles from "./LoginRegisterModal.module.scss";

export default function LoginRegisterModal({ isOpen, onClose }) {
  const { login, register } = useStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLoginMode) {
        login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Senhas não conferem");
        }
        register(formData.name, formData.email, formData.password);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao processar requisição");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2>{isLoginMode ? "Entrar" : "Criar Conta"}</h2>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {!isLoginMode && (
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLoginMode}
                placeholder="Seu nome completo"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {!isLoginMode && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLoginMode}
                placeholder="Confirme sua senha"
              />
            </div>
          )}

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : isLoginMode ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className={styles.modeToggle}>
          <p>
            {isLoginMode ? "Não tem conta?" : "Já tem conta?"}
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className={styles.toggleBtn}
            >
              {isLoginMode ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
