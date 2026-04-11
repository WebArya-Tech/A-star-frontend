import React from 'react';
import TutorCard from '../components/TutorCard';
import teachers from '../assets/teachers';

const TutorsIGCSE = () => {
    // Use the images available in src/assets as the teacher list
    const tutors = teachers.map((t) => ({
        name: t.name,
        subject: 'Subject',
        specialty: 'Subject Specialist',
        image: t.src,
        bio: 'Experienced tutor. Replace with actual profile text.'
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">IGCSE Tutors</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Meet our experienced IGCSE tutors dedicated to helping you achieve excellence. Each tutor is a specialist in their subject with proven track records of student success.
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Excel in IGCSE?</h2>
                    <p className="text-gray-600 mb-6">Get personalized tutoring from our expert educators and achieve your academic goals.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Book a Free Trial Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorsIGCSE;
