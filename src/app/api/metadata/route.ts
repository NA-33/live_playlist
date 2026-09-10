import { NextResponse } from 'next/server';

const OEMBED_ENDPOINTS = {
  youtube: 'https://www.youtube.com/oembed',
  tiktok: 'https://www.tiktok.com/oembed',
  soundcloud: 'https://soundcloud.com/api', // SoundCloud uses a different API usually, but we'll try oEmbed if possible
  instagram: 'https://api.instagram.com/oembed',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    let platform = 'unknown';
    if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
    else if (url.includes('tiktok.com')) platform = 'tiktok';
    else if (url.includes('instagram.com')) platform = 'instagram';
    else if (url.includes('soundcloud.com')) platform = 'soundcloud';

    if (platform === 'unknown') {
      return NextResponse.json({
        title: url,
        thumbnail: 'https://picsum.photos/seed/generic/200/120',
        duration: 'Unknown'
      });
    }

    const oembedUrl = `${OEMBED_ENDPOINTS[platform as keyof typeof OEMBED_ENDPOINTS]}?url=${encodeURIComponent(url)}&format=json`;

    const response = await fetch(oembedUrl);
    if (!response.ok) throw new Error('Failed to fetch metadata');

    const data = await response.json();

    return NextResponse.json({
      title: data.title || url,
      thumbnail: data.thumbnail_url || 'https://picsum.photos/seed/generic/200/120',
      duration: data.duration || 'Unknown',
    });
  } catch (error: any) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json({
      title: url,
      thumbnail: 'https://picsum.photos/seed/generic/200/120',
      duration: 'Unknown'
    });
  }
}
