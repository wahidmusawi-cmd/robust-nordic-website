"use client"

// Admin chart primitives. Specs: 2px lines with round joins, area fill at 10%
// opacity, columns ≤24px with 4px rounded data-ends (square at baseline),
// solid hairline grid one step off the surface, crosshair + tooltip on hover,
// axis text in muted ink. Colors come from the validated palette in
// lib/admin/theme.ts — never from raw hexes in pages.

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CHART } from "@/lib/admin/theme"
import { formatEur, formatEurRounded, formatNumber } from "@/lib/admin/format"

// value: null = "no data for this x" → the mark shows a gap, not a zero.
export type ChartPoint = { label: string; value: number | null }

type ValueKind = "eur" | "count"

function formatValue(value: number, kind: ValueKind): string {
  return kind === "eur" ? formatEur(value) : formatNumber(value)
}

function formatTick(value: number, kind: ValueKind): string {
  return kind === "eur" ? formatEurRounded(value) : formatNumber(value)
}

type TooltipPayload = { value?: number | string }

function ChartTooltip({
  active,
  payload,
  label,
  kind,
  name,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string | number
  kind: ValueKind
  name: string
}) {
  if (!active || !payload || payload.length === 0) return null
  const raw = payload[0]?.value
  if (raw == null) return null
  const value = typeof raw === "number" ? raw : Number(raw)
  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md">
      <p className="text-foreground text-sm font-semibold">{formatValue(value, kind)}</p>
      <p className="text-muted-foreground text-xs">
        {name} · {String(label ?? "")}
      </p>
    </div>
  )
}

const AXIS_TICK = { fill: CHART.axisText, fontSize: 12 } as const

/** Smallest 1/2/2.5/5 × 10^k that is ≥ value — keeps axis maxima "clean". */
function niceCeil(value: number): number {
  if (value <= 0) return 1
  const power = Math.pow(10, Math.floor(Math.log10(value)))
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * power >= value) return m * power
  }
  return 10 * power
}

/** Clean y-ticks (0 · max/2 · max) so labels never land on odd values. */
function yTicks(data: ChartPoint[]): number[] {
  const max = Math.max(...data.map((d) => d.value ?? 0), 0)
  if (max <= 4) return Array.from({ length: Math.max(2, Math.ceil(max)) + 1 }, (_, i) => i)
  const top = niceCeil(max)
  return [0, top / 2, top]
}

/** At most ~6 evenly spaced x-ticks, deterministic (no measurement needed). */
function xTicks(data: ChartPoint[]): string[] {
  const step = Math.max(1, Math.ceil(data.length / 6))
  return data.filter((_, i) => i % step === 0).map((d) => d.label)
}

/**
 * Single-series time/category chart. One y-axis, one hue — a second measure
 * means a second chart, never a dual axis.
 */
export function TimeSeriesChart({
  data,
  kind = "area",
  valueKind = "eur",
  name,
  color = CHART.c1,
  height = 280,
}: {
  data: ChartPoint[]
  kind?: "area" | "line" | "column"
  valueKind?: ValueKind
  /** Series name for the tooltip, e.g. "Myynti". */
  name: string
  color?: string
  height?: number
}) {
  const margin = { top: 8, right: 8, bottom: 0, left: 4 }
  const grid = (
    <CartesianGrid stroke={CHART.grid} strokeWidth={1} vertical={false} />
  )
  const xAxis = (
    <XAxis
      dataKey="label"
      tickLine={false}
      axisLine={false}
      tick={AXIS_TICK}
      ticks={xTicks(data)}
      interval={0}
      tickMargin={8}
    />
  )
  const ticks = yTicks(data)
  const yAxis = (
    <YAxis
      tickLine={false}
      axisLine={false}
      tick={AXIS_TICK}
      tickFormatter={(v: number) => formatTick(v, valueKind)}
      width={valueKind === "eur" ? 64 : 40}
      domain={[0, ticks[ticks.length - 1]]}
      ticks={ticks}
      allowDecimals={false}
    />
  )
  const tooltip = (
    <Tooltip
      content={<ChartTooltip kind={valueKind} name={name} />}
      cursor={
        kind === "column"
          ? { fill: "rgba(13, 61, 102, 0.06)" }
          : { stroke: CHART.cursor, strokeWidth: 1 }
      }
      isAnimationActive={false}
    />
  )

  return (
    <div style={{ height }} className="w-full">
      {/* initialDimension lets the SVG render during SSR, before the browser measures. */}
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 800, height }}>
        {kind === "column" ? (
          <BarChart data={data} margin={margin} barCategoryGap="28%">
            {grid}
            {xAxis}
            {yAxis}
            {tooltip}
            <Bar
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
          </BarChart>
        ) : kind === "line" ? (
          <LineChart data={data} margin={margin}>
            {grid}
            {xAxis}
            {yAxis}
            {tooltip}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: CHART.surface, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        ) : (
          <AreaChart data={data} margin={margin}>
            {grid}
            {xAxis}
            {yAxis}
            {tooltip}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={color}
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: CHART.surface, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 12-point trend in the de-emphasis hue with the latest point accented.
 * Decorative context for a stat tile — no axes, no tooltip (the tile carries
 * the value).
 */
export function Sparkline({ data, width = 96, height = 32 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return null
  const points = data.map((value, i) => ({ i, value }))
  const last = points.length - 1
  return (
    <div style={{ width, height }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width, height }}>
        <LineChart data={points} margin={{ top: 4, right: 4, bottom: 2, left: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART.spark}
            strokeWidth={1.5}
            strokeLinecap="round"
            isAnimationActive={false}
            dot={(props: { cx?: number; cy?: number; index?: number }) =>
              props.index === last && props.cx != null && props.cy != null ? (
                <circle
                  key="last"
                  cx={props.cx}
                  cy={props.cy}
                  r={3}
                  fill={CHART.c1}
                  stroke={CHART.surface}
                  strokeWidth={2}
                />
              ) : (
                // Recharts requires an element; render nothing visible.
                <circle key={props.index} cx={props.cx} cy={props.cy} r={0} fill="none" />
              )
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
