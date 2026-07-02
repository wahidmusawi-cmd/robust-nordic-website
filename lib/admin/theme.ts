// Admin chart palette — derived from the brand navy and validated with the
// dataviz six-checks validator on a white card surface (lightness band, chroma
// floor, CVD adjacent-pair separation, ≥3:1 contrast). Assign slots in fixed
// order; never cycle past them.
export const CHART = {
  /** Slot 1 — primary series (brand navy-blue). */
  c1: "#2e6fae",
  /** Slot 2 — second series (copper). */
  c2: "#b56a1e",
  /** Slot 3 — third series (steel blue). */
  c3: "#5b8fc7",
  /** Slot 4 — fourth series (green). */
  c4: "#3f8f5f",
  /** Hairline grid, one step off the white surface. Solid, never dashed. */
  grid: "#eceae7",
  /** Axis tick text. */
  axisText: "#5a6b7d",
  /** De-emphasis hue for sparklines. */
  spark: "#a3b1bf",
  /** Unfilled track behind bar-list fills — a lighter step of the blue ramp. */
  track: "#e8eef5",
  /** Chart surface (cards are white). */
  surface: "#ffffff",
  /** Crosshair cursor stroke. */
  cursor: "#c8c4c0",
} as const

export const CHART_SLOTS = [CHART.c1, CHART.c2, CHART.c3, CHART.c4] as const
