"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Zap, ArrowRight, Upload, MessagesSquare } from "lucide-react";
import { useState } from "react";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import Link from "next/link";
import { NewPostDialog } from "@/components/new-post-dialog";
import { ChatInputBar } from "@/components/chat-input-bar";
import { useRouter } from "next/navigation";

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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (values: { message: string }) => {
    router.push(`/chat?message=${encodeURIComponent(values.message)}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col justify-center p-6 gap-4 @container">
      <h2 className="text-3xl font-crimson-text leading-none">
        What are we learning today?
      </h2>
      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="flex gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              className="whitespace-nowrap rounded-full"
            >
              <Zap className="w-4 h-4" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
      <ChatInputBar onSubmit={handleFormSubmit} />
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
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="w-4 h-4" />
            Upload Files
          </Button>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
          <Button variant="ghost" onClick={() => setIsNewPostDialogOpen(true)}>
            <MessagesSquare className="w-4 h-4" />
            New Post
          </Button>
        </div>
        <Link href="/content">
          <Button variant="secondary">
            All Course Content
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <FileUploadDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} />
      <NewPostDialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen} />
    </div>
  );
}
