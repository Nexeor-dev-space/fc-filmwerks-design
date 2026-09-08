'use client';

import { FilmFrame, type FilmFrameProps } from './FilmFrame';

export interface YouTubeEmbedProps extends Omit<FilmFrameProps, 'source'> {
  /** The `v=` id from the watch URL. */
  videoId: string;
}

/**
 * A YouTube film behind a poster.
 *
 * A thin name over `FilmFrame`, kept because most of the site's films are on
 * YouTube and `videoId` reads better than a source object at those call sites.
 * All the behaviour — the poster, the grain, the play mark, loading nothing
 * from YouTube until the visitor presses play — lives in `FilmFrame`, so a
 * hosted film and a published one cannot drift apart.
 */
export function YouTubeEmbed({ videoId, ...rest }: YouTubeEmbedProps) {
  return <FilmFrame source={{ youtubeId: videoId }} {...rest} />;
}
