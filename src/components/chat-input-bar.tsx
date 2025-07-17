"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  message: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

interface ChatInputBarProps {
  onSubmit: (values: FormSchema) => void;
  className?: string;
  isSubmitting?: boolean;
}

export const ChatInputBar = React.forwardRef<HTMLTextAreaElement, ChatInputBarProps>(
  ({ onSubmit, className, isSubmitting }, ref) => {
    const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        message: "",
      },
    });

    const { formState, register, handleSubmit, reset } = form;

    const handleFormSubmit = (values: FormSchema) => {
      onSubmit(values);
      reset();
    };

    return (
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className={cn("relative", className)}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => {
              const { ref: fieldRef, ...fieldProps } = field;
              return (
                <FormItem>
                  <FormControl>
                    <Textarea
                      ref={(element) => {
                        fieldRef(element);
                        if (ref) {
                          if (typeof ref === 'function') {
                            ref(element);
                          } else {
                            ref.current = element;
                          }
                        }
                      }}
                      placeholder="Can you help me with..."
                      className="min-h-20 resize-none max-h-24 pr-12 rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                      {...fieldProps}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(handleFormSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <Button
            type="submit"
            variant="default"
            size="sm"
            className="absolute bottom-2 right-2"
            disabled={isSubmitting || !formState.isValid}
          >
            <MoveRight className="size-6" />
            <span className="sr-only">Submit</span>
          </Button>
        </form>
      </Form>
    );
  }
);

ChatInputBar.displayName = "ChatInputBar"; 