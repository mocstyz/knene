/**
 * @fileoverview 首页英雄区域数据定义
 * @description 定义首页英雄轮播区域的数据结构和内容数据，提供13个精选影片展示内容
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import heroImage1 from '@images/heroes/0003.jpg'
import heroImage2 from '@images/heroes/0015.jpg'
import heroImage3 from '@images/heroes/0016.jpg'
import heroImage4 from '@images/heroes/0031.jpg'
import heroImage5 from '@images/heroes/0034.jpg'
import heroImage6 from '@images/heroes/0036.jpg'
import heroImage7 from '@images/heroes/0042.jpg'
import heroImage8 from '@images/heroes/0046.jpg'
import heroImage9 from '@images/heroes/0047.jpg'
import heroImage10 from '@images/heroes/0049.jpg'
import heroImage11 from '@images/heroes/0056.png'
import heroImage12 from '@images/heroes/0063.jpg'
import heroImage13 from '@images/heroes/0067.jpg'

// 英雄区域数据项接口，定义首页轮播展示的单个影片内容结构
export interface HeroItem {
  id: string // 唯一标识符
  title: string // 影片标题
  description: string // 影片描述
  imageUrl: string // 影片海报图片
}

// 首页英雄区域数据数组，包含13个精选影片展示内容
export const heroData: HeroItem[] = [
  {
    id: 'hero-1',
    title: 'Starlight Symphony',
    description:
      'A captivating tale of music, love, and destiny under the celestial lights. Follow the journey of two souls brought together by a cosmic melody.',
    imageUrl: heroImage1,
  },
  {
    id: 'hero-2',
    title: 'Celestial Dance',
    description:
      'When gravity fails and time bends, reality becomes a dance floor. Witness the extraordinary journey through dimensions unknown.',
    imageUrl: heroImage2,
  },
  {
    id: 'hero-3',
    title: 'Eternal Horizon',
    description:
      'Beyond the edge of darkness lies a world of infinite possibilities. A story of hope, courage, and the human spirit.',
    imageUrl: heroImage3,
  },
  {
    id: 'hero-4',
    title: 'Whispers of the Wind',
    description:
      'In a world where nature speaks, listen carefully. An enchanting tale of harmony between humans and the elements.',
    imageUrl: heroImage4,
  },
  {
    id: 'hero-5',
    title: 'The Midnight Bloom',
    description:
      'When darkness falls, the true beauty emerges. A magical journey through a garden that only blooms under moonlight.',
    imageUrl: heroImage5,
  },
  {
    id: 'hero-6',
    title: 'Echoes of Tomorrow',
    description:
      'The future calls out, but the past refuses to let go. A thrilling adventure through time and memory.',
    imageUrl: heroImage6,
  },
  {
    id: 'hero-7',
    title: 'Neon Dreams',
    description:
      'In a city illuminated by endless neon lights, dreams and reality blur into one. Explore the vibrant nightlife of a cyberpunk metropolis.',
    imageUrl: heroImage7,
  },
  {
    id: 'hero-8',
    title: "Ocean's Mystery",
    description:
      "Beneath the waves lies a world of wonder and danger. Dive deep into the ocean's secrets and discover what lies in the abyss.",
    imageUrl: heroImage8,
  },
  {
    id: 'hero-9',
    title: 'Quantum Paradox',
    description:
      'When science meets philosophy, the impossible becomes possible. A mind-bending journey through quantum mechanics and parallel universes.',
    imageUrl: heroImage9,
  },
  {
    id: 'hero-10',
    title: 'Digital Uprising',
    description:
      'Artificial intelligence awakens, and the line between human and machine fades forever. Witness the dawn of a new digital era.',
    imageUrl: heroImage10,
  },
  {
    id: 'hero-11',
    title: 'Cosmic Voyage',
    description:
      'Journey across the stars to distant galaxies and unknown civilizations. Space exploration at its finest, with danger and discovery at every turn.',
    imageUrl: heroImage11,
  },
  {
    id: 'hero-12',
    title: 'Time Spiral',
    description:
      'Past, present, and future collide in an epic adventure across timelines. Can history be changed, or is destiny written in stone?',
    imageUrl: heroImage12,
  },
  {
    id: 'hero-13',
    title: 'Mythic Legacy',
    description:
      'Ancient legends come to life in modern times. Heroes and gods walk among us, and mythology becomes reality in this epic saga.',
    imageUrl: heroImage13,
  },
]
