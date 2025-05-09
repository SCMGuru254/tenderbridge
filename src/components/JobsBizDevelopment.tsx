
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "./careers/HeroSection";
import { VisionCard } from "./careers/VisionCard";
import { RoleTabs } from "./careers/RoleTabs";
import { RevenueModelCard } from "./careers/RevenueModelCard";
import { CareersVotingCTA } from "./CareersVotingCTA";

export const JobsBizDevelopment = () => {
  const navigate = useNavigate();
  
  const handleSubmitVisionClick = useCallback(() => {
    navigate("/careers?tab=apply");
  }, [navigate]);

  return (
    <div className="animate-fade-in space-y-8">
      <HeroSection />
      
      <CareersVotingCTA telegramLink="https://t.me/+wfJms8ke7Ro5MDZk" />
      
      <VisionCard />
      
      <RoleTabs />

      <RevenueModelCard onSubmitClick={handleSubmitVisionClick} />
    </div>
  );
};
