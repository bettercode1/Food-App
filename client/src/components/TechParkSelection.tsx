import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin as LocationOn, Building as Business, Store, RotateCcw as Refresh, AlertTriangle as Warning, ArrowRight as ArrowForward, Search, Filter, X, SortAsc } from 'lucide-react';
import type { TechPark } from '@/types';

interface TechParkSelectionProps {
  onSelectPark: (park: TechPark) => void;
}

export default function TechParkSelection({ onSelectPark }: TechParkSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const { data: techParks, isLoading, error } = useQuery<TechPark[]>({
    queryKey: ['/api/tech-parks'],
    queryFn: async () => {
      const response = await fetch('/api/tech-parks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    }
  });

  // Filter and sort tech parks based on search and filters
  const filteredAndSortedParks = useMemo(() => {
    if (!techParks) return [];
    
    let filtered = techParks.filter(park => {
      const matchesSearch = searchTerm === '' || 
        park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (park.description && park.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        park.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === 'all' || 
        park.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesLocation;
    });

    // Sort parks
    filtered.sort((a, b) => {
      // Always prioritize Manyata Tech Park at the top
      if (a.name.toLowerCase().includes('manyata')) return -1;
      if (b.name.toLowerCase().includes('manyata')) return 1;
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'outlets':
          return b.totalOutlets - a.totalOutlets;
        default:
          return 0;
      }
    });

    return filtered;
  }, [techParks, searchTerm, locationFilter, sortBy]);

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    if (!techParks) return [];
    const locations = techParks.map(park => {
      const locationParts = park.location.split(',');
      return locationParts[locationParts.length - 1].trim();
    });
    return Array.from(new Set(locations)).sort();
  }, [techParks]);

  const clearSearch = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setSortBy('name');
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="skeleton h-8 w-48 mb-2" />
          <Skeleton className="skeleton h-4 w-64 mb-6" />
          
          {/* Search bar skeleton */}
          <div className="space-y-4">
            <Skeleton className="skeleton h-12 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="skeleton h-10 w-24" />
              <Skeleton className="skeleton h-6 w-16" />
            </div>
          </div>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
           {[1, 2, 3].map((i) => (
             <Card key={i} className="tech-park-card">
               <CardContent className="p-4 sm:p-6">
                 <div className="flex items-start space-x-4 mb-4">
                   <Skeleton className="skeleton h-12 w-12 rounded-lg" />
                   <div className="flex-1">
                     <Skeleton className="skeleton h-6 w-3/4 mb-2" />
                     <Skeleton className="skeleton h-4 w-full mb-3" />
                     <Skeleton className="skeleton h-4 w-2/3" />
                   </div>
                 </div>
                 <div className="flex justify-between">
                   <Skeleton className="skeleton h-6 w-20" />
                   <Skeleton className="skeleton h-5 w-16" />
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Select Tech Park</h2>
          <p className="text-muted-foreground mt-1 flex items-center">
            <LocationOn className="mr-2 text-lg" />
            Choose your tech park to discover nearby restaurants
          </p>
        </div>
        <div className="text-center py-12">
          <Warning className="text-4xl text-destructive mb-4 mx-auto" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Tech Parks</h3>
          <p className="text-muted-foreground mb-4">Failed to load tech parks. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            <Refresh className="mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Select Tech Park</h2>
        <p className="text-muted-foreground mb-6 flex items-center">
          <LocationOn className="mr-2 h-4 w-4" />
          Choose your tech park to discover nearby restaurants
        </p>
        
        {/* Search and Filter Section */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tech parks by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-12 text-base bg-gradient-to-r from-muted/50 to-muted/30 border-2 focus:border-primary/50 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle and Controls */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all duration-200"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {(searchTerm || locationFilter !== 'all' || sortBy !== 'name') && (
                <Badge variant="secondary" className="ml-2 px-1 text-xs">
                  {[searchTerm, locationFilter !== 'all', sortBy !== 'name'].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            
            {(searchTerm || locationFilter !== 'all' || sortBy !== 'name') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span>Clear all</span>
              </Button>
            )}
          </div>
          
          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-muted/50">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <LocationOn className="h-4 w-4 mr-2" />
                  Filter by Location
                </label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="bg-background/80">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background/80">
                    <SelectValue placeholder="Sort by name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="outlets">Most Outlets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        {/* Search Results Info */}
        {techParks && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredAndSortedParks.length} of {techParks.length} tech parks
              {searchTerm && ` for "${searchTerm}"`}
            </span>
            {filteredAndSortedParks.length === 0 && searchTerm && (
              <Button
                variant="link"
                size="sm"
                onClick={clearSearch}
                className="text-primary hover:text-primary/80"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
         {filteredAndSortedParks && filteredAndSortedParks.length > 0 ? filteredAndSortedParks.map((park) => (
           <Card 
             key={park.id}
             className="tech-park-card cursor-pointer group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80 border-2 hover:border-primary/50"
             onClick={() => onSelectPark(park)}
             data-testid={`card-tech-park-${park.id}`}
           >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <Business className="text-xl sm:text-2xl text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 truncate">{park.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{park.description}</p>
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <LocationOn className="mr-1 flex-shrink-0 text-sm" />
                    <span className="truncate">{park.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                 <Badge variant="secondary" data-testid={`badge-outlets-${park.id}`} className="badge flex items-center text-xs">
                   <Store className="mr-1 text-sm" />
                   <span className="hidden sm:inline">{park.totalOutlets}+ Outlets</span>
                   <span className="sm:hidden">{park.totalOutlets}+</span>
                 </Badge>
                <div className="text-primary group-hover:text-primary/80 transition-colors duration-300">
                  <ArrowForward className="text-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        )) : filteredAndSortedParks.length === 0 && searchTerm ? (
          <div className="col-span-full text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              No tech parks match your search for "{searchTerm}"
            </p>
            <Button variant="outline" onClick={clearSearch} className="flex items-center space-x-2">
              <X className="h-4 w-4" />
              <span>Clear search</span>
            </Button>
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <Business className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Tech Parks Available</h3>
            <p className="text-muted-foreground">No tech parks found. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
