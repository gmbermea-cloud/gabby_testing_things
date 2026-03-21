/**
 * archpathScoring.js — ArchPath scoring engine
 *
 * Scoring rules:
 *   multiple_choice: +3 to selected track
 *   slider:          3 points split by position (0–100)
 *                    leftTrack gets (1 - pos/100) * 3
 *                    rightTrack gets (pos/100) * 3
 *   ranking:         4/3/2/1 points by rank position (index 0 = 1st = 4pts)
 *
 * Results:
 *   1. Sum points per track
 *   2. Sort tracks by total (desc)
 *   3. percentage = (track_score / highest_score) * 100
 */

import { TRACK_META } from '../data/questions.js'

const TRACKS = Object.keys(TRACK_META)

/**
 * Compute scores from all answers.
 *
 * @param {Array} answers - [{ questionId, type, value }]
 *   - multiple_choice: value = 'Design' | 'Technical' | 'Management' | 'Business'
 *   - slider:          value = { pos: 0-100, leftTrack, rightTrack }
 *   - ranking:         value = [{ track }, ...] ordered 1st to 4th
 * @returns {{ tracks: { Design, Technical, Management, Business }, ranked: Array }}
 */
export function computeResults(answers) {
  const scores = { Design: 0, Technical: 0, Management: 0, Business: 0 }

  for (const answer of answers) {
    switch (answer.type) {
      case 'multiple_choice': {
        scores[answer.value] = (scores[answer.value] ?? 0) + 3
        break
      }
      case 'slider': {
        const { pos, leftTrack, rightTrack } = answer.value
        const rightPoints = (pos / 100) * 3
        const leftPoints  = 3 - rightPoints
        scores[leftTrack]  = (scores[leftTrack]  ?? 0) + leftPoints
        scores[rightTrack] = (scores[rightTrack] ?? 0) + rightPoints
        break
      }
      case 'ranking': {
        // answer.value is ordered array of items, index 0 = 1st place = 4pts
        const rankPoints = [4, 3, 2, 1]
        answer.value.forEach((item, index) => {
          const pts = rankPoints[index] ?? 1
          scores[item.track] = (scores[item.track] ?? 0) + pts
        })
        break
      }
    }
  }

  // Sort tracks by score descending
  const ranked = Object.entries(scores)
    .map(([track, score]) => ({ track, score, meta: TRACK_META[track] }))
    .sort((a, b) => b.score - a.score)

  const highestScore = ranked[0]?.score ?? 1

  // Add percentage (top track = 100%, others scaled)
  const rankedWithPct = ranked.map(entry => ({
    ...entry,
    percentage: Math.round((entry.score / highestScore) * 100),
  }))

  return {
    tracks: scores,
    ranked: rankedWithPct,
    topTrack: rankedWithPct[0],
  }
}
