
export function hasSupplyChainKeywords(text: string): boolean {
  const keywords = [
    'supply',
    'chain',
    'logistics',
    'procurement',
    'warehouse',
    'inventory',
    'shipping',
    'distribution',
    'operations',
    'sourcing',
    'purchasing'
  ];
  
  const lowerCaseText = text.toLowerCase();
  return keywords.some(keyword => lowerCaseText.includes(keyword));
}
