import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col justify-center p-6">
      <h1 className="text-4xl mb-4 font-crimson-text">
        Good afternoon, Reed
      </h1>
      <div className="relative">
        <Textarea
          placeholder="Can you help me practice..."
          className="resize-none max-h-24"
          rows={3}
        />
      </div>
    </div>
  );
}
