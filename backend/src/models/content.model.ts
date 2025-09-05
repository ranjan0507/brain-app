import mongoose from "mongoose";
import { Document , Schema } from "mongoose";

export interface IContent extends Document {
  title: string;
  url?: string;
  type: 'tweet' | 'youtube' | 'link' | 'image' | 'note' | 'spotify' | 'instagram';
  tags: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
}

const contentSchema = new Schema<IContent>({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  type: {
    type: String,
    required: true,
    enum: ['tweet', 'youtube', 'link', 'image', 'note', 'spotify', 'instagram']
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'tags'
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categories"
  },
  description: {
    type: String,
    default: ''
  }
});

export const Content = mongoose.model<IContent>('contents', contentSchema);
