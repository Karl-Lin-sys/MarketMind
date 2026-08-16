export type Complexity = 'fast' | 'general' | 'complex';
export type ImageSize = '1K' | '2K' | '4K';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface EmailCampaign {
  subject: string;
  body: string;
}
