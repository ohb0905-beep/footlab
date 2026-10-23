'use client';

import React, { useState, useMemo } from 'react';
import {
  CLUBS_FINANCIAL_DATA,
  type ClubFinancialProfile,
} from '@/lib/football-data';
import {
  evaluateWagesToTurnover,
  calculateOffPitchEfficiency,
} from '@/lib/analytics';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Building2,
  UserCheck,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Coins,
  Scale,
} from 'lucide-react';

interface ClubFinancialsTabProps {
  isDark: boolean;
}

const REVENUE_COLORS = ['#10B981', '#38BDF8', '#F59E0B'];

export default function ClubFinancialsTab({ isDark }: ClubFinancialsTabProps) {
  const [selectedClubId, setSelectedClubId] = useState<string>(
    CLUBS_FINANCIAL_DATA[0].id
  );

  const club: ClubFinancialProfile = useMemo(() => {
    return (
      CLUBS_FINANCIAL_DATA.find((c) => c.id === selectedClubId) ||
      CLUBS_FINANCIAL_DATA[0]
    );
  }, [selectedClubId]);

  const wageAssessment = useMemo(() => {
    return evaluateWagesToTurnover(club.wagesToTurnoverPercent);
  }, [club.wagesToTurnoverPercent]);

  const efficiency = useMemo(() => {
    const totalAnnualSquadCost =
      club.annualWageBillEok + club.psrAndAmortization.annualAmortizationEok;
    return calculateOffPitchEfficiency(
      totalAnnualSquadCost,
      club.seasonPerformance.points,
      club.seasonPerformance.goalsScored,
      club.seasonPerformance.leagueAvgCostPerPointEok,
      club.seasonPerformance.leagueAvgCostPerGoalEok
    );
  }, [club]);

  const revenueChartData = useMemo(() => {
    return [
      {
        name: '중계권료 (Broadcasting)',
        value: club.revenue.broadcastingEok,
        share: Math.round(
          (club.revenue.broadcastingEok / club.revenue.totalEok) * 100
        ),
      },
      {
        name: '상업 수익 (Commercial)',
        value: club.revenue.commercialEok,
        share: Math.round(
          (club.revenue.commercialEok / club.revenue.totalEok) * 100
        ),
      },
      {
        name: '매치데이 (Matchday)',
        value: club.revenue.matchdayEok,
        share: Math.round(
          (club.revenue.matchdayEok / club.revenue.totalEok) * 100
        ),
      },
    ];
  }, [club]);

  const surfaceCard = isDark
    ? 'bg-[#181B22] border-[#262A34] text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      {/* Club Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          role="tablist"
          aria-label="구단 선택"
        >
          {CLUBS_FINANCIAL_DATA.map((item) => {
            const isSelected = item.id === club.id;
            const isOver70 = item.wagesToTurnoverPercent > 70;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedClubId(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#10B981] text-slate-950 font-bold'
                    : isDark
                    ? 'bg-[#181B22] text-slate-300 border border-[#262A34] hover:border-slate-600'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{item.name}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isSelected
                      ? 'text-slate-900'
                      : isOver70
                      ? 'text-[#EF4444]'
                      : 'text-[#10B981]'
                  }`}
                >
                  {item.wagesToTurnoverPercent}%
                </span>
              </button>
            );
          })}
        </div>

        <div className={`text-xs font-mono tabular-nums ${mutedText}`}>
          {club.league} · 창단 {club.foundedYear}년 · {club.stadium}
        </div>
      </div>

      {/* Section 1: 구단 지배구조 카드 (Governance Summary - 3 Clean Hierarchy Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold tracking-tight">
            {club.name} 지배구조 및 의사결정 체계 (Governance Hierarchy)
          </h2>
          <span className={`text-xs ${mutedText}`}>
            소유 구조 분류: {club.governance.ownershipType}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 구단주 & 소유 형태 */}
          <div className={`rounded-2xl border p-5 ${surfaceCard}`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`font-medium flex items-center gap-1.5 ${mutedText}`}>
                <Building2 className="w-4 h-4 text-[#10B981]" />
                01. 구단주 및 소유 형태
              </span>
              <span className="font-semibold text-[#10B981]">
                {club.governance.ownershipType}
              </span>
            </div>
            <div className="text-base font-bold mt-1">
              {club.governance.ownerName}
            </div>
            <div className={`text-xs ${mutedText} mt-2 font-mono`}>
              지분 구조: {club.governance.ownershipShare}
            </div>
          </div>

          {/* Card 2: 최고경영자 (CEO) */}
          <div className={`rounded-2xl border p-5 ${surfaceCard}`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`font-medium flex items-center gap-1.5 ${mutedText}`}>
                <UserCheck className="w-4 h-4 text-[#38BDF8]" />
                02. 최고경영자 (CEO / 경영 총괄)
              </span>
              <span className={mutedText}>상업·재정 집행</span>
            </div>
            <div className="text-base font-bold mt-1">
              {club.governance.ceoName}
            </div>
            <div className={`text-xs ${mutedText} mt-2`}>
              구단 수익 다각화, 스폰서십 계약 및 재정 건전성(PSR) 관리 총괄
            </div>
          </div>

          {/* Card 3: 스포츠 디렉터 (단장) */}
          <div className={`rounded-2xl border p-5 ${surfaceCard}`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`font-medium flex items-center gap-1.5 ${mutedText}`}>
                <Briefcase className="w-4 h-4 text-[#F59E0B]" />
                03. 스포츠 디렉터 (단장)
              </span>
              <span className={mutedText}>선수단·전술 기획</span>
            </div>
            <div className="text-base font-bold mt-1">
              {club.governance.sportingDirectorName}
            </div>
            <div className={`text-xs ${mutedText} mt-2`}>
              이적시장 영입·방출, 주급 체계 설계 및 장기 스쿼드 연령 곡선 관리
            </div>
          </div>
        </div>

        <p className={`text-xs px-1 ${mutedText}`}>
          지배구조 핵심 요약: {club.governance.boardStructureNote}
        </p>
      </div>

      {/* Section 2: 재정 건전성 대시보드 (2x2 Clean Analytical Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card A: 수익 구조 (Revenue Breakdown Donut + Details) */}
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 ${surfaceCard}`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                수익 구조 (Revenue Breakdown)
              </h3>
              <p className={`text-xs ${mutedText} mt-0.5`}>
                중계권료 · 상업 수익 · 매치데이 매출 비중
              </p>
            </div>
            <div className="text-right font-mono tabular-nums">
              <div className="text-lg font-bold text-[#10B981]">
                {club.revenue.totalEok.toLocaleString()}억 원
              </div>
              <div className={`text-xs ${mutedText}`}>
                €{club.revenue.totalEuroM}M (전년비{' '}
                {club.revenue.yoyGrowthPercent >= 0 ? '+' : ''}
                {club.revenue.yoyGrowthPercent}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-5 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {revenueChartData.map((entry, idx) => (
                      <Cell
                        key={entry.name}
                        fill={REVENUE_COLORS[idx % REVENUE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0F1115' : '#FFFFFF',
                      borderColor: isDark ? '#262A34' : '#E2E8F0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${Number(val ?? 0).toLocaleString()}억 원`, '매출']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-7 space-y-3">
              {revenueChartData.map((item, idx) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm inline-block"
                        style={{ backgroundColor: REVENUE_COLORS[idx] }}
                      />
                      {item.name}
                    </span>
                    <span className="font-mono font-bold tabular-nums">
                      {item.value.toLocaleString()}억 원 ({item.share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800/40 overflow-hidden">
                    <div
                      style={{
                        width: `${item.share}%`,
                        backgroundColor: REVENUE_COLORS[idx],
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card B: 수익 대비 인건비 비율 (Wages-to-Turnover Ratio with 70% UEFA Threshold) */}
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 flex flex-col justify-between ${surfaceCard}`}>
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  {wageAssessment.isOverThreshold ? (
                    <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  )}
                  수익 대비 인건비 비율 (Wages-to-Turnover)
                </h3>
                <p className={`text-xs ${mutedText} mt-0.5`}>
                  UEFA 스쿼드 비용 규정 및 재정 지속가능성 핵심 지표 (안전 한계선 70%)
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                  wageAssessment.statusLevel === 'danger'
                    ? 'bg-[#EF4444]/15 text-[#EF4444]'
                    : wageAssessment.statusLevel === 'caution'
                    ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                    : 'bg-[#10B981]/15 text-[#10B981]'
                }`}
              >
                {wageAssessment.statusLabelKo}
              </span>
            </div>

            {/* Big Ratio Readout & 70% Threshold Gauge */}
            <div className="my-5">
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-mono text-3xl font-bold tabular-nums">
                  <span
                    className={
                      wageAssessment.isOverThreshold
                        ? 'text-[#EF4444]'
                        : wageAssessment.statusLevel === 'caution'
                        ? 'text-[#F59E0B]'
                        : 'text-[#10B981]'
                    }
                  >
                    {club.wagesToTurnoverPercent}%
                  </span>
                  <span className={`text-xs font-normal ml-2 ${mutedText}`}>
                    (연간 주급 총액 {club.annualWageBillEok.toLocaleString()}억 원 / 연 매출{' '}
                    {club.revenue.totalEok.toLocaleString()}억 원)
                  </span>
                </div>
                <div className="text-xs font-mono tabular-nums text-[#EF4444] font-semibold">
                  UEFA 70% 상한선
                </div>
              </div>

              {/* Gauge Bar with 70% Marker */}
              <div className="relative pt-2 pb-5">
                <div className="w-full h-4 rounded-full bg-slate-800/50 overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, club.wagesToTurnoverPercent)}%`,
                    }}
                    className={`h-full rounded-full transition-all duration-200 ${
                      wageAssessment.isOverThreshold
                        ? 'bg-[#EF4444]'
                        : wageAssessment.statusLevel === 'caution'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#10B981]'
                    }`}
                  />
                </div>

                {/* 70% Threshold Vertical Line */}
                <div
                  style={{ left: '70%' }}
                  className="absolute top-0 bottom-2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                >
                  <div className="w-0.5 h-6 bg-[#EF4444]" />
                  <span className="mt-1 text-[11px] font-mono font-bold text-[#EF4444] whitespace-nowrap">
                    ▲ 70% 권고 임계선
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`pt-3 border-t border-slate-500/15 flex items-center justify-between text-xs ${mutedText}`}
          >
            <span>70% 기준선 대비 편차</span>
            <span
              className={`font-mono font-bold tabular-nums ${
                wageAssessment.deltaFromThreshold > 0
                  ? 'text-[#EF4444]'
                  : 'text-[#10B981]'
              }`}
            >
              {wageAssessment.deltaFromThreshold > 0 ? '+' : ''}
              {wageAssessment.deltaFromThreshold}%p (
              {wageAssessment.deltaFromThreshold > 0
                ? '초과 위험 — 선수단 주급 감축 필요'
                : '안정권 유지'})
            </span>
          </div>
        </div>

        {/* Card C: PSR / FFP 규준 상태 및 이적료 감가상각 (Amortization) */}
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceCard}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#38BDF8]" />
                PSR / FFP 규준 상태 및 이적료 감가상각비
              </h3>
              <p className={`text-xs ${mutedText} mt-0.5`}>
                선수 이적료를 계약 기간(최대 5년)에 걸쳐 나누어 반영하는 회계상 연간 상각 비용
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                club.psrAndAmortization.psrStatus === '위험'
                  ? 'bg-[#EF4444]/15 text-[#EF4444]'
                  : club.psrAndAmortization.psrStatus === '주의'
                  ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                  : 'bg-[#10B981]/15 text-[#10B981]'
              }`}
            >
              PSR 상태: {club.psrAndAmortization.psrStatus}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-slate-500/15">
              <div className={`text-xs ${mutedText}`}>연간 이적료 감가상각비</div>
              <div className="font-mono text-lg font-bold mt-1 tabular-nums">
                {club.psrAndAmortization.annualAmortizationEok.toLocaleString()}억 원
              </div>
              <div className={`text-[11px] ${mutedText} mt-0.5`}>
                매출 대비{' '}
                {Math.round(
                  (club.psrAndAmortization.annualAmortizationEok /
                    club.revenue.totalEok) *
                    100
                )}
                %
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-500/15">
              <div className={`text-xs ${mutedText}`}>최근 3시즌 이적 순지출</div>
              <div className="font-mono text-lg font-bold mt-1 tabular-nums">
                {club.psrAndAmortization.netSpend3YrEok.toLocaleString()}억 원
              </div>
              <div className={`text-[11px] ${mutedText} mt-0.5`}>
                영입 총액 - 방출 총액
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-500/15">
              <div className={`text-xs ${mutedText}`}>PSR 여유 한도 (추정)</div>
              <div
                className={`font-mono text-lg font-bold mt-1 tabular-nums ${
                  club.psrAndAmortization.psrHeadroomEok < 0
                    ? 'text-[#EF4444]'
                    : club.psrAndAmortization.psrHeadroomEok < 500
                    ? 'text-[#F59E0B]'
                    : 'text-[#10B981]'
                }`}
              >
                {club.psrAndAmortization.psrHeadroomEok > 0 ? '+' : ''}
                {club.psrAndAmortization.psrHeadroomEok.toLocaleString()}억 원
              </div>
              <div className={`text-[11px] ${mutedText} mt-0.5`}>
                3년 손실 한도 기준
              </div>
            </div>
          </div>

          <p className={`text-xs leading-relaxed ${mutedText} pt-1`}>
            {club.psrAndAmortization.psrDescription}
          </p>
        </div>

        {/* Card D: 가성비 지표 (Off-Pitch Efficiency: Cost per Point & Cost per Goal + 3-Year Trend) */}
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 space-y-4 ${surfaceCard}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#F59E0B]" />
              피치 밖 재정 가성비 지표 (승점 1점당 · 1골당 지출 비용)
            </h3>
            <p className={`text-xs ${mutedText} mt-0.5`}>
              연간 총 스쿼드 유지비(주급 총액 + 이적료 상각비) 대비 리그 성적 효율
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-500/15 space-y-1.5">
              <div className={`text-xs ${mutedText}`}>
                승점 1점당 지출 비용 (리그 {club.seasonPerformance.points}점 기준)
              </div>
              <div className="flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-xl font-bold text-[#10B981]">
                  {efficiency.costPerPointEok}억 원
                </span>
                <span className={`text-xs ${mutedText}`}>
                  리그 평균 {club.seasonPerformance.leagueAvgCostPerPointEok}억 원
                </span>
              </div>
              <div className={`text-xs ${mutedText}`}>
                빅클럽 평균 대비{' '}
                <span
                  className={`font-mono font-semibold ${
                    efficiency.pointEfficiencyVsLeaguePercent > 35
                      ? 'text-[#EF4444]'
                      : 'text-[#10B981]'
                  }`}
                >
                  {efficiency.pointEfficiencyVsLeaguePercent > 0 ? '+' : ''}
                  {efficiency.pointEfficiencyVsLeaguePercent}%
                </span>{' '}
                지출
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-500/15 space-y-1.5">
              <div className={`text-xs ${mutedText}`}>
                1골당 스쿼드 지출 비용 (리그 {club.seasonPerformance.goalsScored}골 기준)
              </div>
              <div className="flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-xl font-bold text-[#38BDF8]">
                  {efficiency.costPerGoalEok}억 원
                </span>
                <span className={`text-xs ${mutedText}`}>
                  리그 평균 {club.seasonPerformance.leagueAvgCostPerGoalEok}억 원
                </span>
              </div>
              <div className={`text-xs ${mutedText}`}>
                빅클럽 평균 대비{' '}
                <span
                  className={`font-mono font-semibold ${
                    efficiency.goalEfficiencyVsLeaguePercent > 35
                      ? 'text-[#EF4444]'
                      : 'text-[#38BDF8]'
                  }`}
                >
                  {efficiency.goalEfficiencyVsLeaguePercent > 0 ? '+' : ''}
                  {efficiency.goalEfficiencyVsLeaguePercent}%
                </span>{' '}
                지출
              </div>
            </div>
          </div>

          {/* 3-Year Revenue vs Amortization Mini Chart */}
          <div className="h-36 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={club.threeYearHistory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#262A34' : '#E2E8F0'}
                />
                <XAxis
                  dataKey="season"
                  tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F1115' : '#FFFFFF',
                    borderColor: isDark ? '#262A34' : '#E2E8F0',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar
                  dataKey="revenueEok"
                  name="연 매출 (억 원)"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="amortizationEok"
                  name="이적료 상각비 (억 원)"
                  fill="#38BDF8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
