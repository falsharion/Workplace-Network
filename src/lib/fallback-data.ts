import type { Event, Mentor, Group, MemberStory, Article } from '@/types/database'

export const FALLBACK_FEATURED_EVENT: Event = {
  id: 'fallback-event-1',
  name: 'Your Good Works0 — A Career & Work Conference',
  description:
    'From weekly mentorship sessions to large-scale conferences, our events calendar is packed with opportunities to learn, network, and grow.',
  scripture_reference: 'Matthew 5:16',
  flyer_url: null,
  start_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
  location: null,
  is_virtual: true,
  is_featured: true,
  created_at: new Date().toISOString(),
}

export const FALLBACK_CURATED_EVENTS: Event[] = [
  {
    id: 'curated-1',
    name: 'Your Good Works1',
    description: 'A Career & Work Conference',
    scripture_reference: 'Matthew 5:16',
    flyer_url: null,
    start_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Virtual',
    is_virtual: true,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'curated-2',
    name: 'Your Good Works2',
    description: 'A Career & Work Conference',
    scripture_reference: 'Matthew 5:16',
    flyer_url: null,
    start_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Fantasia Hall, Eko Hotel',
    is_virtual: false,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'curated-3',
    name: 'Your Good Works3',
    description: 'A Career & Work Conference',
    scripture_reference: 'Matthew 5:16',
    flyer_url: null,
    start_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Fantasia Hall, Eko Hotel',
    is_virtual: false,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
]
export const FALLBACK_MENTORS: Mentor[] = [
  { id: '1', name: 'James Mohammed2', title: 'CEO @ Homes Field', photo_url: null, profile_url: '#' },
  { id: '2', name: 'James Mohammed', title: 'CEO @ Homes Field', photo_url: null, profile_url: '#' },
  { id: '3', name: 'James Mohammed', title: 'CEO @ Homes Field', photo_url: null, profile_url: '#' },
  { id: '4', name: 'James Mohammed', title: 'CEO @ Homes Field', photo_url: null, profile_url: '#' },
]

export const FALLBACK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Group 1 name',
    description:
      'This group brings together members seeking meaningful conversations, personal growth within a supportive community.',
    photo_url: null,
    member_count: 24,
  },
  {
    id: '2',
    name: 'Group 2 name',
    description:
      'Connect with members who are passionate about expanding their network, collaborating, and connecting with like-minded professionals.',
    photo_url: null,
    member_count: 18,
  },
  {
    id: '3',
    name: 'Group 3 name',
    description:
      'This group is about members passionate about leadership development, supporting one another through shared experiences and growth.',
    photo_url: null,
    member_count: 31,
  },
  {
    id: '4',
    name: 'Group 4 name',
    description:
      'Here, members are interested in discovering opportunities, collaborating on projects, and growing together within the community.',
    photo_url: null,
    member_count: 15,
  },
]

export const FALLBACK_MEMBER_STORIES: MemberStory[] = [
  {
    id: '1',
    name: 'Jane Chris',
    role: 'HR @ ABC Enterprise',
    quote: 'This community helped me grow professionally while staying grounded in my faith and values.',
    photo_url: null,
    video_url: null,
  },
  {
    id: '2',
    name: 'Jane Chris',
    role: 'HR @ ABC Enterprise',
    quote: 'This community helped me grow professionally while staying grounded in my faith and values.',
    photo_url: null,
    video_url: null,
  },
  {
    id: '3',
    name: 'Jane Chris',
    role: 'HR @ ABC Enterprise',
    quote: 'This community helped me grow professionally while staying grounded in my faith and values.',
    photo_url: null,
    video_url: null,
  },
  {
    id: '4',
    name: 'Jane Chris',
    role: 'HR @ ABC Enterprise',
    quote: 'This community helped me grow professionally while staying grounded in my faith and values.',
    photo_url: null,
    video_url: null,
  },
]

export const FALLBACK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The power of mentorship for Christian professionals. Why mentorship matters.',
    author: 'Jerry Akons',
    author_avatar_url: null,
    published_at: '2025-02-09',
    slug: 'power-of-mentorship',
  },
  {
    id: '2',
    title: 'Practical ways Christian professionals can live out their faith in the workplace.',
    author: 'Olajumoke Akin',
    author_avatar_url: null,
    published_at: '2025-01-11',
    slug: 'faith-in-workplace',
  },
  {
    id: '3',
    title: 'How Modern Products Teams Are Using AI Tools at Work',
    author: 'Sharon West',
    author_avatar_url: null,
    published_at: '2025-03-11',
    slug: 'ai-tools-at-work',
  },
]

export const REASONS_TO_JOIN = [
  'Thriving in the new work and new ways era.',
  'Insights to setting your career value proposition (CVP)',
  'Masterclasses and panel session from industry leaders.',
  'Worship and prayer time.',
]

export const FAQ_ITEMS = [
  {
    question: 'What is the Workplace Network?',
    answer:
      'Workplace Network is a faith-based mentoring and networking platform for career professionals and entrepreneurs in the marketplace.',
  },
{
  question: 'How do I join the network?',
  answer:
    'During registration, you will be required to complete a short profile capturing your industry, career stage and top goals to select your single mentor cohort.',
},
  {
    question: 'What benefits do members receive?',
    answer:
      'Members gain direct access to seasoned corporate mentors, a unified growth curriculum, curated career development events and a vibrant community',
  },
  {
    question: 'Is the platform free to join?',
    answer:
      'YES. Access to our general community channels, core career workshops and mentorship program is completely free for registered members',
  },
]
