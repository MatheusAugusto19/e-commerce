import React, { useState, useCallback, useMemo } from 'react';
import { FreightContext } from './createFreightContext';

export const FreightProvider = ({ children }) => {
  const [selectedFreight, setSelectedFreight] = useState(null);
  const [lastZipcode, setLastZipcode] = useState('');

  // Tabela de regiões e custos de frete (useMemo para evitar recriação)
  const freightTable = useMemo(
    () => ({
      region1: { min: 1000, max: 39999, name: 'Sudeste', multiplier: 1.0 },
      region2: { min: 80000, max: 99999, name: 'Sul', multiplier: 1.5 },
      region3: { min: 40000, max: 65999, name: 'Nordeste', multiplier: 2.0 },
      region4: { min: 70000, max: 79999, name: 'Centro-Oeste', multiplier: 1.8 },
      region5: { min: 68000, max: 69999, name: 'Norte', multiplier: 2.5 },
    }),
    []
  );

  // Tipos de frete (useMemo para evitar recriação)
  const freightTypes = useMemo(
    () => ({
      standard: { name: 'Frete Padrão', days: '7-15', basePrice: 25 },
      express: { name: 'Frete Express', days: '3-5', basePrice: 45 },
      scheduled: { name: 'Frete Agendado', days: '1-3', basePrice: 65 },
    }),
    []
  );

  // Calcular região baseado no CEP
  const getRegionByZipcode = useCallback(
    (zipcode) => {
      const cleaned = zipcode.replace(/\D/g, '');
      if (cleaned.length !== 8) return null;

      const cepNumber = parseInt(cleaned.slice(0, 5), 10);

      for (const key in freightTable) {
        const region = freightTable[key];
        if (cepNumber >= region.min && cepNumber <= region.max) {
          return { key, ...region };
        }
      }

      return null;
    },
    [freightTable]
  );

  // Calcular opções de frete disponíveis
  const calculateFreightOptions = useCallback(
    (zipcode, cartTotal) => {
      const region = getRegionByZipcode(zipcode);
      if (!region) {
        return { valid: false, options: [], message: 'CEP não encontrado' };
      }

      const options = [];

      Object.entries(freightTypes).forEach(([key, freight]) => {
        const basePrice = freight.basePrice;
        // Aplicar multiplicador da região e porcentagem do valor da compra
        const price = Math.round(
          (basePrice * region.multiplier + cartTotal * 0.05) * 100
        ) / 100;

        options.push({
          id: key,
          name: freight.name,
          days: freight.days,
          price: parseFloat(price.toFixed(2)),
          region: region.name,
        });
      });

      setLastZipcode(zipcode);
      return { valid: true, options };
    },
    [getRegionByZipcode, freightTypes]
  );

  // Selecionar opção de frete
  const selectFreight = useCallback((freight) => {
    setSelectedFreight(freight);
  }, []);

  // Limpar seleção
  const clearFreight = useCallback(() => {
    setSelectedFreight(null);
  }, []);

  // Obter informações da região
  const getRegionInfo = useCallback(
    (zipcode) => {
      return getRegionByZipcode(zipcode);
    },
    [getRegionByZipcode]
  );

  const value = {
    selectedFreight,
    lastZipcode,
    calculateFreightOptions,
    selectFreight,
    clearFreight,
    getRegionInfo,
  };

  return (
    <FreightContext.Provider value={value}>
      {children}
    </FreightContext.Provider>
  );
};
