export type ActivityType =
  | 'via_ferrata'
  | 'via_multipitch'
  | 'canale_invernale'
  | 'cresta'
  | 'escursionismo'
  | 'alpinismo'
  | 'sci_alpinismo'
  | 'arrampicata'
  | 'altro';

export type GuideType = 'alpina' | 'ambientale' | 'amm' | null;

export interface Activity {
  id: string;
  title: string;
  notes: string;
  link: string;
  type: ActivityType;
  guideType: GuideType;
  done: boolean;
  doneAt: string | null;
  doneNotes: string | null;
  guideName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityDto {
  title: string;
  notes?: string;
  link?: string;
  type: ActivityType;
  guideType?: GuideType;
}

export interface UpdateActivityDto {
  title?: string;
  notes?: string;
  link?: string;
  type?: ActivityType;
  guideType?: GuideType;
}

export interface MarkDoneDto {
  doneNotes?: string;
  guideName?: string;
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  via_ferrata: 'Via Ferrata',
  via_multipitch: 'Via Multipitch',
  canale_invernale: 'Canale Invernale',
  cresta: 'Cresta',
  escursionismo: 'Escursionismo',
  alpinismo: 'Alpinismo',
  sci_alpinismo: 'Sci Alpinismo',
  arrampicata: 'Arrampicata',
  altro: 'Altro',
};

export const GUIDE_TYPE_LABELS: Record<NonNullable<GuideType>, string> = {
  alpina: 'Guida Alpina',
  ambientale: 'Guida Ambientale',
  amm: 'Guida AMM',
};
