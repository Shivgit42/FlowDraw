"use client";
import { useCanvasStore, useLoadingStore } from "@repo/store";
import Navbar from "../../../components/Navbar";
import Card from "../../../components/Card";
import { Plus, LogIn } from "lucide-react";
import Document from "../../../components/Document";
import { useEffect, useState } from "react";
import PopupModel from "../../../components/PopupModel";
import { api } from "@repo/utils/api";
import { useRouter } from "next/navigation";
import { timeAgo } from "../../../utils/timeAgo";
import Loading from "../../../components/Loading";

interface MemberType {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

interface DocumentType {
  id: string;
  ownerId: string;
  slug: string;
  owner: {
    id: string;
    name: string;
  };
  members: MemberType[];
  createdAt: string;
}

export default function Dashboard() {
  const { setError, loading, setLoading } = useLoadingStore();
  const router = useRouter();
  const { createDocument, setDocumentID, deleteDocument, renameDocument } =
    useCanvasStore();

  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"create" | "join" | "none">("create");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [documents, setDocuments] = useState<DocumentType[]>();

  useEffect(() => {
    document.body.style.overflowX = "hidden";

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/documents");
        if (!res.data.success) {
          setError("Internal server error");
        } else {
          setDocuments(res.data.documents);
        }
      } catch (err) {
        console.error(err);
        setError("Internal server error");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [setError, setLoading]);

  const openPopup = (mode: "create" | "join") => {
    setIsOpen(true);
    setType(mode);
    setTitle(mode === "create" ? "Create New Drawing" : "Join Shared Drawing");
    setSubTitle(
      mode === "create"
        ? "Enter a title for your new drawing."
        : "Enter the room ID to join a shared drawing session."
    );
    setInputText("");
  };

  const handleOnConfirm = async () => {
    if (type === "create") {
      if (!inputText.trim()) return setError("Document name cannot be empty");
      if (inputText.length > 20)
        return setError("Document name cannot exceed 20 characters");

      const id = await createDocument(inputText.trim());
      if (id) {
        setDocumentID(id);
        router.push(`/document/${id}`);
      } else {
        setError("Document creation failed");
      }
    } else if (type === "join") {
      if (inputText.length !== 25) return setError("Invalid document ID");
      router.push(`/document/${inputText}`);
    }
  };

  const handleDocumentClick = (id: string) => router.push(`/document/${id}`);

  const handleRenameDocument = async (id: string, newName: string) => {
    if (!newName.trim()) return setError("Document name cannot be empty");
    if (newName.length > 20)
      return setError("Document name cannot exceed 20 characters");

    try {
      await renameDocument(id, newName);
      setDocuments((prev) =>
        prev?.map((doc) => (doc.id === id ? { ...doc, slug: newName } : doc))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev?.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a14] via-[#111827] to-[#1e1b4b] text-white">
      <Navbar />

      {/* Page header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Your <span className="text-purple-400">Documents</span>
            </h1>
            <p className="text-gray-400 mt-1">
              Create, join, and manage your collaborative drawings.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Card
              CardIcon={Plus}
              title="Start a New Drawing"
              onClick={() => openPopup("create")}
            />
            <Card
              CardIcon={LogIn}
              title="Join Shared Drawing"
              onClick={() => openPopup("join")}
            />
          </div>
        </div>
      </header>

      {/* Documents panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-10 pb-24">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-visible">
          {/* Column headings */}
          <div className="hidden md:grid grid-cols-[1fr_160px_160px_160px_48px] gap-4 text-xs uppercase tracking-wider text-white/60 px-4 sm:px-6 py-4 border-b border-white/10">
            <div className="pl-4">Name</div>
            <div className="text-center">Created</div>
            <div className="text-center">Author</div>
            <div className="text-center">Members</div>
            <div />
          </div>

          {/* List */}
          <div className="divide-y divide-white/5">
            {loading && (
              <div className="p-8">
                <Loading />
              </div>
            )}

            {!loading && documents?.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                No documents found
              </div>
            )}

            {!loading &&
              documents?.map((doc) => (
                <Document
                  key={doc.id}
                  documentId={doc.id}
                  name={doc.slug}
                  created={timeAgo(doc.createdAt)}
                  author={doc.owner.name}
                  members={doc.members}
                  onClick={() => handleDocumentClick(doc.id)}
                  onRename={handleRenameDocument}
                  onDelete={handleDeleteDocument}
                />
              ))}
          </div>
        </div>
      </main>

      <PopupModel
        isOpen={isOpen}
        title={title}
        subTitle={subTitle}
        setInputText={setInputText}
        inputText={inputText}
        mode={type}
        onClose={() => setIsOpen(false)}
        onConfirm={handleOnConfirm}
      />
    </div>
  );
}
