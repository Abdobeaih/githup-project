require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Company = require('../models/Company')
const Admin = require('../models/Admin')
const Discount = require('../models/Discount')
const CompanyBranch = require('../models/CompanyBranch')
const DiscountBranch = require('../models/DiscountBranch')
const Review = require('../models/Review')
const SocialReview = require('../models/SocialReview')
const Notification = require('../models/Notification')
const Card = require('../models/Card')
const Installment = require('../models/Installment')
const UserScan = require('../models/UserScan')
const Governorate = require('../models/Governorate')
const MedicalCenter = require('../models/MedicalCenter')
const Bank = require('../models/Bank')
const Restaurant = require('../models/Restaurant')
const EntertainmentVenue = require('../models/EntertainmentVenue')
const SubscriptionPlan = require('../models/SubscriptionPlan')
const Feature = require('../models/Feature')
const PlanFeature = require('../models/PlanFeature')
const UserSubscription = require('../models/UserSubscription')
const Payment = require('../models/Payment')
const Enrollment = require('../models/Enrollment')

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const collections = mongoose.connection.collections
    for (const key in collections) {
      await collections[key].deleteMany({})
    }
    console.log('Cleared all collections')

    const users = await User.create([
      { name: 'أحمد محمد', email: 'ahmed@test.com', phone: '01012345678', nationalId: '29801011234567', job: 'مهندس برمجيات', password: 'Test1234', plan: 'elite', governorate: 'القاهرة', scans: 15, saved: 3200, points: 450, role: 'USER', isActive: true },
      { name: 'سارة علي', email: 'sara@test.com', phone: '01123456789', nationalId: '29902021234567', job: 'مصممة جرافيك', password: 'Test1234', plan: 'premium', governorate: 'الإسكندرية', scans: 8, saved: 1800, points: 220, role: 'USER', isActive: true },
      { name: 'خالد عمر', email: 'khalid@test.com', phone: '01234567890', nationalId: '29703031234567', job: 'محاسب', password: 'Test1234', plan: 'free', governorate: 'الجيزة', scans: 3, saved: 450, points: 80, role: 'USER', isActive: true },
      { name: 'Abdelrahman Beaih', email: 'abdelraan.free@example.com', phone: '01011854511', nationalId: '29909911234567', job: 'Front-End Engineer', password: 'Test1234', plan: 'free', governorate: 'Cairo', scans: 0, saved: 0, points: 0, role: 'USER', isActive: true },
    ])
    console.log(`Seeded ${users.length} users`)

    const companies = await Company.create([
      { name: 'صيدلية الشفاء', email: 'shifa@mustakleen.com', password: 'Company123', category: 'medical', city: 'القاهرة', governorate: 'القاهرة', emoji: '💊', status: 'approved', approved_at: new Date('2025-01-15'), views: 1200, uses: 340, commission: 8, plan: 'premium', description: 'صيدلية متكاملة تقدم خصم ٢٠٪ على جميع الأدوية', phone: '0223456710', website: 'https://shifa-pharma.com' },
      { name: 'جيم البطل', email: 'batal@mustakleen.com', password: 'Company123', category: 'gym', city: 'الإسكندرية', governorate: 'الإسكندرية', emoji: '💪', status: 'approved', approved_at: new Date('2025-02-10'), views: 890, uses: 210, commission: 12, plan: 'premium', description: 'أحدث الأجهزة الرياضية ومدربين معتمدين', phone: '0223456711', website: 'https://batal-gym.com' },
      { name: 'مطعم الذواق', email: 'zawaq@mustakleen.com', password: 'Company123', category: 'food', city: 'الجيزة', governorate: 'الجيزة', emoji: '🍽️', status: 'approved', approved_at: new Date('2025-03-05'), views: 2100, uses: 670, commission: 10, plan: 'elite', description: 'أشهى المأكولات الشرقية والغربية', phone: '0345678920', website: 'https://zawaq-rest.com' },
      { name: 'نادي السعادة', email: 'saada@mustakleen.com', password: 'Company123', category: 'fun', city: 'القاهرة', governorate: 'القاهرة', emoji: '🎪', status: 'pending', views: 0, uses: 0, commission: 15, plan: 'free', description: 'نادي ترفيهي متكامل للعائلة', phone: '0234567830', website: '' },
      { name: 'مستشفى النيل', email: 'nile@mustakleen.com', password: 'Company123', category: 'medical', city: 'القاهرة', governorate: 'القاهرة', emoji: '🏥', status: 'approved', approved_at: new Date('2025-01-20'), views: 3400, uses: 1200, commission: 5, plan: 'elite', description: 'أكبر مستشفى خاص في القاهرة', phone: '0223456700', website: 'https://nile-hospital.com' },
    ])
    console.log(`Seeded ${companies.length} companies`)

    const branches = await CompanyBranch.create([
      { company_id: companies[0]._id, name: 'الفرع الرئيسي - القاهرة', address: 'شارع النيل', city: 'القاهرة', phone: '0223456710', working_hours: '8ص - 10م' },
      { company_id: companies[0]._id, name: 'فرع المهندسين', address: 'شارع جامعة الدول', city: 'الجيزة', phone: '0234567890', working_hours: '9ص - 9م' },
      { company_id: companies[1]._id, name: 'فرع الإسكندرية', address: 'شارع البحر', city: 'الإسكندرية', phone: '0345678901', working_hours: '6ص - 11م' },
      { company_id: companies[2]._id, name: 'فرع الجيزة', address: 'شارع الهرم', city: 'الجيزة', phone: '0234567890', working_hours: '12م - 12ص' },
    ])
    console.log(`Seeded ${branches.length} branches`)

    const admin = await Admin.create({ name: 'مدير النظام', email: 'freelancer360.dev@gmail.com', password: 'Abdo$2782', role: 'SUPER_ADMIN' })
    console.log('Seeded admin')

    const govNames = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية', 'المنوفية', 'الغربية', 'كفر الشيخ', 'البحيرة', 'دمياط', 'بورسعيد', 'السويس', 'الأقصر', 'أسوان']
    await Governorate.create(govNames.map(name => ({ name })))
    console.log(`Seeded ${govNames.length} governorates`)

    const medicalCenters = await MedicalCenter.create([
      { name: 'مركز القاهرة الطبي', governorate: 'القاهرة', address: 'شارع النيل', phone: '0223456789', rating: 4.5, img_url: '/images/medical/cairo-medical.jpg', description: 'مركز طبي متكامل', services_offered: ['كشف عام', 'أشعة', 'تحاليل'], pricing: [{ service: 'كشف عام', memberPrice: 50, nonMemberPrice: 150 }, { service: 'أشعة مقطعية', memberPrice: 300, nonMemberPrice: 800 }], reviews: [{ userName: 'أحمد', rating: 5, comment: 'خدمة ممتازة', date: new Date('2025-01-15') }] },
      { name: 'مركز الإسكندرية الطبي', governorate: 'الإسكندرية', address: 'شارع البحر', phone: '0223567890', rating: 4.2, img_url: '/images/medical/alex-medical.jpg', description: 'مركز طبي متخصص', services_offered: ['جلدية', 'تجميل', 'علاج طبيعي'], pricing: [{ service: 'جلدية', memberPrice: 80, nonMemberPrice: 200 }, { service: 'علاج طبيعي', memberPrice: 60, nonMemberPrice: 150 }], reviews: [] },
      { name: 'مركز الجيزة الطبي', governorate: 'الجيزة', address: 'شارع الهرم', phone: '0345678901', rating: 4.0, img_url: '/images/medical/giza-medical.jpg', description: 'مركز طبي شامل', services_offered: ['أسنان', 'عيون', 'قلب'], pricing: [{ service: 'أسنان', memberPrice: 100, nonMemberPrice: 300 }, { service: 'عيون', memberPrice: 120, nonMemberPrice: 250 }], reviews: [{ userName: 'سارة', rating: 4, comment: 'جيد جداً', date: new Date('2025-02-20') }] },
      { name: 'مركز الدلتا الطبي', governorate: 'الدقهلية', address: 'شارع الجمهورية', phone: '0345689012', rating: 3.8, img_url: '/images/medical/delta-medical.jpg', description: 'مركز طبي', services_offered: ['باطنة', 'أطفال', 'نساء'], pricing: [{ service: 'باطنة', memberPrice: 40, nonMemberPrice: 100 }, { service: 'أطفال', memberPrice: 50, nonMemberPrice: 120 }], reviews: [] },
      { name: 'مركز الشرقية الطبي', governorate: 'الشرقية', address: 'شارع النصر', phone: '0234567890', rating: 4.1, img_url: '/images/medical/sharkia-medical.jpg', description: 'مركز طبي متميز', services_offered: ['عظام', 'مخ وأعصاب', 'أنف وأذن'], pricing: [{ service: 'عظام', memberPrice: 70, nonMemberPrice: 180 }, { service: 'أنف وأذن', memberPrice: 90, nonMemberPrice: 200 }], reviews: [] },
      { name: 'مركز القليوبية الطبي', governorate: 'القليوبية', address: 'شارع بنها', phone: '0973456789', rating: 3.5, img_url: '/images/medical/qalyubia-medical.jpg', description: 'مركز طبي', services_offered: ['كشف عام', 'أطفال', 'نساء'], pricing: [{ service: 'كشف عام', memberPrice: 30, nonMemberPrice: 80 }, { service: 'نساء', memberPrice: 60, nonMemberPrice: 150 }], reviews: [] },
      { name: 'مركز طيبة الطبي', governorate: 'الأقصر', address: 'شارع الكرنك', phone: '0503456789', rating: 4.3, img_url: '/images/medical/teba-medical.jpg', description: 'مركز طبي سياحي', services_offered: ['كشف عام', 'علاج طبيعي', 'جلدية'], pricing: [{ service: 'كشف عام', memberPrice: 40, nonMemberPrice: 100 }, { service: 'جلدية', memberPrice: 80, nonMemberPrice: 180 }], reviews: [] },
    ])
    console.log(`Seeded ${medicalCenters.length} medical centers`)

    const banks = await Bank.create([
      { name: 'البنك الأهلي المصري', governorate: 'القاهرة', address: 'شارع قصر النيل', phone: '19623', rating: 4.3, img_url: '/images/banks/nbe.jpg', description: 'أكبر بنك حكومي في مصر', services_offered: ['حساب جاري', 'بطاقات ائتمان', 'قروض شخصية'], pricing: [{ service: 'فتح حساب', memberPrice: 0, nonMemberPrice: 500 }, { service: 'بطاقة ائتمان', memberPrice: 100, nonMemberPrice: 300 }], reviews: [{ userName: 'أحمد', rating: 4, comment: 'خدمة جيدة', date: new Date('2025-01-10') }] },
      { name: 'بنك مصر', governorate: 'القاهرة', address: 'شارع محمد فريد', phone: '19888', rating: 4.1, img_url: '/images/banks/misr.jpg', description: 'بنك حكومي عريق', services_offered: ['حساب جاري', 'شهادات ادخار', 'قروض'], pricing: [{ service: 'فتح حساب', memberPrice: 0, nonMemberPrice: 300 }, { service: 'شهادة ادخار', memberPrice: 1000, nonMemberPrice: 1000 }], reviews: [] },
      { name: 'بنك القاهرة', governorate: 'القاهرة', address: 'شارع طلعت حرب', phone: '19666', rating: 3.9, img_url: '/images/banks/cairo.jpg', description: 'بنك حكومي', services_offered: ['حساب جاري', 'بطاقات', 'قروض'], pricing: [{ service: 'فتح حساب', memberPrice: 0, nonMemberPrice: 200 }, { service: 'قرض شخصي', memberPrice: 0, nonMemberPrice: 0 }], reviews: [] },
      { name: 'البنك التجاري الدولي CIB', governorate: 'القاهرة', address: 'شارع رمسيس', phone: '19033', rating: 4.5, img_url: '/images/banks/cib.jpg', description: 'أكبر بنك خاص في مصر', services_offered: ['حساب جاري', 'بطاقات', 'قروض', 'استثمار'], pricing: [{ service: 'فتح حساب', memberPrice: 0, nonMemberPrice: 1000 }, { service: 'بطاقة ائتمان', memberPrice: 200, nonMemberPrice: 500 }], reviews: [{ userName: 'محمد', rating: 5, comment: 'ممتاز', date: new Date('2025-03-01') }] },
      { name: 'بنك HSBC مصر', governorate: 'القاهرة', address: 'شارع التحرير', phone: '19199', rating: 4.0, img_url: '/images/banks/hsbc.jpg', description: 'بنك دولي', services_offered: ['حساب جاري', 'بطاقات عالمية', 'تحويلات'], pricing: [{ service: 'فتح حساب', memberPrice: 0, nonMemberPrice: 1500 }, { service: 'تحويل دولي', memberPrice: 50, nonMemberPrice: 150 }], reviews: [] },
      { name: 'بنك الإسكندرية', governorate: 'الإسكندرية', address: 'شارع سعد زغلول', phone: '19634', rating: 3.7, img_url: '/images/banks/alex.jpg', description: 'بنك حكومي', services_offered: ['حساب جاري', 'بطاقات', 'قروض'], pricing: [{ service: 'فتح حساب', memberPrice: 0, nonMemberPrice: 300 }, { service: 'قرض', memberPrice: 0, nonMemberPrice: 0 }], reviews: [] },
    ])
    console.log(`Seeded ${banks.length} banks`)

    await Restaurant.create([
      { name: 'مطعم الذواق', governorate: 'الجيزة', address: 'شارع الهرم', phone: '0234567890', rating: 4.5, img_url: '/images/restaurants/zawaq.jpg', description: 'أشهى المأكولات الشرقية', cuisine: 'شرقي', discount_percent: '15', city: 'الجيزة' },
      { name: 'بيتزا روما', governorate: 'القاهرة', address: 'شارع النيل', phone: '0223456789', rating: 4.2, img_url: '/images/restaurants/roma.jpg', description: 'بيتزا إيطالية أصلية', cuisine: 'إيطالي', discount_percent: '10', city: 'القاهرة' },
      { name: 'سوشي تايم', governorate: 'الإسكندرية', address: 'شارع البحر', phone: '0345678901', rating: 4.0, img_url: '/images/restaurants/sushi.jpg', description: 'سوشي ياباني طازج', cuisine: 'ياباني', discount_percent: '20', city: 'الإسكندرية' },
      { name: 'برجر هاوس', governorate: 'القاهرة', address: 'شارع رمسيس', phone: '0223567890', rating: 4.3, img_url: '/images/restaurants/burger.jpg', description: 'برجر أمريكي', cuisine: 'أمريكي', discount_percent: '12', city: 'القاهرة' },
      { name: 'مطعم السمكة', governorate: 'الإسكندرية', address: 'كورنيش البحر', phone: '0345689012', rating: 4.6, img_url: '/images/restaurants/samaka.jpg', description: 'أكلات بحرية طازجة', cuisine: 'بحري', discount_percent: '10', city: 'الإسكندرية' },
      { name: 'كنتاكي مصر', governorate: 'القاهرة', address: 'شارع جامعة الدول', phone: '19000', rating: 3.8, img_url: '/images/restaurants/kfc.jpg', description: 'دجاج مقلي', cuisine: 'أمريكي', discount_percent: '5', city: 'القاهرة' },
      { name: 'مطعم الباشا', governorate: 'الجيزة', address: 'شارع فيصل', phone: '0234567812', rating: 4.1, img_url: '/images/restaurants/pasha.jpg', description: 'مأكولات شرقية فاخرة', cuisine: 'شرقي', discount_percent: '15', city: 'الجيزة' },
      { name: 'ماكدونالدز', governorate: 'القاهرة', address: 'شارع التحرير', phone: '19991', rating: 3.5, img_url: '/images/restaurants/mcd.jpg', description: 'وجبات سريعة', cuisine: 'أمريكي', discount_percent: '0', city: 'القاهرة' },
      { name: 'مطعم الهند', governorate: 'القاهرة', address: 'شارع النصر', phone: '0223678901', rating: 4.4, img_url: '/images/restaurants/india.jpg', description: 'مأكولات هندية أصلية', cuisine: 'هندي', discount_percent: '10', city: 'القاهرة' },
      { name: 'كرم الشام', governorate: 'دمياط', address: 'شارع النيل', phone: '0573456789', rating: 4.2, img_url: '/images/restaurants/sham.jpg', description: 'مأكولات شامية', cuisine: 'شامي', discount_percent: '15', city: 'دمياط' },
    ])
    console.log('Seeded 10 restaurants')

    await EntertainmentVenue.create([
      { name: 'نادي السعادة الرياضي', governorate: 'القاهرة', address: 'شارع النيل', phone: '0234567890', rating: 4.5, img_url: '/images/entertainment/saada.jpg', description: 'نادي رياضي اجتماعي', category: 'gym', discount_percent: '20', city: 'القاهرة' },
      { name: 'سينما الإسكندرية', governorate: 'الإسكندرية', address: 'شارع البحر', phone: '0345678901', rating: 4.0, img_url: '/images/entertainment/cinema.jpg', description: 'أحدث الأفلام', category: 'cinema', discount_percent: '15', city: 'الإسكندرية' },
      { name: 'سيتي ستارز', governorate: 'القاهرة', address: 'شارع رمسيس', phone: '0223456789', rating: 4.3, img_url: '/images/entertainment/citystars.jpg', description: 'أكبر مول في القاهرة', category: 'mall', discount_percent: '10', city: 'القاهرة' },
      { name: 'مول العرب', governorate: 'الجيزة', address: 'شارع الهرم', phone: '0234567888', rating: 4.1, img_url: '/images/entertainment/arab-mall.jpg', description: 'مول تجاري ضخم', category: 'mall', discount_percent: '10', city: 'الجيزة' },
      { name: 'حديقة الحيوان', governorate: 'الجيزة', address: 'شارع جامعة القاهرة', phone: '0234567777', rating: 3.8, img_url: '/images/entertainment/zoo.jpg', description: 'أكبر حديقة حيوان في مصر', category: 'park', discount_percent: '25', city: 'الجيزة' },
      { name: 'دريم بارك', governorate: 'القاهرة', address: 'شارع السادات', phone: '0223456666', rating: 4.2, img_url: '/images/entertainment/dream-park.jpg', description: 'مدينة ملاهي كبرى', category: 'fun', discount_percent: '15', city: 'القاهرة' },
      { name: 'نادي الجزيرة', governorate: 'القاهرة', address: 'الزمالك', phone: '0223455555', rating: 4.6, img_url: '/images/entertainment/gezira.jpg', description: 'نادي رياضي واجتماعي', category: 'gym', discount_percent: '10', city: 'القاهرة' },
      { name: 'بانوراما الأقصر', governorate: 'الأقصر', address: 'شارع الكرنك', phone: '0503456789', rating: 4.7, img_url: '/images/entertainment/luxor.jpg', description: 'رحلة نيلية بانورامية', category: 'trip', discount_percent: '20', city: 'الأقصر' },
      { name: 'جيم فيتنس تايم', governorate: 'الإسكندرية', address: 'شارع سموحة', phone: '0345677777', rating: 4.0, img_url: '/images/entertainment/fitness.jpg', description: 'جيم حديث بأجهزة متطورة', category: 'gym', discount_percent: '15', city: 'الإسكندرية' },
      { name: 'سينما فوكس', governorate: 'الجيزة', address: 'شارع الهرم', phone: '0234569999', rating: 3.9, img_url: '/images/entertainment/fox-cinema.jpg', description: 'سينما عصرية', category: 'cinema', discount_percent: '10', city: 'الجيزة' },
      { name: 'مول الواحة', governorate: 'السويس', address: 'شارع السلام', phone: '0623456789', rating: 3.7, img_url: '/images/entertainment/waha-mall.jpg', description: 'مول تجاري', category: 'mall', discount_percent: '5', city: 'السويس' },
      { name: 'جولف بورسعيد', governorate: 'بورسعيد', address: 'شارع النصر', phone: '0663456789', rating: 4.4, img_url: '/images/entertainment/port-said-golf.jpg', description: 'ملعب جولف عالمي', category: 'fun', discount_percent: '20', city: 'بورسعيد' },
    ])
    console.log('Seeded 12 entertainment venues')

    const discounts = await Discount.create([
      { name: 'خصم أدوية الشفاء', category: 'medical', discount_percent: '20', discount_type: 'INSURANCE_FORM', promo_code: null, description: 'احصل على خصم ٢٠٪ على جميع الأدوية في صيدلية الشفاء', city: 'القاهرة', governorate: 'القاهرة', tier_required: 'free', company_id: companies[0]._id, uses: 120, views: 800, status: 'approved', approved_at: new Date('2025-01-20'), image_url: '', terms_conditions: '', max_usage_per_user: 10, start_date: new Date('2025-06-01'), end_date: new Date('2027-06-01') },
      { name: 'خصم اشتراك الجيم', category: 'gym', discount_percent: '25', discount_type: 'PROMO_CODE', promo_code: 'BATAL25', description: 'خصم ٢٥٪ على اشتراك جيم البطل', city: 'الإسكندرية', governorate: 'الإسكندرية', tier_required: 'premium', company_id: companies[1]._id, uses: 85, views: 650, status: 'approved', approved_at: new Date('2025-02-15'), image_url: '', terms_conditions: '', max_usage_per_user: 3, start_date: new Date('2025-07-01'), end_date: new Date('2027-07-01') },
      { name: 'خصم مطعم الذواق', category: 'food', discount_percent: '15', discount_type: 'EXTERNAL_LINK', promo_code: null, description: 'استمتع بخصم ١٥٪ في مطعم الذواق', city: 'الجيزة', governorate: 'الجيزة', tier_required: 'free', company_id: companies[2]._id, uses: 200, views: 1500, status: 'approved', approved_at: new Date('2025-03-10'), image_url: '', terms_conditions: '', max_usage_per_user: 5, start_date: new Date('2025-08-10'), end_date: new Date('2027-08-10') },
      { name: 'كشف طبي مجاني', category: 'medical', discount_percent: '100', discount_type: 'INSURANCE_FORM', promo_code: null, description: 'كشف طبي مجاني في مستشفى النيل', city: 'القاهرة', governorate: 'القاهرة', tier_required: 'elite', company_id: companies[4]._id, uses: 55, views: 900, status: 'approved', approved_at: new Date('2025-01-25'), image_url: '', terms_conditions: 'الحجز المسبق مطلوب', max_usage_per_user: 2, start_date: new Date('2025-06-15'), end_date: new Date('2027-06-15') },
      { name: 'خصم تحاليل طبية', category: 'medical', discount_percent: '30', discount_type: 'PROMO_CODE', promo_code: 'NILE30', description: 'خصم ٣٠٪ على التحاليل في مستشفى النيل', city: 'القاهرة', governorate: 'القاهرة', tier_required: 'premium', company_id: companies[4]._id, uses: 42, views: 450, status: 'approved', approved_at: new Date('2025-02-01'), image_url: '', terms_conditions: '', max_usage_per_user: 5, start_date: new Date('2025-07-01'), end_date: new Date('2027-07-01') },
      { name: 'خصم السعادة الترفيهي', category: 'fun', discount_percent: '10', discount_type: 'PROMO_CODE', promo_code: 'SAADA10', description: 'خصم ١٠٪ في نادي السعادة', city: 'القاهرة', governorate: 'القاهرة', tier_required: 'free', company_id: companies[3]._id, uses: 0, views: 200, status: 'pending', image_url: '', terms_conditions: '', max_usage_per_user: 3, start_date: new Date('2026-04-01'), end_date: new Date('2026-10-01') },
      { name: 'وجبة مجانية', category: 'food', discount_percent: '100', discount_type: 'EXTERNAL_LINK', promo_code: null, description: 'وجبة مجانية عند شراء وجبتين', city: 'الجيزة', governorate: 'الجيزة', tier_required: 'elite', company_id: companies[2]._id, uses: 30, views: 350, status: 'approved', approved_at: new Date('2025-03-15'), image_url: '', terms_conditions: '', max_usage_per_user: 1, start_date: new Date('2025-09-01'), end_date: new Date('2027-09-01') },
    ])
    console.log(`Seeded ${discounts.length} discounts`)

    if (branches.length > 0 && discounts.length > 0) {
      await DiscountBranch.create([
        { discount_id: discounts[0]._id, branch_id: branches[0]._id },
        { discount_id: discounts[0]._id, branch_id: branches[1]._id },
        { discount_id: discounts[1]._id, branch_id: branches[2]._id },
        { discount_id: discounts[2]._id, branch_id: branches[3]._id },
        { discount_id: discounts[3]._id, branch_id: branches[0]._id },
      ])
      console.log('Seeded discount-branch links')
    }

    await Review.create([
      { discount_id: discounts[0]._id, user_id: users[0]._id, rating: 5, comment: 'خصم رائع جداً' },
      { discount_id: discounts[1]._id, user_id: users[1]._id, rating: 4, comment: 'جيد ولكن الكود محدود' },
      { discount_id: discounts[2]._id, user_id: users[2]._id, rating: 5, comment: 'أكل لذيذ وسعر مناسب بعد الخصم' },
    ])
    console.log('Seeded 3 reviews')

    await Notification.create([
      { user_id: users[0]._id, title: 'مرحباً بك', body: 'شكراً لانضمامك إلى مستقلين', type: 'INFO' },
      { user_id: users[0]._id, title: 'تم تفعيل الاشتراك', body: 'تم تفعيل اشتراكك في باقة النخبة', type: 'SUCCESS' },
      { user_id: users[1]._id, title: 'خصم جديد', body: 'تم إضافة خصم جديد في جيم البطل', type: 'INFO' },
      { user_id: users[2]._id, title: 'تنبيه: باقتك على وشك الانتهاء', body: 'باقتك المجانية ستنتهي قريباً', type: 'WARNING' },
    ])
    console.log('Seeded 4 notifications')

    await Card.create({ user_id: users[0]._id, card_holder_name: 'Ahmed Mohamed', card_number: '4532****8821', expiry: '12/27', brand: 'visa', is_default: true })
    console.log('Seeded 1 card')

    await Installment.create([
      { user_id: users[0]._id, name: 'قسط التأمين الطبي', total: 5000, paid: 1500, monthly_amount: 500, next_due: new Date('2025-06-01'), status: 'active' },
      { user_id: users[1]._id, name: 'قسط الدورات التعليمية', total: 3000, paid: 2000, monthly_amount: 300, next_due: new Date('2025-05-01'), status: 'active' },
      { user_id: users[2]._id, name: 'قسط التأمين المالي', total: 2000, paid: 2000, monthly_amount: 400, next_due: new Date('2025-04-01'), status: 'completed' },
    ])
    console.log('Seeded 3 installments')

    const plans = await SubscriptionPlan.create([
      { name: 'free', nameAr: 'مجاني', description: 'Basic plan with limited features', descriptionAr: 'باقة مجانية بمميزات محدودة', price: 0, durationDays: 30, features: ['discount_access', 'single_discount'], maxCompanies: 0, maxDiscounts: 5, maxScans: 30, priority: 1 },
      { name: 'premium', nameAr: 'مميز', description: 'Premium plan with extra features', descriptionAr: 'باقة مميزة بمميزات إضافية', price: 99, durationDays: 30, features: ['discount_access', 'unlimited_discounts', 'priority_support', 'usage_reports'], maxCompanies: 3, maxDiscounts: 20, maxScans: 200, priority: 2 },
      { name: 'elite', nameAr: 'النخبة', description: 'Elite plan with all features', descriptionAr: 'باقة النخبة بجميع المميزات', price: 199, durationDays: 30, features: ['discount_access', 'unlimited_discounts', 'priority_support', 'usage_reports', 'notifications', 'account_manager', 'advanced_reports', 'api_access', 'no_ads'], maxCompanies: 10, maxDiscounts: 100, maxScans: 1000, priority: 3 },
    ])
    console.log(`Seeded ${plans.length} plans`)

    const features = await Feature.create([
      { name: 'الوصول للخصومات', key: 'discount_access' },
      { name: 'خصم واحد شهرياً', key: 'single_discount' },
      { name: 'وصول أساسي', key: 'basic_access' },
      { name: 'خصومات غير محدودة', key: 'unlimited_discounts' },
      { name: 'دعم أولوية', key: 'priority_support' },
      { name: 'تقارير الاستخدام', key: 'usage_reports' },
      { name: 'إشعارات فورية', key: 'notifications' },
      { name: 'مدير حساب', key: 'account_manager' },
      { name: 'تقارير متقدمة', key: 'advanced_reports' },
      { name: 'API', key: 'api_access' },
      { name: 'بدون إعلانات', key: 'no_ads' },
    ])
    console.log(`Seeded ${features.length} features`)

    const planFeatureMap = {
      free: ['discount_access', 'single_discount', 'basic_access'],
      premium: ['discount_access', 'unlimited_discounts', 'priority_support', 'usage_reports', 'notifications'],
      elite: ['discount_access', 'unlimited_discounts', 'priority_support', 'usage_reports', 'notifications', 'account_manager', 'advanced_reports', 'api_access', 'no_ads'],
    }

    const featureByKey = {}
    for (const f of features) featureByKey[f.key] = f._id

    const planFeatureData = []
    for (const plan of plans) {
      const keys = planFeatureMap[plan.name]
      if (keys) {
        for (const key of keys) {
          if (featureByKey[key]) {
            planFeatureData.push({ plan_id: plan._id, feature_id: featureByKey[key] })
          }
        }
      }
    }
    await PlanFeature.create(planFeatureData)
    console.log(`Seeded ${planFeatureData.length} plan-feature links`)

    const now = new Date()
    const future = new Date(now); future.setDate(future.getDate() + 30)
    await UserSubscription.create([
      { userId: users[0]._id, planId: plans[2]._id, status: 'ACTIVE', startDate: now, endDate: future, autoRenew: true, paymentMethod: 'VISA', price: 199 },
      { userId: users[1]._id, planId: plans[1]._id, status: 'ACTIVE', startDate: now, endDate: future, autoRenew: false, paymentMethod: 'FAWRY', price: 99 },
    ])
    console.log('Seeded 2 user subscriptions')

    await Payment.create([
      { user_id: users[0]._id, amount: 199, payment_method: 'VISA', status: 'SUCCESS', paid_at: new Date(), notes: 'Elite plan - monthly' },
      { user_id: users[1]._id, amount: 99, payment_method: 'FAWRY', status: 'SUCCESS', paid_at: new Date(), notes: 'Premium plan' },
      { user_id: users[0]._id, amount: 500, payment_method: 'VISA', status: 'SUCCESS', paid_at: new Date(Date.now() - 86400000 * 7), notes: 'Installment payment' },
      { user_id: users[2]._id, amount: 50, payment_method: 'CASH', status: 'PENDING', paid_at: new Date(), notes: 'Pending payment' },
      { user_id: users[1]._id, amount: 300, payment_method: 'VODAFONE_CASH', status: 'FAILED', paid_at: new Date(Date.now() - 86400000 * 3), notes: 'Failed transaction' },
    ])
    console.log('Seeded 5 payments')

    await Enrollment.create([
      { user_id: users[0]._id, service_type: 'combined', center_id: medicalCenters[0]._id, bank_id: banks[0]._id, status: 'active', subscription_confirmed: true, subscription_name: 'أحمد محمد', subscription_dob: '1990-01-01', subscription_phone: '01012345678', subscription_data_use_agree: true, subscription_terms_agree: true, subscription_confirmed_at: new Date() },
      { user_id: users[1]._id, service_type: 'medical', center_id: medicalCenters[1]._id, bank_id: null, status: 'active', subscription_confirmed: false },
    ])
    console.log('Seeded 2 enrollments')

    await UserScan.create([
      { user_id: users[0]._id, discount_id: discounts[0]._id, company_name: 'صيدلية الشفاء', type: 'discount', scanned_at: new Date(Date.now() - 86400000 * 2), details: { products: [{ name: 'دواء ضغط', price: 100, discount: 20 }, { name: 'فيتامينات', price: 150, discount: 30 }] } },
      { user_id: users[0]._id, discount_id: discounts[2]._id, company_name: 'مطعم الذواق', type: 'discount', scanned_at: new Date(Date.now() - 86400000 * 5), details: { products: [{ name: 'وجبة كاملة', price: 200, discount: 30 }] } },
      { user_id: users[0]._id, discount_id: discounts[1]._id, company_name: 'جيم البطل', type: 'discount', scanned_at: new Date(Date.now() - 86400000 * 10), details: { products: [{ name: 'اشتراك شهري', price: 500, discount: 125 }] } },
      { user_id: users[1]._id, discount_id: discounts[1]._id, company_name: 'جيم البطل', type: 'discount', scanned_at: new Date(Date.now() - 86400000 * 3), details: { products: [{ name: 'اشتراك شهري', price: 500, discount: 125 }] } },
      { user_id: users[2]._id, discount_id: discounts[2]._id, company_name: 'مطعم الذواق', type: 'discount', scanned_at: new Date(Date.now() - 86400000 * 7), details: { products: [{ name: 'وجبة', price: 150, discount: 22.5 }] } },
    ])
    console.log('Seeded 5 user scans')

    console.log('\n✅ Seed completed successfully!')
    console.log('   Users: ahmed@test.com / Test1234 (elite)')
    console.log('   Users: sara@test.com / Test1234 (premium)')
    console.log('   Users: khalid@test.com / Test1234 (free)')
    console.log('   Users: abdelraan.free@example.com / Test1234 (free)')
    console.log('   Admin: freelancer360.dev@gmail.com / Abdo$2782')
    console.log('   Companies: shifa@mustakleen.com / Company123')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()
