
export interface Institution {
  id: string;
  name: string;
  ranking: number;
  accreditation: string;
  approval: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'NA';
  fee: number;
  courses: string[];
  location: string;
  hostel: {
    ac: boolean;
    nonAc: boolean;
    sheeter: number;
  };
  highestPlacement: number;
  averagePlacement: number;
  internationalStudents: number;
  nepaliStudents: number;
  description: string;
  images: string[];
  videos: string[];
  pdfs: { name: string; url: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
