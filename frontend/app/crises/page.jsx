'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrisisForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    description: '',
    peopleAffected: '',
    situationRating: '',
    fundsRequired: '',
  });

  const [ngoId, setNgoId] = useState('');
  const [loading, setLoading] = useState(false);

  // Get NGO/user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setNgoId(storedUserId);
    } else {
      alert('No userId found in localStorage!');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Get latitude and longitude from place name
      const geoResponse = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          formData.place
        )}&key=470033735d5b4e50926bd903d53ddabc`
      );

      const { results } = geoResponse.data;
      if (!results || results.length === 0) {
        alert('Invalid place. Please try again.');
        setLoading(false);
        return;
      }

      const { lat, lng } = results[0].geometry;

      // Step 2: Create payload and send to backend
      const crisisPayload = {
        ...formData,
        ngoId,
        latitude: lat,
        longitude: lng,
      };

      const res = await axios.post('http://localhost:3002/api/create', crisisPayload);

      alert('Crisis created successfully!');
      console.log(res.data);

      setFormData({
        name: '',
        place: '',
        description: '',
        peopleAffected: '',
        situationRating: '',
        fundsRequired: '',
      });

    } catch (error) {
      console.error(error);
      alert('Error creating crisis. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Create a Crisis</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Crisis Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="place" placeholder="Place (City, Country)" value={formData.place} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="peopleAffected" placeholder="People Affected" value={formData.peopleAffected} onChange={handleChange} required />
        <input type="number" name="situationRating" placeholder="Situation Rating (1-10)" value={formData.situationRating} onChange={handleChange} required />
        <input type="number" name="fundsRequired" placeholder="Funds Required ($)" value={formData.fundsRequired} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Crisis'}</button>
      </form>
    </div>
  );
};

export default CrisisForm;
