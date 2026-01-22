const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  shortTitle: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false, // image may not be required for all articles
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String, // Storing as string for now, could be Date type if needed
    required: true,
  },
  content: {
    type: String, // For full article content, potentially rich text HTML
    required: false,
  },
}, { timestamps: true });

articleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
