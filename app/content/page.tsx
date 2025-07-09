"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowDownNarrowWide, Funnel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

// More card content to ensure scrolling
const cardData = [
  {
    title: "Card 1",
    description: "Card 1 description",
    badge: { text: "Trending", variant: "default" as const },
  },
  {
    title: "Card 2",
    description: "Card 2 description",
    badge: { text: "Recently added", variant: "secondary" as const },
  },
  {
    title: "Card 3",
    description: "Card 3 description",
  },
  {
    title: "Card 4",
    description: "Card 4 description",
    badge: { text: "Recently created", variant: "outline" as const },
  },
  {
    title: "Card 5",
    description: "Card 5 description",
  },
  {
    title: "Card 6",
    description: "Card 6 description",
  },
  {
    title: "Card 7",
    description: "Card 7 description",
    badge: { text: "Trending", variant: "default" as const },
  },
  {
    title: "Card 8",
    description: "Card 8 description",
  },
  {
    title: "Card 9",
    description: "Card 9 description",
    badge: { text: "Recently added", variant: "secondary" as const },
  },
  {
    title: "Card 10",
    description: "Card 10 description",
  },
  {
    title: "Card 11",
    description: "Card 11 description",
  },
  {
    title: "Card 12",
    description: "Card 12 description",
    badge: { text: "Recently created", variant: "outline" as const },
  },
  {
    title: "Card 13",
    description: "Card 13 description",
    badge: { text: "Trending", variant: "default" as const },
  },
  {
    title: "Card 14",
    description: "Card 14 description",
    badge: { text: "Recently added", variant: "secondary" as const },
  },
  {
    title: "Card 15",
    description: "Card 15 description",
  },
  {
    title: "Card 16",
    description: "Card 16 description",
    badge: { text: "Recently created", variant: "outline" as const },
  },
  {
    title: "Card 17",
    description: "Card 17 description",
  },
  {
    title: "Card 18",
    description: "Card 18 description",
  },
  {
    title: "Card 19",
    description: "Card 19 description",
    badge: { text: "Trending", variant: "default" as const },
  },
  {
    title: "Card 20",
    description: "Card 20 description",
  },
  {
    title: "Card 21",
    description: "Card 21 description",
    badge: { text: "Recently added", variant: "secondary" as const },
  },
  {
    title: "Card 22",
    description: "Card 22 description",
  },
  {
    title: "Card 23",
    description: "Card 23 description",
  },
  {
    title: "Card 24",
    description: "Card 24 description",
    badge: { text: "Recently created", variant: "outline" as const },
  },
];

export default function ContentPage() {
  const [showDocuments, setShowDocuments] = React.useState(true);
  const [showQuizzes, setShowQuizzes] = React.useState(true);
  const [showFlashcards, setShowFlashcards] = React.useState(true);

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all course content..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="font-normal">
              <Funnel className="w-4 h-4" />
              Content Type
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuCheckboxItem
              checked={showDocuments}
              onCheckedChange={setShowDocuments}
            >
              Documents
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showQuizzes}
              onCheckedChange={setShowQuizzes}
            >
              Practice Quizzes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showFlashcards}
              onCheckedChange={setShowFlashcards}
            >
              Flashcards
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Select defaultValue="popularity">
          <SelectTrigger className="[&>svg:last-child]:hidden">
            <ArrowDownNarrowWide className="w-4 h-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="recently-added">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map((card, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              {card.badge && (
                <CardContent>
                  <Badge variant={card.badge.variant}>{card.badge.text}</Badge>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 