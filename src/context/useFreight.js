import { useContext } from 'react';
import { FreightContext } from './FreightContext';

export const useFreight = () => {
  const context = useContext(FreightContext);
  if (!context) {
    throw new Error('useFreight must be used within FreightProvider');
  }
  return context;
};
