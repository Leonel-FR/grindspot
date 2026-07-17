export default function EmailModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Get started now
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Join GrindSpot and find your next favorite work spot.
        </p>

        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="text-mc text-md w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ffa49f] focus:ring-2 focus:ring-[#ffa49f] focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-[#FF5A5F] px-6 py-3 font-bold text-white"
          >
            Join GrindSpot now
          </button>
        </form>
      </div>
    </div>
  );
}
