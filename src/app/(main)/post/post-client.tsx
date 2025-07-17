'use client'

import { ArrowLeft, Heart, MessageSquare, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function PostClient() {
  return (
    <div className="mx-auto w-full max-w-4xl h-full flex flex-col p-6 gap-4">
      {/* Back Button */}
      <div>
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>
      </div>

      {/* Main Post Card */}
      <Card className="px-6">
        <CardHeader className="px-0">
          {/* Post Title */}
          <h1 className="text-2xl font-bold font-crimson-text">
            Help with Chapter 5 - Thermodynamics Concepts
          </h1>
          
          {/* Post Meta */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Posted by Sarah Johnson</span>
            <span>•</span>
            <span>2 hours ago</span>
            <span>•</span>
            <Badge variant="secondary">Question</Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 px-0">
          {/* Post Body */}
          <div className="flex flex-col gap-4">
            <p className="text-base leading-relaxed">
              I'm having trouble understanding the difference between enthalpy and entropy in thermodynamics. 
              The textbook explanations are confusing me, and I can't seem to grasp how they relate to each other. 
              Can someone explain this in simpler terms? 
            </p>
            <p className="text-base leading-relaxed">
              Also, if anyone has good examples or analogies that helped them understand these concepts, 
              that would be super helpful! I have an exam next week and this is one of the topics I'm struggling with most.
            </p>
          </div>

          <Separator />

          {/* Interaction Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Helpful (12)
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask StudySpot
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>

          {/* Reply Input */}
          <div className="flex flex-col gap-3">
            <Textarea 
              placeholder="Share your thoughts, answer the question, or provide additional resources..."
              className="min-h-[70px] resize-none"
            />
            <div className="flex justify-end">
              <Button variant="primary">Post Reply</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Replies (3)</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {/* Placeholder for replies - will be implemented later */}
            <p>Replies will be displayed here...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 