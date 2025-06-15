
// STRICT RULE: NO FALLBACK/MOCK JOBS ALLOWED
// This application must only show real job data
export function getFallbackJobs() {
  console.log("🚫 getFallbackJobs called - returning empty array as no mock data is allowed");
  return [];
}
