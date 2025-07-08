export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import JobsClient from './JobsClient';

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading jobs...</div>}>
      <JobsClient />
    </Suspense>
  );
}