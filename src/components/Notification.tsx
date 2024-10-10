import { Timer1, TimerPause } from "iconsax-react";

import PopupWrapper from "./PopupWrapper";
import { useFloatingPop } from "../hooks/useFloatingPop";

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
  const { refs, floatingStyles, isOpen, setIsOpen } = useFloatingPop();

  return (
    <PopupWrapper
      refs={refs}
      floatingStyles={floatingStyles}
      buttonLabel={hasReminder ? "Cancel Reminder" : "Add reminder"}
      buttonIcon={
        hasReminder ? (
          <TimerPause variant="Bulk" size={20} className="text-red-300" />
        ) : (
          <Timer1 variant="Bulk" size={20} />
        )
      }
      buttonClick={() => setIsOpen(!isOpen)}
      closePop={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      isOpen={isOpen}
    >
      <>
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
      </>
    </PopupWrapper>
  );
}
