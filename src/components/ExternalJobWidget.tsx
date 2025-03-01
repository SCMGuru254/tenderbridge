
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export const ExternalJobWidget = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const hideLoader = () => {
    setIsLoading(false);
  };

  // Calculate responsive width based on viewport
  useEffect(() => {
    const handleResize = () => {
      const widgetContainer = document.getElementById('widget-container');
      if (widgetContainer) {
        // Adjust widget width based on container width
        const iframe = widgetContainer.querySelector('iframe');
        if (iframe) {
          const containerWidth = widgetContainer.clientWidth;
          iframe.style.width = `${Math.min(containerWidth, 300)}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial call
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-xl">More Jobs in Kenya</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="widget-container" className="flex justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          <iframe 
            src="https://www.myjobmag.co.ke/widget/feed.php?field=63,65&industry=0&keyword=&count=45&title=Jobs%20in%20Kenya%20-%20myjobmag.co.ke&width=300&height=500&bgcolor=FFFFFF&border_color=CCCCCC&border_thickness=1&font_type=Verdana&title_font_size=14&title_font_color=000000&font_size=12&font_color=333333&link_color=031333&show_logo=Yes&scroll=No"
            frameBorder="0" 
            width="300" 
            height="500" 
            scrolling="no"
            onLoad={hideLoader}
            title="MyJobMag Kenya Jobs"
            className="border rounded shadow-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};
