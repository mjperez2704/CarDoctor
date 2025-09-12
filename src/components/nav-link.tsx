"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const navLinkVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-primary",
        dark: "text-blue-100 hover:bg-blue-700 hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface NavLinkProps extends React.ComponentProps<typeof Link>, VariantProps<typeof navLinkVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className, variant, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        navLinkVariants({ variant }),
        isActive && (variant === 'dark' ? "bg-blue-700/50 text-white" : "bg-muted text-primary"),
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
