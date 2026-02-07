
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
  { 
    id: 'nandi-hills', 
    name: 'Nandi Hills', 
    type: Discipline.DOWNHILL, 
    category: SpotCategory.DOWNHILL, 
    difficulty: Difficulty.ADVANCED, 
    state: 'Karnataka', 
    surface: 'Asphalt', 
    location: { lat: 13.3702, lng: 77.6835, address: 'Bengaluru, Karnataka' }, 
    notes: 'Famous downhill run. Steep and fast.', 
    isVerified: true, 
    verificationStatus: VerificationStatus.VERIFIED, 
    status: SpotStatus.DRY, 
    privacy: SpotPrivacy.PUBLIC, 
    rating: 4.9, 
    images: ['https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800'], 
    sessions: [],
    path: [
        [13.3702, 77.6835], [13.3712, 77.6845], [13.3725, 77.6855], [13.3740, 77.6860]
    ]
  }
];

export const SKILL_LIBRARY: Skill[] = [
  { id: 'ollie', name: 'Ollie', category: Discipline.SKATE, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 100, description: 'The foundation of street skating. Pop the tail and slide.' },
  { id: 'shuvit', name: 'Shuv-it', category: Discipline.SKATE, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 100, description: 'Spin the board 180 degrees without flipping.' },
  { id: 'kickflip', name: 'Kickflip', category: Discipline.SKATE, difficulty: Difficulty.INTERMEDIATE, tier: 2, xpReward: 200, description: 'Flip the board with your toe.', prerequisiteId: 'ollie', tutorialUrl: 'dQw4w9WgXcQ' },
  { id: 'heelflip', name: 'Heelflip', category: Discipline.SKATE, difficulty: Difficulty.INTERMEDIATE, tier: 2, xpReward: 200, description: 'Flip the board with your heel.', prerequisiteId: 'ollie' },
  { id: 'treflip', name: 'Tre Flip', category: Discipline.SKATE, difficulty: Difficulty.ADVANCED, tier: 3, xpReward: 300, description: '360 Pop Shuvit + Kickflip.', prerequisiteId: 'kickflip' },
  { id: 'slide_standie', name: 'Standup Slide', category: Discipline.DOWNHILL, difficulty: Difficulty.INTERMEDIATE, tier: 2, xpReward: 200, description: 'Slide to check speed while standing.' },
  { id: 'tuck', name: 'Aero Tuck', category: Discipline.DOWNHILL, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 100, description: 'Aerodynamic stance for maximum speed.' },
  { id: 'coleman', name: 'Coleman Slide', category: Discipline.DOWNHILL, difficulty: Difficulty.BEGINNER, tier: 1, xpReward: 150, description: 'Hand-down slide for safety and braking.' },
];

export const BADGE_DATABASE: Badge[] = [
  { id: 'badge_rookie_start', name: 'First Push', description: 'Completed onboarding', tier: BadgeTier.ROOKIE, icon: '🛹', conditionDescription: 'Create account' },
  { id: 'badge_skilled_streak', name: 'Consistent', description: '7 Day Streak', tier: BadgeTier.SKILLED, icon: '🔥', conditionDescription: 'Log in 7 days in a row' },
  { id: 'badge_veteran_guardian', name: 'Guardian', description: 'Verified Spot Contributor', tier: BadgeTier.VETERAN, icon: '🛡️', conditionDescription: 'Verify 5 spots' },
  { id: 'badge_legend_king', name: 'King of the Hill', description: 'Top of Leaderboard', tier: BadgeTier.LEGEND, icon: '👑', conditionDescription: 'Reach #1 Rank' },
];

export const COLLECTIBLES_DATABASE: Collectible[] = [
  { id: 'sticker_7_day', name: 'Retro Logo Sticker', type: CollectibleType.STICKER, rarity: Rarity.COMMON, imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=RL', description: 'Classic sticker' },
  { id: 'deck_gold', name: 'Golden Deck', type: CollectibleType.DECK, rarity: Rarity.LEGENDARY, imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GD', description: 'Shiny gold finish' },
];

export const MOCK_SESSIONS: ExtendedSession[] = [
  { id: 's1', userId: 'u-1', userName: 'Rahul', title: 'Morning Shred', date: '2023-10-27', time: '07:00', spotId: 'delhi-cp-inner', spotName: 'Connaught Place', spotType: Discipline.SKATE, participants: ['u-1', 'u-2'] },
  { id: 's2', userId: 'u-2', userName: 'Priya', title: 'Downhill Practice', date: '2023-10-28', time: '16:00', spotId: 'nandi-hills', spotName: 'Nandi Hills', spotType: Discipline.DOWNHILL, participants: ['u-2'] },
];

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', spotId: 'delhi-cp-inner', spotName: 'Connaught Place', creatorId: 'u-system', creatorName: 'System', title: 'Ollie the 3-Set', description: 'Clean ollie down the main stairs.', difficulty: Difficulty.INTERMEDIATE, xpReward: 300, completions: 12 },
  { id: 'c2', spotId: 'nandi-hills', spotName: 'Nandi Hills', creatorId: 'u-system', creatorName: 'System', title: 'Sub-2 Minute Run', description: 'Complete the course in under 2 mins.', difficulty: Difficulty.PRO, xpReward: 1000, completions: 3 },
];

export const MOCK_MENTORS: Mentor[] = [
  { id: 'm1', userId: 'u-mentor-1', name: 'Arjun K.', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Arjun', disciplines: [Discipline.SKATE], rate: 500, bio: 'Pro street skater with 10 years experience.', rating: 4.9, reviewCount: 42, earnings: 15000, studentsTrained: 25, badges: [MentorBadge.CERTIFIED, MentorBadge.EXPERT] },
  { id: 'm2', userId: 'u-mentor-2', name: 'Sarah J.', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Sarah', disciplines: [Discipline.DOWNHILL], rate: 800, bio: 'Downhill racer and safety instructor.', rating: 5.0, reviewCount: 15, earnings: 8000, studentsTrained: 10, badges: [MentorBadge.CERTIFIED] },
];

export const MOCK_NOTES: DailyNote[] = [
  { id: 'n1', userId: 'u-1', date: '2023-10-25', text: 'Landed my first kickflip today! Felt amazing.', timestamp: '2023-10-25T10:00:00Z' },
  { id: 'n2', userId: 'u-1', date: '2023-10-26', text: 'Rainy day, watched tutorials instead.', timestamp: '2023-10-26T14:30:00Z' },
];
