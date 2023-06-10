import { compare } from "bcrypt";
import asyncHandler from "express-async-handler";
import { generatePassword } from "../utils/hashPass.js";
import { createToken } from "../utils/createToken.js";
import { renameSync } from "fs";
import User from "../models/UserModel.js";

export const signUp = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password) throw new Error("Please enter your password");
    if (!email) throw new Error("Please enter your email address");
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      res.status(400);
      throw new Error("Sorry, email already exists, please try again");
    }

    const user = new User({
      email,
      password: await generatePassword(password),
    });

    const savedUser = await user.save();

    if (savedUser) {
      const jwtToken = await createToken(savedUser.email, savedUser._id);
      res.json({
        user: { id: savedUser._id, email: savedUser.email },
        jwt: jwtToken,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Inter Server Error: " + error);
  }
});

export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password) throw new Error("Please enter a password");
    if (!email) throw new Error("Please enter your email");

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error("Sorry, wrong email or password, please try again");
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) throw new Error("Invalid password");

    const jwtToken = await createToken(user.email, user._id);
    return res.json({
      user: { id: user.id, email: user.email },
      jwt: jwtToken,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

export const getUserInfo = asyncHandler(async (req, res, next) => {
  try {
    const findUser = await User.findById(req.user._id)
      .populate("gigs orders reviews wishList")
      .populate({ path: "orders", populate: { path: "gig" } })
      .lean();

    return res.json({
      user: {
        id: findUser?._id,
        email: findUser?.email,
        image: findUser?.profileImage,
        username: findUser?.username,
        role: findUser?.role,
        fullName: findUser?.fullname,
        description: findUser?.description,
        isProfileInfoSet: findUser?.isProfileInfoSet,
        orders: findUser?.orders
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Internal server Error.");
  }
});

export const setUserInfo = asyncHandler(async (req, res, next) => {
  try {
    const { userName, fullName, description } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userName) {
      const userNameExists = await User.findOne({ username: userName });
      if (userNameExists && userNameExists._id.toHexString() !== req.user._id.toHexString()) {
        return res.status(200).json({ userNameError: true });
      }
      user.username = userName;
    }

    if (fullName) {
      user.fullname = fullName;
    }

    if (description) {
      user.description = description;
    }

    user.isProfileInfoSet =
      !userName && !fullName && !description ? false : true;

    await user.save();

    return res.json("Profile data updated successfully");
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
});

export const userRoleEdit = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    if (user.isProfileInfoSet === false) {
      res.status(400);
      throw new Error("User profile information is not set");
    }

    if (user.role === "BUYER") {
      user.role = "SELLER";
      await user.save();
      return res.status(200).json({ role: true });
    } else if (user.role === "SELLER") {
      user.role = "BUYER";
      await user.save();
      return res.status(200).json({ role: false });
    }

    res.status(400);
    throw new Error("User role could not be updated");
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
});

export const setUserImage = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Image not included");
    }
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    await User.findByIdAndUpdate(req.user._id, {
      profileImage: fileName,
    });

    return res.json({ img: fileName });
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
});
