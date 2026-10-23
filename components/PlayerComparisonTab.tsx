'use client';

import React, { useState, useMemo } from 'react';
import { PLAYERS_DATA, type PlayerProfile } from '@/lib/football-data';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { ArrowLeftRight, Award, Coins, Activity, Shield } from 'lucide-react';

interface PlayerComparisonTabProps {
  isDark: boolean;
}

function PlayerHeaderCard({
  player,
  badgeColor,
  isDark,
}: {
  player: PlayerProfile;
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
            className="w-13 h-13 rounded-2xl flex flex-col items-center justify-center font-mono font-bold border shrink-0"
            style={{
              backgroundColor: `${badgeColor}18`,
              borderColor: `${badgeColor}45`,
              color: badgeColor,
            }}
          >
            <span className="text-[10px] opacity-75">NO.{player.shirtNumber}</span>
            <span className="text-sm">{player.name.slice(0, 2)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight">{player.name}</h3>
              <span className={`text-xs ${mutedText}`}>
                {player.age}세 · {player.nationality}
              </span>
            </div>
            <div className={`text-xs ${mutedText} mt-0.5`}>
              {player.club} · {player.position} · 출전 {player.minutesPlayed.toLocaleString()}분
            </div>
          </div>
        </div>

        {/* FotMob Rating Box */}
        <div className="text-right shrink-0">
          <div
            className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono font-bold text-sm text-slate-950 bg-[#10B981] tabular-nums"
            title="시즌 FotMob 평점"
          >
            {player.fotmobRating.toFixed(1)}
          </div>
          <div className={`text-[11px] ${mutedText} mt-1`}>FotMob 평점</div>
        </div>
      </div>

      {/* Key Financial & Output Strip */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-500/15 text-xs">
        <div>
          <div className={mutedText}>주급 (추정)</div>
          <div className="font-mono font-semibold text-sm mt-0.5 tabular-nums">
            {player.weeklyWageKrwText}
          </div>
        </div>
        <div>
          <div className={mutedText}>시즌 공격포인트</div>
          <div className="font-mono font-semibold text-sm mt-0.5 tabular-nums">
            {player.goals}골 · {player.assists}도움
          </div>
        </div>
        <div>
          <div className={mutedText}>가성비 지수 (효율)</div>
          <div className="font-mono font-bold text-sm mt-0.5 text-[#10B981] tabular-nums">
            {player.valueEfficiencyScore}점 / 100
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerComparisonTab({
  isDark,
}: PlayerComparisonTabProps) {
  const [playerAId, setPlayerAId] = useState<string>(PLAYERS_DATA[0].id); // 손흥민
  const [playerBId, setPlayerBId] = useState<string>(PLAYERS_DATA[1].id); // 엘링 홀란드

  const playerA = useMemo(
    () => PLAYERS_DATA.find((p) => p.id === playerAId) || PLAYERS_DATA[0],
    [playerAId]
  );
  const playerB = useMemo(
    () => PLAYERS_DATA.find((p) => p.id === playerBId) || PLAYERS_DATA[1],
    [playerBId]
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

  const handleSwapPlayers = () => {
    setPlayerAId(playerBId);
    setPlayerBId(playerAId);
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
      {/* Player Selector Bar */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${surfaceCard}`}
      >
        <div className="flex-1 space-y-1">
          <label
            htmlFor="select-player-a"
            className={`block text-xs font-medium ${mutedText}`}
          >
            비교 선수 A (초록색 차트)
          </label>
          <select
            id="select-player-a"
            value={playerAId}
            onChange={(e) => setPlayerAId(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold border outline-none cursor-pointer ${
              isDark
                ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#10B981]'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#10B981]'
            }`}
          >
            {PLAYERS_DATA.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.club} · {p.position} · 평점 {p.fotmobRating})
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
            비교 선수 B (스카이 블루 차트)
          </label>
          <select
            id="select-player-b"
            value={playerBId}
            onChange={(e) => setPlayerBId(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold border outline-none cursor-pointer ${
              isDark
                ? 'bg-[#0F1115] border-[#262A34] text-slate-100 focus:border-[#38BDF8]'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#38BDF8]'
            }`}
          >
            {PLAYERS_DATA.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.club} · {p.position} · 평점 {p.fotmobRating})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FotMob-Style Player Header Cards */}
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

      {/* Radar Chart & 6-Axis Per 90 Summary Table */}
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
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 flex flex-col justify-between ${surfaceCard}`}>
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

      {/* Percentile Bar Breakdown (Grouped into Attack, Possession, Defense, Financial Efficiency) */}
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
