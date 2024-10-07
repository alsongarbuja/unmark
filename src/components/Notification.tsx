import { useState } from "react";
import { Timer1 } from "iconsax-react";
import { autoPlacement, useFloating } from "@floating-ui/react-dom";

interface INotificationProps {
  bookmark: IBookmark;
  addReminder: (
    id: string,
    title: string,
    url: string,
    remindIn: number
  ) => void;
}

const notifications = [
  { id: 1, title: "1 min", time: 1 },
  { id: 2, title: "5 min", time: 5 },
  { id: 3, title: "10 min", time: 10 },
  { id: 4, title: "30 min", time: 30 },
  { id: 5, title: "1 hrs", time: 60 },
];

export default function Notification({
  bookmark,
  addReminder,
}: INotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: "bottom",
    middleware: [
      autoPlacement({
        allowedPlacements: ["left"],
      }),
    ],
  });

  return (
    <>
      <button
        ref={refs.setReference}
        className="text-blue-300"
        title="Add reminder"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Timer1 variant="Bulk" size={20} />
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
            className="z-20 flex flex-col p-2 mr-2 rounded-md shadow-md bg-slate-900 min-w-32"
          >
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => {
                  setIsOpen(false);
                  addReminder(
                    bookmark.id,
                    bookmark.title,
                    bookmark.url!,
                    notification.time
                  );
                }}
                className="px-4 py-2 text-white hover:bg-slate-400/40"
              >
                {notification.title}
              </button>
            ))}
          </div>
          <div
            className="fixed top-0 bottom-0 left-0 right-0 bg-black/10"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </>
  );
}
