'use client'
import { useClientContext } from "../../context/ClientContext";
import PlaylistContent from "../../comp/content/playlist-content/page";

export default function PlaylistPage() {
  const { currentUser } = useClientContext();
  return <PlaylistContent currentUser={currentUser}/>;
}