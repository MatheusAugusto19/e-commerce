import { useState, useEffect, useMemo } from 'react';
import useStore from '../store/useStore';
import styles from './FreightSelector.module.scss';

export default function FreightSelector({ zipcode, cartTotal, onSelect }) {
  const { calculateFreightOptions, selectedFreight, selectFreight } = useStore();
  const [freightOptions, setFreightOptions] = useState([]);
  const [error, setError] = useState('');

  // Memorizar o resultado do cálculo
  const calculatedFreight = useMemo(() => {
    if (!zipcode || zipcode.length < 8) {
      return { valid: false, options: [], message: '' };
    }
    return calculateFreightOptions(zipcode, cartTotal);
  }, [zipcode, cartTotal, calculateFreightOptions]);

  // Atualizar estado quando o resultado mudar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (calculatedFreight.valid) {
        setFreightOptions(calculatedFreight.options);
        setError('');
      } else if (calculatedFreight.message) {
        setFreightOptions([]);
        setError(calculatedFreight.message);
      } else {
        setFreightOptions([]);
        setError('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [calculatedFreight]);

  const handleSelectFreight = (freight) => {
    selectFreight(freight);
    onSelect?.(freight);
  };

  return (
    <div className={styles.freightSelector}>
      <h3>💌 Opções de Frete</h3>

      {error && <p className={styles.freightError}>⚠️ {error}</p>}

      {freightOptions.length > 0 && (
        <div className={styles.freightOptions}>
          {freightOptions.map((freight) => (
            <label
              key={freight.id}
              className={`${styles.freightOption} ${
                selectedFreight?.id === freight.id ? styles.selected : ''
              }`}
            >
              <input
                type="radio"
                name="freight"
                value={freight.id}
                checked={selectedFreight?.id === freight.id}
                onChange={() => handleSelectFreight(freight)}
              />
              <div className={styles.freightInfo}>
                <div className={styles.freightHeader}>
                  <span className={styles.freightName}>{freight.name}</span>
                  <span className={styles.freightPrice}>R$ {freight.price.toFixed(2)}</span>
                </div>
                <div className={styles.freightDetails}>
                  <span className={styles.freightDays}>📅 {freight.days} dias úteis</span>
                  <span className={styles.freightRegion}>📍 {freight.region}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {freightOptions.length === 0 && !error && (
        <p className={styles.freightEmpty}>Digite um CEP válido para ver as opções</p>
      )}
    </div>
  );
}
