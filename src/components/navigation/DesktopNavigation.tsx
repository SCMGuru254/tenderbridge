
import { NavLink } from "react-router-dom";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Building2,
  BookOpen,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const DesktopNavigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Jobs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <NavLink
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/jobs"
                  >
                    <Briefcase className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Browse Jobs
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Find supply chain and logistics opportunities across Kenya and East Africa.
                    </p>
                  </NavLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/job-seekers"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Job Seekers</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Career resources and tools
                    </p>
                  </NavLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/post-job"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Post a Job</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Find the right candidates
                    </p>
                  </NavLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <NavLink to="/discussions">
              <MessageSquare className="mr-2 h-4 w-4" />
              Discussions
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <NavLink to="/companies">
              <Building2 className="mr-2 h-4 w-4" />
              Companies
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/supply-chain-insights"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Supply Chain Insights</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Industry news and trends
                    </p>
                  </NavLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/interview-prep"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Interview Prep</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Questions and company insights
                    </p>
                  </NavLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/document-generator"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Document Generator</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      CV and cover letter tools
                    </p>
                  </NavLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/free-services"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Free Services</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      All our free tools and resources
                    </p>
                  </NavLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <NavLink to="/ai-agents">
              <Bot className="mr-2 h-4 w-4" />
              AI Agents
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
