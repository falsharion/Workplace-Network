import type { MemberStory } from '@/types/database'

const STORY_IMAGES = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
]

interface MemberStoryCardProps {
  story: MemberStory
  index: number
}

function MemberStoryCard({ story, index }: MemberStoryCardProps) {
  const imgSrc = story.photo_url ?? STORY_IMAGES[index % STORY_IMAGES.length]

  return (
    <div
      className="scroll-snap-item flex-shrink-0 relative rounded-2xl overflow-hidden"
      style={{ width: 'clamp(200px, 42vw, 280px)', height: 'clamp(260px, 55vw, 360px)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={story.name}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.9) 100%)' }}
      />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {story.quote && (
          <p className="text-white text-xs leading-relaxed mb-2 line-clamp-3">
            &ldquo;{story.quote}&rdquo;
          </p>
        )}
        <p className="text-white font-semibold text-xs">{story.name}</p>
        {story.role && (
          <p className="text-white/60 text-[10px] mt-0.5">{story.role}</p>
        )}
      </div>
    </div>
  )
}

interface MemberStoriesProps {
  stories: MemberStory[]
}

export function MemberStories({ stories }: MemberStoriesProps) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8  max-w-5xl w-full lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-gray-400 mb-2">Member Stories</p>
          <h2 className="text-2xl  font-bold" style={{ color: '#0B0E14' }}>
            Christian professionals<br />thrive here
          </h2>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto scroll-snap-x -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 pb-2">
          {stories.map((story, idx) => (
            <MemberStoryCard key={story.id} story={story} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
