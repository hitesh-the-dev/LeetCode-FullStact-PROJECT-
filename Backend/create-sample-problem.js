const mongoose = require('mongoose');
const Problem = require('./src/models/problem');
const User = require('./src/models/user');
const boilerplateTemplates = require('./boilerplate-templates');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-database-name', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create a sample problem with boilerplate code
const createSampleProblem = async () => {
  try {
    await connectDB();
    
    // Find an admin user (you may need to adjust this based on your user structure)
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }
    
    // Get the Two Sum problem template
    const problemTemplate = boilerplateTemplates["Two Sum"];
    
    // Create the problem
    const problem = new Problem({
      ...problemTemplate,
      problemCreator: adminUser._id
    });
    
    await problem.save();
    console.log('Sample problem created successfully with ID:', problem._id);
    console.log('Problem includes boilerplate code for:', problem.startCode.map(sc => sc.language));
    
  } catch (error) {
    console.error('Error creating sample problem:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
createSampleProblem();
