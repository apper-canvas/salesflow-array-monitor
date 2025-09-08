import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { dealCommentService } from '@/services/api/dealCommentService';
import { dealCommentReplyService } from '@/services/api/dealCommentReplyService';
import { contactService } from '@/services/api/contactService';

const DealComments = ({ dealId }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddComment, setShowAddComment] = useState(false);
  const [contacts, setContacts] = useState([]);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (dealId) {
      loadComments();
      loadContacts();
    }
  }, [dealId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await dealCommentService.getCommentsByDealId(dealId);
      setComments(commentsData);
      
      // Load replies for each comment
      const repliesData = {};
      for (const comment of commentsData) {
        const commentReplies = await dealCommentReplyService.getRepliesByCommentId(comment.Id);
        repliesData[comment.Id] = commentReplies;
      }
      setReplies(repliesData);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const handleAddComment = async (commentText) => {
    if (!user?.userId) {
      toast.error('You must be logged in to comment');
      return;
    }

    try {
      const commentData = {
        dealId,
        commentText,
        userId: user.userId
      };

      const newComment = await dealCommentService.create(commentData);
      if (newComment) {
        setComments(prev => [...prev, newComment]);
        setReplies(prev => ({ ...prev, [newComment.Id]: [] }));
        setShowAddComment(false);
        toast.success('Comment added successfully');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdateComment = async (commentId, commentText) => {
    try {
      const updatedComment = await dealCommentService.update(commentId, { commentText });
      if (updatedComment) {
        setComments(prev => prev.map(comment => 
          comment.Id === commentId ? updatedComment : comment
        ));
        toast.success('Comment updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const success = await dealCommentService.delete(commentId);
      if (success) {
        setComments(prev => prev.filter(comment => comment.Id !== commentId));
        setReplies(prev => {
          const newReplies = { ...prev };
          delete newReplies[commentId];
          return newReplies;
        });
        toast.success('Comment deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    if (!user?.userId) {
      toast.error('You must be logged in to reply');
      return;
    }

    try {
      const replyData = {
        commentId,
        replyText,
        userId: user.userId
      };

      const newReply = await dealCommentReplyService.create(replyData);
      if (newReply) {
        setReplies(prev => ({
          ...prev,
          [commentId]: [...(prev[commentId] || []), newReply]
        }));
        toast.success('Reply added successfully');
      }
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleUpdateReply = async (replyId, replyText) => {
    try {
      const updatedReply = await dealCommentReplyService.update(replyId, { replyText });
      if (updatedReply) {
        setReplies(prev => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach(commentId => {
            newReplies[commentId] = newReplies[commentId].map(reply =>
              reply.Id === replyId ? updatedReply : reply
            );
          });
          return newReplies;
        });
        toast.success('Reply updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update reply');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      const success = await dealCommentReplyService.delete(replyId);
      if (success) {
        setReplies(prev => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach(commentId => {
            newReplies[commentId] = newReplies[commentId].filter(reply => reply.Id !== replyId);
          });
          return newReplies;
        });
        toast.success('Reply deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete reply');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 pt-6 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApperIcon name="MessageCircle" className="h-5 w-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">
            Comments ({comments.length})
          </h4>
        </div>
        <Button
          size="sm"
          variant="outline"
          icon="Plus"
          onClick={() => setShowAddComment(!showAddComment)}
        >
          Add Comment
        </Button>
      </div>

      {showAddComment && (
        <CommentInput
          contacts={contacts}
          onSubmit={handleAddComment}
          onCancel={() => setShowAddComment(false)}
          placeholder="Add a comment..."
        />
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="MessageCircle" className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.Id} className="space-y-3">
              <CommentItem
                comment={comment}
                replies={replies[comment.Id] || []}
                contacts={contacts}
                currentUserId={user?.userId}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
                onAddReply={handleAddReply}
                onUpdateReply={handleUpdateReply}
                onDeleteReply={handleDeleteReply}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DealComments;