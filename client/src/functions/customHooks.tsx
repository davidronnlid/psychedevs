import { useEffect } from "react";

export const useOnClickOutside = (
  // see profileDropdown.tsx for example on how to use

  ref: React.RefObject<HTMLElement>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
};
