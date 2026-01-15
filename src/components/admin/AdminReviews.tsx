import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Plus, Trash2, Edit2, X, MessageSquare, Loader2, Star } from 'lucide-react';
import { reviewsApi, type Review } from '../../services/api';
import { useToast } from '../ui/Toast';
import ConfirmModal from '../ui/ConfirmModal';

const AdminReviews = () => {
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await reviewsApi.getAll();
            setReviews(response.data || []);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (review: Review) => {
        setIsEditing(review.id);
        setIsAdding(false);
        setValue('name', review.name);
        setValue('role', review.role);
        setValue('text', review.text);
        setValue('rating', review.rating);
    };

    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            const reviewData = {
                name: data.name,
                role: data.role,
                text: data.text,
                rating: parseInt(data.rating),
            };

            if (isEditing) {
                await reviewsApi.update(isEditing, reviewData);
            } else {
                await reviewsApi.create(reviewData);
            }

            await fetchReviews();
            setIsEditing(null);
            setIsAdding(false);
            reset();
            showToast(isEditing ? 'Review updated successfully!' : 'Review created successfully!');
        } catch (error) {
            console.error('Failed to save review:', error);
            showToast('Failed to save review', 'error');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await reviewsApi.delete(deleteId);
            await fetchReviews();
            showToast('Review deleted successfully!');
        } catch (error: any) {
            console.error('Failed to delete review:', error);
            showToast(error.message || 'Failed to delete review', 'error');
        }
        setDeleteId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-retro-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-display text-white uppercase tracking-wider">Arcade Reviews</h2>
                    <p className="text-gray-500 font-mono text-xs mt-1">Found {reviews.length} testimonials</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setIsEditing(null); reset(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-retro-orange text-white font-display text-xs uppercase rounded-lg hover:brightness-110 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Review
                </button>
            </div>

            {/* Editor */}
            {(isAdding || isEditing) && (
                <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
                        <h3 className="text-retro-yellow font-display uppercase tracking-wide">
                            {isEditing ? 'Edit Review' : 'New Review'}
                        </h3>
                        <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-gray-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-gray-500">Player Name</label>
                                <input {...register('name', { required: true })} className="w-full bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white focus:border-retro-blue focus:outline-none font-display uppercase text-sm" placeholder="PLAYER ONE" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-gray-500">Role / Company</label>
                                <input {...register('role', { required: true })} className="w-full bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white focus:border-retro-blue focus:outline-none font-display text-sm" placeholder="CEO @ ARCADE" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-gray-500">Rating (1-5)</label>
                                <select {...register('rating', { required: true })} className="w-full bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white focus:border-retro-blue focus:outline-none font-mono text-sm">
                                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                                    <option value="2">⭐⭐ (2 Stars)</option>
                                    <option value="1">⭐ (1 Star)</option>
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-[10px] font-mono uppercase text-gray-500">Review Text</label>
                                <textarea {...register('text', { required: true })} rows={4} className="w-full bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white focus:border-retro-blue focus:outline-none font-mono text-sm" placeholder="Gaurav is an amazing developer..." />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-5 py-2 text-gray-400 font-mono text-xs uppercase hover:text-white">Cancel</button>
                            <button type="submit" disabled={saving} className="px-6 py-2 bg-retro-blue text-white font-display text-xs uppercase rounded-md shadow-[0_4px_0_0_#1e3a8a] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Review
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="group bg-[#0a0a0a] border border-[#222] rounded-xl p-6 hover:border-retro-dark transition-colors relative flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#333]">
                                <MessageSquare className="w-6 h-6 text-retro-teal" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(review)} className="p-1.5 text-gray-400 hover:text-retro-yellow hover:bg-[#222] rounded-lg transition-colors">
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => setDeleteId(review.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#222] rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-1 mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-retro-yellow text-retro-yellow" />
                            ))}
                        </div>

                        <p className="text-gray-400 text-sm italic mb-4 flex-grow">"{review.text}"</p>

                        <div className="border-t border-[#222] pt-4 mt-auto">
                            <h3 className="font-display text-sm text-white uppercase tracking-wide">
                                {review.name}
                            </h3>
                            <p className="text-[10px] font-mono text-gray-500">{review.role}</p>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
            />
        </div>
    );
};

export default AdminReviews;
