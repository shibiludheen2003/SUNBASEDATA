// routes/authRoutes.js
import express, { Router } from 'express';
import  loginSchema from "../schemas/login.js"
import userDataSchema from "../schemas/users.js"
import crypto, { verify } from "crypto"
import jwt  from 'jsonwebtoken';
const router = express.Router();

const JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');
console.log('Generated JWT secret key:', JWT_SECRET_KEY);

// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization');
  
//     if (!token) {
       
//       return res.status(401).json({ success: false, message: 'Access denied. Token is missing.' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET_KEY);
//       req.user = decoded; 
//       next();
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         return res.status(401).json({ success: false, message: 'Token has expired.' });
//       }
//       res.status(401).json({ success: false, message: 'Invalid token.' });
//     }
//   }






router.post('/login', async (req, res) => {
    const { id, password } = req.body;

    try {
      
      const user = await loginSchema.findOne({ id });
    
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      }
  
      
      if (password !== user.password) {
        return res.status(401).json({ success: false, message: 'Authentication failed. Incorrect password.' });
      }
  
     
      const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' })
  
      res.json({ success: true, token });
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

router.post('/create-user',async (req, res) => {
    try {
      
      const response = await userDataSchema.insertMany(req.body);
  
    
      if (response && response.length > 0) {
        res.status(201).json({
          success: true,
          message: 'User(s) created successfully',
          data: response,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid request. No users created.',
        });
      }
    } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });


  router.get('/data-from-databse',async (req, res) => {
    try {
      
      const response = await userDataSchema.find()
      res.json(response)
  
    
     
    } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });
  
  router.delete('/delete-user/:id', async (req, res) => {
    try {
      
      const userId = req.params.id;
  
      
      const deletedUser = await userDataSchema.findByIdAndDelete(userId);
  
      if (deletedUser) {
        res.status(200).json({
          success: true,
          message: 'User deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });
  router.get('/get-user/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userDataSchema.findById(userId);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });
  router.put('/update-user/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await userDataSchema.findByIdAndUpdate(userId, req.body, { new: true });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user by ID:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });

 
 

export default router;
