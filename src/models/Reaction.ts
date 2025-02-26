import { Schema, Document, ObjectId, Types } from 'mongoose';
import formatDate from '../utils/formatDate.js';

export interface IReaction extends Document {
    reactionId: ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date | string;
}

const reactionSchema = new Schema<IReaction>(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // format date
            get: (v:any) => formatDate(v)
        },
    }, 
    {
        toJSON: {
            getters: true,
        },
        id: false
    }
);

export default reactionSchema