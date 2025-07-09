import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Zap, ArrowRight, ChevronRight } from "lucide-react";

const suggestions = [
  "How do we use moles to solve stoichiometry problems?",
  "Will the thermochemistry exam cover energy units?",
];

// Card content
const cardData = [
  {
    title: "Card 1",
    description: "Card 1 description",
    badge: { text: "Trending", variant: "default" as const }
  },
  {
    title: "Card 2",
    description: "Card 2 description",
    badge: { text: "Recently added", variant: "secondary" as const }
  },
  {
    title: "Card 3",
    description: "Card 3 description",
  },
  {
    title: "Card 4",
    description: "Card 4 description",
    badge: { text: "Recently created", variant: "outline" as const }
  },
  {
    title: "Card 5",
    description: "Card 5 description",
  },
  {
    title: "Card 6",
    description: "Card 6 description",
  }
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col justify-center p-6 gap-4">
      <h2 className="text-3xl font-crimson-text leading-none">
        What needs practice?
      </h2>
      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="flex gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              className="whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
      <Textarea
        placeholder="Can you help me with..."
        className="resize-none max-h-24"
        rows={3}
      />
      <div className="@container">
        <div className="hidden gap-4 @md:grid @md:grid-cols-2 @lg:grid-cols-3">
          {cardData.map((card, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              {card.badge && (
                <CardContent>
                  <Badge variant={card.badge.variant}>
                    {card.badge.text}
                  </Badge>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="ghost">
          See More
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
