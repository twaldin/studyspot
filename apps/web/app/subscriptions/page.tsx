"use client";

import { SubscriptionDetailsButton } from "@clerk/nextjs/experimental";
import { PricingTable } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "@studyspot/ui/components/button";

export default function SubscriptionsPage() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600 mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription & Billing</h1>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Available Plans</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select a subscription plan to get started or upgrade your current plan.
          </p>
        </div>
        <PricingTable 
          collapseFeatures={false}
          ctaPosition="bottom"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="secondary" className="cursor-pointer gap-2" asChild>
          <SubscriptionDetailsButton>
            Manage Current Subscription
          </SubscriptionDetailsButton>
        </Button>
      </div>
    </div>
  );
}