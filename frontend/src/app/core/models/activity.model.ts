export type ActivityType =
  | 'via_ferrata'
  | 'via_multipitch'
  | 'canale_invernale'
  | 'cresta'
  | 'escursionismo'
  | 'alpinismo'
  | 'sci_alpinismo'
  | 'arrampicata'
  | 'canale_estivo'
  | 'altro';

export type GuideType = 'alpina' | 'ambientale' | 'amm' | null;

export interface ActivityLink {
  name: string;
  url: string;
}

export interface Activity {
  id: string;
  title: string;
  notes: string;
  links: ActivityLink[];
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
  links?: ActivityLink[];
  type: ActivityType;
  guideType?: GuideType;
}

export interface UpdateActivityDto {
  title?: string;
  notes?: string;
  links?: ActivityLink[];
  type?: ActivityType;
  guideType?: GuideType;
}

export interface MarkDoneDto {
  doneNotes?: string;
  guideName?: string;
}

