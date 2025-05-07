
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useJobData } from "@/hooks/useJobData";
import { supabase } from "@/integrations/supabase/client";
import { CircleCheck, ExternalLink, RefreshCw } from "lucide-react";

export const ExternalJobWidget = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const { refetchScrapedJobs } = useJobData();
  
  const hideLoader = () => {
    setIsLoading(false);
  };

  const importMyJobMagJobs = async () => {
    try {
      setIsImporting(true);
      setImportSuccess(false);
      
      // Call the Edge Function to scrape jobs, specifying the MyJobMag source
      // and explicitly requesting supply chain related keywords
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: {
          refreshAll: false,
          sources: ['MyJobMag XML Feed'],
          keywords: ['supply chain', 'logistics', 'procurement', 'warehouse', 'inventory', 'shipping', 'distribution']
        },
      });
      
      if (error) {
        console.error('Error importing MyJobMag jobs:', error);
      } else {
        console.log('MyJobMag jobs imported successfully:', data);
        // Refetch jobs to show the newly scraped ones
        refetchScrapedJobs();
        setImportSuccess(true);
      }
    } catch (error) {
      console.error('Exception when importing MyJobMag jobs:', error);
    } finally {
      setIsImporting(false);
    }
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
          iframe.style.width = `${containerWidth}px`;
          
          // Ensure the iframe isn't too narrow on small screens
          if (containerWidth < 500) {
            iframe.style.minWidth = '100%';
            iframe.style.height = '700px'; // Increase height for better readability on narrow screens
          } else {
            iframe.style.height = '500px';
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial call with a slight delay to ensure DOM is ready
    setTimeout(handleResize, 300);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="w-full my-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Supply Chain Jobs in Kenya</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            onClick={importMyJobMagJobs} 
            disabled={isImporting}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : importSuccess ? (
              <>
                <CircleCheck className="h-4 w-4 text-green-500" />
                Jobs Imported
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                Import to Platform
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div id="widget-container" className="flex justify-center w-full relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          <iframe 
            src="https://www.myjobmag.co.ke/widget/feed.php?field=63,65&industry=0&keyword=supply%20chain%20logistics%20procurement%20warehouse&count=45&title=Supply%20Chain%20Jobs%20in%20Kenya&width=1200&height=500&bgcolor=FFFFFF&border_color=CCCCCC&border_thickness=1&font_type=Verdana&title_font_size=14&title_font_color=000000&font_size=12&font_color=333333&link_color=031333&show_logo=Yes&scroll=No"
            frameBorder="0" 
            height="500" 
            scrolling="no"
            onLoad={hideLoader}
            title="MyJobMag Kenya Jobs"
            className="border rounded shadow-sm transition-all duration-300 max-w-full"
            style={{ width: "1200px", maxWidth: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
