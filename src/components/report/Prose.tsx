export function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text
        .split("\n\n")
        .filter(Boolean)
        .map((paragraph, index) => (
          <p key={index} className="text-[15px] leading-[1.75] text-ink-700">
            {paragraph}
          </p>
        ))}
    </div>
  );
}
