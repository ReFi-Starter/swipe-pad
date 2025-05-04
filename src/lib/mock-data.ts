import { Project } from '@/components/swipe-card'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Eco-friendly Water Purifier',
    description: 'A sustainable solution for clean drinking water in developing regions, using locally sourced materials and solar power.',
    imageUrl: '/images/projects/non-existent-file-1.jpg',
    donationAmount: 2500,
    creator: {
      name: 'EcoSolutions',
      verified: true
    }
  },
  {
    id: '2',
    title: 'Community Garden Initiative',
    description: 'Creating sustainable food sources through community-managed urban gardens in food desert areas.',
    imageUrl: '/images/projects/non-existent-file-2.jpg',
    donationAmount: 1500,
    creator: {
      name: 'GreenThumb',
      verified: true
    }
  },
  {
    id: '3',
    title: 'Solar-Powered Lamps',
    description: 'Providing affordable solar-powered lamps to communities without reliable electricity access.',
    imageUrl: '/images/projects/non-existent-file-3.jpg',
    donationAmount: 3000,
    creator: {
      name: 'LightForAll',
      verified: false
    }
  },
  {
    id: '4',
    title: 'Ocean Plastic Recycling',
    description: 'Converting ocean plastic waste into sustainable products while creating jobs for coastal communities.',
    imageUrl: '/images/projects/non-existent-file-4.jpg',
    donationAmount: 5000,
    creator: {
      name: 'OceanClean',
      verified: true
    }
  },
  {
    id: '5',
    title: 'Healthcare App Development',
    description: 'Building a mobile app to connect rural communities with healthcare professionals for remote consultations.',
    imageUrl: '/images/projects/non-existent-file-5.jpg',
    donationAmount: 4000,
    creator: {
      name: 'HealthTech',
      verified: true
    }
  }
] 