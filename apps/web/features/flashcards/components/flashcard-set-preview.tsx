"use client";

import { FlashcardSet } from "@/lib/types/FlashcardTypes";
import { flashcardService } from "../services/flashcard.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Edit, FileText, Play, User } from "lucide-react";
import Image from "next/image";

interface FlashcardSetPreviewProps {
  flashcardSet: FlashcardSet;
  onStudy: () => void;
  onEdit: () => void;
}

export function FlashcardSetPreview({
  flashcardSet,
  onStudy,
  onEdit,
}: FlashcardSetPreviewProps) {
  const timeAgo = flashcardService.formatTimeAgo(flashcardSet.created_at);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {flashcardSet.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {flashcardSet.description}
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {flashcardSet.card_count || 0} cards
          </Badge>
        </div>

        {/* Course and Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Course Info */}
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {flashcardSet.course_code} - {flashcardSet.course_name}
              </span>
            </div>

            {/* Creation Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Created {timeAgo}
              </span>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Created by
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {flashcardSet.creator_profile_image && (
              <Image
                src={flashcardSet.creator_profile_image}
                alt={flashcardSet.creator_name || "Creator"}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {flashcardSet.creator_name}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Study Options</CardTitle>
          <CardDescription>
            Choose how you want to interact with this flashcard set
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onStudy}
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              Study Cards
            </Button>
            <Button
              onClick={onEdit}
              variant="outline"
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit & Save as Mine
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              <strong>Study:</strong>{" "}
              Practice with these flashcards using different modes and settings
            </p>
            <p className="mt-1">
              <strong>Edit:</strong>{" "}
              Modify the cards and save your own version for collaborative
              learning
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Set Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Set Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {flashcardSet.card_count || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Cards
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {flashcardSet.course_code}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Course
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {timeAgo}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Created
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                Public
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Visibility
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

