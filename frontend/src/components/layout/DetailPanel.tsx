export function DetailPanel() {
  return (
    <aside className="w-80 min-w-80 max-w-80 border-l border-graphite/20 bg-paper/50 flex flex-col h-full">
      <div className="p-4 border-b border-graphite/20">
        <h2 className="font-display text-lg font-semibold text-ink">Details</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg className="w-16 h-16 text-graphite/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-body text-graphite/60 text-sm leading-relaxed">
            Select a paper or concept from the graph to view details here.
          </p>
        </div>
      </div>
    </aside>
  );
}