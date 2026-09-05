import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { watchlistApi } from '../api/watchlist.api.js';

export const CreateWatchlistModal = ({ isOpen, onClose, onWatchlistCreated }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Watchlist name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const created = await watchlistApi.createWatchlist(name.trim());
      if (onWatchlistCreated) onWatchlistCreated(created);
      setName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create watchlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Watchlist"
      description="Organize your stocks into custom sectors or strategies."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="watchlist-name"
          label="Watchlist Name"
          placeholder="e.g. Nifty Bluechips, IT Giants, High Dividend..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoFocus
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-bold text-[#7C2808] hover:text-[#370A00]">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} className="text-xs font-bold text-[#FFF7ED] bg-[#370A00] hover:bg-[#250700] rounded-xl shadow-md">
            Create Watchlist
          </Button>
        </div>
      </form>
    </Modal>
  );
};
