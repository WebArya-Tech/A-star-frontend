import React from 'react';
import IITJEEQuestionTabs from '../components/IITJEEQuestionTabs';

const IITJEEQuestionsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
                    IIT JEE Style Math Questions
                </h1>
                <IITJEEQuestionTabs />
            </div>
        </div>
    );
};

export default IITJEEQuestionsPage;
