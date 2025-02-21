import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      {children}
    </div>
  );
};

export default Card;