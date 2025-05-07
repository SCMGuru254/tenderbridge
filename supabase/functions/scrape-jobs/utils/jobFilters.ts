
// Enhanced supply chain keyword filtering
export function hasSupplyChainKeywords(text: string): boolean {
  if (!text) return false;
  
  const lowerCaseText = text.toLowerCase();
  
  // Primary supply chain terms - if these are present, it's definitely a supply chain job
  const primaryKeywords = [
    'supply chain',
    'logistics',
    'procurement',
    'warehouse',
    'inventory',
    'shipping',
    'distribution',
    'scm',
    'supply management',
    'materials management'
  ];
  
  // Check for primary keywords
  for (const keyword of primaryKeywords) {
    if (lowerCaseText.includes(keyword)) {
      return true;
    }
  }
  
  // Secondary keywords - these might be supply chain related, but need more context
  const secondaryKeywords = [
    'operations',
    'sourcing',
    'purchasing',
    'freight',
    'transport',
    'fleet',
    'planning',
    'demand',
    'forecasting',
    'material',
    'import',
    'export',
    'customs',
    'stock',
    'fulfillment',
    'replenishment'
  ];
  
  // Count how many secondary keywords are present
  let secondaryMatches = 0;
  for (const keyword of secondaryKeywords) {
    if (lowerCaseText.includes(keyword)) {
      secondaryMatches++;
    }
  }
  
  // If there are at least 2 secondary keywords, it's likely a supply chain job
  return secondaryMatches >= 2;
}

// Check if a job is supply chain related based on title, description and category
export function isSupplyChainJob(job: { 
  title?: string; 
  description?: string; 
  category?: string | null;
}): boolean {
  const textsToCheck = [
    job.title || '',
    job.description || '',
    job.category || ''
  ].join(' ').toLowerCase();
  
  return hasSupplyChainKeywords(textsToCheck);
}
