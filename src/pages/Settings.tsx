import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { navigationCategories } from '@/config/navigation';

const SettingsPage = () => {
  const {
    state,
    dispatch,
    setAlwaysShowBottomNav,
    hideCategory,
    showCategory,
    isCategoryHidden,
    removeFavorite
  } = useNavigation();

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Navigation Settings</h1>
      
      <div className="space-y-6">
        {/* Bottom Navigation Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Bottom Navigation</h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="bottom-nav">Always show bottom navigation</Label>
            <Switch
              id="bottom-nav"
              checked={state.preferences.alwaysShowBottomNav}
              onCheckedChange={setAlwaysShowBottomNav}
            />
          </div>
        </div>

        <Separator />

        {/* Category Visibility Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Category Visibility</h2>
          <div className="space-y-4">
            {navigationCategories.map(category => (
              <div key={category.name} className="flex items-center justify-between">
                <Label htmlFor={`category-${category.name}`}>{category.name}</Label>
                <Switch
                  id={`category-${category.name}`}
                  checked={!isCategoryHidden(category.name)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      showCategory(category.name);
                    } else {
                      hideCategory(category.name);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Recent and Favorites */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent and Favorites</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Recent Links</h3>
              <div className="bg-muted rounded-lg p-4">
                {state.preferences.recentLinks?.length ? (
                  <ul className="space-y-2">
                    {state.preferences.recentLinks.map(link => (
                      <li key={link} className="flex items-center justify-between">
                        <span className="text-sm">{link}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newRecent = state.preferences.recentLinks?.filter(l => l !== link) || [];
                            dispatch({ type: 'SET_RECENT_LINKS', payload: newRecent });
                          }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No recent links</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Favorite Links</h3>
              <div className="bg-muted rounded-lg p-4">
                {state.preferences.favoriteLinks?.length ? (
                  <ul className="space-y-2">
                    {state.preferences.favoriteLinks.map(link => (
                      <li key={link} className="flex items-center justify-between">
                        <span className="text-sm">{link}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavorite(link)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No favorite links</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;