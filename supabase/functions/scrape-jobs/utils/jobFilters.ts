
// Enhanced supply chain keyword filtering with improved accuracy and context awareness
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
    'materials management',
    'supply planner',
    'demand planner',
    'logistics coordinator',
    'procurement officer',
    'inventory controller',
    'warehouse supervisor',
    'supply chain analyst',
    'logistics manager',
    'procurement manager',
    'warehouse manager',
    'inventory manager',
    'distribution manager',
    'supply chain manager',
    'logistics specialist',
    'procurement specialist',
    'warehouse specialist',
    'inventory specialist',
    'distribution specialist',
    'supply chain specialist'
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
    'replenishment',
    'delivery',
    'dispatch',
    'order management',
    'supply',
    'chain',
    'vendor',
    'supplier',
    'inbound',
    'outbound',
    'lean',
    'six sigma',
    'erp',
    'sap',
    'wms',
    'tms',
    'inventory control',
    'supply planning',
    'demand planning',
    'materials handling',
    'cold chain',
    'last mile',
    '3pl',
    '4pl'
  ];
  
  // Explicitly exclude certain job titles
  const excludedKeywords = [
    'construction manager',
    'software developer',
    'accountant',
    'receptionist',
    'security',
    'marketing',
    'sales representative',
    'teacher',
    'nurse',
    'doctor',
    'chef',
    'cashier',
    'cleaner',
    'driver',
    'customer service',
    'secretary',
    'administrative assistant',
    'web developer',
    'graphic designer',
    'human resources',
    'hr manager',
    'social media',
    'content writer',
    'journalist',
    'editor',
    'photographer',
    'electrician',
    'plumber',
    'mechanic',
    'hairdresser',
    'beautician'
  ];
  
  // If excluded keywords are present in the title, reject regardless of other matches
  for (const excluded of excludedKeywords) {
    if (lowerCaseText.includes(excluded)) {
      return false;
    }
  }
  
  // Check for strong keyword combinations that indicate supply chain roles
  const keywordCombinations = [
    ['supply', 'chain'],
    ['supply', 'management'],
    ['logistics', 'management'],
    ['procurement', 'management'],
    ['warehouse', 'management'],
    ['inventory', 'management'],
    ['distribution', 'management'],
    ['operations', 'management'],
    ['sourcing', 'management'],
    ['purchasing', 'management'],
    ['freight', 'management'],
    ['transport', 'management'],
    ['fleet', 'management'],
    ['planning', 'management'],
    ['demand', 'planning'],
    ['supply', 'planning'],
    ['material', 'planning'],
    ['inventory', 'planning'],
    ['logistics', 'coordinator'],
    ['procurement', 'coordinator'],
    ['warehouse', 'coordinator'],
    ['inventory', 'coordinator'],
    ['distribution', 'coordinator']
  ];
  
  for (const [word1, word2] of keywordCombinations) {
    if (lowerCaseText.includes(word1) && lowerCaseText.includes(word2)) {
      return true;
    }
  }
  
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
