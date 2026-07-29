export interface Account {
  id: string
  title: string
  price: number
  rank: string
  skins_count: number
  hero_count: number
  level: number
  server: string | null
  view_count: number
  description: string | null
  image_url: string | null
  seller_id: string
  status: 'active' | 'sold' | 'pending' | 'disabled'
  created_at: string
}

export interface SellerProfile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  completed_deals: number
  bio?: string | null
  phone?: string | null
  created_at?: string
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

export interface Offer {
  id: string
  account_id: string
  buyer_id: string
  amount: number
  message: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string
  account?: { id: string; title: string; price: number; image_url: string | null } | null
  buyer?: SellerProfile | null
}

export interface Deal {
  id: string
  account_id: string
  buyer_id: string
  seller_id: string
  amount: number
  status: 'pending_payment' | 'paid' | 'transferred' | 'completed' | 'cancelled'
  created_at: string
  account?: { id: string; title: string; price: number; image_url: string | null } | null
  buyer?: SellerProfile | null
}

export interface TopUp {
  id: string
  user_id: string
  amount: number
  status: string
  method: string
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