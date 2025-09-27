import React, { useState, useEffect } from 'react';
import { Institution } from '../types';
import Modal from './Modal';
import { useInstitutions } from '../contexts/InstitutionsContext';
import { CloseIcon, PlusIcon } from './Icons';

interface InstitutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionToEdit?: Institution | null;
}

const defaultInstitution: Omit<Institution, 'id'> = {
  name: '',
  ranking: 100,
  accreditation: '',
  approval: '',
  grade: 'NA',
  fee: 0,
  courses: [],
  location: '',
  hostel: { ac: false, nonAc: false, sheeter: 2 },
  highestPlacement: 0,
  averagePlacement: 0,
  internationalStudents: 0,
  nepaliStudents: 0,
  description: '',
  images: [],
  videos: [],
  pdfs: [],
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const InstitutionFormModal: React.FC<InstitutionFormModalProps> = ({ isOpen, onClose, institutionToEdit }) => {
  const { addInstitution, updateInstitution } = useInstitutions();
  const [formData, setFormData] = useState<Omit<Institution, 'id'>>(defaultInstitution);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (institutionToEdit) {
        setFormData(institutionToEdit);
      } else {
        setFormData(defaultInstitution);
      }
    } else {
      // Cleanup when modal is closed
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setIsUploading(false);
    }
  }, [institutionToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHostelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      hostel: { 
        ...prev.hostel, 
        [name]: type === 'checkbox' ? checked : parseInt(value) 
      }
    }));
  };
  
  const handleCoursesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const courses = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
    setFormData(prev => ({...prev, courses}));
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validImageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setNewImageFiles(prev => [...prev, ...validImageFiles]);

    const previews = validImageFiles.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter(url => url !== urlToRemove)
    }));
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    URL.revokeObjectURL(newImagePreviews[indexToRemove]);
    setNewImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
        const uploadedImageUrls = await Promise.all(newImageFiles.map(fileToBase64));
        const finalImages = [...formData.images, ...uploadedImageUrls];

        const submissionData = { ...formData, images: finalImages };

        if (institutionToEdit) {
            updateInstitution({ ...submissionData, id: institutionToEdit.id });
        } else {
            addInstitution(submissionData);
        }
        onClose();
    } catch (error) {
        console.error("Error processing images:", error);
        setIsUploading(false);
    }
  };

  const InputField: React.FC<{ label: string, name: string, value: string | number, onChange: any, type?: string, required?: boolean, as?: 'textarea' | 'select', options?: any[] }> = ({ label, name, value, onChange, type = 'text', required = false, as = 'input', options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        {as === 'textarea' ? (
            <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"/>
        ) : as === 'select' ? (
             <select id={name} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
             </select>
        ) : (
            <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
        )}
    </div>
);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={institutionToEdit ? 'Edit Institution' : 'Add New Institution'} size="3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Institution Name" name="name" value={formData.name} onChange={handleChange} required />
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} required />
          <InputField label="Ranking" name="ranking" value={formData.ranking} onChange={handleChange} type="number" required />
          <InputField label="Fee (Annual)" name="fee" value={formData.fee} onChange={handleChange} type="number" required />
          <InputField label="Accreditation" name="accreditation" value={formData.accreditation} onChange={handleChange} />
          <InputField label="Approval" name="approval" value={formData.approval} onChange={handleChange} />
          <InputField label="Grade" name="grade" value={formData.grade} onChange={handleChange} as="select" options={[{value: 'A', label: 'A'}, {value: 'B', label: 'B'}, {value: 'C', label: 'C'}, {value: 'D', label: 'D'}, {value: 'NA', label: 'Not Applicable'}]} />
          <InputField label="Courses (comma-separated)" name="courses" value={formData.courses.join(', ')} onChange={handleCoursesChange} />
          <InputField label="Highest Placement (NPR)" name="highestPlacement" value={formData.highestPlacement} onChange={handleChange} type="number" />
          <InputField label="Average Placement (NPR)" name="averagePlacement" value={formData.averagePlacement} onChange={handleChange} type="number" />
          <InputField label="International Students" name="internationalStudents" value={formData.internationalStudents} onChange={handleChange} type="number" />
          <InputField label="Nepali Students" name="nepaliStudents" value={formData.nepaliStudents} onChange={handleChange} type="number" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Hostel Details</label>
          <div className="mt-2 flex items-center space-x-6">
              <div className="flex items-center"><input type="checkbox" id="ac" name="ac" checked={formData.hostel.ac} onChange={handleHostelChange} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" /><label htmlFor="ac" className="ml-2 block text-sm text-gray-900">A/C</label></div>
              <div className="flex items-center"><input type="checkbox" id="nonAc" name="nonAc" checked={formData.hostel.nonAc} onChange={handleHostelChange} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" /><label htmlFor="nonAc" className="ml-2 block text-sm text-gray-900">Non A/C</label></div>
              <div className="flex items-center"><label htmlFor="sheeter" className="mr-2 block text-sm text-gray-900">Sheeter</label><input type="number" name="sheeter" id="sheeter" value={formData.hostel.sheeter} onChange={handleHostelChange} className="w-20 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"/></div>
          </div>
        </div>

        <InputField label="Description" name="description" value={formData.description} onChange={handleChange} as="textarea" />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {formData.images.map((url) => (
              <div key={url} className="relative group aspect-square">
                <img src={url} alt="Existing institution" className="w-full h-full object-cover rounded-md shadow-sm" />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(url)}
                  className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  aria-label="Remove image"
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
            {newImagePreviews.map((previewUrl, index) => (
              <div key={previewUrl} className="relative group aspect-square">
                <img src={previewUrl} alt="New image preview" className="w-full h-full object-cover rounded-md shadow-sm" />
                 <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  aria-label="Remove new image"
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label htmlFor="image-upload" className="cursor-pointer aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors">
              <PlusIcon className="w-8 h-8" />
              <span className="mt-1 text-xs text-center">Add Image</span>
              <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><label className="block font-medium text-gray-700">Videos</label><input type="file" multiple className="mt-1 w-full" disabled /></div>
          <div><label className="block font-medium text-gray-700">PDFs</label><input type="file" multiple className="mt-1 w-full" disabled /></div>
          <p className="md:col-span-2 text-xs text-gray-500">Video and PDF uploads are disabled in this demo.</p>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isUploading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-wait">
            {isUploading ? 'Saving...' : (institutionToEdit ? 'Save Changes' : 'Add Institution')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InstitutionFormModal;