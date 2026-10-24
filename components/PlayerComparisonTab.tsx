'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LEAGUE_FILTERS, type LeagueFilter } from '@/lib/football-data';
import {
  INITIAL_BIGDATA_PLAYERS,
  enrichPlayerBigDataList,
  mergeLiveScorersIntoBigData,
  parseUploadedPlayerDataset,
  type RawPlayerBigData,
  type EnrichedPlayerBigData,
  type PositionGroup,
} from '@/lib/playerBigData';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  ArrowLeftRight,
  Award,
  Coins,
  Activity,
  Shield,
  RefreshCw,
  Upload,
  Search,
  Sparkles,
  TrendingUp,
  Database,
  Filter,
} from 'lucide-react';

interface PlayerComparisonTabProps {
  isDark: boolean;
}

type ScatterPresetId = 'finishing' | 'playmaking' | 'efficiency' | 'defense';

interface ScatterPreset {
  id: ScatterPresetId;
  label: string;
  xKey: keyof EnrichedPlayerBigData;
  yKey: keyof EnrichedPlayerBigData;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  quadrantNote: string;
}

const SCATTER_PRESETS: ScatterPreset[] = [
  {
    id: 'finishing',
    label: '결정력 분석 (90분당 기대득점 xG vs 실제 득점)',
    xKey: 'xgPer90',
    yKey: 'goalsPer90',
    xLabel: '90분당 기대 득점 (xG/90)',
    yLabel: '90분당 실제 득점 (Goals/90)',
    xUnit: 'xG',
    yUnit: '골',
    quadrantNote: '우상단: 고볼륨·고결정력 엘리트 피니셔 / 좌상단: 저볼륨 원샷원킬 크랙',
  },
  {
    id: 'playmaking',
    label: '찬스메이킹 & 볼 전진 (전진 패스 vs 슛 창출 SCA)',
    xKey: 'prgPassesPer90',
    yKey: 'scaPer90',
    xLabel: '90분당 전진 패스 (PrgP/90)',
    yLabel: '90분당 슛 창출 액션 (SCA/90)',
    xUnit: '회',
    yUnit: '회',
    quadrantNote: '우상단: 빌드업 및 찬스 창출을 동시 지배하는 플레이메이커',
  },
  {
    id: 'efficiency',
    label: '재정 가성비 분석 (90분당 공격포인트 vs 가성비 지수)',
    xKey: 'goalContributionPer90',
    yKey: 'valueEfficiencyScore',
    xLabel: '90분당 공격포인트 (G+A/90)',
    yLabel: '주급 대비 가성비 지수 (점)',
    xUnit: 'P/90',
    yUnit: '점',
    quadrantNote: '우상단: 주급 대비 최상위 공격 생산성을 보여주는 초고효율 코어',
  },
  {
    id: 'defense',
    label: '중원 장악 & 수비 기여 (볼 리커버리 vs 태클+인터셉트)',
    xKey: 'recoveriesPer90',
    yKey: 'tacklesInterceptionsPer90',
    xLabel: '90분당 볼 리커버리 (회/90)',
    yLabel: '90분당 태클 + 인터셉트 (회/90)',
    xUnit: '회',
    yUnit: '회',
    quadrantNote: '우상단: 세컨드볼 회수와 대인 볼 탈취가 모두 뛰어난 수비 엔진',
  },
];

type LeaderboardSortKey =
  | 'fotmobRating'
  | 'goals'
  | 'assists'
  | 'xg'
  | 'gMinusXg'
  | 'xa'
  | 'prgPassesPer90'
  | 'scaPer90'
  | 'valueEfficiencyScore';

function PlayerHeaderCard({
  player,
  badgeColor,
  isDark,
}: {
  player: EnrichedPlayerBigData;
  badgeColor: string;
  isDark: boolean;
}) {
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';
  const surfaceCard = isDark
    ? 'bg-[#181B22] border-[#262A34] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';

  return (
    <div className={`rounded-2xl border p-5 ${surfaceCard}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-13 h-13 rounded-2xl flex flex-col items-center justify-center font-mono font-bold border shrink-0 overflow-hidden"
            style={{
              backgroundColor: `${badgeColor}18`,
              borderColor: `${badgeColor}45`,
              color: badgeColor,
            }}
          >
            {player.teamCrest ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.teamCrest}
                alt={player.club}
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <>
                <span className="text-[10px] opacity-75">NO.{player.shirtNumber}</span>
                <span className="text-sm">{player.name.slice(0, 2)}</span>
              </>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight">{player.name}</h3>
              <span className={`text-xs ${mutedText}`}>
                ({player.englishName}) · {player.age}세
              </span>
              {player.isLiveSynced && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  LIVE 실데이터
                </span>
              )}
            </div>
            <div className={`text-xs ${mutedText} mt-0.5`}>
              {player.club} ({player.league}) · {player.position} · {player.matchesPlayed}경기 ({player.minutesPlayed.toLocaleString()}분)
            </div>
            {/* AI Tactical Style Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {player.tacticalBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border"
                  style={{
                    backgroundColor: `${badgeColor}14`,
                    borderColor: `${badgeColor}35`,
                    color: badgeColor,
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FotMob Rating Box */}
        <div className="text-right shrink-0">
          <div
            className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono font-bold text-sm text-slate-950 bg-[#10B981] tabular-nums"
            title="시즌 빅데이터 종합 평점"
          >
            {player.fotmobRating.toFixed(1)}
          </div>
          <div className={`text-[11px] ${mutedText} mt-1`}>FotMob 평점</div>
        </div>
      </div>

      {/* Key Financial & Expected Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-500/15 text-xs">
        <div>
          <div className={mutedText}>시즌 공격포인트</div>
          <div className="font-mono font-semibold text-sm mt-0.5 tabular-nums">
            {player.goals}골 · {player.assists}도움
          </div>
        </div>
        <div>
          <div className={mutedText}>기대 지표 (xG / xA)</div>
          <div className="font-mono font-semibold text-sm mt-0.5 tabular-nums">
            {player.xg} xG · {player.xa} xA
          </div>
        </div>
        <div>
          <div className={mutedText}>결정력 마진 (G - xG)</div>
          <div
            className={`font-mono font-bold text-sm mt-0.5 tabular-nums ${
              player.gMinusXg >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
            }`}
          >
            {player.gMinusXg >= 0 ? `+${player.gMinusXg}` : player.gMinusXg}골
          </div>
        </div>
        <div>
          <div className={mutedText}>주급 / 가성비 지수</div>
          <div className="font-mono font-bold text-sm mt-0.5 text-[#10B981] tabular-nums">
            {player.valueEfficiencyScore}점{' '}
            <span className={`font-normal text-[11px] ${mutedText}`}>
              (£{Math.round(player.weeklyWagePounds / 1000)}K)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerComparisonTab({
  isDark,
}: PlayerComparisonTabProps) {
  const [rawPlayers, setRawPlayers] = useState<RawPlayerBigData[]>(
    INITIAL_BIGDATA_PLAYERS
  );
  const [selectedLeague, setSelectedLeague] = useState<LeagueFilter>('전체');
  const [selectedPosGroup, setSelectedPosGroup] = useState<'ALL' | PositionGroup>('ALL');
  const [minMinutes, setMinMinutes] = useState<number>(450);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [playerAId, setPlayerAId] = useState<string>('player-son');
  const [playerBId, setPlayerBId] = useState<string>('player-haaland');

  const [scatterPresetId, setScatterPresetId] = useState<ScatterPresetId>('finishing');
  const [sortKey, setSortKey] = useState<LeaderboardSortKey>('fotmobRating');

  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [syncStatusText, setSyncStatusText] = useState<string>(
    '유럽 5대 리그 빅데이터 준비 완료 (실시간 API 연동 중...)'
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync live player stats from /api/football (Football-Data.org /scorers + Supabase if configured)
  const syncLivePlayerStats = async (targetLeague: LeagueFilter) => {
    setIsSyncingLive(true);
    try {
      const leaguesToFetch: Exclude<LeagueFilter, '전체'>[] =
        targetLeague === '전체'
          ? ['프리미어리그', '라리가', '분데스리가', '세리에 A']
          : [targetLeague];

      let merged = [...rawPlayers];
      let liveCount = 0;
      let supabaseLoaded = false;

      for (const lg of leaguesToFetch) {
        const res = await fetch(`/api/football?league=${encodeURIComponent(lg)}`);
        if (!res.ok) continue;
        const data = await res.json();

        if (Array.isArray(data.supabasePlayers) && data.supabasePlayers.length > 0 && !supabaseLoaded) {
          const parsedSupa = parseUploadedPlayerDataset(
            JSON.stringify(data.supabasePlayers),
            'supabase.json'
          );
          if (parsedSupa.length > 0) {
            merged = parsedSupa;
            supabaseLoaded = true;
          }
        }

        if (Array.isArray(data.scorers) && data.scorers.length > 0) {
          merged = mergeLiveScorersIntoBigData(merged, data.scorers, lg);
          liveCount += data.scorers.length;
        }
      }

      setRawPlayers(merged);
      if (supabaseLoaded) {
        setSyncStatusText(
          `LIVE · Supabase DB (${merged.length}명) & 실시간 API 동기화 완료`
        );
      } else if (liveCount > 0) {
        setSyncStatusText(
          `LIVE · Football-Data.org 현재 시즌 실시간 리더보드 (${liveCount}명) 병합 완료`
        );
      } else {
        setSyncStatusText(
          '유럽 5대 리그 90분당 빅데이터 엔진 가동 중 (API 캐시 적용)'
        );
      }
    } catch {
      setSyncStatusText('오프라인/캐시 빅데이터 모드 가동 중');
    } finally {
      setIsSyncingLive(false);
    }
  };

  useEffect(() => {
    syncLivePlayerStats('전체');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle user uploading a Python-scraped JSON or CSV dataset
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = String(event.target?.result || '');
        const parsed = parseUploadedPlayerDataset(content, file.name);
        if (parsed.length > 0) {
          setRawPlayers(parsed);
          setPlayerAId(parsed[0].id);
          if (parsed[1]) setPlayerBId(parsed[1].id);
          setSyncStatusText(
            `커스텀 빅데이터 파일 적용됨: ${file.name} (총 ${parsed.length}명 로드 완료)`
          );
        } else {
          setSyncStatusText('파일에서 유효한 선수 스탯 행을 찾지 못했습니다.');
        }
      } catch {
        setSyncStatusText('파일 파싱 오류: 올바른 JSON 또는 CSV 형식이 아닙니다.');
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  // Enrich all players with per-90 stats and positional percentiles
  const allEnrichedPlayers = useMemo(
    () => enrichPlayerBigDataList(rawPlayers),
    [rawPlayers]
  );

  // Filtered players for explorer, scatter plot, and leaderboard
  const filteredPlayers = useMemo(() => {
    return allEnrichedPlayers
      .filter((p) => {
        if (selectedLeague !== '전체' && p.league !== selectedLeague) return false;
        if (selectedPosGroup !== 'ALL' && p.positionGroup !== selectedPosGroup)
          return false;
        if (p.minutesPlayed < minMinutes) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.englishName.toLowerCase().includes(q) ||
            p.club.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => Number(b[sortKey]) - Number(a[sortKey]));
  }, [
    allEnrichedPlayers,
    selectedLeague,
    selectedPosGroup,
    minMinutes,
    searchQuery,
    sortKey,
  ]);

  const playerA = useMemo(
    () =>
      allEnrichedPlayers.find((p) => p.id === playerAId) ||
      filteredPlayers[0] ||
      allEnrichedPlayers[0],
    [allEnrichedPlayers, filteredPlayers, playerAId]
  );

  const playerB = useMemo(
    () =>
      allEnrichedPlayers.find((p) => p.id === playerBId) ||
      filteredPlayers[1] ||
      allEnrichedPlayers[1] ||
      allEnrichedPlayers[0],
    [allEnrichedPlayers, filteredPlayers, playerBId]
  );

  const radarData = useMemo(() => {
    return playerA.radarMetrics.map((metricA, idx) => {
      const metricB = playerB.radarMetrics[idx];
      return {
        axis: metricA.axis,
        [playerA.name]: metricA.percentile,
        [playerB.name]: metricB?.percentile ?? 50,
        per90A: `${metricA.per90Value} ${metricA.unit}`,
        per90B: metricB ? `${metricB.per90Value} ${metricB.unit}` : '-',
      };
    });
  }, [playerA, playerB]);

  const activeScatterPreset = useMemo(
    () =>
      SCATTER_PRESETS.find((p) => p.id === scatterPresetId) ||
      SCATTER_PRESETS[0],
    [scatterPresetId]
  );

  const scatterData = useMemo(() => {
    const source = filteredPlayers.length >= 3 ? filteredPlayers : allEnrichedPlayers;
    return source.map((p) => ({
      id: p.id,
      name: p.name,
      club: p.club,
      position: p.position,
      x: Number(p[activeScatterPreset.xKey] ?? 0),
      y: Number(p[activeScatterPreset.yKey] ?? 0),
      isPlayerA: p.id === playerA.id,
      isPlayerB: p.id === playerB.id,
    }));
  }, [filteredPlayers, allEnrichedPlayers, activeScatterPreset, playerA.id, playerB.id]);

  const scatterAverages = useMemo(() => {
    if (scatterData.length === 0) return { avgX: 0, avgY: 0 };
    const sumX = scatterData.reduce((acc, d) => acc + d.x, 0);
    const sumY = scatterData.reduce((acc, d) => acc + d.y, 0);
    return {
      avgX: Number((sumX / scatterData.length).toFixed(2)),
      avgY: Number((sumY / scatterData.length).toFixed(2)),
    };
  }, [scatterData]);

  const handleSwapPlayers = () => {
    setPlayerAId(playerB.id);
    setPlayerBId(playerA.id);
  };

  const surfaceCard = isDark
    ? 'bg-[#181B22] border-[#262A34] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  const categories = [
    {
      key: 'attack' as const,
      title: '공격 지표 (Attack)',
      icon: Activity,
    },
    {
      key: 'possession' as const,
      title: '패스 및 빌드업 (Possession)',
      icon: Award,
    },
    {
      key: 'defense' as const,
      title: '수비 및 압박 기여 (Defense)',
      icon: Shield,
    },
    {
      key: 'financial' as const,
      title: '재정 효율 (주급 대비 산출량)',
      icon: Coins,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Live Data Pipeline & Direct File Upload Status Bar */}
      <div
        className={`rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${surfaceCard}`}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] shrink-0">
            <Database className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#10B981]">
              <span>실시간 선수 빅데이터 파이프라인 (API + Supabase + FBref 파일)</span>
            </div>
            <p className={`text-xs ${mutedText} mt-0.5`}>{syncStatusText}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#0F1115] border-[#262A34] text-slate-200 hover:border-[#10B981]'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>빅데이터 파일 업로드 (.json / .csv)</span>
          </button>

          <button
            type="button"
            onClick={() => syncLivePlayerStats(selectedLeague)}
            disabled={isSyncingLive}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#10B981] text-slate-950 hover:bg-[#10B981]/90 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`}
            />
            <span>{isSyncingLive ? '동기화 중...' : '실시간 시즌 기록 동기화'}</span>
          </button>
        </div>
      </div>

      {/* 2. Global Big Data Filter & Player Selector Bar */}
      <div className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${surfaceCard}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-500/15 pb-4">
          {/* League Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {LEAGUE_FILTERS.map((lg) => {
              const active = selectedLeague === lg;
              return (
                <button
                  key={lg}
                  type="button"
                  onClick={() => setSelectedLeague(lg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#10B981] text-slate-950 font-bold'
                      : isDark
                      ? 'bg-[#0F1115] text-slate-400 hover:text-slate-200 border border-[#262A34]'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lg}
                </button>
              );
            })}
          </div>

          {/* Position Group & Min Minutes & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-xl p-1 border border-slate-500/20 text-xs">
              {(
                [
                  { id: 'ALL', label: '전체 포지션' },
                  { id: 'FW', label: '공격수(FW)' },
                  { id: 'MF', label: '미드필더(MF)' },
                  { id: 'DF', label: '수비수(DF)' },
                ] as const
              ).map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setSelectedPosGroup(pos.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    selectedPosGroup === pos.id
                      ? 'bg-[#38BDF8] text-slate-950 font-bold'
                      : mutedText
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border border-slate-500/20">
              <Filter className="w-3.5 h-3.5 text-[#10B981]" />
              <span className={mutedText}>최소 출전:</span>
              <input
                type="range"
                min={90}
                max={1800}
                step={90}
                value={minMinutes}
                onChange={(e) => setMinMinutes(Number(e.target.value))}
                className="w-20 accent-[#10B981] cursor-pointer"
              />
              <span className="font-mono font-bold tabular-nums">{minMinutes}분+</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="선수명·구단 검색..."
                className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border outline-none ${
                  isDark
                    ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#10B981]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 1v1 Player Selectors */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label
              htmlFor="select-player-a"
              className={`block text-xs font-medium ${mutedText}`}
            >
              비교 선수 A (초록색 폴리곤 · #10B981)
            </label>
            <select
              id="select-player-a"
              value={playerA.id}
              onChange={(e) => setPlayerAId(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold border outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#10B981]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]'
              }`}
            >
              {allEnrichedPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.club} · {p.position} · {p.goals}골 {p.assists}도움 · 평점 {p.fotmobRating})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center md:pt-5">
            <button
              type="button"
              onClick={handleSwapPlayers}
              aria-label="두 선수 위치 맞바꾸기"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#0F1115] border-[#262A34] text-slate-200 hover:border-[#10B981]'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#10B981]" />
              선수 교체
            </button>
          </div>

          <div className="flex-1 space-y-1">
            <label
              htmlFor="select-player-b"
              className={`block text-xs font-medium ${mutedText}`}
            >
              비교 선수 B (스카이 블루 폴리곤 · #38BDF8)
            </label>
            <select
              id="select-player-b"
              value={playerB.id}
              onChange={(e) => setPlayerBId(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold border outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#38BDF8]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#38BDF8]'
              }`}
            >
              {allEnrichedPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.club} · {p.position} · {p.goals}골 {p.assists}도움 · 평점 {p.fotmobRating})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. FotMob-Style Player Header Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlayerHeaderCard
          player={playerA}
          badgeColor="#10B981"
          isDark={isDark}
        />
        <PlayerHeaderCard
          player={playerB}
          badgeColor="#38BDF8"
          isDark={isDark}
        />
      </div>

      {/* 4. Radar Chart & 6-Axis Per 90 Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 ${surfaceCard}`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold">
                90분당 핵심 6대 지표 백분위 레이더 (상위 %)
              </h3>
              <p className={`text-xs ${mutedText} mt-0.5`}>
                유럽 5대 리그 동 포지션 선수 대비 백분위(0~99%) 분포
              </p>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="48%"
                outerRadius="64%"
                margin={{ top: 14, right: 28, bottom: 14, left: 28 }}
                data={radarData}
              >
                <PolarGrid stroke={isDark ? '#262A34' : '#E2E8F0'} />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{
                    fill: isDark ? '#CBD5E1' : '#334155',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{
                    fill: isDark ? '#64748B' : '#94A3B8',
                    fontSize: 10,
                  }}
                />
                <Radar
                  name={playerA.name}
                  dataKey={playerA.name}
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fill="#10B981"
                  fillOpacity={0.28}
                />
                <Radar
                  name={playerB.name}
                  dataKey={playerB.name}
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fill="#38BDF8"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F1115' : '#FFFFFF',
                    borderColor: isDark ? '#262A34' : '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => {
                    const num = Number(value ?? 0);
                    return [`상위 ${100 - num}% (백분위 ${num})`, ''];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6 Core Axes Per-90 Table */}
        <div
          className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 flex flex-col justify-between ${surfaceCard}`}
        >
          <div>
            <h3 className="text-base font-bold">
              6대 핵심 축 90분당 실제 기록 및 백분위 대조
            </h3>
            <p className={`text-xs ${mutedText} mt-0.5 mb-4`}>
              단순 누적 스탯이 아닌 90분 환산(Per 90) 세부 데이터 비교
            </p>

            <div className="divide-y divide-slate-500/15">
              {playerA.radarMetrics.map((mA, idx) => {
                const mB = playerB.radarMetrics[idx];
                const aWins = mA.percentile >= (mB?.percentile ?? 0);
                return (
                  <div
                    key={mA.axis}
                    className="py-3 grid grid-cols-12 items-center gap-2 text-xs"
                  >
                    <div className="col-span-4 font-mono tabular-nums">
                      <span
                        className={`font-bold text-sm ${
                          aWins ? 'text-[#10B981]' : ''
                        }`}
                      >
                        {mA.per90Value}
                      </span>{' '}
                      <span className={mutedText}>({mA.percentile}%)</span>
                    </div>
                    <div className="col-span-4 text-center font-semibold">
                      {mA.axis}
                    </div>
                    <div className="col-span-4 text-right font-mono tabular-nums">
                      <span className={mutedText}>({mB?.percentile}%)</span>{' '}
                      <span
                        className={`font-bold text-sm ${
                          !aWins ? 'text-[#38BDF8]' : ''
                        }`}
                      >
                        {mB?.per90Value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t border-slate-500/15 flex items-center justify-between text-xs ${mutedText}`}
          >
            <span>가성비 지수 = (공격·빌드업·수비 백분위 가중합) ÷ 주급 지수</span>
            <span className="font-mono font-semibold text-[#10B981] tabular-nums">
              {playerA.valueEfficiencyScore >= playerB.valueEfficiencyScore
                ? `${playerA.name} 가성비 +${playerA.valueEfficiencyScore - playerB.valueEfficiencyScore}점 우위`
                : `${playerB.name} 가성비 +${playerB.valueEfficiencyScore - playerA.valueEfficiencyScore}점 우위`}
            </span>
          </div>
        </div>
      </div>

      {/* 5. NEW: 2D 4-Quadrant Big Data Scatter Plot Explorer */}
      <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceCard}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-base font-bold">
                빅데이터 4분면 산점도 분석기 (2D Quadrant Scatter Explorer)
              </h3>
            </div>
            <p className={`text-xs ${mutedText} mt-0.5`}>
              {activeScatterPreset.quadrantNote} · 점선(---)은 필터링된 선수단 평균 기준선입니다.
            </p>
          </div>

          <select
            value={scatterPresetId}
            onChange={(e) => setScatterPresetId(e.target.value as ScatterPresetId)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold border outline-none cursor-pointer ${
              isDark
                ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#10B981]'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]'
            }`}
          >
            {SCATTER_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 28, bottom: 18, left: 12 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#262A34' : '#E2E8F0'}
              />
              <XAxis
                type="number"
                dataKey="x"
                name={activeScatterPreset.xLabel}
                unit={activeScatterPreset.xUnit}
                tick={{ fill: isDark ? '#94A3B8' : '#475569', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={activeScatterPreset.yLabel}
                unit={activeScatterPreset.yUnit}
                tick={{ fill: isDark ? '#94A3B8' : '#475569', fontSize: 11 }}
              />
              <ReferenceLine
                x={scatterAverages.avgX}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                label={{
                  value: `평균 ${scatterAverages.avgX}`,
                  fill: '#F59E0B',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <ReferenceLine
                y={scatterAverages.avgY}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                label={{
                  value: `평균 ${scatterAverages.avgY}`,
                  fill: '#F59E0B',
                  fontSize: 10,
                  position: 'insideRight',
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const pt = payload[0].payload;
                  return (
                    <div
                      className={`rounded-xl border p-3 text-xs shadow-lg ${
                        isDark
                          ? 'bg-[#0F1115] border-[#262A34] text-slate-100'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#10B981]">
                        {pt.name}{' '}
                        <span className="font-normal text-xs text-slate-400">
                          ({pt.club})
                        </span>
                      </div>
                      <div className="mt-1 font-mono space-y-0.5">
                        <div>
                          {activeScatterPreset.xLabel}: <b>{pt.x}</b>
                        </div>
                        <div>
                          {activeScatterPreset.yLabel}: <b>{pt.y}</b>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter name="분석 대상 선수단" data={scatterData}>
                {scatterData.map((entry) => {
                  const fill = entry.isPlayerA
                    ? '#10B981'
                    : entry.isPlayerB
                    ? '#38BDF8'
                    : isDark
                    ? '#64748B'
                    : '#94A3B8';
                  return (
                    <Cell
                      key={entry.id}
                      fill={fill}
                      r={entry.isPlayerA || entry.isPlayerB ? 8 : 5}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-500/15">
          <div className="flex items-center gap-4 font-mono">
            <span className="text-[#10B981] font-bold">● {playerA.name} (선수 A)</span>
            <span className="text-[#38BDF8] font-bold">● {playerB.name} (선수 B)</span>
            <span className={mutedText}>● 필터링된 비교군 ({scatterData.length}명)</span>
          </div>
          <span className={mutedText}>
            X축: {activeScatterPreset.xLabel} · Y축: {activeScatterPreset.yLabel}
          </span>
        </div>
      </div>

      {/* 6. NEW: Interactive Big Data Leaderboard Table */}
      <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceCard}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">
              실시간 세부 지표 빅데이터 리더보드 ({filteredPlayers.length}명)
            </h3>
            <p className={`text-xs ${mutedText} mt-0.5`}>
              우측의 [A 선택] / [B 선택] 버튼을 누르면 즉시 상단 1:1 레이더 차트에 반영됩니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={mutedText}>정렬 기준:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as LeaderboardSortKey)}
              className={`rounded-xl px-3 py-1.5 font-semibold border outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#0F1115] border-[#262A34] text-slate-100'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="fotmobRating">FotMob 종합 평점순</option>
              <option value="goals">실제 득점(Goals)순</option>
              <option value="assists">실제 도움(Assists)순</option>
              <option value="xg">기대 득점(xG)순</option>
              <option value="gMinusXg">결정력 마진(G - xG)순</option>
              <option value="xa">기대 도움(xA)순</option>
              <option value="prgPassesPer90">90분당 전진 패스(PrgP/90)순</option>
              <option value="scaPer90">90분당 슛 창출(SCA/90)순</option>
              <option value="valueEfficiencyScore">주급 대비 가성비 지수순</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono tabular-nums">
            <thead
              className={`border-b ${
                isDark ? 'border-[#262A34] text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-2.5 px-2 font-sans">#</th>
                <th className="py-2.5 px-2 font-sans">선수 / 소속팀</th>
                <th className="py-2.5 px-2 text-center font-sans">포지션</th>
                <th className="py-2.5 px-2 text-center font-sans">출전(분)</th>
                <th className="py-2.5 px-2 text-center font-sans">득점</th>
                <th className="py-2.5 px-2 text-center font-sans">xG</th>
                <th className="py-2.5 px-2 text-center font-sans">G - xG</th>
                <th className="py-2.5 px-2 text-center font-sans">도움</th>
                <th className="py-2.5 px-2 text-center font-sans">xA</th>
                <th className="py-2.5 px-2 text-center font-sans">PrgP/90</th>
                <th className="py-2.5 px-2 text-center font-sans">SCA/90</th>
                <th className="py-2.5 px-2 text-center font-sans">평점</th>
                <th className="py-2.5 px-2 text-right font-sans">1:1 비교 선택</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/15">
              {filteredPlayers.slice(0, 20).map((p, idx) => {
                const isA = p.id === playerA.id;
                const isB = p.id === playerB.id;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isA
                        ? 'bg-[#10B981]/10'
                        : isB
                        ? 'bg-[#38BDF8]/10'
                        : isDark
                        ? 'hover:bg-slate-800/30'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <td className="py-2.5 px-2 text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-2 font-sans">
                      <div className="font-bold text-slate-200 dark:text-slate-100 flex items-center gap-1.5">
                        <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>
                          {p.name}
                        </span>
                        {p.isLiveSynced && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" title="실시간 동기화됨" />
                        )}
                      </div>
                      <div className={`text-[11px] ${mutedText}`}>
                        {p.club} · {p.league}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-500/15 text-[11px] font-semibold">
                        {p.positionGroup}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">{p.minutesPlayed}분</td>
                    <td className="py-2.5 px-2 text-center font-bold">{p.goals}</td>
                    <td className="py-2.5 px-2 text-center">{p.xg}</td>
                    <td
                      className={`py-2.5 px-2 text-center font-bold ${
                        p.gMinusXg >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}
                    >
                      {p.gMinusXg >= 0 ? `+${p.gMinusXg}` : p.gMinusXg}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold">{p.assists}</td>
                    <td className="py-2.5 px-2 text-center">{p.xa}</td>
                    <td className="py-2.5 px-2 text-center">{p.prgPassesPer90}</td>
                    <td className="py-2.5 px-2 text-center">{p.scaPer90}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-[#10B981]">
                      {p.fotmobRating.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-sans">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPlayerAId(p.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            isA
                              ? 'bg-[#10B981] text-slate-950'
                              : 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/30'
                          }`}
                        >
                          선수 A
                        </button>
                        <button
                          type="button"
                          onClick={() => setPlayerBId(p.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            isB
                              ? 'bg-[#38BDF8] text-slate-950'
                              : 'bg-[#38BDF8]/15 text-[#38BDF8] hover:bg-[#38BDF8]/30'
                          }`}
                        >
                          선수 B
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Percentile Bar Breakdown (Grouped into Attack, Possession, Defense, Financial Efficiency) */}
      <div className={`rounded-2xl border p-5 sm:p-6 space-y-6 ${surfaceCard}`}>
        <div>
          <h3 className="text-base font-bold">
            세부 카테고리별 백분위 비교 바 (0 ~ 100%)
          </h3>
          <p className={`text-xs ${mutedText} mt-0.5`}>
            공격, 패스/빌드업, 수비, 재정 효율 4개 영역의 FotMob 스타일 백분위 비교
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const listA = playerA.detailedPercentiles[cat.key];
            const listB = playerB.detailedPercentiles[cat.key];

            return (
              <div
                key={cat.key}
                className={`rounded-xl p-4 border ${
                  isDark
                    ? 'bg-[#0F1115]/60 border-[#262A34]'
                    : 'bg-slate-50 border-slate-200'
                } space-y-4`}
              >
                <div className="flex items-center justify-between border-b border-slate-500/15 pb-2.5">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#10B981]" />
                    {cat.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-[#10B981] font-semibold">
                      ● {playerA.name}
                    </span>
                    <span className="text-[#38BDF8] font-semibold">
                      ● {playerB.name}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {listA.map((itemA, idx) => {
                    const itemB = listB[idx] || itemA;
                    return (
                      <div key={itemA.metricName} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">{itemA.metricName}</span>
                          <span className={mutedText}>{itemA.description}</span>
                        </div>

                        {/* Player A Bar */}
                        <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
                          <span className="w-16 text-slate-400 truncate font-sans">
                            {playerA.name}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-slate-800/40 overflow-hidden">
                            <div
                              style={{ width: `${itemA.percentile}%` }}
                              className="h-full bg-[#10B981] rounded-full transition-all duration-200"
                            />
                          </div>
                          <span className="w-24 text-right font-semibold text-[#10B981]">
                            {itemA.per90Display} ({itemA.percentile}%)
                          </span>
                        </div>

                        {/* Player B Bar */}
                        <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
                          <span className="w-16 text-slate-400 truncate font-sans">
                            {playerB.name}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-slate-800/40 overflow-hidden">
                            <div
                              style={{ width: `${itemB.percentile}%` }}
                              className="h-full bg-[#38BDF8] rounded-full transition-all duration-200"
                            />
                          </div>
                          <span className="w-24 text-right font-semibold text-[#38BDF8]">
                            {itemB.per90Display} ({itemB.percentile}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
