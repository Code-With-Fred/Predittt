import type { MetadataRoute } from 'next';
import { getTodaysPredictions, getTipsters } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [predictions, tipsters] = await Promise.all([
    getTodaysPredictions(),
    getTipsters(),
  ]);

  const base = 'https://predicta.ng';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/track-record`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/vip`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/tipsters`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/responsible-gambling`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const predictionRoutes: MetadataRoute.Sitemap = predictions.map((p) => ({
    url: `${base}/predictions/${p.id}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const tipsterRoutes: MetadataRoute.Sitemap = tipsters.map((t) => ({
    url: `${base}/tipsters/${t.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...predictionRoutes, ...tipsterRoutes];
}
