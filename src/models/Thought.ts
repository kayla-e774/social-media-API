import { Schema, model } from 'mongoose';
import Reaction, { IReaction } from "./Reaction.js"
import formatDate from '../utils/formatDate.js';

interface IThought {
    thoughtText: string;
    createdAt: Date | string;
    username: string;
    reactions: IReaction[];
}

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get:  (val: any) => formatDate(val),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [Reaction],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions?.length;
});

const Thought = model("Thought", thoughtSchema);

export default Thought;