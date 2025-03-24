'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PlantViewButtonProps {
  plantId: string;
}

export default function PlantViewButton({ plantId }: PlantViewButtonProps) {
  return (
    <Link href={`/plants/${plantId}`}>
      <Button
        variant="outline"
        size="sm"
        className="bg-LightGreenBG rounded-full hover:bg-LightGreenBG/80 text-black"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </Link>
  );
}
