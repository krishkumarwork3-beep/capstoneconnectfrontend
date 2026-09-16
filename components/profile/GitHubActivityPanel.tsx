"use client";

import React, { useEffect, useState } from "react";
import { Star, GitFork, ExternalLink, Code2, AlertTriangle } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { GitHubActivity } from "@/lib/types";
import { getGitHubActivity } from "@/lib/api/users";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { formatDate } from "@/lib/utils";

interface GitHubActivityPanelProps {
  userId: string;
  githubUrl?: string;
}

export function GitHubActivityPanel({ userId, githubUrl }: GitHubActivityPanelProps) {
  const [activity, setActivity] = useState<GitHubActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadGitHub() {
      setLoading(true);
      setError(false);
      try {
        const data = await getGitHubActivity(userId);
        if (isMounted) {
          setActivity(data);
        }
      } catch (e) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadGitHub();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (!githubUrl) {
    return (
      <div className="bg-white rounded-xl border border-[#E7E5DF] p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E5DF] flex items-center justify-center mx-auto mb-2 text-[#8C9490]">
          <GitHubIcon className="w-5 h-5" />
        </div>
        <h4 className="font-serif-heading text-sm font-semibold text-[#181C1B]">No GitHub Linked</h4>
        <p className="text-xs text-[#5C6461] mt-1">
          This user has not connected their GitHub profile yet.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E7E5DF] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-36 h-5" />
          <Skeleton variant="circular" className="w-6 h-6" />
        </div>
        <Skeleton variant="rectangular" className="w-full h-16 rounded-lg" />
        <Skeleton variant="rectangular" className="w-full h-24 rounded-lg" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="bg-[#FAF8F5] rounded-xl border border-[#E7E5DF] p-5 text-xs text-[#5C6461] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#B8532F]" />
          <span>Could not retrieve live GitHub repositories right now.</span>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#153E35] hover:underline"
        >
          <span>Open on GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E7E5DF] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitHubIcon className="w-5 h-5 text-[#181C1B]" />
          <h3 className="font-serif-heading text-base font-semibold text-[#181C1B]">
            GitHub Activity & Repositories
          </h3>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#153E35] hover:underline"
        >
          <span>@{activity.username}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Top Languages Distribution */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5C6461]">
          <span className="font-medium">Primary Languages</span>
          <span>{activity.public_repos} public repos</span>
        </div>
        <div className="h-2 w-full bg-[#FAF8F5] rounded-full overflow-hidden flex">
          {activity.top_languages.map((lang) => (
            <div
              key={lang.name}
              title={`${lang.name}: ${lang.percentage}%`}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 text-xs pt-1">
          {activity.top_languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-[#181C1B] font-medium">{lang.name}</span>
              <span className="text-[#8C9490]">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Repositories */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8C9490] block">
          Featured Capstone Repositories
        </span>
        <div className="space-y-2.5">
          {activity.recent_repos.map((repo) => (
            <div
              key={repo.id}
              className="p-3.5 rounded-lg border border-[#E7E5DF] bg-[#FAF8F5] hover:border-[#D1CEBE] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#181C1B] hover:text-[#153E35] flex items-center gap-1 group truncate"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#153E35]" />
                  <span className="truncate group-hover:underline">{repo.name}</span>
                </a>
                <div className="flex items-center gap-2 text-xs text-[#8C9490] shrink-0">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-[#B8532F]" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <GitFork className="w-3 h-3" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>
              {repo.description && (
                <p className="text-xs text-[#5C6461] mt-1.5 line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center justify-between text-[11px] text-[#8C9490] mt-2 pt-2 border-t border-[#E7E5DF]/60">
                <span>{repo.language || "Multi-language"}</span>
                <span>Updated {formatDate(repo.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
