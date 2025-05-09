
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoreRolesTab } from "./CoreRolesTab";
import { SpecializedRolesTab } from "./SpecializedRolesTab";
import { DashboardTab } from "./DashboardTab";

export const RoleTabs = () => {
  return (
    <Tabs defaultValue="core" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="core">Core Roles</TabsTrigger>
        <TabsTrigger value="specialized">Specialized Roles</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboards</TabsTrigger>
      </TabsList>
      
      <TabsContent value="core">
        <CoreRolesTab />
      </TabsContent>
      
      <TabsContent value="specialized">
        <SpecializedRolesTab />
      </TabsContent>
      
      <TabsContent value="dashboard">
        <DashboardTab />
      </TabsContent>
    </Tabs>
  );
};
