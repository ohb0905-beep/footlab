'use client';

import React, { useState, useMemo } from 'react';
import {
  HISTORICAL_TEAMS_DATA,
  type HistoricalTeamProfile,
} from '@/lib/football-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { History, Trophy, ArrowLeftRight, Info, Sparkles } from 'lucide-react';

interface HistoricalEraTabProps {
  isDark: boolean;
}

function EraTeamSummaryCard({
  team,
  accentColor,
  isDark,
}: {
  team: HistoricalTeamProfile;
  accentColor: string;
  isDark: boolean;
}) {
  const surfaceCard = isDark
    ? 'bg-[#181B22] border-[#262A34] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceCard}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold" style={{ color: accentColor }}>
            {team.season} · 감독: {team.manager}
          </div>
          <h3 className="text-lg font-bold tracking-tight mt-0.5">
            {team.eraLabel}
          </h3>
          <div className={`text-xs ${mutedText} mt-0.5`}>
            주요 우승: {team.honors} · 전술 포메이션: {team.formation}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div
            className="inline-flex items-center px-3 py-1.5 rounded-xl font-mono font-bold text-sm tabular-nums"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}
          >
            +{team.zScores.overallDominanceIndex.toFixed(2)}σ
          </div>
          <div className={`text-[11px] ${mutedText} mt-1`}>
            시대 압도성 지수
          </div>
        </div>
      </div>

      <p className={`text-xs leading-relaxed ${mutedText}`}>
        {team.tacticalSummary}
      </p>

      {/* 4 Core Era Stats Grid (Raw Value + Era Z-Score) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-500/15 text-xs">
        <div className="p-2.5 rounded-xl border border-slate-500/15">
          <div className={mutedText}>경기당 득점</div>
          <div className="font-mono font-bold text-sm mt-0.5 tabular-nums">
            {team.rawMetrics.goalsPerGame}골
          </div>
          <div
            className="font-mono text-[11px] font-semibold tabular-nums"
            style={{ color: accentColor }}
          >
            +{team.zScores.goalsPerGameZ}σ (평균 {team.eraContext.leagueAvgGoalsPerGame})
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-slate-500/15">
          <div className={mutedText}>평균 점유율</div>
          <div className="font-mono font-bold text-sm mt-0.5 tabular-nums">
            {team.rawMetrics.avgPossession}%
          </div>
          <div
            className="font-mono text-[11px] font-semibold tabular-nums"
            style={{ color: accentColor }}
          >
            +{team.zScores.possessionZ}σ (표준편차 {team.eraContext.leagueStdPossession}%)
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-slate-500/15">
          <div className={mutedText}>기대 득점 우위</div>
          <div className="font-mono font-bold text-sm mt-0.5 tabular-nums">
            +{team.rawMetrics.xgDiffPerGame} xG
          </div>
          <div
            className="font-mono text-[11px] font-semibold tabular-nums"
            style={{ color: accentColor }}
          >
            +{team.zScores.xgDominanceZ}σ 우위
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-slate-500/15">
          <div className={mutedText}>수비 안정성 (실점)</div>
          <div className="font-mono font-bold text-sm mt-0.5 tabular-nums">
            {team.rawMetrics.goalsConcededPerGame}실점
          </div>
          <div
            className="font-mono text-[11px] font-semibold tabular-nums"
            style={{ color: accentColor }}
          >
            +{team.zScores.defensiveStabilityZ}σ (평균 {team.eraContext.leagueAvgGoalsConceded})
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoricalEraTab({ isDark }: HistoricalEraTabProps) {
  const [teamAId, setTeamAId] = useState<string>(HISTORICAL_TEAMS_DATA[1].id); // 2007-08 맨유
  const [teamBId, setTeamBId] = useState<string>(HISTORICAL_TEAMS_DATA[0].id); // 2022-23 맨시티
  const [viewMode, setViewMode] = useState<'zscore' | 'raw'>('zscore');

  const teamA = useMemo(
    () =>
      HISTORICAL_TEAMS_DATA.find((t) => t.id === teamAId) ||
      HISTORICAL_TEAMS_DATA[1],
    [teamAId]
  );
  const teamB = useMemo(
    () =>
      HISTORICAL_TEAMS_DATA.find((t) => t.id === teamBId) ||
      HISTORICAL_TEAMS_DATA[0],
    [teamBId]
  );

  const chartData = useMemo(() => {
    if (viewMode === 'zscore') {
      return [
        {
          metric: '경기당 득점',
          [teamA.eraLabel]: teamA.zScores.goalsPerGameZ,
          [teamB.eraLabel]: teamB.zScores.goalsPerGameZ,
        },
        {
          metric: '평균 점유율',
          [teamA.eraLabel]: teamA.zScores.possessionZ,
          [teamB.eraLabel]: teamB.zScores.possessionZ,
        },
        {
          metric: '기대 득점 우위',
          [teamA.eraLabel]: teamA.zScores.xgDominanceZ,
          [teamB.eraLabel]: teamB.zScores.xgDominanceZ,
        },
        {
          metric: '수비 안정성',
          [teamA.eraLabel]: teamA.zScores.defensiveStabilityZ,
          [teamB.eraLabel]: teamB.zScores.defensiveStabilityZ,
        },
      ];
    }
    return [
      {
        metric: '경기당 득점 (골)',
        [teamA.eraLabel]: teamA.rawMetrics.goalsPerGame,
        [teamB.eraLabel]: teamB.rawMetrics.goalsPerGame,
      },
      {
        metric: '점유율 (÷25 환산)',
        [teamA.eraLabel]: Number((teamA.rawMetrics.avgPossession / 25).toFixed(2)),
        [teamB.eraLabel]: Number((teamB.rawMetrics.avgPossession / 25).toFixed(2)),
      },
      {
        metric: '기대 득점 우위 (xG)',
        [teamA.eraLabel]: teamA.rawMetrics.xgDiffPerGame,
        [teamB.eraLabel]: teamB.rawMetrics.xgDiffPerGame,
      },
      {
        metric: '경기당 실점 (낮을수록 우수)',
        [teamA.eraLabel]: teamA.rawMetrics.goalsConcededPerGame,
        [teamB.eraLabel]: teamB.rawMetrics.goalsConcededPerGame,
      },
    ];
  }, [teamA, teamB, viewMode]);

  const surfaceCard = isDark
    ? 'bg-[#181B22] border-[#262A34] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      {/* Z-Score Explanation Banner */}
      <div className={`rounded-2xl border p-4 sm:p-5 ${surfaceCard}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-[#10B981]" />
              시대 보정 Z-스코어 비교 (당시 리그 평균 대비 압도성 지수)
            </h2>
            <p className={`text-xs leading-relaxed ${mutedText}`}>
              2000년대 초반과 2020년대 현대 축구는 평균 점유율, 압박 강도, 경기당 득점 환경이 다릅니다.{' '}
              <strong className="text-[#10B981]">
                Z-스코어 = (팀 기록 - 당시 리그 평균) ÷ 당시 리그 표준편차(σ)
              </strong>
              로 정규화하여 각 팀이 당대 리그를 얼마나 압도했는지 공정하게 비교합니다.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('zscore')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'zscore'
                  ? 'bg-[#10B981] text-slate-950 font-bold'
                  : isDark
                  ? 'bg-[#0F1115] text-slate-300 border border-[#262A34]'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              시대 보정 Z-스코어 (σ)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-[#10B981] text-slate-950 font-bold'
                  : isDark
                  ? 'bg-[#0F1115] text-slate-300 border border-[#262A34]'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              당시 실제 기록 (Raw)
            </button>
          </div>
        </div>
      </div>

      {/* Team Selectors */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${surfaceCard}`}
      >
        <div className="flex-1 space-y-1">
          <label
            htmlFor="era-select-a"
            className={`block text-xs font-medium ${mutedText}`}
          >
            역대 비교 팀 A (피치 그린)
          </label>
          <select
            id="era-select-a"
            value={teamAId}
            onChange={(e) => setTeamAId(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold border outline-none cursor-pointer ${
              isDark
                ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#10B981]'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]'
            }`}
          >
            {HISTORICAL_TEAMS_DATA.map((t) => (
              <option key={t.id} value={t.id}>
                {t.eraLabel} · 승점 {t.points}점 (압도성 +{t.zScores.overallDominanceIndex}σ)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center md:pt-5">
          <button
            type="button"
            onClick={() => {
              setTeamAId(teamBId);
              setTeamBId(teamAId);
            }}
            aria-label="시대 비교 팀 맞바꾸기"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#0F1115] border-[#262A34] text-slate-200 hover:border-[#10B981]'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#10B981]" />
            시대 팀 교체
          </button>
        </div>

        <div className="flex-1 space-y-1">
          <label
            htmlFor="era-select-b"
            className={`block text-xs font-medium ${mutedText}`}
          >
            역대 비교 팀 B (스카이 블루)
          </label>
          <select
            id="era-select-b"
            value={teamBId}
            onChange={(e) => setTeamBId(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold border outline-none cursor-pointer ${
              isDark
                ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#38BDF8]'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#38BDF8]'
            }`}
          >
            {HISTORICAL_TEAMS_DATA.map((t) => (
              <option key={t.id} value={t.id}>
                {t.eraLabel} · 승점 {t.points}점 (압도성 +{t.zScores.overallDominanceIndex}σ)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Era Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EraTeamSummaryCard
          team={teamA}
          accentColor="#10B981"
          isDark={isDark}
        />
        <EraTeamSummaryCard
          team={teamB}
          accentColor="#38BDF8"
          isDark={isDark}
        />
      </div>

      {/* Z-Score Normalized Comparison Bar Chart */}
      <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceCard}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#10B981]" />
              {viewMode === 'zscore'
                ? '4대 핵심 지표 시대 보정 Z-스코어 비교 차트 (단위: 표준편차 σ)'
                : '4대 핵심 지표 당시 실제 기록 비교 차트'}
            </h3>
            <p className={`text-xs ${mutedText} mt-0.5`}>
              {viewMode === 'zscore'
                ? '+2.0σ 이상은 당대 리그 상위 2.3% 이내의 역사적 지배력을 의미합니다'
                : '시대 보정 전 각 시즌에 기록된 원시(Raw) 데이터 비교'}
            </p>
          </div>
          <div className="font-mono text-xs tabular-nums text-[#10B981] font-semibold">
            종합 압도성 우위:{' '}
            {teamA.zScores.overallDominanceIndex >=
            teamB.zScores.overallDominanceIndex
              ? `${teamA.eraLabel} (+${(
                  teamA.zScores.overallDominanceIndex -
                  teamB.zScores.overallDominanceIndex
                ).toFixed(2)}σ)`
              : `${teamB.eraLabel} (+${(
                  teamB.zScores.overallDominanceIndex -
                  teamA.zScores.overallDominanceIndex
                ).toFixed(2)}σ)`}
          </div>
        </div>

        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 20, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#262A34' : '#E2E8F0'}
              />
              <XAxis
                dataKey="metric"
                tick={{
                  fill: isDark ? '#CBD5E1' : '#334155',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={[0, 3.6]}
                tick={{
                  fill: isDark ? '#94A3B8' : '#64748B',
                  fontSize: 11,
                }}
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
                  return viewMode === 'zscore' ? [`+${num}σ (시대 평균 대비)`, ''] : [num, ''];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {viewMode === 'zscore' && (
                <ReferenceLine
                  y={2.0}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: '역사적 지배력 기준선 (+2.0σ)',
                    fill: '#F59E0B',
                    fontSize: 11,
                    position: 'insideTopRight',
                  }}
                />
              )}
              <Bar
                dataKey={teamA.eraLabel}
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                dataKey={teamB.eraLabel}
                fill="#38BDF8"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
