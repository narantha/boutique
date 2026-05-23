import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, isPrivacy }) {
  useEffect(() => {
    document.title = isPrivacy
      ? 'Política de privacidad — Narantha Boutique'
      : 'Narantha Boutique — Moda femenina con propósito';
  }, [isPrivacy]);

  return (
    <>
      <Navbar isPrivacy={isPrivacy} />
      {children}
      <Footer isPrivacy={isPrivacy} />
    </>
  );
}
