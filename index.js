import express from "express";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

import { userCreateValidator } from "./validator.js";
import { isUID } from "./helper.js";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

let data = []

// Get all user records
app.get("/api/users", (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get user by userId
app.get("/api/users/:userId", (req, res) => {
  try {
    const userId = req.params.userId;
    if (!isUID(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const user = data.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create user
app.post("/api/users", userCreateValidator, (req, res) => {
    try {
        const newUser = req.body;
        newUser.id = uuidv4();
        data.push(newUser);
        
        return res.status(201).json({
            success: true,
            data: newUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Update user by userId
app.put("/api/users/:userId", userCreateValidator, (req, res) => {
  try {
    const userId = req.params.userId;
    if (!isUID(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const updatedUser = req.body;
    const index = data.findIndex((user) => user.id === userId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    data[index] = { ...data[index], ...updatedUser };
    return res.status(200).json({
      success: true,
      data: data[index],
    });

  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message
    })
  }
});

// Delete user by userId
app.delete("/api/users/:userId", (req, res) => {
    try {
        const userId = req.params.userId;
        if (!isUID(userId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid userId",
          });
        }

        const userExist = data.find((user) => user.id === userId);
        if (!userExist) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        data = data.filter((item) => item.id !== userId);
        return res.status(204).json({
          success: true,
          message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.listen(port, () => {
    console.log(`server is running on ${port} port`)
})