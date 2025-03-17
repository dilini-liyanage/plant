'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type CloudinaryResult = {
  public_id: string;
  secure_url: string;
};

type ImageUploadProps = {
  value: { url: string; alt: string; publicId: string }[];
  onChange: (value: { url: string; alt: string; publicId: string }[]) => void;
  disabled?: boolean;
};

export default function ImageUpload({
  value = [],
  onChange,
  disabled = false,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: CloudinaryResult) => {
    const newImage = {
      url: result.secure_url,
      alt: 'Plant image',
      publicId: result.public_id,
    };
    onChange([...value, newImage]);
  };

  const onRemove = (publicId: string) => {
    onChange(value.filter((image) => image.publicId !== publicId));
  };

  const updateAlt = (publicId: string, newAlt: string) => {
    onChange(
      value.map((image) =>
        image.publicId === publicId ? { ...image, alt: newAlt } : image
      )
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((image) => (
          <div
            key={image.publicId}
            className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
          >
            <div className="absolute right-2 top-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(image.publicId)}
                variant="destructive"
                size="icon"
                className="h-7 w-7 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt={image.alt}
              src={image.url}
            />
            <input
              type="text"
              placeholder="Alt text"
              className="absolute bottom-0 w-full bg-black/50 p-1 text-white"
              value={image.alt}
              onChange={(e) => updateAlt(image.publicId, e.target.value)}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        uploadPreset="plant-nursery"
        onUpload={(result: any) => onUpload(result.info)}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => open()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
} 