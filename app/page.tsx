'use client';

import React, { useState } from 'react';
import MatchCenterTab from '@/components/MatchCenterTab';
import PlayerComparisonTab from '@/components/PlayerComparisonTab';
import ClubFinancialsTab from '@/components/ClubFinancialsTab';
import HistoricalEraTab from '@/components/HistoricalEraTab';
import { Sun, Moon } from 'lucide-react';

type ActiveTabId = 'match-center' | 'player-radar' | 'club-finance' | 'historical-era';

interface NavTabItem {
  id: ActiveTabId;
  shortLabel: string;
  fullTitle: string;
  subtitle: string;
}

const NAV_TABS: NavTabItem[] = [
  {
    id: 'match-center',
    shortLabel: '매치 센터 & 승률 예측',
    fullTitle: '매치 센터 & AI 승률 예측 (Match Center & Win Probability)',
    subtitle:
      '포아송 분포 및 몬테카를로 10,000회 시뮬레이션 기반 실시간 승률·예상 스코어·압박 강도(PPDA) 비교',
  },
  {
    id: 'player-radar',
    shortLabel: '선수 비교 & 세부 스탯',
    fullTitle: '선수 비교 & 90분당 세부 스탯 레이더 (Player Micro-Stats)',
    subtitle:
      '유럽 5대 리그 포지션별 상위 백분위(%) 6축 레이더와 주급 대비 가성비 지수 정밀 대조',
  },
  {
    id: 'club-finance',
    shortLabel: '구단 재정 & 지배구조',
    fullTitle: '구단 재정 건전성 & 지배구조 (Club Structure & Financials)',
    subtitle:
      '구단주 소유 형태, 수익 대비 주급 비율(UEFA 70% 권고선), 이적료 감가상각비 및 PSR 여유 한도 분석',
  },
  {
    id: 'historical-era',
    shortLabel: '역대 시즌 & 시대 비교',
    fullTitle: '역대 시즌 아카이브 & 시대 보정 비교 (Cross-Era Z-Score)',
    subtitle:
      '당대 리그 평균과 표준편차(σ)를 기준으로 서로 다른 시대의 전설적인 우승 팀 압도성 비교',
  },
];

export default function FootballAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTabId>('match-center');
  const [isDark, setIsDark] = useState<boolean>(true);

  const currentTabMeta =
    NAV_TABS.find((t) => t.id === activeTab) || NAV_TABS[0];

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#0F1115] text-slate-100'
          : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Bar Contract: Zone 1 (Single-line Brand Wordmark) — Zone 2 (4 Single-line Nav Links) — Zone 3 (1 Primary Action) */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#0F1115]/90 border-[#262A34]'
            : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('match-center');
            }}
            className="text-lg font-bold tracking-tight whitespace-nowrap shrink-0 text-[#10B981]"
          >
            풋볼랩 코리아
          </a>

          {/* Zone 2: 4 Clean Single-Line Navigation Links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium"
            aria-label="주요 분석 메뉴"
          >
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-[#10B981] text-[#10B981] font-bold'
                      : isDark
                      ? 'border-transparent text-slate-400 hover:text-slate-100'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.shortLabel}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Theme Toggle Button) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-[#181B22] border-[#262A34] text-slate-200 hover:border-[#10B981]'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>라이트 모드</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>다크 모드</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher Row (Only visible on < md screens) */}
        <div
          className={`md:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t no-scrollbar ${
            isDark ? 'border-[#262A34]' : 'border-slate-200'
          }`}
          role="tablist"
          aria-label="모바일 탭 네비게이션"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#10B981] text-slate-950 font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.shortLabel}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Contextual Section Header & Quick Summary Strip */}
        <section
          className={`rounded-2xl border p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
            isDark
              ? 'bg-[#181B22] border-[#262A34]'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold">
              <span>유럽 5대 리그 통합 온·오프피치 빅데이터</span>
              <span aria-hidden="true">·</span>
              <span>2026-27 실시간 시즌 연동</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {currentTabMeta.fullTitle}
            </h1>
            <p
              className={`text-xs sm:text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {currentTabMeta.subtitle}
            </p>
          </div>

          {/* 3 Clean Key Reference Indicators */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-500/15 shrink-0 font-mono tabular-nums">
            <div>
              <div
                className={`text-[11px] font-sans ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                승률 시뮬레이션
              </div>
              <div className="text-sm sm:text-base font-bold text-[#10B981]">
                포아송 + 10,000회
              </div>
            </div>
            <div>
              <div
                className={`text-[11px] font-sans ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                UEFA 인건비 권고선
              </div>
              <div className="text-sm sm:text-base font-bold text-[#F59E0B]">
                매출 대비 70%
              </div>
            </div>
            <div>
              <div
                className={`text-[11px] font-sans ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                시대 보정 기준
              </div>
              <div className="text-sm sm:text-base font-bold text-[#38BDF8]">
                표준편차 Z-스코어
              </div>
            </div>
          </div>
        </section>

        {/* Active Tab View */}
        {activeTab === 'match-center' && <MatchCenterTab isDark={isDark} />}
        {activeTab === 'player-radar' && <PlayerComparisonTab isDark={isDark} />}
        {activeTab === 'club-finance' && <ClubFinancialsTab isDark={isDark} />}
        {activeTab === 'historical-era' && <HistoricalEraTab isDark={isDark} />}
      </main>

      {/* Clean Minimal Footer */}
      <footer
        className={`mt-12 border-t py-6 text-xs ${
          isDark
            ? 'border-[#262A34] text-slate-500'
            : 'border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            풋볼랩 코리아 (FootballLab KR) · 유럽 축구 전술 및 재정 빅데이터 분석 플랫폼
          </span>
          <span>
            용어 기준: 기대 득점(xG) · 기대 도움(xA) · 압박 강도(PPDA) · 수익 대비 주급 비율(Wages-to-Turnover) · 이적료 상각비(Amortization)
          </span>
        </div>
      </footer>
    </div>
  );
}
