import React from 'react';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden@1.1.1';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import { OptionSelectList } from '@/shared/ui';
import type { SelectOption, BaseSelectProps } from '@/shared/model';

interface OptionSelectDrawerProps<T extends string> extends BaseSelectProps<T> {
  options: readonly SelectOption[];
  title: string;
}

export function OptionSelectDrawer<T extends string>({ 
  open, 
  onOpenChange, 
  options, 
  selected, 
  onSelect,
  title
}: OptionSelectDrawerProps<T>) {
  const handleSelect = (value: T) => {
    onSelect(value);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHiddenPrimitive.Root>
          <DrawerTitle>{title}</DrawerTitle>
        </VisuallyHiddenPrimitive.Root>
        <OptionSelectList
          options={options}
          selected={selected}
          onSelect={handleSelect}
        />
      </DrawerContent>
    </Drawer>
  );
}