import { api } from "@repo/utils/api";

export const setLocalStorage = async () => {
  try {
    const documents = await fetchDocuments();
    if (!documents) return;

    const documentIdAndIsCollab = documents.map((document: any) => ({
      id: document.id,
      isCollaborative: document.isCollaborative,
    }));

    localStorage.setItem("documentIds", JSON.stringify(documentIdAndIsCollab));
  } catch (error) {
    console.error("setLocalStorage error:", error);
  }
};

export const fetchDocuments = async () => {
  try {
    const res = await api.get("/documents");
    return res.data.documents;
  } catch (error) {
    console.error("fetchDocuments error:", error);
    return [];
  }
};

export const checkisCollaborative = (documentId: string): boolean => {
  const cachedDocuments = JSON.parse(
    localStorage.getItem("documentIds") || "[]"
  );
  const findId = cachedDocuments.find((doc: any) => doc.id === documentId);
  return findId ? findId.isCollaborative : false;
};

export const checkDocumentAccess = async (documentId: string) => {
  const cachedDocuments = JSON.parse(
    localStorage.getItem("documentIds") || "[]"
  );

  const findId = cachedDocuments.find((doc: any) => doc.id === documentId);
  if (findId) {
    return { status: true, isCollab: findId.isCollaborative };
  }

  try {
    const res = await api.post("/room/access", { documentId });
    if (res.data.success) {
      const document = res.data.document;

      const updated = [
        ...cachedDocuments,
        { id: document.id, isCollaborative: document.isCollaborative },
      ];

      localStorage.setItem("documentIds", JSON.stringify(updated));
      console.log("Document access granted");

      return { status: true, isCollab: document.isCollaborative };
    }
    return { status: false, isCollab: false };
  } catch (error) {
    console.error("checkDocumentAccess error:", error);
    return { status: false, isCollab: false };
  }
};

/**
 * Force update localStorage after collab toggle
 */
export const updateDocumentCollab = (
  documentId: string,
  isCollaborative = true
) => {
  const cachedDocuments = JSON.parse(
    localStorage.getItem("documentIds") || "[]"
  );

  const idx = cachedDocuments.findIndex((doc: any) => doc.id === documentId);
  if (idx !== -1) {
    cachedDocuments[idx].isCollaborative = isCollaborative;
  } else {
    cachedDocuments.push({ id: documentId, isCollaborative });
  }

  localStorage.setItem("documentIds", JSON.stringify(cachedDocuments));
};
