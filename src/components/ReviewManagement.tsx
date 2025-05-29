
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Clock, User } from "lucide-react";

interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
  replied: boolean;
  reply?: string;
}

const demoReviews: Review[] = [
  {
    id: "REV-001",
    customer: "Alice Johnson",
    rating: 5,
    comment: "Amazing pizza! The delivery was fast and the food was still hot. Will definitely order again.",
    date: "2024-01-15",
    orderId: "ORD-4001",
    replied: false,
  },
  {
    id: "REV-002",
    customer: "Carlos Rivera",
    rating: 4,
    comment: "Good food, but the delivery took a bit longer than expected. The curry was delicious though!",
    date: "2024-01-14",
    orderId: "ORD-4002",
    replied: true,
    reply: "Thank you for your feedback! We're working on improving our delivery times. Glad you enjoyed the curry!",
  },
  {
    id: "REV-003",
    customer: "Sophie Martin",
    rating: 5,
    comment: "Fresh sushi and excellent presentation. The miso soup was perfect. Highly recommend!",
    date: "2024-01-13",
    orderId: "ORD-4003",
    replied: false,
  },
  {
    id: "REV-004",
    customer: "Mike Brown",
    rating: 3,
    comment: "Food was okay, but the portion size was smaller than expected for the price.",
    date: "2024-01-12",
    orderId: "ORD-4004",
    replied: false,
  },
];

export function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});

  const handleReply = (reviewId: string) => {
    const replyText = replyTexts[reviewId];
    if (!replyText?.trim()) return;

    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, replied: true, reply: replyText }
        : review
    ));

    setReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const pendingReplies = reviews.filter(review => !review.replied).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-600">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <span className="text-2xl font-bold text-orange-600">{reviews.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Replies</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <span className="text-2xl font-bold text-red-600">{pendingReplies}</span>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <section className="bg-orange-50 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Customer Reviews</h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id} className="border-l-4 border-l-orange-400">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{review.customer}</span>
                        <Badge variant="outline" className="text-xs">
                          Order: {review.orderId}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.rating}/5 stars
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge 
                      className={review.replied ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {review.replied ? "Replied" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>

                  {review.replied && review.reply && (
                    <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-l-orange-400">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-600">Your Reply:</span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.reply}</p>
                    </div>
                  )}

                  {!review.replied && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Reply to this review:
                        </label>
                        <Textarea
                          placeholder="Write a thoughtful reply to this customer..."
                          value={replyTexts[review.id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({
                            ...prev,
                            [review.id]: e.target.value
                          }))}
                          className="min-h-[80px]"
                        />
                      </div>
                      <Button
                        onClick={() => handleReply(review.id)}
                        disabled={!replyTexts[review.id]?.trim()}
                        className="bg-gradient-to-r from-orange-400 to-red-400 text-white"
                      >
                        Send Reply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
