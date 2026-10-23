/**
 * Pure analytical calculations for the European Football Big Data Analytics Platform:
 * 1. Poisson Distribution & Monte Carlo Match Outcome / Exact Score Probabilities
 * 2. Player Value Efficiency Score (가성비 지수) & Per-90 Percentile Comparison
 * 3. Club Financial Health (UEFA/PSR Wages-to-Turnover status, Cost per Point, Cost per Goal)
 * 4. Cross-Era Z-Score Normalization (당시 리그 평균 대비 압도성 지수)
 */

export interface ExactScorePrediction {
  homeGoals: number;
  awayGoals: number;
  scoreLabel: string;
  probability: number; // percentage 0-100
}

export interface PoissonMatchAnalysis {
  homeWinProb: number; // percentage 0-100, rounded to 1 decimal
  drawProb: number;
  awayWinProb: number;
  topExactScores: ExactScorePrediction[];
  expectedTotalGoals: number;
}

/**
 * Factorial helper for Poisson PMF
 */
export function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Poisson probability mass function: P(X = k) = (lambda^k * e^-lambda) / k!
 */
export function poissonPmf(lambda: number, k: number): number {
  if (lambda < 0 || k < 0) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Calculates match outcome probabilities (Home Win, Draw, Away Win) and Top 3 most likely exact scores
 * using independent Poisson distributions over a 0..7 goal grid.
 */
export function calculatePoissonMatchAnalysis(
  homeExpectedGoals: number,
  awayExpectedGoals: number,
  maxGoals = 7
): PoissonMatchAnalysis {
  const safeHomeLambda = Math.max(0.1, Math.min(5.5, homeExpectedGoals));
  const safeAwayLambda = Math.max(0.1, Math.min(5.5, awayExpectedGoals));

  let homeWinRaw = 0;
  let drawRaw = 0;
  let awayWinRaw = 0;
  const scoreMatrix: ExactScorePrediction[] = [];

  for (let h = 0; h <= maxGoals; h++) {
    const pHome = poissonPmf(safeHomeLambda, h);
    for (let a = 0; a <= maxGoals; a++) {
      const pAway = poissonPmf(safeAwayLambda, a);
      const jointProb = pHome * pAway;

      if (h > a) homeWinRaw += jointProb;
      else if (h === a) drawRaw += jointProb;
      else awayWinRaw += jointProb;

      scoreMatrix.push({
        homeGoals: h,
        awayGoals: a,
        scoreLabel: `${h} - ${a}`,
        probability: Number((jointProb * 100).toFixed(1)),
      });
    }
  }

  const totalProb = homeWinRaw + drawRaw + awayWinRaw || 1;
  const homeWinProb = Math.round((homeWinRaw / totalProb) * 100);
  const drawProb = Math.round((drawRaw / totalProb) * 100);
  const awayWinProb = Math.max(0, 100 - homeWinProb - drawProb);

  scoreMatrix.sort((a, b) => b.probability - a.probability);

  return {
    homeWinProb,
    drawProb,
    awayWinProb,
    topExactScores: scoreMatrix.slice(0, 3),
    expectedTotalGoals: Number((safeHomeLambda + safeAwayLambda).toFixed(2)),
  };
}

/**
 * Evaluates Wages-to-Turnover status against UEFA / Premier League PSR 70% threshold.
 */
export interface WageRatioAssessment {
  ratio: number;
  isOverThreshold: boolean;
  statusLevel: 'safe' | 'caution' | 'danger';
  statusLabelKo: string;
  deltaFromThreshold: number;
}

export function evaluateWagesToTurnover(ratioPercent: number): WageRatioAssessment {
  const deltaFromThreshold = Number((ratioPercent - 70).toFixed(1));
  if (ratioPercent > 70) {
    return {
      ratio: ratioPercent,
      isOverThreshold: true,
      statusLevel: 'danger',
      statusLabelKo: '위험 (70% 권고선 초과)',
      deltaFromThreshold,
    };
  }
  if (ratioPercent >= 63) {
    return {
      ratio: ratioPercent,
      isOverThreshold: false,
      statusLevel: 'caution',
      statusLabelKo: '주의 (권고선 근접)',
      deltaFromThreshold,
    };
  }
  return {
    ratio: ratioPercent,
    isOverThreshold: false,
    statusLevel: 'safe',
    statusLabelKo: '안전 (UEFA 권고 준수)',
    deltaFromThreshold,
  };
}

/**
 * Calculates Off-Pitch Financial Efficiency metrics:
 * - 승점 1점당 지출 비용 (Cost per Point in 억 원)
 * - 1골당 지출 주급 총액 (Annual Wage Spend per Goal in 억 원)
 */
export interface OffPitchEfficiencyResult {
  costPerPointEok: number;
  costPerGoalEok: number;
  pointEfficiencyVsLeaguePercent: number; // negative means cheaper/more efficient than league avg
  goalEfficiencyVsLeaguePercent: number;
}

export function calculateOffPitchEfficiency(
  annualSquadCostEok: number,
  seasonPoints: number,
  seasonGoals: number,
  leagueAvgCostPerPointEok: number,
  leagueAvgCostPerGoalEok: number
): OffPitchEfficiencyResult {
  const safePoints = Math.max(1, seasonPoints);
  const safeGoals = Math.max(1, seasonGoals);

  const costPerPointEok = Number((annualSquadCostEok / safePoints).toFixed(1));
  const costPerGoalEok = Number((annualSquadCostEok / safeGoals).toFixed(1));

  const pointEfficiencyVsLeaguePercent = Number(
    (((costPerPointEok - leagueAvgCostPerPointEok) / leagueAvgCostPerPointEok) * 100).toFixed(1)
  );
  const goalEfficiencyVsLeaguePercent = Number(
    (((costPerGoalEok - leagueAvgCostPerGoalEok) / leagueAvgCostPerGoalEok) * 100).toFixed(1)
  );

  return {
    costPerPointEok,
    costPerGoalEok,
    pointEfficiencyVsLeaguePercent,
    goalEfficiencyVsLeaguePercent,
  };
}

/**
 * Calculates Z-score relative to the historical era's league average and standard deviation:
 * Z = (value - eraMean) / eraStdDev
 * For inverted metrics (like goals conceded where lower is better), pass invert = true.
 */
export function calculateEraZScore(
  value: number,
  eraMean: number,
  eraStdDev: number,
  invert = false
): number {
  if (eraStdDev <= 0) return 0;
  const rawZ = (value - eraMean) / eraStdDev;
  const finalZ = invert ? -rawZ : rawZ;
  return Number(finalZ.toFixed(2));
}
