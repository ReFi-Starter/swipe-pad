import { Project } from '@/components/swipe-card'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Eco-friendly Water Purifier',
    description: 'A sustainable solution for clean drinking water in developing regions, using locally sourced materials and solar power.',
    imageUrl: 'https://images.unsplash.com/photo-1571437436752-b39c74e5c501?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    donationAmount: 2500,
    category: 'Environment',
    trustStatus: 'verified',
    boost: true,
    progress: {
      current: 1500,
      target: 2500
    },
    creator: {
      name: 'EcoSolutions',
      verified: true
    },
    notesCount: 3
  },
  {
    id: '2',
    title: 'Community Garden Initiative',
    description: 'Creating sustainable food sources through community-managed urban gardens in food desert areas.',
    imageUrl: 'https://images.unsplash.com/photo-1653553003030-40f332bd3add?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    donationAmount: 1500,
    category: 'Community',
    trustStatus: 'verified',
    progress: {
      current: 750,
      target: 1500
    },
    creator: {
      name: 'GreenThumb',
      verified: true
    },
    notesCount: 1
  },
  {
    id: '3',
    title: 'Solar-Powered Lamps',
    description: 'Providing affordable solar-powered lamps to communities without reliable electricity access.',
    imageUrl: 'https://images.unsplash.com/photo-1701159850298-35999c07acca?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    donationAmount: 3000,
    category: 'Energy',
    trustStatus: 'warning',
    progress: {
      current: 1200,
      target: 3000
    },
    creator: {
      name: 'LightForAll',
      verified: false
    }
  },
  {
    id: '4',
    title: 'Ocean Plastic Recycling',
    description: 'Converting ocean plastic waste into sustainable products while creating jobs for coastal communities.',
    imageUrl: 'https://images.unsplash.com/photo-1618477462041-2b6b1920e073?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    donationAmount: 5000,
    category: 'Environment',
    trustStatus: 'verified',
    boost: true,
    progress: {
      current: 3500,
      target: 5000
    },
    creator: {
      name: 'OceanClean',
      verified: true
    },
    notesCount: 5
  },
  {
    id: '5',
    title: 'Healthcare App Development',
    description: 'Building a mobile app to connect rural communities with healthcare professionals for remote consultations.',
    imageUrl: 'https://images.unsplash.com/photo-1648279220423-14606cb98f22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8QnVpbGRpbmclMjBhJTIwbW9iaWxlJTIwYXBwJTIwdG8lMjBjb25uZWN0JTIwcnVyYWwlMjBjb21tdW5pdGllcyUyMHdpdGglMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFscyUyMGZvciUyMHJlbW90ZSUyMGNvbnN1bHRhdGlvbnN8ZW58MHx8MHx8fDA%3D',
    donationAmount: 4000,
    category: 'Healthcare',
    trustStatus: 'verified',
    progress: {
      current: 2800,
      target: 4000
    },
    creator: {
      name: 'HealthTech',
      verified: true
    }
  }
] 