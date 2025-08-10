
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavigationMenus = () => {
  return (
    <nav className="hidden md:flex space-x-6">
      <Button variant="ghost" asChild>
        <NavLink to="/jobs">Jobs</NavLink>
      </Button>
      <Button variant="ghost" asChild>
        <NavLink to="/discussions">Discussions</NavLink>
      </Button>
      <Button variant="ghost" asChild>
        <NavLink to="/companies">Companies</NavLink>
      </Button>
      <Button variant="ghost" asChild>
        <NavLink to="/company-signup">Company Signup</NavLink>
      </Button>
      <Button variant="ghost" asChild>
        <NavLink to="/supply-chain-insights">Insights</NavLink>
      </Button>
    </nav>
  );
};

export default NavigationMenus;
