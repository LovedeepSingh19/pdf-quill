import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type maxWidthWrapperProps = {
  className?: string;
  children: ReactNode;
};

const maxWidthWrapper: React.FC<maxWidthWrapperProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}>
      {children}
    </div>
  );
};
export default maxWidthWrapper;
