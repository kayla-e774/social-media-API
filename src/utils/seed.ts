import { User, Thought } from '../models/index.js'

import mongoose from 'mongoose';
import { Types } from 'mongoose';

const users = [
    {
        _id: new Types.ObjectId(),
        username: 'john_doe',
        email: 'john@example.com',
        thoughts: [] as Types.ObjectId[],
        friends: [] as Types.ObjectId[]
    },
    {
        _id: new Types.ObjectId(),
        username: 'jane_smith',
        email: 'jane@example.com',
        thoughts: [] as Types.ObjectId[],
        friends: [] as Types.ObjectId[]
    },
    {
        _id: new Types.ObjectId(),
        username: 'alice_jones',
        email: 'alice@example.com',
        thoughts: [] as Types.ObjectId[],
        friends: [] as Types.ObjectId[]
    },
    {
        _id: new Types.ObjectId(),
        username: 'bob_brown',
        email: 'bob@example.com',
        thoughts: [] as Types.ObjectId[],
        friends: [] as Types.ObjectId[]
    }
];

const thoughts = [
    {
        _id: new Types.ObjectId(),
        thoughtText: 'This is my first thought!',
        username: users[0].username,
        createdAt: new Date(),
        reactions: [] as { reactionId: Types.ObjectId; reactionBody: string; username: string; createdAt: Date; }[]
    },
    {
        _id: new Types.ObjectId(),
        thoughtText: 'I love coding!',
        username: users[1].username,
        createdAt: new Date(),
        reactions: [] as { reactionId: Types.ObjectId; reactionBody: string; username: string; createdAt: Date; }[]
    },
    {
        _id: new Types.ObjectId(),
        thoughtText: 'Nature is beautiful!',
        username: users[2].username,
        createdAt: new Date(),
        reactions: [] as { reactionId: Types.ObjectId; reactionBody: string; username: string; createdAt: Date; }[]
    },
    {
        _id: new Types.ObjectId(),
        thoughtText: 'I enjoy learning new things.',
        username: users[3].username,
        createdAt: new Date(),
        reactions: [] as { reactionId: Types.ObjectId; reactionBody: string; username: string; createdAt: Date; }[]
    }
];

// Associate thoughts with users
users[0].thoughts.push(thoughts[0]._id);
users[1].thoughts.push(thoughts[1]._id);
users[2].thoughts.push(thoughts[2]._id);
users[3].thoughts.push(thoughts[3]._id);

// Add friends
users[0].friends.push(users[1]._id, users[2]._id);
users[1].friends.push(users[0]._id, users[3]._id);
users[2].friends.push(users[0]._id, users[3]._id);
users[3].friends.push(users[1]._id, users[2]._id);

const reactions = [
    {
        reactionId: new Types.ObjectId(),
        reactionBody: 'Nice thought!',
        username: users[1].username,
        createdAt: new Date()
    },
    {
        reactionId: new Types.ObjectId(),
        reactionBody: 'I agree!',
        username: users[0].username,
        createdAt: new Date()
    },
    {
        reactionId: new Types.ObjectId(),
        reactionBody: 'So true!',
        username: users[3].username,
        createdAt: new Date()
    },
    {
        reactionId: new Types.ObjectId(),
        reactionBody: 'Absolutely!',
        username: users[2].username,
        createdAt: new Date()
    }
];

thoughts[0].reactions.push(reactions[0]);
thoughts[1].reactions.push(reactions[1]);
thoughts[2].reactions.push(reactions[2]);
thoughts[3].reactions.push(reactions[3]);

const seedDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/socialMedia');

        await User.deleteMany({});
        await Thought.deleteMany({});

        await User.insertMany(users);
        await Thought.insertMany(thoughts);

        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();