import { type PlayerProfile, type RadarMetricPoint, type PercentileBreakdownItem, type LeagueFilter } from './football-data';
import { getKoreanPlayerName, getKoreanTeamName, type LiveApiScorerItem } from './footballApi';

export type PositionGroup = 'FW' | 'MF' | 'DF';

export interface RawPlayerBigData {
  id: string;
  name: string;
  englishName: string;
  club: string;
  teamCrest?: string;
  league: Exclude<LeagueFilter, '전체'>;
  position: string;
  positionGroup: PositionGroup;
  age: number;
  nationality: string;
  shirtNumber: number;
  minutesPlayed: number;
  matchesPlayed: number;
  goals: number;
  assists: number;
  xg: number;
  npxg: number;
  xa: number;
  progressivePasses: number;
  progressiveCarries: number;
  scaPer90: number;
  boxTouchesPer90: number;
  recoveriesPer90: number;
  tacklesInterceptionsPer90: number;
  shotConversion: number;
  weeklyWagePounds: number;
  marketValueEok: number;
  accentColor: string;
  isLiveSynced?: boolean;
}

export interface EnrichedPlayerBigData extends PlayerProfile {
  englishName: string;
  teamCrest?: string;
  positionGroup: PositionGroup;
  matchesPlayed: number;
  xg: number;
  npxg: number;
  xa: number;
  gMinusXg: number;
  goalsPer90: number;
  assistsPer90: number;
  xgPer90: number;
  npxgPer90: number;
  xaPer90: number;
  prgPassesPer90: number;
  prgCarriesPer90: number;
  scaPer90: number;
  boxTouchesPer90: number;
  recoveriesPer90: number;
  tacklesInterceptionsPer90: number;
  shotConversion: number;
  goalContributionPer90: number;
  tacticalBadges: string[];
  isLiveSynced?: boolean;
}

export const INITIAL_BIGDATA_PLAYERS: RawPlayerBigData[] = [
  // 프리미어리그 (PL)
  {
    id: 'player-haaland',
    name: '엘링 홀란드',
    englishName: 'Erling Haaland',
    club: '맨체스터 시티',
    league: '프리미어리그',
    position: '스트라이커 (ST)',
    positionGroup: 'FW',
    age: 25,
    nationality: '노르웨이',
    shirtNumber: 9,
    minutesPlayed: 2380,
    matchesPlayed: 27,
    goals: 27,
    assists: 5,
    xg: 24.2,
    npxg: 21.8,
    xa: 3.7,
    progressivePasses: 42,
    progressiveCarries: 58,
    scaPer90: 2.95,
    boxTouchesPer90: 7.9,
    recoveriesPer90: 1.9,
    tacklesInterceptionsPer90: 0.45,
    shotConversion: 26.8,
    weeklyWagePounds: 375000,
    marketValueEok: 2950,
    accentColor: '#38BDF8',
  },
  {
    id: 'player-salah',
    name: '모하메드 살라',
    englishName: 'Mohamed Salah',
    club: '리버풀',
    league: '프리미어리그',
    position: '우측 윙어 (RW)',
    positionGroup: 'FW',
    age: 33,
    nationality: '이집트',
    shirtNumber: 11,
    minutesPlayed: 2340,
    matchesPlayed: 27,
    goals: 23,
    assists: 15,
    xg: 19.8,
    npxg: 16.9,
    xa: 12.4,
    progressivePasses: 117,
    progressiveCarries: 112,
    scaPer90: 4.85,
    boxTouchesPer90: 8.4,
    recoveriesPer90: 3.6,
    tacklesInterceptionsPer90: 0.82,
    shotConversion: 22.4,
    weeklyWagePounds: 350000,
    marketValueEok: 850,
    accentColor: '#F43F5E',
  },
  {
    id: 'player-son',
    name: '손흥민',
    englishName: 'Son Heung-min',
    club: '토트넘 홋스퍼',
    league: '프리미어리그',
    position: '좌측 윙어 / ST',
    positionGroup: 'FW',
    age: 33,
    nationality: '대한민국',
    shirtNumber: 7,
    minutesPlayed: 2240,
    matchesPlayed: 26,
    goals: 16,
    assists: 10,
    xg: 12.8,
    npxg: 12.1,
    xa: 9.4,
    progressivePasses: 122,
    progressiveCarries: 98,
    scaPer90: 4.42,
    boxTouchesPer90: 6.8,
    recoveriesPer90: 4.1,
    tacklesInterceptionsPer90: 0.95,
    shotConversion: 24.6,
    weeklyWagePounds: 190000,
    marketValueEok: 680,
    accentColor: '#10B981',
  },
  {
    id: 'player-saka',
    name: '부카요 사카',
    englishName: 'Bukayo Saka',
    club: '아스널',
    league: '프리미어리그',
    position: '우측 윙어 (RW)',
    positionGroup: 'FW',
    age: 24,
    nationality: '잉글랜드',
    shirtNumber: 7,
    minutesPlayed: 2290,
    matchesPlayed: 26,
    goals: 15,
    assists: 13,
    xg: 13.1,
    npxg: 11.7,
    xa: 11.4,
    progressivePasses: 142,
    progressiveCarries: 138,
    scaPer90: 5.35,
    boxTouchesPer90: 7.4,
    recoveriesPer90: 5.2,
    tacklesInterceptionsPer90: 1.65,
    shotConversion: 19.2,
    weeklyWagePounds: 195000,
    marketValueEok: 2150,
    accentColor: '#F59E0B',
  },
  {
    id: 'player-palmer',
    name: '콜 파머',
    englishName: 'Cole Palmer',
    club: '첼시',
    league: '프리미어리그',
    position: '공격형 미드필더 / RW',
    positionGroup: 'MF',
    age: 23,
    nationality: '잉글랜드',
    shirtNumber: 20,
    minutesPlayed: 2310,
    matchesPlayed: 27,
    goals: 18,
    assists: 11,
    xg: 15.4,
    npxg: 12.2,
    xa: 10.8,
    progressivePasses: 168,
    progressiveCarries: 104,
    scaPer90: 5.62,
    boxTouchesPer90: 5.8,
    recoveriesPer90: 4.3,
    tacklesInterceptionsPer90: 1.12,
    shotConversion: 21.5,
    weeklyWagePounds: 130000,
    marketValueEok: 1980,
    accentColor: '#3B82F6',
  },
  {
    id: 'player-isak',
    name: '알렉산데르 이삭',
    englishName: 'Alexander Isak',
    club: '뉴캐슬 유나이티드',
    league: '프리미어리그',
    position: '스트라이커 (ST)',
    positionGroup: 'FW',
    age: 26,
    nationality: '스웨덴',
    shirtNumber: 14,
    minutesPlayed: 2180,
    matchesPlayed: 25,
    goals: 19,
    assists: 5,
    xg: 16.5,
    npxg: 14.3,
    xa: 4.2,
    progressivePasses: 68,
    progressiveCarries: 79,
    scaPer90: 3.45,
    boxTouchesPer90: 6.9,
    recoveriesPer90: 2.8,
    tacklesInterceptionsPer90: 0.68,
    shotConversion: 24.1,
    weeklyWagePounds: 150000,
    marketValueEok: 1650,
    accentColor: '#14B8A6',
  },
  {
    id: 'player-odegaard',
    name: '마르틴 외데고르',
    englishName: 'Martin Ødegaard',
    club: '아스널',
    league: '프리미어리그',
    position: '공격형 미드필더 (CAM)',
    positionGroup: 'MF',
    age: 27,
    nationality: '노르웨이',
    shirtNumber: 8,
    minutesPlayed: 2190,
    matchesPlayed: 25,
    goals: 8,
    assists: 11,
    xg: 7.4,
    npxg: 6.8,
    xa: 10.6,
    progressivePasses: 234,
    progressiveCarries: 92,
    scaPer90: 6.18,
    boxTouchesPer90: 4.7,
    recoveriesPer90: 5.8,
    tacklesInterceptionsPer90: 1.74,
    shotConversion: 15.8,
    weeklyWagePounds: 240000,
    marketValueEok: 1750,
    accentColor: '#EF4444',
  },
  {
    id: 'player-rodri',
    name: '로드리',
    englishName: 'Rodri',
    club: '맨체스터 시티',
    league: '프리미어리그',
    position: '수비형 미드필더 (CDM)',
    positionGroup: 'MF',
    age: 29,
    nationality: '스페인',
    shirtNumber: 16,
    minutesPlayed: 2450,
    matchesPlayed: 28,
    goals: 8,
    assists: 9,
    xg: 5.2,
    npxg: 4.9,
    xa: 6.5,
    progressivePasses: 310,
    progressiveCarries: 76,
    scaPer90: 4.12,
    boxTouchesPer90: 2.3,
    recoveriesPer90: 8.9,
    tacklesInterceptionsPer90: 3.85,
    shotConversion: 19.2,
    weeklyWagePounds: 220000,
    marketValueEok: 1950,
    accentColor: '#14B8A6',
  },
  {
    id: 'player-rice',
    name: '데클란 라이스',
    englishName: 'Declan Rice',
    club: '아스널',
    league: '프리미어리그',
    position: '중앙/수비형 미드필더',
    positionGroup: 'MF',
    age: 27,
    nationality: '잉글랜드',
    shirtNumber: 41,
    minutesPlayed: 2420,
    matchesPlayed: 28,
    goals: 6,
    assists: 8,
    xg: 4.8,
    npxg: 4.8,
    xa: 6.9,
    progressivePasses: 218,
    progressiveCarries: 88,
    scaPer90: 3.65,
    boxTouchesPer90: 2.1,
    recoveriesPer90: 7.8,
    tacklesInterceptionsPer90: 3.92,
    shotConversion: 14.5,
    weeklyWagePounds: 240000,
    marketValueEok: 1850,
    accentColor: '#EF4444',
  },
  {
    id: 'player-vandijk',
    name: '버질 판 데이크',
    englishName: 'Virgil van Dijk',
    club: '리버풀',
    league: '프리미어리그',
    position: '센터백 (CB)',
    positionGroup: 'DF',
    age: 34,
    nationality: '네덜란드',
    shirtNumber: 4,
    minutesPlayed: 2520,
    matchesPlayed: 28,
    goals: 4,
    assists: 2,
    xg: 3.4,
    npxg: 3.4,
    xa: 1.5,
    progressivePasses: 164,
    progressiveCarries: 42,
    scaPer90: 1.25,
    boxTouchesPer90: 1.6,
    recoveriesPer90: 6.9,
    tacklesInterceptionsPer90: 3.45,
    shotConversion: 16.0,
    weeklyWagePounds: 220000,
    marketValueEok: 520,
    accentColor: '#F43F5E',
  },
  {
    id: 'player-saliba',
    name: '윌리엄 살리바',
    englishName: 'William Saliba',
    club: '아스널',
    league: '프리미어리그',
    position: '센터백 (CB)',
    positionGroup: 'DF',
    age: 25,
    nationality: '프랑스',
    shirtNumber: 2,
    minutesPlayed: 2520,
    matchesPlayed: 28,
    goals: 2,
    assists: 1,
    xg: 1.9,
    npxg: 1.9,
    xa: 0.9,
    progressivePasses: 152,
    progressiveCarries: 48,
    scaPer90: 0.95,
    boxTouchesPer90: 1.1,
    recoveriesPer90: 7.4,
    tacklesInterceptionsPer90: 3.62,
    shotConversion: 13.5,
    weeklyWagePounds: 190000,
    marketValueEok: 1450,
    accentColor: '#EF4444',
  },
  // 라리가 (PD)
  {
    id: 'player-mbappe',
    name: '킬리안 음바페',
    englishName: 'Kylian Mbappé',
    club: '레알 마드리드',
    league: '라리가',
    position: '스트라이커 / LW',
    positionGroup: 'FW',
    age: 27,
    nationality: '프랑스',
    shirtNumber: 9,
    minutesPlayed: 2360,
    matchesPlayed: 27,
    goals: 24,
    assists: 6,
    xg: 21.5,
    npxg: 18.2,
    xa: 6.4,
    progressivePasses: 96,
    progressiveCarries: 148,
    scaPer90: 4.75,
    boxTouchesPer90: 8.6,
    recoveriesPer90: 2.4,
    tacklesInterceptionsPer90: 0.52,
    shotConversion: 21.8,
    weeklyWagePounds: 500000,
    marketValueEok: 2850,
    accentColor: '#F59E0B',
  },
  {
    id: 'player-vinicius',
    name: '비니시우스 주니오르',
    englishName: 'Vinícius Júnior',
    club: '레알 마드리드',
    league: '라리가',
    position: '좌측 윙어 (LW)',
    positionGroup: 'FW',
    age: 25,
    nationality: '브라질',
    shirtNumber: 7,
    minutesPlayed: 2190,
    matchesPlayed: 25,
    goals: 17,
    assists: 11,
    xg: 14.8,
    npxg: 13.5,
    xa: 9.8,
    progressivePasses: 108,
    progressiveCarries: 176,
    scaPer90: 5.84,
    boxTouchesPer90: 7.8,
    recoveriesPer90: 3.2,
    tacklesInterceptionsPer90: 0.88,
    shotConversion: 20.4,
    weeklyWagePounds: 340000,
    marketValueEok: 2800,
    accentColor: '#F59E0B',
  },
  {
    id: 'player-bellingham',
    name: '주드 벨링엄',
    englishName: 'Jude Bellingham',
    club: '레알 마드리드',
    league: '라리가',
    position: '공격형 미드필더 (CAM)',
    positionGroup: 'MF',
    age: 22,
    nationality: '잉글랜드',
    shirtNumber: 5,
    minutesPlayed: 2210,
    matchesPlayed: 25,
    goals: 15,
    assists: 9,
    xg: 11.8,
    npxg: 11.2,
    xa: 8.3,
    progressivePasses: 182,
    progressiveCarries: 96,
    scaPer90: 4.65,
    boxTouchesPer90: 5.9,
    recoveriesPer90: 6.5,
    tacklesInterceptionsPer90: 2.95,
    shotConversion: 23.1,
    weeklyWagePounds: 330000,
    marketValueEok: 2780,
    accentColor: '#A855F7',
  },
  {
    id: 'player-yamal',
    name: '라민 야말',
    englishName: 'Lamine Yamal',
    club: '바르셀로나',
    league: '라리가',
    position: '우측 윙어 (RW)',
    positionGroup: 'FW',
    age: 19,
    nationality: '스페인',
    shirtNumber: 19,
    minutesPlayed: 2260,
    matchesPlayed: 27,
    goals: 11,
    assists: 16,
    xg: 9.8,
    npxg: 9.8,
    xa: 13.6,
    progressivePasses: 136,
    progressiveCarries: 168,
    scaPer90: 6.12,
    boxTouchesPer90: 6.9,
    recoveriesPer90: 4.6,
    tacklesInterceptionsPer90: 1.48,
    shotConversion: 16.5,
    weeklyWagePounds: 95000,
    marketValueEok: 2650,
    accentColor: '#3B82F6',
  },
  {
    id: 'player-lewandowski',
    name: '로베르트 레반도프스키',
    englishName: 'Robert Lewandowski',
    club: '바르셀로나',
    league: '라리가',
    position: '스트라이커 (ST)',
    positionGroup: 'FW',
    age: 37,
    nationality: '폴란드',
    shirtNumber: 9,
    minutesPlayed: 2280,
    matchesPlayed: 27,
    goals: 22,
    assists: 4,
    xg: 19.6,
    npxg: 17.1,
    xa: 3.5,
    progressivePasses: 54,
    progressiveCarries: 41,
    scaPer90: 2.75,
    boxTouchesPer90: 7.5,
    recoveriesPer90: 2.2,
    tacklesInterceptionsPer90: 0.55,
    shotConversion: 25.4,
    weeklyWagePounds: 420000,
    marketValueEok: 280,
    accentColor: '#3B82F6',
  },
  {
    id: 'player-pedri',
    name: '페드리',
    englishName: 'Pedri',
    club: '바르셀로나',
    league: '라리가',
    position: '중앙 미드필더 (CM)',
    positionGroup: 'MF',
    age: 23,
    nationality: '스페인',
    shirtNumber: 8,
    minutesPlayed: 2140,
    matchesPlayed: 25,
    goals: 6,
    assists: 9,
    xg: 4.9,
    npxg: 4.9,
    xa: 8.6,
    progressivePasses: 248,
    progressiveCarries: 94,
    scaPer90: 5.25,
    boxTouchesPer90: 3.4,
    recoveriesPer90: 7.2,
    tacklesInterceptionsPer90: 2.85,
    shotConversion: 16.2,
    weeklyWagePounds: 165000,
    marketValueEok: 1600,
    accentColor: '#3B82F6',
  },
  {
    id: 'player-valverde',
    name: '페데리코 발베르데',
    englishName: 'Federico Valverde',
    club: '레알 마드리드',
    league: '라리가',
    position: '중앙 미드필더 (CM)',
    positionGroup: 'MF',
    age: 27,
    nationality: '우루과이',
    shirtNumber: 8,
    minutesPlayed: 2480,
    matchesPlayed: 28,
    goals: 8,
    assists: 7,
    xg: 5.4,
    npxg: 5.4,
    xa: 6.1,
    progressivePasses: 215,
    progressiveCarries: 112,
    scaPer90: 3.95,
    boxTouchesPer90: 2.8,
    recoveriesPer90: 7.6,
    tacklesInterceptionsPer90: 3.42,
    shotConversion: 17.8,
    weeklyWagePounds: 250000,
    marketValueEok: 2050,
    accentColor: '#F59E0B',
  },
  // 분데스리가 (BL1)
  {
    id: 'player-kane',
    name: '해리 케인',
    englishName: 'Harry Kane',
    club: '바이에른 뮌헨',
    league: '분데스리가',
    position: '스트라이커 (ST)',
    positionGroup: 'FW',
    age: 32,
    nationality: '잉글랜드',
    shirtNumber: 9,
    minutesPlayed: 2320,
    matchesPlayed: 26,
    goals: 26,
    assists: 9,
    xg: 21.4,
    npxg: 17.8,
    xa: 6.9,
    progressivePasses: 98,
    progressiveCarries: 46,
    scaPer90: 3.92,
    boxTouchesPer90: 6.7,
    recoveriesPer90: 2.9,
    tacklesInterceptionsPer90: 0.65,
    shotConversion: 26.2,
    weeklyWagePounds: 400000,
    marketValueEok: 1450,
    accentColor: '#DC2626',
  },
  {
    id: 'player-musiala',
    name: '자말 무시알라',
    englishName: 'Jamal Musiala',
    club: '바이에른 뮌헨',
    league: '분데스리가',
    position: '공격형 미드필더 / LW',
    positionGroup: 'MF',
    age: 23,
    nationality: '독일',
    shirtNumber: 42,
    minutesPlayed: 2150,
    matchesPlayed: 25,
    goals: 15,
    assists: 8,
    xg: 11.9,
    npxg: 11.9,
    xa: 7.8,
    progressivePasses: 146,
    progressiveCarries: 154,
    scaPer90: 5.75,
    boxTouchesPer90: 6.5,
    recoveriesPer90: 5.4,
    tacklesInterceptionsPer90: 2.15,
    shotConversion: 21.6,
    weeklyWagePounds: 185000,
    marketValueEok: 2250,
    accentColor: '#DC2626',
  },
  {
    id: 'player-wirtz',
    name: '플로리안 비르츠',
    englishName: 'Florian Wirtz',
    club: '바이어 레버쿠젠',
    league: '분데스리가',
    position: '공격형 미드필더 (CAM)',
    positionGroup: 'MF',
    age: 23,
    nationality: '독일',
    shirtNumber: 10,
    minutesPlayed: 2260,
    matchesPlayed: 26,
    goals: 13,
    assists: 14,
    xg: 10.6,
    npxg: 9.8,
    xa: 11.9,
    progressivePasses: 212,
    progressiveCarries: 142,
    scaPer90: 6.35,
    boxTouchesPer90: 5.6,
    recoveriesPer90: 5.9,
    tacklesInterceptionsPer90: 1.92,
    shotConversion: 19.8,
    weeklyWagePounds: 140000,
    marketValueEok: 2300,
    accentColor: '#EA580C',
  },
  {
    id: 'player-kimminjae',
    name: '김민재',
    englishName: 'Kim Min-jae',
    club: '바이에른 뮌헨',
    league: '분데스리가',
    position: '센터백 (CB)',
    positionGroup: 'DF',
    age: 29,
    nationality: '대한민국',
    shirtNumber: 3,
    minutesPlayed: 2390,
    matchesPlayed: 27,
    goals: 3,
    assists: 1,
    xg: 2.4,
    npxg: 2.4,
    xa: 0.8,
    progressivePasses: 198,
    progressiveCarries: 64,
    scaPer90: 1.15,
    boxTouchesPer90: 1.4,
    recoveriesPer90: 8.2,
    tacklesInterceptionsPer90: 4.18,
    shotConversion: 15.0,
    weeklyWagePounds: 195000,
    marketValueEok: 820,
    accentColor: '#DC2626',
  },
  // 세리에 A (SA)
  {
    id: 'player-lautaro',
    name: '라우타로 마르티네스',
    englishName: 'Lautaro Martínez',
    club: '인테르나치오날레',
    league: '세리에 A',
    position: '스트라이커 (ST)',
    positionGroup: 'FW',
    age: 28,
    nationality: '아르헨티나',
    shirtNumber: 10,
    minutesPlayed: 2290,
    matchesPlayed: 27,
    goals: 19,
    assists: 6,
    xg: 16.8,
    npxg: 15.6,
    xa: 5.2,
    progressivePasses: 78,
    progressiveCarries: 62,
    scaPer90: 3.68,
    boxTouchesPer90: 7.2,
    recoveriesPer90: 3.8,
    tacklesInterceptionsPer90: 1.35,
    shotConversion: 21.2,
    weeklyWagePounds: 260000,
    marketValueEok: 1750,
    accentColor: '#2563EB',
  },
  {
    id: 'player-thuram',
    name: '마르쿠스 튀랑',
    englishName: 'Marcus Thuram',
    club: '인테르나치오날레',
    league: '세리에 A',
    position: '스트라이커 (ST)',
    positionGroup: 'FW',
    age: 28,
    nationality: '프랑스',
    shirtNumber: 9,
    minutesPlayed: 2210,
    matchesPlayed: 26,
    goals: 16,
    assists: 8,
    xg: 13.4,
    npxg: 13.4,
    xa: 6.4,
    progressivePasses: 64,
    progressiveCarries: 88,
    scaPer90: 3.45,
    boxTouchesPer90: 6.6,
    recoveriesPer90: 3.1,
    tacklesInterceptionsPer90: 0.92,
    shotConversion: 23.5,
    weeklyWagePounds: 155000,
    marketValueEok: 1180,
    accentColor: '#2563EB',
  },
  {
    id: 'player-barella',
    name: '니콜로 바렐라',
    englishName: 'Nicolò Barella',
    club: '인테르나치오날레',
    league: '세리에 A',
    position: '중앙 미드필더 (CM)',
    positionGroup: 'MF',
    age: 29,
    nationality: '이탈리아',
    shirtNumber: 23,
    minutesPlayed: 2350,
    matchesPlayed: 27,
    goals: 5,
    assists: 8,
    xg: 4.2,
    npxg: 4.2,
    xa: 7.4,
    progressivePasses: 226,
    progressiveCarries: 102,
    scaPer90: 4.55,
    boxTouchesPer90: 3.2,
    recoveriesPer90: 7.1,
    tacklesInterceptionsPer90: 3.18,
    shotConversion: 14.8,
    weeklyWagePounds: 180000,
    marketValueEok: 1280,
    accentColor: '#2563EB',
  },
  {
    id: 'player-bastoni',
    name: '알레산드로 바스토니',
    englishName: 'Alessandro Bastoni',
    club: '인테르나치오날레',
    league: '세리에 A',
    position: '좌측 스토퍼 / CB',
    positionGroup: 'DF',
    age: 27,
    nationality: '이탈리아',
    shirtNumber: 95,
    minutesPlayed: 2320,
    matchesPlayed: 27,
    goals: 2,
    assists: 5,
    xg: 1.8,
    npxg: 1.8,
    xa: 4.6,
    progressivePasses: 204,
    progressiveCarries: 82,
    scaPer90: 2.45,
    boxTouchesPer90: 1.5,
    recoveriesPer90: 6.8,
    tacklesInterceptionsPer90: 3.55,
    shotConversion: 12.5,
    weeklyWagePounds: 175000,
    marketValueEok: 1150,
    accentColor: '#2563EB',
  },
  // 챔피언스리그 / 리그 1
  {
    id: 'player-leekangin',
    name: '이강인',
    englishName: 'Lee Kang-in',
    club: '파리 생제르맹',
    league: '챔피언스리그',
    position: '공격형 미드필더 / RW',
    positionGroup: 'MF',
    age: 25,
    nationality: '대한민국',
    shirtNumber: 19,
    minutesPlayed: 1890,
    matchesPlayed: 25,
    goals: 8,
    assists: 7,
    xg: 5.8,
    npxg: 5.8,
    xa: 7.4,
    progressivePasses: 178,
    progressiveCarries: 96,
    scaPer90: 5.48,
    boxTouchesPer90: 4.4,
    recoveriesPer90: 5.1,
    tacklesInterceptionsPer90: 1.62,
    shotConversion: 19.5,
    weeklyWagePounds: 115000,
    marketValueEok: 620,
    accentColor: '#6366F1',
  },
  {
    id: 'player-dembele',
    name: '우스만 뎀벨레',
    englishName: 'Ousmane Dembélé',
    club: '파리 생제르맹',
    league: '챔피언스리그',
    position: '우측/좌측 윙어',
    positionGroup: 'FW',
    age: 28,
    nationality: '프랑스',
    shirtNumber: 10,
    minutesPlayed: 2120,
    matchesPlayed: 26,
    goals: 18,
    assists: 11,
    xg: 14.9,
    npxg: 14.1,
    xa: 10.8,
    progressivePasses: 145,
    progressiveCarries: 184,
    scaPer90: 6.42,
    boxTouchesPer90: 7.6,
    recoveriesPer90: 4.2,
    tacklesInterceptionsPer90: 1.15,
    shotConversion: 19.6,
    weeklyWagePounds: 310000,
    marketValueEok: 1150,
    accentColor: '#6366F1',
  },
  {
    id: 'player-hakimi',
    name: '아슈라프 하키미',
    englishName: 'Achraf Hakimi',
    club: '파리 생제르맹',
    league: '챔피언스리그',
    position: '우측 풀백 / 윙백 (RB)',
    positionGroup: 'DF',
    age: 27,
    nationality: '모로코',
    shirtNumber: 2,
    minutesPlayed: 2380,
    matchesPlayed: 27,
    goals: 5,
    assists: 9,
    xg: 4.2,
    npxg: 4.2,
    xa: 7.9,
    progressivePasses: 210,
    progressiveCarries: 136,
    scaPer90: 4.15,
    boxTouchesPer90: 3.9,
    recoveriesPer90: 6.7,
    tacklesInterceptionsPer90: 3.28,
    shotConversion: 14.2,
    weeklyWagePounds: 230000,
    marketValueEok: 1050,
    accentColor: '#6366F1',
  },
];

function clampPercentile(val: number): number {
  return Math.max(12, Math.min(99, Math.round(val)));
}

/**
 * Normalizes a raw player record into an EnrichedPlayerBigData profile with
 * per-90 metrics, positional percentiles (0-99%), FotMob rating, value efficiency, and tactical badges.
 */
export function enrichPlayerBigDataList(rawList: RawPlayerBigData[]): EnrichedPlayerBigData[] {
  return rawList.map((raw) => {
    const nineties = Math.max(1, raw.minutesPlayed / 90);
    const goalsPer90 = Number((raw.goals / nineties).toFixed(2));
    const assistsPer90 = Number((raw.assists / nineties).toFixed(2));
    const xgPer90 = Number((raw.xg / nineties).toFixed(2));
    const npxgPer90 = Number((raw.npxg / nineties).toFixed(2));
    const xaPer90 = Number((raw.xa / nineties).toFixed(2));
    const prgPassesPer90 = Number((raw.progressivePasses / nineties).toFixed(2));
    const prgCarriesPer90 = Number((raw.progressiveCarries / nineties).toFixed(2));
    const gMinusXg = Number((raw.goals - raw.xg).toFixed(2));
    const goalContributionPer90 = Number(((raw.goals + raw.assists) / nineties).toFixed(2));

    // Positional calibration scales for realistic European Big 5 percentiles
    const pos = raw.positionGroup;
    const npxgRef = pos === 'FW' ? 0.72 : pos === 'MF' ? 0.35 : 0.14;
    const xaRef = pos === 'FW' ? 0.38 : pos === 'MF' ? 0.42 : 0.22;
    const boxRef = pos === 'FW' ? 7.8 : pos === 'MF' ? 4.8 : 2.4;
    const prgPRef = pos === 'FW' ? 5.2 : pos === 'MF' ? 9.5 : 7.8;
    const recRef = pos === 'FW' ? 4.5 : pos === 'MF' ? 7.8 : 7.8;
    const convRef = pos === 'FW' ? 25.0 : pos === 'MF' ? 20.0 : 16.0;

    const pNpxg = clampPercentile((npxgPer90 / npxgRef) * 90);
    const pXa = clampPercentile((xaPer90 / xaRef) * 90);
    const pBox = clampPercentile((raw.boxTouchesPer90 / boxRef) * 88);
    const pPrgP = clampPercentile((prgPassesPer90 / prgPRef) * 90);
    const pRec = clampPercentile((raw.recoveriesPer90 / recRef) * 88);
    const pConv = clampPercentile((raw.shotConversion / convRef) * 90);
    const pSca = clampPercentile((raw.scaPer90 / (pos === 'DF' ? 3.2 : 5.6)) * 90);
    const pDef = clampPercentile((raw.tacklesInterceptionsPer90 / (pos === 'DF' ? 3.8 : 2.4)) * 88);
    const pFinish = clampPercentile(70 + gMinusXg * 6.5);

    const radarMetrics: RadarMetricPoint[] = [
      {
        axis: '기대 득점 npxG',
        shortLabel: '기대 득점',
        per90Value: npxgPer90,
        unit: 'npxG/90',
        percentile: pNpxg,
      },
      {
        axis: '기대 도움 xA',
        shortLabel: '기대 도움',
        per90Value: xaPer90,
        unit: 'xA/90',
        percentile: pXa,
      },
      {
        axis: '박스 내 터치',
        shortLabel: '박스 터치',
        per90Value: Number(raw.boxTouchesPer90.toFixed(1)),
        unit: '회/90',
        percentile: pBox,
      },
      {
        axis: '전진 패스',
        shortLabel: '전진 패스',
        per90Value: prgPassesPer90,
        unit: '회/90',
        percentile: pPrgP,
      },
      {
        axis: '볼 리커버리',
        shortLabel: '리커버리',
        per90Value: Number(raw.recoveriesPer90.toFixed(1)),
        unit: '회/90',
        percentile: pRec,
      },
      {
        axis: '슈팅 전환율',
        shortLabel: '슈팅 전환율',
        per90Value: Number(raw.shotConversion.toFixed(1)),
        unit: '%',
        percentile: pConv,
      },
    ];

    const avgPercentile =
      radarMetrics.reduce((acc, m) => acc + m.percentile, 0) / radarMetrics.length;

    const wageFactor = Math.max(0.6, Math.min(1.6, raw.weeklyWagePounds / 220000));
    const valueEfficiencyScore = clampPercentile(avgPercentile * 1.06 - (wageFactor - 1) * 14);

    const fotmobRating = Number(
      Math.max(
        6.9,
        Math.min(
          8.9,
          7.15 +
            goalContributionPer90 * 0.85 +
            (prgPassesPer90 / 12) * 0.35 +
            (raw.tacklesInterceptionsPer90 / 4) * 0.25
        )
      ).toFixed(1)
    );

    const weeklyWageKrwEok = Number(((raw.weeklyWagePounds * 1750) / 100000000).toFixed(1));
    const annualWageKrwEok = Math.round(weeklyWageKrwEok * 52);

    const tacticalBadges: string[] = [];
    if (gMinusXg >= 1.5) tacticalBadges.push('xG 초과 달성 결정력 크랙');
    if (pNpxg >= 90 || pBox >= 90) tacticalBadges.push('박스 타격형 엘리트');
    if (pXa >= 88 || pSca >= 88) tacticalBadges.push('찬스 메이킹 마에스트로');
    if (pPrgP >= 88) tacticalBadges.push('전진 빌드업 코어');
    if (pDef >= 85 || pRec >= 88) tacticalBadges.push('볼 위닝 & 압박 엔진');
    if (valueEfficiencyScore >= 90) tacticalBadges.push('초고효율 가성비 자산');
    if (tacticalBadges.length === 0) tacticalBadges.push('밸런스형 전술 코어');

    const detailedPercentiles: {
      attack: PercentileBreakdownItem[];
      possession: PercentileBreakdownItem[];
      defense: PercentileBreakdownItem[];
      financial: PercentileBreakdownItem[];
    } = {
      attack: [
        {
          metricName: '비페널티 기대 득점 (npxG)',
          per90Display: `${npxgPer90}`,
          percentile: pNpxg,
          description: '90분당 페널티킥 제외 순수 오픈플레이 기대 득점',
        },
        {
          metricName: '결정력 마진 (실제 득점 - xG)',
          per90Display: `${gMinusXg >= 0 ? '+' : ''}${gMinusXg}골`,
          percentile: pFinish,
          description: '기대 득점 대비 실제 마무리 초과/미달 마진',
        },
        {
          metricName: '슈팅 전환율 (Shot Conversion)',
          per90Display: `${raw.shotConversion.toFixed(1)}%`,
          percentile: pConv,
          description: '전체 슈팅 대비 실제 득점 성공 비율',
        },
        {
          metricName: '페널티 박스 내 터치',
          per90Display: `${raw.boxTouchesPer90.toFixed(1)}회`,
          percentile: pBox,
          description: '90분당 상대 위험 지역 침투 및 볼 수용 빈도',
        },
      ],
      possession: [
        {
          metricName: '기대 도움 (xA)',
          per90Display: `${xaPer90}`,
          percentile: pXa,
          description: '동료의 슈팅으로 연결된 패스의 기대 득점 합계',
        },
        {
          metricName: '슛 창출 액션 (SCA / 90)',
          per90Display: `${raw.scaPer90.toFixed(2)}회`,
          percentile: pSca,
          description: '90분당 슈팅 직전 2번의 핵심 공격 관여 횟수',
        },
        {
          metricName: '전진 패스 성공 (PrgP / 90)',
          per90Display: `${prgPassesPer90}회`,
          percentile: pPrgP,
          description: '상대 골문 방향으로 10m 이상 전진시킨 패스',
        },
      ],
      defense: [
        {
          metricName: '태클 + 인터셉트 (Tkl+Int / 90)',
          per90Display: `${raw.tacklesInterceptionsPer90.toFixed(2)}회`,
          percentile: pDef,
          description: '90분당 직접적인 수비 볼 탈취 및 패스 차단',
        },
        {
          metricName: '볼 리커버리 (Recoveries / 90)',
          per90Display: `${raw.recoveriesPer90.toFixed(1)}회`,
          percentile: pRec,
          description: '루즈볼 회수 및 세컨드볼 소유권 탈환',
        },
      ],
      financial: [
        {
          metricName: '90분당 공격포인트 생산성',
          per90Display: `${goalContributionPer90} P/90`,
          percentile: clampPercentile(goalContributionPer90 * 78),
          description: `출전 ${raw.minutesPlayed.toLocaleString()}분 기준 90분당 득점+도움`,
        },
        {
          metricName: '주급 대비 온피치 가성비 지수',
          per90Display: `${valueEfficiencyScore}점`,
          percentile: valueEfficiencyScore,
          description: `추정 주급 £${Math.round(raw.weeklyWagePounds / 1000)}K 대비 퍼포먼스 효율`,
        },
      ],
    };

    return {
      id: raw.id,
      name: raw.name,
      englishName: raw.englishName,
      club: raw.club,
      teamCrest: raw.teamCrest,
      league: raw.league,
      position: raw.position,
      positionGroup: raw.positionGroup,
      age: raw.age,
      nationality: raw.nationality,
      shirtNumber: raw.shirtNumber,
      fotmobRating,
      weeklyWagePounds: raw.weeklyWagePounds,
      weeklyWageKrwText: `약 ${weeklyWageKrwEok}억 원 (£${Math.round(raw.weeklyWagePounds / 1000)}K)`,
      annualWageKrwEok,
      marketValueEok: raw.marketValueEok,
      valueEfficiencyScore,
      minutesPlayed: raw.minutesPlayed,
      matchesPlayed: raw.matchesPlayed,
      goals: raw.goals,
      assists: raw.assists,
      xg: raw.xg,
      npxg: raw.npxg,
      xa: raw.xa,
      gMinusXg,
      goalsPer90,
      assistsPer90,
      xgPer90,
      npxgPer90,
      xaPer90,
      prgPassesPer90,
      prgCarriesPer90,
      scaPer90: raw.scaPer90,
      boxTouchesPer90: raw.boxTouchesPer90,
      recoveriesPer90: raw.recoveriesPer90,
      tacklesInterceptionsPer90: raw.tacklesInterceptionsPer90,
      shotConversion: raw.shotConversion,
      goalContributionPer90,
      tacticalBadges,
      accentColor: raw.accentColor,
      radarMetrics,
      detailedPercentiles,
      isLiveSynced: raw.isLiveSynced,
    };
  });
}

/**
 * Merges real-time current-season scorer data from Football-Data.org `/scorers` API
 * into our Big Data player records so live goals, assists, matches, and newly emerging top scorers appear immediately.
 */
export function mergeLiveScorersIntoBigData(
  baseList: RawPlayerBigData[],
  liveScorers: LiveApiScorerItem[],
  leagueLabel: Exclude<LeagueFilter, '전체'>
): RawPlayerBigData[] {
  if (!Array.isArray(liveScorers) || liveScorers.length === 0) {
    return baseList;
  }

  const updatedMap = new Map<string, RawPlayerBigData>();
  for (const p of baseList) {
    updatedMap.set(p.id, { ...p });
  }

  for (const scorer of liveScorers) {
    const existing = Array.from(updatedMap.values()).find(
      (p) =>
        p.name === scorer.koreanName ||
        p.englishName.toLowerCase() === scorer.englishName.toLowerCase()
    );

    const estimatedMinutes = Math.max(270, scorer.playedMatches * 82);
    const nonPenGoals = Math.max(0, scorer.goals - (scorer.penalties || 0));

    if (existing) {
      existing.goals = scorer.goals;
      existing.assists = scorer.assists;
      existing.matchesPlayed = scorer.playedMatches;
      existing.minutesPlayed = estimatedMinutes;
      existing.club = scorer.teamName || existing.club;
      existing.teamCrest = scorer.teamCrest || existing.teamCrest;
      existing.xg = Number(Math.max(1.2, scorer.goals * 0.88).toFixed(2));
      existing.npxg = Number(Math.max(1.0, nonPenGoals * 0.88).toFixed(2));
      existing.xa = Number(Math.max(0.8, scorer.assists * 0.86).toFixed(2));
      existing.isLiveSynced = true;
    } else {
      const newId = `live-player-${scorer.id}`;
      const nineties = estimatedMinutes / 90;
      updatedMap.set(newId, {
        id: newId,
        name: scorer.koreanName,
        englishName: scorer.englishName,
        club: scorer.teamName,
        teamCrest: scorer.teamCrest,
        league: leagueLabel,
        position: '공격수 / 윙어 (FW)',
        positionGroup: 'FW',
        age: 25,
        nationality: scorer.nationality || '유럽',
        shirtNumber: 9,
        minutesPlayed: estimatedMinutes,
        matchesPlayed: scorer.playedMatches,
        goals: scorer.goals,
        assists: scorer.assists,
        xg: Number((scorer.goals * 0.89).toFixed(2)),
        npxg: Number((nonPenGoals * 0.88).toFixed(2)),
        xa: Number(Math.max(1.2, scorer.assists * 0.88).toFixed(2)),
        progressivePasses: Math.round(nineties * 3.8),
        progressiveCarries: Math.round(nineties * 3.5),
        scaPer90: Number(Math.min(6.0, 2.8 + scorer.goalContributionPerMatch * 2.1).toFixed(2)),
        boxTouchesPer90: Number(Math.min(8.8, 4.8 + (scorer.goals / nineties) * 3.2).toFixed(1)),
        recoveriesPer90: 3.5,
        tacklesInterceptionsPer90: 0.95,
        shotConversion: Number(Math.min(28.0, 16.5 + (scorer.goals / nineties) * 8.5).toFixed(1)),
        weeklyWagePounds: 145000,
        marketValueEok: 950,
        accentColor: '#10B981',
        isLiveSynced: true,
      });
    }
  }

  return Array.from(updatedMap.values());
}

/**
 * Parses uploaded JSON (from Python `collect_bigdata.py`) or CSV files into RawPlayerBigData[]
 */
export function parseUploadedPlayerDataset(content: string, fileName: string): RawPlayerBigData[] {
  const leagueMap: Record<string, Exclude<LeagueFilter, '전체'>> = {
    'ENG-Premier League': '프리미어리그',
    'Premier League': '프리미어리그',
    'ESP-La Liga': '라리가',
    'La Liga': '라리가',
    'GER-Bundesliga': '분데스리가',
    'Bundesliga': '분데스리가',
    'ITA-Serie A': '세리에 A',
    'Serie A': '세리에 A',
    'FRA-Ligue 1': '챔피언스리그',
    'Ligue 1': '챔피언스리그',
  };

  let rawObjects: any[] = [];
  if (fileName.toLowerCase().endsWith('.json')) {
    const parsed = JSON.parse(content);
    rawObjects = Array.isArray(parsed) ? parsed : [];
  } else {
    // Simple CSV parser
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim());
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      const rowObj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cols[idx];
      });
      rawObjects.push(rowObj);
    }
  }

  return rawObjects
    .map((item, idx): RawPlayerBigData | null => {
      const englishName = String(item.player_name || item.name || '').trim();
      if (!englishName) return null;

      const minutes = Number(item.minutes_played ?? item.minutesPlayed ?? 900);
      if (minutes < 90) return null;

      const rawPos = String(item.position || 'FW').toUpperCase();
      const posGroup: PositionGroup = rawPos.includes('DF')
        ? 'DF'
        : rawPos.includes('MF')
        ? 'MF'
        : 'FW';

      const goals = Number(item.goals ?? 0);
      const assists = Number(item.assists ?? 0);
      const xg = Number(item.xg ?? goals * 0.88);
      const npxg = Number(item.npxg ?? xg * 0.9);
      const xa = Number(item.xa ?? assists * 0.88);
      const rawLeague = String(item.league || '프리미어리그');

      return {
        id: String(item.player_id || `uploaded-${idx}`),
        name: getKoreanPlayerName(englishName),
        englishName,
        club: getKoreanTeamName(String(item.team_name || item.club || '유럽 클럽')),
        league: leagueMap[rawLeague] || (rawLeague as Exclude<LeagueFilter, '전체'>) || '프리미어리그',
        position: posGroup === 'FW' ? '공격수 (FW)' : posGroup === 'MF' ? '미드필더 (MF)' : '수비수 (DF)',
        positionGroup: posGroup,
        age: Number(item.age ?? 25),
        nationality: String(item.nationality || '유럽'),
        shirtNumber: Number(item.shirt_number ?? 10),
        minutesPlayed: minutes,
        matchesPlayed: Number(item.matches_played ?? Math.max(1, Math.round(minutes / 80))),
        goals,
        assists,
        xg,
        npxg,
        xa,
        progressivePasses: Number(item.progressive_passes ?? 85),
        progressiveCarries: Number(item.progressive_carries ?? 65),
        scaPer90: Number(item.sca_per90 ?? item.shot_creating_actions_per90 ?? 3.6),
        boxTouchesPer90: Number(item.box_touches_per90 ?? (posGroup === 'FW' ? 6.4 : 3.2)),
        recoveriesPer90: Number(item.recoveries_per90 ?? 5.1),
        tacklesInterceptionsPer90: Number(item.tackles_interceptions_per90 ?? 1.8),
        shotConversion: Number(item.shot_conversion ?? 19.5),
        weeklyWagePounds: Number(item.weekly_wage_pounds ?? 160000),
        marketValueEok: Number(item.market_value_eok ?? 950),
        accentColor: '#10B981',
        isLiveSynced: true,
      };
    })
    .filter((p): p is RawPlayerBigData => p !== null);
}
