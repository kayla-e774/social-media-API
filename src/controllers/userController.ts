import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';


export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

export const getSingleUser = async (req: Request, res: Response) => {
    try {
        if (!checkId(req.params.userId)) {
            return res.status(404).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findOne({ _id: req.params.userId })
            .select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID.' });
        } else {
            return res.json(user);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.create(req.body);
        return res.json(dbUserData);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// update user by id
export const updateUser = async (req: Request, res: Response) => {
    try {
        if(!checkId(req.params.userId)) {
            return res.status(404).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID.' });
        } else {
            return res.json(user);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// delete user by id, and remove assoicated thoughts
export const deleteUser = async (req: Request, res: Response) => {
    try {
        if(!checkId(req.params.userId)) {
            return res.status(404).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID.' });
        }
        else {
            // delete each associated thought
            for (const thoughtId of user.thoughts) {
                const thought = await Thought.findByIdAndDelete(thoughtId);

                if (!thought) {
                    return res.status(404).json({ message: 'No thought with that ID.' });
                }
            }
        }
        return res.status(200).json({ message: "User and thoughts sucessfully deleted!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// add friend (by id) to user (by id)
export const addFriend = async (req: Request, res: Response) => {
    try {
        if(!checkId(req.params.friendId)) {
            return res.status(404).json({ message: 'Invalid friend ID.' });
        }

        const friend = await User.findById(req.params.friendId);

        if (!friend) {
            return res.status(404).json({ message: 'No friend with that ID.' });
        }

        if(!checkId(req.params.userId)) {
            return res.status(404).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: friend?._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID.' });
        }

        return res.status(200).json(user);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// delete friend (by id) from user (by id)
export const deleteFriend = async (req: Request, res: Response) => {
    try {
        if(!checkId(req.params.friendId)) {
            return res.status(404).json({ message: 'Invalid friend ID.' });
        }

        if(!checkId(req.params.userId)) {
            return res.status(404).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID.' });
        }

        return res.status(200).json(user);

    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

const checkId = (id: string): Boolean => {
    return mongoose.Types.ObjectId.isValid(id);
}