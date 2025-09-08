import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CommentInput = ({ 
  contacts = [], 
  onSubmit, 
  onCancel, 
  initialValue = '', 
  placeholder = 'Write a comment...', 
  submitLabel = 'Comment' 
}) => {
  const [text, setText] = useState(initialValue);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef(null);
  const mentionsRef = useRef(null);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Check for @ mentions
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionPosition(cursorPosition - mentionMatch[1].length - 1);
      setShowMentions(true);
      setSelectedMentionIndex(0);
    } else {
      setShowMentions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (showMentions) {
      const filteredContacts = getFilteredContacts();
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredContacts.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : filteredContacts.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (filteredContacts[selectedMentionIndex]) {
          insertMention(filteredContacts[selectedMentionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getFilteredContacts = () => {
    if (!mentionQuery) return contacts.slice(0, 5);
    return contacts
      .filter(contact => 
        contact.name?.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(mentionQuery.toLowerCase())
      )
      .slice(0, 5);
  };

  const insertMention = (contact) => {
    const beforeMention = text.substring(0, mentionPosition);
    const afterMention = text.substring(textareaRef.current.selectionStart);
    const mentionText = `@${contact.name} `;
    
    const newText = beforeMention + mentionText + afterMention;
    setText(newText);
    setShowMentions(false);
    
    // Focus back to textarea and position cursor
    setTimeout(() => {
      textareaRef.current.focus();
      const newPosition = mentionPosition + mentionText.length;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
      setShowMentions(false);
    }
  };

  const handleCancel = () => {
    setText(initialValue);
    setShowMentions(false);
    onCancel?.();
  };

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full resize-none border-none outline-none min-h-[80px] text-sm"
          rows="3"
        />
        
        {showMentions && (
          <div 
            ref={mentionsRef}
            className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto"
          >
            {getFilteredContacts().map((contact, index) => (
              <button
                key={contact.Id}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                  index === selectedMentionIndex ? 'bg-primary-50 text-primary-900' : ''
                }`}
                onClick={() => insertMention(contact)}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xs">
                  {contact.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-xs text-gray-500">{contact.email}</div>
                </div>
              </button>
            ))}
            {getFilteredContacts().length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No contacts found
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500 flex items-center space-x-4">
          <span>Use @ to mention someone</span>
          <span>Cmd+Enter to submit</span>
        </div>
        <div className="flex items-center space-x-2">
          {onCancel && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!text.trim()}
            icon="Send"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;