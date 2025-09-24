import { autoPlacement, useFloating } from "@floating-ui/react-dom";
import { useState } from "react";

export const useFloatingPop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    middleware: [
      autoPlacement({
        allowedPlacements: ["left"],
      }),
    ],
  });

  return {
    refs,
    floatingStyles,
    isOpen,
    setIsOpen,
  };
};
