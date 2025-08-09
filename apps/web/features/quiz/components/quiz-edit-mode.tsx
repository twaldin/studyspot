"use client";

import { useState } from "react";
import { QuizWithQuestions, EditState } from "@/features/quiz/types";
import { quizService } from "../services/quiz.service";
import { useSaveQuiz } from "@/hooks/api/quizzes";
import { Button } from "@studyspot/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@studyspot/ui/components/card";
import { Input } from "@studyspot/ui/components/input";
import { Label } from "@studyspot/ui/components/label";
import { Textarea } from "@studyspot/ui/components/textarea";
import { Badge } from "@studyspot/ui/components/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@studyspot/ui/components/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@studyspot/ui/components/alert-dialog";
import { Save, AlertTriangle, Edit, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface QuizEditModeProps {
  quiz: QuizWithQuestions;
  onBack: () => void;
}

export function QuizEditMode({
  quiz,
  onBack,
}: QuizEditModeProps) {
  const router = useRouter();
  const saveQuizMutation = useSaveQuiz();
  
  const [editState, setEditState] = useState<EditState>(() =>
    quizService.initializeEditState(quiz.questions)
  );
  
  const [quizTitle, setQuizTitle] = useState(quiz.title);
  const [quizDescription, setQuizDescription] = useState(quiz.description);

  const handleQuestionEdit = (
    questionId: string, 
    field: keyof Omit<any, 'id' | 'isModified'>, 
    value: string
  ) => {
    const originalQuestion = quiz.questions.find(q => q.id === questionId);
    if (!originalQuestion) return;

    const updatedEditState = quizService.updateQuestionInEditMode(
      editState,
      questionId,
      { [field]: value },
      originalQuestion
    );
    setEditState(updatedEditState);
  };

  const handleSave = async () => {
    if (!editState.hasUnsavedChanges && 
        quizTitle === quiz.title && 
        quizDescription === quiz.description) {
      toast.error("No changes to save");
      return;
    }

    try {
      const saveRequest = quizService.convertEditStateToSaveRequest(
        editState,
        quizTitle,
        quizDescription,
        quiz.course_id
      );

      // Add edited_from field if creating a new copy
      const saveData = {
        originalQuizId: quiz.id,
        quizData: {
          ...saveRequest,
          edited_from: quiz.is_owned_by_current_user ? undefined : quiz.id
        },
      };

      const result = await saveQuizMutation.mutateAsync(saveData);

      if (quiz.is_owned_by_current_user) {
        toast.success("Quiz updated!");
        // Stay on the same page since we updated the original
        onBack();
      } else {
        toast.success("Quiz saved as your own!");
        // Navigate to the new quiz
        router.push(`/quiz/${result}`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    }
  };

  const editedQuestions = Array.from(editState.editedQuestions.values());
  const hasAnyChanges = editState.hasUnsavedChanges || 
                       quizTitle !== quiz.title || 
                       quizDescription !== quiz.description;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
            Back to Quiz
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Edit Quiz
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {quiz.is_owned_by_current_user 
                ? "Make changes to your quiz"
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

      {/* Quiz Information */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Title</Label>
              <Input
                id="quiz-title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({editedQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {editedQuestions.map((editedQuestion, index) => {
            const isModified = editedQuestion.isModified;
            
            return (
              <div
                key={editedQuestion.id}
                className={`p-6 border rounded-lg space-y-4 ${
                  isModified 
                    ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Question {index + 1}
                  </h3>
                  {isModified && (
                    <Badge variant="outline" className="text-xs">
                      Modified
                    </Badge>
                  )}
                </div>
                
                {/* Question Text */}
                <div className="space-y-2">
                  <Label htmlFor={`question-${editedQuestion.id}-text`}>
                    Question
                  </Label>
                  <Textarea
                    id={`question-${editedQuestion.id}-text`}
                    value={editedQuestion.question_text}
                    onChange={(e) => handleQuestionEdit(editedQuestion.id, 'question_text', e.target.value)}
                    placeholder="Enter the question"
                    rows={3}
                  />
                </div>

                {/* Answer Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${editedQuestion.id}-option-a`}>
                      Option A
                    </Label>
                    <Input
                      id={`question-${editedQuestion.id}-option-a`}
                      value={editedQuestion.option_a}
                      onChange={(e) => handleQuestionEdit(editedQuestion.id, 'option_a', e.target.value)}
                      placeholder="Option A"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`question-${editedQuestion.id}-option-b`}>
                      Option B
                    </Label>
                    <Input
                      id={`question-${editedQuestion.id}-option-b`}
                      value={editedQuestion.option_b}
                      onChange={(e) => handleQuestionEdit(editedQuestion.id, 'option_b', e.target.value)}
                      placeholder="Option B"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`question-${editedQuestion.id}-option-c`}>
                      Option C
                    </Label>
                    <Input
                      id={`question-${editedQuestion.id}-option-c`}
                      value={editedQuestion.option_c}
                      onChange={(e) => handleQuestionEdit(editedQuestion.id, 'option_c', e.target.value)}
                      placeholder="Option C"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`question-${editedQuestion.id}-option-d`}>
                      Option D
                    </Label>
                    <Input
                      id={`question-${editedQuestion.id}-option-d`}
                      value={editedQuestion.option_d}
                      onChange={(e) => handleQuestionEdit(editedQuestion.id, 'option_d', e.target.value)}
                      placeholder="Option D"
                    />
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="space-y-2">
                  <Label htmlFor={`question-${editedQuestion.id}-correct`}>
                    Correct Answer
                  </Label>
                  <Select 
                    value={editedQuestion.correct_answer} 
                    onValueChange={(value: 'A' | 'B' | 'C' | 'D') => 
                      handleQuestionEdit(editedQuestion.id, 'correct_answer', value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <Label htmlFor={`question-${editedQuestion.id}-explanation`}>
                    Explanation (optional)
                  </Label>
                  <Textarea
                    id={`question-${editedQuestion.id}-explanation`}
                    value={editedQuestion.explanation || ''}
                    onChange={(e) => handleQuestionEdit(editedQuestion.id, 'explanation', e.target.value)}
                    placeholder="Explain why this is the correct answer"
                    rows={2}
                  />
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
              disabled={!hasAnyChanges || saveQuizMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saveQuizMutation.isPending 
                ? "Saving..." 
                : quiz.is_owned_by_current_user 
                  ? "Save Changes" 
                  : "Save as Mine"
              }
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {quiz.is_owned_by_current_user ? "Save Changes" : "Save Quiz"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {quiz.is_owned_by_current_user 
                  ? "This will update your quiz with the changes you've made."
                  : "This will create a new quiz under your account with your changes. The original quiz will remain unchanged. You'll be redirected to your new quiz."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>
                {quiz.is_owned_by_current_user ? "Save Changes" : "Save as Mine"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}