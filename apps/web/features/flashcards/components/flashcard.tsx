"use client";

import { motion } from "framer-motion";
import { Flashcard as FlashcardType } from "@/lib/types/FlashcardTypes";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FlashcardContent } from "./flashcard-content";

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  showSide: "side1" | "side2";
  onFlip: () => void;
  className?: string;
  isFullscreen?: boolean;
}

export function Flashcard({
  card,
  isFlipped,
  showSide,
  onFlip,
  className,
  isFullscreen = false,
}: FlashcardProps) {
  const displayText = showSide === "side1" ? card.side1 : card.side2;

  return (
    <div
      className={cn(
        "relative w-full mx-auto",
        isFullscreen ? "w-[90vw]" : "w-full max-w-4xl",
        className,
      )}
      style={{ perspective: "5000px" }}
    >
      {/* Card Container */}
      <motion.div
        className="relative preserve-3d cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          height: isFullscreen ? "60vh" : "auto", // Match the card height
          aspectRatio: isFullscreen ? "auto" : "3/2",
        }}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        onClick={onFlip}
      >
        {/* Front Side */}
        <motion.div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transformOrigin: "center center",
          }}
        >
          <Card
            className={cn(
              "w-full bg-card shadow-lg hover:shadow-xl transition-shadow rounded-xl",
              isFullscreen ? "h-[60vh]" : "aspect-[3/2] h-auto",
            )}
          >
            <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="space-y-4 w-full">
                <FlashcardContent
                  content={!isFlipped
                    ? displayText
                    : (showSide === "side1" ? card.side2 : card.side1)}
                  className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-gray-100 text-center"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                  Click to flip
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back Side */}
        <motion.div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
            transformOrigin: "center center",
          }}
        >
          <Card
            className={cn(
              "w-full bg-card shadow-lg hover:shadow-xl transition-shadow rounded-xl",
              isFullscreen ? "h-[60vh]" : "aspect-[3/2] h-auto",
            )}
          >
            <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="space-y-4 w-full">
                <FlashcardContent
                  content={isFlipped
                    ? displayText
                    : (showSide === "side1" ? card.side2 : card.side1)}
                  className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-gray-100 text-center"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                  Click to flip back
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Card Number Indicator */}
      <div className="absolute -top-4 -right-4 bg-card dark:bg-background text-gray-900 dark:text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
        {card.card_number}
      </div>
    </div>
  );
}
