'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { apiRequest } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  organizationId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { orgId, isLoaded: isAuthLoaded } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembership() {
      if (isUserLoaded && isAuthLoaded && clerkUser && orgId) {
        try {
          // No mundo real, buscaríamos a role do usuário nesta org via API
          // Para este boilerplate, vamos assumir que a API retorna os detalhes do membro
          const members = await apiRequest<any[]>(`/organizations/${orgId}/members`);
          const currentMember = members.find(m => m.userId === clerkUser.id || m.user.email === clerkUser.primaryEmailAddress?.emailAddress);
          
          if (currentMember) {
            setUser({
              id: clerkUser.id,
              name: clerkUser.fullName || 'User',
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              role: currentMember.role,
            });
          }
        } catch (error) {
          console.error('Failed to fetch membership', error);
        } finally {
          setIsLoading(false);
        }
      } else if (isUserLoaded && !clerkUser) {
        setUser(null);
        setIsLoading(false);
      }
    }

    fetchMembership();
  }, [clerkUser, isUserLoaded, orgId, isAuthLoaded]);

  return (
    <AuthContext.Provider value={{ user, isLoading, organizationId: orgId || null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
