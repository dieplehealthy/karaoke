/**
 * YouTube Search Service
 * Handles searching for songs on YouTube
 */

const SearchService = (function() {
  // YouTube Data API key (consider moving to backend for security)
  const API_KEY = 'AIzaSyBlj5BXufxS4lp4wdVgDKFAncbsUpqa-G8';
  const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

  /**
   * Search YouTube for videos
   */
  async function searchYouTube(query) {
    try {
      console.log('[Search Service] Searching for:', query);

      // Try YouTube Data API first
      const results = await searchViaAPI(query);
      if (results && results.length > 0) {
        console.log('[Search Service] Found', results.length, 'results via API');
        return results;
      }

      // Fallback to enhanced mock results
      console.log('[Search Service] Using fallback results');
      return getFallbackResults(query);
    } catch (error) {
      console.error('[Search Service] Error:', error);
      return getFallbackResults(query);
    }
  }

  /**
   * Search via YouTube Data API
   */
  async function searchViaAPI(query) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${YOUTUBE_API_BASE}/search?` +
        `q=${encodedQuery}` +
        `&type=video` +
        `&part=snippet` +
        `&maxResults=8` +
        `&key=${API_KEY}` +
        `&regionCode=VN` +
        `&relevanceLanguage=vi`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('[Search Service] API response not ok:', response.status);
        return null;
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        console.warn('[Search Service] No items in API response');
        return null;
      }

      return data.items.map((item) => {
        const snippet = item.snippet;
        return {
          id: item.id.videoId,
          title: snippet.title,
          duration: estimateDuration(snippet.title),
          thumbnail: snippet.thumbnails.high?.url || 
                     snippet.thumbnails.medium?.url || 
                     snippet.thumbnails.default?.url ||
                     'https://via.placeholder.com/60',
          channelTitle: snippet.channelTitle,
          publishedAt: snippet.publishedAt
        };
      });
    } catch (error) {
      console.warn('[Search Service] API search failed:', error.message);
      return null;
    }
  }

  /**
   * Estimate video duration based on title
   */
  function estimateDuration(title) {
    // Look for duration patterns in title
    const patterns = [
      /(\d+):(\d+):(\d+)/,  // HH:MM:SS
      /(\d+):(\d+)/         // MM:SS
    ];

    for (let pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        if (match.length === 4) {
          // HH:MM:SS
          return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
        } else if (match.length === 3) {
          // MM:SS
          return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
      }
    }

    // Default: random between 2-5 minutes for songs
    return 120 + Math.random() * 180;
  }

  /**
   * Get fallback results when API fails
   */
  function getFallbackResults(query) {
    // More realistic fallback results
    const variations = [
      { suffix: ' - Official Audio', duration: 213 },
      { suffix: ' - Lyrics Video', duration: 245 },
      { suffix: ' - Karaoke', duration: 280 },
      { suffix: ' - Cover', duration: 195 },
      { suffix: ' - Live Performance', duration: 420 },
      { suffix: ' - Remix', duration: 230 },
      { suffix: ' - Music Video', duration: 250 },
      { suffix: ' - Acoustic', duration: 210 }
    ];

    return variations.slice(0, 5).map((item, index) => ({
      id: 'video_' + Math.random().toString(36).substr(2, 9),
      title: query + item.suffix,
      duration: item.duration,
      thumbnail: `https://via.placeholder.com/60?text=Song${index + 1}`,
      channelTitle: 'Music Channel',
      publishedAt: new Date().toISOString()
    }));
  }

  /**
   * Format duration for display
   */
  function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return {
    search: searchYouTube,
    formatDuration: formatDuration
  };
})();
