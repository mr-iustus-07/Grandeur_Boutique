// src/components/ui/Icon.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react'; // Example: using lucide-react

export type IconType = LucideIcon | React.ComponentType<any>;

interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: IconType;
  size?: number | string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 18, className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        width={size}
        height={size}
        className={className}
        {...props}
      />
    );
  }
);
Icon.displayName = 'Icon';