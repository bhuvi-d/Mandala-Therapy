import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import SectionBackground from '../components/SectionBackground';
import ScrollReveal from '../components/ScrollReveal';

const API_BASE = "http://localhost:5000/api";

const CommunityPage = () => {
    const { theme } = useTheme();
    
    // State for Dynamic Data
    const [prompt, setPrompt] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    
    // Modal & Form States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [formData, setFormData] = useState({ author: '', imageUrl: '' });
    const [likedItems, setLikedItems] = useState(new Set());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [promptRes, subsRes] = await Promise.all([
                axios.get(`${API_BASE}/prompts/active`),
                axios.get(`${API_BASE}/submissions/approved`)
            ]);
            setPrompt(promptRes.data);
            setSubmissions(subsRes.data);
        } catch (err) {
            console.error("Connection failed. Using mock data for UI demo.", err);
            // High-End Mock Mandala Gallery
            setPrompt({
                id: 'mock1',
                title: "Harmonious Bloom",
                description: "Represent 'Inner Growth' through greens and pinks.",
                deadline: "April 30, 2026",
                reward: "Art by Bhuvi"
            });
            setSubmissions([
                { _id: '1', author: "User 1", imageUrl: "https://images.unsplash.com/photo-1623190875416-56a84f3cffcb?auto=format&fit=crop&q=80&w=600", likes: 124 },
                { _id: '2', author: "User 2", imageUrl: "https://images.unsplash.com/photo-1596773229656-11f62d1ea247?auto=format&fit=crop&q=80&w=600", likes: 88 },
                { _id: '3', author: "User 3", imageUrl: "https://images.unsplash.com/photo-1601235121406-056588289bf4?auto=format&fit=crop&q=80&w=600", likes: 212 },
                { _id: '4', author: "User 4", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600", likes: 45 },
                { _id: '5', author: "User 5", imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600", likes: 132 },
                { _id: '6', author: "User 6", imageUrl: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=600", likes: 97 }
            ]);
        }
    };

    // ❤️ Handle Like with Pulse Animation
    const handleLike = async (id) => {
        if (likedItems.has(id)) return; // One like per session for simplicity
        
        try {
            setLikedItems(prev => new Set(prev).add(id));
            const res = await axios.patch(`${API_BASE}/submissions/${id}/like`);
            setSubmissions(current => 
                current.map(sub => sub._id === id ? { ...sub, likes: res.data.likes } : sub)
            );
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/submissions`, {
                ...formData,
                promptId: prompt?._id || 'mock1'
            });
            setIsUploadOpen(false);
            alert("Submission success! (Review pending) ✨");
        } catch (err) {
            setIsUploadOpen(false);
        }
    };

    return (
        <div className={`min-h-screen ${theme.bgSolid} relative overflow-hidden flex flex-col font-body pb-32 transition-colors duration-700`}>
            {/* Background Decorative */}
            <div className={`${theme.svgColor} opacity-[0.03]`}>
                <SectionBackground pattern="ripple" position="center" size={1400} spin="slower" />
            </div>

            {/* Header Section */}
            <header className="relative pt-48 pb-24 px-4 text-center">
                <ScrollReveal>
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <div className={`w-32 h-px ${theme.bg} opacity-10 mb-8`} />
                        <h1 className={`section-title text-6xl md:text-9xl mb-8 tracking-tighter ${theme.text}`}>
                            Collective <span className="gradient-text">Journey</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-body font-light leading-relaxed max-w-3xl italic">
                             A shared sanctuary where we grow through mandalas. Join our contests and share your inner world with the community.
                        </p>
                    </div>
                </ScrollReveal>
            </header>

            <main className="max-w-7xl mx-auto px-4 w-full">
                
                {/* 🎨 Current Prompt Card - Extremely Pretty */}
                {prompt && (
                    <ScrollReveal>
                        <div className="relative group mb-32 flex flex-col items-center">
                            <div className="relative w-full glass-strong rounded-[4rem] p-12 md:p-24 border border-white/10 shadow-2xl overflow-hidden text-center backdrop-blur-3xl">
                                 {/* Rotating Mandala Background for Prompt */}
                                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] ${theme.svgColor} pointer-events-none scale-[1.5]`}>
                                     <SectionBackground pattern="mandala" size={800} spin="slower" />
                                 </div>

                                 <div className="relative z-10 max-w-2xl mx-auto">
                                     <span className={`text-xs font-bold uppercase tracking-[0.4em] ${theme.textLight} mb-8 opacity-60 block`}>⚡ Current Challenge</span>
                                     <h2 className={`font-display text-6xl md:text-8xl ${theme.text} mb-8 tracking-tighter`}>{prompt.title}</h2>
                                     <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-body leading-relaxed mb-12 italic">
                                         &ldquo;{prompt.description}&rdquo;
                                     </p>
                                     <div className="flex flex-wrap justify-center gap-12 mb-16 text-sm font-semibold tracking-widest uppercase text-gray-500">
                                          <div className="flex flex-col gap-1 items-center">
                                              <span className="text-[10px] opacity-60">Ends on</span>
                                              <span className={`${theme.text}`}>{prompt.deadline}</span>
                                          </div>
                                          <div className="w-px h-12 bg-white/10 hidden md:block" />
                                          <div className="flex flex-col gap-1 items-center">
                                              <span className="text-[10px] opacity-60">Reward</span>
                                              <span className={`${theme.text}`}>{prompt.reward} ✨</span>
                                          </div>
                                     </div>
                                     <button 
                                        onClick={() => setIsUploadOpen(true)}
                                        className={`btn-premium btn-glow-hover ${theme.btnPrimary} px-14 py-6 rounded-2xl text-xl font-bold font-display shadow-2xl transition-all hover:scale-105 active:scale-95`}
                                     >
                                        Share your Creation ✨
                                     </button>
                                 </div>
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* 🖼️ Community Gallery - Improved Card Aesthetic */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 pb-48">
                    {submissions.map((item, i) => {
                        const isLiked = likedItems.has(item._id);
                        return (
                            <ScrollReveal key={item._id} delay={i * 100}>
                                <div className="group relative">
                                    {/* Ambient Glow behind card */}
                                    <div className={`absolute -inset-2 rounded-[3.5rem] ${theme.particle} opacity-0 group-hover:opacity-[0.05] blur-2xl transition-opacity duration-700`} />
                                    
                                    <div className="relative glass-card rounded-[3rem] p-4 border border-white/10 shadow-xl transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
                                        {/* Artist Alias Badge */}
                                        <div className="absolute top-8 left-8 z-10 px-4 py-2 rounded-full glass-strong border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            By {item.author}
                                        </div>

                                        <div className="aspect-square rounded-[2.5rem] overflow-hidden relative bg-black/5 border border-white/5 shadow-inner">
                                            <img src={item.imageUrl} alt="Mandala" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            
                                            {/* Large Floating Like Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    onClick={() => handleLike(item._id)}
                                                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isLiked ? 'bg-pink-500 text-white scale-110' : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'} backdrop-blur-xl shadow-2xl`}
                                                >
                                                    <span className={`text-4xl transition-transform ${isLiked ? 'animate-bounce' : 'group-hover:animate-pulse'}`}>
                                                        {isLiked ? '💖' : '❤️'}
                                                    </span>
                                                    <span className="text-xs font-bold">{item.likes}</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="px-6 py-6 flex items-center justify-between">
                                             <div className="flex flex-col">
                                                 <span className={`text-sm font-display leading-none ${theme.text} mb-1`}>Artist {item.author.split(' ')[1]}</span>
                                                 <span className="text-[10px] text-gray-500 uppercase tracking-widest">Digital Creation</span>
                                             </div>
                                             <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                                 <span className="text-sm font-bold text-gray-400">{item.likes}</span>
                                                 <span className={`text-lg ${isLiked ? 'text-pink-500' : 'text-gray-400'}`}>♥</span>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>

            </main>

            {/* 📤 UPLOAD MODAL */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setIsUploadOpen(false)} />
                    <ScrollReveal>
                        <div className="relative glass-strong rounded-[3rem] p-12 md:p-16 max-w-2xl w-full border border-white/20 shadow-2xl animate-fade-in-down overflow-hidden">
                             <h3 className={`font-display text-4xl ${theme.text} mb-4 tracking-tight`}>Share your Mandala</h3>
                             <p className="text-gray-500 mb-10 text-sm italic font-body">Bhuvi will review your work before it blooms in the gallery.</p>
                             <form onSubmit={handleUploadSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1">Artist Name</label>
                                    <input required placeholder="Your alias..." value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 ${theme.text} focus:outline-none transition-all placeholder:text-gray-500`} />
                                </div>
                                <div className="space-y-2">
                                     <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1">Image Link</label>
                                     <input type="url" required placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 ${theme.text} focus:outline-none transition-all placeholder:text-gray-500`} />
                                </div>
                                <div className="flex gap-4">
                                     <button type="button" onClick={() => setIsUploadOpen(false)} className="flex-1 py-5 text-gray-500 font-bold">Cancel</button>
                                     <button type="submit" className={`flex-[2] ${theme.btnPrimary} py-5 rounded-2xl font-bold shadow-xl active:scale-95 transition-transform`}>Submit Review ✨</button>
                                </div>
                             </form>
                        </div>
                    </ScrollReveal>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;
