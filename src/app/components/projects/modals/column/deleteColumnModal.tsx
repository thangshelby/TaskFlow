import Modal from "@libs/app/components/general-components/modal/modal";
import "@libs/app/components/projects/modals/modal.css";

const DeleteColumnModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) => {
  return (
    <Modal
      title="Delete Column"
      onClose={onClose}
      buttonContent="Delete"
      onSubmit={onSubmit}
      isLoadingButton={false}
      className="rounded-xl border border-white/40 shadow-2xl glass-panel"
    >
      <div className="text-center">
        <p className="text-gray-600">Are you sure you want to delete this column? This action cannot be undone.</p>
        <p className="text-gray-600 mt-2">All issues in this column will need to be moved to another column first.</p>
      </div>
    </Modal>
  );
};

export default DeleteColumnModal;
