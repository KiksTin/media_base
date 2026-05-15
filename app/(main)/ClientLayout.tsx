'use client'
import { useEffect, useState } from 'react';
import Header from "../comp/navigator/header/header";
import Nav from "../comp/navigator/navbar/nav";
import Player from "../comp/player/player";
import { useClientContext } from "../context/ClientContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { setCurrentUser, setIsLogedIn } = useClientContext();
  const [currentUser, setCurrentUserState] = useState<any>(null);

  useEffect(() => {
    
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserState(user);
        setCurrentUser(user);
        setIsLogedIn(true);
      } catch (error) {
        sessionStorage.removeItem('currentUser');
      }
    }
  }, [setCurrentUser, setIsLogedIn]);

  return (
    <div className="whole">
      <Header currentUser={currentUser} />
      <div className="main_layout">
        <Nav />
        <div className="content">
          <main>
            {children}
          </main>
          <Player />
        </div>
      </div>
    </div>
  );
}
