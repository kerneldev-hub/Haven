import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/components';
import { Button } from '../components/ui/components';
import { ShareModal } from '../components/ui/ShareModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  Code2, GitMerge, Users, GitCommit, GitPullRequest, ExternalLink, 
  ShieldAlert, Star, Terminal, Send, Save, BookOpen, Trash2, 
  Play, CheckCircle2, Loader2, HelpCircle, Activity, FileText, Plus 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';

interface SavedApiDoc {
  id: string;
  projectId: string;
  title: string;
  description: string;
  url: string;
  method: string;
  headers: Array<{ key: string; value: string }>;
  requestBody?: string;
  responseStatus: number;
  responseBody: string;
  savedAt: string;
}

const CORS_SAFE_SAMPLES = [
  { name: 'Fetch Post JSON', url: 'https://jsonplaceholder.typicode.com/posts/1', method: 'GET', desc: 'Retrieves simulated real-time developer telemetry data from the public testing stream' },
  { name: 'Submit New Post', url: 'https://jsonplaceholder.typicode.com/posts', method: 'POST', desc: 'Simulates creation of system events and records to structured telemetry databases' },
  { name: 'Bitcoin Price Check', url: 'https://api.coindesk.com/v1/bpi/currentprice.json', method: 'GET', desc: 'Fetch latest index details for global cryptocurrency rates' },
  { name: 'API Tester Info', url: 'https://httpbin.org/get', method: 'GET', desc: 'Inspects your raw connection parameters and matching client headers' },
  { name: 'GitHub Zen Saying', url: 'https://api.github.com/zen', method: 'GET', desc: 'Grab a motivational design philosophy directly from the GitHub repository API' }
];

export default function ProjectPage() {
  const { projectId = 'havendb' } = useParams<{ projectId: string }>();
  
  // State for Sandbox
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
    { key: 'Content-Type', value: 'application/json' }
  ]);
  const [requestBody, setRequestBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<string>('');
  
  // Documentation Save inputs
  const [docTitle, setDocTitle] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docsList, setDocsList] = useState<SavedApiDoc[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [expandDocId, setExpandDocId] = useState<string | null>(null);

  // Load documentation from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`haven_api_docs_${projectId}`);
    if (saved) {
      try {
        setDocsList(JSON.parse(saved));
      } catch (e) {
        setDocsList([]);
      }
    } else {
      // Add a couple of initial pre-populated docs as useful references
      const initialDocs: SavedApiDoc[] = [
        {
          id: 'initial-get',
          projectId,
          title: 'KV Registry Health Check',
          description: 'Poll core Analytical Storage KV registry database shards for live network status.',
          url: 'https://httpbin.org/get?layer=kv_store&env=analytical',
          method: 'GET',
          headers: [{ key: 'Content-Type', value: 'application/json' }],
          responseStatus: 200,
          responseBody: JSON.stringify({ status: "healthy", active_shards: 16, current_worker_load: "low", latency_ms: 12 }, null, 2),
          savedAt: new Date().toLocaleDateString()
        },
        {
          id: 'initial-post',
          projectId,
          title: 'Append Transaction Log',
          description: 'Log active database write transactions to write-ahead logs (WAL) sharding pools.',
          url: 'https://jsonplaceholder.typicode.com/posts',
          method: 'POST',
          headers: [{ key: 'Content-Type', value: 'application/json' }],
          requestBody: JSON.stringify({ log_id: "tx-491a", action: "commit_wal", size_bytes: 4096 }, null, 2),
          responseStatus: 201,
          responseBody: JSON.stringify({ id: 101, status: "created", checkpoint_sha: "a9fd632e8bf5c4d3" }, null, 2),
          savedAt: new Date().toLocaleDateString()
        }
      ];
      setDocsList(initialDocs);
      localStorage.setItem(`haven_api_docs_${projectId}`, JSON.stringify(initialDocs));
    }
  }, [projectId]);

  // Save docs to storage
  const saveDocsToStorage = (list: SavedApiDoc[]) => {
    setDocsList(list);
    localStorage.setItem(`haven_api_docs_${projectId}`, JSON.stringify(list));
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...headers];
    updated[index][field] = val;
    setHeaders(updated);
  };

  // Perform Request
  const handleExecuteRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseBody('');
    setResponseHeaders({});
    
    try {
      const headerObj: Record<string, string> = {};
      headers.forEach(h => {
        if (h.key.trim()) {
          headerObj[h.key] = h.value;
        }
      });

      const options: RequestInit = {
        method,
        headers: headerObj,
      };

      if (method !== 'GET' && requestBody.trim()) {
        try {
          // validate json
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch (je) {
          options.body = requestBody; // set raw anyway
        }
      }

      const res = await fetch(url, options);
      setResponseStatus(res.status);
      
      // parse headers
      const resHeads: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeads[key] = val;
      });
      setResponseHeaders(resHeads);

      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        setResponseBody(JSON.stringify(parsed, null, 2));
      } catch (e) {
        setResponseBody(text || `Empty outcome (Status code: ${res.status})`);
      }
    } catch (err: any) {
      console.error(err);
      setResponseStatus(500);
      setResponseBody(`[SANDBOX NETWORK ERROR]\nCould not establish a network handshake with the target URL: "${url}".\n\nPossible Causes:\n1. CORS Policy restriction (The remote web API does not support client side CORS headers in the pre-flight check).\n2. Typo or invalid domain in URL.\n3. Endpoint requires credentials or secure client SSL handshakes.\n\n🛠️ Action Suggested:\nSelect one of the CORS-safe tester pills listed below to test successfully!`);
    } finally {
      setLoading(false);
    }
  };

  // Save successful response
  const handleSaveDoc = () => {
    if (!docTitle.trim()) return;

    const newDoc: SavedApiDoc = {
      id: `doc-${Date.now()}`,
      projectId,
      title: docTitle.trim(),
      description: docDesc.trim(),
      url,
      method,
      headers: headers.filter(h => h.key.trim() !== ''),
      requestBody: method !== 'GET' ? requestBody : undefined,
      responseStatus: responseStatus || 200,
      responseBody,
      savedAt: new Date().toLocaleDateString()
    };

    const updated = [newDoc, ...docsList];
    saveDocsToStorage(updated);
    setDocTitle('');
    setDocDesc('');
    setShowSaveModal(false);
  };

  const handleDeleteDoc = (id: string) => {
    const updated = docsList.filter(d => d.id !== id);
    saveDocsToStorage(updated);
  };

  const handleApplyPreset = (item: typeof CORS_SAFE_SAMPLES[0]) => {
    setUrl(item.url);
    setMethod(item.method as any);
    if (item.method === 'POST') {
      setRequestBody('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
    }
  };
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10">
      
      {/* Project Header */}
      <div className="flex flex-col gap-6 mb-8 border-b pb-8">
        <div className="flex items-start justify-between">
          <div className="flex gap-4 items-start">
             <div className="w-16 h-16 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border font-bold text-2xl shadow-sm mt-1">
               H
             </div>
             <div>
               <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-3xl font-bold tracking-tight">havendb</h1>
                 <Badge variant="outline" className="text-xs">v1.2.4</Badge>
                 <Badge variant="secondary" className="text-xs text-green-600 bg-green-500/10 border-transparent">Maintained</Badge>
               </div>
               <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
                 A highly concurrent, embedded key-value store optimized for read-heavy analytical workloads. Written in Go.
               </p>
               <div className="flex flex-wrap gap-2 mb-4">
                 {['database', 'golang', 'key-value', 'storage', 'performance'].map((t) => (
                   <span key={t} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                     {t}
                   </span>
                 ))}
               </div>
               <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> 14 Contributors</span>
                  <span className="flex items-center"><Star className="w-4 h-4 mr-1.5" /> 2.4k Stars</span>
                  <span className="flex items-center">Created by @alex_dev</span>
               </div>
             </div>
          </div>
          <div className="flex flex-col gap-3">
             <Button><Star className="w-4 h-4 mr-2" /> Star Project</Button>
             <div className="flex gap-2">
               <Button variant="outline" className="flex-1 text-xs px-2"><ExternalLink className="w-3 h-3 mr-1.5" /> GitHub</Button>
               <ShareModal 
                 url={typeof window !== 'undefined' ? window.location.href : 'https://haven.app/p/havendb'} 
                 title="Check out havendb on Haven Workspace" 
               />
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="readme" className="w-full">
              <TabsList className="mb-6 w-full justify-start h-auto p-0 bg-transparent border-b rounded-none space-x-6">
                 <TabsTrigger value="readme" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm flex items-center">
                   <Code2 className="w-4 h-4 mr-2" /> Overview
                 </TabsTrigger>
                 <TabsTrigger value="sandbox" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm flex items-center font-bold text-violet-400"><Terminal className="w-4 h-4 mr-2 text-violet-500" /> API Sandbox</TabsTrigger>
                  <TabsTrigger value="discussions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm flex items-center">
                   <Users className="w-4 h-4 mr-2" /> Discussions
                 </TabsTrigger>
              </TabsList>

              <TabsContent value="readme" className="outline-none">
                 <Card>
                    <CardContent className="p-6 prose prose-slate dark:prose-invert max-w-none">
                       {/* Rendered Markdown representation */}
                       <h2 className="text-2xl font-bold mt-0 mb-4 border-b pb-2">Getting Started</h2>
                       <p className="mb-4">HavenDB is designed to be easily embedded into any Go application that requires fast local state storage without the overhead of a full relational database.</p>
                       
                       <div className="bg-muted p-4 rounded-lg font-mono text-sm mb-6 text-foreground">
                         <span className="text-blue-500">go get</span> github.com/haven/havendb
                       </div>

                       <h3 className="text-xl font-bold mb-3">Key Features</h3>
                       <ul className="list-disc pl-5 space-y-2 mb-6">
                         <li>Lock-free reads using MVCC</li>
                         <li>Memory-mapped file storage for fast I/O</li>
                         <li>ACID compliant transactions</li>
                         <li>Zero-allocation iterators</li>
                       </ul>

                       <h3 className="text-xl font-bold mb-3">Basic Usage</h3>
                       <div className="bg-muted p-4 rounded-lg font-mono text-sm mt-2 text-foreground">
                         {"db, err := havendb.Open(\"./data\")"}<br/>
                         {"if err != nil { panic(err) }"}<br/>
                         {"defer db.Close()"}<br/>
                         <br/>
                         {"// Write data"}<br/>
                         {"err = db.Put([]byte(\"key\"), []byte(\"value\"))"}<br/>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>
              
              <TabsContent value="sandbox" className="outline-none space-y-6 select-none text-start animate-in fade-in duration-300">
                  
                  {/* Info Header */}
                  <div className="bg-muted/30 border border-border/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-violet-500" />
                        Interactive API Handshake Sandbox
                      </h3>
                      <p className="text-xs text-muted-foreground font-sans">Test public REST APIs directly from your web environment. Handshakes bypass headers to query targets, logging outcome models instantly into documents.</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono px-2 py-0.5 border-violet-500/20 text-violet-400 bg-violet-500/5 shrink-0">
                      CORS Helper Enabled
                    </Badge>
                  </div>

                  {/* CORS tester presets row */}
                  <div>
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-2">QUICK PRESS PRESET APIS (CORS SAFE):</span>
                    <div className="flex flex-wrap gap-2">
                      {CORS_SAFE_SAMPLES.map((sample, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleApplyPreset(sample)}
                          title={sample.desc}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-secondary hover:bg-muted text-secondary-foreground border rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          <span className={`text-[9.5px] font-bold font-mono px-1 rounded ${
                            sample.method === 'POST' ? 'bg-orange-500/10 text-orange-400' : 'bg-primary/10 text-primary'
                          }`}>
                            {sample.method}
                          </span>
                          <span>{sample.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Grid: Request Builder & Response Deck */}
                  <div className="grid lg:grid-cols-2 gap-6 items-start text-start">
                    
                    {/* Left: Request Builder */}
                    <Card className="hover:border-border/60 transition-all border-border text-start">
                      <CardHeader className="p-5 pb-3 bg-muted/10 border-b border-border/40">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                          <Activity className="w-4 h-4 text-violet-500" />
                          Construct Request Pipeline
                        </CardTitle>
                        <CardDescription className="text-xs">Select HTTP method, configure address parameters, and insert structural parameters.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-5 space-y-4 mt-2">
                        
                        {/* URL Method inputs */}
                        <div className="flex gap-2">
                          <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value as any)}
                            className="bg-muted text-foreground border border-border rounded-lg px-2 text-xs outline-none font-bold font-mono shrink-0 h-9"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter REST endpoint (HTTP or HTTPS)..."
                            className="flex-1 text-xs px-3 border rounded-lg bg-background outline-none focus:border-primary font-mono h-9 text-foreground"
                          />
                        </div>

                        {/* Headers Editor block */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center select-none pt-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">CUSTOM HEADERS:</span>
                            <Button 
                              type="button" 
                              onClick={handleAddHeader} 
                              variant="outline" 
                              className="h-6 text-[10px] font-bold px-2 py-0 border-border"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Header Field
                            </Button>
                          </div>

                          {headers.length === 0 ? (
                            <p className="text-[10px] text-muted-foreground italic pl-1">No custom headers configured. Request will use standard defaults.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                              {headers.map((h, i) => (
                                <div key={i} className="flex gap-1.5 items-center">
                                  <input
                                    type="text"
                                    placeholder="Key"
                                    value={h.key}
                                    onChange={(e) => handleHeaderChange(i, 'key', e.target.value)}
                                    className="flex-1 text-xs px-2 h-8 bg-background border rounded-md font-mono text-foreground"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Value"
                                    value={h.value}
                                    onChange={(e) => handleHeaderChange(i, 'value', e.target.value)}
                                    className="flex-1 text-xs px-2 h-8 bg-background border rounded-md font-mono text-foreground"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 shrink-0 hover:text-red-400 hover:bg-red-500/10 border-border"
                                    onClick={() => handleRemoveHeader(i)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Payload Body block */}
                        {method !== 'GET' && (
                          <div className="space-y-2 pt-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">REQUEST DATA PAYLOAD (RAW JSON):</span>
                            <textarea
                              rows={5}
                              value={requestBody}
                              onChange={(e) => setRequestBody(e.target.value)}
                              placeholder="Insert JSON body elements..."
                              className="w-full text-xs font-mono p-3 bg-zinc-950 text-zinc-300 rounded-lg border outline-none focus:border-violet-500"
                            />
                          </div>
                        )}

                        <Button
                          type="button"
                          onClick={handleExecuteRequest}
                          disabled={loading || !url.trim()}
                          className="w-full bg-violet-600 hover:bg-violet-700 font-bold"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Running Live Handshake...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2 fill-current" />
                              Shoot Sandbox Request
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Right: Response Deck & Doc Previewer */}
                    <Card className="hover:border-border/60 transition-all flex flex-col justify-between border-border text-start">
                      <div className="p-5 pb-3 bg-muted/10 border-b border-border/40 text-start">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <BookOpen className="w-4 h-4 text-violet-400" />
                            Response Console & Model Outputs
                          </CardTitle>
                          {responseStatus && (
                            <Badge className={`text-[10px] font-bold ${
                              responseStatus >= 200 && responseStatus < 300 
                                ? 'bg-emerald-500/10 text-emerald-400 border-none' 
                                : 'bg-red-500/10 text-red-400 border-none'
                            }`}>
                              Status: {responseStatus}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs mt-1">Raw output response stream values, headers, and metadata triggers.</CardDescription>
                      </div>

                      <div className="p-5 space-y-4 flex-1 mt-2 text-start">
                        {loading ? (
                          <div className="h-[250px] border border-dashed rounded-xl flex flex-col justify-center items-center text-muted-foreground p-6">
                            <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-3" />
                            <p className="text-xs font-bold text-foreground">Awaiting Target Endpoint Handshake...</p>
                            <p className="text-[11px] text-zinc-500 text-center mt-1 font-sans">Calling payload stream model out across global network ports.</p>
                          </div>
                        ) : responseBody ? (
                          <div className="space-y-4">
                            {/* Response JSON */}
                            <pre className="p-4 rounded-lg bg-zinc-950 text-zinc-300 text-[11px] font-mono leading-relaxed overflow-x-auto shadow-inner h-[210px] scrollbar-thin border border-zinc-800 select-text">
                              <code>{responseBody}</code>
                            </pre>

                            {/* Options to preserve documentation */}
                            {!showSaveModal ? (
                              <Button 
                                type="button" 
                                onClick={() => setShowSaveModal(true)} 
                                variant="outline" 
                                className="w-full flex justify-center items-center gap-1.5 font-bold text-xs hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/25 border-emerald-500/20"
                              >
                                <Save className="w-4 h-4" /> Save this Response as Project Docs
                              </Button>
                            ) : (
                              <div className="border border-emerald-500/25 bg-emerald-500/5 rounded-xl p-4 space-y-3 animate-in slide-in-from-top-3">
                                <h4 className="font-extrabold text-[12px] text-emerald-400 uppercase flex items-center gap-1">
                                  <Save className="w-3.5 h-3.5" /> API DOCUMENTATION METADATA
                                </h4>
                                <div className="space-y-2.5">
                                  <div>
                                    <label className="text-[9px] font-bold font-mono text-muted-foreground uppercase block mb-1">DOC TITLE / ENDPOINT NAME:*</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Query Analytical Registry, Update Metadata..."
                                      value={docTitle}
                                      onChange={(e) => setDocTitle(e.target.value)}
                                      className="w-full text-xs px-2.5 py-1.5 border rounded-md bg-background outline-none font-sans font-bold text-foreground"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold font-mono text-muted-foreground uppercase block mb-1">ENDPOINT FUNCTIONAL USE DESCRIPTION:</label>
                                    <textarea
                                      rows={2}
                                      placeholder="Explain parameters, constraints, and standard use logs..."
                                      value={docDesc}
                                      onChange={(e) => setDocDesc(e.target.value)}
                                      className="w-full text-xs p-2.5 border rounded-md bg-background outline-none font-sans resize-none text-foreground"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      type="button" 
                                      onClick={handleSaveDoc} 
                                      disabled={!docTitle.trim()}
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8"
                                    >
                                      Create Doc Entry
                                    </Button>
                                    <Button 
                                      type="button" 
                                      onClick={() => setShowSaveModal(false)} 
                                      variant="outline" 
                                      className="h-8 text-xs font-semibold"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-[250px] border border-dashed rounded-xl flex flex-col justify-center items-center text-muted-foreground p-6">
                            <HelpCircle className="w-8 h-8 text-zinc-600 mb-2" />
                            <p className="text-xs font-bold text-foreground">Console Pipeline Clear</p>
                            <p className="text-[11px] text-zinc-500 text-center mt-1">Apply a CORS preset, modify values above, and trigger sandbox pipeline execution to map response bodies here.</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Saved Project API Documentation list */}
                  <div className="border-t border-border/80 pt-6 space-y-4">
                    <div className="text-start">
                      <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5 uppercase tracking-wide font-sans">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        Saved API Handshake Documentation ({docsList.length})
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-sans">Explore mock or verified successful endpoints mapped inside the team's live REST documentation files.</p>
                    </div>

                    {docsList.length === 0 ? (
                      <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-xs font-sans">
                        No team API documents saved for this repository. Run successful handshakes above to capture endpoint blueprints.
                      </div>
                    ) : (
                      <div className="space-y-3 font-sans">
                        {docsList.map((doc) => {
                          const isExpanded = expandDocId === doc.id;
                          return (
                            <div 
                              key={doc.id}
                              className="border border-border/70 hover:border-emerald-500/20 bg-card rounded-xl overflow-hidden transition-all shadow-sm"
                            >
                              {/* Header Trigger row */}
                              <div 
                                onClick={() => setExpandDocId(isExpanded ? null : doc.id)}
                                className="p-4 flex justify-between items-center cursor-pointer select-none whitespace-nowrap overflow-x-hidden hover:bg-muted/10 gap-4"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                                    doc.method === 'POST' ? 'bg-orange-500/15 text-orange-400' : 'bg-primary/15 text-primary'
                                  }`}>
                                    {doc.method}
                                  </span>
                                  <div className="min-w-0 truncate text-start">
                                    <h4 className="font-extrabold text-sm text-foreground truncate font-sans">{doc.title}</h4>
                                    <p className="text-[11px] text-muted-foreground truncate font-mono">{doc.url}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground flex-shrink-0">
                                  <span className="hidden sm:inline bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-bold px-1.5 py-0.5 rounded">Status {doc.responseStatus}</span>
                                  <span>{doc.savedAt}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteDoc(doc.id);
                                    }}
                                    className="p-1 px-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 border border-transparent hover:border-red-500/15 rounded-lg transition-colors ms-2"
                                    title="Delete Doc entry"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Expandable Body details */}
                              {isExpanded && (
                                <div className="px-5 pb-5 border-t border-border bg-muted/5 space-y-4 pt-4 animate-in slide-in-from-top-1.5 duration-200">
                                  {doc.description && (
                                    <div className="text-start">
                                      <span className="text-[9px] font-bold font-mono text-muted-foreground tracking-wider uppercase block mb-1">ENDPOINT FUNCTIONAL SPECIFICATION:</span>
                                      <p className="text-xs text-foreground font-normal leading-relaxed">{doc.description}</p>
                                    </div>
                                  )}

                                  {/* Sandbox Re-Simulate button */}
                                  <div className="flex justify-end select-none">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setUrl(doc.url);
                                        setMethod(doc.method as any);
                                        if (doc.headers && doc.headers.length > 0) {
                                          setHeaders(doc.headers);
                                        }
                                        if (doc.requestBody) {
                                          setRequestBody(doc.requestBody);
                                        }
                                        // Scroll back up to the construction panel smoothly
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                      }}
                                      className="h-7 text-xs font-bold border-violet-500/20 text-violet-400 hover:bg-violet-500/5 select-none"
                                    >
                                      <Play className="w-3" /> Load Endpoint to Active Sandbox
                                    </Button>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4 text-start">
                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-muted-foreground tracking-wider uppercase block mb-1">VERIFIED API REQUEST HEADERS:</span>
                                      {doc.headers && doc.headers.length > 0 ? (
                                        <div className="bg-background/80 border p-3 rounded-lg space-y-1">
                                          {doc.headers.map((h, hIdx) => (
                                            <div key={hIdx} className="text-[11px] font-mono text-zinc-400 flex justify-between gap-2 border-b border-border/40 pb-1 last:border-b-0 last:pb-0">
                                              <span className="font-bold text-foreground/80">{h.key}:</span>
                                              <span className="font-normal select-text">{h.value}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-[10px] text-muted-foreground italic pl-1">No custom header requirements cataloged.</p>
                                      )}
                                      
                                      {doc.requestBody && (
                                        <div className="mt-3">
                                          <span className="text-[9px] font-bold font-mono text-zinc-400 tracking-wider uppercase block mb-1">MAPPED REQUEST PAYLOAD DATA (JSON):</span>
                                          <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-300 text-[10px] font-mono leading-relaxed overflow-x-auto border select-text">
                                            <code>{doc.requestBody}</code>
                                          </pre>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-zinc-400 tracking-wider uppercase block mb-1">PRESERVED RESPONSE MODEL BODY (STABLE STATIC DOCUMENT):</span>
                                      <pre className="p-3 rounded-lg bg-zinc-950 text-emerald-400 text-[10px] font-mono leading-relaxed overflow-x-auto border select-text max-h-[180px] scrollbar-thin">
                                        <code>{doc.responseBody}</code>
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

               </TabsContent>

               <TabsContent value="discussions" className="outline-none space-y-4">
                 <Button>New Discussion</Button>
                 {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex gap-4">
                         <Avatar className="h-8 w-8 mt-1">
                           <AvatarFallback>U{i}</AvatarFallback>
                         </Avatar>
                         <div>
                            <p className="font-semibold text-sm hover:underline cursor-pointer">Proposal: Add support for native JSON querying</p>
                            <p className="text-xs text-muted-foreground mt-1">Opened by @user{i} • 3 days ago • 12 comments</p>
                         </div>
                      </CardContent>
                    </Card>
                 ))}
              </TabsContent>
            </Tabs>
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle className="text-sm">About</CardTitle>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground space-y-4">
                  <p>HavenDB was built to solve the latency issues encountered when scaling Haven's real-time messaging architecture.</p>
                  <div className="pt-4 border-t space-y-3">
                     <a href="#" className="flex items-center text-foreground hover:underline">
                        <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" /> Documentation
                     </a>
                     <a href="#" className="flex items-center text-foreground hover:underline">
                        <ShieldAlert className="w-4 h-4 mr-2 text-muted-foreground" /> Security Policy
                     </a>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    Contributors
                    <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 rounded-full">14</span>
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-wrap gap-2">
                     {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <Avatar key={i} className="h-8 w-8 border border-border">
                           <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                        </Avatar>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
