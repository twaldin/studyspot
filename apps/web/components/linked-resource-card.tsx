import React, { useState } from "react";
import Link from "next/link";
import {
  DocumentResource,
  FlashcardSetResource,
  QuizResource,
  LinkedResource,
} from "@/features/chat/chat.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@studyspot/ui/components/alert-dialog";
import { Button } from "@studyspot/ui/components/button";
import { Card, CardContent } from "@studyspot/ui/components/card";
import { DocumentCard } from "@/components/document-card";
import { Trash2 } from "lucide-react";
import { useDeveloperMode } from "@/contexts/developer-mode-context";
import { useDeleteDocument } from "@/hooks/api/documents";
import { useDeleteFlashcardSet, useDeleteQuiz } from "@/hooks/api/content";
import { useAuthenticatedUser } from "@/hooks/api/base";
import toast from "react-hot-toast";

interface LinkedResourceCardProps {
  resource: LinkedResource;
  useShareUrls?: boolean; // When true, use share URLs instead of regular URLs
}

export const LinkedResourceCard: React.FC<LinkedResourceCardProps> = (
  { resource, useShareUrls = false },
) => {
  const { isDeveloperModeEnabled } = useDeveloperMode();
  const { userId } = useAuthenticatedUser();
  const deleteDocumentMutation = useDeleteDocument();
  const deleteFlashcardSetMutation = useDeleteFlashcardSet();
  const deleteQuizMutation = useDeleteQuiz();

  // Generate the appropriate URL for a resource based on context
  const getResourceUrl = (resource: LinkedResource): string => {
    if (!useShareUrls) {
      // Normal URLs
      if (resource.type === 'flashcard_set') return `/flashcards/${resource.id}`;
      if (resource.type === 'quiz') return `/quiz/${resource.id}`;
    } else {
      // Share URLs
      const resourceWithToken = resource as any;
      if (resource.type === 'flashcard_set' && resourceWithToken.share_token) {
        return `/flashcards/${resource.id}/share/${resourceWithToken.share_token}`;
      }
      if (resource.type === 'quiz' && resourceWithToken.share_token) {
        return `/quiz/${resource.id}/share/${resourceWithToken.share_token}`;
      }
      
      // Fallback to normal URL if share_token is missing
      if (resource.type === 'flashcard_set') return `/flashcards/${resource.id}`;
      if (resource.type === 'quiz') return `/quiz/${resource.id}`;
    }
    
    // Default fallback
    return '#';
  };

  const handleDeleteDocument = (documentId: string, fileName: string) => {
    deleteDocumentMutation.mutate(documentId, {
      onSuccess: () => {
        toast.success(`Successfully deleted ${fileName}`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete document");
      },
    });
  };

  const handleDeleteFlashcardSet = (flashcardSetId: string, title: string) => {
    deleteFlashcardSetMutation.mutate(flashcardSetId, {
      onSuccess: () => {
        toast.success(`Successfully deleted flashcard set "${title}"`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete flashcard set");
      },
    });
  };

  const handleDeleteQuiz = (quizId: string, title: string) => {
    deleteQuizMutation.mutate(quizId, {
      onSuccess: () => {
        toast.success(`Successfully deleted quiz "${title}"`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete quiz");
      },
    });
  };

  // Check if user owns this content (for delete permissions)
  const isUserOwned = (resource: LinkedResource) => {
    if (resource.type === 'document') {
      return false; // Documents don't have ownership implemented yet
    }
    return resource.created_by === userId;
  };

  // Delete button component for owned content
  const DeleteButton = ({ resource }: { resource: LinkedResource }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      setIsDialogOpen(true);
    };

    const handleDelete = () => {
      if (resource.type === 'flashcard_set') {
        handleDeleteFlashcardSet(resource.id, resource.title);
      } else if (resource.type === 'quiz') {
        handleDeleteQuiz(resource.id, resource.title);
      }
      setIsDialogOpen(false);
    };

    const getDeleteMessage = () => {
      const type = resource.type === 'flashcard_set' ? 'flashcard set' : 'quiz';
      return `This will permanently delete the ${type} "${resource.title}" and all its content. This action cannot be undone.`;
    };

    if (!isUserOwned(resource)) return null;

    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-50 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
          onClick={handleButtonClick}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {resource.type === 'flashcard_set' ? 'Flashcard Set' : 'Quiz'}?</AlertDialogTitle>
              <AlertDialogDescription>
                {getDeleteMessage()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteFlashcardSetMutation.isPending || deleteQuizMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {(deleteFlashcardSetMutation.isPending || deleteQuizMutation.isPending)
                  ? "Deleting..."
                  : `Delete ${resource.type === 'flashcard_set' ? 'Flashcard Set' : 'Quiz'}`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  // Handle document resources using existing DocumentCard
  if (resource.type === "document") {
    const documentResource = resource as DocumentResource;

    // Convert to Document type expected by DocumentCard
    const documentData = {
      id: documentResource.id,
      file_name: documentResource.title,
      file_type: documentResource.file_type,
      file_url: documentResource.file_url,
      course_id: "", // Not needed for display
      created_at: "", // Not needed for display
      report_count: 0, // Not needed for display
    };

    // Determine file type for display
    let displayFileType = "Unknown";
    if (documentResource.file_type) {
      if (documentResource.file_type === "application/pdf") {
        displayFileType = "pdf";
      } else if (documentResource.file_type.startsWith("image/")) {
        displayFileType = "Image";
      } else if (documentResource.file_type.includes("text")) {
        displayFileType = "Text";
      } else if (documentResource.file_type.includes("word")) {
        displayFileType = "Word";
      }
    }

    // Since DocumentCard already handles the delete button, we can just use it directly
    return (
      <DocumentCard
        url={documentResource.file_url}
        file={documentData}
        fileType={displayFileType}
      />
    );
  }

  // Handle flashcard set resources
  if (resource.type === "flashcard_set") {
    const flashcardResource = resource as FlashcardSetResource;

    return (
      <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer py-3 relative group">
        <DeleteButton resource={flashcardResource} />
        <Link href={getResourceUrl(flashcardResource)} className="block">
          <CardContent className="px-4 py-0">
            <div className="flex items-start gap-3">
              {/* Flashcard icon */}
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {flashcardResource.title}
                </h3>

                {flashcardResource.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {flashcardResource.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {flashcardResource.cardCount} cards
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Study now →
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Handle quiz resources
  if (resource.type === "quiz") {
    const quizResource = resource as QuizResource;

    return (
      <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer py-3 relative group">
        <DeleteButton resource={quizResource} />
        <Link href={getResourceUrl(quizResource)} className="block">
          <CardContent className="px-4 py-0">
            <div className="flex items-start gap-3">
              {/* Quiz icon */}
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {quizResource.title}
                </h3>

                {quizResource.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {quizResource.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {quizResource.questionCount} questions
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Take quiz →
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Should never reach here with proper typing
  return null;
};

