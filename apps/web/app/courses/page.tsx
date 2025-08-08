// Force dynamic rendering for authentication and data fetching
export const dynamic = 'force-dynamic';

import { CoursesPageContent } from "./courses-client"
import { Suspense } from "react"

function CoursesLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
      <div className="h-[36px] w-[200px] bg-gray-200 animate-pulse rounded-md" />
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
          <div className="h-10 w-36 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[200px] bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesLoading />}>
      <CoursesPageContent />
    </Suspense>
  )
} 