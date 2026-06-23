import React from 'react';
import { CommunityHub } from '../components/community/CommunityHub';

export default function CommunityPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-foreground">
            Haven Community
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl">
            Discover topics, join voice rooms, and connect with developers and creators from around the world.
          </p>
        </div>
      </div>
      <CommunityHub />
    </div>
  );
}
