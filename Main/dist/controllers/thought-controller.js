import { Thought, User } from '../models/index.js';
// get all thoughts
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find()
            .sort({ createdAt: -1 });
        return res.json(thoughts);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// get single thought by id
export const getSingleThought = async (req, res) => {
    try {
        const singleThought = await Thought.findOne({ _id: req.params.thoughtId });
        if (!singleThought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        return res.json(singleThought);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// create a thought
export const createThought = async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        const userThought = await User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: thought._id } }, { new: true });
        if (!userThought) {
            return res.status(404).json({ message: 'Thought created with an invalid ID!' });
        }
        return res.json({ message: 'Thought creation successful!' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// update thought
export const updateThought = async (req, res) => {
    try {
        const update = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
        if (!update) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        return res.json(update);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// delete thought
export const deleteThought = async (req, res) => {
    try {
        const dbThoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!dbThoughtData) {
            return res.status(404).json({ message: 'Invalid ID!' });
        }
        // remove thought id from user's `thoughts` field
        const dbUserData = User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });
        if (!dbUserData) {
            return res.status(404).json({ message: 'Thought created but no user with this id!' });
        }
        return res.json({ message: 'Thought deletion successful!' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// add a reaction to a thought
export const addReaction = async (req, res) => {
    try {
        const reaction = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true });
        if (!reaction) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        return res.json(reaction);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// remove reaction from a thought
export const removeReaction = async (req, res) => {
    try {
        const dbThoughtData = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true });
        if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        return res.json(dbThoughtData);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
