import { NextRequest, NextResponse } from 'next/server';
import {
  getLeagueStandings,
  getLeagueMatches,
  getKoreanTeamName,
} from '@/lib/footballApi';
import {
  LEAGUE_CODE_MAP,
  transformStandings,
  transformMatches,
} from '@/lib/footballMapper';
import { MATCHES_DATA, type LeagueFilter } from '@/lib/football-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leagueParam = (searchParams.get('league') || '프리미어리그') as LeagueFilter;

  const targetLeagueLabel: Exclude<LeagueFilter, '전체'> =
    leagueParam === '전체' ? '프리미어리그' : leagueParam;
  const leagueCode = LEAGUE_CODE_MAP[targetLeagueLabel] || 'PL';

  try {
    const [rawStandings, rawMatches] = await Promise.all([
      getLeagueStandings(leagueCode),
      getLeagueMatches(leagueCode),
    ]);

    const standings = transformStandings(rawStandings, rawMatches);
    const matches = transformMatches(rawMatches, standings, targetLeagueLabel);

    return NextResponse.json({
      source: 'live',
      leagueLabel: targetLeagueLabel,
      leagueCode,
      standings,
      matches,
      teamNameSample: standings[0]
        ? getKoreanTeamName(standings[0].teamName)
        : null,
    });
  } catch (error: any) {
    const fallbackMatches =
      leagueParam === '전체'
        ? MATCHES_DATA
        : MATCHES_DATA.filter((m) => m.league === targetLeagueLabel);

    return NextResponse.json({
      source: 'fallback',
      leagueLabel: targetLeagueLabel,
      leagueCode,
      error: error?.message || '데이터 호출 중 오류가 발생했습니다.',
      standings: [],
      matches: fallbackMatches,
    });
  }
}
