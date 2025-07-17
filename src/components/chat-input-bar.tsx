"use client";

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
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInputBar({ onSubmit, className, isSubmitting, placeholder = "Can you help me with...", disabled = false }: ChatInputBarProps) {
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  className="min-h-20 resize-none max-h-24 pr-12 rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                  disabled={disabled}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
                      e.preventDefault();
                      handleSubmit(handleFormSubmit)();
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="default"
          size="sm"
          className="absolute bottom-2 right-2"
          disabled={disabled || isSubmitting || !formState.isValid}
        >
          <MoveRight className="size-6" />
          <span className="sr-only">Submit</span>
        </Button>
      </form>
    </Form>
  );
} 