const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'bhuvi_magic_2026';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ════════════════════════════════════════════════════════════════════════
// MONGODB CONNECTION
// ════════════════════════════════════════════════════════════════════════
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mandala-therapy';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🌿 Connected to Mandala Database'))
  .catch((err) => console.error('❌ Connection error:', err));

// ════════════════════════════════════════════════════════════════════════
// MODELS
// ════════════════════════════════════════════════════════════════════════

// 🏆 1. Contest Prompt
const PromptSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: String,
  reward: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const Prompt = mongoose.model('Prompt', PromptSchema);

// 🤝 2. Community Submission
const SubmissionSchema = new mongoose.Schema({
  author: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  promptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' },
  createdAt: { type: Date, default: Date.now }
});
const Submission = mongoose.model('Submission', SubmissionSchema);

// 🖼️ 3. Sanctuary Gallery (Bhuvi's Personal Work)
const GallerySchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
});
const GalleryImage = mongoose.model('GalleryImage', GallerySchema);

// ════════════════════════════════════════════════════════════════════════
// ROUTES - PROMPTS
// ════════════════════════════════════════════════════════════════════════

app.get('/api/prompts/active', async (req, res) => {
  try {
    const prompt = await Prompt.findOne({ active: true }).sort({ createdAt: -1 });
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/prompts', async (req, res) => {
  try {
    const { title, description, deadline, reward, secret } = req.body;
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
    await Prompt.updateMany({}, { active: false });
    const newPrompt = new Prompt({ title, description, deadline, reward, active: true });
    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════
// ROUTES - SUBMISSIONS
// ════════════════════════════════════════════════════════════════════════

app.get('/api/submissions/approved', async (req, res) => {
  try {
    const submissions = await Submission.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/submissions/pending', async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized Access' });
    const pending = await Submission.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/submissions', async (req, res) => {
  try {
    const { author, imageUrl, promptId } = req.body;
    const newSubmission = new Submission({
      author: author || 'Anonymous User',
      imageUrl,
      promptId,
      isApproved: false
    });
    await newSubmission.save();
    res.status(201).json({ message: 'Submission received! Pending review by Bhuvi.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/submissions/:id/like', async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/submissions/:id/approve', async (req, res) => {
  try {
    const { secret } = req.body;
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
    const submission = await Submission.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════
// ROUTES - SANCTUARY GALLERY (MAIN PAGE)
// ════════════════════════════════════════════════════════════════════════

app.get('/api/gallery', async (req, res) => {
    try {
        const images = await GalleryImage.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/gallery', async (req, res) => {
    try {
        const { title, description, imageUrl, secret } = req.body;
        if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
        
        const newImage = new GalleryImage({ title, description, imageUrl });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        const { secret } = req.query;
        if (secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
        
        await GalleryImage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Gallery image removed.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ════════════════════════════════════════════════════════════════════════
// HELPERS & SEEDING
// ════════════════════════════════════════════════════════════════════════

const seedDatabase = async () => {
    const promptCount = await Prompt.countDocuments();
    let currentPrompt;
    
    if (promptCount === 0) {
        currentPrompt = await Prompt.create({
            title: "Harmonious Bloom",
            description: "Represent 'Inner Growth' through greens and pinks.",
            deadline: "April 30, 2026",
            reward: "Art by Bhuvi"
        });
        console.log('🌱 Seeded fresh contest prompt.');
    } else {
        currentPrompt = await Prompt.findOne({ active: true });
    }

    const galleryCount = await GalleryImage.countDocuments();
    if (galleryCount === 0) {
        await GalleryImage.create([
            {
                title: "Celestial Beginning",
                description: "The spark of an infinite journey across the cosmic void.",
                imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213748/img1_hzmflj.jpg"
            },
            {
                title: "Golden Asymmetry",
                description: "Finding balance in the unexpected patterns of light.",
                imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213780/img2_vgg8ly.jpg"
            },
            {
                title: "Deep Void",
                description: "Quiet power within the silence of the dark bloom.",
                imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213792/img3_okxf3p.jpg"
            },
            {
                title: "Solar Flare",
                description: "Radiating energy and warmth from the inner sun.",
                imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213748/img1_hzmflj.jpg"
            },
            {
                title: "Ocean Tide",
                description: "The rhythmic flow of creation and dissolution.",
                imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213780/img2_vgg8ly.jpg"
            },
            {
                title: "Forest Echo",
                description: "Nature's geometric whispers through the trees.",
                imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213792/img3_okxf3p.jpg"
            }
        ]);
        console.log('🖼️ Seeded signature gallery images.');
    }

    const subCount = await Submission.countDocuments();
    if (subCount === 0 && currentPrompt) {
        await Submission.create([
            { author: "Ethereal Dreamer", imageUrl: "https://images.unsplash.com/photo-1623190875416-56a84f3cffcb?auto=format&fit=crop&q=80&w=600", promptId: currentPrompt._id, isApproved: false },
            { author: "Zen Artist", imageUrl: "https://images.unsplash.com/photo-1596773229656-11f62d1ea247?auto=format&fit=crop&q=80&w=600", promptId: currentPrompt._id, isApproved: false }
        ]);
        console.log('🤝 Seeded pending submissions.');
    }
};
seedDatabase();

app.listen(PORT, () => {
  console.log(`✨ Server vibrating on port ${PORT}`);
});
