
import React from 'react';
import { Institution } from '../types';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';
import { ShareIcon } from './Icons';

interface InstitutionDetailsModalProps {
  institution: Institution | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 col-span-2">{value}</dd>
    </div>
);

const InstitutionDetailsModal: React.FC<InstitutionDetailsModalProps> = ({ institution, onClose }) => {
  const { user } = useAuth();
  
  if (!institution) return null;

  const handleShare = (pdfName: string) => {
    // Mock share functionality
    alert(`Sharing ${pdfName}... (A shareable link would be generated here)`);
  };

  return (
    <Modal isOpen={!!institution} onClose={onClose} title={institution.name} size="3xl">
      <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Overview</h3>
            <p className="text-sm text-gray-600">{institution.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <DetailItem label="Ranking" value={institution.ranking} />
            <DetailItem label="Grade" value={<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${institution.grade === 'A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{institution.grade}</span>} />
            <DetailItem label="Accreditation" value={institution.accreditation} />
            <DetailItem label="Approval" value={institution.approval} />
            <DetailItem label="Location" value={institution.location} />
            <DetailItem label="Annual Fee" value={`NPR ${institution.fee.toLocaleString()}`} />
            <DetailItem label="Highest Placement" value={`NPR ${institution.highestPlacement.toLocaleString()}`} />
            <DetailItem label="Average Placement" value={`NPR ${institution.averagePlacement.toLocaleString()}`} />
            <DetailItem label="International Students" value={institution.internationalStudents} />
            <DetailItem label="Nepali Students" value={institution.nepaliStudents.toLocaleString()} />
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hostel Details</h3>
            <div className="flex space-x-4 text-sm text-gray-700">
                <span>A/C: {institution.hostel.ac ? 'Available' : 'Not Available'}</span>
                <span>Non-A/C: {institution.hostel.nonAc ? 'Available' : 'Not Available'}</span>
                <span>Sheeter: {institution.hostel.sheeter}</span>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Courses Offered</h3>
            <div className="flex flex-wrap gap-2">
                {institution.courses.map(course => (
                    <span key={course} className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">{course}</span>
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {institution.images.map((img, index) => (
                    <img key={index} src={img} alt={`${institution.name} gallery ${index + 1}`} className="rounded-lg object-cover aspect-video" />
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Documents</h3>
            <ul className="divide-y divide-gray-200">
                {institution.pdfs.map((pdf) => (
                    <li key={pdf.name} className="py-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-primary-600 hover:underline cursor-pointer">{pdf.name}</span>
                        {user && (
                            <button onClick={() => handleShare(pdf.name)} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                                <ShareIcon className="w-4 h-4 mr-1" /> Share
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </Modal>
  );
};

export default InstitutionDetailsModal;
