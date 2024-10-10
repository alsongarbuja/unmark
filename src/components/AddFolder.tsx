import { Add, CloseCircle, Folder2 } from "iconsax-react";
import { useRef, useState } from "react";
import { addBookMark } from "../features/Bookmark";
import { toast } from "sonner";

interface IAddFolderProps {
  currentId: string;
  addFolderInState: (folder: Bookmark, parentId: string) => void;
}

export default function AddFolder({
  currentId,
  addFolderInState,
}: IAddFolderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);

  const openFolderAdd = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const addFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = inputRef.current?.value;
    if (!title) return;

    const folder = await addBookMark(title, currentId, true);
    addFolderInState(folder, currentId);
    setIsAdding(false);

    toast.success("Folder added");
  };

  return (
    <>
      <button
        onClick={openFolderAdd}
        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-400/40"
      >
        <span className="p-1 rounded-md bg-slate-900">
          <Add size={20} />
        </span>
        <p>Add folder</p>
      </button>
      {isAdding && (
        <div className="inline-flex items-center w-full gap-2 px-4 py-2 text-white">
          <Folder2 variant="Bulk" size={20} />
          <form onSubmit={addFolder} className="flex-1 w-full">
            <input
              ref={inputRef}
              required
              type="text"
              className="w-full p-1 bg-transparent border rounded-md border-slate-400"
            />
          </form>
          <button
            onClick={() => setIsAdding(false)}
            title="Cancel folder creation"
          >
            <CloseCircle />
          </button>
        </div>
      )}
    </>
  );
}
