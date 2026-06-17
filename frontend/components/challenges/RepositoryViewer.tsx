"use client";

import React, { useState, useEffect } from "react";
import { Folder, File, ChevronRight, ChevronDown, Loader2, AlertCircle, Code } from "lucide-react";
import { analysisApi } from "@/lib/analysis";
import { GithubIcon } from "../icon";

interface FileContent {
  path: string;
  name: string;
  content: string;
  extension: string;
  size: number;
  sha: string;
}

interface RepositoryContent {
  owner: string;
  repo: string;
  defaultBranch: string;
  files: FileContent[];
  totalFiles: number;
  totalSize: number;
}

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: TreeNode[];
  file?: FileContent;
}

export default function RepositoryViewer({ submissionId }: { submissionId: number }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repoContent, setRepoContent] = useState<RepositoryContent | null>(null);
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileContent | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRepositoryContent();
  }, [submissionId]);

  const fetchRepositoryContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const content = await analysisApi.getRepositoryContent(submissionId);
      setRepoContent(content);

      const tree = buildFileTree(content.files);
      setFileTree(tree);

      const rootFolders = new Set<string>();
      tree.forEach(node => {
        if (node.type === "directory") {
          rootFolders.add(node.path);
        }
      });
      setExpandedFolders(rootFolders);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération du repository");
    } finally {
      setLoading(false);
    }
  };

  const buildFileTree = (files: FileContent[]): TreeNode[] => {
    const root: { [key: string]: TreeNode } = {};

    files.forEach(file => {
      const parts = file.path.split("/");
      let currentPath = "";

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!root[currentPath]) {
          root[currentPath] = {
            name: part,
            path: currentPath,
            type: isLast ? "file" : "directory",
            children: isLast ? undefined : [],
            file: isLast ? file : undefined,
          };
        }

        if (!isLast && parentPath && root[parentPath]) {
          const parent = root[parentPath];
          if (!parent.children?.find(c => c.path === currentPath)) {
            parent.children = parent.children || [];
            parent.children.push(root[currentPath]);
          }
        }
      });
    });

    return Object.values(root).filter(node => !node.path.includes("/"));
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getLanguageFromExtension = (extension: string): string => {
    const map: { [key: string]: string } = {
      ".java": "Java", ".kt": "Kotlin", ".js": "JavaScript", ".ts": "TypeScript",
      ".jsx": "React JSX", ".tsx": "React TSX", ".py": "Python",
      ".c": "C", ".cpp": "C++", ".h": "C Header", ".hpp": "C++ Header",
      ".cs": "C#", ".rb": "Ruby", ".php": "PHP", ".swift": "Swift",
      ".html": "HTML", ".css": "CSS", ".go": "Go", ".rs": "Rust",
      ".sql": "SQL", ".json": "JSON", ".xml": "XML", ".yml": "YAML",
      ".yaml": "YAML", ".md": "Markdown",
    };
    return map[extension] || extension.slice(1).toUpperCase();
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.path);
    const paddingLeft = level * 20;

    if (node.type === "directory") {
      return (
        <div key={node.path}>
          <div
            className="flex items-center py-1.5 px-2 hover:bg-[var(--cream)] rounded-lg cursor-pointer transition-colors"
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-[var(--gray)] mr-1" />
            ) : (
              <ChevronRight size={16} className="text-[var(--gray)] mr-1" />
            )}
            <Folder size={16} className="text-[var(--yellow)] mr-2" />
            <span className="text-sm font-bold text-[var(--navy)]">{node.name}</span>
            <span className="ml-2 text-[10px] text-[var(--gray)]">
              ({node.children?.length || 0})
            </span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children
                .sort((a, b) => {
                  if (a.type === b.type) return a.name.localeCompare(b.name);
                  return a.type === "directory" ? -1 : 1;
                })
                .map(child => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className="flex items-center py-1.5 px-2 hover:bg-[var(--blue)]/5 rounded-lg cursor-pointer transition-colors"
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => setSelectedFile(node.file || null)}
      >
        <File size={14} className="text-[var(--gray)] mr-2 flex-shrink-0" />
        <span className="text-sm font-bold text-[var(--navy)] truncate">{node.name}</span>
        {node.file && (
          <span className="ml-2 text-[10px] text-[var(--gray)] flex-shrink-0">
            {formatFileSize(node.file.size)}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white border border-[var(--border-pink)] rounded-xl p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[var(--blue)] animate-spin mr-3" />
        <span className="text-sm font-bold text-[var(--gray)]">Récupération du repository...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span className="text-sm font-bold">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--border-pink)] rounded-xl overflow-hidden">
      <div className="bg-[var(--cream)] border-b border-[var(--border-pink)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GithubIcon size={18} className="text-[var(--gray)]" />
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">
                {repoContent?.owner}/{repoContent?.repo}
              </h3>
              <p className="text-[10px] font-bold text-[var(--gray)]">
                Branch: {repoContent?.defaultBranch} • {repoContent?.totalFiles} fichiers • {formatFileSize(repoContent?.totalSize || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[500px]">
        <div className="w-1/2 border-r border-[var(--border-pink)] overflow-y-auto p-3">
          <div className="text-[10px] font-bold text-[var(--gray)] uppercase mb-2 px-2">
            Structure du projet
          </div>
          {fileTree
            .sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === "directory" ? -1 : 1;
            })
            .map(node => renderTreeNode(node))}
        </div>

        <div className="w-1/2 overflow-y-auto bg-[var(--cream)]">
          {selectedFile ? (
            <div>
              <div className="bg-white border-b border-[var(--border-pink)] px-4 py-2 sticky top-0">
                <div className="flex items-center gap-2">
                  <Code size={14} className="text-[var(--gray)]" />
                  <span className="text-xs font-bold text-[var(--navy)]">{selectedFile.path}</span>
                  <span className="text-[10px] font-bold text-[var(--gray)] ml-auto">
                    {getLanguageFromExtension(selectedFile.extension)} • {formatFileSize(selectedFile.size)}
                  </span>
                </div>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto">
                <code>{selectedFile.content || "// Fichier vide ou binaire"}</code>
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[var(--gray)]">
              <File size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-bold">Sélectionnez un fichier</p>
              <p className="text-[10px] font-bold mt-1">pour voir son contenu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
