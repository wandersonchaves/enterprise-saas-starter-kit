'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Database } from 'lucide-react';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      const response = await apiRequest<any[]>('/datalake'); // Rota do datalake que busca documentos
      setDocs(response);
    } catch (error) {
      console.error('Failed to fetch docs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/datalake', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setContent('');
      fetchDocs();
    } catch (error) {
      alert('Failed to create document');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="w-8 h-8 text-primary" />
          Organization Documents
        </h1>
      </div>

      <div className="p-6 border rounded-xl bg-card shadow-sm">
        <h2 className="text-xl font-semibold mb-4">New Entry</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input 
            className="flex-1 px-3 py-2 border rounded-md" 
            placeholder="Type document content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p>Loading documents...</p>
        ) : docs.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
            No documents found for this organization.
          </div>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="p-4 border rounded-lg bg-white flex items-center gap-4 shadow-sm">
              <FileText className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">{doc.content}</p>
                <p className="text-xs text-muted-foreground">ID: {doc.id}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
