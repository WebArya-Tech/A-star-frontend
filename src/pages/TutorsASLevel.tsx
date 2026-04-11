import React from 'react';
import TutorCard from '../components/TutorCard';
import teachers from '../assets/teachers';

const TutorsASLevel = () => {
    const tutors = teachers.map((t) => ({
        name: t.name,
        subject: 'Subject',
        specialty: 'Subject Specialist',
        image: t.src,
        bio: 'Experienced tutor. Replace with actual profile text.'
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">AS & A Level Tutors</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our advanced tutors are experts in AS and A Level curricula. Prepare for university with personalized guidance from subject specialists.
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Excel in Your A Levels</h2>
                    <p className="text-gray-600 mb-6">Get comprehensive tutoring for all your AS and A Level subjects with our top-rated educators.</p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Schedule Your Free Consultation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorsASLevel;
