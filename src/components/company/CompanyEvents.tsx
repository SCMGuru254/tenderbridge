
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompanyEvent } from '@/types/careers';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';

interface CompanyEventsProps {
  events: CompanyEvent[];
}

export const CompanyEvents = ({ events }: CompanyEventsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upcoming Events</h3>
      {events.length === 0 ? (
        <p className="text-muted-foreground">No upcoming events.</p>
      ) : (
        events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-base">{event.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  {event.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <Badge variant="outline">{event.location.type}</Badge>
                    </div>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            {event.description && (
              <CardContent>
                <p className="text-muted-foreground mb-4">{event.description}</p>
                {event.location?.url && (
                  <a
                    href={event.location.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Join Event
                  </a>
                )}
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
};
