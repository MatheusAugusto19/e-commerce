import React, { useState, useEffect, useMemo } from 'react';
import { useFreight } from '../context/useFreight';
import './FreightSelector.scss';

export default function FreightSelector({ zipcode, cartTotal, onSelect }) {
  const { calculateFreightOptions, selectedFreight, selectFreight } = useFreight();
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
    <div className="freight-selector">
      <h3>💌 Opções de Frete</h3>

      {error && <p className="freight-error">⚠️ {error}</p>}

      {freightOptions.length > 0 && (
        <div className="freight-options">
          {freightOptions.map((freight) => (
            <label
              key={freight.id}
              className={`freight-option ${selectedFreight?.id === freight.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="freight"
                value={freight.id}
                checked={selectedFreight?.id === freight.id}
                onChange={() => handleSelectFreight(freight)}
              />
              <div className="freight-info">
                <div className="freight-header">
                  <span className="freight-name">{freight.name}</span>
                  <span className="freight-price">R$ {freight.price.toFixed(2)}</span>
                </div>
                <div className="freight-details">
                  <span className="freight-days">📅 {freight.days} dias úteis</span>
                  <span className="freight-region">📍 {freight.region}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {freightOptions.length === 0 && !error && (
        <p className="freight-empty">Digite um CEP válido para ver as opções</p>
      )}
    </div>
  );
}
