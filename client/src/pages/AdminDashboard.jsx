import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import SectionBackground from '../components/SectionBackground';
import ScrollReveal from '../components/ScrollReveal';

const API_BASE = "http://localhost:5000/api";
const ADMIN_KEY = "bhuvi_magic_2026"; // In a real app this would be a secure login session

const AdminDashboard = () => {
    const { theme } = useTheme();
    const [secret, setSecret] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // Active View: 'contest' | 'review' | 'gallery'
    const [activeTab, setActiveTab] = useState('review');

    // Data States
    const [pending, setPending] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [promptData, setPromptData] = useState({ title: '', description: '', deadline: '', reward: '' });
    const [newGalleryImg, setNewGalleryImg] = useState({ title: '', description: '', imageUrl: '' });

    const [serverLive, setServerLive] = useState(false);

    useEffect(() => {
        if (isAuthorized) {
            fetchAllData();
            checkServer();
        }
    }, [isAuthorized]);

    const checkServer = async () => {
        try {
            await axios.get(`${API_BASE}/prompts/active`);
            setServerLive(true);
        } catch (err) {
            setServerLive(false);
        }
    };

    const fetchAllData = async () => {
        try {
            const [pRes, gRes] = await Promise.all([
                axios.get(`${API_BASE}/submissions/pending?secret=${ADMIN_KEY}`),
                axios.get(`${API_BASE}/gallery`)
            ]);
            setPending(pRes.data);
            setGalleryImages(gRes.data);
            setServerLive(true);
        } catch (err) {
            setServerLive(false);
            console.error("Fetch failed", err);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (secret === ADMIN_KEY) {
            setIsAuthorized(true);
        } else {
            alert("Invalid Secret Key 🌀");
        }
    };

    // 🏆 Contest Actions
    const handleNewPrompt = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/prompts`, { ...promptData, secret: ADMIN_KEY });
            alert("New Contest Published! 🏁");
            setPromptData({ title: '', description: '', deadline: '', reward: '' });
        } catch (err) { 
            alert("Failed to publish: " + (err.response?.data?.error || err.message)); 
        }
    };

    // 🤝 Review Actions
    const handleApprove = async (id) => {
        try {
            await axios.patch(`${API_BASE}/submissions/${id}/approve`, { secret: ADMIN_KEY });
            setPending(prev => prev.filter(p => p._id !== id));
            alert("Approved! ✨");
        } catch (err) { alert("Error approving"); }
    };

    const handleDeleteSubmission = async (id) => {
        if (!window.confirm("Reject this submission?")) return;
        try {
            await axios.delete(`${API_BASE}/submissions/${id}?secret=${ADMIN_KEY}`);
            setPending(prev => prev.filter(p => p._id !== id));
        } catch (err) { alert("Error deleting"); }
    };

    // 🖼️ Gallery Actions
    const handleAddGallery = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/gallery`, { ...newGalleryImg, secret: ADMIN_KEY });
            alert("Gallery Image Added! 🎨");
            setNewGalleryImg({ title: '', description: '', imageUrl: '' });
            fetchAllData();
        } catch (err) { alert("Error adding image"); }
    };

    const handleDeleteGallery = async (id) => {
        if (!window.confirm("Remove this from your main gallery?")) return;
        try {
            await axios.delete(`${API_BASE}/gallery/${id}?secret=${ADMIN_KEY}`);
            setGalleryImages(prev => prev.filter(g => g._id !== id));
        } catch (err) { alert("Error removing"); }
    };

    if (!isAuthorized) {
        return (
            <div className={`min-h-screen ${theme.bgSolid} flex items-center justify-center p-4 font-body`}>
                <div className="glass-strong rounded-[3rem] p-12 md:p-20 max-w-xl w-full border border-white/10 shadow-2xl text-center">
                    <h1 className={`font-display text-4xl ${theme.text} mb-4`}>Artist Portal</h1>
                    <p className="text-gray-500 mb-10 text-sm tracking-widest uppercase">Secret access only</p>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="password" placeholder="Enter Secret Key" value={secret} onChange={(e) => setSecret(e.target.value)} className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center ${theme.text} focus:outline-none focus:bg-white/10 transition-all`} />
                        <button type="submit" className={`w-full ${theme.btnPrimary} py-5 rounded-2xl font-bold`}>Open Sanctuary 🛡️</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.bgSolid} relative overflow-hidden font-body pb-48 transition-colors duration-700`}>
             <div className={`${theme.svgColor} opacity-[0.02]`}>
                <SectionBackground pattern="ripple" position="center" size={1400} />
            </div>

            <header className="relative pt-32 pb-16 px-4 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div>
                        <h1 className={`section-title text-6xl md:text-8xl tracking-tighter ${theme.text}`}>Artist <span className="gradient-text">Dashboard</span></h1>
                        <div className="flex items-center gap-2 mt-4">
                             <div className={`w-2 h-2 rounded-full ${serverLive ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                             <p className={`text-xs tracking-[0.4em] uppercase ${theme.textLight} opacity-60`}>
                                 {serverLive ? 'Sanctuary Pulse Online' : 'Sanctuary Pulse Offline'}
                             </p>
                        </div>
                    </div>
                    <button onClick={() => setIsAuthorized(false)} className="text-xs text-red-400 font-bold uppercase tracking-widest hover:opacity-70 px-4 py-2 border border-red-400/20 rounded-full">Lock Portal</button>
                </div>

                {/* TAB SWITCHER */}
                <div className="flex flex-wrap gap-4 mb-20">
                    {[
                        { id: 'review', label: 'Review Community Submissions', count: pending.length },
                        { id: 'gallery', label: 'Manage Main Gallery', count: galleryImages.length },
                        { id: 'contest', label: 'Launch New Contest', count: 0 }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 rounded-2xl font-bold font-display transition-all flex items-center gap-3 ${activeTab === tab.id ? `${theme.btnPrimary} shadow-2xl` : 'glass-card text-gray-500 hover:text-white'}`}
                        >
                            {tab.label}
                            {tab.count > 0 && <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full">{tab.count}</span>}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4">
                
                {/* 🛡️ TAB 1: REVIEW COMMUNITY */}
                {activeTab === 'review' && (
                    <div className="animate-fade-in">
                         {pending.length === 0 ? (
                             <div className="py-32 text-center glass-card rounded-[3rem] border border-dashed border-white/10">
                                <p className="text-gray-500 italic">No new community mandalas to review. 🌸</p>
                             </div>
                         ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                 {pending.map((sub) => (
                                     <div key={sub._id} className="glass-strong rounded-[2.5rem] p-6 border border-white/10 shadow-xl">
                                         <img src={sub.imageUrl} alt="Review" className="aspect-square w-full rounded-2xl object-cover mb-6 shadow-inner border border-white/5" />
                                         <p className="text-xs font-bold text-gray-400 mb-6 truncate">By {sub.author}</p>
                                         <div className="flex gap-2">
                                             <button onClick={() => handleApprove(sub._id)} className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-lg">Approve</button>
                                             <button onClick={() => handleDeleteSubmission(sub._id)} className="px-4 py-3 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold">Reject</button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         )}
                    </div>
                )}

                {/* 🖼️ TAB 2: MANAGE MAIN GALLERY */}
                {activeTab === 'gallery' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-fade-in">
                         <div className="lg:col-span-4">
                             <div className="glass-strong rounded-[2.5rem] p-10 border border-white/10 sticky top-32">
                                 <h3 className={`font-display text-2xl ${theme.text} mb-8`}>Add to Sanctuary 🖼️</h3>
                                 <form onSubmit={handleAddGallery} className="space-y-6">
                                     <input value={newGalleryImg.title} onChange={e => setNewGalleryImg({...newGalleryImg, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none" placeholder="Title of Mandala..." />
                                     <textarea value={newGalleryImg.description} onChange={e => setNewGalleryImg({...newGalleryImg, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none h-24" placeholder="Brief story or mood..." />
                                     <input value={newGalleryImg.imageUrl} onChange={e => setNewGalleryImg({...newGalleryImg, imageUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none" placeholder="Direct Image URL..." />
                                     <button type="submit" className={`w-full ${theme.btnPrimary} py-4 rounded-xl font-bold shadow-lg mt-4`}>Pin to Sanctuary</button>
                                 </form>
                             </div>
                         </div>
                         <div className="lg:col-span-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {galleryImages.map((img) => (
                                     <div key={img._id} className="glass-card rounded-[2.5rem] p-6 border border-white/10 group">
                                         <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                                             <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                                             <button onClick={() => handleDeleteGallery(img._id)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">✕</button>
                                         </div>
                                         <h4 className={`font-display text-xl ${theme.text} mb-2`}>{img.title}</h4>
                                         <p className="text-xs text-gray-500 italic leading-relaxed">{img.description}</p>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                )}

                {/* 🏁 TAB 3: NEW CONTEST */}
                {activeTab === 'contest' && (
                    <ScrollReveal>
                        <div className="glass-strong rounded-[3rem] p-12 md:p-20 max-w-3xl mx-auto border border-white/10 shadow-2xl animate-fade-in">
                             <h3 className={`font-display text-4xl ${theme.text} mb-12 text-center`}>Publish New Challenge 🏁</h3>
                             <form onSubmit={handleNewPrompt} className="space-y-8">
                                 <div className="space-y-4">
                                     <label className="text-[10px] uppercase tracking-widest text-gray-500">Challenge Title</label>
                                     <input value={promptData.title} onChange={e => setPromptData({...promptData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:outline-none" placeholder="e.g. Whispering Petals" />
                                 </div>
                                 <div className="space-y-4">
                                     <label className="text-[10px] uppercase tracking-widest text-gray-500">Creative Prompt</label>
                                     <textarea value={promptData.description} onChange={e => setPromptData({...promptData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg h-32 focus:outline-none" placeholder="Describe the mood or technique you want users to explore..." />
                                 </div>
                                 <div className="grid grid-cols-2 gap-8">
                                     <div className="space-y-4">
                                         <label className="text-[10px] uppercase tracking-widest text-gray-500">Submission Deadline</label>
                                         <input value={promptData.deadline} onChange={e => setPromptData({...promptData, deadline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none" placeholder="May 15, 2026" />
                                     </div>
                                     <div className="space-y-4">
                                         <label className="text-[10px] uppercase tracking-widest text-gray-500">Prize / Reward</label>
                                         <input value={promptData.reward} onChange={e => setPromptData({...promptData, reward: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none" placeholder="Artist Consultation" />
                                     </div>
                                 </div>
                                 <button type="submit" className={`w-full ${theme.btnPrimary} py-6 rounded-2xl text-xl font-bold shadow-2xl mt-8 transition-transform active:scale-95`}>Go Live with Contest ✨</button>
                             </form>
                        </div>
                    </ScrollReveal>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
