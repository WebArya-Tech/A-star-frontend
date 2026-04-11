import React from 'react';
import TutorCard from '../components/TutorCard';
import teachers from '../assets/teachers';

const TutorsSAT = () => {
    const tutors = teachers.map((t) => ({
        name: t.name,
        subject: 'Subject',
        specialty: 'Subject Specialist',
        image: t.src,
        bio: 'Experienced tutor. Replace with actual profile text.'
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">SAT Preparation Tutors</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ace your SAT with our expert tutors. Specialized training in Math, Reading, and Writing with proven strategies for high scores.
                    </p>
                </div>

                {/* Tutors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutors.map((tutor, index) => (
                        <TutorCard
                            key={index}
                            name={tutor.name}
                            subject={tutor.subject}
                            specialty={tutor.specialty}
                            image={tutor.image}
                            bio={tutor.bio}
                        />
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Score 1500+ on Your SAT</h2>
                    <p className="text-gray-600 mb-6">Join thousands of successful students who improved their scores with our expert SAT tutors.</p>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Start Your SAT Journey Today
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorsSAT;
