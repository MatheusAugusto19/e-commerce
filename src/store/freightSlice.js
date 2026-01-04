const freightSlice = (set, get) => ({
  selectedFreight: null,
  freightTable: {
    region1: { min: 1000, max: 39999, name: 'Sudeste', multiplier: 1.0 },
    region2: { min: 80000, max: 99999, name: 'Sul', multiplier: 1.5 },
    region3: { min: 40000, max: 65999, name: 'Nordeste', multiplier: 2.0 },
    region4: { min: 70000, max: 79999, name: 'Centro-Oeste', multiplier: 1.8 },
    region5: { min: 68000, max: 69999, name: 'Norte', multiplier: 2.5 },
  },
  freightTypes: {
    standard: { name: 'Frete Padrão', days: '7-15', basePrice: 25 },
    express: { name: 'Frete Express', days: '3-5', basePrice: 45 },
    scheduled: { name: 'Frete Agendado', days: '1-3', basePrice: 65 },
  },

  getRegionByZipcode: (zipcode) => {
    const cleaned = zipcode.replace(/\D/g, '');
    if (cleaned.length !== 8) return null;
    const cepNumber = parseInt(cleaned.slice(0, 5), 10);
    for (const key in get().freightTable) {
      const region = get().freightTable[key];
      if (cepNumber >= region.min && cepNumber <= region.max) {
        return { key, ...region };
      }
    }
    return null;
  },

  calculateFreightOptions: (zipcode, cartTotal) => {
    const region = get().getRegionByZipcode(zipcode);
    if (!region) {
      return { valid: false, options: [], message: 'CEP não encontrado' };
    }
    const options = [];
    Object.entries(get().freightTypes).forEach(([key, freight]) => {
      const price = Math.round((freight.basePrice * region.multiplier + cartTotal * 0.05) * 100) / 100;
      options.push({ id: key, name: freight.name, days: freight.days, price: parseFloat(price.toFixed(2)), region: region.name });
    });
    return { valid: true, options };
  },

  selectFreight: (freight) => set({ selectedFreight: freight }),
  clearFreight: () => set({ selectedFreight: null }),
});

export default freightSlice;
