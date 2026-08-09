import { LibrarySidebar } from './LibrarySidebar';
import { GraphCanvas } from './GraphCanvas';
import { DetailPanel } from './DetailPanel';

export function App() {
  return (
    <div className="flex h-screen w-full bg-paper font-body text-ink">
      <LibrarySidebar />
      <GraphCanvas />
      <DetailPanel />
    </div>
  );
}