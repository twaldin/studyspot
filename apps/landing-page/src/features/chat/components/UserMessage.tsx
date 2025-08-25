import React from 'react';

interface UserMessageProps {
  content: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-xs md:max-w-md lg:max-w-lg bg-[var(--primary-100)] rounded-lg p-3 shadow-sm">
        <p className="text-[var(--primary-text)]">{content}</p>
      </div>
    </div>
  );
};

export default UserMessage;