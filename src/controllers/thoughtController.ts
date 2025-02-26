import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// get all Thoughts
export const getThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        return res.status(200).json(thoughts)
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// get a single Thought by id
export const getSingleThought = async (req: Request, res: Response) => {
    try {
        if (!checkId(req.params.thoughtId)) {
            return res.status(404).json({ message: 'Invalid thought ID.' });
        }

        const thought = await Thought.findById(req.params.thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID.' });
        }

        return res.json(thought);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// create a new Thought
export const createThought = async (req: Request, res: Response) => {
    try {
        const dbThoughtData = await Thought.create(req.body)

        // add thought to user's array
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: dbThoughtData._id }},
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID.' });
        }

        return res.status(200).json(dbThoughtData);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// update Thought by id
export const updateThought = async (req: Request, res: Response) => {
    try {
        if (!checkId(req.params.thoughtId)) {
            return res.status(404).json({ message: 'Invalid thought ID.' });
        }

        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            req.body,
            { new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID.' });
        }

        return res.status(200).json(thought);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// delete thought by id
export const deleteThought = async (req: Request, res: Response) => {
    try {
        if (!checkId(req.params.thoughtId)) {
            return res.status(404).json({ message: 'Invalid thought ID.' });
        }

        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID.' });
        }

        // remove id from user thoughts array
        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: 'No user with that thought ID.' });
        }

        console.log(`Deleted: ${thought}`);
        return res.status(200).json(thought);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// add Reaction to Thought (by id)
export const addReaction = async (req: Request, res: Response) => {
    try {
        if (!checkId(req.params.thoughtId)) {
            return res.status(404).json({ message: 'Invalid thought ID.' });
        }

        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID.' });
        }

        return res.status(200).json(thought);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// delete Reaction (by id) from Thought (by id).
export const deleteReaction = async (req: Request, res: Response) => {
    try {
        if (!checkId(req.params.thoughtId)) {
            return res.status(404).json({ message: 'Invalid thought ID.' });
        }

        if (!checkId(req.params.reactionId)) {
            return res.status(404).json({ message: 'Invalid reaction ID.' });
        }

        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID.' });
        }

        return res.status(200).json(thought);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

const checkId = (id: string): Boolean => {
    return mongoose.Types.ObjectId.isValid(id);
}