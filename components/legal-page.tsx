import type { ContentBlock } from "@/lib/policies"

export function LegalPage({
  eyebrow,
  title,
  intro,
  content,
}: {
  eyebrow: string
  title: string
  intro?: string
  content: ContentBlock[]
}) {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="pt-32 pb-14 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-[0.3em] text-accent mb-4">{eyebrow}</p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">{title}</h1>
          {intro && <p className="mt-5 text-lg text-primary-foreground/70 leading-relaxed text-pretty">{intro}</p>}
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProseBlocks content={content} />
        </div>
      </section>
    </main>
  )
}

function ProseBlocks({ content }: { content: ContentBlock[] }) {
  const elements: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flush = (key: string) => {
    if (listBuffer.length) {
      elements.push(
        <ul key={key} className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-6">
          {listBuffer.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      )
      listBuffer = []
    }
  }

  content.forEach((block, i) => {
    if (block.t === "li") {
      listBuffer.push(block.c)
      return
    }
    flush(`l-${i}`)
    if (block.t === "h2" || block.t === "h1") {
      elements.push(
        <h2 key={i} className="font-serif text-2xl sm:text-3xl text-foreground mt-10 mb-4 leading-snug text-balance">
          {block.c}
        </h2>,
      )
    } else if (block.t === "h3" || block.t === "h4") {
      elements.push(
        <h3 key={i} className="font-sans font-semibold text-lg text-foreground mt-6 mb-2">
          {block.c}
        </h3>,
      )
    } else {
      elements.push(
        <p key={i} className="text-foreground/80 leading-relaxed text-pretty mb-4">
          {block.c}
        </p>,
      )
    }
  })
  flush("l-end")

  return <div>{elements}</div>
}
