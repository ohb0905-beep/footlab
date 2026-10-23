// src/lib/footballApi.ts

const BASE_URL = 'https://api.football-data.org/v4';

// 주요 구단 한국어 이름 매핑 사전 (필요에 따라 추가)
export const TEAM_NAME_KO: Record<string, string> = {
  // 프리미어리그 (PL)
  'Arsenal FC': '아스널',
  'Arsenal': '아스널',
  'Manchester City FC': '맨체스터 시티',
  'Man City': '맨체스터 시티',
  'Liverpool FC': '리버풀',
  'Liverpool': '리버풀',
  'Chelsea FC': '첼시',
  'Chelsea': '첼시',
  'Tottenham Hotspur FC': '토트넘 홋스퍼',
  'Tottenham': '토트넘 홋스퍼',
  'Manchester United FC': '맨체스터 유나이티드',
  'Man United': '맨체스터 유나이티드',
  'Newcastle United FC': '뉴캐슬 유나이티드',
  'Newcastle': '뉴캐슬 유나이티드',
  'Aston Villa FC': '애스턴 빌라',
  'Aston Villa': '애스턴 빌라',
  'Brighton & Hove Albion FC': '브라이튼',
  'Brighton Hove': '브라이튼',
  'West Ham United FC': '웨스트햄 유나이티드',
  'West Ham': '웨스트햄 유나이티드',
  'AFC Bournemouth': '본머스',
  'Bournemouth': '본머스',
  'Fulham FC': '풀럼',
  'Fulham': '풀럼',
  'Brentford FC': '브렌트포드',
  'Brentford': '브렌트포드',
  'Crystal Palace FC': '크리스탈 팰리스',
  'Crystal Palace': '크리스탈 팰리스',
  'Wolverhampton Wanderers FC': '울버햄튼 원더러스',
  'Wolverhampton': '울버햄튼 원더러스',
  'Everton FC': '에버턴',
  'Everton': '에버턴',
  'Nottingham Forest FC': '노팅엄 포레스트',
  'Nottingham': '노팅엄 포레스트',
  'Leicester City FC': '레스터 시티',
  'Leicester City': '레스터 시티',
  'Ipswich Town FC': '입스위치 타운',
  'Ipswich Town': '입스위치 타운',
  'Southampton FC': '사우샘프턴',
  'Southampton': '사우샘프턴',
  'Luton Town FC': '루턴 타운',
  'Luton Town': '루턴 타운',
  'Burnley FC': '번리',
  'Burnley': '번리',
  'Sheffield United FC': '셰필드 유나이티드',
  'Sheffield Utd': '셰필드 유나이티드',
  'Leeds United FC': '리즈 유나이티드',
  'Leeds United': '리즈 유나이티드',
  'Sunderland AFC': '선덜랜드',
  'Sunderland': '선덜랜드',
  'Hull City AFC': '헐 시티',
  'Hull City': '헐 시티',
  'Middlesbrough FC': '미들즈브러',
  'Middlesbrough': '미들즈브러',
  'Coventry City FC': '코번트리 시티',
  'Coventry City': '코번트리 시티',
  'West Bromwich Albion FC': '웨스트 브로미치 앨비언',
  'West Brom': '웨스트 브로미치 앨비언',
  'Norwich City FC': '노리치 시티',
  'Norwich': '노리치 시티',
  'Watford FC': '왓포드',
  'Watford': '왓포드',
  'Blackburn Rovers FC': '블랙번 로버스',
  'Blackburn': '블랙번 로버스',
  'Bristol City FC': '브리스톨 시티',
  'Bristol City': '브리스톨 시티',
  'Millwall FC': '밀월',
  'Millwall': '밀월',
  'Swansea City AFC': '스완지 시티',
  'Swansea': '스완지 시티',
  'Stoke City FC': '스토크 시티',
  'Stoke': '스토크 시티',
  'Derby County FC': '더비 카운티',
  'Derby County': '더비 카운티',
  'Portsmouth FC': '포츠머스',
  'Portsmouth': '포츠머스',
  'Oxford United FC': '옥스퍼드 유나이티드',
  'Oxford Utd': '옥스퍼드 유나이티드',
  'Queens Park Rangers FC': '퀸즈 파크 레인저스',
  'QPR': '퀸즈 파크 레인저스',
  'Sheffield Wednesday FC': '셰필드 웬즈데이',
  'Sheffield Wed': '셰필드 웬즈데이',
  'Preston North End FC': '프레스턴 노스 엔드',
  'Preston': '프레스턴 노스 엔드',
  'Birmingham City FC': '버밍엄 시티',
  'Birmingham': '버밍엄 시티',
  'Wrexham AFC': '렉섬',
  'Wrexham': '렉섬',
  // 라리가 (PD)
  'Real Madrid CF': '레알 마드리드',
  'Real Madrid': '레알 마드리드',
  'FC Barcelona': '바르셀로나',
  'Barcelona': '바르셀로나',
  'Club Atlético de Madrid': '아틀레티코 마드리드',
  'Atleti': '아틀레티코 마드리드',
  'Real Sociedad de Fútbol': '레알 소시에다드',
  'Athletic Club': '아틀레틱 클루브',
  'Villarreal CF': '비야레알',
  'Real Betis Balompié': '레알 베티스',
  'Girona FC': '지로나',
  'Sevilla FC': '세비야',
  'Valencia CF': '발렌시아',
  // 분데스리가 (BL1)
  'FC Bayern München': '바이에른 뮌헨',
  'Bayern': '바이에른 뮌헨',
  'Bayer 04 Leverkusen': '바이어 레버쿠젠',
  'Leverkusen': '바이어 레버쿠젠',
  'Borussia Dortmund': '보루시아 도르트문트',
  'Dortmund': '보루시아 도르트문트',
  'RB Leipzig': '라이프치히',
  'VfB Stuttgart': '슈투트가르트',
  'Eintracht Frankfurt': '프랑크푸르트',
  '1. FSV Mainz 05': '마인츠 05',
  // 세리에 A (SA)
  'FC Internazionale Milano': '인테르나치오날레',
  'Inter': '인테르나치오날레',
  'SSC Napoli': '나폴리',
  'Napoli': '나폴리',
  'AC Milan': 'AC 밀란',
  'Milan': 'AC 밀란',
  'Juventus FC': '유벤투스',
  'Juventus': '유벤투스',
  'Atalanta BC': '아탈란타',
  'AS Roma': 'AS 로마',
  'SS Lazio': '라치오',
  // 챔피언스리그 / 기타 유럽
  'Paris Saint-Germain FC': '파리 생제르맹',
  'PSG': '파리 생제르맹',
  'SL Benfica': '벤피카',
  'Sporting Clube de Portugal': '스포르팅 CP',
  'FC Porto': '포르투',
  'PSV': 'PSV 에인트호번',
  'Feyenoord Rotterdam': '페예노르트',
};

// 영문 구단명을 한국어로 변환해주는 헬퍼 함수
export function getKoreanTeamName(englishName: string, shortName?: string): string {
  return TEAM_NAME_KO[englishName] || shortName || englishName;
}

// 공통 Fetch 함수 (서버 사이드 전용 + 캐싱 적용)
async function fetchFootballData(endpoint: string, revalidateSeconds = 3600) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'X-Auth-Token': apiKey,
    },
    // 핵심: Next.js 서버에 결과를 캐싱하여 분당 10회 제한(429 에러) 완벽 방지
    next: { revalidate: revalidateSeconds },
  });

  if (res.status === 429) {
    throw new Error('API 호출 한도(분당 10회)를 초과했습니다. 잠시 후 다시 시도해주세요.');
  }

  if (!res.ok) {
    throw new Error(`데이터 호출 실패 (상태 코드: ${res.status})`);
  }

  return res.json();
}

// 1. 특정 리그의 현재 순위표 가져오기 (1시간 캐싱)
export async function getLeagueStandings(leagueCode: string = 'PL') {
  const data = await fetchFootballData(`/competitions/${leagueCode}/standings`, 3600);
  // TOTAL(전체 경기 기준) 순위표만 추출
  return data.standings.find((s: any) => s.type === 'TOTAL')?.table || [];
}

// 2. 특정 리그의 경기 일정/결과 가져오기 (10분 캐싱)
export async function getLeagueMatches(leagueCode: string = 'PL', matchday?: number) {
  const query = matchday ? `?matchday=${matchday}` : '';
  const data = await fetchFootballData(`/competitions/${leagueCode}/matches${query}`, 600);
  return data.matches || [];
}