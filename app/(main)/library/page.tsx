'use client'
import LibraryContent from "../../comp/content/library-content/page";
import { useClientContext } from "../../context/ClientContext";

export default function LibraryPage() {
  const { currentUser } = useClientContext();
  return <LibraryContent currentUser={currentUser} />;
}