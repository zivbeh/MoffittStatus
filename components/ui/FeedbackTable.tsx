"use client";

import React, { useEffect, useState } from 'react';

interface FeedbackData {
  accurate: boolean;
  feedback_text: string;
  created_at: string;
}

export default function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/feedback', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch data:', response.status, response.statusText);
          return;
        }

        const data = await response.json();
        console.log('Fetched feedback data:', data);
        setFeedbackData(data.message || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      {feedbackData.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Accurate</th>
              <th className="px-6 py-3 text-left">Feedback</th>
              <th className="px-6 py-3 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((feedback, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {feedback.accurate ? '✅ Yes' : '❌ No'}
                </td>
                <td className="px-6 py-4">{feedback.feedback_text || '-'}</td>
                <td className="px-6 py-4">
                  {new Date(feedback.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No feedback data available.</div>
      )}
    </div>
  );
}