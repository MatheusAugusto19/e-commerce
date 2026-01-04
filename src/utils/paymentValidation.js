/**
 * Validação e formatação de dados de pagamento
 */

// Validar número do cartão (16 dígitos, algoritmo de Luhn)
export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length !== 16) {
    return { valid: false, message: 'Cartão deve ter 16 dígitos' };
  }

  // Algoritmo de Luhn para validação
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const isValid = sum % 10 === 0;
  return {
    valid: isValid,
    message: isValid ? 'Cartão válido' : 'Número de cartão inválido',
  };
};

// Validar data de validade (MM/AA)
export const validateCardExpiry = (expiry) => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;

  if (!regex.test(expiry)) {
    return { valid: false, message: 'Formato deve ser MM/AA' };
  }

  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);

  if (expiryYear < currentYear) {
    return { valid: false, message: 'Cartão expirado' };
  }

  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return { valid: false, message: 'Cartão expirado' };
  }

  return { valid: true, message: 'Validade válida' };
};

// Validar CVC (3 dígitos)
export const validateCVC = (cvc) => {
  const cleaned = cvc.replace(/\D/g, '');

  if (cleaned.length !== 3) {
    return { valid: false, message: 'CVC deve ter 3 dígitos' };
  }

  return { valid: true, message: 'CVC válido' };
};

// Validar nome no cartão
export const validateCardName = (name) => {
  const cleaned = name.trim();

  if (cleaned.length < 5) {
    return { valid: false, message: 'Nome muito curto' };
  }

  if (cleaned.length > 50) {
    return { valid: false, message: 'Nome muito longo' };
  }

  // Deve ter pelo menos 2 palavras
  if (cleaned.split(' ').length < 2) {
    return { valid: false, message: 'Nome deve ter sobrenome' };
  }

  return { valid: true, message: 'Nome válido' };
};

// Formatar número do cartão com espaços (1234 5678 9012 3456)
export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const truncated = cleaned.slice(0, 16);
  return truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Formatar data de validade (MM/AA)
export const formatCardExpiry = (value) => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  }
  
  return cleaned;
};

// Formatar CVC (apenas 3 dígitos)
export const formatCVC = (value) => {
  return value.replace(/\D/g, '').slice(0, 3);
};

// Ocultar número do cartão para exibição (1234 **** **** 5678)
export const maskCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 8) return cardNumber;
  
  const first4 = cleaned.slice(0, 4);
  const last4 = cleaned.slice(-4);
  return `${first4} **** **** ${last4}`;
};

// Validar todos os dados do cartão
export const validateAllPaymentData = (cardData) => {
  const errors = {};

  // Validar nome
  const nameValidation = validateCardName(cardData.cardName);
  if (!nameValidation.valid) {
    errors.cardName = nameValidation.message;
  }

  // Validar número
  const numberValidation = validateCardNumber(cardData.cardNumber);
  if (!numberValidation.valid) {
    errors.cardNumber = numberValidation.message;
  }

  // Validar validade
  const expiryValidation = validateCardExpiry(cardData.cardExpiry);
  if (!expiryValidation.valid) {
    errors.cardExpiry = expiryValidation.message;
  }

  // Validar CVC
  const cvcValidation = validateCVC(cardData.cardCVC);
  if (!cvcValidation.valid) {
    errors.cardCVC = cvcValidation.message;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
