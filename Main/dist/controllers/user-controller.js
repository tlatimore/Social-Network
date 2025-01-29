import { User, Thought } from '../models/index.js';
// get all users
export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find()
            .select('-__v');
        return res.json(users);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// get single user by id
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends')
            .populate('thoughts');
        if (!user) {
            return res.status(404).json({ message: 'No user with this id!' });
        }
        return res.json(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// create a new user
export const createNewUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        return res.json(newUser);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// update a user
export const updateUser = async (req, res) => {
    try {
        const update = await User.findOneAndUpdate({ _id: req.params.userId }, {
            $set: req.body,
        }, {
            runValidators: true,
            new: true,
        });
        if (!update) {
            return res.status(404).json({ message: 'Invalid User ID!' });
        }
        return res.json(update);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// delete user 
export const deleteUser = async (req, res) => {
    try {
        const userInfo = await User.findOneAndDelete({ _id: req.params.userId });
        if (!userInfo) {
            return res.status(404).json({ message: 'Invalid User ID!' });
        }
        // get ids of user's `thoughts` and delete them all
        await Thought.deleteMany({ _id: { $in: userInfo.thoughts } });
        return res.json({ message: 'This user and all of their thoughts have been deleted!' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// add friend to friend list
export const addFriend = async (req, res) => {
    try {
        const friend = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });
        if (!friend) {
            return res.status(404).json({ message: 'Invalid User ID' });
        }
        return res.json(friend);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
// remove friend from friend list
export const removeFriend = async (req, res) => {
    try {
        const rmvfriend = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
        if (!rmvfriend) {
            return res.status(404).json({ message: 'Invalid User ID!' });
        }
        return res.json(rmvfriend);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
