
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
        const containerWidth = widgetContainer.clientWidth;
        const iframe = widgetContainer.querySelector('iframe');
        if (iframe) {
          // Set the iframe width based on container size
          // Adjust width for different screen sizes
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
          const isDesktop = window.innerWidth >= 1024;
          
          let widgetWidth = containerWidth;
          if (isMobile) {
            widgetWidth = Math.min(containerWidth, 320);
          } else if (isTablet) {
            widgetWidth = Math.min(containerWidth, 720);
          } else if (isDesktop) {
            widgetWidth = Math.min(containerWidth, 1200);
          }
          
          iframe.style.width = `${widgetWidth}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial call with a slight delay to ensure DOM is ready
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="w-full my-6">
      <CardHeader>
        <CardTitle className="text-xl">More Jobs in Kenya</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="widget-container" className="flex justify-center w-full relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          <iframe 
            src="https://www.myjobmag.co.ke/widget/feed.php?field=63,65&industry=0&keyword=&count=45&title=Jobs%20in%20Kenya%20-%20myjobmag.co.ke&width=1200&height=500&bgcolor=FFFFFF&border_color=CCCCCC&border_thickness=1&font_type=Verdana&title_font_size=14&title_font_color=000000&font_size=12&font_color=333333&link_color=031333&show_logo=Yes&scroll=No"
            frameBorder="0" 
            height="500" 
            scrolling="no"
            onLoad={hideLoader}
            title="MyJobMag Kenya Jobs"
            className="border rounded shadow-sm transition-all duration-300 max-w-full"
            style={{ minWidth: "300px", maxWidth: "1200px", width: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
