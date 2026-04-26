'use client';

import { useState, useEffect } from 'react';
import { organizationService, Organization } from '@/services/organization';
import { Button } from '@/components/ui/button';
import { Shield, Building2, UserPlus, Info } from 'lucide-react';
import { Can } from '@/components/auth/can';

export default function OrganizationPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const orgId = localStorage.getItem('organization-id');
    if (orgId) {
      setLoading(true);
      organizationService.getById(orgId)
        .then(setOrg)
        .catch(err => setMessage(err.message || 'Failed to load organization'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrg = await organizationService.create(name, slug);
      setOrg(newOrg);
      localStorage.setItem('organization-id', newOrg.id);
      setMessage('Organization created successfully!');
    } catch (err: any) {
      setMessage(err.message || 'Failed to create organization');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    setMessage('');
    try {
      await organizationService.inviteMember(org.id, inviteEmail, 'MEMBER');
      setMessage(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (err: any) {
      setMessage(err.message || 'Failed to send invite');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading organization details...</div>;

  if (!org) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-xl bg-card shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Create Organization</h1>
        </div>
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name</label>
            <input 
              className="w-full px-3 py-2 border rounded-md" 
              value={name} onChange={e => setName(e.target.value)} 
              placeholder="Ex: Acme Inc" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL Slug</label>
            <input 
              className="w-full px-3 py-2 border rounded-md" 
              value={slug} onChange={e => setSlug(e.target.value)} 
              placeholder="acme-inc" required
            />
          </div>
          <Button type="submit" className="w-full">Create</Button>
        </form>
        {message && <p className="mt-4 text-sm text-center text-primary font-medium">{message}</p>}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
          <Shield className="w-4 h-4" />
          Active Tenant
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Details Section */}
        <section className="p-6 border rounded-xl bg-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" /> General Info
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Name</p>
              <p className="text-lg">{org.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">ID</p>
              <code className="text-sm bg-muted px-1 rounded">{org.id}</code>
            </div>
          </div>
        </section>

        {/* RBAC Protected Invite Section */}
        <Can I={['OWNER', 'ADMIN']}>
          <section className="p-6 border rounded-xl bg-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Invite Member
            </h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <input 
                className="w-full px-3 py-2 border rounded-md text-sm" 
                type="email" placeholder="colleague@company.com" 
                value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                autoComplete="off"
                required
              />
              <Button type="submit" variant="outline" className="w-full">Send Invite</Button>
            </form>
          </section>
        </Can>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3 text-blue-800">
        <Info className="w-5 h-5 shrink-0" />
        <p className="text-sm">
          <strong>Pro-tip:</strong> When switching organizations, your <code>organization-id</code> header 
          will change, and the Prisma Data Isolation layer will ensure you only see data for the active organization.
        </p>
      </div>
      
      {message && <p className="text-center text-sm font-bold text-primary">{message}</p>}
    </div>
  );
}
