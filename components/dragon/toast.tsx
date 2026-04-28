"use client";

import { useApp } from "./app-context";
import { Icon } from "./primitives";

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast">
      <Icon name="check" size={14} /> {toast}
    </div>
  );
}
