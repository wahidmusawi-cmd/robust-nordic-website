// Table-view twin for a chart: the accessible, hover-free way to read every
// plotted value. Collapsed by default behind a <details> toggle.

export function ChartTable({
  summary = "Näytä taulukkona",
  columns,
  rows,
}: {
  summary?: string
  columns: string[]
  rows: Array<Array<string | number>>
}) {
  return (
    <details className="group mt-3">
      <summary className="text-muted-foreground hover:text-foreground cursor-pointer list-none text-xs font-medium transition-colors [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{summary}</span>
        <span className="hidden group-open:inline">Piilota taulukko</span>
      </summary>
      <div className="mt-2 max-h-64 overflow-y-auto rounded-md border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`text-muted-foreground px-3 py-2 font-medium ${i === 0 ? "text-left" : "text-right"}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-1.5 ${ci === 0 ? "text-left" : "text-right tabular-nums"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
