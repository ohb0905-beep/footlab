import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePoissonMatchAnalysis,
  evaluateWagesToTurnover,
  calculateOffPitchEfficiency,
  calculateEraZScore,
} from './analytics';

test('Poisson match analysis probabilities sum to 100 and rank top 3 exact scores', () => {
  const result = calculatePoissonMatchAnalysis(2.1, 1.1);
  assert.equal(result.homeWinProb + result.drawProb + result.awayWinProb, 100);
  assert.ok(result.homeWinProb > result.awayWinProb, 'Home team with higher xG should have higher win probability');
  assert.equal(result.topExactScores.length, 3);
  assert.ok(result.topExactScores[0].probability >= result.topExactScores[1].probability);
  assert.ok(result.topExactScores[1].probability >= result.topExactScores[2].probability);
});

test('Wages-to-turnover threshold strictly flags >70% as danger and <=70% appropriately', () => {
  const safe = evaluateWagesToTurnover(58);
  assert.equal(safe.isOverThreshold, false);
  assert.equal(safe.statusLevel, 'safe');

  const caution = evaluateWagesToTurnover(66);
  assert.equal(caution.isOverThreshold, false);
  assert.equal(caution.statusLevel, 'caution');

  const danger = evaluateWagesToTurnover(74);
  assert.equal(danger.isOverThreshold, true);
  assert.equal(danger.statusLevel, 'danger');
  assert.equal(danger.deltaFromThreshold, 4);
});

test('Off-pitch efficiency computes cost per point and cost per goal accurately', () => {
  const eff = calculateOffPitchEfficiency(4500, 90, 90, 42.0, 48.0);
  assert.equal(eff.costPerPointEok, 50.0);
  assert.equal(eff.costPerGoalEok, 50.0);
  assert.ok(eff.pointEfficiencyVsLeaguePercent > 0);
});

test('Cross-era Z-score normalizes positive and inverted defensive metrics accurately', () => {
  // 2.50 goals per game when era mean is 1.35 and stdDev is 0.42 -> +2.74σ
  const attackZ = calculateEraZScore(2.5, 1.35, 0.42, false);
  assert.equal(attackZ, 2.74);

  // 0.58 goals conceded per game when era mean is 1.28 and stdDev is 0.28 -> inverted +2.50σ
  const defenseZ = calculateEraZScore(0.58, 1.28, 0.28, true);
  assert.equal(defenseZ, 2.5);
});

import {
  parseFormString,
  transformStandings,
  transformMatches,
} from './footballMapper';

test('footballMapper transforms real API standings and matches into Korean UI data', () => {
  assert.deepEqual(parseFormString('W,D,L,W,W'), ['승', '무', '패', '승', '승']);

  const standings = transformStandings([
    {
      position: 1,
      team: {
        id: 64,
        name: 'Liverpool FC',
        shortName: 'Liverpool',
        tla: 'LIV',
        crest: 'https://crests.football-data.org/64.png',
      },
      playedGames: 29,
      form: 'W,W,D,W,W',
      won: 21,
      draw: 7,
      lost: 1,
      points: 70,
      goalsFor: 69,
      goalsAgainst: 27,
      goalDifference: 42,
    },
  ]);

  assert.equal(standings[0].teamName, '리버풀');
  assert.equal(standings[0].points, 70);

  const matches = transformMatches(
    [
      {
        id: 5001,
        utcDate: '2026-04-05T14:00:00Z',
        status: 'TIMED',
        matchday: 31,
        homeTeam: {
          id: 57,
          name: 'Arsenal FC',
          shortName: 'Arsenal',
          tla: 'ARS',
          crest: 'https://crests.football-data.org/57.png',
        },
        awayTeam: {
          id: 64,
          name: 'Liverpool FC',
          shortName: 'Liverpool',
          tla: 'LIV',
          crest: 'https://crests.football-data.org/64.png',
        },
        score: { fullTime: { home: null, away: null } },
      },
    ],
    standings,
    '프리미어리그'
  );

  assert.equal(matches[0].homeTeam.name, '아스널');
  assert.equal(matches[0].awayTeam.name, '리버풀');
  assert.equal(matches[0].roundLabel, '프리미어리그 31라운드');
});

