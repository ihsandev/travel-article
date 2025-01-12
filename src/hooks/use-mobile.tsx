import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * React hook that returns whether the current screen width is less than the
 * given `MOBILE_BREAKPOINT` (768px by default).
 *
 * The returned value is `undefined` until the first render, and then it's
 * `true` or `false` depending on the screen width.
 *
 * @returns {boolean | undefined} whether the screen is mobile or not
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
