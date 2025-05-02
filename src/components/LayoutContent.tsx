'use client';

import React from 'react';
import { useUser } from '../context/UserContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <>
      {user ? <Sidebar /> : <Navbar />}
      {children}
    </>
  );
}
