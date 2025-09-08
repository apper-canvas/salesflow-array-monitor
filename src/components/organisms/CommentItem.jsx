import React, { useState } from 'react';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import CommentInput from './CommentInput';

const CommentItem = ({ 
  comment, 
  replies = [], 
  contacts = [], 
  currentUserId, 
  onUpdate, 
  onDelete, 
  onAddReply, 
  onUpdateReply, 
  onDeleteReply,
  isReply = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);

  const isAuthor = comment.userId === currentUserId;
  const text = isReply ? comment.replyText : comment.commentText;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdateSubmit = (newText) => {
    if (isReply) {
      onUpdateReply(comment.Id, newText);
    } else {
      onUpdate(comment.Id, newText);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (isReply) {
      onDeleteReply(comment.Id);
    } else {
      onDelete(comment.Id);
    }
  };

  const handleReplySubmit = (replyText) => {
    onAddReply(comment.Id, replyText);
    setShowReplyInput(false);
  };

  const handleReplyCancel = () => {
    setShowReplyInput(false);
  };

  const handleEditReply = (replyId) => {
    setEditingReplyId(replyId);
  };

  const handleEditReplySubmit = (replyId, replyText) => {
    onUpdateReply(replyId, replyText);
    setEditingReplyId(null);
  };

  const handleEditReplyCancel = () => {
    setEditingReplyId(null);
  };

  const renderMentions = (text) => {
    if (!text) return text;
    
    // Replace @mentions with highlighted spans
    return text.replace(/@(\w+(?:\s+\w+)*)/g, (match, username) => {
      return `<span class="text-primary-600 font-medium bg-primary-50 px-1 rounded">${match}</span>`;
    });
  };

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.userName?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-gray-900">
                  {comment.userName || 'Unknown User'}
                </span>
                <span className="text-xs text-gray-500">
                  {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a') : ''}
                </span>
              </div>
              
              {isAuthor && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    icon="Edit"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-gray-600"
                  />
                  <Button
                    size="xs"
                    variant="ghost"
                    icon="Trash2"
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-600"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <CommentInput
                contacts={contacts}
                onSubmit={handleUpdateSubmit}
                onCancel={handleEditCancel}
                initialValue={text}
                placeholder="Edit your comment..."
                submitLabel="Update"
              />
            ) : (
              <>
                <div 
                  className="text-sm text-gray-700 mb-2"
                  dangerouslySetInnerHTML={{ __html: renderMentions(text) }}
                />
                
                {!isReply && (
                  <div className="flex items-center space-x-3">
                    <Button
                      size="xs"
                      variant="ghost"
                      icon="MessageCircle"
                      onClick={() => setShowReplyInput(!showReplyInput)}
                      className="text-gray-500 hover:text-primary-600"
                    >
                      Reply
                    </Button>
                    {replies.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="mt-3 ml-11">
          <CommentInput
            contacts={contacts}
            onSubmit={handleReplySubmit}
            onCancel={handleReplyCancel}
            placeholder="Write a reply..."
            submitLabel="Reply"
          />
        </div>
      )}

      {/* Replies */}
      {!isReply && replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {replies.map((reply) => (
            <div key={reply.Id}>
              {editingReplyId === reply.Id ? (
                <div className="ml-11">
                  <CommentInput
                    contacts={contacts}
                    onSubmit={(replyText) => handleEditReplySubmit(reply.Id, replyText)}
                    onCancel={handleEditReplyCancel}
                    initialValue={reply.replyText}
                    placeholder="Edit your reply..."
                    submitLabel="Update"
                  />
                </div>
              ) : (
                <CommentItem
                  comment={reply}
                  replies={[]}
                  contacts={contacts}
                  currentUserId={currentUserId}
                  onUpdate={onUpdateReply}
                  onDelete={onDeleteReply}
                  isReply={true}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;