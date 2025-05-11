
import { AdPlacementVisualizer } from "@/components/AdPlacementVisualizer";

export default function AdManagement() {
  return (
    <div className="container mx-auto px-4 py-12 mt-8">
      <h1 className="text-3xl font-bold mb-2">Ad Management</h1>
      <p className="text-muted-foreground mb-8">
        Review and manage ad placements across the SupplyChain_KE platform
      </p>

      <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
        <AdPlacementVisualizer />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ad Implementation Guidelines</h2>
        <div className="p-6 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-medium mb-2">Implementation Notes</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Banner Ads:</strong> Horizontal ad units placed at the top of pages, typically 
              with dimensions of 728×90px (desktop) or 320×50px (mobile).
            </li>
            <li>
              <strong>Sidebar Ads:</strong> Vertical rectangular ads placed in the sidebar with 
              dimensions of 300×600px.
            </li>
            <li>
              <strong>Inline Ads:</strong> Content-integrated ads that appear within the main content 
              flow, typically with dimensions of 300×250px.
            </li>
            <li>
              <strong>Interstitial Ads:</strong> Full-screen ads that cover the interface, typically 
              shown at natural transition points in the app flow.
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-2">Compliance Requirements</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              All ads must comply with local eCPM benchmarks (165-275 KES per 1,000 views in Kenya).
            </li>
            <li>
              Users must be able to easily close interstitial ads.
            </li>
            <li>
              Ad content must be relevant to supply chain professionals.
            </li>
            <li>
              Ads must not contain misleading content or claims.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
