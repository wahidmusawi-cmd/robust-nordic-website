// Renders the product ingredients either as a nutrition table (when the
// string is line-based "Name: Amount" data) or as a plain paragraph (older
// single-paragraph ingredient lists).

interface Props {
  ingredients: string
  title: string
}

export function IngredientsTable({ ingredients, title }: Props) {
  const lines = ingredients
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (!lines.length) return null

  // First line is a header row when it carries no "Name: Amount" pair.
  const firstIsHeader = !lines[0].includes(":")
  const header = firstIsHeader ? lines[0] : null
  const rest = firstIsHeader ? lines.slice(1) : lines

  const rows: { name: string; amount: string }[] = []
  const footnotes: string[] = []
  for (const line of rest) {
    const colonIdx = line.lastIndexOf(":")
    if (!line.startsWith("*") && colonIdx > 0) {
      rows.push({
        name: line.substring(0, colonIdx).trim(),
        amount: line.substring(colonIdx + 1).trim(),
      })
    } else {
      // Footnotes and free-form notes — never silently dropped.
      footnotes.push(line)
    }
  }

  // Paragraph-style ingredient lists don't benefit from a table.
  if (rows.length < 2) {
    return (
      <div className="mt-8 p-5 rounded-2xl bg-secondary">
        <h2 className="font-semibold text-foreground mb-2 text-sm tracking-wide uppercase">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {ingredients}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-foreground mb-3 text-sm tracking-wide uppercase">
        {title}
      </h2>
      <div className="rounded-2xl border border-border overflow-hidden">
        {header && (
          <div className="bg-secondary px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">
            {header}
          </div>
        )}
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                <td className="px-4 py-2.5 text-muted-foreground leading-snug w-3/5">{row.name}</td>
                <td className="px-4 py-2.5 text-foreground font-medium text-right whitespace-nowrap">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {footnotes.length > 0 && (
          <div className="px-4 py-3 bg-secondary/20 border-t border-border">
            {footnotes.map((fn, i) => (
              <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                {fn}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
