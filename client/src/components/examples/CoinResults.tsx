import CoinResults from '../CoinResults';

export default function CoinResultsExample() {
  return (
    <CoinResults
      imageUrl="https://images.unsplash.com/photo-1589875762596-dcd94c850a56?w=400"
      coinType="Quarter Dollar"
      country="United States"
      countryFlag="🇺🇸"
      denomination="25 Cents"
      year="2020"
      confidence={95}
      material="Copper-Nickel"
    />
  );
}
