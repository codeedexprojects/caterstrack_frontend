import React from 'react';
import { Star, Award, Calendar } from 'lucide-react';

const CompletedWorkSection = ({ recentCompletedWork }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Recent Completed Work</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentCompletedWork.map((work) => (
          <div
            key={work.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">{work.title}</h3>
              <div className="flex items-center gap-1">
                {renderStars(work.rating)}
                <span className="text-sm font-medium text-gray-600 ml-1">{work.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">"{work.feedback}"</p>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{work.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedWorkSection;