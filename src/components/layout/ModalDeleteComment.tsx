import ModalPortal from './ModalPortal';

interface IProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ModalDeleteComment({ show, setShow, onConfirm, title, message }: IProps) {
  if (!show) return null;

  // Prevent scrolling when modal is open
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }

  const handleClose = () => {
    setShow(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-black/50"
          onClick={handleClose}
        />
        <div className="relative bg-gray-800 rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300 text-lg mb-8">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors text-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                handleClose();
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
} 