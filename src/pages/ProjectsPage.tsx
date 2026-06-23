import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/components';
import { Button } from '../components/ui/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Code2, Search, Filter, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';

export default function ProjectsPage() {
  const projects = [
    { id: 'havendb', title: 'havendb', desc: 'A blazing fast, embedded key-value store optimized for read-heavy workloads.', creator: 'alex_dev', lang: 'Go', stars: '2.4k', certified: true },
    { id: 'ui-components', title: 'ui-components', desc: 'Headless, accessible UI primitives for modern React applications.', creator: 'design_system', lang: 'TypeScript', stars: '1.2k', certified: true },
    { id: 'rust-mailer', title: 'rust-mailer', desc: 'High throughput email dispatching service.', creator: 'systems_guild', lang: 'Rust', stars: '840', certified: false },
    { id: 'auth-proxy', title: 'auth-proxy', desc: 'Zero-trust authentication reverse proxy.', creator: 'sec_ops', lang: 'Go', stars: '430', certified: false },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Open Source Projects</h1>
          <p className="text-muted-foreground text-lg">Discover, contribute, and collaborate on projects built by organizations across the platform.</p>
        </div>
        <Button>Submit Project</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="mb-6 inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 border-none">
          <TabsTrigger value="trending" className="rounded-sm px-3 py-1.5 text-sm">Trending</TabsTrigger>
          <TabsTrigger value="new" className="rounded-sm px-3 py-1.5 text-sm">Recently Added</TabsTrigger>
          <TabsTrigger value="help" className="rounded-sm px-3 py-1.5 text-sm">Help Wanted</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="outline-none">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
            {projects.map((p) => (
              <Link to={`/p/${p.id}`} key={p.id}>
                <Card className="h-full hover:border-primary/50 transition-all hover:shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold hover:underline">{p.title}</h3>
                        {p.certified && <ShieldCheck className="w-4 h-4 text-blue-500" title="Haven Verified" />}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-3.5 h-3.5 mr-1" /> {p.stars}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="font-normal">{p.lang}</Badge>
                        <span className="text-muted-foreground">by @{p.creator}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
