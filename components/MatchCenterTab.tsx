'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  LEAGUE_FILTERS,
  MATCHES_DATA,
  type LeagueFilter,
  type FormResult,
} from '@/lib/football-data';
import { getKoreanTeamName } from '@/lib/footballApi';
import type {
  EnrichedMatchItem,
  LiveStandingRow,
} from '@/lib/footballMapper';
import { calculatePoissonMatchAnalysis } from '@/lib/analytics';
import {
  Calendar,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Search,
  ChevronRight,
  Trophy,
  RefreshCw,
} from 'lucide-react';

interface MatchCenterTabProps {
  isDark: boolean;
}

function FormChip({ result, isDark }: { result: FormResult; isDark: boolean }) {
  const styles =
    result === '승'
      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
      : result === '무'
      ? isDark
        ? 'bg-slate-700/50 text-slate-300 border-slate-600'
        : 'bg-slate-200 text-slate-700 border-slate-300'
      : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';

  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-semibold border tabular-nums ${styles}`}
      title={`최근 경기 결과: ${result}`}
    >
      {result}
    </span>
  );
}

function TeamCrest({
  name,
  shortCode,
  primaryColor,
  crestUrl,
  size = 'md',
}: {
  name: string;
  shortCode: string;
  primaryColor: string;
  crestUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);

  const dims =
    size === 'lg'
      ? 'w-11 h-11 text-xs'
      : size === 'sm'
      ? 'w-7 h-7 text-[10px]'
      : 'w-9 h-9 text-[11px]';

  if (crestUrl && !imgError) {
    return (
      <div
        className={`${dims} rounded-xl flex items-center justify-center p-1.5 shrink-0 border border-white/10 bg-white/5 shadow-xs`}
        aria-label={`${name} 엠블럼`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={crestUrl}
          alt={`${name} 로고`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dims} rounded-xl flex items-center justify-center font-mono font-bold tracking-tight shrink-0 border border-white/15 shadow-xs`}
      style={{
        backgroundColor: `${primaryColor}22`,
        color: primaryColor,
        borderColor: `${primaryColor}44`,
      }}
      aria-label={`${name} 엠블럼`}
    >
      {shortCode}
    </div>
  );
}

export default function MatchCenterTab({ isDark }: MatchCenterTabProps) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueFilter>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveMatches, setLiveMatches] = useState<EnrichedMatchItem[]>([]);
  const [liveStandings, setLiveStandings] = useState<LiveStandingRow[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('live');
  const [activeLeagueLabel, setActiveLeagueLabel] = useState<string>('프리미어리그');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');

  // Interactive xG simulation overrides for the selected match
  const [customLambdaOverrides, setCustomLambdaOverrides] = useState<
    Record<string, { home: number; away: number }>
  >({});

  useEffect(() => {
    let isCancelled = false;
    async function loadFootballData() {
      setIsLoadingLive(true);
      try {
        const res = await fetch(
          `/api/football?league=${encodeURIComponent(selectedLeague)}`
        );
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (isCancelled) return;

        if (Array.isArray(data.matches) && data.matches.length > 0) {
          setLiveMatches(data.matches);
          setSelectedMatchId(data.matches[0].id);
        }
        if (Array.isArray(data.standings)) {
          setLiveStandings(data.standings);
        }
        setDataSource(data.source === 'live' ? 'live' : 'fallback');
        setActiveLeagueLabel(data.leagueLabel || '프리미어리그');
      } catch {
        if (!isCancelled) {
          setLiveMatches(MATCHES_DATA);
          setSelectedMatchId(MATCHES_DATA[0].id);
          setDataSource('fallback');
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingLive(false);
        }
      }
    }
    loadFootballData();
    return () => {
      isCancelled = true;
    };
  }, [selectedLeague]);

  const filteredMatches = useMemo(() => {
    return liveMatches.filter((match) => {
      const matchesLeague =
        selectedLeague === '전체' || match.league === selectedLeague;
      const query = searchQuery.trim().toLowerCase();
      const homeKo = getKoreanTeamName(match.homeTeam.name).toLowerCase();
      const awayKo = getKoreanTeamName(match.awayTeam.name).toLowerCase();
      const matchesSearch =
        !query ||
        homeKo.includes(query) ||
        awayKo.includes(query) ||
        match.league.toLowerCase().includes(query) ||
        match.stadium.toLowerCase().includes(query);
      return matchesLeague && matchesSearch;
    });
  }, [liveMatches, selectedLeague, searchQuery]);

  const activeMatch: EnrichedMatchItem = useMemo(() => {
    const found = filteredMatches.find((m) => m.id === selectedMatchId);
    if (found) return found;
    return filteredMatches[0] || liveMatches[0] || MATCHES_DATA[0];
  }, [filteredMatches, liveMatches, selectedMatchId]);

  const currentLambdas = customLambdaOverrides[activeMatch.id] || {
    home: activeMatch.homeXgLambda,
    away: activeMatch.awayXgLambda,
  };

  const activeAnalysis = useMemo(() => {
    return calculatePoissonMatchAnalysis(currentLambdas.home, currentLambdas.away);
  }, [currentLambdas.home, currentLambdas.away]);

  const isSimulated =
    Math.abs(currentLambdas.home - activeMatch.homeXgLambda) > 0.01 ||
    Math.abs(currentLambdas.away - activeMatch.awayXgLambda) > 0.01;

  const handleLambdaChange = (side: 'home' | 'away', value: number) => {
    setCustomLambdaOverrides((prev) => ({
      ...prev,
      [activeMatch.id]: {
        home: side === 'home' ? value : currentLambdas.home,
        away: side === 'away' ? value : currentLambdas.away,
      },
    }));
  };

  const resetSimulation = () => {
    setCustomLambdaOverrides((prev) => {
      const next = { ...prev };
      delete next[activeMatch.id];
      return next;
    });
  };

  const surfaceCard = isDark
    ? 'bg-[#181B22] border-[#262A34] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';
  const subtleDivider = isDark ? 'border-[#262A34]' : 'border-slate-200';

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
          role="tablist"
          aria-label="리그 필터"
        >
          {LEAGUE_FILTERS.map((league) => {
            const isActive = selectedLeague === league;
            return (
              <button
                key={league}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedLeague(league)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#10B981] text-slate-950 font-bold'
                    : isDark
                    ? 'bg-[#181B22] text-slate-300 border border-[#262A34] hover:border-slate-600'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {league}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
          <Search
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${mutedText}`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="구단명, 리그, 경기장 검색..."
            aria-label="경기 검색"
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-colors ${
              isDark
                ? 'bg-[#181B22] border-[#262A34] text-slate-100 placeholder:text-slate-500 focus:border-[#10B981]'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#10B981]'
            }`}
          />
        </div>
      </div>

      {/* Main 2-Column Split: Match Cards List (Left 7 cols) + Match Detail Panel (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: FotMob-style Match List + Live League Standings Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                <span>
                  주요 매치업 및 실시간 승률 예측 ({filteredMatches.length}경기)
                </span>
                {isLoadingLive && (
                  <RefreshCw className="w-3.5 h-3.5 text-[#10B981] animate-spin" />
                )}
              </h2>
              <span className={`text-xs ${mutedText}`}>
                {dataSource === 'live'
                  ? `${activeLeagueLabel} 공식 API 실시간 연동 완료`
                  : '경기 카드를 클릭하면 우측에서 포아송 상세 분석이 표시됩니다'}
              </span>
            </div>

            {filteredMatches.length === 0 ? (
              <div
                className={`rounded-2xl border p-10 text-center space-y-3 ${surfaceCard}`}
              >
                <p className="text-sm font-medium">
                  조건에 일치하는 경기가 없습니다.
                </p>
                <p className={`text-xs ${mutedText}`}>
                  다른 리그 필터를 선택하거나 검색어를 초기화해 보세요.
                </p>
                <button
                  onClick={() => {
                    setSelectedLeague('전체');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#10B981] text-slate-950 hover:bg-[#059669] transition-colors cursor-pointer"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              filteredMatches.map((match) => {
                const matchOverride = customLambdaOverrides[match.id];
                const analysis = calculatePoissonMatchAnalysis(
                  matchOverride ? matchOverride.home : match.homeXgLambda,
                  matchOverride ? matchOverride.away : match.awayXgLambda
                );
                const isSelected = activeMatch.id === match.id;

                return (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => setSelectedMatchId(match.id)}
                    className={`w-full text-left rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${surfaceCard} ${
                      isSelected
                        ? 'ring-2 ring-[#10B981] border-transparent'
                        : isDark
                        ? 'hover:border-slate-700'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    {/* Top Metadata Row */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-dashed border-slate-500/20 text-xs">
                      <div className={`flex items-center gap-1.5 ${mutedText}`}>
                        <span className="font-semibold text-[#10B981]">
                          {match.league}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{match.roundLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{match.stadium}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="font-semibold">
                          {match.actualScoreText
                            ? `스코어 ${match.actualScoreText}`
                            : match.kickoffTime}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${mutedText}`} />
                      </div>
                    </div>

                    {/* Teams & Recent 5-Match Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                      {/* Home Team */}
                      <div className="sm:col-span-5 flex items-center justify-between sm:justify-start gap-3">
                        <TeamCrest
                          name={match.homeTeam.name}
                          shortCode={match.homeTeam.shortCode}
                          primaryColor={match.homeTeam.primaryColor}
                          crestUrl={match.homeCrest}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                            <span>{getKoreanTeamName(match.homeTeam.name)}</span>
                            {match.homePosition && (
                              <span
                                className={`text-[11px] font-mono ${mutedText}`}
                              >
                                ({match.homePosition}위)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {match.homeTeam.recentForm.map((res, idx) => (
                              <FormChip
                                key={`${match.id}-h-${idx}`}
                                result={res}
                                isDark={isDark}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Center VS or Actual Score */}
                      <div className="sm:col-span-1 flex sm:flex-col items-center justify-center py-1">
                        <span
                          className={`text-[11px] font-mono uppercase ${
                            match.actualScoreText
                              ? 'text-[#10B981] font-bold'
                              : mutedText
                          }`}
                        >
                          {match.actualScoreText || 'VS'}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="sm:col-span-5 flex items-center justify-between sm:justify-end gap-3">
                        <div className="min-w-0 sm:text-right order-2 sm:order-1">
                          <div className="font-semibold text-sm truncate flex items-center sm:justify-end gap-1.5">
                            {match.awayPosition && (
                              <span
                                className={`text-[11px] font-mono ${mutedText}`}
                              >
                                ({match.awayPosition}위)
                              </span>
                            )}
                            <span>{getKoreanTeamName(match.awayTeam.name)}</span>
                          </div>
                          <div className="flex items-center sm:justify-end gap-1 mt-1">
                            {match.awayTeam.recentForm.map((res, idx) => (
                              <FormChip
                                key={`${match.id}-a-${idx}`}
                                result={res}
                                isDark={isDark}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="order-1 sm:order-2">
                          <TeamCrest
                            name={match.awayTeam.name}
                            shortCode={match.awayTeam.shortCode}
                            primaryColor={match.awayTeam.primaryColor}
                            crestUrl={match.awayCrest}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Compact AI Win Probability Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-500/15">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-mono tabular-nums">
                        <span className="text-[#10B981] font-semibold">
                          홈 승 {analysis.homeWinProb}%
                        </span>
                        <span className={mutedText}>
                          무승부 {analysis.drawProb}%
                        </span>
                        <span className="text-[#38BDF8] font-semibold">
                          원정 승 {analysis.awayWinProb}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800/40 gap-0.5">
                        <div
                          style={{ width: `${analysis.homeWinProb}%` }}
                          className="bg-[#10B981] transition-all duration-200"
                        />
                        <div
                          style={{ width: `${analysis.drawProb}%` }}
                          className="bg-slate-500/60 transition-all duration-200"
                        />
                        <div
                          style={{ width: `${analysis.awayWinProb}%` }}
                          className="bg-[#38BDF8] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Live League Standings Card (Powered by getLeagueStandings) */}
          {liveStandings.length > 0 && (
            <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceCard}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#10B981]" />
                    {activeLeagueLabel} 실시간 순위표 (Standings)
                  </h3>
                  <p className={`text-xs ${mutedText} mt-0.5`}>
                    공식 리그 순위 및 경기당 득실점·최근 5경기 폼 데이터
                  </p>
                </div>
                <span className="text-xs font-mono text-[#10B981] font-semibold tabular-nums">
                  총 {liveStandings.length}개 구단
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr
                      className={`border-b ${subtleDivider} ${mutedText} font-semibold`}
                    >
                      <th className="py-2.5 pr-2 w-8 text-center">#</th>
                      <th className="py-2.5 px-2">구단명</th>
                      <th className="py-2.5 px-2 text-right font-mono">경기</th>
                      <th className="py-2.5 px-2 text-right font-mono">승</th>
                      <th className="py-2.5 px-2 text-right font-mono">무</th>
                      <th className="py-2.5 px-2 text-right font-mono">패</th>
                      <th className="py-2.5 px-2 text-right font-mono">득실</th>
                      <th className="py-2.5 px-2 text-right font-mono">승점</th>
                      <th className="py-2.5 pl-2 text-right hidden sm:table-cell">
                        최근 폼
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/15 font-mono tabular-nums">
                    {liveStandings.map((row) => {
                      const isUclZone = row.position <= 4;
                      const isRelegationZone =
                        row.position > liveStandings.length - 3;

                      return (
                        <tr
                          key={row.teamId}
                          className="hover:bg-slate-500/5 transition-colors"
                        >
                          <td
                            className={`py-2.5 pr-2 text-center font-bold ${
                              isUclZone
                                ? 'text-[#10B981]'
                                : isRelegationZone
                                ? 'text-[#EF4444]'
                                : ''
                            }`}
                          >
                            {row.position}
                          </td>
                          <td className="py-2.5 px-2 font-sans font-semibold">
                            <div className="flex items-center gap-2">
                              {row.crest && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={row.crest}
                                  alt={row.teamName}
                                  referrerPolicy="no-referrer"
                                  className="w-4 h-4 object-contain shrink-0"
                                />
                              )}
                              <span className="truncate max-w-[140px]">
                                {getKoreanTeamName(row.teamName)}
                              </span>
                            </div>
                          </td>
                          <td className={`py-2.5 px-2 text-right ${mutedText}`}>
                            {row.playedGames}
                          </td>
                          <td className="py-2.5 px-2 text-right">{row.won}</td>
                          <td className={`py-2.5 px-2 text-right ${mutedText}`}>
                            {row.draw}
                          </td>
                          <td className={`py-2.5 px-2 text-right ${mutedText}`}>
                            {row.lost}
                          </td>
                          <td
                            className={`py-2.5 px-2 text-right font-semibold ${
                              row.goalDifference > 0
                                ? 'text-[#10B981]'
                                : row.goalDifference < 0
                                ? 'text-[#EF4444]'
                                : mutedText
                            }`}
                          >
                            {row.goalDifference > 0
                              ? `+${row.goalDifference}`
                              : row.goalDifference}
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-sm">
                            {row.points}
                          </td>
                          <td className="py-2.5 pl-2 text-right hidden sm:table-cell font-sans">
                            <div className="inline-flex items-center justify-end gap-1">
                              {row.recentForm.map((f, i) => (
                                <FormChip
                                  key={`${row.teamId}-f-${i}`}
                                  result={f}
                                  isDark={isDark}
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Match Detail Side Panel */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-5 sm:p-6 space-y-6 lg:sticky lg:top-20 ${surfaceCard}`}
          aria-label="선택된 경기 상세 분석 패널"
        >
          {/* Header */}
          <div className={`pb-4 border-b ${subtleDivider}`}>
            <div
              className={`flex items-center justify-between text-xs ${mutedText} mb-2`}
            >
              <span>{activeMatch.roundLabel}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {activeMatch.stadium}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 mt-3">
              <div className="flex items-center gap-2.5">
                <TeamCrest
                  name={activeMatch.homeTeam.name}
                  shortCode={activeMatch.homeTeam.shortCode}
                  primaryColor={activeMatch.homeTeam.primaryColor}
                  crestUrl={activeMatch.homeCrest}
                  size="lg"
                />
                <div>
                  <div className="font-bold text-base">
                    {getKoreanTeamName(activeMatch.homeTeam.name)}
                  </div>
                  <div className={`text-xs font-mono tabular-nums ${mutedText}`}>
                    Elo {activeMatch.homeTeam.eloRating} · λ{' '}
                    {currentLambdas.home.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="text-center font-mono text-xs px-2.5 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981] font-semibold tabular-nums shrink-0">
                {activeMatch.actualScoreText
                  ? `결과 ${activeMatch.actualScoreText}`
                  : `${activeMatch.kickoffTime} 킥오프`}
              </div>

              <div className="flex items-center gap-2.5 text-right">
                <div>
                  <div className="font-bold text-base">
                    {getKoreanTeamName(activeMatch.awayTeam.name)}
                  </div>
                  <div className={`text-xs font-mono tabular-nums ${mutedText}`}>
                    Elo {activeMatch.awayTeam.eloRating} · λ{' '}
                    {currentLambdas.away.toFixed(2)}
                  </div>
                </div>
                <TeamCrest
                  name={activeMatch.awayTeam.name}
                  shortCode={activeMatch.awayTeam.shortCode}
                  primaryColor={activeMatch.awayTeam.primaryColor}
                  crestUrl={activeMatch.awayCrest}
                  size="lg"
                />
              </div>
            </div>

            <p className={`mt-3 text-xs leading-relaxed ${mutedText}`}>
              {activeMatch.tacticalKeynote}
            </p>
          </div>

          {/* Section 1: AI 승률 분석 (Poisson & Monte Carlo) */}
          <div className={`space-y-4 pb-5 border-b ${subtleDivider}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  승률 예측 및 예상 스코어 (포아송 & 몬테카를로)
                </h3>
                <p className={`text-xs ${mutedText} mt-0.5`}>
                  몬테카를로 {activeMatch.monteCarloRuns.toLocaleString()}회 시뮬레이션 · 기대 총득점{' '}
                  <span className="font-mono font-semibold text-[#10B981] tabular-nums">
                    {activeAnalysis.expectedTotalGoals}골
                  </span>
                </p>
              </div>
              {isSimulated && (
                <button
                  type="button"
                  onClick={resetSimulation}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F59E0B]/15 text-[#F59E0B] hover:bg-[#F59E0B]/25 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  초기값 복원
                </button>
              )}
            </div>

            {/* Win Probability Bar */}
            <div>
              <div className="grid grid-cols-3 text-xs font-mono tabular-nums mb-1.5">
                <div>
                  <span className="text-[#10B981] font-bold text-sm">
                    {activeAnalysis.homeWinProb}%
                  </span>{' '}
                  <span className={mutedText}>
                    {getKoreanTeamName(activeMatch.homeTeam.name)} 승
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-sm">
                    {activeAnalysis.drawProb}%
                  </span>{' '}
                  <span className={mutedText}>무승부</span>
                </div>
                <div className="text-right">
                  <span className={mutedText}>
                    {getKoreanTeamName(activeMatch.awayTeam.name)} 승
                  </span>{' '}
                  <span className="text-[#38BDF8] font-bold text-sm">
                    {activeAnalysis.awayWinProb}%
                  </span>
                </div>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800/50 gap-0.5">
                <div
                  style={{ width: `${activeAnalysis.homeWinProb}%` }}
                  className="bg-[#10B981] transition-all duration-200"
                />
                <div
                  style={{ width: `${activeAnalysis.drawProb}%` }}
                  className="bg-slate-500/70 transition-all duration-200"
                />
                <div
                  style={{ width: `${activeAnalysis.awayWinProb}%` }}
                  className="bg-[#38BDF8] transition-all duration-200"
                />
              </div>
            </div>

            {/* Top 3 Most Likely Exact Scores */}
            <div>
              <div className={`text-xs font-medium ${mutedText} mb-2`}>
                포아송 분포 기반 상위 3개 예상 스코어 확률
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {activeAnalysis.topExactScores.map((score, index) => (
                  <div
                    key={score.scoreLabel}
                    className={`rounded-xl p-3 border text-center ${
                      index === 0
                        ? 'border-[#10B981]/50 bg-[#10B981]/10'
                        : isDark
                        ? 'border-[#262A34] bg-[#0F1115]/60'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className={`text-[11px] ${mutedText}`}>
                      {index + 1}순위 스코어
                    </div>
                    <div className="font-mono font-bold text-base my-0.5 tabular-nums">
                      {score.scoreLabel}
                    </div>
                    <div className="font-mono text-xs font-semibold text-[#10B981] tabular-nums">
                      확률 {score.probability}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive xG Simulator Sliders */}
            <div
              className={`rounded-xl p-3.5 border ${
                isDark
                  ? 'bg-[#0F1115]/70 border-[#262A34]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-semibold flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#10B981]" />
                  전술 변수 시뮬레이터 (기대 득점 λ 조정)
                </span>
                <span className={mutedText}>부상·전술 변화 시 승률 변동 테스트</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="block space-y-1">
                  <div className="flex justify-between font-mono tabular-nums">
                    <span>
                      {getKoreanTeamName(activeMatch.homeTeam.name)} 기대 득점
                    </span>
                    <span className="text-[#10B981] font-semibold">
                      {currentLambdas.home.toFixed(2)} xG
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="3.5"
                    step="0.05"
                    value={currentLambdas.home}
                    onChange={(e) =>
                      handleLambdaChange('home', parseFloat(e.target.value))
                    }
                    aria-label={`${getKoreanTeamName(activeMatch.homeTeam.name)} 기대 득점 조정`}
                    className="w-full accent-[#10B981] cursor-pointer"
                  />
                </label>
                <label className="block space-y-1">
                  <div className="flex justify-between font-mono tabular-nums">
                    <span>
                      {getKoreanTeamName(activeMatch.awayTeam.name)} 기대 득점
                    </span>
                    <span className="text-[#38BDF8] font-semibold">
                      {currentLambdas.away.toFixed(2)} xG
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="3.5"
                    step="0.05"
                    value={currentLambdas.away}
                    onChange={(e) =>
                      handleLambdaChange('away', parseFloat(e.target.value))
                    }
                    aria-label={`${getKoreanTeamName(activeMatch.awayTeam.name)} 기대 득점 조정`}
                    className="w-full accent-[#38BDF8] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: 핵심 지표 비교 (Team Form Comparison) */}
          <div className={`space-y-3.5 pb-5 border-b ${subtleDivider}`}>
            <h3 className="text-sm font-bold">
              핵심 전술 지표 비교 (시즌 경기당 득실·전력 기준)
            </h3>

            {[
              {
                label: '경기당 평균 득점 / 기대 득점 (xG)',
                homeVal: activeMatch.homeTeam.recent5Xg,
                awayVal: activeMatch.awayTeam.recent5Xg,
                unit: '',
                higherIsBetter: true,
              },
              {
                label: '경기당 평균 실점 / 기대 실점 (xGA · 낮을수록 우수)',
                homeVal: activeMatch.homeTeam.recent5Xga,
                awayVal: activeMatch.awayTeam.recent5Xga,
                unit: '',
                higherIsBetter: false,
              },
              {
                label: '압박 강도 (PPDA · 낮을수록 강한 전방 압박)',
                homeVal: activeMatch.homeTeam.ppda,
                awayVal: activeMatch.awayTeam.ppda,
                unit: '',
                higherIsBetter: false,
              },
              {
                label: '클럽 Elo 레이팅 (전력 지수)',
                homeVal: activeMatch.homeTeam.eloRating,
                awayVal: activeMatch.awayTeam.eloRating,
                unit: '점',
                higherIsBetter: true,
              },
            ].map((stat) => {
              const total = stat.homeVal + stat.awayVal || 1;
              const homeShare = Math.round((stat.homeVal / total) * 100);
              const awayShare = 100 - homeShare;
              const homeAdvantage = stat.higherIsBetter
                ? stat.homeVal >= stat.awayVal
                : stat.homeVal <= stat.awayVal;

              return (
                <div key={stat.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span
                      className={
                        homeAdvantage ? 'text-[#10B981] font-bold' : mutedText
                      }
                    >
                      {stat.homeVal}
                      {stat.unit}
                    </span>
                    <span className={`font-sans text-xs ${mutedText}`}>
                      {stat.label}
                    </span>
                    <span
                      className={
                        !homeAdvantage ? 'text-[#38BDF8] font-bold' : mutedText
                      }
                    >
                      {stat.awayVal}
                      {stat.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800/40 gap-0.5">
                    <div
                      style={{ width: `${homeShare}%` }}
                      className={
                        homeAdvantage ? 'bg-[#10B981]' : 'bg-slate-500/50'
                      }
                    />
                    <div
                      style={{ width: `${awayShare}%` }}
                      className={
                        !homeAdvantage ? 'bg-[#38BDF8]' : 'bg-slate-500/50'
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 3: 결장 및 부상자 명단 (Injuries & Suspensions) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                결장 및 부상자 명단
              </h3>
              <span className={`text-xs ${mutedText}`}>
                전술 영향도 분류 포함
              </span>
            </div>

            <div className="divide-y divide-slate-500/15">
              {activeMatch.injuries.map((inj) => (
                <div
                  key={inj.id}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>{inj.playerName}</span>
                      <span className={`font-normal ${mutedText}`}>
                        ·{' '}
                        {inj.teamSide === '홈'
                          ? getKoreanTeamName(activeMatch.homeTeam.name)
                          : getKoreanTeamName(activeMatch.awayTeam.name)}{' '}
                        ({inj.position})
                      </span>
                    </div>
                    <div className={`${mutedText} mt-0.5`}>
                      {inj.reason} · {inj.returnEstimate}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md font-semibold shrink-0 ${
                      inj.impact === '높음'
                        ? 'bg-[#EF4444]/15 text-[#EF4444]'
                        : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                    }`}
                  >
                    영향도: {inj.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
