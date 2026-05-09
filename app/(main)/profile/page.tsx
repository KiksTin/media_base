'use client'
import UserLog from "../../comp/content/user-dashboard-content/page";
import { useClientContext } from "../../context/ClientContext";

export default function ProfilePage() {
  const { currentUser } = useClientContext();
  return <UserLog currentUser={currentUser} />;
}
