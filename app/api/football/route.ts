import { NextRequest, NextResponse } from 'next/server';
import {
  getLeagueStandings,
  getLeagueMatches,
  getLeagueScorers,
  getKoreanTeamName,
} from '@/lib/footballApi';
import {
  LEAGUE_CODE_MAP,
  transformStandings,
  transformMatches,
} from '@/lib/footballMapper';
import { MATCHES_DATA, type LeagueFilter } from '@/lib/football-data';

async function fetchSupabasePlayersIfConfigured() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl === 'MY_SUPABASE_URL' ||
    !supabaseUrl.startsWith('http')
  ) {
    return [];
  }

  try {
    const res = await fetch(
      `${supabaseUrl.replace(/\/$/, '')}/rest/v1/player_season_stats?select=*&limit=300`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leagueParam = (searchParams.get('league') || '프리미어리그') as LeagueFilter;

  const targetLeagueLabel: Exclude<LeagueFilter, '전체'> =
    leagueParam === '전체' ? '프리미어리그' : leagueParam;
  const leagueCode = LEAGUE_CODE_MAP[targetLeagueLabel] || 'PL';

  try {
    const [standingsRes, matchesRes, scorersRes, supabasePlayers] =
      await Promise.all([
        getLeagueStandings(leagueCode),
        getLeagueMatches(leagueCode),
        getLeagueScorers(leagueCode, 35).catch(() => []),
        fetchSupabasePlayersIfConfigured(),
      ]);

    const standings = transformStandings(standingsRes, matchesRes);
    const matches = transformMatches(matchesRes, standings, targetLeagueLabel);

    return NextResponse.json({
      source: 'live',
      leagueLabel: targetLeagueLabel,
      leagueCode,
      standings,
      matches,
      scorers: scorersRes,
      supabasePlayers,
      teamNameSample: standings[0]
        ? getKoreanTeamName(standings[0].teamName)
        : null,
    });
  } catch (error: any) {
    const fallbackMatches =
      leagueParam === '전체'
        ? MATCHES_DATA
        : MATCHES_DATA.filter((m) => m.league === targetLeagueLabel);

    const supabasePlayers = await fetchSupabasePlayersIfConfigured();

    return NextResponse.json({
      source: 'fallback',
      leagueLabel: targetLeagueLabel,
      leagueCode,
      error: error?.message || '데이터 호출 중 오류가 발생했습니다.',
      standings: [],
      matches: fallbackMatches,
      scorers: [],
      supabasePlayers,
    });
  }
}
