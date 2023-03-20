const router = require("express").Router();
let User = require("../models/User");
const bcrypt = require("bcrypt");

// Get all users --------------------------------
router.route("/").get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: " + err));
});

// Get one user ----------------------------------
router.route("/").post(async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email }).select("-password -seq1 -seq2 -seq3").lean();

    return res.status(200).json({ user: user });
});

// POST to Register User
router.route("/add").post(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const seq1 = req.body.seq1;
    const seq2 = req.body.seq2;
    const seq3 = req.body.seq3;
    const securityA = req.body.securityA;

    // check if fields are populated
    if (!name || !email || !password || !seq1 || !seq2 || !seq3) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // regex to check if only characters
    if (!(/^[a-zA-Z ,.'-]+$/.test(name))) {
        return res.status(409).json({ message: "Name must consist of only letters"});
    }

    // check for duplicate emails
    const duplicate = await User.findOne({ email }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate email found"});
    }

    // check for valid emails
    if (!(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email))) {
        return res.status(409).json({ message: "Please enter a valid email"});
    }

    // hash password, 10 salt rounds
    const hashedPassword  = await bcrypt.hash(password, 10)

    const newUser = new User({
        "name": name,
        "email": email,
        "password": hashedPassword,
        "seq1": seq1,
        "seq2": seq2,
        "seq3": seq3,
    });

    newUser.save()
        .then(() => res.status(201).json("User added!"))
        .catch(err => res.status(400).json("Error: " + err));
});

// LOGIN USER ------------------------------------
router.route("/login").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email }).lean();
    if (user) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            res.status(200).json({ message: "User logged in successfully", user: user.email });
        }
        else {
            // res.status(401).send({message: "Wrong password"});
            res.status(401).json({ message: "Wrong password" });
        }
    }
    else {
        // Email doesn't exist
        // res.send("Email does not exist");
        res.status(401).json({ message: "Email does not exist" });
    }
});

// Reset password -----------------------------------
router.route("/reset").post(async (req, res) => {
    const email = req.body.email;
    const seq1 = req.body.seq1;
    const seq2 = req.body.seq2;
    const seq3 = req.body.seq3; 
    const newPassword = req.body.password;
    const user = await User.findOne({ email }).lean();
    if (user) {
        //compare the security Q
        //const match = await bcrypt.compare(password, user.password)
        if ((seq1 === user.seq1) && (seq2 === user.seq2) && (seq3 === user.seq3)) {
            //update the password
            const hashedPassword  = await bcrypt.hash(newPassword, 10)
            //not sure if this is correct
            await User.findOneAndUpdate({ email }, { password: hashedPassword }).lean();
            //send response
            res.status(200).json({ message: "Password Successfully Reset", user: user.email });
        }
        else {
            //security answer is incorrect
            res.status(401).json({ message: "Wrong Security Question Answer" });
        }
    }
    else {
        // Email doesn't exist
        res.status(401).json({ message: "Email does not exist" });
    }
});

// need frontend delete button only if user is signed in

// Delete user -----------------------------------
router.route("/delete").post(async (req, res) => {
    const email = req.body.email;
    //const password = req.body.password;
    //const seq = req.body.seq;
    // console.log(req.body);
    // console.log(email);
    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(400).json({ message: "User not found"});
    }
    //const match = await bcrypt.compare(password, user.password);
    //if (match && user.seq1 === seq) {
        const result = await user.deleteOne();
        res.status(200).json({ message: `User with email ${result.email} was deleted successfully` })
    //}
    //else {
    //    res.status(401).json({ message: "Credentials do not match"});
    //}
})

// Reset email --------------------------------------------
router.route("/email").post(async (req, res) => {
    const oldEmail = req.body.oldEmail;
    const newEmail = req.body.newEmail;
    const duplicate = await User.findOne({ email: newEmail }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate email found"});
    }
    const user = await User.findOne({ email: oldEmail }).lean();

    if (user) {
        await User.findOneAndUpdate({ email: oldEmail }, { email: newEmail }).lean();
        //send response
        res.status(200).json({ message: "Email Successfully changed", user: user.email });
    }
    else {
        // Email doesn't exist
        res.status(401).json({ message: "Email does not exist" });
    }
});

// Get user objects from friends list ---------------
router.route("/getFriends").post(async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email }).select("-password -seq1 -seq2 -seq3").lean();

    if (user) {
        let friendList = [];
        for (let i = 0; i < user.friends.length; i++) {
            let id = user.friends[i];
            // have to have _id, or else it will search friends list too
            let friend = await User.findOne({ _id: id }).select("-password -seq1 -seq2 -seq3").lean();
            if (friend) {
                friendList.push({
                    name: friend.name,
                    email: friend.email,
                    status: friend.status,
                    publicity: friend.publicity
                });
            }
        }
        res.status(200).json(friendList);
    }
    else {
        res.status(401).json({ message: "Email does not exist" });
    }
});


module.exports = router;
