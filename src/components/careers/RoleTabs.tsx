
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoreRolesTab } from "./CoreRolesTab";
import { SpecializedRolesTab } from "./SpecializedRolesTab";

export const RoleTabs = () => {
  return (
    <Tabs defaultValue="core" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="core">Core Roles</TabsTrigger>
        <TabsTrigger value="specialized">Specialized Roles</TabsTrigger>
      </TabsList>
      
      <TabsContent value="core">
        <CoreRolesTab />
      </TabsContent>
      
      <TabsContent value="specialized">
        <SpecializedRolesTab />
      </TabsContent>
    </Tabs>
  );
};
