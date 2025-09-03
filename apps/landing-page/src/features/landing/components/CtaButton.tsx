import { Button } from "@headlessui/react";
import Link from "next/link";
import React from "react";

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const CtaButton = ({ href, children, className = "" }: CtaButtonProps) => {
  return (
    <div className={`inline-block rounded-3xl border-2 border-[var(--primary-100)] p-2 pb-3`}>
      <Link href={href}>
        <Button
          className={`btn-base active:shadow-[0_0px_0_0_var(--blue-outline),0_4px_4px_0_rgba(0,0,0,0)] active:translate-y-1 rounded-2xl border-2 border-[var(--blue-outline)] bg-[var(--blue)] px-4 py-[9px] text-base text-[var(--blue-text)] shadow-[0_4px_0_0_var(--blue-outline),0_4px_4px_0_rgba(0,0,0,0.075)] transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--blue-outline),0_6px_4px_0_rgba(0,0,0,0.075)] md:px-6 md:py-[13px] md:text-lg ${className}`}
        >
          {children}
        </Button>
      </Link>
    </div>
  );
};

export default CtaButton;