import React from 'react';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Workroom',
  description: 'Sign in to your Workroom account to access your workspaces, projects, tasks, and teams.',
};

export default function Page() {
  return <LoginPage />;
}
