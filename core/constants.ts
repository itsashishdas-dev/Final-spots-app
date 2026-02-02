
import { Discipline, Difficulty, Skill, Badge, BadgeTier, Collectible, CollectibleType, Rarity, ExtendedSession, Challenge, Mentor, MentorBadge, DailyNote, Spot, SpotCategory, SpotStatus, SpotPrivacy, VerificationStatus } from '../types';

export const RETRO_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=SkaterBoy',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=RetroContra',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=LegoMan',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=ArcadeQueen'
];

export const STATE_IMAGES: Record<string, string> = {
  "Maharashtra": "https://images.unsplash.com/photo-1562920618-3e26f9ee00ad?w=800",
  "Karnataka": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
  "Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
  "Kerala": "https://images.unsplash.com/photo-1593549423923-19a6902b6878?w=800",
  "Tamil Nadu": "https://images.unsplash.com/photo-1582510003544-524378994569?w=800",
  "Himachal Pradesh": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"
};

// --- XP SYSTEM ---
export const XP_SOURCES = {
  SESSION_COMPLETE: 50,
  SESSION_PLANNED: 75,
  STREAK_BONUS: 20, // Per day, capped at 3
  CHALLENGE_COMPLETE: 150, // Base
  SKILL_LANDED: 80,
  SKILL_MASTERED: 200,
  SPOT_CONTRIBUTION: 40,
  MENTOR_SESSION: 120,
  LEARNER_SESSION: 80
};

export const MOCK_SPOTS: Spot[] = [
  // SKATEPARKS
  { id: 'assam-nfr', name: 'NFR Skatepark (Maligaon)', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Assam', surface: 'Concrete', location: { lat: 26.1600, lng: 91.7000, address: 'Guwahati, Assam' }, notes: 'Railways community skatepark (NFR).', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'delhi-noida-pump', name: 'Noida Pump Track', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Delhi', surface: 'Concrete', location: { lat: 28.5355, lng: 77.3910, address: 'Noida, Delhi' }, notes: 'Pumptrack and skate areas. 100Ramps.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.7, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'goa-anjuna-bowl', name: 'Anjuna Bowl', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Goa', surface: 'Concrete', location: { lat: 15.5736, lng: 73.7406, address: 'Anjuna, Goa' }, notes: 'Concrete bowl & local community.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.8, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'goa-miramar', name: 'Miramar Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Goa', surface: 'Concrete', location: { lat: 15.4732, lng: 73.8079, address: 'Miramar, Goa' }, notes: 'Public skate area.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.4, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'gujarat-ahmedabad', name: 'Sabarmati Riverfront Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Gujarat', surface: 'Concrete', location: { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' }, notes: 'Riverfront skate facilities. 100Ramps.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.6, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'gujarat-vadodara', name: 'Vadodara Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Gujarat', surface: 'Concrete', location: { lat: 22.3072, lng: 73.1812, address: 'Vadodara, Gujarat' }, notes: 'Community skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.3, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'haryana-chandigarh-17', name: 'Sector 17 Skate Area', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Haryana', surface: 'Concrete', location: { lat: 30.7333, lng: 76.7794, address: 'Chandigarh, Haryana' }, notes: 'Public plazas and civic spaces.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.CROWDED, privacy: SpotPrivacy.PUBLIC, rating: 4.2, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'haryana-gurgaon-leela', name: 'Leela Ambience Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Haryana', surface: 'Concrete', location: { lat: 28.5033, lng: 77.0966, address: 'Gurgaon, Haryana' }, notes: 'Mall skate activation zone.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.0, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'karnataka-blr-holystoked', name: 'Holystoked Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Karnataka', surface: 'Concrete', location: { lat: 12.9352, lng: 77.6245, address: 'Bengaluru, Karnataka' }, notes: 'Community-built park. Legendary.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.9, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'karnataka-blr-play', name: 'Play Arena Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Karnataka', surface: 'Concrete', location: { lat: 12.8426, lng: 77.6648, address: 'Bengaluru, Karnataka' }, notes: 'Commercial skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'karnataka-chintamani', name: 'Chintamani Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Karnataka', surface: 'Concrete', location: { lat: 13.4300, lng: 78.0300, address: 'Chintamani, Karnataka' }, notes: '100Ramps hand-built park.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.6, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'kerala-kovalam', name: 'Kovalam Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Kerala', surface: 'Concrete', location: { lat: 8.3833, lng: 76.9714, address: 'Kovalam, Kerala' }, notes: 'Community beachside skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.7, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'mp-bhopal-plaza', name: 'Bhopal Public Skate Plaza', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Madhya Pradesh', surface: 'Concrete', location: { lat: 23.2599, lng: 77.4126, address: 'Bhopal, Madhya Pradesh' }, notes: 'Community ramps and plazas.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.1, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'mp-gwalior-gsc', name: 'GSC Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Madhya Pradesh', surface: 'Concrete', location: { lat: 26.1910, lng: 78.1700, address: 'Gwalior, Madhya Pradesh' }, notes: 'Gwalior Sickness Centre skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'mp-panna-janwaar', name: 'Janwaar Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Madhya Pradesh', surface: 'Concrete', location: { lat: 24.3300, lng: 80.2700, address: 'Panna, Madhya Pradesh' }, notes: 'Rural community skatepark. Inspiring story.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 5.0, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'maharashtra-mumbai-carter', name: 'Carter Road Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Maharashtra', surface: 'Concrete', location: { lat: 19.0607, lng: 72.8227, address: 'Mumbai, Maharashtra' }, notes: 'Public promenade skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.CROWDED, privacy: SpotPrivacy.PUBLIC, rating: 4.7, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'maharashtra-navi-mumbai-nerul', name: 'Nerul Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Maharashtra', surface: 'Concrete', location: { lat: 19.0365, lng: 73.0186, address: 'Navi Mumbai, Maharashtra' }, notes: 'Concrete plaza with modules.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.4, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'maharashtra-pune-sahakarnagar', name: 'Sahakarnagar Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Maharashtra', surface: 'Concrete', location: { lat: 18.4870, lng: 73.8470, address: 'Pune, Maharashtra' }, notes: 'Municipal skatepark. Baba Saheb Ambedkar Park.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'maharashtra-thane-pump', name: 'Thane Pumptrack', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Maharashtra', surface: 'Concrete', location: { lat: 19.2183, lng: 72.9781, address: 'Thane, Maharashtra' }, notes: 'Pumptrack and small skate area.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.2, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'meghalaya-shillong', name: 'Pro-Life Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Meghalaya', surface: 'Concrete', location: { lat: 25.5788, lng: 91.8933, address: 'Shillong, Meghalaya' }, notes: 'Community-built skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.6, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'odisha-bhubaneswar', name: 'Proto Village Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Odisha', surface: 'Concrete', location: { lat: 20.2961, lng: 85.8245, address: 'Bhubaneswar, Odisha' }, notes: 'Community skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.3, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'rajasthan-jaipur-jawahar', name: 'Jawahar Circle Skate Area', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Rajasthan', surface: 'Concrete', location: { lat: 26.8850, lng: 75.7889, address: 'Jaipur, Rajasthan' }, notes: 'Municipal skate area.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.2, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'rajasthan-khempur', name: 'Desert Dolphin Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Rajasthan', surface: 'Concrete', location: { lat: 26.2100, lng: 73.3200, address: 'Khempur, Rajasthan' }, notes: 'Large transition skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.8, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'tamilnadu-chennai-madras', name: 'Madras Wheelers Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Tamil Nadu', surface: 'Concrete', location: { lat: 13.0827, lng: 80.2707, address: 'Chennai, Tamil Nadu' }, notes: 'Community skate facility.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.4, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'tamilnadu-mahabalipuram', name: 'Mahabalipuram Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Tamil Nadu', surface: 'Concrete', location: { lat: 12.6208, lng: 80.1936, address: 'Mahabalipuram, Tamil Nadu' }, notes: 'Listed park.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.3, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'telangana-hyderabad-wallride', name: 'WallRide Park', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Telangana', surface: 'Concrete', location: { lat: 17.3000, lng: 78.4250, address: 'Hyderabad, Telangana' }, notes: 'Pump track + skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.7, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'up-lucknow-gomti', name: 'Gomti Riverfront Skate Area', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'Uttar Pradesh', surface: 'Concrete', location: { lat: 26.8467, lng: 80.9462, address: 'Lucknow, Uttar Pradesh' }, notes: 'Riverfront skate zone.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.2, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'wb-kolkata-newtown', name: 'New Town Skatepark', type: Discipline.SKATE, category: SpotCategory.PARK, difficulty: Difficulty.INTERMEDIATE, state: 'West Bengal', surface: 'Concrete', location: { lat: 22.5873, lng: 88.4861, address: 'Kolkata, West Bengal' }, notes: 'Municipal skatepark.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },

  // STREET SPOTS
  { id: 'delhi-cp-inner', name: 'Connaught Place (Inner)', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Delhi', surface: 'Concrete / Tiles', location: { lat: 28.6315, lng: 77.2167, address: 'New Delhi, Delhi' }, notes: 'Classic plaza – ledges and tiles.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.CROWDED, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'delhi-india-gate', name: 'India Gate Lawns', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Delhi', surface: 'Concrete', location: { lat: 28.6129, lng: 77.2295, address: 'New Delhi, Delhi' }, notes: 'Smooth walking paths. Watch for security.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.CROWDED, privacy: SpotPrivacy.PUBLIC, rating: 3.8, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'mumbai-bandra-fort', name: 'Bandra Bandstand', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Maharashtra', surface: 'Concrete', location: { lat: 19.0556, lng: 72.8220, address: 'Mumbai, Maharashtra' }, notes: 'Flatground & ledges. Iconic view.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.6, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'mumbai-bkc', name: 'BKC Grounds', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Maharashtra', surface: 'Concrete', location: { lat: 19.0673, lng: 72.8687, address: 'Mumbai, Maharashtra' }, notes: 'Open plazas for cruising.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.2, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'pune-viman-nagar', name: 'Viman Nagar Plaza', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Maharashtra', surface: 'Tiles', location: { lat: 18.5679, lng: 73.9143, address: 'Pune, Maharashtra' }, notes: 'Tiles & ledges.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.0, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'bangalore-cubbon', name: 'Cubbon Park (Roads)', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.BEGINNER, state: 'Karnataka', surface: 'Asphalt', location: { lat: 12.9763, lng: 77.5929, address: 'Bengaluru, Karnataka' }, notes: 'Smooth roads on weekends. No traffic.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.CROWDED, privacy: SpotPrivacy.PUBLIC, rating: 4.8, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'chennai-elliots', name: 'Elliot\'s Beach Promenade', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Tamil Nadu', surface: 'Concrete', location: { lat: 13.0095, lng: 80.2707, address: 'Chennai, Tamil Nadu' }, notes: 'Beach cruising & flatground.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.3, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'hyderabad-tank-bund', name: 'Tank Bund Road', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Telangana', surface: 'Asphalt', location: { lat: 17.3942, lng: 78.4678, address: 'Hyderabad, Telangana' }, notes: 'Even promenades for cruising.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.1, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'kolkata-victoria', name: 'Victoria Memorial Promenade', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'West Bengal', surface: 'Concrete', location: { lat: 22.5448, lng: 88.3424, address: 'Kolkata, West Bengal' }, notes: 'Wide promenades. Iconic.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.CROWDED, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'sikkim-mg-marg', name: 'MG Marg', type: Discipline.SKATE, category: SpotCategory.STREET, difficulty: Difficulty.INTERMEDIATE, state: 'Sikkim', surface: 'Tiles', location: { lat: 27.3389, lng: 88.6065, address: 'Gangtok, Sikkim' }, notes: 'Clean promenades. Pedestrian only.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.7, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },

  // DOWNHILL SPOTS
  { id: 'nandi-hills', name: 'Nandi Hills', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Karnataka', surface: 'Asphalt', location: { lat: 13.3702, lng: 77.6835, address: 'Bengaluru, Karnataka' }, notes: 'Famous downhill run. Steep and fast.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.9, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'ponmudi-hills', name: 'Ponmudi Ghats', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Kerala', surface: 'Asphalt', location: { lat: 8.7609, lng: 77.1109, address: 'Thiruvananthapuram, Kerala' }, notes: '22 Hairpin bends. Technical paradise.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.8, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'lavasa-ghat', name: 'Lavasa Ghat', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.PRO, state: 'Maharashtra', surface: 'Asphalt', location: { lat: 18.4093, lng: 73.5053, address: 'Pune, Maharashtra' }, notes: 'World-class pavement. Fast sweepers.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 5.0, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'lonavala-khandala', name: 'Khandala Ghat', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Maharashtra', surface: 'Asphalt', location: { lat: 18.7509, lng: 73.3897, address: 'Lonavala, Maharashtra' }, notes: 'Classic ghats for longboard runs. Traffic warning.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.CROWDED, privacy: SpotPrivacy.PUBLIC, rating: 4.3, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'mussoorie-road', name: 'Mussoorie Diversion', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.INTERMEDIATE, state: 'Uttarakhand', surface: 'Asphalt', location: { lat: 30.3782, lng: 78.0772, address: 'Dehradun, Uttarakhand' }, notes: 'Flowy runs near Dehradun.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'araku-valley', name: 'Araku Valley Ghats', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Andhra Pradesh', surface: 'Asphalt', location: { lat: 18.3333, lng: 82.8667, address: 'Visakhapatnam, Andhra Pradesh' }, notes: 'Scenic valley roads for downhill.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.7, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'shillong-cherra', name: 'Shillong-Cherrapunji Road', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Meghalaya', surface: 'Asphalt', location: { lat: 25.2755, lng: 91.7326, address: 'Meghalaya' }, notes: 'Misty runs. Watch for wet patches.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.WET, privacy: SpotPrivacy.PUBLIC, rating: 4.8, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] },
  { id: 'munnar-ghat', name: 'Munnar-Devikulam Road', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Kerala', surface: 'Asphalt', location: { lat: 10.0889, lng: 77.0595, address: 'Munnar, Kerala' }, notes: 'Scenic tea garden descent.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.9, images: ['https://images.unsplash.com/photo-1572505543666-4836696db307?w=800'], sessions: [] },
  { id: 'yercaud-ghat', name: 'Yercaud Ghat', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Tamil Nadu', surface: 'Asphalt', location: { lat: 11.7753, lng: 78.2095, address: 'Yercaud, Tamil Nadu' }, notes: 'Smooth descent with loops.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.6, images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], sessions: [] },
  { id: 'malshej-ghat', name: 'Malshej Ghat', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.ADVANCED, state: 'Maharashtra', surface: 'Asphalt', location: { lat: 19.2560, lng: 73.6050, address: 'Maharashtra' }, notes: 'Hairpins & sweepers. Foggy in monsoon.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.DRY, privacy: SpotPrivacy.PUBLIC, rating: 4.5, images: ['https://images.unsplash.com/photo-1534234828563-0259b95f0c43?w=800'], sessions: [] },
  { id: 'agumbe-ghat', name: 'Agumbe Ghat Road', type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL, difficulty: Difficulty.PRO, state: 'Karnataka', surface: 'Asphalt', location: { lat: 13.5019, lng: 75.1606, address: 'Shimoga, Karnataka' }, notes: 'Rainforest descent. Very technical.', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, status: SpotStatus.WET, privacy: SpotPrivacy.PUBLIC, rating: 4.8, images: ['https://images.unsplash.com/photo-1520156584189-1e4529f8c9b3?w=800'], sessions: [] }
];

export const BADGE_DATABASE: Badge[] = [
  { id: 'badge_rookie_push', name: 'First Push', description: 'Began the journey.', tier: BadgeTier.ROOKIE, icon: 'Footprints', conditionDescription: 'Reach Level 2' },
  { id: 'badge_rookie_spotter', name: 'Spotter', description: 'Eyes on the street.', tier: BadgeTier.ROOKIE, icon: 'MapPin', conditionDescription: 'Find or Verify 1 Spot' },
  { id: 'badge_initiate_dedicated', name: 'Dedicated', description: 'Consistency is key.', tier: BadgeTier.INITIATE, icon: 'Zap', conditionDescription: 'Maintain a 3-day streak' },
  { id: 'badge_initiate_local', name: 'The Local', description: 'Part of the furniture.', tier: BadgeTier.INITIATE, icon: 'Home', conditionDescription: 'Complete 10 Sessions' },
  { id: 'badge_skilled_scholar', name: 'Scholar', description: 'Student of the game.', tier: BadgeTier.SKILLED, icon: 'BookOpen', conditionDescription: 'Master 5 Skills' },
  { id: 'badge_skilled_challenger', name: 'Contender', description: 'Stepping up.', tier: BadgeTier.SKILLED, icon: 'Swords', conditionDescription: 'Complete 5 Challenges' },
  { id: 'badge_veteran_guardian', name: 'Guardian', description: 'Protector of the scene.', tier: BadgeTier.VETERAN, icon: 'Shield', conditionDescription: 'Verify 5 Spots & Reach Level 15' },
  { id: 'badge_veteran_mentor', name: 'Sensei', description: 'Passing the torch.', tier: BadgeTier.VETERAN, icon: 'Users', conditionDescription: 'Host a Mentorship Session' },
  { id: 'badge_legend_legacy', name: 'Legacy', description: 'Your name echoes.', tier: BadgeTier.LEGEND, icon: 'Crown', conditionDescription: 'Reach Level 50' }
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'battle-carter-kickflip',
    spotId: 'maharashtra-mumbai-carter',
    spotName: 'Carter Road Skatepark',
    creatorId: 'u-arjun',
    creatorName: 'Arjun S.',
    title: 'Carter Road Kickflip',
    description: 'Kickflip the gap over the planter. Clean landing required.',
    difficulty: Difficulty.INTERMEDIATE,
    xpReward: 300,
    completions: 14
  },
  {
    id: 'battle-nandi-slide',
    spotId: 'nandi-hills',
    spotName: 'Nandi Hills',
    creatorId: 'u-vikram',
    creatorName: 'Vikram D.',
    title: 'Nandi Hairpin Slide',
    description: 'Hold a toeside standie through the big left hairpin.',
    difficulty: Difficulty.ADVANCED,
    xpReward: 500,
    completions: 5
  },
  {
    id: 'battle-holystoked-drop',
    spotId: 'karnataka-blr-holystoked',
    spotName: 'Holystoked Skatepark',
    creatorId: 'u-simran',
    creatorName: 'Simran K.',
    title: 'Holy Drop In',
    description: 'Drop in from the vert wall extension.',
    difficulty: Difficulty.ADVANCED,
    xpReward: 450,
    completions: 8
  }
];

export const MOCK_SESSIONS: ExtendedSession[] = [
  {
    id: 'sess-1',
    userId: 'u-arjun',
    userName: 'Arjun S.',
    title: 'Sunday Morning Shred',
    date: '2025-05-20',
    time: '07:00',
    spotId: 'maharashtra-mumbai-carter',
    spotName: 'Carter Road Skatepark',
    spotType: Discipline.SKATE,
    participants: ['u-arjun']
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm-1',
    userId: 'u-arjun',
    name: 'Arjun S.',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Arjun',
    disciplines: [Discipline.SKATE],
    rate: 800,
    bio: 'Specializing in technical street and ledge work.',
    rating: 4.9,
    reviewCount: 22,
    earnings: 15000,
    studentsTrained: 12,
    badges: [MentorBadge.CERTIFIED, MentorBadge.EXPERT],
    stats: { technical: 95, style: 85, teaching: 90 }
  },
  {
    id: 'm-2',
    userId: 'u-priya',
    name: 'Priya M.',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Priya',
    disciplines: [Discipline.DOWNHILL],
    rate: 1200,
    bio: 'Downhill racer. Learn safe sliding and pack riding.',
    rating: 5.0,
    reviewCount: 15,
    earnings: 12000,
    studentsTrained: 8,
    badges: [MentorBadge.CERTIFIED],
    stats: { technical: 98, style: 90, teaching: 85 }
  }
];

export const MOCK_NOTES: DailyNote[] = [
  {
    id: 'note-1',
    userId: 'u-system',
    date: new Date().toISOString().split('T')[0],
    text: 'Skate conditions in Mumbai are prime today. Humidity is low.',
    timestamp: new Date().toISOString()
  }
];

export const SKILL_LIBRARY: Skill[] = [
  // Tier 1 - Fundamentals
  { id: 'skill_skate_push', name: 'Pushing', category: Discipline.SKATE, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 50, description: 'The foundation of movement.', tutorialUrl: 'rCEN55_z8cQ' },
  { id: 'skill_skate_ollie', name: 'Ollie', category: Discipline.SKATE, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 100, description: 'The jump. Pop the tail and slide your foot.', tutorialUrl: 'arXMwdj7b28' },
  { id: 'skill_skate_manual', name: 'Manual', category: Discipline.SKATE, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 75, description: 'Balance on two wheels.', tutorialUrl: '1QY_9Q8q1Q' },
  
  // Tier 2 - Core Tech
  { id: 'skill_skate_shuvit', name: 'Pop Shuvit', category: Discipline.SKATE, difficulty: Difficulty.INTERMEDIATE, tier: 2, xpReward: 150, description: 'Spin the board 180 degrees.', tutorialUrl: 'Oq9Y_O6k_rQ', prerequisiteId: 'skill_skate_ollie' },
  { id: 'skill_skate_kickflip', name: 'Kickflip', category: Discipline.SKATE, difficulty: Difficulty.INTERMEDIATE, tier: 2, xpReward: 200, description: 'Flick the board to flip it.', tutorialUrl: 'efH8Ztg_A5g', prerequisiteId: 'skill_skate_ollie' },
  
  // Tier 3 - Advanced
  { id: 'skill_skate_treflip', name: 'Tre Flip', category: Discipline.SKATE, difficulty: Difficulty.ADVANCED, tier: 3, xpReward: 300, description: '360 Pop Shuvit + Kickflip.', tutorialUrl: 'X_Q8q1QY_9Q', prerequisiteId: 'skill_skate_kickflip' },

  // Downhill
  { id: 'skill_dh_tuck', name: 'Aerodynamic Tuck', category: Discipline.DOWNHILL, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 50, description: 'Minimize wind resistance.', tutorialUrl: 'Y_Q8q1QY_9Q' },
  { id: 'skill_dh_coleman', name: 'Coleman Slide', category: Discipline.DOWNHILL, difficulty: Difficulty.INTERMEDIATE, tier: 2, xpReward: 150, description: 'Essential safety slide.', tutorialUrl: 'Z_Q8q1QY_9Q', prerequisiteId: 'skill_dh_tuck' },
];

export const COLLECTIBLES_DATABASE: Collectible[] = [
  { id: 'sticker_7_day', name: 'Week Streak Sticker', type: CollectibleType.STICKER, rarity: Rarity.COMMON, imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=7D', description: 'Awarded for a 7-day session streak.' },
  { id: 'deck_camo', name: 'Urban Camo Deck', type: CollectibleType.DECK, rarity: Rarity.RARE, imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Cam', description: 'Stealth mode for night missions.' },
  { id: 'wheel_gold', name: 'Golden Urethane', type: CollectibleType.WHEEL, rarity: Rarity.LEGENDARY, imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Gold', description: 'The fastest urethane in the sector.' },
  { id: 'truck_titanium', name: 'Titanium Hollows', type: CollectibleType.TRUCK, rarity: Rarity.EPIC, imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ti', description: 'Ultra-lightweight trucks.' },
];
