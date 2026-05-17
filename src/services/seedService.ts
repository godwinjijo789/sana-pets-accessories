import { addPet, addAccessory, addReview, updateContactInfo } from './firebaseService';

export const seedInitialData = async () => {
  try {
    // 1. Seed Pets
    const pets = [
      {
        name: 'Max',
        breed: 'Golden Retriever',
        age: '3 Months',
        gender: 'Male',
        vaccination: 'Fully Vaccinated',
        price: 1200,
        description: 'Friendly, energetic Golden Retriever puppy looking for a loving home. Great with kids and other pets.',
        availability: true,
        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Luna',
        breed: 'Persian Cat',
        age: '5 Months',
        gender: 'Female',
        vaccination: 'Up to date',
        price: 850,
        description: 'Elegant white Persian cat with a calm temperament. Loves to cuddle and play with feathers.',
        availability: true,
        images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Rocky',
        breed: 'Husky Puppy',
        age: '2 Months',
        gender: 'Male',
        vaccination: '1st Dose Done',
        price: 1500,
        description: 'Stunning Siberian Husky with blue eyes. Active and vocal, needs space to run and grow.',
        availability: true,
        images: ['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Sunny',
        breed: 'Love Birds',
        age: 'Adult',
        gender: 'Male',
        vaccination: 'N/A',
        price: 150,
        description: 'Vibrant and cheerful Love Birds. Selling as a pair to ensure they stay happy together.',
        availability: true,
        images: ['https://images.unsplash.com/photo-1522850949506-58555f29a1ee?auto=format&fit=crop&q=80&w=800']
      }
    ];

    for (const pet of pets) {
      await addPet(pet as any);
    }

    // 2. Seed Accessories
    const accessories = [
      {
        name: 'Premium Puppy Food',
        category: 'Food',
        price: 45,
        description: 'Nutrient-rich formula specifically designed for growing puppies of all breeds.',
        availability: true,
        images: ['https://images.unsplash.com/photo-1589924691995-171ef99ab60d?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Interactive Cat Toy',
        category: 'Toys',
        price: 25,
        description: 'Motion-activated laser toy that keeps your cat entertained for hours.',
        availability: true,
        images: ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800']
      },
      {
        name: 'Orthopedic Dog Bed',
        category: 'Beds',
        price: 120,
        description: 'Memory foam bed for large breeds, providing support for joints and comfort.',
        availability: true,
        images: ['https://images.unsplash.com/photo-1591768793355-74d7c504c35e?auto=format&fit=crop&q=80&w=800']
      }
    ];

    for (const acc of accessories) {
      await addAccessory(acc as any);
    }

    // 3. Contact Info
    await updateContactInfo({
      phone: '+1 (234) 567 890',
      email: 'godwinjijo789@gmail.com',
      address: '123 Pet Paradise St, Animal Kingdom, NY 10001',
      socials: {
        instagram: 'https://instagram.com/sanapets',
        facebook: 'https://facebook.com/sanapets',
        whatsapp: '1234567890'
      }
    });

    console.log('Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
