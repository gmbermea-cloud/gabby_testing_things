/**
 * careers.js — Ground Up data layer
 *
 * Single source of truth lives in three JSON files:
 *   config.json     — dimensions, swipe cards, tradeoff pairs, personality types
 *   careers_a.json  — career entries: categories A–D (Traditional → Management)
 *   careers_b.json  — career entries: categories E–H (Policy → Adjacent Industries)
 *
 * Edit the JSON files to tune the algorithm or add careers — no code changes needed.
 */

import config    from './config.json'
import careersA  from './careers_a.json'
import careersB  from './careers_b.json'

export const { dimensionWeights, dimensionLabels, swipeCards, tradeoffPairs, personalityTypes } = config
export const careers = [...careersA, ...careersB]
