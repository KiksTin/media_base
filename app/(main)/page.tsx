'use client'
import HomeContent from "../comp/content/home-content/page";
import { useClientContext } from "../context/ClientContext";

export default function HomePage() {
  const { currentUser } = useClientContext();
  return <HomeContent currentUser={currentUser} />;
}
