import React, { useState } from "react";
import { useComments, useCreateComment } from "@libs/hooks/apis/useComment";
import { IComment } from "@libs/types/comment";

interface CommentProps {
  issueId: string;
  currentUserId: string;
  currentUserName?: string;
}

interface CommentItemProps {
  comment: IComment;
  currentUserId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const getUserInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  const getUserName = (userId: string) => {
    return `User ${userId.slice(-4)}`;
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-4 group/comment">
      {/* User Avatar */}
      <div className="shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#064e3b]/5 text-[10px] font-black text-[#064e3b] border border-[#064e3b]/10 uppercase tracking-tight">
          {getUserInitials(comment.user_id)}
        </div>
      </div>

      {/* Comment Content */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-black text-[#064e3b]">
            {getUserName(comment.user_id)}
          </span>
          <span className="text-[10px] font-bold text-[#064e3b]/40 uppercase">
            {formatRelativeTime(comment.created_at)}
          </span>
          {comment.created_at !== comment.updated_at && (
            <span className="text-[10px] font-bold text-[#064e3b]/20 uppercase">(edited)</span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] w-full resize-none rounded-xl border border-[#064e3b]/20 bg-white p-3 text-[13px] font-medium text-[#064e3b] outline-none shadow-sm focus:border-[#064e3b]/40"
              placeholder="Edit your comment..."
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-[#064e3b] px-4 py-1.5 text-xs font-black text-white hover:bg-[#064e3b]/90 transition-all active:scale-95"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-1.5 text-xs font-black text-[#064e3b]/40 hover:text-[#064e3b] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg rounded-tl-sm border border-[#064e3b]/5 bg-[#fcfcfb]/50 p-3 shadow-inner-sm border-l-2 border-l-[#064e3b]/10">
            <div className="text-[13px] leading-relaxed font-medium text-[#064e3b]/80 whitespace-pre-wrap">
              {comment.content}
            </div>
          </div>
        )}

        {/* Comment Actions */}
        {!isEditing && currentUserId === comment.user_id && (
          <div className="flex items-center gap-3 opacity-0 group-hover/comment:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="text-[10px] font-black text-[#064e3b]/50 hover:text-[#064e3b] uppercase tracking-widest transition-colors"
            >
              Edit
            </button>
            <button className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Comment: React.FC<CommentProps> = ({
  issueId,
  currentUserId,
  currentUserName = "Current User",
}) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { comments: commentsList, isLoading } = useComments({
    issue_id: issueId,
    page: 1,
    limit: 50,
  });

  const { createCommentAsync, isLoading: isCreating } = useCreateComment({
    issue_id: issueId,
    user_id: currentUserId,
    content: newComment,
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    await createCommentAsync();
    setNewComment("");
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setNewComment("");
    setIsExpanded(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-transparent font-manrope">
      <div className="mb-6 flex items-center justify-between border-b border-[#064e3b]/5 pb-4">
        <h3 className="text-[11px] font-black text-[#064e3b]/60 uppercase tracking-widest">
          Comments ({commentsList?.length || 0})
        </h3>
      </div>

      {/* Add Comment Form */}
      <div className="mb-8">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#064e3b]/5 text-[10px] font-black text-[#064e3b] border border-[#064e3b]/10 uppercase tracking-tight">
            {getUserInitials(currentUserName)}
          </div>

          <div className="flex-1">
            <div className="flex-1 overflow-hidden rounded-lg border border-[#064e3b]/10 bg-white shadow-sm ring-4 ring-[#064e3b]/2 transition-all focus-within:border-[#064e3b]/30 focus-within:ring-[#064e3b]/5">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={handleFocus}
                placeholder="Add a comment..."
                className={`w-full resize-none border-none bg-transparent p-3 text-[13px] font-medium text-[#064e3b] outline-none placeholder:text-[#064e3b]/40 transition-all ${
                  isExpanded ? "min-h-[100px]" : "min-h-[40px]"
                }`}
              />

              {isExpanded && (
                <div className="flex items-center justify-between bg-[#fcfcfb]/50 px-3 py-2 border-t border-[#064e3b]/5 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-1">
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[#064e3b]/60 hover:bg-[#064e3b]/5 hover:text-[#064e3b] transition-all">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 000-2.828z" />
                      </svg>
                    </button>
                    <div className="h-3 w-px bg-[#064e3b]/10 mx-1" />
                    <button className="h-7 px-2 text-[10px] font-black text-[#064e3b]/60 hover:text-[#064e3b] uppercase">Bold</button>
                    <button className="h-7 px-2 text-[10px] font-black text-[#064e3b]/60 hover:text-[#064e3b] italic uppercase">Italic</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-xs font-black text-[#064e3b]/60 hover:text-[#064e3b] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isCreating}
                      className="rounded-lg bg-[#064e3b] px-4 py-1.5 text-xs font-black text-white shadow-sm hover:bg-[#064e3b]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                      {isCreating ? "Sending..." : "Comment"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#064e3b]/10 border-t-[#064e3b]"></div>
            <span className="text-[11px] font-black text-[#064e3b]/20 uppercase tracking-widest">Loading conversations...</span>
          </div>
        ) : commentsList && commentsList.length > 0 ? (
          <div className="flex flex-col gap-6">
            {commentsList.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-[#064e3b]/5 flex items-center justify-center text-[#064e3b]/20 mb-3 border border-[#064e3b]/10">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.34l-4.772 1.18a1 1 0 01-1.24-1.24l1.18-4.772A8 8 0 1121 12z" />
              </svg>
            </div>
            <h4 className="text-[13px] font-black text-[#064e3b]/70 tracking-tight">No activity logs yet</h4>
            <p className="text-[11px] font-bold text-[#064e3b]/50 uppercase tracking-tight mt-1">Start the conversation below</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {commentsList && commentsList.length >= 50 && (
        <div className="mt-8 text-center pt-4 border-t border-[#064e3b]/5">
          <button className="text-[11px] font-black text-[#064e3b]/60 hover:text-[#064e3b] uppercase tracking-widest transition-colors">
            View full conversation history
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
