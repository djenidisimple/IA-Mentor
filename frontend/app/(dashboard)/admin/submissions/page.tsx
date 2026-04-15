"use client";

import React, { useEffect, useState } from "react";
import { submissionsApi } from "@/lib/submissions";
import AdminGuard from "@/components/providers/AdminGuard";

export default function AdminSubmissionsPage(): React.ReactElement {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const perPage = 10;
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await submissionsApi.listAll();
        setSubmissions(data || []);
      } catch (err: any) {
        console.error('Failed to load submissions', err);
        setError(err?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleReview = async (id: number) => {
    setActionLoading(id);
    setError(null);
    try {
      const res = await submissionsApi.review(id);
      setSubmissions((s) => s.map((it) => (it.id === id ? res : it)));
    } catch (err: any) {
      console.error('Review failed', err);
      setError(err?.message || 'Échec de la revue');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = submissions.filter((s) => {
    const q = query.trim().toLowerCase();
    if (statusFilter !== 'ALL' && String(s.status) !== statusFilter) return false;
    if (!q) return true;
    return (
      String(s.id).includes(q) ||
      (s.username || '').toLowerCase().includes(q) ||
      (s.challengeTitle || '').toLowerCase().includes(q) ||
      (s.githubUrl || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-xl font-bold mb-4">Admin — Submissions</h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex items-center gap-3 mb-4">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Rechercher id, user, challenge, repo..."
            className="flex-1 border rounded px-3 py-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border rounded px-2 py-2"
          >
            <option value="ALL">Tous</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="REVIEWED">REVIEWED</option>
          </select>
        </div>

        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-gray-500">Aucune soumission trouvée.</div>
            ) : (
              <>
                {paginated.map((sub) => (
                  <div key={sub.id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm">#{sub.id} — {sub.challengeTitle} ({sub.username})</div>
                      <div className="text-xs text-gray-500">Status: {String(sub.status)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Repo</a>
                      <button
                        onClick={() => handleReview(sub.id)}
                        disabled={actionLoading !== null}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        {actionLoading === sub.id ? '...' : 'Review'}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">Affichage {Math.min((page - 1) * perPage + 1, filtered.length)} - {Math.min(page * perPage, filtered.length)} sur {filtered.length}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >Prev</button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`px-2 py-1 border rounded text-sm ${page === i + 1 ? 'bg-gray-900 text-white' : ''}`}
                        >{i + 1}</button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >Next</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
