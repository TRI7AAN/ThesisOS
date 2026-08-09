export function GraphCanvas() {
  return (
    <main className="flex-1 min-w-0 flex items-center justify-center bg-paper relative">
      <div className="w-full h-full relative">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="var(--color-paper)" />
          
          <g className="graph-canvas">
            <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" className="font-display text-ink/30 text-2xl">
              Graph Canvas
            </text>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" className="font-body text-graphite/50 text-sm">
              Upload a paper to see your knowledge graph
            </text>
          </g>
        </svg>
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="px-3 py-1.5 text-xs font-body text-ink bg-white border border-graphite/30 rounded-md hover:border-graphite/50 focus:ring-2 focus:ring-citation-blue focus:ring-offset-2 focus:ring-offset-paper transition-colors" title="Zoom in">
            +
          </button>
          <button className="px-3 py-1.5 text-xs font-body text-ink bg-white border border-graphite/30 rounded-md hover:border-graphite/50 focus:ring-2 focus:ring-citation-blue focus:ring-offset-2 focus:ring-offset-paper transition-colors" title="Zoom out">
            −
          </button>
          <button className="px-3 py-1.5 text-xs font-body text-ink bg-white border border-graphite/30 rounded-md hover:border-graphite/50 focus:ring-2 focus:ring-citation-blue focus:ring-offset-2 focus:ring-offset-paper transition-colors" title="Fit to view">
            ⌂
          </button>
        </div>
      </div>
    </main>
  );
}