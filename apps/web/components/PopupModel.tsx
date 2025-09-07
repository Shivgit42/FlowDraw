"use client";
import { useLoadingStore } from "@repo/store";
import { Loader } from "lucide-react";
import { useEffect } from "react";

interface popupModel {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  setInputText: (value: string) => void;
  inputText: string;
  mode?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Popup({
  isOpen,
  title,
  subTitle,
  setInputText,
  inputText,
  mode,
  onClose,
  onConfirm,
}: popupModel) {
  const { loading } = useLoadingStore();

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const label =
    mode === "create"
      ? "Enter Document name:"
      : mode === "collaborate"
        ? "Enter Document name:"
        : mode === "join"
          ? "Enter Room ID:"
          : "Input:";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center px-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F141F] to-[#111827] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-30 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-pink-500/30 blur-2xl" />

        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          {subTitle && (
            <p className="text-sm text-[#9CA3AF] mt-1">{subTitle}</p>
          )}

          <div className="mt-6">
            <label className="block text-sm text-white mb-2">{label}</label>
            <input
              type="text"
              placeholder="Type here..."
              className="w-full bg-[#0f1623] text-white placeholder-white/40 p-3 rounded-lg border border-white/10 outline-none focus:ring-2 focus:ring-purple-500/60"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 text-white">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition inline-flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
