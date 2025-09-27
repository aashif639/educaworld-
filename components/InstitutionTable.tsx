
import React, { useState, useMemo } from 'react';
import { Institution } from '../types';
import { EditIcon, DeleteIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

interface InstitutionTableProps {
  institutions: Institution[];
  onSelect: (institution: Institution) => void;
  onEdit: (institution: Institution) => void;
  onDelete: (id: string) => void;
}

type SortKey = keyof Pick<Institution, 'name' | 'ranking' | 'location' | 'fee'>;

const InstitutionTable: React.FC<InstitutionTableProps> = ({ institutions, onSelect, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [sortKey, setSortKey] = useState<SortKey>('ranking');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedInstitutions = useMemo(() => {
    return [...institutions].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [institutions, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const SortIndicator: React.FC<{ sortKeyName: SortKey }> = ({ sortKeyName }) => {
      if (sortKey !== sortKeyName) return null;
      return <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('ranking')}>
              Ranking <SortIndicator sortKeyName="ranking" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
              Name <SortIndicator sortKeyName="name" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell" onClick={() => handleSort('location')}>
              Location <SortIndicator sortKeyName="location" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden lg:table-cell" onClick={() => handleSort('fee')}>
              Fee (NPR) <SortIndicator sortKeyName="fee" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Courses
            </th>
            {user && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedInstitutions.length > 0 ? sortedInstitutions.map((inst) => (
            <tr key={inst.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(inst)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inst.ranking}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-700">{inst.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{inst.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{inst.fee.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                <div className="flex flex-wrap gap-1">
                  {inst.courses.slice(0, 2).map(course => <span key={course} className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">{course}</span>)}
                  {inst.courses.length > 2 && <span className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-full">+{inst.courses.length - 2} more</span>}
                </div>
              </td>
              {user && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(inst)} className="text-primary-600 hover:text-primary-900 mr-4"><EditIcon className="w-5 h-5"/></button>
                  <button onClick={() => onDelete(inst.id)} className="text-red-600 hover:text-red-900"><DeleteIcon className="w-5 h-5"/></button>
                </td>
              )}
            </tr>
          )) : (
            <tr>
                <td colSpan={user ? 6 : 5} className="text-center py-10 text-gray-500">
                    No institutions found.
                </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InstitutionTable;
