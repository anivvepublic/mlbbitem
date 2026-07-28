export interface Account {
  id: string
  title: string
  price: number
  rank: string
  skins_count: number
  server: string | null
  view_count: number
  description: string | null
  image_url: string | null
  seller_id: string
  status: 'active' | 'sold' | 'pending'
  created_at: string
}

export interface SellerProfile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  completed_deals: number
}

export interface AccountRequest {
  id: string
  user_id: string
  title: string
  description: string | null
  wanted_rank: string | null
  min_skins: number
  budget_min: number
  budget_max: number
  contact_type: 'site' | 'whatsapp'
  contact_info: string | null
  status: 'open' | 'closed' | 'fulfilled'
  created_at: string
}

export interface ThemeContextType {
  isDark: boolean
  toggle: () => void
}

export type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'skins_desc'

export interface MarketplaceFilters {
  q: string
  ranks: string[]
  minPrice: number
  maxPrice: number
  minSkins: number
  sort: SortKey
}

export interface FilterChip {
  key: string
  label: string
  onRemove: () => void
}