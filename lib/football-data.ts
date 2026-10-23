export type LeagueFilter =
  | '전체'
  | '프리미어리그'
  | '라리가'
  | '분데스리가'
  | '세리에 A'
  | '챔피언스리그';

export type FormResult = '승' | '무' | '패';

export interface InjuryReport {
  id: string;
  playerName: string;
  teamSide: '홈' | '원정';
  position: string;
  reason: string;
  returnEstimate: string;
  impact: '높음' | '보통';
}

export interface MatchItem {
  id: string;
  league: Exclude<LeagueFilter, '전체'>;
  roundLabel: string;
  kickoffTime: string;
  kickoffDate: string;
  stadium: string;
  homeTeam: {
    name: string;
    shortCode: string;
    primaryColor: string;
    secondaryColor: string;
    recentForm: FormResult[];
    recent5Xg: number;
    recent5Xga: number;
    ppda: number;
    eloRating: number;
  };
  awayTeam: {
    name: string;
    shortCode: string;
    primaryColor: string;
    secondaryColor: string;
    recentForm: FormResult[];
    recent5Xg: number;
    recent5Xga: number;
    ppda: number;
    eloRating: number;
  };
  homeXgLambda: number;
  awayXgLambda: number;
  monteCarloRuns: number;
  tacticalKeynote: string;
  injuries: InjuryReport[];
}

export interface RadarMetricPoint {
  axis: string;
  shortLabel: string;
  per90Value: number;
  unit: string;
  percentile: number;
}

export interface PercentileBreakdownItem {
  metricName: string;
  per90Display: string;
  percentile: number;
  description: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  club: string;
  league: string;
  position: string;
  age: number;
  nationality: string;
  shirtNumber: number;
  fotmobRating: number;
  weeklyWagePounds: number;
  weeklyWageKrwText: string;
  annualWageKrwEok: number;
  marketValueEok: number;
  valueEfficiencyScore: number; // 0-100 가성비 지수
  minutesPlayed: number;
  goals: number;
  assists: number;
  accentColor: string;
  radarMetrics: RadarMetricPoint[]; // 6 core axes
  detailedPercentiles: {
    attack: PercentileBreakdownItem[];
    possession: PercentileBreakdownItem[];
    defense: PercentileBreakdownItem[];
    financial: PercentileBreakdownItem[];
  };
}

export interface ClubFinancialProfile {
  id: string;
  name: string;
  league: string;
  foundedYear: number;
  stadium: string;
  badgeColor: string;
  governance: {
    ownerName: string;
    ownershipType: '국부펀드' | '사모펀드' | '개인/기업' | '시민구단 (소시오)';
    ownershipShare: string;
    ceoName: string;
    sportingDirectorName: string;
    boardStructureNote: string;
  };
  revenue: {
    totalEok: number; // 억 원 단위
    totalEuroM: number; // 백만 유로
    broadcastingEok: number;
    commercialEok: number;
    matchdayEok: number;
    yoyGrowthPercent: number;
  };
  wagesToTurnoverPercent: number; // 수익 대비 인건비 비율 (%)
  annualWageBillEok: number;
  psrAndAmortization: {
    annualAmortizationEok: number; // 연간 이적료 상각비
    netSpend3YrEok: number; // 최근 3시즌 순지출
    psrHeadroomEok: number; // PSR 여유 한도 (음수면 초과 위험)
    psrStatus: '안전' | '주의' | '위험';
    psrDescription: string;
  };
  seasonPerformance: {
    points: number;
    goalsScored: number;
    leagueAvgCostPerPointEok: number;
    leagueAvgCostPerGoalEok: number;
  };
  threeYearHistory: {
    season: string;
    revenueEok: number;
    wageRatioPercent: number;
    amortizationEok: number;
  }[];
}

export interface HistoricalTeamProfile {
  id: string;
  eraLabel: string; // e.g., "2007-08 맨체스터 유나이티드"
  season: string;
  clubName: string;
  manager: string;
  honors: string;
  formation: string;
  primaryColor: string;
  points: number;
  winRatePercent: number;
  tacticalSummary: string;
  eraContext: {
    leagueAvgGoalsPerGame: number;
    leagueStdGoalsPerGame: number;
    leagueAvgPossession: number;
    leagueStdPossession: number;
    leagueAvgXgDiff: number;
    leagueStdXgDiff: number;
    leagueAvgGoalsConceded: number;
    leagueStdGoalsConceded: number;
  };
  rawMetrics: {
    goalsPerGame: number;
    avgPossession: number;
    xgDiffPerGame: number;
    goalsConcededPerGame: number;
  };
  zScores: {
    goalsPerGameZ: number; // 경기당 득점 Z-Score
    possessionZ: number; // 평균 점유율 Z-Score
    xgDominanceZ: number; // 기대 득점 우위 Z-Score
    defensiveStabilityZ: number; // 수비 안정성 Z-Score (실점 역산)
    overallDominanceIndex: number; // 종합 시대 압도성 지수
  };
}

export const LEAGUE_FILTERS: LeagueFilter[] = [
  '전체',
  '프리미어리그',
  '라리가',
  '분데스리가',
  '세리에 A',
  '챔피언스리그',
];

export const MATCHES_DATA: MatchItem[] = [
  {
    id: 'match-epl-1',
    league: '프리미어리그',
    roundLabel: '프리미어리그 29라운드',
    kickoffTime: '00:30',
    kickoffDate: '오늘 · 에미레이츠 스타디움',
    stadium: '에미레이츠 스타디움',
    homeTeam: {
      name: '아스널',
      shortCode: 'ARS',
      primaryColor: '#EF4444',
      secondaryColor: '#991B1B',
      recentForm: ['승', '승', '승', '무', '승'],
      recent5Xg: 2.34,
      recent5Xga: 0.72,
      ppda: 8.4,
      eloRating: 1988,
    },
    awayTeam: {
      name: '맨체스터 시티',
      shortCode: 'MCI',
      primaryColor: '#38BDF8',
      secondaryColor: '#0284C7',
      recentForm: ['승', '무', '승', '승', '패'],
      recent5Xg: 2.28,
      recent5Xga: 0.96,
      ppda: 9.1,
      eloRating: 2012,
    },
    homeXgLambda: 1.68,
    awayXgLambda: 1.42,
    monteCarloRuns: 10000,
    tacticalKeynote:
      '아스널의 우측 하프스페이스 오버로드(사카-외데고르)와 맨체스터 시티의 인버티드 풀백 빌드업 제어권 맞대결. 아스널의 최근 5경기 기대 실점(0.72)이 승률 예측에서 홈 우위를 견인합니다.',
    injuries: [
      {
        id: 'inj-1',
        playerName: '벤 화이트',
        teamSide: '홈',
        position: '우측 풀백',
        reason: '무릎 관절경 수술 후 회복',
        returnEstimate: '2주 후 복귀 예정',
        impact: '보통',
      },
      {
        id: 'inj-2',
        playerName: '케빈 더 브라위너',
        teamSide: '원정',
        position: '공격형 미드필더',
        reason: '대퇴부 근육 미세 피로',
        returnEstimate: '출전 불투명 (당일 테스트)',
        impact: '높음',
      },
      {
        id: 'inj-3',
        playerName: '존 스톤스',
        teamSide: '원정',
        position: '센터백 / 수비형 MF',
        reason: '발목 인대 염좌',
        returnEstimate: '3주 결장 예상',
        impact: '높음',
      },
    ],
  },
  {
    id: 'match-epl-2',
    league: '프리미어리그',
    roundLabel: '프리미어리그 29라운드',
    kickoffTime: '03:00',
    kickoffDate: '오늘 · 토트넘 홋스퍼 스타디움',
    stadium: '토트넘 홋스퍼 스타디움',
    homeTeam: {
      name: '토트넘 홋스퍼',
      shortCode: 'TOT',
      primaryColor: '#E2E8F0',
      secondaryColor: '#475569',
      recentForm: ['승', '패', '승', '무', '승'],
      recent5Xg: 2.12,
      recent5Xga: 1.38,
      ppda: 7.9,
      eloRating: 1876,
    },
    awayTeam: {
      name: '리버풀',
      shortCode: 'LIV',
      primaryColor: '#F43F5E',
      secondaryColor: '#BE123C',
      recentForm: ['승', '승', '무', '승', '승'],
      recent5Xg: 2.48,
      recent5Xga: 0.89,
      ppda: 8.2,
      eloRating: 1994,
    },
    homeXgLambda: 1.56,
    awayXgLambda: 1.98,
    monteCarloRuns: 10000,
    tacticalKeynote:
      '토트넘의 하이 라인(평균 수비선 48.2m) 배후 공간을 노리는 살라·디아스의 직선 침투와 손흥민의 좌측 인사이드 컷인 결정력 대결. 다득점 난타전 확률이 가장 높은 매치업입니다.',
    injuries: [
      {
        id: 'inj-4',
        playerName: '미키 판 더 펜',
        teamSide: '홈',
        position: '센터백',
        reason: '햄스트링 컨디션 관리',
        returnEstimate: '다음 라운드 복귀',
        impact: '높음',
      },
      {
        id: 'inj-5',
        playerName: '히샬리송',
        teamSide: '홈',
        position: '스트라이커',
        reason: '종아리 근육 부상',
        returnEstimate: '3주 결장',
        impact: '보통',
      },
      {
        id: 'inj-6',
        playerName: '디오구 조타',
        teamSide: '원정',
        position: '스트라이커',
        reason: '늑골 타박상',
        returnEstimate: '1주 후 복귀',
        impact: '보통',
      },
    ],
  },
  {
    id: 'match-laliga-1',
    league: '라리가',
    roundLabel: '라리가 28라운드 · 엘 클라시코',
    kickoffTime: '05:00',
    kickoffDate: '내일 · 산티아고 베르나베우',
    stadium: '산티아고 베르나베우',
    homeTeam: {
      name: '레알 마드리드',
      shortCode: 'RMA',
      primaryColor: '#F59E0B',
      secondaryColor: '#B45309',
      recentForm: ['승', '승', '승', '무', '승'],
      recent5Xg: 2.41,
      recent5Xga: 0.84,
      ppda: 10.2,
      eloRating: 2025,
    },
    awayTeam: {
      name: '바르셀로나',
      shortCode: 'BAR',
      primaryColor: '#3B82F6',
      secondaryColor: '#DC2626',
      recentForm: ['승', '승', '패', '승', '승'],
      recent5Xg: 2.38,
      recent5Xga: 1.05,
      ppda: 7.4,
      eloRating: 1968,
    },
    homeXgLambda: 1.88,
    awayXgLambda: 1.52,
    monteCarloRuns: 10000,
    tacticalKeynote:
      '벨링엄의 박스 침투 및 비니시우스·음바페의 전환 속도가 바르셀로나의 극단적 오프사이드 트랩(경기당 6.4회 유도)을 얼마나 효율적으로 허무느냐가 승패의 분수령입니다.',
    injuries: [
      {
        id: 'inj-7',
        playerName: '다니 카르바할',
        teamSide: '홈',
        position: '우측 풀백',
        reason: '전방 십자인대 파열',
        returnEstimate: '시즌 아웃',
        impact: '높음',
      },
      {
        id: 'inj-8',
        playerName: '마르크안드레 테어 슈테겐',
        teamSide: '원정',
        position: '골키퍼',
        reason: '슬개건 파열 수술',
        returnEstimate: '시즌 아웃',
        impact: '높음',
      },
    ],
  },
  {
    id: 'match-bun-1',
    league: '분데스리가',
    roundLabel: '분데스리가 26라운드',
    kickoffTime: '02:30',
    kickoffDate: '내일 · 알리안츠 아레나',
    stadium: '알리안츠 아레나',
    homeTeam: {
      name: '바이에른 뮌헨',
      shortCode: 'BAY',
      primaryColor: '#DC2626',
      secondaryColor: '#991B1B',
      recentForm: ['승', '승', '승', '승', '무'],
      recent5Xg: 2.65,
      recent5Xga: 0.78,
      ppda: 7.6,
      eloRating: 1990,
    },
    awayTeam: {
      name: '바이어 레버쿠젠',
      shortCode: 'LEV',
      primaryColor: '#EA580C',
      secondaryColor: '#9A3412',
      recentForm: ['승', '무', '승', '승', '무'],
      recent5Xg: 2.04,
      recent5Xga: 0.91,
      ppda: 9.5,
      eloRating: 1952,
    },
    homeXgLambda: 1.95,
    awayXgLambda: 1.18,
    monteCarloRuns: 10000,
    tacticalKeynote:
      '김민재·우파메카노의 전진 수비 커버리지와 무시알라의 좁은 공간 드리블 돌파가 레버쿠젠의 3-4-2-1 윙백 전진을 억제하고 있습니다.',
    injuries: [
      {
        id: 'inj-9',
        playerName: '알폰소 데이비스',
        teamSide: '홈',
        position: '좌측 풀백',
        reason: '대퇴 이두근 염좌',
        returnEstimate: '2주 결장',
        impact: '보통',
      },
      {
        id: 'inj-10',
        playerName: '아민 아들리',
        teamSide: '원정',
        position: '공격형 미드필더',
        reason: '비골 골절 회복 단계',
        returnEstimate: '3주 후 복귀',
        impact: '보통',
      },
    ],
  },
  {
    id: 'match-serie-1',
    league: '세리에 A',
    roundLabel: '세리에 A 29라운드',
    kickoffTime: '04:45',
    kickoffDate: '모레 · 주세페 메아차',
    stadium: '주세페 메아차',
    homeTeam: {
      name: '인테르나치오날레',
      shortCode: 'INT',
      primaryColor: '#2563EB',
      secondaryColor: '#1E3A8A',
      recentForm: ['승', '승', '무', '승', '승'],
      recent5Xg: 2.15,
      recent5Xga: 0.68,
      ppda: 9.8,
      eloRating: 1975,
    },
    awayTeam: {
      name: '나폴리',
      shortCode: 'NAP',
      primaryColor: '#0EA5E9',
      secondaryColor: '#0369A1',
      recentForm: ['승', '무', '승', '무', '승'],
      recent5Xg: 1.72,
      recent5Xga: 0.79,
      ppda: 10.6,
      eloRating: 1912,
    },
    homeXgLambda: 1.62,
    awayXgLambda: 0.98,
    monteCarloRuns: 10000,
    tacticalKeynote:
      '인테르의 3-5-2 스토퍼 오버래핑(바스토니-디마르코 좌측 체인)과 나폴리의 견고한 미드블록 수비 조직력 대결. 저득점 양상 속 인테르의 세트피스 기대 득점이 핵심 변수입니다.',
    injuries: [
      {
        id: 'inj-11',
        playerName: '후안 콰드라도',
        teamSide: '홈',
        position: '우측 윙백',
        reason: '아킬레스건 통증 관리',
        returnEstimate: '1주 결장',
        impact: '보통',
      },
      {
        id: 'inj-12',
        playerName: '스타니슬라프 로보트카',
        teamSide: '원정',
        position: '수비형 미드필더',
        reason: '내전근 피로 누적',
        returnEstimate: '당일 교체 명단 예상',
        impact: '높음',
      },
    ],
  },
  {
    id: 'match-ucl-1',
    league: '챔피언스리그',
    roundLabel: '챔피언스리그 8강 1차전',
    kickoffTime: '04:00',
    kickoffDate: '수요일 · 파르크 데 프랭스',
    stadium: '파르크 데 프랭스',
    homeTeam: {
      name: '파리 생제르맹',
      shortCode: 'PSG',
      primaryColor: '#6366F1',
      secondaryColor: '#312E81',
      recentForm: ['승', '승', '승', '무', '승'],
      recent5Xg: 2.52,
      recent5Xga: 0.88,
      ppda: 7.2,
      eloRating: 1948,
    },
    awayTeam: {
      name: '아스널',
      shortCode: 'ARS',
      primaryColor: '#EF4444',
      secondaryColor: '#991B1B',
      recentForm: ['승', '승', '승', '무', '승'],
      recent5Xg: 2.34,
      recent5Xga: 0.72,
      ppda: 8.4,
      eloRating: 1988,
    },
    homeXgLambda: 1.54,
    awayXgLambda: 1.48,
    monteCarloRuns: 10000,
    tacticalKeynote:
      '파리 생제르맹의 중원 점유율(비티냐-이강인-주앙 네베스)과 아스널의 압도적인 세트피스 및 박스 수비 집중력이 정면 충돌하는 백중세 승부입니다.',
    injuries: [
      {
        id: 'inj-13',
        playerName: '뤼카 에르난데스',
        teamSide: '홈',
        position: '좌측 풀백 / 센터백',
        reason: '무릎 십자인대 재활 후반',
        returnEstimate: '복귀 임박',
        impact: '보통',
      },
      {
        id: 'inj-14',
        playerName: '가브리에우 제수스',
        teamSide: '원정',
        position: '스트라이커',
        reason: '무릎 부상 결장',
        returnEstimate: '장기 결장',
        impact: '보통',
      },
    ],
  },
];

export const PLAYERS_DATA: PlayerProfile[] = [
  {
    id: 'player-son',
    name: '손흥민',
    club: '토트넘 홋스퍼',
    league: '프리미어리그',
    position: '좌측 윙어 / 스트라이커',
    age: 32,
    nationality: '대한민국',
    shirtNumber: 7,
    fotmobRating: 8.4,
    weeklyWagePounds: 190000,
    weeklyWageKrwText: '약 3.3억 원 (£190K)',
    annualWageKrwEok: 172,
    marketValueEok: 680,
    valueEfficiencyScore: 92,
    minutesPlayed: 2240,
    goals: 16,
    assists: 10,
    accentColor: '#10B981',
    radarMetrics: [
      { axis: '기대 득점 npxG', shortLabel: '기대 득점', per90Value: 0.54, unit: 'npxG/90', percentile: 89 },
      { axis: '기대 도움 xA', shortLabel: '기대 도움', per90Value: 0.38, unit: 'xA/90', percentile: 92 },
      { axis: '박스 내 터치', shortLabel: '박스 터치', per90Value: 6.8, unit: '회/90', percentile: 87 },
      { axis: '전진 패스', shortLabel: '전진 패스', per90Value: 4.9, unit: '회/90', percentile: 82 },
      { axis: '볼 리커버리', shortLabel: '리커버리', per90Value: 4.1, unit: '회/90', percentile: 71 },
      { axis: '슈팅 전환율', shortLabel: '슈팅 전환율', per90Value: 24.6, unit: '%', percentile: 96 },
    ],
    detailedPercentiles: {
      attack: [
        { metricName: '비페널티 기대 득점 (npxG)', per90Display: '0.54', percentile: 89, description: '90분당 페널티킥 제외 기대 득점' },
        { metricName: '기대 득점 대비 실제 득점 초과율', per90Display: '+0.18', percentile: 97, description: '양발 결정력 기반 리그 최상위 피니싱 효율' },
        { metricName: '슈팅 전환율 (Shot Conversion)', per90Display: '24.6%', percentile: 96, description: '전체 슈팅 중 실제 득점으로 연결된 비율' },
        { metricName: '페널티 박스 내 터치', per90Display: '6.82회', percentile: 87, description: '상대 위험 지역 침투 및 볼 수용 빈도' },
      ],
      possession: [
        { metricName: '기대 도움 (xA)', per90Display: '0.38', percentile: 92, description: '동료에게 제공한 패스의 기대 득점 합계' },
        { metricName: '결정적 기회 창출 (Big Chances Created)', per90Display: '0.68회', percentile: 94, description: '90분당 1대1 등 완벽한 득점 찬스 메이킹' },
        { metricName: '전진 패스 성공 (Progressive Passes)', per90Display: '4.90회', percentile: 82, description: '상대 골문 방향으로 10m 이상 전진시킨 패스' },
      ],
      defense: [
        { metricName: '파이널 서드 압박 회수', per90Display: '1.15회', percentile: 88, description: '전방 압박을 통해 상대 진영에서 탈취한 횟수' },
        { metricName: '볼 리커버리 (Ball Recoveries)', per90Display: '4.10회', percentile: 71, description: '루즈볼 회수 및 소유권 탈환' },
      ],
      financial: [
        { metricName: '주급 대비 공격포인트 효율', per90Display: '1.04 P/90', percentile: 93, description: '주급 £190K 대비 리그 최상위 스탯 생산성' },
        { metricName: '구단 상업 가치 기여도 지수', per90Display: '98.4점', percentile: 99, description: '글로벌 매치데이 및 스폰서십 기여 지표' },
      ],
    },
  },
  {
    id: 'player-haaland',
    name: '엘링 홀란드',
    club: '맨체스터 시티',
    league: '프리미어리그',
    position: '스트라이커',
    age: 24,
    nationality: '노르웨이',
    shirtNumber: 9,
    fotmobRating: 8.7,
    weeklyWagePounds: 375000,
    weeklyWageKrwText: '약 6.5억 원 (£375K)',
    annualWageKrwEok: 340,
    marketValueEok: 2950,
    valueEfficiencyScore: 88,
    minutesPlayed: 2380,
    goals: 27,
    assists: 5,
    accentColor: '#38BDF8',
    radarMetrics: [
      { axis: '기대 득점 npxG', shortLabel: '기대 득점', per90Value: 0.89, unit: 'npxG/90', percentile: 99 },
      { axis: '기대 도움 xA', shortLabel: '기대 도움', per90Value: 0.14, unit: 'xA/90', percentile: 48 },
      { axis: '박스 내 터치', shortLabel: '박스 터치', per90Value: 7.9, unit: '회/90', percentile: 96 },
      { axis: '전진 패스', shortLabel: '전진 패스', per90Value: 1.6, unit: '회/90', percentile: 24 },
      { axis: '볼 리커버리', shortLabel: '리커버리', per90Value: 1.9, unit: '회/90', percentile: 28 },
      { axis: '슈팅 전환율', shortLabel: '슈팅 전환율', per90Value: 26.8, unit: '%', percentile: 98 },
    ],
    detailedPercentiles: {
      attack: [
        { metricName: '비페널티 기대 득점 (npxG)', per90Display: '0.89', percentile: 99, description: '유럽 5대 리그 전체 1위의 압도적 기대 득점' },
        { metricName: '기대 득점 대비 실제 득점 초과율', per90Display: '+0.13', percentile: 91, description: '높은 볼륨에도 유지되는 엘리트 결정력' },
        { metricName: '슈팅 전환율 (Shot Conversion)', per90Display: '26.8%', percentile: 98, description: '4번의 슈팅 중 1골 이상 득점 연결' },
        { metricName: '페널티 박스 내 터치', per90Display: '7.90회', percentile: 96, description: '전체 터치 중 52% 이상이 상대 박스 내부에서 발생' },
      ],
      possession: [
        { metricName: '기대 도움 (xA)', per90Display: '0.14', percentile: 48, description: '포스트 플레이 후 컷백 연결 비중' },
        { metricName: '결정적 기회 창출 (Big Chances Created)', per90Display: '0.28회', percentile: 61, description: '수비 유인 후 2선 침투 패스 제공' },
        { metricName: '전진 패스 성공 (Progressive Passes)', per90Display: '1.60회', percentile: 24, description: '최전방 타깃 피니셔 역할에 집중' },
      ],
      defense: [
        { metricName: '파이널 서드 압박 회수', per90Display: '0.52회', percentile: 54, description: '상대 센터백 빌드업 경로 차단 중심' },
        { metricName: '볼 리커버리 (Ball Recoveries)', per90Display: '1.90회', percentile: 28, description: '최전방 포지셔닝 유지' },
      ],
      financial: [
        { metricName: '주급 대비 공격포인트 효율', per90Display: '1.21 P/90', percentile: 88, description: '최고 수준 주급(£375K)을 상쇄하는 압도적 득점력' },
        { metricName: '구단 상업 가치 기여도 지수', per90Display: '97.2점', percentile: 98, description: '글로벌 아이콘 및 유니폼 판매 최상위' },
      ],
    },
  },
  {
    id: 'player-saka',
    name: '부카요 사카',
    club: '아스널',
    league: '프리미어리그',
    position: '우측 윙어',
    age: 23,
    nationality: '잉글랜드',
    shirtNumber: 7,
    fotmobRating: 8.3,
    weeklyWagePounds: 195000,
    weeklyWageKrwText: '약 3.4억 원 (£195K)',
    annualWageKrwEok: 177,
    marketValueEok: 2150,
    valueEfficiencyScore: 94,
    minutesPlayed: 2290,
    goals: 14,
    assists: 12,
    accentColor: '#F59E0B',
    radarMetrics: [
      { axis: '기대 득점 npxG', shortLabel: '기대 득점', per90Value: 0.46, unit: 'npxG/90', percentile: 84 },
      { axis: '기대 도움 xA', shortLabel: '기대 도움', per90Value: 0.44, unit: 'xA/90', percentile: 96 },
      { axis: '박스 내 터치', shortLabel: '박스 터치', per90Value: 7.4, unit: '회/90', percentile: 92 },
      { axis: '전진 패스', shortLabel: '전진 패스', per90Value: 5.6, unit: '회/90', percentile: 88 },
      { axis: '볼 리커버리', shortLabel: '리커버리', per90Value: 5.2, unit: '회/90', percentile: 89 },
      { axis: '슈팅 전환율', shortLabel: '슈팅 전환율', per90Value: 18.5, unit: '%', percentile: 81 },
    ],
    detailedPercentiles: {
      attack: [
        { metricName: '비페널티 기대 득점 (npxG)', per90Display: '0.46', percentile: 84, description: '우측면 인사이드 컷인 슈팅 기반 기대 득점' },
        { metricName: '기대 득점 대비 실제 득점 초과율', per90Display: '+0.09', percentile: 82, description: '안정적인 니어포스트·파포스트 마무리' },
        { metricName: '슈팅 전환율 (Shot Conversion)', per90Display: '18.5%', percentile: 81, description: '측면 자원 중 상위권 슈팅 효율' },
        { metricName: '페널티 박스 내 터치', per90Display: '7.40회', percentile: 92, description: '우측 하프스페이스에서 지속적인 박스 진입' },
      ],
      possession: [
        { metricName: '기대 도움 (xA)', per90Display: '0.44', percentile: 96, description: '인스윙 크로스 및 컷백을 통한 최상위 찬스 창출' },
        { metricName: '결정적 기회 창출 (Big Chances Created)', per90Display: '0.79회', percentile: 97, description: '프리미어리그 최다 수준 빅찬스 메이킹' },
        { metricName: '전진 패스 성공 (Progressive Passes)', per90Display: '5.60회', percentile: 88, description: '우측 빌드업의 핵심 연결고리' },
      ],
      defense: [
        { metricName: '파이널 서드 압박 회수', per90Display: '1.38회', percentile: 94, description: '윙어 포지션 상위 6%의 강력한 전방 압박 기여' },
        { metricName: '볼 리커버리 (Ball Recoveries)', per90Display: '5.20회', percentile: 89, description: '수비 복귀 및 세컨드볼 회수 성실도' },
      ],
      financial: [
        { metricName: '주급 대비 공격포인트 효율', per90Display: '1.02 P/90', percentile: 94, description: '유스 출신 홈그로운으로 이적료 상각비 0원 효과' },
        { metricName: '구단 상업 가치 기여도 지수', per90Display: '93.5점', percentile: 94, description: '구단 프랜차이즈 스타 가치' },
      ],
    },
  },
  {
    id: 'player-bellingham',
    name: '주드 벨링엄',
    club: '레알 마드리드',
    league: '라리가',
    position: '공격형 미드필더',
    age: 21,
    nationality: '잉글랜드',
    shirtNumber: 5,
    fotmobRating: 8.6,
    weeklyWagePounds: 330000,
    weeklyWageKrwText: '약 5.8억 원 (£330K)',
    annualWageKrwEok: 301,
    marketValueEok: 2780,
    valueEfficiencyScore: 91,
    minutesPlayed: 2210,
    goals: 15,
    assists: 9,
    accentColor: '#A855F7',
    radarMetrics: [
      { axis: '기대 득점 npxG', shortLabel: '기대 득점', per90Value: 0.49, unit: 'npxG/90', percentile: 86 },
      { axis: '기대 도움 xA', shortLabel: '기대 도움', per90Value: 0.34, unit: 'xA/90', percentile: 88 },
      { axis: '박스 내 터치', shortLabel: '박스 터치', per90Value: 5.9, unit: '회/90', percentile: 84 },
      { axis: '전진 패스', shortLabel: '전진 패스', per90Value: 7.4, unit: '회/90', percentile: 94 },
      { axis: '볼 리커버리', shortLabel: '리커버리', per90Value: 6.5, unit: '회/90', percentile: 95 },
      { axis: '슈팅 전환율', shortLabel: '슈팅 전환율', per90Value: 23.1, unit: '%', percentile: 94 },
    ],
    detailedPercentiles: {
      attack: [
        { metricName: '비페널티 기대 득점 (npxG)', per90Display: '0.49', percentile: 86, description: '2선 미드필더 중 압도적 1위의 박스 타격 능력' },
        { metricName: '기대 득점 대비 실제 득점 초과율', per90Display: '+0.14', percentile: 93, description: '클러치 상황에서의 높은 결정력' },
        { metricName: '슈팅 전환율 (Shot Conversion)', per90Display: '23.1%', percentile: 94, description: '박스 안 공간 선점을 통한 고효율 슈팅' },
        { metricName: '페널티 박스 내 터치', per90Display: '5.90회', percentile: 84, description: '폴스 나인에 버금가는 박스 침투 빈도' },
      ],
      possession: [
        { metricName: '기대 도움 (xA)', per90Display: '0.34', percentile: 88, description: '전방 스루패스 및 전환 패스 창출' },
        { metricName: '결정적 기회 창출 (Big Chances Created)', per90Display: '0.58회', percentile: 89, description: '비니시우스·음바페 향한 찬스 공급' },
        { metricName: '전진 패스 성공 (Progressive Passes)', per90Display: '7.40회', percentile: 94, description: '중원 탈압박 후 전진 볼 배급 핵심' },
      ],
      defense: [
        { metricName: '파이널 서드 압박 회수', per90Display: '1.22회', percentile: 91, description: '공수 양면 왕성한 활동량과 태클 성공률' },
        { metricName: '볼 리커버리 (Ball Recoveries)', per90Display: '6.50회', percentile: 95, description: '육각형 박스 투 박스 장악력' },
      ],
      financial: [
        { metricName: '주급 대비 공격포인트 효율', per90Display: '0.98 P/90', percentile: 90, description: '21세 나이에 향후 10년 구단 코어 자산 가치' },
        { metricName: '구단 상업 가치 기여도 지수', per90Display: '96.8점', percentile: 98, description: '글로벌 스폰서십 핵심 모델' },
      ],
    },
  },
  {
    id: 'player-salah',
    name: '모하메드 살라',
    club: '리버풀',
    league: '프리미어리그',
    position: '우측 윙어',
    age: 32,
    nationality: '이집트',
    shirtNumber: 11,
    fotmobRating: 8.5,
    weeklyWagePounds: 350000,
    weeklyWageKrwText: '약 6.1억 원 (£350K)',
    annualWageKrwEok: 318,
    marketValueEok: 850,
    valueEfficiencyScore: 89,
    minutesPlayed: 2340,
    goals: 21,
    assists: 14,
    accentColor: '#F43F5E',
    radarMetrics: [
      { axis: '기대 득점 npxG', shortLabel: '기대 득점', per90Value: 0.66, unit: 'npxG/90', percentile: 95 },
      { axis: '기대 도움 xA', shortLabel: '기대 도움', per90Value: 0.48, unit: 'xA/90', percentile: 98 },
      { axis: '박스 내 터치', shortLabel: '박스 터치', per90Value: 8.4, unit: '회/90', percentile: 98 },
      { axis: '전진 패스', shortLabel: '전진 패스', per90Value: 4.5, unit: '회/90', percentile: 78 },
      { axis: '볼 리커버리', shortLabel: '리커버리', per90Value: 3.6, unit: '회/90', percentile: 60 },
      { axis: '슈팅 전환율', shortLabel: '슈팅 전환율', per90Value: 21.4, unit: '%', percentile: 90 },
    ],
    detailedPercentiles: {
      attack: [
        { metricName: '비페널티 기대 득점 (npxG)', per90Display: '0.66', percentile: 95, description: '윙어 포지션 세계 최고 수준의 득점 기대치' },
        { metricName: '기대 득점 대비 실제 득점 초과율', per90Display: '+0.12', percentile: 89, description: '꾸준한 20골+ 시즌 결정력 유지' },
        { metricName: '슈팅 전환율 (Shot Conversion)', per90Display: '21.4%', percentile: 90, description: '박스 내 인사이드 감아차기 강점' },
        { metricName: '페널티 박스 내 터치', per90Display: '8.40회', percentile: 98, description: '유럽 전체 윙어 중 박스 안 터치 1위' },
      ],
      possession: [
        { metricName: '기대 도움 (xA)', per90Display: '0.48', percentile: 98, description: '득점왕과 도움왕을 동시에 노리는 플레이메이킹' },
        { metricName: '결정적 기회 창출 (Big Chances Created)', per90Display: '0.84회', percentile: 99, description: '반대편 포스트를 향한 아웃프런트 패스' },
        { metricName: '전진 패스 성공 (Progressive Passes)', per90Display: '4.50회', percentile: 78, description: '파이널 서드 직접 투입 패스' },
      ],
      defense: [
        { metricName: '파이널 서드 압박 회수', per90Display: '0.94회', percentile: 79, description: '전환 시점 카운터 대기 및 선택적 압박' },
        { metricName: '볼 리커버리 (Ball Recoveries)', per90Display: '3.60회', percentile: 60, description: '우측면 위치 유지' },
      ],
      financial: [
        { metricName: '주급 대비 공격포인트 효율', per90Display: '1.35 P/90', percentile: 92, description: '90분당 1.35개의 공격포인트로 고주급 완전 증명' },
        { metricName: '구단 상업 가치 기여도 지수', per90Display: '97.9점', percentile: 99, description: '중동·글로벌 시장 절대적 영향력' },
      ],
    },
  },
  {
    id: 'player-rodri',
    name: '로드리',
    club: '맨체스터 시티',
    league: '프리미어리그',
    position: '수비형 미드필더',
    age: 28,
    nationality: '스페인',
    shirtNumber: 16,
    fotmobRating: 8.6,
    weeklyWagePounds: 220000,
    weeklyWageKrwText: '약 3.8억 원 (£220K)',
    annualWageKrwEok: 199,
    marketValueEok: 1950,
    valueEfficiencyScore: 96,
    minutesPlayed: 2450,
    goals: 8,
    assists: 9,
    accentColor: '#14B8A6',
    radarMetrics: [
      { axis: '기대 득점 npxG', shortLabel: '기대 득점', per90Value: 0.18, unit: 'npxG/90', percentile: 76 },
      { axis: '기대 도움 xA', shortLabel: '기대 도움', per90Value: 0.24, unit: 'xA/90', percentile: 85 },
      { axis: '박스 내 터치', shortLabel: '박스 터치', per90Value: 2.3, unit: '회/90', percentile: 68 },
      { axis: '전진 패스', shortLabel: '전진 패스', per90Value: 11.4, unit: '회/90', percentile: 99 },
      { axis: '볼 리커버리', shortLabel: '리커버리', per90Value: 8.9, unit: '회/90', percentile: 99 },
      { axis: '슈팅 전환율', shortLabel: '슈팅 전환율', per90Value: 19.2, unit: '%', percentile: 84 },
    ],
    detailedPercentiles: {
      attack: [
        { metricName: '비페널티 기대 득점 (npxG)', per90Display: '0.18', percentile: 76, description: '수비형 미드필더 중 최상위 아크 정면 중거리 타격' },
        { metricName: '기대 득점 대비 실제 득점 초과율', per90Display: '+0.11', percentile: 92, description: '결정적 순간 터지는 중거리 클러치 득점' },
        { metricName: '슈팅 전환율 (Shot Conversion)', per90Display: '19.2%', percentile: 84, description: '세컨드볼 상황에서 정확한 임팩트' },
        { metricName: '페널티 박스 내 터치', per90Display: '2.30회', percentile: 68, description: '세트피스 및 지공 상황 박스 타격 가담' },
      ],
      possession: [
        { metricName: '기대 도움 (xA)', per90Display: '0.24', percentile: 85, description: '수비 라인을 한 번에 허무는 로빙·스루패스' },
        { metricName: '결정적 기회 창출 (Big Chances Created)', per90Display: '0.41회', percentile: 86, description: '3선에서 시작되는 찬스 메이킹' },
        { metricName: '전진 패스 성공 (Progressive Passes)', per90Display: '11.40회', percentile: 99, description: '유럽 5대 리그 전체 1위 빌드업 컨트롤 타워' },
      ],
      defense: [
        { metricName: '파이널 서드 압박 회수', per90Display: '1.45회', percentile: 96, description: '상대 역습 시점 즉각 차단(가두기 전술 핵심)' },
        { metricName: '볼 리커버리 (Ball Recoveries)', per90Display: '8.90회', percentile: 99, description: '90분당 약 9회의 압도적 중원 소유권 회수' },
      ],
      financial: [
        { metricName: '주급 대비 승점 기여 효율', per90Display: '+0.62 승점/경기', percentile: 99, description: '출전 시 무패 행진 견인, 가성비 지수 전체 1위(96점)' },
        { metricName: '구단 상업 가치 기여도 지수', per90Display: '92.0점', percentile: 91, description: '발롱도르 위너로서의 구단 위상 제고' },
      ],
    },
  },
];

export const CLUBS_FINANCIAL_DATA: ClubFinancialProfile[] = [
  {
    id: 'club-mci',
    name: '맨체스터 시티',
    league: '프리미어리그',
    foundedYear: 1880,
    stadium: '에티하드 스타디움 (53,400석)',
    badgeColor: '#38BDF8',
    governance: {
      ownerName: '시티 풋볼 그룹 (셰이크 만수르 / 실버레이크)',
      ownershipType: '국부펀드',
      ownershipShare: '아부다비 유나이티드 그룹 81% · 실버레이크 18%',
      ceoName: '페란 소리아노 (Ferran Soriano)',
      sportingDirectorName: '치키 베기리스타인 / 우고 비아나',
      boardStructureNote:
        '글로벌 13개 구단 멀티 클럽 오너십(CFG) 네트워크와 데이터 기반 스카우팅·아카데미 판매 수익 모델이 결합된 고도화 지배구조.',
    },
    revenue: {
      totalEok: 12450,
      totalEuroM: 838,
      broadcastingEok: 5120,
      commercialEok: 5980,
      matchdayEok: 1350,
      yoyGrowthPercent: 4.2,
    },
    wagesToTurnoverPercent: 59,
    annualWageBillEok: 7345,
    psrAndAmortization: {
      annualAmortizationEok: 2480,
      netSpend3YrEok: 1120,
      psrHeadroomEok: 2150,
      psrStatus: '안전',
      psrDescription:
        '아카데미 출신 선수 매각 수익(순수익 100% 즉시 반영)과 역대 최고 상업 수익을 바탕으로 UEFA 70% 스쿼드 비용 규정을 안정적으로 준수 중입니다.',
    },
    seasonPerformance: {
      points: 91,
      goalsScored: 96,
      leagueAvgCostPerPointEok: 82.0,
      leagueAvgCostPerGoalEok: 88.0,
    },
    threeYearHistory: [
      { season: '2022-23', revenueEok: 11420, wageRatioPercent: 57, amortizationEok: 2310 },
      { season: '2023-24', revenueEok: 11950, wageRatioPercent: 59, amortizationEok: 2420 },
      { season: '2024-25', revenueEok: 12450, wageRatioPercent: 59, amortizationEok: 2480 },
    ],
  },
  {
    id: 'club-tot',
    name: '토트넘 홋스퍼',
    league: '프리미어리그',
    foundedYear: 1882,
    stadium: '토트넘 홋스퍼 스타디움 (62,850석)',
    badgeColor: '#10B981',
    governance: {
      ownerName: 'ENIC 그룹 (조 루이스 패밀리 트러스트 & 다니엘 레비)',
      ownershipType: '개인/기업',
      ownershipShare: 'ENIC 인터내셔널 86.6% · 소액주주 13.4%',
      ceoName: '다니엘 레비 (Daniel Levy · 회장 겸임)',
      sportingDirectorName: '요한 랑게 (테크니컬 디렉터)',
      boardStructureNote:
        '유럽 최고 수준의 복합 문화 스타디움(NFL·콘서트 수익)과 엄격한 주급 상한선(Wage Structure)을 통해 유럽 최저 수준의 인건비 비율을 유지하는 수익성 중심 구단.',
    },
    revenue: {
      totalEok: 9380,
      totalEuroM: 631,
      broadcastingEok: 3680,
      commercialEok: 3820,
      matchdayEok: 1880,
      yoyGrowthPercent: 6.8,
    },
    wagesToTurnoverPercent: 46,
    annualWageBillEok: 4315,
    psrAndAmortization: {
      annualAmortizationEok: 1920,
      netSpend3YrEok: 3450,
      psrHeadroomEok: 3800,
      psrStatus: '안전',
      psrDescription:
        '수익 대비 인건비 비율이 46%로 유럽 빅클럽 중 가장 낮으며, 신구장 감가상각비는 PSR 계산에서 제외되어 프리미어리그 내 가장 넉넉한 PSR 투자 여력을 보유하고 있습니다.',
    },
    seasonPerformance: {
      points: 68,
      goalsScored: 74,
      leagueAvgCostPerPointEok: 82.0,
      leagueAvgCostPerGoalEok: 88.0,
    },
    threeYearHistory: [
      { season: '2022-23', revenueEok: 8150, wageRatioPercent: 47, amortizationEok: 1640 },
      { season: '2023-24', revenueEok: 8780, wageRatioPercent: 46, amortizationEok: 1790 },
      { season: '2024-25', revenueEok: 9380, wageRatioPercent: 46, amortizationEok: 1920 },
    ],
  },
  {
    id: 'club-ars',
    name: '아스널',
    league: '프리미어리그',
    foundedYear: 1886,
    stadium: '에미레이츠 스타디움 (60,704석)',
    badgeColor: '#EF4444',
    governance: {
      ownerName: '크론키 스포츠 & 엔터테인먼트 (스탠 크론키)',
      ownershipType: '개인/기업',
      ownershipShare: 'KSE (Kroenke Sports & Entertainment) 100%',
      ceoName: '리처드 갈릭 (Richard Garlick · 매니징 디렉터)',
      sportingDirectorName: '안드레아 베르타 / 제이슨 아이토',
      boardStructureNote:
        '젊은 코어 스쿼드 재계약 완료 및 챔피언스리그 복귀로 매치데이·중계권 수익이 급반등하며 전술적 성적과 재정 균형을 동시 달성한 모델.',
    },
    revenue: {
      totalEok: 10650,
      totalEuroM: 716,
      broadcastingEok: 4580,
      commercialEok: 4120,
      matchdayEok: 1950,
      yoyGrowthPercent: 18.4,
    },
    wagesToTurnoverPercent: 53,
    annualWageBillEok: 5644,
    psrAndAmortization: {
      annualAmortizationEok: 2390,
      netSpend3YrEok: 4120,
      psrHeadroomEok: 1680,
      psrStatus: '안전',
      psrDescription:
        '라이스·하베르츠 등 대형 영입으로 이적료 상각비가 증가했으나, 사카 등 핵심 홈그로운 자원과 UCL 수익 확대로 수익 대비 주급 비율을 53%로 제어하고 있습니다.',
    },
    seasonPerformance: {
      points: 89,
      goalsScored: 91,
      leagueAvgCostPerPointEok: 82.0,
      leagueAvgCostPerGoalEok: 88.0,
    },
    threeYearHistory: [
      { season: '2022-23', revenueEok: 7920, wageRatioPercent: 51, amortizationEok: 1850 },
      { season: '2023-24', revenueEok: 8995, wageRatioPercent: 52, amortizationEok: 2180 },
      { season: '2024-25', revenueEok: 10650, wageRatioPercent: 53, amortizationEok: 2390 },
    ],
  },
  {
    id: 'club-mun',
    name: '맨체스터 유나이티드',
    league: '프리미어리그',
    foundedYear: 1878,
    stadium: '올드 트래포드 (74,310석)',
    badgeColor: '#F59E0B',
    governance: {
      ownerName: '이네오스 (짐 랫클리프 경) & 글레이저 가문',
      ownershipType: '사모펀드',
      ownershipShare: '글레이저 가문 67.9% · 이네오스(축구 운영권 전권) 28.9%',
      ceoName: '오마르 베라다 (Omar Berrada)',
      sportingDirectorName: '제이슨 윌콕스 (테크니컬 디렉터)',
      boardStructureNote:
        '이네오스 지분 인수 이후 축구 의사결정 라인을 전면 개편(오마르 베라다 CEO 체제)하고 고주급 잉여 자원 정리 및 비용 효율화 작업을 진행 중.',
    },
    revenue: {
      totalEok: 11400,
      totalEuroM: 768,
      broadcastingEok: 3890,
      commercialEok: 5350,
      matchdayEok: 2160,
      yoyGrowthPercent: 2.1,
    },
    wagesToTurnoverPercent: 68,
    annualWageBillEok: 7752,
    psrAndAmortization: {
      annualAmortizationEok: 2890,
      netSpend3YrEok: 5240,
      psrHeadroomEok: 240,
      psrStatus: '주의',
      psrDescription:
        '최근 3년간 누적된 고액 이적료 감가상각비(연 2,890억 원)와 높은 주급 총액으로 인해 PSR 허용 손실 한도(3년 £105M)에 근접해 선판매 후영입 기조가 요구됩니다.',
    },
    seasonPerformance: {
      points: 60,
      goalsScored: 57,
      leagueAvgCostPerPointEok: 82.0,
      leagueAvgCostPerGoalEok: 88.0,
    },
    threeYearHistory: [
      { season: '2022-23', revenueEok: 10850, wageRatioPercent: 65, amortizationEok: 2540 },
      { season: '2023-24', revenueEok: 11160, wageRatioPercent: 67, amortizationEok: 2760 },
      { season: '2024-25', revenueEok: 11400, wageRatioPercent: 68, amortizationEok: 2890 },
    ],
  },
  {
    id: 'club-rma',
    name: '레알 마드리드',
    league: '라리가',
    foundedYear: 1902,
    stadium: '산티아고 베르나베우 (81,044석)',
    badgeColor: '#A855F7',
    governance: {
      ownerName: '레알 마드리드 소시오 (약 95,000명 회원 소유)',
      ownershipType: '시민구단 (소시오)',
      ownershipShare: '100% 소시오 회원 소유 비영리 법인',
      ceoName: '호세 앙헬 산체스 (플로렌티노 페레스 회장)',
      sportingDirectorName: '주니 칼라파트 (수석 스카우트 총괄)',
      boardStructureNote:
        '소시오 총회 직선제 회장 체제 아래 신축 베르나베우 365일 상업화 및 젊은 월드클래스 조기 확보 전략으로 세계 최초로 연 매출 10억 유로를 돌파한 구단.',
    },
    revenue: {
      totalEok: 15520,
      totalEuroM: 1045,
      broadcastingEok: 4720,
      commercialEok: 7120,
      matchdayEok: 3680,
      yoyGrowthPercent: 23.8,
    },
    wagesToTurnoverPercent: 54,
    annualWageBillEok: 8380,
    psrAndAmortization: {
      annualAmortizationEok: 1980,
      netSpend3YrEok: 960,
      psrHeadroomEok: 4950,
      psrStatus: '안전',
      psrDescription:
        '리모델링된 산티아고 베르나베우의 매치데이 수익이 2배 이상 폭증하면서 라리가 샐러리캡(LCPD) 한도가 유럽 내 가장 높은 수준으로 책정되어 있습니다.',
    },
    seasonPerformance: {
      points: 95,
      goalsScored: 87,
      leagueAvgCostPerPointEok: 64.0,
      leagueAvgCostPerGoalEok: 70.0,
    },
    threeYearHistory: [
      { season: '2022-23', revenueEok: 11800, wageRatioPercent: 56, amortizationEok: 1750 },
      { season: '2023-24', revenueEok: 12530, wageRatioPercent: 55, amortizationEok: 1860 },
      { season: '2024-25', revenueEok: 15520, wageRatioPercent: 54, amortizationEok: 1980 },
    ],
  },
  {
    id: 'club-bar',
    name: '바르셀로나',
    league: '라리가',
    foundedYear: 1899,
    stadium: '스포티파이 캄 노우 / 몬주익 (재건축 진행 중)',
    badgeColor: '#F43F5E',
    governance: {
      ownerName: 'FC 바르셀로나 소시오 (약 143,000명 회원 소유)',
      ownershipType: '시민구단 (소시오)',
      ownershipShare: '100% 소시오 회원 소유',
      ceoName: '후안 라포르타 (집행위원회 의장 겸 회장)',
      sportingDirectorName: '데쿠 (Deco)',
      boardStructureNote:
        '캄 노우 리모델링(Espai Barça) 기간 동안 매치데이 수익 감소와 과거 고주급 장기 계약 잔여분 부담을 라 마시아(유스) 콜업으로 정면 돌파 중.',
    },
    revenue: {
      totalEok: 11280,
      totalEuroM: 760,
      broadcastingEok: 3650,
      commercialEok: 5890,
      matchdayEok: 1740,
      yoyGrowthPercent: -3.4,
    },
    wagesToTurnoverPercent: 76,
    annualWageBillEok: 8572,
    psrAndAmortization: {
      annualAmortizationEok: 2150,
      netSpend3YrEok: 680,
      psrHeadroomEok: -420,
      psrStatus: '위험',
      psrDescription:
        '수익 대비 인건비 비율이 76%로 UEFA 권고 기준선(70%)을 초과한 상태입니다. 라리가 1:1 선수 등록 규정 복귀를 위해 추가 상업 스폰서십 및 주급 절감이 필수적입니다.',
    },
    seasonPerformance: {
      points: 85,
      goalsScored: 88,
      leagueAvgCostPerPointEok: 64.0,
      leagueAvgCostPerGoalEok: 70.0,
    },
    threeYearHistory: [
      { season: '2022-23', revenueEok: 11900, wageRatioPercent: 81, amortizationEok: 2380 },
      { season: '2023-24', revenueEok: 11680, wageRatioPercent: 78, amortizationEok: 2240 },
      { season: '2024-25', revenueEok: 11280, wageRatioPercent: 76, amortizationEok: 2150 },
    ],
  },
];

export const HISTORICAL_TEAMS_DATA: HistoricalTeamProfile[] = [
  {
    id: 'era-mci-2223',
    eraLabel: '2022-23 맨체스터 시티 (트레블)',
    season: '2022-23 시즌',
    clubName: '맨체스터 시티',
    manager: '펩 과르디올라',
    honors: '프리미어리그 · FA컵 · 챔피언스리그 트레블',
    formation: '3-2-4-1 (인버티드 스토퍼)',
    primaryColor: '#38BDF8',
    points: 89,
    winRatePercent: 73.7,
    tacticalSummary:
      '존 스톤스를 센터백에서 더블 볼란치로 전진시키는 3-2-4-1 빌드업 구조와 엘링 홀란드의 단일 시즌 리그 36골 폭발력이 결합되어 점유율과 기대 득점 우위 모두 시대 평균 대비 +2.4σ 이상을 기록했습니다.',
    eraContext: {
      leagueAvgGoalsPerGame: 1.42,
      leagueStdGoalsPerGame: 0.44,
      leagueAvgPossession: 50.0,
      leagueStdPossession: 6.4,
      leagueAvgXgDiff: 0.0,
      leagueStdXgDiff: 0.46,
      leagueAvgGoalsConceded: 1.42,
      leagueStdGoalsConceded: 0.34,
    },
    rawMetrics: {
      goalsPerGame: 2.47,
      avgPossession: 65.2,
      xgDiffPerGame: 1.18,
      goalsConcededPerGame: 0.87,
    },
    zScores: {
      goalsPerGameZ: 2.39,
      possessionZ: 2.38,
      xgDominanceZ: 2.57,
      defensiveStabilityZ: 1.62,
      overallDominanceIndex: 2.24,
    },
  },
  {
    id: 'era-mun-0708',
    eraLabel: '2007-08 맨체스터 유나이티드 (더블)',
    season: '2007-08 시즌',
    clubName: '맨체스터 유나이티드',
    manager: '알렉스 퍼거슨 경',
    honors: '프리미어리그 · 챔피언스리그 더블',
    formation: '4-3-3 / 4-4-2 스위칭 제로톱',
    primaryColor: '#EF4444',
    points: 87,
    winRatePercent: 71.1,
    tacticalSummary:
      '호날두(31골)-루니-테베즈의 유동적 위치 교환과 퍼디난드-비디치-반 데 사르가 구축한 역대급 철벽 수비진(38경기 22실점). 당시 리그 평균 대비 수비 안정성 Z-스코어가 +2.45σ에 달합니다.',
    eraContext: {
      leagueAvgGoalsPerGame: 1.32,
      leagueStdGoalsPerGame: 0.41,
      leagueAvgPossession: 50.0,
      leagueStdPossession: 5.2,
      leagueAvgXgDiff: 0.0,
      leagueStdXgDiff: 0.42,
      leagueAvgGoalsConceded: 1.32,
      leagueStdGoalsConceded: 0.3,
    },
    rawMetrics: {
      goalsPerGame: 2.11,
      avgPossession: 57.8,
      xgDiffPerGame: 0.96,
      goalsConcededPerGame: 0.58,
    },
    zScores: {
      goalsPerGameZ: 1.93,
      possessionZ: 1.5,
      xgDominanceZ: 2.29,
      defensiveStabilityZ: 2.47,
      overallDominanceIndex: 2.05,
    },
  },
  {
    id: 'era-ars-0304',
    eraLabel: '2003-04 아스널 (무패 우승)',
    season: '2003-04 시즌',
    clubName: '아스널',
    manager: '아르센 벵거',
    honors: '프리미어리그 38경기 무패 우승 (26승 12무 0패)',
    formation: '4-4-2 (비대칭 좌측 오버로드)',
    primaryColor: '#F59E0B',
    points: 90,
    winRatePercent: 68.4,
    tacticalSummary:
      '티에리 앙리-데니스 베르캄프-로베르 피레스-애슐리 콜이 좌측 하프스페이스와 측면을 초고속 원터치 패스로 허문 전설의 무패 우승 팀. 전환 속도와 실점 억제에서 시대를 초월한 지표를 남겼습니다.',
    eraContext: {
      leagueAvgGoalsPerGame: 1.35,
      leagueStdGoalsPerGame: 0.36,
      leagueAvgPossession: 50.0,
      leagueStdPossession: 4.8,
      leagueAvgXgDiff: 0.0,
      leagueStdXgDiff: 0.39,
      leagueAvgGoalsConceded: 1.35,
      leagueStdGoalsConceded: 0.28,
    },
    rawMetrics: {
      goalsPerGame: 1.92,
      avgPossession: 56.4,
      xgDiffPerGame: 0.89,
      goalsConcededPerGame: 0.68,
    },
    zScores: {
      goalsPerGameZ: 1.58,
      possessionZ: 1.33,
      xgDominanceZ: 2.28,
      defensiveStabilityZ: 2.39,
      overallDominanceIndex: 1.9,
    },
  },
  {
    id: 'era-liv-1920',
    eraLabel: '2019-20 리버풀 (승점 99점 우승)',
    season: '2019-20 시즌',
    clubName: '리버풀',
    manager: '위르겐 클롭',
    honors: '프리미어리그 우승 (32승 3무 3패 · 승점 99점)',
    formation: '4-3-3 (풀백 플레이메이킹 & 게겐프레싱)',
    primaryColor: '#F43F5E',
    points: 99,
    winRatePercent: 84.2,
    tacticalSummary:
      '알렉산더아놀드·로버트슨 양 풀백의 대각선 전환 패스와 마네-피르미누-살라 마누라 라인, 버질 판 데이크의 후방 제어가 완성된 시즌. 27라운드까지 26승 1무라는 역사상 최고 승률을 기록했습니다.',
    eraContext: {
      leagueAvgGoalsPerGame: 1.36,
      leagueStdGoalsPerGame: 0.42,
      leagueAvgPossession: 50.0,
      leagueStdPossession: 6.1,
      leagueAvgXgDiff: 0.0,
      leagueStdXgDiff: 0.44,
      leagueAvgGoalsConceded: 1.36,
      leagueStdGoalsConceded: 0.31,
    },
    rawMetrics: {
      goalsPerGame: 2.24,
      avgPossession: 63.4,
      xgDiffPerGame: 1.05,
      goalsConcededPerGame: 0.87,
    },
    zScores: {
      goalsPerGameZ: 2.1,
      possessionZ: 2.2,
      xgDominanceZ: 2.39,
      defensiveStabilityZ: 1.58,
      overallDominanceIndex: 2.07,
    },
  },
  {
    id: 'era-bar-1011',
    eraLabel: '2010-11 바르셀로나 (티키타카 정점)',
    season: '2010-11 시즌',
    clubName: '바르셀로나',
    manager: '펩 과르디올라',
    honors: '라리가 · 챔피언스리그 더블 (승점 96점)',
    formation: '4-3-3 (메시 폴스 나인 & 사비-이니에스타-부스케츠)',
    primaryColor: '#A855F7',
    points: 96,
    winRatePercent: 78.9,
    tacticalSummary:
      '리오넬 메시의 폴스 나인 기용과 사비-이니에스타-부스케츠 중원이 평균 점유율 72.8%라는 전무후무한 볼 소유 지배력을 달성한 시즌. 점유율 Z-스코어가 +3.1σ를 돌파했습니다.',
    eraContext: {
      leagueAvgGoalsPerGame: 1.37,
      leagueStdGoalsPerGame: 0.46,
      leagueAvgPossession: 50.0,
      leagueStdPossession: 6.9,
      leagueAvgXgDiff: 0.0,
      leagueStdXgDiff: 0.48,
      leagueAvgGoalsConceded: 1.37,
      leagueStdGoalsConceded: 0.32,
    },
    rawMetrics: {
      goalsPerGame: 2.5,
      avgPossession: 72.8,
      xgDiffPerGame: 1.34,
      goalsConcededPerGame: 0.55,
    },
    zScores: {
      goalsPerGameZ: 2.46,
      possessionZ: 3.3,
      xgDominanceZ: 2.79,
      defensiveStabilityZ: 2.56,
      overallDominanceIndex: 2.78,
    },
  },
];
