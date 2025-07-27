"use client";

import { motion } from "framer-motion";
import { Flashcard as FlashcardType } from "@/lib/types/FlashcardTypes";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  showSide: "side1" | "side2";
  onFlip: () => void;
  className?: string;
}

export function Flashcard({
  card,
  isFlipped,
  showSide,
  onFlip,
  className,
}: FlashcardProps) {
  const displayText = showSide === "side1" ? card.side1 : card.side2;

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      {/* Card Container */}
      <motion.div
        className="relative preserve-3d cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={onFlip}
      >
        {/* Front Side */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className="h-80 w-full bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl">
            <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <div className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                  {!isFlipped
                    ? displayText
                    : (showSide === "side1" ? card.side2 : card.side1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                  Click to flip
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back Side */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Card className="h-80 w-full bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl">
            <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <div className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                  {isFlipped
                    ? displayText
                    : (showSide === "side1" ? card.side2 : card.side1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                  Click to flip back
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Card Number Indicator */}
      <div className="absolute -top-4 -right-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
        {card.card_number}
      </div>
    </div>
  );
}

