import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { TechPark } from '@/types';

interface TechParkSelectionProps {
  onSelectPark: (park: TechPark) => void;
}

export default function TechParkSelection({ onSelectPark }: TechParkSelectionProps) {
  const { data: techParks, isLoading } = useQuery<TechPark[]>({
    queryKey: ['/api/tech-parks'],
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Select Tech Park</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Select Tech Park</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techParks?.map((park) => (
          <Card 
            key={park.id}
            className="cursor-pointer transition-colors hover:bg-accent/50 border-2 border-primary"
            onClick={() => onSelectPark(park)}
            data-testid={`card-tech-park-${park.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <i className="fas fa-building text-2xl text-primary"></i>
                <h3 className="text-lg font-semibold text-foreground">{park.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">{park.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {park.location}
                </span>
                <Badge variant="secondary" data-testid={`badge-outlets-${park.id}`}>
                  {park.totalOutlets}+ Outlets
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
