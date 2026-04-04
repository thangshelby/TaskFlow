import Modal from "@libs/app/components/general-components/modal/modal";
import { useState } from "react";

const RenameColumnModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (newName: string) => void }) => {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!newName.trim()) {
      setError("Column name cannot be empty");
      return;
    }
    onSubmit(newName);
  };

  return (
    <Modal title={"Update column name"} onClose={onClose} buttonContent={"Update"} onSubmit={handleSubmit} isLoadingButton={false}>
      <div>
        <input
          id="title"
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setError("");
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter column name"
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </Modal>
  );
};

export default RenameColumnModal;
