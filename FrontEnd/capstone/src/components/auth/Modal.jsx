export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#0F0B0B] p-6 rounded-lg w-96 shadow-lg relative">
          
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-3 right-3 text-[#53C844] text-2xl">
            &times;
          </button>
  
          {children}
        </div>
      </div>
    );
  }
  