"use client";

import { useState } from "react";
import { FlashcardSetWithCards, EditState } from "@/features/flashcards/types";
import {
  initializeEditState,
  updateCardInEditMode,
  convertEditStateToSaveRequest,
} from "../services/flashcard.service";
import { useSaveFlashcardSet } from "@/hooks/api/flashcards";
import { Button } from "@studyspot/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@studyspot/ui/components/card";
import { Input } from "@studyspot/ui/components/input";
import { Label } from "@studyspot/ui/components/label";
import { Textarea } from "@studyspot/ui/components/textarea";
import { Badge } from "@studyspot/ui/components/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@studyspot/ui/components/alert-dialog";
import { Save, AlertTriangle, Edit, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FlashcardEditModeProps {
  flashcardSet: FlashcardSetWithCards;
  onBack: () => void;
}

export function FlashcardEditMode({
  flashcardSet,
  onBack,
}: FlashcardEditModeProps) {
  const router = useRouter();
  const saveFlashcardSetMutation = useSaveFlashcardSet();
  
  const [editState, setEditState] = useState<EditState>(() =>
    initializeEditState(flashcardSet.cards)
  );
  
  const [setTitle, setSetTitle] = useState(flashcardSet.title);
  const [setDescription, setSetDescription] = useState(flashcardSet.description);

  const handleCardEdit = (cardId: string, field: 'side1' | 'side2', value: string) => {
    const originalCard = flashcardSet.cards.find(c => c.card_id === cardId);
    if (!originalCard) return;

    const updatedEditState = updateCardInEditMode(
      editState,
      cardId,
      { [field]: value },
      originalCard
    );
    setEditState(updatedEditState);
  };

  const handleSave = async () => {
    if (!editState.hasUnsavedChanges && setTitle === flashcardSet.title && setDescription === flashcardSet.description) {
      toast.error("No changes to save");
      return;
    }

    try {
      const saveRequest = convertEditStateToSaveRequest(
        editState,
        setTitle,
        setDescription,
        flashcardSet.course_id
      );

      // Add edited_from field if creating a new copy
      const saveData = {
        originalSetId: flashcardSet.id,
        flashcardSetData: {
          ...saveRequest,
          edited_from: flashcardSet.is_owned_by_current_user ? undefined : flashcardSet.id
        },
      };

      const result = await saveFlashcardSetMutation.mutateAsync(saveData);

      if (flashcardSet.is_owned_by_current_user) {
        toast.success("Flashcard set updated!");
        // Stay on the same page since we updated the original
        onBack();
      } else {
        toast.success("Flashcard set saved as your own!");
        // Navigate to the new set
        router.push(`/flashcards/${result}`);
      }
    } catch (error) {
      console.error("Error saving flashcard set:", error);
      toast.error("Failed to save flashcard set");
    }
  };

  const editedCards = Array.from(editState.editedCards.values());
  const hasAnyChanges = editState.hasUnsavedChanges || 
                       setTitle !== flashcardSet.title || 
                       setDescription !== flashcardSet.description;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Study
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Edit Flashcard Set
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {flashcardSet.is_owned_by_current_user 
                ? "Make changes to your flashcard set"
                : "Make changes and save as your own version"
              }
            </p>
          </div>
        </div>
        
        {hasAnyChanges && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Unsaved Changes
          </Badge>
        )}
      </div>

      {/* Set Information */}
      <Card>
        <CardHeader>
          <CardTitle>Set Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="set-title">Title</Label>
            <Input
              id="set-title"
              value={setTitle}
              onChange={(e) => setSetTitle(e.target.value)}
              placeholder="Enter flashcard set title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="set-description">Description</Label>
            <Textarea
              id="set-description"
              value={setDescription}
              onChange={(e) => setSetDescription(e.target.value)}
              placeholder="Enter flashcard set description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Cards ({editedCards.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editedCards.map((editedCard, index) => {
            const isModified = editedCard.isModified;
            
            return (
              <div
                key={editedCard.card_id}
                className={`p-4 border rounded-lg space-y-4 ${
                  isModified 
                    ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Card {index + 1}
                  </h3>
                  {isModified && (
                    <Badge variant="outline" className="text-xs">
                      Modified
                    </Badge>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`card-${editedCard.card_id}-side1`}>
                      Front Side
                    </Label>
                    <Textarea
                      id={`card-${editedCard.card_id}-side1`}
                      value={editedCard.side1}
                      onChange={(e) => handleCardEdit(editedCard.card_id, 'side1', e.target.value)}
                      placeholder="Front side text"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`card-${editedCard.card_id}-side2`}>
                      Back Side
                    </Label>
                    <Textarea
                      id={`card-${editedCard.card_id}-side2`}
                      value={editedCard.side2}
                      onChange={(e) => handleCardEdit(editedCard.card_id, 'side2', e.target.value)}
                      placeholder="Back side text"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
        >
          Cancel
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={!hasAnyChanges || saveFlashcardSetMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saveFlashcardSetMutation.isPending 
                ? "Saving..." 
                : flashcardSet.is_owned_by_current_user 
                  ? "Save Changes" 
                  : "Save as Mine"
              }
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {flashcardSet.is_owned_by_current_user ? "Save Changes" : "Save Flashcard Set"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {flashcardSet.is_owned_by_current_user 
                  ? "This will update your flashcard set with the changes you've made."
                  : "This will create a new flashcard set under your account with your changes. The original set will remain unchanged. You'll be redirected to your new set."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>
                {flashcardSet.is_owned_by_current_user ? "Save Changes" : "Save as Mine"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}