import React from 'react';

interface AssistantMessageProps {
  content: string;
  documents?: Array<{ file_name: string }>;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ content, documents = [] }) => {
  return (
    <div className="flex justify-start">
      <div className="max-w-xs md:max-w-md lg:max-w-lg">
        <div className="bg-white rounded-lg p-3 shadow-sm mb-2">
          <p className="text-[var(--primary-text)]">{content}</p>
        </div>
        {documents.length > 0 && (
          <div className="space-y-1">
            {documents.map((doc, index) => (
              <div key={index} className="bg-[var(--primary-100)] rounded-lg p-2 text-sm">
                <p className="text-[var(--primary-100-text)] truncate">{doc.file_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantMessage;