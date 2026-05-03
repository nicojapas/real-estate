import { BerlinDefaults, PurchaseCosts } from './types';

export function calculatePurchaseCosts(
  propertyValue: number,
  defaults: BerlinDefaults,
  includeBroker: boolean
): PurchaseCosts {
  const propertyTransferTax = propertyValue * (defaults.propertyTransferTax / 100);
  const notaryFees = propertyValue * (defaults.notaryFees / 100);
  const landRegistryFees = propertyValue * (defaults.landRegistryFees / 100);
  const brokerFees = includeBroker
    ? propertyValue * (defaults.brokerFees / 100)
    : 0;

  return {
    propertyTransferTax,
    notaryFees,
    landRegistryFees,
    brokerFees,
    total: propertyTransferTax + notaryFees + landRegistryFees + brokerFees,
  };
}
