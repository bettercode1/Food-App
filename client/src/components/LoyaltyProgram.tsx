import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@/types';

interface LoyaltyProgramProps {
  onRedeemReward?: (reward: Reward) => void;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  type: 'discount' | 'free_item' | 'upgrade' | 'cashback';
  value: number;
  restaurantId?: string;
  validUntil?: string;
  isActive: boolean;
}

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints?: number;
  benefits: string[];
  color: string;
  icon: string;
}

interface UserLoyalty {
  userId: string;
  totalPoints: number;
  currentTier: string;
  pointsToNextTier: number;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  lastOrderDate?: string;
}

export default function LoyaltyProgram({ onRedeemReward }: LoyaltyProgramProps) {
  const { user } = useAuth() as { user: User };
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user's loyalty data
  const { data: userLoyalty, isLoading: loyaltyLoading } = useQuery<UserLoyalty>({
    queryKey: ['/api/loyalty/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/loyalty/user/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty data');
      }
      return response.json();
    },
  });

  // Fetch available rewards
  const { data: rewards, isLoading: rewardsLoading } = useQuery<Reward[]>({
    queryKey: ['/api/loyalty/rewards'],
    queryFn: async () => {
      const response = await fetch('/api/loyalty/rewards');
      if (!response.ok) {
        throw new Error('Failed to fetch rewards');
      }
      return response.json();
    },
  });

  // Fetch loyalty tiers
  const { data: loyaltyTiers } = useQuery<LoyaltyTier[]>({
    queryKey: ['/api/loyalty/tiers'],
    queryFn: async () => {
      const response = await fetch('/api/loyalty/tiers');
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty tiers');
      }
      return response.json();
    },
  });

  // Redeem reward mutation
  const redeemRewardMutation = useMutation({
    mutationFn: async (reward: Reward) => {
      const response = await apiRequest('POST', '/api/loyalty/redeem', {
        rewardId: reward.id,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Reward Redeemed!',
        description: `You've successfully redeemed ${data.rewardName}. Your coupon code is ${data.couponCode}`,
      });
      if (onRedeemReward) {
        onRedeemReward(data.reward);
      }
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Redemption Failed',
        description: error.message || 'Failed to redeem reward. Please try again.',
      });
    },
  });

  // Mock loyalty tiers data
  const mockTiers: LoyaltyTier[] = [
    {
      id: 'bronze',
      name: 'Bronze Member',
      minPoints: 0,
      maxPoints: 499,
      benefits: ['5% discount on orders', 'Birthday surprise', 'Priority customer support'],
      color: 'text-amber-600',
      icon: 'fa-medal',
    },
    {
      id: 'silver',
      name: 'Silver Member',
      minPoints: 500,
      maxPoints: 1499,
      benefits: ['10% discount on orders', 'Free delivery', 'Early access to new restaurants', 'Birthday surprise'],
      color: 'text-gray-500',
      icon: 'fa-medal',
    },
    {
      id: 'gold',
      name: 'Gold Member',
      minPoints: 1500,
      maxPoints: 4999,
      benefits: ['15% discount on orders', 'Free delivery', 'Free appetizer with orders over ₹300', 'Priority booking', 'Exclusive events'],
      color: 'text-yellow-500',
      icon: 'fa-medal',
    },
    {
      id: 'platinum',
      name: 'Platinum VIP',
      minPoints: 5000,
      benefits: ['20% discount on orders', 'Free delivery', 'Free dessert with every order', 'Useral manager', 'Exclusive menu items', 'VIP events'],
      color: 'text-purple-500',
      icon: 'fa-crown',
    },
  ];

  // Mock rewards data
  const mockRewards: Reward[] = [
    {
      id: '1',
      name: '₹50 Off Next Order',
      description: 'Get ₹50 off on your next order of ₹200 or more',
      pointsRequired: 200,
      type: 'discount',
      value: 50,
      isActive: true,
    },
    {
      id: '2',
      name: 'Free Delivery',
      description: 'Free delivery on your next order',
      pointsRequired: 150,
      type: 'discount',
      value: 25,
      isActive: true,
    },
    {
      id: '3',
      name: 'Free Cold Coffee',
      description: 'Get a free cold coffee with any order',
      pointsRequired: 100,
      type: 'free_item',
      value: 70,
      restaurantId: '4', // Quick Bites Cafe
      isActive: true,
    },
    {
      id: '4',
      name: '₹100 Cashback',
      description: 'Get ₹100 credited to your wallet',
      pointsRequired: 500,
      type: 'cashback',
      value: 100,
      isActive: true,
    },
    {
      id: '5',
      name: 'Premium Thali Upgrade',
      description: 'Upgrade to premium thali at Canteen Delight',
      pointsRequired: 300,
      type: 'upgrade',
      value: 50,
      restaurantId: '1',
      isActive: true,
    },
  ];

  const currentTier = mockTiers.find(tier => 
    userLoyalty && 
    userLoyalty.totalPoints >= tier.minPoints && 
    (!tier.maxPoints || userLoyalty.totalPoints <= tier.maxPoints)
  ) || mockTiers[0];

  const nextTier = mockTiers.find(tier => tier.minPoints > (userLoyalty?.totalPoints || 0));
  const progressToNextTier = nextTier ? 
    ((userLoyalty?.totalPoints || 0) / nextTier.minPoints) * 100 : 100;

  if (loyaltyLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Loyalty Program</h2>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return 'fa-percentage';
      case 'free_item':
        return 'fa-gift';
      case 'upgrade':
        return 'fa-arrow-up';
      case 'cashback':
        return 'fa-money-bill-wave';
      default:
        return 'fa-star';
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'discount':
        return 'text-green-500';
      case 'free_item':
        return 'text-blue-500';
      case 'upgrade':
        return 'text-purple-500';
      case 'cashback':
        return 'text-yellow-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Loyalty Program</h2>
          <p className="text-muted-foreground mt-1">
            <i className="fas fa-star mr-1"></i>
            Earn points with every order and unlock amazing rewards
          </p>
        </div>
        <Button variant="outline" size="sm">
          <i className="fas fa-question-circle mr-2"></i>
          Help
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className={`fas ${currentTier.icon} mr-2 ${currentTier.color}`}></i>
                Your Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {userLoyalty?.totalPoints || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {userLoyalty?.totalOrders || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Orders Placed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    ₹{userLoyalty?.totalSpent || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Current Tier</span>
                  <Badge variant="secondary" className={currentTier.color}>
                    <i className={`fas ${currentTier.icon} mr-1`}></i>
                    {currentTier.name}
                  </Badge>
                </div>
                {nextTier && (
                  <>
                    <Progress value={progressToNextTier} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {nextTier.minPoints - (userLoyalty?.totalPoints || 0)} points to {nextTier.name}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Tier Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Your Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-coins text-yellow-500"></i>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Earned This Month</p>
                    <p className="text-lg font-semibold">{(userLoyalty?.totalOrders || 0) * 10}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-calendar text-blue-500"></i>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-semibold">
                      {userLoyalty?.joinDate ? new Date(userLoyalty.joinDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-trophy text-purple-500"></i>
                  <div>
                    <p className="text-sm text-muted-foreground">Savings This Month</p>
                    <p className="text-lg font-semibold">₹{Math.round((userLoyalty?.totalSpent || 0) * 0.1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRewards.map((reward) => (
              <Card key={reward.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <i className={`fas ${getRewardIcon(reward.type)} ${getRewardColor(reward.type)}`}></i>
                      <div>
                        <h4 className="font-medium text-foreground">{reward.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {reward.pointsRequired} points required
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {reward.type.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-coins text-yellow-500"></i>
                      <span className="text-sm font-medium">{reward.pointsRequired}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => redeemRewardMutation.mutate(reward)}
                      disabled={redeemRewardMutation.isPending || (userLoyalty?.totalPoints || 0) < reward.pointsRequired}
                    >
                      {redeemRewardMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-1"></i>
                          Redeeming...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-gift mr-1"></i>
                          Redeem
                        </>
                      )}
                    </Button>
                  </div>

                  {(userLoyalty?.totalPoints || 0) < reward.pointsRequired && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Need {reward.pointsRequired - (userLoyalty?.totalPoints || 0)} more points
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="mt-6">
          <div className="space-y-4">
            {mockTiers.map((tier, index) => (
              <Card key={tier.id} className={`${tier.id === currentTier.id ? 'border-primary bg-primary/5' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${tier.id === currentTier.id ? 'bg-primary/10' : 'bg-muted'}`}>
                        <i className={`fas ${tier.icon} text-xl ${tier.color}`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tier.minPoints} - {tier.maxPoints || '∞'} points
                        </p>
                      </div>
                    </div>
                    {tier.id === currentTier.id && (
                      <Badge variant="default">Current Tier</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <i className={`fas fa-check-circle ${tier.id === currentTier.id ? 'text-green-500' : 'text-muted-foreground'}`}></i>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock loyalty history */}
                {[
                  { date: '2024-01-15', action: 'Order completed', points: '+50', type: 'earned' },
                  { date: '2024-01-14', action: 'Reward redeemed: ₹50 Off', points: '-200', type: 'redeemed' },
                  { date: '2024-01-10', action: 'Order completed', points: '+30', type: 'earned' },
                  { date: '2024-01-08', action: 'Referral bonus', points: '+100', type: 'bonus' },
                  { date: '2024-01-05', action: 'Order completed', points: '+40', type: 'earned' },
                ].map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={entry.type === 'earned' ? 'default' : entry.type === 'bonus' ? 'secondary' : 'destructive'}>
                      {entry.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
