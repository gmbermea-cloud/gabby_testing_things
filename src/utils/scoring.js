/**
 * scoring.js — Ground Up scoring engine
 *
 * Computes:
 *   1. A dimension score vector from swipe responses + tradeoff choices
 *   2. A personality type label
 *   3. Top N career matches with match percentages
 */

import { personalityTypes, careers, dimensionWeights, dimensionLabels } from '../data/careers.js'

export { dimensionLabels }

// Swipe action multipliers
export const SWIPE_WEIGHTS = {
  approve: 1.0,
  revise:  0.4,
  reject: -0.3,
}

/**
 * Accumulate swipe card responses into a dimension score vector.
 *
 * @param {Array} responses - [{ cardId, action: 'approve'|'revise'|'reject' }]
 * @param {Array} swipeCards - the full swipe card definitions
 * @returns {Object} dimensionScores - raw accumulated scores per dimension
 */
export function computeSwipeScores(responses, swipeCards) {
  const scores = {}

  for (const { cardId, action } of responses) {
    const card = swipeCards.find(c => c.id === cardId)
    if (!card) continue

    const multiplier = SWIPE_WEIGHTS[action] ?? 0

    for (const [dimension, weight] of Object.entries(card.dimensions)) {
      scores[dimension] = (scores[dimension] ?? 0) + multiplier * weight
    }
  }

  return scores
}

/**
 * Accumulate tradeoff pair choices into dimension scores.
 *
 * @param {Array} choices - [{ pairId, choice: 'A'|'B' }]
 * @param {Array} tradeoffPairs - full tradeoff pair definitions
 * @returns {Object} dimensionScores - raw accumulated scores per dimension
 */
export function computeTradeoffScores(choices, tradeoffPairs) {
  const scores = {}

  for (const { pairId, choice } of choices) {
    const pair = tradeoffPairs.find(p => p.id === pairId)
    if (!pair) continue

    const option = choice === 'A' ? pair.optionA : pair.optionB
    if (!option) continue

    for (const [dimension, weight] of Object.entries(option.dimensions)) {
      scores[dimension] = (scores[dimension] ?? 0) + weight
    }
  }

  return scores
}

/**
 * Merge swipe and tradeoff scores, normalize to [-1, 1] range.
 *
 * @param {Object} swipeScores
 * @param {Object} tradeoffScores
 * @returns {Object} normalized score vector
 */
export function mergeAndNormalize(swipeScores, tradeoffScores) {
  const merged = { ...swipeScores }

  for (const [dim, val] of Object.entries(tradeoffScores)) {
    merged[dim] = (merged[dim] ?? 0) + val
  }

  // Find max absolute value for normalization
  const maxAbs = Math.max(1, ...Object.values(merged).map(Math.abs))

  const normalized = {}
  for (const [dim, val] of Object.entries(merged)) {
    normalized[dim] = val / maxAbs
  }

  return normalized
}

/**
 * Determine personality type from normalized score vector.
 * Uses the two highest-scoring positive dimensions to match personality type.
 *
 * @param {Object} scoreVector - normalized dimension scores
 * @returns {Object} matched personality type entry
 */
export function determinePersonalityType(scoreVector) {
  // Rank dimensions by score descending
  const ranked = Object.entries(scoreVector)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([dim]) => dim)

  // Score each personality type by how well its primary dimensions match
  let bestType = personalityTypes[0]
  let bestScore = -Infinity

  for (const pType of personalityTypes) {
    let typeScore = 0
    for (let i = 0; i < pType.primaryDimensions.length; i++) {
      const dim = pType.primaryDimensions[i]
      const dimScore = scoreVector[dim] ?? 0
      // Weight earlier dimensions more heavily
      typeScore += dimScore * (1 / (i + 1))
    }
    if (typeScore > bestScore) {
      bestScore = typeScore
      bestType = pType
    }
  }

  return bestType
}

/**
 * Compute cosine similarity between user score vector and a career's affinities.
 * Returns a value in [0, 1].
 *
 * @param {Object} userVector - normalized user dimension scores
 * @param {Object} careerAffinities - career affinity values per dimension
 * @returns {number} similarity in [0, 1]
 */
function cosineSimilarity(userVector, careerAffinities) {
  const dims = Object.keys(dimensionWeights)

  let dot = 0
  let userMag = 0
  let careerMag = 0

  for (const dim of dims) {
    const w = dimensionWeights[dim] ?? 1
    const u = (userVector[dim] ?? 0) * w
    const c = (careerAffinities[dim] ?? 0) * w

    dot += u * c
    userMag += u * u
    careerMag += c * c
  }

  if (userMag === 0 || careerMag === 0) return 0
  return dot / (Math.sqrt(userMag) * Math.sqrt(careerMag))
}

/**
 * Get top N career matches with match percentages.
 *
 * @param {Object} scoreVector - normalized user dimension scores
 * @param {number} topN - how many careers to return (default 3)
 * @returns {Array} sorted career matches [{ career, matchPercent }]
 */
export function getTopCareerMatches(scoreVector, topN = 5) {
  const scored = careers.map(career => {
    const rawSimilarity = cosineSimilarity(scoreVector, career.affinities)
    // Rescale to a "feel good" range: similarity of 0.5 → ~65%, 1.0 → 98%
    const matchPercent = Math.round(55 + rawSimilarity * 43)
    return { career, matchPercent: Math.min(99, Math.max(50, matchPercent)) }
  })

  return scored
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, topN)
}

/**
 * Full scoring pipeline.
 *
 * @param {Array} swipeResponses - [{ cardId, action }]
 * @param {Array} tradeoffChoices - [{ pairId, choice }]
 * @param {Array} swipeCards - swipe card definitions
 * @param {Array} tradeoffPairs - tradeoff pair definitions
 * @returns {{ personalityType, topCareers, scoreVector }}
 */
export function runFullScoring(swipeResponses, tradeoffChoices, swipeCards, tradeoffPairs) {
  const swipeScores    = computeSwipeScores(swipeResponses, swipeCards)
  const tradeoffScores = computeTradeoffScores(tradeoffChoices, tradeoffPairs)
  const scoreVector    = mergeAndNormalize(swipeScores, tradeoffScores)
  const personalityType = determinePersonalityType(scoreVector)
  const topCareers     = getTopCareerMatches(scoreVector)

  return { personalityType, topCareers, scoreVector }
}
