'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlantSchema } from '@/types/plant';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ImageUpload from './ImageUpload';
import dynamic from 'next/dynamic';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';

// Create a form schema based on our Plant schema
const formSchema = PlantSchema.omit({
  // _id: true,
  createdAt: true,
  updatedAt: true,
});

type FormValues = z.infer<typeof formSchema>;

type PlantFormProps = {
  initialData?: FormValues;
  isEditing?: boolean;
};

const PLANT_CATEGORIES = [
  'Indoor',
  'Outdoor',
  'Flowering',
  'Succulents',
  'Tropical',
  'Cacti',
  'Herbs',
  'Vegetables',
  'Fruit',
  'Trees',
  'Shrubs',
];

export default function PlantForm({
  initialData,
  isEditing = false,
}: PlantFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues = initialData || {
    name: '',
    scientificName: '',
    description: '',
    careInstructions: '',
    categories: [],
    images: [],
    featured: false,
    price: undefined,
    stock: undefined,
    seoMetadata: {
      title: '',
      description: '',
      keywords: [],
    },
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Watch values for controlled components
  const watchImages = form.watch('images');
  const watchCategories = form.watch('categories');
  const watchDescription = form.watch('description');
  const watchCareInstructions = form.watch('careInstructions');

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      if (isEditing && initialData) {
        // Update existing plant
        await fetch(`/api/plants/edit/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create new plant
        await fetch('/api/plants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      router.push('/admin/plants');
      router.refresh();
    } catch (error) {
      console.error('Error saving plant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter plant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scientificName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter scientific name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PLANT_CATEGORIES.map((category) => (
                        <FormField
                          key={category}
                          control={form.control}
                          name="categories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category)}
                                    onCheckedChange={(checked) => {
                                      const currentCategories =
                                        field.value || [];
                                      return checked
                                        ? field.onChange([
                                            ...currentCategories,
                                            category,
                                          ])
                                        : field.onChange(
                                            currentCategories.filter(
                                              (c) => c !== category
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {category}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Plant</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value || []}
                        onChange={(images) => {
                          field.onChange(images);
                          console.log(images);
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value && field.value.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Uploaded Images:
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {field.value.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-md overflow-hidden border"
                            >
                              <Image
                                src={image.url}
                                alt={`Uploaded image ${index + 1}`}
                                className="object-cover w-full h-full"
                                width={100}
                                height={100}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-8 w-8 p-0"
                                onClick={() => {
                                  const newImages = [...field.value];
                                  newImages.splice(index, 1);
                                  field.onChange(newImages);
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="h-64">
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Care Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="careInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="h-64">
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Metadata (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="seoMetadata.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoMetadata.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="SEO description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoMetadata.keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Keywords (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. indoor, tropical, easy care"
                      value={field.value?.join(', ') || ''}
                      onChange={(e) => {
                        const keywords = e.target.value
                          .split(',')
                          .map((keyword) => keyword.trim())
                          .filter(Boolean);
                        field.onChange(keywords);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/plants')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? 'Saving...'
              : isEditing
                ? 'Update Plant'
                : 'Create Plant'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
