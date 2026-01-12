import React from 'react';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden@1.1.1';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from '../../../components/ui/drawer';
import type { BaseDrawerProps } from '../../model';

interface BaseDrawerWrapperProps extends BaseDrawerProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}

export function BaseDrawer({ 
  open, 
  onOpenChange, 
  children, 
  footer,
  title = "Drawer"
}: BaseDrawerWrapperProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHiddenPrimitive.Root>
          <DrawerTitle>{title}</DrawerTitle>
        </VisuallyHiddenPrimitive.Root>
        {children}
        
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}