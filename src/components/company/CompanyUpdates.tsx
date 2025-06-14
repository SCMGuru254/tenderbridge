
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompanyUpdate } from '@/types/careers';

interface CompanyUpdatesProps {
  updates: CompanyUpdate[];
}

export const CompanyUpdates = ({ updates }: CompanyUpdatesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Company Updates</h3>
      {updates.length === 0 ? (
        <p className="text-muted-foreground">No updates available.</p>
      ) : (
        updates.map((update) => (
          <Card key={update.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{update.title}</CardTitle>
                <Badge variant="outline">{update.type}</Badge>
              </div>
              <CardDescription>
                {new Date(update.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            {update.content && (
              <CardContent>
                <p className="text-muted-foreground">{update.content}</p>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
};
