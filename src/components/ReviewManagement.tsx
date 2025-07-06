
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, MessageSquare, TrendingUp, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  order_id: string;
  business_id: string;
  customer_id: string;
  rating: number;
  comment?: string;
  review_type: string;
  is_verified: boolean;
  created_at: string;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: number]: number };
}

interface ReviewManagementProps {
  businessId: string;
}

export function ReviewManagement({ businessId }: ReviewManagementProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (businessId) {
      fetchReviews();
    }
  }, [businessId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_id", businessId)
        .eq("review_type", "business")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReviews(data || []);

      // Calculate stats
      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / data.length;

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.forEach(review => {
          distribution[review.rating as keyof typeof distribution]++;
        });

        setStats({
          average_rating: averageRating,
          total_reviews: data.length,
          rating_distribution: distribution
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-4">{rating}</span>
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-right">{count}</span>
      </div>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {renderStars(Math.round(stats.average_rating))}
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.average_rating.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-blue-600">{stats.total_reviews}</p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => 
                renderRatingBar(rating, stats.rating_distribution[rating])
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                    {review.is_verified && (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    )}
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Order #{review.order_id.slice(-8)} • Customer: {review.customer_id.slice(-8)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-gray-600">Customer reviews will appear here once you start receiving orders</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
