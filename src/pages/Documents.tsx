
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Documents = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Documents</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Document management features will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;
