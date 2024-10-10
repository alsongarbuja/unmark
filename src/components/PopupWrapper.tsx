import { MouseEventHandler, ReactNode } from "react";
import { ReferenceType, UseFloatingReturn } from "@floating-ui/react-dom";

interface IPopupWrapperProps extends React.PropsWithChildren {
  buttonIcon: ReactNode;
  buttonLabel: string;
  buttonClick: MouseEventHandler<HTMLButtonElement>;
  refs: UseFloatingReturn<ReferenceType>["refs"];
  floatingStyles: React.CSSProperties;
  isOpen: boolean;
  closePop: MouseEventHandler<HTMLDivElement>;
}

export default function PopupWrapper({
  children,
  buttonIcon,
  buttonLabel,
  buttonClick,
  refs,
  isOpen,
  floatingStyles,
  closePop,
}: IPopupWrapperProps) {
  return (
    <>
      <button ref={refs.setReference} title={buttonLabel} onClick={buttonClick}>
        {buttonIcon}
      </button>
      {isOpen && (
        <>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              padding: "0px",
              width: "max-content",
            }}
            className="z-20 flex flex-col p-2 mr-2 rounded-md shadow-md bg-slate-900 min-w-32 max-w-[70vw]"
          >
            {children}
          </div>
          <div
            className="fixed top-0 bottom-0 left-0 right-0 bg-black/50"
            onClick={closePop}
          />
        </>
      )}
    </>
  );
}
