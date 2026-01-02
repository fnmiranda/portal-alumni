import { useMemo } from 'react';
import { Country, State, City } from 'country-state-city';
import { useIbgeLocations } from './useIbgeLocations';

function sortByNamePtBr(a, b) {
  return (a?.name || '').localeCompare(b?.name || '', 'pt-BR');
}

export function useCountryLocations(isOpen, countryIso2, stateCode) {
  const isBrazil = countryIso2 === 'BR';

  const countries = useMemo(() => {
    const list = Country.getAllCountries()
      .map((c) => ({ name: c.name, iso2: c.isoCode }))
      .filter((c) => c.iso2 && c.name)
      .sort((a, b) => {
        if (a.iso2 === 'BR') return -1;
        if (b.iso2 === 'BR') return 1;
        return sortByNamePtBr(a, b);
      });

    return list;
  }, []);

  const ibge = useIbgeLocations(isOpen, isBrazil ? stateCode : '', isBrazil);

  const states = useMemo(() => {
    if (!isOpen) return [];

    if (isBrazil) {
      return (ibge.ufs || []).map((u) => ({ code: u.sigla, name: u.nome }));
    }

    if (!countryIso2) return [];

    return State.getStatesOfCountry(countryIso2)
      .map((s) => ({ code: s.isoCode || s.name, name: s.name }))
      .filter((s) => s.code && s.name)
      .sort(sortByNamePtBr);
  }, [isOpen, isBrazil, countryIso2, ibge.ufs]);

  const hasStates = states.length > 0;

  const citiesReady = isOpen && !!countryIso2 && (!hasStates || !!stateCode);

  const cities = useMemo(() => {
    if (!isOpen) return [];

    if (isBrazil) {
      return Array.isArray(ibge.cities) ? ibge.cities : [];
    }

    if (!countryIso2) return [];

    if (hasStates) {
      if (!stateCode) return [];
      return City.getCitiesOfState(countryIso2, stateCode)
        .map((c) => c.name)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }

    const getByCountry = City.getCitiesOfCountry?.bind(City);
    const list = getByCountry ? getByCountry(countryIso2) : [];

    return (list || [])
      .map((c) => c.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [isOpen, isBrazil, countryIso2, stateCode, ibge.cities, hasStates]);

  const citiesAvailable = citiesReady && cities.length > 0;
  const allowManualCity = citiesReady && cities.length === 0;

  // ✅ Bangladesh etc: tem estado selecionado, mas a lib não tem cidades
  const needsAddressComplement =
    citiesReady && hasStates && !!stateCode && cities.length === 0;

  return {
    countries,
    states,
    cities,
    isBrazil,
    hasStates,
    citiesReady,
    citiesAvailable,
    allowManualCity,
    needsAddressComplement,
    loadingStates: isBrazil ? ibge.loadingUfs : false,
    loadingCities: isBrazil ? ibge.loadingCities : false,
  };
}
