import { useCallback, useEffect, useState } from 'react';

export type MobileSearchKeyboardLiftOptions = {
  /** 0–1, default 1. Reduce when the panel already has a large base `bottom` (e.g. advanced Step 4 strip). */
  liftScale?: number;
  /** Optional extra cap on the returned inset after scaling. */
  maxLiftPx?: number;
};

/** Initial lift from layout size before / as keyboard opens. */
export function getMobileSearchKeyboardSnapshotLiftPx(): number {
  if (typeof window === 'undefined') return 0;
  const ih = window.innerHeight;
  const vvh = window.visualViewport?.height;
  const baseline = Math.max(ih, typeof vvh === 'number' ? vvh : 0);
  return Math.min(340, Math.max(160, Math.round(baseline * 0.36)));
}

/**
 * Extra bottom offset (px) for fixed mobile panels when the search input is focused,
 * so content stays above the soft keyboard. Matches basic colour visualiser behaviour.
 */
export function useMobileSearchKeyboardLift(
  panelIsActive: boolean,
  options?: MobileSearchKeyboardLiftOptions
): {
  bottomInsetPx: number;
  onMobileSearchFocus: () => void;
  onMobileSearchBlur: () => void;
} {
  const [isFocused, setIsFocused] = useState(false);
  const [liftPx, setLiftPx] = useState(0);

  const onMobileSearchFocus = useCallback(() => {
    setIsFocused(true);
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
    const lift = getMobileSearchKeyboardSnapshotLiftPx();
    setLiftPx(lift);
    requestAnimationFrame(() => {
      const lift2 = getMobileSearchKeyboardSnapshotLiftPx();
      setLiftPx((prev) => Math.max(prev, lift2));
    });
  }, []);

  const onMobileSearchBlur = useCallback(() => {
    setIsFocused(false);
    setLiftPx(0);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
    if (!isFocused || !panelIsActive) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const refine = () => {
      const ih = window.innerHeight;
      const obscured = Math.max(0, Math.round(ih - vv.offsetTop - vv.height));
      setLiftPx((prev) => {
        if (obscured < 48) return prev;
        return Math.min(350, Math.max(prev, obscured + 16));
      });
    };
    refine();
    vv.addEventListener('resize', refine);
    vv.addEventListener('scroll', refine);
    return () => {
      vv.removeEventListener('resize', refine);
      vv.removeEventListener('scroll', refine);
    };
  }, [isFocused, panelIsActive]);

  const scale = options?.liftScale ?? 1;
  const maxLift = options?.maxLiftPx;
  let inset = panelIsActive && isFocused ? Math.round(liftPx * scale) : 0;
  if (maxLift != null && maxLift >= 0) {
    inset = Math.min(inset, maxLift);
  }
  const bottomInsetPx = inset;

  return { bottomInsetPx, onMobileSearchFocus, onMobileSearchBlur };
}
