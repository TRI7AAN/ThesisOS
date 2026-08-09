import { useState } from 'react';

export function LibrarySidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <aside className="w-72 min-w-72 max-w-72 border-r border-graphite/20 bg-paper/50 flex flex-col h-full">
      <div className="p-4 border-b border-graphite/20">
        <h2 className="font-display text-lg font-semibold text-ink">Library</h2>
      </div>
      
      <div className="p-4 border-b border-graphite/20">
        <label htmlFor="library-search" className="sr-only">Search papers</label>
        <input
          id="library-search"
          type="search"
          placeholder="Search papers…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm font-body text-ink bg-white border border-graphite/30 rounded-md focus:border-citation-blue focus:ring-1 focus:ring-citation-blue placeholder-graphite/50 transition-colors"
        />
      </div>

      <div className="p-4 border-b border-graphite/20">
        <button className="w-full px-3 py-2 text-sm font-body text-white bg-citation-blue rounded-md hover:bg-citation-blue/90 focus:ring-2 focus:ring-citation-blue focus:ring-offset-2 focus:ring-offset-paper transition-colors">
          Upload Paper
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm font-body text-graphite text-center py-8">
          No papers yet. Upload your first paper to start building your graph.
        </p>
      </div>

      <div className="p-4 border-t border-graphite/20">
        <p className="text-xs font-body text-graphite text-center">
          0 papers • 0 concepts
        </p>
      </div>
    </aside>
  );
}