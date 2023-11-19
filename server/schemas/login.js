// Import necessary modules
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Create a schema for the User
const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model
export default User;
