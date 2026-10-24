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
  'RC Celta de Vigo': '셀타 비고',
  'CA Osasuna': '오사수나',
  'RCD Mallorca': '마요르카',
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
  'SC Freiburg': '프라이부르크',
  'VfL Wolfsburg': '볼프스부르크',
  'Borussia Mönchengladbach': '묀헨글라트바흐',
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
  'ACF Fiorentina': '피오렌티나',
  'Bologna FC 1909': '볼로냐',
  // 챔피언스리그 / 기타 유럽
  'Paris Saint-Germain FC': '파리 생제르맹',
  'PSG': '파리 생제르맹',
  'SL Benfica': '벤피카',
  'Sporting Clube de Portugal': '스포르팅 CP',
  'FC Porto': '포르투',
  'PSV': 'PSV 에인트호번',
  'Feyenoord Rotterdam': '페예노르트',
};

// 주요 선수 한국어 이름 매핑 사전
export const PLAYER_NAME_KO: Record<string, string> = {
  'Son Heung-min': '손흥민',
  'Heung-Min Son': '손흥민',
  'Erling Haaland': '엘링 홀란드',
  'Mohamed Salah': '모하메드 살라',
  'Bukayo Saka': '부카요 사카',
  'Cole Palmer': '콜 파머',
  'Alexander Isak': '알렉산데르 이삭',
  'Ollie Watkins': '올리 왓킨스',
  'Bruno Fernandes': '브루노 페르난데스',
  'Martin Ødegaard': '마르틴 외데고르',
  'Declan Rice': '데클란 라이스',
  'Rodri': '로드리',
  'Rodrigo': '로드리',
  'Phil Foden': '필 포든',
  'Luis Díaz': '루이스 디아스',
  'Bryan Mbeumo': '브라이언 음뵈모',
  'Chris Wood': '크리스 우드',
  'Matheus Cunha': '마테우스 쿠냐',
  'Yoane Wissa': '요안 위사',
  'Nicolas Jackson': '니콜라스 잭슨',
  'virgil van Dijk': '버질 판 데이크',
  'Virgil van Dijk': '버질 판 데이크',
  'William Saliba': '윌리엄 살리바',
  'Trent Alexander-Arnold': '트렌트 알렉산더아놀드',
  'Kylian Mbappé': '킬리안 음바페',
  'Robert Lewandowski': '로베르트 레반도프스키',
  'Lamine Yamal': '라민 야말',
  'Raphinha': '하피냐',
  'Vinícius Júnior': '비니시우스 주니오르',
  'Jude Bellingham': '주드 벨링엄',
  'Federico Valverde': '페데리코 발베르데',
  'Pedri': '페드리',
  'Antoine Griezmann': '앙투안 그리즈만',
  'Julián Álvarez': '훌리안 알바레스',
  'Alexander Sørloth': '알렉산데르 쇨로트',
  'Takefusa Kubo': '쿠보 다케후사',
  'Harry Kane': '해리 케인',
  'Jamal Musiala': '자말 무시알라',
  'Florian Wirtz': '플로리안 비르츠',
  'Michael Olise': '마이클 올리세',
  'Omar Marmoush': '오마르 마르무시',
  'Serhou Guirassy': '세루 기라시',
  'Tim Kleindienst': '팀 클라인딘스트',
  'Granit Xhaka': '그라니트 자카',
  'Joshua Kimmich': '요주아 키미히',
  'Min-jae Kim': '김민재',
  'Kim Min-jae': '김민재',
  'Jae-sung Lee': '이재성',
  'Lee Jae-sung': '이재성',
  'Lautaro Martínez': '라우타로 마르티네스',
  'Marcus Thuram': '마르쿠스 튀랑',
  'Mateo Retegui': '마테오 레테기',
  'Moise Kean': '모이스 킨',
  'Ademola Lookman': '아데몰라 루크먼',
  'Christian Pulisic': '크리스티안 풀리식',
  'Rafael Leão': '하파엘 레앙',
  'Dušan Vlahović': '두산 블라호비치',
  'Khvicha Kvaratskhelia': '흐비차 크바라츠헬리아',
  'Nicolò Barella': '니콜로 바렐라',
  'Hakan Çalhanoğlu': '하칸 찰하놀루',
  'Alessandro Bastoni': '알레산드로 바스토니',
  'Ousmane Dembélé': '우스만 뎀벨레',
  'Bradley Barcola': '브래들리 바르콜라',
  'Kang-in Lee': '이강인',
  'Lee Kang-in': '이강인',
  'Vitinha': '비티냐',
  'Achraf Hakimi': '아슈라프 하키미',
  'Viktor Gyökeres': '빅토르 요케레스',
};

// 영문 구단명을 한국어로 변환해주는 헬퍼 함수
export function getKoreanTeamName(englishName: string, shortName?: string): string {
  return TEAM_NAME_KO[englishName] || (shortName && TEAM_NAME_KO[shortName]) || shortName || englishName;
}

// 영문 선수명을 한국어로 변환해주는 헬퍼 함수
export function getKoreanPlayerName(englishName: string): string {
  return PLAYER_NAME_KO[englishName] || englishName;
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

export interface LiveApiScorerItem {
  id: number;
  englishName: string;
  koreanName: string;
  position: string;
  nationality: string;
  teamName: string;
  teamCrest: string;
  playedMatches: number;
  goals: number;
  assists: number;
  penalties: number;
  goalContributionPerMatch: number;
}

// 3. 특정 리그의 현재 시즌 실시간 선수 기록(득점/도움/출전수) 가져오기 (30분 캐싱)
export async function getLeagueScorers(
  leagueCode: string = 'PL',
  limit: number = 35
): Promise<LiveApiScorerItem[]> {
  const data = await fetchFootballData(`/competitions/${leagueCode}/scorers?limit=${limit}`, 1800);

  return (data.scorers || []).map((item: any) => {
    const englishName = item.player?.name || 'Unknown Player';
    const playedMatches = Math.max(1, item.playedMatches || 1);
    const goals = item.goals ?? 0;
    const assists = item.assists ?? 0;

    return {
      id: item.player?.id || Math.floor(Math.random() * 100000),
      englishName,
      koreanName: getKoreanPlayerName(englishName),
      position: item.player?.section || item.player?.position || 'Offence',
      nationality: item.player?.nationality || '유럽',
      teamName: getKoreanTeamName(item.team?.name || '', item.team?.shortName),
      teamCrest: item.team?.crest || '',
      playedMatches,
      goals,
      assists,
      penalties: item.penalties ?? 0,
      goalContributionPerMatch: Number(((goals + assists) / playedMatches).toFixed(2)),
    };
  });
}
