import { useState } from "react";

interface TagProps {
  tag: string;
  onEdit: (newValue: string) => void;
  onDelete: () => void;
}

const Tag: React.FC<TagProps> = ({ tag, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(tag);

  const handleBlur = () => {
    setIsEditing(false);
    onEdit(value);
  };

  return (
    <div className="flex items-center border px-2 py-1 rounded bg-blue-200">
      {isEditing ? (
        <input
          className="bg-transparent border-none w-16 focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span onClick={() => setIsEditing(true)} className="cursor-pointer">
          {tag}
        </span>
      )}
      <button onClick={onDelete} className="ml-2 text-red-500">
        X
      </button>
    </div>
  );
};

export default Tag;
