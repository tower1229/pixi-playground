// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';

// Simple wrapper for a true/false toggle
export function useToggle(
  defaultValue = false,
  onToggle?: (isActive: boolean) => void
): [boolean, () => void, (value: boolean) => void] {
  const [isActive, setActive] = useState(defaultValue);

  const _toggleActive = useCallback((): void => {
    setActive((isActive) => !isActive);
  }, []);

  const _setActive = useCallback((isActive: boolean): void => {
    setActive(isActive);
  }, []);

  useEffect(() => onToggle && onToggle(isActive), [isActive, onToggle]);

  return useMemo(() => [isActive, _toggleActive, _setActive], [isActive, _toggleActive, _setActive]);
}
