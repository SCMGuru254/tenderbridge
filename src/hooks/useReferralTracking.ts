import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useReferralTracking = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      console.log("Referral code detected:", refCode);
      // Save to local storage with expiration (e.g. 60 days)
      const data = {
        code: refCode,
        timestamp: new Date().getTime(),
        expiresAt: new Date().getTime() + (60 * 24 * 60 * 60 * 1000) // 60 days
      };
      localStorage.setItem('affiliate_ref', JSON.stringify(data));
    }
  }, [searchParams]);

  return null;
};
