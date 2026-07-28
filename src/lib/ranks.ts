import type { SortKey } from '../types'

export const PRICE_MIN = 0
export const PRICE_MAX = 50000
export const SKINS_MAX = 150

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'En Yeniler' },
  { key: 'price_asc', label: 'Fiyat: Düşükten Yükseğe' },
  { key: 'price_desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { key: 'skins_desc', label: 'En Çok Skin' },
]

export interface RankGroup {
  label: string
  ranks: string[]
}

export const RANK_GROUPS: RankGroup[] = [
  {
    label: 'Efsanevi Seviye',
    ranks: ['Mythical Immortal', 'Mythical Glory', 'Mythical Honor', 'Mythic'],
  },
  {
    label: 'Yüksek Seviye',
    ranks: ['Legend', 'Epic'],
  },
  {
    label: 'Orta Seviye',
    ranks: ['Grandmaster', 'Master'],
  },
  {
    label: 'Başlangıç Seviyesi',
    ranks: ['Elite', 'Warrior'],
  },
]

export const RANK_TIER_COLOR: Record<string, string> = {
  'Mythical Immortal': '#FF4D3D',
  'Mythical Glory': '#E8C15A',
  'Mythical Honor': '#C77DFF',
  Mythic: '#9D4EDD',
  Legend: '#35C7FF',
  Epic: '#3A86FF',
  Grandmaster: '#12B76A',
  Master: '#52B788',
  Elite: '#F4A261',
  Warrior: '#9CA3AF',
}

const RANK_ORDER = RANK_GROUPS.flatMap((g) => g.ranks)

export function rankOrderIndex(rank: string): number {
  const i = RANK_ORDER.indexOf(rank)
  return i === -1 ? 999 : i
}