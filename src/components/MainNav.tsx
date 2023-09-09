"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound, useParams, usePathname } from "next/navigation";

type StoreParams = {
  storeId: string;
};

export const MainNav: React.FC<React.HtmlHTMLAttributes<HTMLElement>> = ({
  className,
  ...props
}) => {
  const pathname = usePathname();
  const params = useParams();
  const storeId = params.storeId as string;

  if (!storeId) {
    return notFound();
  }

  const routes = [
    {
      href: `/${storeId}/settings`,
      label: "Settings",
      active: pathname === `/${storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};