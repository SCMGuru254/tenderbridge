
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export const DemoVideoModal = ({ isOpen, onClose, videoUrl = "https://www.youtube.com/embed/XsvOvI6UcYU" }: DemoVideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">SupplyChain Jobs Platform Demo</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* YouTube Video Embed */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={videoUrl}
              title="SupplyChain KE Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Demo Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Smart Job Matching</h4>
              <p className="text-blue-700 text-sm">
                Our AI matches you with the most relevant supply chain opportunities based on your skills and preferences.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">📈 Career Growth Tools</h4>
              <p className="text-green-700 text-sm">
                Access mentorship programs, salary insights, and interview preparation resources.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">🤝 Professional Network</h4>
              <p className="text-purple-700 text-sm">
                Connect with industry experts and build meaningful professional relationships.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">💼 Real-Time Opportunities</h4>
              <p className="text-orange-700 text-sm">
                Get notified instantly when new jobs matching your criteria are posted.
              </p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Ready to Transform Your Career?</h3>
            <p className="text-gray-600 mb-4">
              Join thousands of supply chain professionals who have found their dream jobs through our platform.
            </p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
              Get Started Free
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
