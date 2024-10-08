import { useState } from "react";
import { Timer1, TimerPause } from "iconsax-react";
import { autoPlacement, useFloating } from "@floating-ui/react-dom";

interface INotificationProps {
  bookmark: Bookmark;
  hasReminder: boolean;
  addReminder: (
    id: string,
    title: string,
    url: string,
    remindIn: number
  ) => void;
  removeReminder: (id: string, bookmarkId: string) => void;
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
  hasReminder,
  removeReminder,
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
        title={hasReminder ? "Cancel Reminder" : "Add reminder"}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasReminder ? (
          <TimerPause variant="Bulk" size={20} className="text-red-300" />
        ) : (
          <Timer1 variant="Bulk" size={20} />
        )}
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
            {hasReminder ? (
              <div className="px-4 pt-4 pb-1">
                <p className="text-lg">Cancel reminder</p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    className="px-4 py-2 text-blue-500"
                    onClick={() => setIsOpen(false)}
                  >
                    No
                  </button>
                  <button
                    className="px-4 py-2 text-red-400"
                    onClick={() => {
                      setIsOpen(false);
                      removeReminder(
                        `${bookmark.url}*_*${bookmark.title}`,
                        bookmark.id
                      );
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
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
