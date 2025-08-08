"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@studyspot/ui/lib/utils";
import { Button } from "@studyspot/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@studyspot/ui/components/card";
import { Input } from "@studyspot/ui/components/input";
import { useSchools } from "@/hooks/api/";
import { useUser } from "@clerk/nextjs";
import logger from "@/lib/logger";
import { useUpdateOnboarding } from "@/hooks/api/";
import type { School } from "@/features/auth/types";

export default function SelectSchoolPage() {
  const [selectedSchoolId, setSelectedSchoolId] = React.useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const router = useRouter();
  const { user } = useUser();
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  const keyboardNavigation = React.useRef(false);
  const processingSchoolId = React.useRef<string | null>(null);
  const { data: schools = [], isLoading, error: schoolsError } = useSchools();
  const updateOnboardingMutation = useUpdateOnboarding();

  const filteredSchools = React.useMemo(
    () =>
      schools.filter((school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [schools, searchTerm],
  );
  React.useEffect(() => {
    if (searchTerm === "") {
      setActiveIndex(-1);
    } else {
      setActiveIndex(0);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    if (
      activeIndex >= 0 && keyboardNavigation.current && listContainerRef.current
    ) {
      const activeElement = listContainerRef.current.children[
        activeIndex
      ] as HTMLDivElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    keyboardNavigation.current = true;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSchools.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredSchools.length) {
        const school = filteredSchools[activeIndex];
        setSelectedSchoolId(school.id === selectedSchoolId ? null : school.id);
      }
    }
  };

  const handleSelectSchool = async (school: School) => {
    if (isProcessing) return;

    // Prevent rapid successive selections of the same school
    if (processingSchoolId.current === school.id) {
      logger.warn(
        { schoolId: school.id },
        "School selection already in progress, ignoring duplicate request",
      );
      return;
    }

    setIsProcessing(true);
    processingSchoolId.current = school.id;

    try {
      // Trim the school name to remove any whitespace or newlines
      const cleanedSchoolName = school.name.trim();

      // Store the school ID we're trying to set to detect race conditions
      const targetSchoolId = school.id;

      await updateOnboardingMutation.mutateAsync({
        selectedSchool: targetSchoolId,
        selectedSchoolName: cleanedSchoolName,
        selectedSchoolDomain: school.domain,
      });

      // Only proceed with navigation if we're still processing the same school
      if (processingSchoolId.current === targetSchoolId) {
        logger.info(
          { schoolId: targetSchoolId, schoolName: cleanedSchoolName },
          "School selected and onboarding updated successfully",
        );

        // Navigate to canvas onboarding page
        router.push("/onboarding/connect-canvas");
      } else {
        logger.warn(
          {
            targetSchoolId,
            currentProcessingId: processingSchoolId.current,
          },
          "School selection changed during processing, skipping navigation",
        );
      }
    } catch (e: any) {
      logger.error(
        { error: e, schoolId: school.id },
        "Failed to process school selection",
      );

      // Show user-friendly error message
      if (e.message?.includes("School ID changed during fetch")) {
        logger.warn(
          "School selection changed during processing, user may have selected another school",
        );
      } else {
        // Re-throw other errors to show generic error handling
        throw e;
      }
    } finally {
      setIsProcessing(false);
      processingSchoolId.current = null;
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>
              Let's find your school, {user?.firstName || ""}
            </CardTitle>
            <CardDescription>
              Join your school to be able to join courses, send chats, access
              course content, and more. You can always switch schools later.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4">
              <Input
                placeholder="Find your school"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  keyboardNavigation.current = false;
                }}
                onKeyDown={handleKeyDown}
              />
              <div className="max-h-[240px] overflow-auto rounded-md border">
                {filteredSchools.length > 0
                  ? (
                    <div
                      ref={listContainerRef}
                      className="divide-y divide-border"
                    >
                      {filteredSchools.map((school, index) => (
                        <div
                          key={school.id}
                          className={cn(
                            "flex cursor-pointer items-center p-3 text-sm",
                            activeIndex === index
                              ? "bg-accent"
                              : "hover:bg-accent",
                          )}
                          onClick={() =>
                            setSelectedSchoolId(
                              school.id === selectedSchoolId ? null : school.id,
                            )}
                          onMouseEnter={() => {
                            keyboardNavigation.current = false;
                            setActiveIndex(index);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              selectedSchoolId === school.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="truncate">{school.name}</span>
                        </div>
                      ))}
                    </div>
                  )
                  : (
                    <p className="p-4 text-center text-sm text-muted-foreground">
                      No school found.
                    </p>
                  )}
              </div>
            </div>
            <div className="space-y-1 text-center text-sm">
              <p className="text-muted-foreground">
                Can't find your school?
              </p>
              <Button variant="link" size="sm" className="h-auto p-0">
                Make a Request
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="primary"
              className="w-full"
              disabled={!selectedSchoolId || isProcessing}
              onClick={() => {
                const selectedSchool = filteredSchools.find((school) =>
                  school.id === selectedSchoolId
                );
                if (selectedSchool) {
                  handleSelectSchool(selectedSchool);
                }
              }}
            >
              {isProcessing ? "Setting up your school..." : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
