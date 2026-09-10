import { z } from 'zod';

const APPROVED_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'soundcloud.com',
  'vimeo.com',
  'twitch.tv',
  'tiktok.com',
  'instagram.com'
];

const FORBIDDEN_EXTENSIONS = ['.mp4', '.mp3', '.mov', '.wav', '.avi', '.mkv', '.flv'];

export const trackUrlSchema = z.string().url().refine((url) => {
  try {
    const parsedUrl = new URL(url);

    // 1. Only HTTPS
    if (parsedUrl.protocol !== 'https:') return false;

    // 2. Block raw IP addresses
    const hostname = parsedUrl.hostname;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(hostname)) return false;

    // 3. Only approved domains
    const isApproved = APPROVED_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    if (!isApproved) return false;

    // 4. Block direct media extensions
    const path = parsedUrl.pathname.toLowerCase();
    if (FORBIDDEN_EXTENSIONS.some(ext => path.endsWith(ext))) return false;

    return true;
  } catch {
    return false;
  }
}, {
  message: "Please provide a valid HTTPS link from an approved platform (YouTube, SoundCloud, etc.). Direct files and IP addresses are not allowed."
});

export type TrackUrl = z.infer<typeof trackUrlSchema>;
