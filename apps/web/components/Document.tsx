"use client";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Member = {
  user: {
    name: string;
    image: string;
  };
};

interface DocumentProps {
  documentId: string;
  name: string;
  created: string;
  author: string;
  members: Member[];
  onClick: () => void;
  onRename: (documentId: string, newName: string) => void;
  onDelete: (documentId: string) => void;
}

export default function Document({
  documentId,
  name,
  created,
  author,
  members,
  onClick,
  onRename,
  onDelete,
}: DocumentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  const visibleMembers = members.slice(0, 3);
  const remainingCount = members.length - visibleMembers.length;

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== name) {
      onRename(documentId, newName.trim());
    }
    setIsRenaming(false);
    setNewName(name);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete(documentId);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsRenaming(true);
  };

  return (
    <div
      className="group w-full cursor-pointer transition hover:bg-white/5 rounded-xl"
      onClick={onClick}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      {/* Desktop row */}
      <div className="hidden md:grid grid-cols-[1fr_160px_160px_160px_48px] items-center gap-4 px-4 sm:px-6 py-4">
        {/* Name */}
        <div className="truncate font-medium">
          {isRenaming ? (
            <form
              onSubmit={handleRenameSubmit}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRenameSubmit}
                autoFocus
                maxLength={20}
                className="w-full bg-[#0f1623] border border-white/15 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/60"
              />
            </form>
          ) : (
            <span className="truncate">{name}</span>
          )}
        </div>

        {/* Created */}
        <div className="text-center text-white/70">{created}</div>

        {/* Author */}
        <div className="text-center text-white/90">{author}</div>

        {/* Members */}
        <div className="flex justify-center items-center">
          {members.length > 0 ? (
            <div className="flex -space-x-2 items-center">
              {visibleMembers.map((m, i) => (
                <Image
                  key={i}
                  src={m.user.image}
                  alt={m.user.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0f18]"
                />
              ))}
              {remainingCount > 0 && (
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#0a0f18] text-xs flex items-center justify-center">
                  +{remainingCount}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">Private</div>
          )}
        </div>

        <div className="relative flex justify-end">
          <button
            className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <EllipsisVertical size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#111827] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
              <button
                onClick={handleRename}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/5"
              >
                <Pencil size={16} className="mr-2" /> Rename
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5"
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile card */}
      <div className="md:hidden px-4 sm:px-6 py-4">
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start relative">
            <div className="min-w-0 flex-1">
              {isRenaming ? (
                <form
                  onSubmit={handleRenameSubmit}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    autoFocus
                    maxLength={20}
                    className="w-full bg-[#0f1623] border border-white/15 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/60"
                  />
                </form>
              ) : (
                <h3 className="font-semibold truncate">{name}</h3>
              )}
              <p className="mt-1 text-xs text-white/60 truncate">
                Created {created} • by {author}
              </p>
            </div>

            <button
              className="p-2 rounded-lg hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <EllipsisVertical size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-4 top-full mt-2 w-44 bg-[#111827] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <button
                  onClick={handleRename}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/5"
                >
                  <Pencil size={16} className="mr-2" /> Rename
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {members.length > 0 ? (
              <>
                {visibleMembers.map((m, i) => (
                  <Image
                    key={i}
                    src={m.user.image}
                    alt={m.user.name}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full border-2 border-[#0a0f18]"
                  />
                ))}
                {remainingCount > 0 && (
                  <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-[#0a0f18] text-[10px] flex items-center justify-center">
                    +{remainingCount}
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-gray-400 italic">Private</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
