'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import type { MemberStory } from '@/types/database'

const STORY_IMAGES = [
  '/assets/Member1img.jpg',
  '/assets/member2img.jpg',
  '/assets/Member3img.jpg',
  '/assets/member4img.jpg',
]

interface MemberStoryCardProps {
  story: MemberStory
  index: number
  isPlaying: boolean
  onToggle: () => void
}

function MemberStoryCard({ story, index, isPlaying, onToggle }: MemberStoryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [videoFailed, setVideoFailed] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [buffering, setBuffering] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)

  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const imgSrc = story.photo_url ?? STORY_IMAGES[index % STORY_IMAGES.length]
  const hasVideo = Boolean(story.video_url) && !videoFailed

  // Covers the case where the image was already cached/decoded before this
  // handler attached — onLoad won't fire again for an already-complete
  // image, so we check img.complete directly right after mount.
  useEffect(() => {
    setImgLoaded(false)
    setImgError(false)
    const img = imgRef.current
    if (img?.complete) {
      if (img.naturalWidth === 0) {
        setImgError(true)
      } else {
        setImgLoaded(true)
      }
    }
  }, [imgSrc])

  // Play/pause — resumes from currentTime instead of restarting, unless
  // the video already finished (then a re-play starts over, as expected).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      if (video.ended) {
        video.currentTime = 0
        setProgress(0)
      }
      video.play().catch(() => setVideoFailed(true))
    } else {
      video.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const video = videoRef.current
    if (video) video.muted = muted
  }, [muted])

  function handleClick() {
    if (!hasVideo) return
    onToggle()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    handleClick()
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    if (scrubbing) return // avoid fighting with the drag-driven value
    const { currentTime, duration } = e.currentTarget
    if (duration > 0) setProgress((currentTime / duration) * 100)
  }

  function handleMuteToggle(e: React.MouseEvent) {
    e.stopPropagation()
    setMuted((m) => !m)
  }

  // ── Seeking ──
  function seekToClientX(clientX: number) {
    const track = trackRef.current
    const video = videoRef.current
    if (!track || !video || !video.duration) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    video.currentTime = ratio * video.duration
    setProgress(ratio * 100)
  }

  function handleTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    setScrubbing(true)
    seekToClientX(e.clientX)
  }
  function handleTrackPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!scrubbing) return
    e.stopPropagation()
    seekToClientX(e.clientX)
  }
  function handleTrackPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    setScrubbing(false)
  }
  function handleTrackClick(e: React.MouseEvent) {
    e.stopPropagation()
  }
  function handleTrackKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const video = videoRef.current
    if (!video || !video.duration) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
      video.currentTime = Math.min(video.duration, video.currentTime + 5)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      e.stopPropagation()
      video.currentTime = Math.max(0, video.currentTime - 5)
    }
  }

  return (
    <div id="member-stories"
      className="scroll-snap-item flex-shrink-0 relative rounded-2xl overflow-hidden"
      style={{
        width: 'clamp(200px, 42vw, 280px)',
        height: 'clamp(260px, 55vw, 360px)',
        cursor: hasVideo ? 'pointer' : 'default',
      }}
      onClick={handleClick}
      onKeyDown={hasVideo ? handleKeyDown : undefined}
      role={hasVideo ? 'button' : undefined}
      tabIndex={hasVideo ? 0 : undefined}
      aria-label={hasVideo ? `${isPlaying ? 'Pause' : 'Play'} ${story.name}'s video` : undefined}
    >
      {/* Fallback image — base layer, with skeleton until it actually loads */}
      <div className="absolute inset-0 bg-gray-200">
        <div
          className={`absolute inset-0 skeleton-shimmer transition-opacity duration-300 ${
            imgLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={imgSrc}
            alt={story.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-400">
            <span className="text-white font-semibold text-3xl">
              {story.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Video — only rendered if this story actually has one; sits on
          top of the image and is only visible while playing */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={story.video_url ?? undefined}
          poster={imgSrc}
          playsInline
          muted={muted}
          preload="none"
          onEnded={onToggle}
          onError={() => setVideoFailed(true)}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          onCanPlay={() => setBuffering(false)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Buffering spinner — video is playing but stalled on data */}
      {hasVideo && isPlaying && buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white spinner-spin" />
        </div>
      )}

      {/* Play affordance — hidden once playing */}
      {hasVideo && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
      )}

      {/* Mute toggle — only visible while playing */}
      {hasVideo && (
        <button
          onClick={handleMuteToggle}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className={`member-story-mute absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white ${
            isPlaying ? 'member-story-mute-visible' : ''
          }`}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      )}

      {/* Seekable progress bar */}
      {hasVideo && (
        <div
          ref={trackRef}
          className={`member-story-progress-hitarea absolute bottom-0 left-0 right-0 py-2 px-1 ${
            isPlaying ? 'member-story-progress-hitarea-visible' : ''
          }`}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onClick={handleTrackClick}
          onKeyDown={handleTrackKeyDown}
          role="slider"
          aria-label={`Seek ${story.name}'s video`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          tabIndex={isPlaying ? 0 : -1}
        >
          <div className="member-story-progress-track">
            <div className="member-story-progress-fill" style={{ width: `${progress}%` }} />
            <div
              className={`member-story-progress-thumb ${scrubbing ? 'member-story-progress-thumb-active' : ''}`}
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className={`member-story-scrim absolute inset-0 pointer-events-none ${
          isPlaying ? 'member-story-scrim-hidden' : ''
        }`}
        style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.9) 100%)' }}
      />

      {/* Text */}
      <div
        className={`member-story-caption absolute bottom-0 left-0 right-0 p-4 pointer-events-none ${
          isPlaying ? 'member-story-caption-hidden' : ''
        }`}
      >
        {story.quote && (
          <p className="text-white text-lg leading-relaxed mb-2 line-clamp-3">
            &ldquo;{story.quote}&rdquo;
          </p>
        )}
        <p className="text-white font-semibold text-lg">{story.name}</p>
        {story.role && (
          <p className="text-white/80 text-sm md:text-base mt-0.5">{story.role}</p>
        )}
      </div>
    </div>
  )
}

interface MemberStoriesProps {
  stories: MemberStory[]
}

export function MemberStories({ stories }: MemberStoriesProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)

  function handleToggle(id: string) {
    setPlayingId((current) => (current === id ? null : id))
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="mb-8 max-w-5xl w-full md:max-w-2xl lg:max-w-4xl mx-auto px-7 sm:px-6 lg:px-8">
          <p className="eyebrow text-gray-400 mb-2">Member Stories</p>
          <h2 className="text-2xl font-bold" style={{ color: '#0B0E14' }}>
            Christian professionals<br />thrive here
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto scroll-snap-x -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 pb-2">
          {stories.map((story, idx) => (
            <MemberStoryCard
              key={story.id}
              story={story}
              index={idx}
              isPlaying={playingId === story.id}
              onToggle={() => handleToggle(story.id)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .member-story-caption {
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .member-story-caption-hidden {
          transform: translateY(100%);
          opacity: 0;
        }

        .member-story-scrim {
          transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .member-story-scrim-hidden {
          opacity: 0;
        }

        .member-story-mute {
          opacity: 0;
          transform: scale(0.85);
          pointer-events: none;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .member-story-mute-visible {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .member-story-progress-hitarea {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          touch-action: none;
          cursor: pointer;
        }
        .member-story-progress-hitarea-visible {
          opacity: 1;
          pointer-events: auto;
        }
        .member-story-progress-track {
          position: relative;
          height: 3px;
          border-radius: 2px;
          background: rgb(127 78 0);
        }
        .member-story-progress-fill {
          height: 100%;
          border-radius: 2px;
          background: rgb(255 185 73);
          transition: width 0.1s linear;
        }
        .member-story-progress-thumb {
          position: absolute;
          top: 50%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgb(255 185 73);
          transform: translate(-50%, -50%) scale(0.9);
          transition: transform 0.15s ease;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.25);
        }
        .member-story-progress-thumb-active {
          transform: translate(-50%, -50%) scale(1.3);
        }

        .skeleton-shimmer {
          background: linear-gradient(90deg, #d8d8d8 25%, #ececec 37%, #d8d8d8 63%);
          background-size: 400% 100%;
          animation: skeleton-shimmer-move 1.4s ease-in-out infinite;
        }
        @keyframes skeleton-shimmer-move {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        .spinner-spin {
          animation: spinner-spin 0.7s linear infinite;
        }
        @keyframes spinner-spin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .member-story-caption,
          .member-story-scrim,
          .member-story-mute,
          .member-story-progress-hitarea,
          .member-story-progress-fill,
          .member-story-progress-thumb {
            transition: none;
          }
          .skeleton-shimmer, .spinner-spin { animation: none; }
        }
      `}</style>
    </section>
  )
}