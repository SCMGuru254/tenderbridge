
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter, Send } from "lucide-react";
import { Link } from "react-router-dom";

interface CareersVotingCTAProps {
  telegramLink?: string;
}

export const CareersVotingCTA = ({ telegramLink }: CareersVotingCTAProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-orange-800">Join our team by voting initiative</h3>
          <p className="text-orange-700 mt-1">
            Share your vision and let the community vote for the best ideas that will drive success
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="border-orange-300 text-orange-800 bg-orange-50 hover:bg-orange-100">
            <Link to="/careers?tab=submissions">View Submissions</Link>
          </Button>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/careers?tab=apply">Submit Your Vision</Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-orange-200">
        <p className="text-sm text-orange-700 mb-2">Follow and share on social media:</p>
        <div className="flex gap-3">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-600">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900">
            <Linkedin className="h-5 w-5" />
          </a>
          {telegramLink && (
            <a href={telegramLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
              <Send className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
