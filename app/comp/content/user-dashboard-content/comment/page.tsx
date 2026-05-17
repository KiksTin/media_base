"use client"

import { useState, useEffect } from 'react';
import './page.css';

interface Comment {
  comment_id: number;
  comment_text: string;
  user_id: number;
  song_id: number;
  song_name?: string;
  user_name?: string;
  user_profile?: string;
}

const Comment = ({currentUser}: {currentUser: any}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Comment - Current user:', currentUser);
        console.log('Comment - User ID:', currentUser?.user_id);

        if (!currentUser || !currentUser.user_id) {
          console.log('Comment - No current user or user_id, skipping fetch');
          return;
        }

        const apiUrl = `/api/get-comment?user_id=${currentUser.user_id}`;
        console.log('Comment - Fetching from:', apiUrl);

        const response = await fetch(apiUrl);

        console.log('Comment - Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Comment - Data received:', data);
          console.log('Comment - Data length:', Array.isArray(data.comments) ? data.comments.length : 'Not an array');
          setComments(data.comments || []);
        } else {
          console.error('Comment - Response not ok:', response.statusText);
          const errorData = await response.json();
          console.error('Comment - Error data:', errorData);
        }
      } catch (error) {
        console.error('Comment - Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentUser]);

  return (
   <div className="comment-container">
    <div className='comment-list'>
      {loading ? (
        <p>Loading...</p>
      ) : comments.length === 0 ? (
        <p>No comments on your songs</p>
      ) : (
        <ol>
          {comments.map(comment => {
         return (
           <li key={`${comment.comment_id}-${comment.song_id}`}>
             <div className='comment-item'>
      
                   <img 
                     src={comment.user_profile || '/user.png'} 
                     alt={comment.user_name || 'User'} 
                     className='comment-avatar'
                   />
                   <div>
                    <span><h3>{comment.user_name || 'Unknown User'}</h3> &nbsp;<p> commented on {comment.song_name || 'Unknown Song'}</p></span>
                     
                    {comment.comment_text}
                   </div>
            </div>
          
           </li>
         );
       })}
        </ol>
      )}
    </div>
  </div>
  )
}

export default Comment
