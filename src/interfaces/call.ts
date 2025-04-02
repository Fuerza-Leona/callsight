export interface Call {
  audio_id: string;
  start_time: Date;
  end_time: Date;
  sentiment_score: number;
  confidence_score: number | null;
}
