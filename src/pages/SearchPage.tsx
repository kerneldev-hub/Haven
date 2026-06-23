import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/components';
import { Button } from '../components/ui/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Search as SearchIcon, Users, MessageSquare, Code, LayoutGrid, ArrowRight, BrainCircuit, Sparkles, Globe } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val) {
      setAiAnswer(null);
      setIsGenerating(false);
    }
  };

  const handleSmartSearch = () => {
    if (!query) return;
    setAiAnswer("Based on community discussions, React Context is best used for low-frequency global state updates (like themes or authentication). For high-frequency data changes or complex state management across micro-frontends, it's recommended to explore structured stores like Zustand or Redux, as context re-renders all consumers aggressively.");
  };
  
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10 pt-6">
      
      {/* Search Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6 flex items-center gap-2">Universal Search <Badge variant="outline" className="text-xs font-normal border-blue-500/30 text-blue-600 bg-blue-500/5 mt-1 hidden sm:flex"><BrainCircuit className="w-3 h-3 mr-1" /> Dynamic Indexing Enabled</Badge></h1>
        <div className="relative max-w-2xl w-full">
           <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
           <input 
             type="text" 
             className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-24 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
             placeholder="Search communities, explore topics, or ask a question..."
             value={query}
             onChange={handleSearch}
             onKeyDown={(e) => {
               if (e.key === 'Enter') handleSmartSearch();
             }}
             autoFocus
           />
           {query && (
             <Button size="sm" onClick={handleSmartSearch} disabled={isGenerating} className="absolute right-1.5 top-1.5 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
               <Sparkles className="w-4 h-4 mr-1.5" /> Synthesize
             </Button>
           )}
        </div>
      </div>

      {query ? (
        <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 w-full sm:w-auto inline-flex h-auto p-1 bg-muted rounded-lg space-x-1 overflow-x-auto border-none">
              <TabsTrigger value="all" className="rounded-md px-4 py-2 text-sm flex items-center">
                All Results
              </TabsTrigger>
              <TabsTrigger value="communities" className="rounded-md px-4 py-2 text-sm flex items-center">
                <LayoutGrid className="w-4 h-4 mr-2" /> Communities
              </TabsTrigger>
              <TabsTrigger value="discussions" className="rounded-md px-4 py-2 text-sm flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" /> Discussions
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-md px-4 py-2 text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" /> Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="outline-none space-y-6">
                
                {/* Web Grounding & Real-time Synthesis */}
                {(isGenerating || aiAnswer) && (
                   <div className="max-w-3xl mb-8 space-y-4">
                     <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-3">
                           <Sparkles className="w-5 h-5 text-blue-600" />
                           <h3 className="font-bold text-blue-900 tracking-tight">AI Knowledge Synthesis</h3>
                        </div>
                        {isGenerating ? (
                           <div className="space-y-2 animate-pulse">
                              <div className="h-4 bg-blue-500/10 rounded w-full"></div>
                              <div className="h-4 bg-blue-500/10 rounded w-5/6"></div>
                              <div className="h-4 bg-blue-500/10 rounded w-4/6"></div>
                           </div>
                        ) : (
                           <div>
                              <p className="text-sm leading-relaxed text-blue-950/80">{aiAnswer}</p>
                           </div>
                        )}
                     </div>

                     {/* Web Grounding Data Section */}
                     {!isGenerating && aiAnswer && (
                       <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm">
                         <div className="flex items-center gap-2 mb-3">
                           <Globe className="w-5 h-5 text-emerald-600" />
                           <h3 className="font-bold text-emerald-900 tracking-tight">Real-Time Web Grounding</h3>
                         </div>
                         <div className="space-y-3">
                           <a href="#" className="block p-3 rounded-lg border border-emerald-500/10 bg-background hover:border-emerald-500/30 transition-colors">
                             <div className="flex items-center gap-2 mb-1">
                               <img src="https://www.google.com/s2/favicons?domain=react.dev" alt="icon" className="w-4 h-4" />
                               <span className="text-xs font-bold text-emerald-800">React Core Docs (Updated 2 days ago)</span>
                             </div>
                             <p className="text-sm text-muted-foreground truncate">Using Context for state management should be limited to global settings rather than highly dynamic data.</p>
                           </a>
                           <a href="#" className="block p-3 rounded-lg border border-emerald-500/10 bg-background hover:border-emerald-500/30 transition-colors">
                             <div className="flex items-center gap-2 mb-1">
                               <img src="https://www.google.com/s2/favicons?domain=github.com" alt="icon" className="w-4 h-4" />
                               <span className="text-xs font-bold text-emerald-800">GitHub Trending (Today)</span>
                             </div>
                             <p className="text-sm text-muted-foreground truncate">Zustand and Jotai surpass Redux in new project adoptions based on recent NPM statistics.</p>
                           </a>
                         </div>
                       </div>
                     )}
                   </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Communities</h3>
                  <div className="grid gap-3">
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 font-bold rounded-lg flex items-center justify-center">R</div>
                            <div>
                               <Link to="/c/react" className="font-semibold hover:underline">React Developers</Link>
                               <p className="text-xs text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px] sm:max-w-md">The unofficial community for React builders.</p>
                            </div>
                         </div>
                         <Button variant="outline" size="sm">View</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Discussions</h3>
                  <div className="grid gap-3">
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex items-start gap-4">
                         <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
                         <div>
                            <p className="font-medium hover:underline text-sm cursor-pointer">Best way to structure {query} context?</p>
                            <p className="text-xs text-muted-foreground mt-1">in React Developers • By @developer</p>
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                 <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Users</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex items-center gap-4">
                         <div className="w-10 h-10 bg-accent text-accent-foreground font-bold rounded-full flex items-center justify-center text-sm">D</div>
                         <div className="flex-1">
                            <Link to="/u/developer" className="font-semibold hover:underline text-sm">Developer</Link>
                            <p className="text-xs text-muted-foreground">@developer</p>
                         </div>
                         <Button variant="ghost" size="sm">Follow</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
            </TabsContent>
            
            <TabsContent value="communities" className="outline-none">
              <EmptyState title="No other communities found." description={`Your search for "${query}" did not match any other communities.`} />
            </TabsContent>
            <TabsContent value="discussions" className="outline-none">
              <EmptyState title="End of results." description={`No more discussions for "${query}".`} />
            </TabsContent>
            <TabsContent value="users" className="outline-none">
               <EmptyState title="End of results." description={`No more users match "${query}".`} />
            </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col gap-8 max-w-2xl text-muted-foreground pt-4">
           {/* Recent Searches */}
           <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-foreground flex items-center"><BrainCircuit className="w-4 h-4 mr-2" /> Trending Smart Queries</h3>
              <div className="flex flex-col gap-2">
                 <button onClick={() => setQuery("react context state")} className="flex items-center text-sm hover:text-foreground transition-colors justify-between py-2.5 border-b">
                   <span className="flex items-center"><SearchIcon className="h-4 w-4 mr-3 text-muted-foreground/50"/> react context vs redux performance</span>
                   <ArrowRight className="h-4 w-4 opacity-50" />
                 </button>
                 <button onClick={() => setQuery("database migrations turso")} className="flex items-center text-sm hover:text-foreground transition-colors justify-between py-2.5 border-b">
                   <span className="flex items-center"><SearchIcon className="h-4 w-4 mr-3 text-muted-foreground/50"/> how to scale websocket connections</span>
                   <ArrowRight className="h-4 w-4 opacity-50" />
                 </button>
                 <button onClick={() => setQuery("database migrations turso")} className="flex items-center text-sm hover:text-foreground transition-colors justify-between py-2.5 border-b">
                   <span className="flex items-center"><SearchIcon className="h-4 w-4 mr-3 text-muted-foreground/50"/> best open source alternative to datadog</span>
                   <ArrowRight className="h-4 w-4 opacity-50" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
