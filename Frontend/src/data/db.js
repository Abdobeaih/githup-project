/**
 * Core data layer — localStorage-backed store matching the ERD.
 * Entities: USERS, COMPANIES, DISCOUNTS, CARDS, INSTALLMENTS, ADMIN
 * Relationships:
 *   USERS   ──→ DISCOUNTS   (scans / usage tracking)
 *   USERS   ──→ CARDS       (has one)
 *   USERS   ──→ INSTALLMENTS (has many)
 *   COMPANIES ──→ DISCOUNTS  (submits)
 */

const STORAGE_KEY = 'mustakleen_db'
const DB_VERSION = 2 // increment when seed schema changes

// ── helpers ────────────────────────────────────────────────
function rand(from, to) { return Math.floor(Math.random() * (to - from + 1)) + from }

function newUserId() {
  const year = new Date().getFullYear()
  const seq = String(rand(1, 9999)).padStart(4, '0')
  return `FL-${year}-${seq}`
}

function newCompanyId() {
  return `CO-${Date.now()}-${rand(100, 999)}`
}

function newInstallmentId() {
  return `IN-${Date.now()}-${rand(1000, 9999)}`
}

function newBranchId() {
  return `BR-${Date.now()}-${rand(100, 999)}`
}

function today() {
  return new Date().toISOString()
}

function futureDate(monthsAhead) {
  const d = new Date()
  d.setMonth(d.getMonth() + monthsAhead)
  return d.toISOString()
}

// ── default seed data ──────────────────────────────────────
function seedData() {
  return {
     users: [
      {
        id: 'FL-2026-0001',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '01012345678',
        nationalId: '29801151234567',
        job: 'تطوير الويب',
        password: '123456',
        plan: 'elite',
        governorate: 'القاهرة',
        scans: 24,
        saved: 1850.50,
        join_date: '2025-06-15T08:00:00.000Z',
        points: 320,
      },
      {
        id: 'FL-2026-0002',
        name: 'سارة علي',
        email: 'sara@example.com',
        phone: '01123456789',
        nationalId: '30002201234568',
        job: 'التصميم الجرافيكي',
        password: '123456',
        plan: 'premium',
        governorate: 'الإسكندرية',
        scans: 12,
        saved: 720.00,
        join_date: '2025-09-01T10:30:00.000Z',
        points: 180,
      },
      {
        id: 'FL-2026-0003',
        name: 'خالد عمر',
        email: 'khalid@example.com',
        phone: '01234567890',
        nationalId: '30205101234569',
        job: 'التسويق الرقمي',
        password: '123456',
        plan: 'free',
        governorate: 'الجيزة',
        scans: 3,
        saved: 120.00,
        join_date: '2026-01-10T14:00:00.000Z',
        points: 45,
      },
    ],
    companies: [
      {
        id: 'CO-1715000000-101',
        name: 'صيدلية الشفاء',
        email: 'info@shifa.com',
        password: '123456',
        category: 'medical',
        city: 'القاهرة',
        emoji: '💊',
        status: 'approved',
        approved_at: '2025-01-20T11:00:00.000Z',
        join_date: '2025-01-15T09:00:00.000Z',
        views: 1540,
        uses: 320,
        commission: 15.5,
        plan: 'premium',
      },
      {
        id: 'CO-1715100000-202',
        name: 'جيم البطل',
        email: 'info@albatal.com',
        password: '123456',
        category: 'gym',
        city: 'الإسكندرية',
        emoji: '💪',
        status: 'approved',
        join_date: '2025-03-20T11:00:00.000Z',
        views: 2800,
        uses: 650,
        commission: 10.0,
      },
      {
        id: 'CO-1715200000-303',
        name: 'مطعم الذواق',
        email: 'info@alzawaq.com',
        password: '123456',
        category: 'food',
        city: 'الجيزة',
        emoji: '🍽️',
        status: 'approved',
        join_date: '2025-05-10T13:00:00.000Z',
        views: 4200,
        uses: 1100,
        commission: 8.0,
        plan: 'premium',
      },
      {
        id: 'CO-1715300000-404',
        name: 'نادي السعادة',
        email: 'info@alsaada.com',
        password: '123456',
        category: 'fun',
        city: 'القاهرة',
        emoji: '🎪',
        status: 'pending',
        join_date: '2026-04-01T08:00:00.000Z',
        views: 0,
        uses: 0,
        commission: 12.0,
      },
      {
        id: 'CO-1715400000-505',
        name: 'مستشفى النيل',
        email: 'info@alnile.com',
        password: '123456',
        category: 'medical',
        city: 'أسوان',
        emoji: '🏥',
        status: 'approved',
        join_date: '2025-02-01T10:00:00.000Z',
        approved_at: '2025-02-03T11:00:00.000Z',
        views: 890,
        uses: 210,
        commission: 18.0,
      },
    ],
    // ── company_branches ────────────────────────────────────
    company_branches: [
      {
        id: 'BR-1715000100-101',
        company_id: 'CO-1715000000-101',
        name: 'فرع وسط البلد',
        address: 'شارع طلعت حرب، وسط البلد',
        city: 'القاهرة',
        phone: '0223456710',
        working_hours: '٩:٠٠ ص - ١٠:٠٠ م',
      },
      {
        id: 'BR-1715000100-102',
        company_id: 'CO-1715000000-101',
        name: 'فرع المعادي',
        address: 'شارع ٢٥٠، المعادي',
        city: 'القاهرة',
        phone: '0223456711',
        working_hours: '٩:٠٠ ص - ١١:٠٠ م',
      },
      {
        id: 'BR-1715100200-201',
        company_id: 'CO-1715100000-202',
        name: 'الفرع الرئيسي',
        address: 'طريق الجيش، سيدي بشر',
        city: 'الإسكندرية',
        phone: '0345678920',
        working_hours: '٨:٠٠ ص - ١١:٠٠ م',
      },
      {
        id: 'BR-1715200300-301',
        company_id: 'CO-1715200000-303',
        name: 'فرع المهندسين',
        address: 'شارع لبنان، المهندسين',
        city: 'الجيزة',
        phone: '0234567830',
        working_hours: '١٢:٠٠ م - ١٢:٠٠ ص',
      },
    ],
    discounts: [
      {
        id: 1,
        name: 'خصم 30% على جميع الأدوية',
        category: 'medical',
        discount_percent: '30%',
        discount_type: 'INSURANCE_FORM',
        promo_code: null,
        start_date: '2025-06-01T09:00:00.000Z',
        end_date: '2026-06-01T09:00:00.000Z',
        tier_required: 'premium',
        description: 'خصم خاص على جميع الأدوية والمستلزمات الطبية في صيدلية الشفاء',
        city: 'القاهرة',
        tier: 'premium',
        company_id: 'CO-1715000000-101',
        uses: 120,
        views: 540,
        status: 'approved',
        created_at: '2025-06-01T09:00:00.000Z',
        company_name: 'صيدلية الشفاء',
      },
      {
        id: 2,
        name: 'كشف مجاني + خصم 40% تحاليل',
        category: 'medical',
        discount_percent: '40%',
        discount_type: 'INSURANCE_FORM',
        promo_code: null,
        start_date: '2025-06-15T10:00:00.000Z',
        end_date: '2026-06-15T10:00:00.000Z',
        tier_required: 'free',
        description: 'كشف طبي مجاني وخصم 40% على التحاليل والأشعة',
        city: 'أسوان',
        tier: 'free',
        company_id: 'CO-1715400000-505',
        uses: 80,
        views: 320,
        status: 'approved',
        created_at: '2025-06-15T10:00:00.000Z',
        company_name: 'مستشفى النيل',
      },
      {
        id: 3,
        name: 'عضوية شهرية بخصم 40%',
        category: 'gym',
        discount_percent: '40%',
        discount_type: 'PROMO_CODE',
        promo_code: 'MSTK-GYM40',
        start_date: '2025-07-01T11:00:00.000Z',
        end_date: '2026-07-01T11:00:00.000Z',
        tier_required: 'elite',
        description: 'اشتراك شهري في جيم البطل بخصم 40% لأعضاء مستقلين',
        city: 'الإسكندرية',
        tier: 'elite',
        company_id: 'CO-1715100000-202',
        uses: 250,
        views: 980,
        status: 'approved',
        created_at: '2025-07-01T11:00:00.000Z',
        company_name: 'جيم البطل',
      },
      {
        id: 4,
        name: 'وجبة كاملة بسعر مخفض',
        category: 'food',
        discount_percent: '25%',
        discount_type: 'PROMO_CODE',
        promo_code: 'MSTK-FOOD25',
        start_date: '2025-08-10T13:00:00.000Z',
        end_date: '2026-08-10T13:00:00.000Z',
        tier_required: 'premium',
        description: 'خصم 25% على الوجبات الكاملة في مطعم الذواق',
        city: 'الجيزة',
        tier: 'premium',
        company_id: 'CO-1715200000-303',
        uses: 450,
        views: 1800,
        status: 'approved',
        created_at: '2025-08-10T13:00:00.000Z',
        company_name: 'مطعم الذواق',
      },
      {
        id: 5,
        name: 'جلسة تدريب شخصي مجانية',
        category: 'gym',
        discount_percent: '100%',
        discount_type: 'EXTERNAL_LINK',
        promo_code: null,
        start_date: '2025-09-01T12:00:00.000Z',
        end_date: '2026-09-01T12:00:00.000Z',
        tier_required: 'elite',
        description: 'جلسة تدريب شخصي مجانية مع مدرب معتمد عند الاشتراك الشهري',
        city: 'الإسكندرية',
        tier: 'elite',
        company_id: 'CO-1715100000-202',
        uses: 180,
        views: 760,
        status: 'approved',
        created_at: '2025-09-01T12:00:00.000Z',
        company_name: 'جيم البطل',
      },
      {
        id: 6,
        name: 'عرض العشاء الرومانسي',
        category: 'food',
        discount_percent: '20%',
        discount_type: 'PROMO_CODE',
        promo_code: 'MSTK-DIN20',
        start_date: '2025-10-05T14:00:00.000Z',
        end_date: '2026-10-05T14:00:00.000Z',
        tier_required: 'free',
        description: 'خصم 20% على وجبات العشاء الرومانسية في مطعم الذواق',
        city: 'الجيزة',
        tier: 'free',
        company_id: 'CO-1715200000-303',
        uses: 320,
        views: 1400,
        status: 'approved',
        created_at: '2025-10-05T14:00:00.000Z',
        company_name: 'مطعم الذواق',
      },
      {
        id: 7,
        name: 'تذكرة سينما نصف السعر',
        category: 'fun',
        discount_percent: '50%',
        discount_type: 'EXTERNAL_LINK',
        promo_code: null,
        start_date: '2026-04-01T08:00:00.000Z',
        end_date: '2026-10-01T08:00:00.000Z',
        tier_required: 'premium',
        description: 'خصم 50% على تذاكر السينما في نادي السعادة الترفيهي',
        city: 'القاهرة',
        tier: 'premium',
        company_id: 'CO-1715300000-404',
        uses: 0,
        views: 0,
        status: 'pending',
        created_at: '2026-04-01T08:00:00.000Z',
        company_name: 'نادي السعادة',
      },
    ],

    // ── discount_branches ──────────────────────────────────
    discount_branches: [
      { discount_id: 1, branch_id: 'BR-1715000100-101' },
      { discount_id: 1, branch_id: 'BR-1715000100-102' },
      { discount_id: 3, branch_id: 'BR-1715100200-201' },
      { discount_id: 4, branch_id: 'BR-1715200300-301' },
      { discount_id: 6, branch_id: 'BR-1715200300-301' },
    ],

    // ── reviews (discount reviews by users) ────────────────
    reviews: [
      {
        id: 1,
        discount_id: 1,
        user_id: 'FL-2026-0001',
        rating: 5,
        comment: 'خصم ممتاز، استفدت كتير من الأدوية. سعر مناسب جداً.',
        created_at: '2026-03-12T10:00:00.000Z',
      },
      {
        id: 2,
        discount_id: 3,
        user_id: 'FL-2026-0001',
        rating: 4,
        comment: 'الجيم ممتاز والخصم حقيقي. بس الازدحام في بعض الأوقات.',
        created_at: '2026-03-20T14:30:00.000Z',
      },
      {
        id: 3,
        discount_id: 4,
        user_id: 'FL-2026-0002',
        rating: 5,
        comment: 'الوجبة كانت لذيذة جداً والخصم وفر كتير. أنصح الكل يجرب.',
        created_at: '2026-04-05T19:00:00.000Z',
      },
    ],

    // ── social reviews (generic target_type/target_id) ──────
    social_reviews: [],

    // ── notifications (aligned with ERD) ──────────────────────
    notifications: [
      { id: `NOTIF-${Date.now()}-1`, user_id: 'FL-2026-0001', title: 'مرحباً بك في مستكلين!', body: 'نتمنى لك تجربة ممتعة مع خصوماتنا الحصرية', type: 'INFO', link: '/dashboard/discounts', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: `NOTIF-${Date.now()}-2`, user_id: 'FL-2026-0001', title: 'تم تفعيل اشتراكك', body: 'تم تفعيل الباقة المميزة بنجاح، استمتع بالمزايا الحصرية', type: 'SUCCESS', link: '/subscriptions/my', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: `NOTIF-${Date.now()}-3`, user_id: 'FL-2026-0001', title: 'خصم جديد متاح', body: 'تم إضافة خصم جديد بنسبة 30% في مطاعم القاهرة', type: 'INFO', link: '/discounts/1', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
      { id: `NOTIF-${Date.now()}-4`, user_id: 'FL-2026-0001', title: 'توشك صلاحية اشتراكك على الانتهاء', body: 'اشتراكك سينتهي بعد 3 أيام، جدد الآن لتستمر في الاستفادة', type: 'WARNING', link: '/subscriptions/my', is_read: false, created_at: new Date(Date.now() - 172800000).toISOString() },
    ],

    cards: [
      {
        user_id: 'FL-2026-0001',
        card_holder_name: 'أحمد محمد',
        card_number: '4532 **** **** 8821',
        expiry: '12/28',
      },
    ],
    installments: [
      {
        id: 'IN-1700000000-1001',
        user_id: 'FL-2026-0001',
        name: 'قسط التأمين الطبي الشامل',
        total: 5990.00,
        paid: 2995.00,
        monthly_amount: 499.17,
        next_due: '2026-06-15T00:00:00.000Z',
      },
      {
        id: 'IN-1700000000-1002',
        user_id: 'FL-2026-0001',
        name: 'قسط الكورسات التعليمية',
        total: 2990.00,
        paid: 1495.00,
        monthly_amount: 249.17,
        next_due: '2026-06-01T00:00:00.000Z',
      },
      {
        id: 'IN-1700000000-2001',
        user_id: 'FL-2026-0002',
        name: 'قسط التأمين المالي',
        total: 4490.00,
        paid: 1490.00,
        monthly_amount: 374.17,
        next_due: '2026-05-20T00:00:00.000Z',
      },
    ],
    admins: [
      {
        id: 'ADMIN-001',
        name: 'مشرف النظام',
        email: 'freelancer360.dev@gmail.com',
        password: 'Abdo$2782',
        role: 'SUPER_ADMIN',
        isActive: true,
        join_date: '2025-01-01T00:00:00.000Z',
      },
    ],
    // Track which discounts each user has scanned (many-to-many via USERS scans)
    // Each scan now includes invoice/pricing details for the detailed view
    user_scans: [
      { user_id: 'FL-2026-0001', discount_id: 1, scanned_at: '2026-03-10T14:30:00.000Z', invoice_id: 'INV-2026-00001', product: 'أدوية ضغط وسكر', original_price: 450, discount_percent: '30%', discount_value: 135, final_price: 315 },
      { user_id: 'FL-2026-0001', discount_id: 3, scanned_at: '2026-03-15T10:00:00.000Z', invoice_id: 'INV-2026-00002', product: 'اشتراك شهري جيم', original_price: 800, discount_percent: '40%', discount_value: 320, final_price: 480 },
      { user_id: 'FL-2026-0001', discount_id: 4, scanned_at: '2026-04-01T19:45:00.000Z', invoice_id: 'INV-2026-00003', product: 'وجبة عائلة كاملة', original_price: 600, discount_percent: '25%', discount_value: 150, final_price: 450 },
      { user_id: 'FL-2026-0002', discount_id: 2, scanned_at: '2026-02-20T11:00:00.000Z', invoice_id: 'INV-2026-00004', product: 'تحاليل شاملة', original_price: 1200, discount_percent: '40%', discount_value: 480, final_price: 720 },
      { user_id: 'FL-2026-0002', discount_id: 6, scanned_at: '2026-03-05T20:15:00.000Z', invoice_id: 'INV-2026-00005', product: 'عشاء رومانسي', original_price: 350, discount_percent: '20%', discount_value: 70, final_price: 280 },
    ],

    // ── governorates ──────────────────────────────────────
    governorates: [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'أسوان', 'الأقصر',
      'المنصورة', 'طنطا', 'المنيا', 'بورسعيد', 'السويس',
      'الإسماعيلية', 'دمنهور', 'بني سويف', 'الفيوم', 'سوهاج',
    ],

    // ── medical_centers ────────────────────────────────────
    medical_centers: [
      {
        id: 'MC-001',
        name: 'مستشفى النيل التخصصي',
        governorate: 'القاهرة',
        address: 'شارع النيل، وسط البلد، القاهرة',
        phone: '0223456789',
        rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop',
        description: 'مركز طبي متكامل يضم أحدث الأجهزة التشخيصية وأكبر فريق من الاستشاريين في جميع التخصصات.',
        services_offered: ['كشف عام', 'تحاليل', 'أشعة', 'عمليات جراحية', 'أسنان', 'جلدية'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 100 },
          { service: 'تحاليل شاملة', memberPrice: 80, nonMemberPrice: 250 },
          { service: 'أشعة عادية', memberPrice: 60, nonMemberPrice: 180 },
          { service: 'أشعة مقطعية', memberPrice: 200, nonMemberPrice: 600 },
          { service: 'جلسة أسنان', memberPrice: 40, nonMemberPrice: 150 },
          { service: 'كشف جلدية', memberPrice: 0, nonMemberPrice: 120 },
        ],
        reviews: [
          { id: 1, userName: 'سارة أحمد', rating: 5, comment: 'تعامل راقي جداً وفريق طبي ممتاز. أنصح بالتعامل معهم.', date: '2026-03-15' },
          { id: 2, userName: 'خالد محمود', rating: 4, comment: 'خدمة ممتازة وسرعة في الكشف. الأجهزة حديثة.', date: '2026-02-20' },
          { id: 3, userName: 'نورا حسن', rating: 5, comment: 'الاشتراك مع مستقلين وفر عليا كتير في جلسات الأسنان.', date: '2026-01-10' },
        ],
      },
      {
        id: 'MC-002',
        name: 'مركز القاهرة الطبي',
        governorate: 'القاهرة',
        address: 'شارع الهرم، المعادي، القاهرة',
        phone: '0223567890',
        rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1587351021759-3772687fe598?w=400&auto=format&fit=crop',
        description: 'مركز طبي شامل مع عيادات تخصصية وخدمات علاج طبيعي متطورة.',
        services_offered: ['كشف عام', 'علاج طبيعي', 'أشعة', 'تحاليل', 'قلب'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 90 },
          { service: 'جلسة علاج طبيعي', memberPrice: 35, nonMemberPrice: 120 },
          { service: 'رسم قلب', memberPrice: 50, nonMemberPrice: 200 },
          { service: 'تحاليل قلب', memberPrice: 120, nonMemberPrice: 350 },
          { service: 'أشعة تلفزيونية', memberPrice: 70, nonMemberPrice: 220 },
        ],
        reviews: [
          { id: 4, userName: 'أسماء علي', rating: 5, comment: 'قسم العلاج الطبيعي ممتاز جداً. خففت الآلام بسرعة.', date: '2026-03-01' },
          { id: 5, userName: 'محمد عبدالله', rating: 4, comment: 'مرتب ونظيف ودكاترة شاطرين. بس المواعيد تحتاج تنظيم.', date: '2026-02-15' },
        ],
      },
      {
        id: 'MC-003',
        name: 'مستشفى السلام الدولي',
        governorate: 'الإسكندرية',
        address: 'طريق الكورنيش، سيدي بشر، الإسكندرية',
        phone: '0345678901',
        rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&auto=format&fit=crop',
        description: 'أحد أكبر المستشفيات في الإسكندرية يضم ٢٠٠ سرير وأحدث غرف العمليات المجهزة.',
        services_offered: ['كشف عام', 'عمليات جراحية', 'أطفال', 'نساء وتوليد', 'عظام', 'أشعة'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 110 },
          { service: 'كشف أطفال', memberPrice: 0, nonMemberPrice: 100 },
          { service: 'كشف نساء وتوليد', memberPrice: 0, nonMemberPrice: 130 },
          { service: 'أشعة عادية', memberPrice: 50, nonMemberPrice: 170 },
          { service: 'جبس عظام', memberPrice: 80, nonMemberPrice: 250 },
        ],
        reviews: [
          { id: 6, userName: 'إيمان رضا', rating: 5, comment: 'أكبر مستشفى في الإسكندرية بجد. قسم الولادة على أعلى مستوى.', date: '2026-04-01' },
          { id: 7, userName: 'أحمد كريم', rating: 5, comment: 'تمت عمليتي في المستشفى والحمد لله كانت ناجحة. فريق متميز.', date: '2026-03-10' },
          { id: 8, userName: 'دينا شريف', rating: 4, comment: 'خدمة جيدة وأسعار مناسبة مع الاشتراك. أنصح بالعيادات الخارجية.', date: '2026-02-25' },
        ],
      },
      {
        id: 'MC-004',
        name: 'مركز الإسكندرية التشخيصي',
        governorate: 'الإسكندرية',
        address: 'شارع ٤٥، محطة الرمل، الإسكندرية',
        phone: '0345689012',
        rating: 4.1,
        img_url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&auto=format&fit=crop',
        description: 'مركز تشخيصي متطور يقدم خدمات الفحص الشامل والتحاليل المتقدمة.',
        services_offered: ['تحاليل شاملة', 'أشعة مقطعية', 'رنين مغناطيسي', 'كشف عام'],
        pricing: [
          { service: 'تحاليل شاملة', memberPrice: 150, nonMemberPrice: 400 },
          { service: 'أشعة مقطعية', memberPrice: 250, nonMemberPrice: 700 },
          { service: 'رنين مغناطيسي', memberPrice: 400, nonMemberPrice: 1200 },
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 80 },
        ],
        reviews: [
          { id: 9, userName: 'مصطفى إبراهيم', rating: 4, comment: 'مركز تشخيص متطور جداً. النتائج دقيقة وسريعة.', date: '2026-03-20' },
          { id: 10, userName: 'هند سامي', rating: 5, comment: 'جهاز الرنين المغناطيسي جديد جداً. التجربة كانت مريحة.', date: '2026-02-05' },
        ],
      },
      {
        id: 'MC-005',
        name: 'مستشفى الجيزة التخصصي',
        governorate: 'الجيزة',
        address: 'شارع فيصل، الجيزة',
        phone: '0234567890',
        rating: 4.4,
        img_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&auto=format&fit=crop',
        description: 'مستشفى حكومي متطور يخدم محافظة الجيزة بكوادر طبية متميزة.',
        services_offered: ['كشف عام', 'طوارئ 24 ساعة', 'عظام', 'أطفال', 'نساء وتوليد'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 70 },
          { service: 'طوارئ', memberPrice: 0, nonMemberPrice: 150 },
          { service: 'كشف عظام', memberPrice: 0, nonMemberPrice: 90 },
          { service: 'جبس عظام', memberPrice: 60, nonMemberPrice: 200 },
          { service: 'كشف أطفال', memberPrice: 0, nonMemberPrice: 80 },
        ],
        reviews: [
          { id: 11, userName: 'وليد فتحي', rating: 4, comment: 'مستشفى حكومي متطور. الطوارئ ممتازة وسريعة.', date: '2026-04-05' },
          { id: 12, userName: 'منى جمال', rating: 5, comment: 'الخدمة أفضل من أي مستشفى حكومي تاني. أنصح بالعيادات.', date: '2026-03-12' },
          { id: 13, userName: 'سامح عادل', rating: 4, comment: 'أسعار مناسبة جداً مع الاشتراك في مستقلين.', date: '2026-01-30' },
        ],
      },
      {
        id: 'MC-006',
        name: 'مركز أسوان الطبي',
        governorate: 'أسوان',
        address: 'شارع المطار، أسوان',
        phone: '0973456789',
        rating: 4.2,
        img_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop',
        description: 'المركز الطبي الرائد في صعيد مصر يقدم خدمات علاجية متكاملة.',
        services_offered: ['كشف عام', 'تحاليل', 'أشعة', 'عمليات', 'أسنان'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 60 },
          { service: 'تحاليل', memberPrice: 40, nonMemberPrice: 120 },
          { service: 'أشعة عادية', memberPrice: 45, nonMemberPrice: 140 },
          { service: 'خلع أسنان', memberPrice: 30, nonMemberPrice: 100 },
          { service: 'عمليات صغرى', memberPrice: 150, nonMemberPrice: 400 },
        ],
        reviews: [
          { id: 14, userName: 'رحمة صبري', rating: 5, comment: 'أفضل مركز طبي في أسوان. الدكاترة محترمين جدا.', date: '2026-03-25' },
          { id: 15, userName: 'عمر هاني', rating: 4, comment: 'خدمة ممتازة للمشتركين في مستقلين. أسعار رمزية.', date: '2026-02-18' },
        ],
      },
      {
        id: 'MC-007',
        name: 'مستشفى المنصورة الجامعي',
        governorate: 'المنصورة',
        address: 'شارع الجمهورية، المنصورة',
        phone: '0503456789',
        rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop',
        description: 'مستشفى جامعي مجهز بأحدث التقنيات الطبية وأساتذة من كلية الطب.',
        services_offered: ['كشف عام', 'عمليات متقدمة', 'أورام', 'قلب', 'أطفال', 'تحاليل'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 90 },
          { service: 'كشف أورام', memberPrice: 100, nonMemberPrice: 300 },
          { service: 'كشف قلب', memberPrice: 80, nonMemberPrice: 250 },
          { service: 'تحاليل شاملة', memberPrice: 100, nonMemberPrice: 300 },
          { service: 'متابعة أطفال', memberPrice: 0, nonMemberPrice: 80 },
        ],
        reviews: [
          { id: 16, userName: 'د. ياسر عبدالرحمن', rating: 5, comment: 'مستشفى جامعي بمستوى عالمي. الكوادر التدريسية على أعلى مستوى.', date: '2026-04-10' },
          { id: 17, userName: 'منى الشريف', rating: 5, comment: 'قسم الأورام ممتاز. المتابعة مستمرة والدعم النفسي رائع.', date: '2026-03-05' },
          { id: 18, userName: 'هشام بركات', rating: 4, comment: 'خدمة متميزة مقارنة بالمستشفيات الجامعية التانية.', date: '2026-02-10' },
        ],
      },
    ],

    // ── banks ──────────────────────────────────────────────
    banks: [
      {
        id: 'BNK-001',
        name: 'البنك الأهلي المصري',
        governorate: 'القاهرة',
        address: 'شارع قصر النيل، وسط البلد، القاهرة',
        phone: '19623',
        rating: 4.3,
        img_url: '/bank-El-Ahly.jpg',
        description: 'أكبر بنك حكومي في مصر يقدم خدمات تأمين مالي وحماية دخل متكاملة.',
        services_offered: ['تأمين على الدخل', 'حساب توفير', 'بطاقات ائتمان', 'قروض شخصية'],
        pricing: [
          { service: 'تأمين على الدخل', memberPrice: 25, nonMemberPrice: 75 },
          { service: 'حساب توفير', memberPrice: 0, nonMemberPrice: 10 },
          { service: 'بطاقة ائتمان كلاسيك', memberPrice: 0, nonMemberPrice: 50 },
          { service: 'قرض شخصي (رسوم إدارية)', memberPrice: 100, nonMemberPrice: 400 },
        ],
        reviews: [
          { id: 19, userName: 'محمود سامي', rating: 5, comment: 'أفضل بنك حكومي. خدمة العملاء ممتازة وفروع في كل مكان.', date: '2026-04-05' },
          { id: 20, userName: 'ليلى عبدالرحمن', rating: 4, comment: 'التأمين على الدخل مع مستقلين خيار ممتاز للفريلانسر.', date: '2026-03-15' },
          { id: 21, userName: 'كريم ناصر', rating: 4, comment: 'بطاقات الائتمان بفوائد مناسبة. خدمة رقمية جيدة.', date: '2026-02-20' },
        ],
      },
      {
        id: 'BNK-002',
        name: 'بنك مصر',
        governorate: 'القاهرة',
        address: 'شارع محمد فريد، وسط البلد، القاهرة',
        phone: '19888',
        rating: 4.4,
        img_url: '/Bank-masr.jpg',
        description: 'بنك عريق يقدم حلول تأمين مالي مبتكرة للفريلانسر وأصحاب الأعمال الحرة.',
        services_offered: ['تأمين مالي', 'استثمار', 'بطاقات', 'تمويل شخصي'],
        pricing: [
          { service: 'تأمين مالي شامل', memberPrice: 30, nonMemberPrice: 90 },
          { service: 'صندوق استثمار', memberPrice: 0, nonMemberPrice: 200 },
          { service: 'بطاقة ائتمان ذهبية', memberPrice: 0, nonMemberPrice: 100 },
          { service: 'تمويل شخصي (رسوم)', memberPrice: 80, nonMemberPrice: 350 },
        ],
        reviews: [
          { id: 22, userName: 'هاني الشافعي', rating: 5, comment: 'بنك عريق وله تاريخ. الخدمات التأمينية مناسبة جداً.', date: '2026-04-01' },
          { id: 23, userName: 'دعاء عاطف', rating: 4, comment: 'حساب التوفير ممتاز والفائدة منافسة. الخدمة الرقمية جيدة.', date: '2026-03-10' },
        ],
      },
      {
        id: 'BNK-003',
        name: 'البنك التجاري الدولي CIB',
        governorate: 'الإسكندرية',
        address: 'شارع سعد زغلول، محطة الرمل، الإسكندرية',
        phone: '19666',
        rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&auto=format&fit=crop',
        description: 'أفضل بنك خاص في مصر يقدم خدمات مصرفية وتأمينية متطورة بمعايير عالمية.',
        services_offered: ['تأمين على الحياة', 'حماية دخل', 'بطاقات ذهبية', 'خدمات رقمية'],
        pricing: [
          { service: 'تأمين على الحياة', memberPrice: 40, nonMemberPrice: 120 },
          { service: 'حماية دخل', memberPrice: 35, nonMemberPrice: 100 },
          { service: 'بطاقة ذهبية', memberPrice: 0, nonMemberPrice: 200 },
          { service: 'خدمات رقمية', memberPrice: 0, nonMemberPrice: 25 },
        ],
        reviews: [
          { id: 24, userName: 'شادي نبيل', rating: 5, comment: 'أفضل بنك خاص في مصر. التطبيق ممتاز والخدمة راقية.', date: '2026-04-08' },
          { id: 25, userName: 'يارا محسن', rating: 5, comment: 'البطاقة الذهبية مع مستقلين فتحت لي عالم من المزايا.', date: '2026-03-20' },
          { id: 26, userName: 'أيمن جلال', rating: 4, comment: 'خدمة حماية الدخل ممتازة للفريلانسر - أنصح بها بشدة.', date: '2026-02-15' },
        ],
      },
      {
        id: 'BNK-004',
        name: 'بنك الإسكندرية',
        governorate: 'الإسكندرية',
        address: 'شارع ١٤ مايو، محطة الرمل، الإسكندرية',
        phone: '19033',
        rating: 4.1,
        img_url: '/bank-alx.jpg',
        description: 'بنك رائد في تقديم خدمات التأمين المالي للأفراد والشركات الصغيرة.',
        services_offered: ['تأمين مالي', 'حسابات جارية', 'تمويل مشروعات'],
        pricing: [
          { service: 'تأمين مالي', memberPrice: 20, nonMemberPrice: 65 },
          { service: 'حساب جاري', memberPrice: 0, nonMemberPrice: 15 },
          { service: 'تمويل مشروعات صغيرة (رسوم)', memberPrice: 150, nonMemberPrice: 500 },
        ],
        reviews: [
          { id: 27, userName: 'نادية حسين', rating: 4, comment: 'بنك ممتاز لتمويل المشروعات الصغيرة. أسعار مناسبة.', date: '2026-03-25' },
          { id: 28, userName: 'عمرو عبدالمجيد', rating: 4, comment: 'خدمة التأمين المالي معقولة وفروع في كل مكان.', date: '2026-02-28' },
        ],
      },
      {
        id: 'BNK-005',
        name: 'بنك القاهرة',
        governorate: 'الجيزة',
        address: 'شارع الهرم، المهندسين، الجيزة',
        phone: '19199',
        rating: 4.0,
        img_url: '/bank-cairo.jpg',
        description: 'بنك حكومي يقدم خدمات مصرفية شاملة وتأمين مالي بأسعار تنافسية.',
        services_offered: ['تأمين دخل', 'حساب توفير', 'قروض شخصية'],
        pricing: [
          { service: 'تأمين دخل', memberPrice: 25, nonMemberPrice: 70 },
          { service: 'حساب توفير', memberPrice: 0, nonMemberPrice: 5 },
          { service: 'قرض شخصي (رسوم)', memberPrice: 80, nonMemberPrice: 300 },
        ],
        reviews: [
          { id: 29, userName: 'إيهاب منصور', rating: 4, comment: 'بنك حكومي جيد والأسعار تنافسية. خدمة العملاء محترمة.', date: '2026-04-02' },
          { id: 30, userName: 'سلمى عادل', rating: 3, comment: 'خدمة مقبولة. التطبيق الإلكتروني يحتاج تطوير.', date: '2026-03-15' },
        ],
      },
      {
        id: 'BNK-006',
        name: 'بنك التعمير والإسكان',
        governorate: 'أسوان',
        address: 'شارع السادات، أسوان',
        phone: '19634',
        rating: 4.2,
        img_url: '/bank-iskan.jpg',
        description: 'بنك حكومي يخدم محافظات الصعيد بحلول تمويلية وتأمينية متكاملة.',
        services_offered: ['تأمين مالي', 'تمويل عقاري', 'حسابات توفير'],
        pricing: [
          { service: 'تأمين مالي', memberPrice: 20, nonMemberPrice: 60 },
          { service: 'تمويل عقاري (رسوم)', memberPrice: 200, nonMemberPrice: 700 },
          { service: 'حساب توفير', memberPrice: 0, nonMemberPrice: 5 },
        ],
        reviews: [
          { id: 31, userName: 'محمد صبري', rating: 5, comment: 'أفضل بنك حكومي في الصعيد. خدمة متميزة وأسعار مناسبة.', date: '2026-03-30' },
          { id: 32, userName: 'حسناء علي', rating: 4, comment: 'التمويل العقاري بأسعار مغرية. الاشتراك مع مستقلين وفر كتير.', date: '2026-02-10' },
        ],
      },
    ],

    // ── restaurants ──────────────────────────────────
    restaurants: [
      {
        id: 'RST-001',
        name: 'مطعم الذواق',
        governorate: 'الجيزة',
        cuisine: 'مأكولات شرقية',
        discount_percent: '25%',
        rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop',
        description: 'مطعم شرقي يقدم أشهى المأكولات العربية والمصرية مع خصم خاص لأعضاء مستقلين.',
      },
      {
        id: 'RST-002',
        name: 'كافيه الروضة',
        governorate: 'القاهرة',
        cuisine: 'مشروبات وحلويات',
        discount_percent: '20%',
        rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop',
        description: 'كافيه هادئ بأجواء راقية في وسط القاهرة، مثالي للقاءات العمل والاسترخاء.',
      },
      {
        id: 'RST-003',
        name: 'بيتزا نابولي',
        governorate: 'الإسكندرية',
        cuisine: 'بيتزا ومكرونة',
        discount_percent: '30%',
        rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop',
        description: 'أفضل بيتزا على الطريقة الإيطالية في الإسكندرية، عجينة طازجة ومكونات عالية الجودة.',
      },
      {
        id: 'RST-004',
        name: 'مطعم كشري أبو طارق',
        governorate: 'القاهرة',
        cuisine: 'مأكولات مصرية',
        discount_percent: '15%',
        rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop',
        description: 'أشهر مطعم كشري في مصر بطعم أصلي ووصفة سرية منذ أكثر من ٥٠ عاماً.',
      },
      {
        id: 'RST-005',
        name: 'سوشي يامي',
        governorate: 'القاهرة',
        cuisine: 'سوشي وياباني',
        discount_percent: '20%',
        rating: 4.4,
        img_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop',
        description: 'مطعم ياباني متخصص بالسوشي والمأكولات البحرية الطازجة بأجواء عصرية.',
      },
      {
        id: 'RST-006',
        name: 'كافيه بون',
        governorate: 'المنصورة',
        cuisine: 'مشروبات ساخنة',
        discount_percent: '25%',
        rating: 4.2,
        img_url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&auto=format&fit=crop',
        description: 'كافيه عصري يقدم تشكيلة واسعة من المشروبات الساخنة والباردة والحلويات اللذيذة.',
      },
      {
        id: 'RST-007',
        name: 'مطعم السمكة',
        governorate: 'الإسكندرية',
        cuisine: 'مأكولات بحرية',
        discount_percent: '20%',
        rating: 4.8,
        img_url: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop',
        description: 'أفضل مطعم مأكولات بحرية في الإسكندرية، أطباق طازجة يومياً من البحر مباشرة.',
      },
      {
        id: 'RST-008',
        name: 'مطعم الشاورما الملكي',
        governorate: 'الجيزة',
        cuisine: 'سندويتشات ووجبات سريعة',
        discount_percent: '20%',
        rating: 4.1,
        img_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&auto=format&fit=crop',
        description: 'أشهى شاورما لحم وفراخ في الجيزة بوصفات خاصة وخلطات توابل مميزة.',
      },
      {
        id: 'RST-009',
        name: 'كافيه لافاندير',
        governorate: 'القاهرة',
        cuisine: 'حلويات ومشروبات',
        discount_percent: '15%',
        rating: 4.0,
        img_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop',
        description: 'كافيه أنيق بتصميم عصري وديكور لافندر مميز، مناسب للتصوير وجلسات العمل.',
      },
      {
        id: 'RST-010',
        name: 'مطعم ميدوزا',
        governorate: 'القاهرة',
        cuisine: 'مأكولات عالمية',
        discount_percent: '30%',
        rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop',
        description: 'مطعم عالمي يقدم بوفيه مفتوح يومي مع أطباق من مختلف المطابخ العالمية.',
      },
    ],

    // ── entertainment_venues ────────────────────────────────
    entertainmentVenues: [
      {
        id: 'ENT-001', name: 'جيم جولدز الميراج', category: 'gym', governorate: 'القاهرة',
        discount_percent: '40%', rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop',
        description: 'أكبر صالة جيم في القاهرة تضم أحدث الأجهزة الرياضية ومدربين معتمدين.',
      },
      {
        id: 'ENT-002', name: 'فيزيكال سبورت', category: 'gym', governorate: 'الجيزة',
        discount_percent: '35%', rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&auto=format&fit=crop',
        description: 'مركز لياقة بدنية متكامل مع حمام سباحة وساونا وجاكوزي.',
      },
      {
        id: 'ENT-003', name: 'نادي وادي دجلة', category: 'club', governorate: 'القاهرة',
        discount_percent: '30%', rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1574629810360-3ef0c64a6f38?w=400&auto=format&fit=crop',
        description: 'نادي اجتماعي ورياضي راقي يضم ملاعب ومطاعم ومنطقة أطفال.',
      },
      {
        id: 'ENT-004', name: 'نادي الجزيرة الرياضي', category: 'club', governorate: 'الجيزة',
        discount_percent: '25%', rating: 4.4,
        img_url: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=400&auto=format&fit=crop',
        description: 'نادي تاريخي على ضفاف النيل بأنشطة رياضية واجتماعية متنوعة.',
      },
      {
        id: 'ENT-005', name: 'سينما فوكس مصر', category: 'cinema', governorate: 'القاهرة',
        discount_percent: '30%', rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop',
        description: 'أحدث دور السينما بتقنية 4DX وIMAX مع خصم خاص للأعضاء.',
      },
      {
        id: 'ENT-006', name: 'سينما سيتي سنتر', category: 'cinema', governorate: 'الإسكندرية',
        discount_percent: '25%', rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop',
        description: 'مجمع سينمائي متكامل بأحدث الأفلام العربية والعالمية.',
      },
      {
        id: 'ENT-007', name: 'مول كايرو فيستيفال', category: 'mall', governorate: 'القاهرة',
        discount_percent: '20%', rating: 4.8,
        img_url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&auto=format&fit=crop',
        description: 'أكبر مول في مصر يضم أشهر الماركات العالمية والمطاعم الفاخرة.',
      },
      {
        id: 'ENT-008', name: 'مول سان ستيفانو', category: 'mall', governorate: 'الإسكندرية',
        discount_percent: '25%', rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&auto=format&fit=crop',
        description: 'مول سياحي على شاطئ البحر يضم محلات تجارية وترفيهية.',
      },
      {
        id: 'ENT-009', name: 'رحلة الأقصر وأسوان', category: 'trip', governorate: 'الأقصر',
        discount_percent: '25%', rating: 4.9,
        img_url: 'https://images.unsplash.com/photo-1590767728695-7c29c0b3eaa5?w=400&auto=format&fit=crop',
        description: 'رحلة سياحية متكاملة لزيارة معابد الأقصر وأسوان مع مرشد سياحي.',
      },
      {
        id: 'ENT-010', name: 'رحلة الغردقة', category: 'trip', governorate: 'الغردقة',
        discount_percent: '30%', rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400&auto=format&fit=crop',
        description: 'رحلة استجمام على البحر الأحمر تشمل الغطس والأنشطة المائية.',
      },
      {
        id: 'ENT-011', name: 'دريم بارك', category: 'park', governorate: 'القاهرة',
        discount_percent: '35%', rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&auto=format&fit=crop',
        description: 'مدينة ملاهي ترفيهية كبرى تضم ألعاب مثيرة ومناطق مائية.',
      },
      {
        id: 'ENT-012', name: 'فاميلي لاند', category: 'park', governorate: 'الإسكندرية',
        discount_percent: '40%', rating: 4.1,
        img_url: 'https://images.unsplash.com/photo-1567580168208-34a2a623beaf?w=400&auto=format&fit=crop',
        description: 'منتزه عائلي كبير بالعين السخنة مناسب للأطفال والكبار.',
      },
    ],

    // ── user_enrollments ────────────────────────────────────
    user_enrollments: [],

    // ── subscription_plans ──────────────────────────────────
    subscription_plans: [
      {
        id: 'free',
        name: 'مجاني',
        price: 0,
        duration_months: 0,
        max_discount_usage: 1,
        max_monthly_promo_uses: 0,
        popular: false,
        is_active: true,
        created_at: '2025-01-01T00:00:00.000Z',
        deleted_at: null,
      },
      {
        id: 'premium',
        name: 'مميز',
        price: 99,
        duration_months: 1,
        max_discount_usage: 10,
        max_monthly_promo_uses: 5,
        popular: true,
        is_active: true,
        created_at: '2025-01-01T00:00:00.000Z',
        deleted_at: null,
      },
      {
        id: 'elite',
        name: 'النخبة',
        price: 199,
        duration_months: 1,
        max_discount_usage: -1,
        max_monthly_promo_uses: -1,
        popular: false,
        is_active: true,
        created_at: '2025-01-01T00:00:00.000Z',
        deleted_at: null,
      },
    ],

    // ── features ────────────────────────────────────────────
    features: [
      { id: 1, name: 'الوصول إلى الخصومات', key: 'discount_access' },
      { id: 2, name: 'خصم واحد نشط', key: 'single_discount' },
      { id: 3, name: 'الوصول الأساسي للمنصة', key: 'basic_access' },
      { id: 4, name: 'خصومات غير محدودة', key: 'unlimited_discounts' },
      { id: 5, name: 'دعم فوري', key: 'priority_support' },
      { id: 6, name: 'تقارير الاستخدام', key: 'usage_reports' },
      { id: 7, name: 'إشعارات فورية', key: 'notifications' },
      { id: 8, name: 'مدير حساب مخصص', key: 'account_manager' },
      { id: 9, name: 'تقارير متقدمة', key: 'advanced_reports' },
      { id: 10, name: 'تكامل API', key: 'api_access' },
      { id: 11, name: 'لا إعلانات', key: 'no_ads' },
    ],

    // ── plan_features (many-to-many bridge) ─────────────────
    plan_features: [
      { plan_id: 'free', feature_id: 1 },
      { plan_id: 'free', feature_id: 2 },
      { plan_id: 'free', feature_id: 3 },
      { plan_id: 'premium', feature_id: 1 },
      { plan_id: 'premium', feature_id: 4 },
      { plan_id: 'premium', feature_id: 5 },
      { plan_id: 'premium', feature_id: 6 },
      { plan_id: 'premium', feature_id: 7 },
      { plan_id: 'elite', feature_id: 1 },
      { plan_id: 'elite', feature_id: 4 },
      { plan_id: 'elite', feature_id: 5 },
      { plan_id: 'elite', feature_id: 6 },
      { plan_id: 'elite', feature_id: 7 },
      { plan_id: 'elite', feature_id: 8 },
      { plan_id: 'elite', feature_id: 9 },
      { plan_id: 'elite', feature_id: 10 },
      { plan_id: 'elite', feature_id: 11 },
    ],

    // ── user_subscriptions ──────────────────────────────────
    user_subscriptions: [
      {
        id: 'SUB-1715000001',
        user_id: 'FL-2026-0001',
        plan_id: 'elite',
        status: 'ACTIVE',
        start_date: '2026-01-01T00:00:00.000Z',
        end_date: '2026-07-01T00:00:00.000Z',
        created_at: '2026-01-01T00:00:00.000Z',
        cancelled_at: null,
      },
      {
        id: 'SUB-1715000002',
        user_id: 'FL-2026-0002',
        plan_id: 'premium',
        status: 'ACTIVE',
        start_date: '2026-02-01T00:00:00.000Z',
        end_date: '2026-08-01T00:00:00.000Z',
        created_at: '2026-02-01T00:00:00.000Z',
        cancelled_at: null,
      },
    ],

    // ── payments ────────────────────────────────────────────
    payments: [
      {
        id: 'PAY-1716000001',
        user_id: 'FL-2026-0001',
        subscription_id: 'SUB-1715000001',
        amount: 199,
        payment_method: 'VISA',
        transaction_id: 'TXN-A1B2C3',
        status: 'SUCCESS',
        paid_at: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'PAY-1716000002',
        user_id: 'FL-2026-0002',
        subscription_id: 'SUB-1715000002',
        amount: 99,
        payment_method: 'FAWRY',
        transaction_id: 'TXN-D4E5F6',
        status: 'SUCCESS',
        paid_at: '2026-02-01T00:00:00.000Z',
      },
      {
        id: 'PAY-1716000003',
        user_id: 'FL-2026-0001',
        subscription_id: 'SUB-1715000001',
        amount: 199,
        payment_method: 'MASTERCARD',
        transaction_id: 'TXN-G7H8I9',
        status: 'SUCCESS',
        paid_at: '2026-03-01T00:00:00.000Z',
      },
      {
        id: 'PAY-1716000004',
        user_id: 'FL-2026-0003',
        subscription_id: null,
        amount: 99,
        payment_method: 'CASH',
        transaction_id: 'TXN-J0K1L2',
        status: 'FAILED',
        paid_at: '2026-04-15T00:00:00.000Z',
      },
      {
        id: 'PAY-1716000005',
        user_id: 'FL-2026-0003',
        subscription_id: null,
        amount: 99,
        payment_method: 'VISA',
        transaction_id: 'TXN-M3N4O5',
        status: 'PENDING',
        paid_at: '2026-05-01T00:00:00.000Z',
      },
    ],


  }
}

// ── store ───────────────────────────────────────────────────
let cache = null

function load() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      cache = JSON.parse(raw)
      const fresh = seedData()
      // ── Migrations ────────────────────────────────────
      // 1) Add any completely missing top-level keys from seed
      for (const key of Object.keys(fresh)) {
        if (!(key in cache)) cache[key] = fresh[key]
      }
      // 2) Always refresh seed-critical entities (system data,
      //    not user-generated) so that schema changes in seed
      //    are applied to existing localStorage data
      const SEED_OVERWRITE_KEYS = ['admins']
      for (const key of SEED_OVERWRITE_KEYS) {
        cache[key] = fresh[key]
      }
      return cache
    }
  } catch (_) { /* ignore */ }
  cache = seedData()
  save()
  return cache
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch (_) { /* storage full or unavailable */ }
}

export function resetDB() {
  cache = null
  localStorage.removeItem(STORAGE_KEY)
  load()
  return get()
}

// ── public API ──────────────────────────────────────────────

/** Return entire store snapshot */
export function get() {
  return load()
}

// ── USERS ───────────────────────────────────────────────────
export function createUser({ name, email, phone = '', nationalId = '', job, password, plan = 'free', governorate = '' }) {
  const db = load()
  const exists = db.users.find(u => u.email === email)
  if (exists) return { error: 'البريد الإلكتروني موجود بالفعل' }
  const user = {
    id: newUserId(),
    name,
    email,
    phone,
    nationalId,
    job,
    password,
    plan,
    governorate,
    scans: 0,
    saved: 0,
    join_date: today(),
    points: 0,
  }
  db.users.push(user)
  save()
  return { user }
}

export function findUser(email, password) {
  const db = load()
  return db.users.find(u => u.email === email && u.password === password) || null
}

export function findUserByEmail(email) {
  const db = load()
  return db.users.find(u => u.email === email) || null
}

export function findUserById(id) {
  const db = load()
  return db.users.find(u => u.id === id) || null
}

export function resetUserPassword(email, newPassword) {
  const db = load()
  const idx = db.users.findIndex(u => u.email === email)
  if (idx === -1) return { error: 'البريد الإلكتروني غير موجود' }
  db.users[idx].password = newPassword
  save()
  return { success: true }
}

export function resetCompanyPassword(email, newPassword) {
  const db = load()
  const idx = db.companies.findIndex(c => c.email === email)
  if (idx === -1) return { error: 'البريد الإلكتروني غير موجود' }
  db.companies[idx].password = newPassword
  save()
  return { success: true }
}

export function updateUser(id, updates) {
  const db = load()
  const idx = db.users.findIndex(u => u.id === id)
  if (idx === -1) return null
  db.users[idx] = { ...db.users[idx], ...updates }
  save()
  return db.users[idx]
}

export function deleteUser(id) {
  const db = load()
  db.users = db.users.filter(u => u.id !== id)
  db.user_scans = db.user_scans.filter(s => s.user_id !== id)
  db.cards = db.cards.filter(c => c.user_id !== id)
  db.installments = db.installments.filter(i => i.user_id !== id)
  db.user_enrollments = db.user_enrollments.filter(e => e.user_id !== id)
  save()
}

export function getAllUsers() {
  return load().users
}

export function removeUserSubscription(userId) {
  const db = load()
  const idx = db.users.findIndex(u => u.id === userId)
  if (idx === -1) return null
  db.users[idx].plan = 'free'
  save()
  return db.users[idx]
}

export function getAllSubscriptions() {
  const db = load()
  return db.users.map(u => ({
    ...u,
    subscriptionStatus:
      u.plan === 'premium' || u.plan === 'elite' ? 'active'
      : u.plan === 'free' ? 'inactive'
      : 'pending',
  }))
}

// ── COMPANIES ──────────────────────────────────────────────
export function createCompany({ name, email, password, category, city, emoji }) {
  const db = load()
  const exists = db.companies.find(c => c.email === email)
  if (exists) return { error: 'البريد الإلكتروني موجود بالفعل' }
  const company = {
    id: newCompanyId(),
    name,
    email,
    password,
    category,
    city,
    emoji,
    status: 'pending',
    join_date: today(),
    views: 0,
    uses: 0,
    commission: 12.0,
  }
  db.companies.push(company)
  save()
  return { company }
}

export function findCompany(email, password) {
  const db = load()
  return db.companies.find(c => c.email === email && c.password === password) || null
}

export function findCompanyByEmail(email) {
  const db = load()
  return db.companies.find(c => c.email === email) || null
}

export function findCompanyById(id) {
  const db = load()
  return db.companies.find(c => c.id === id) || null
}

export function updateCompany(id, updates) {
  const db = load()
  const idx = db.companies.findIndex(c => c.id === id)
  if (idx === -1) return null
  db.companies[idx] = { ...db.companies[idx], ...updates }
  save()
  return db.companies[idx]
}

export function getAllCompanies() {
  return load().companies
}

// ── DISCOUNTS ──────────────────────────────────────────────
let discountIdSeq = 8

export function createDiscount({ name, category, discount_percent, discount_type = 'EXTERNAL_LINK', promo_code = null, start_date = null, end_date = null, tier_required = null, description, city, tier, company_id, company_name }) {
  const db = load()
  const discount = {
    id: discountIdSeq++,
    name,
    category,
    discount_percent,
    discount_type,
    promo_code,
    start_date: start_date || today(),
    end_date,
    tier_required,
    description,
    city,
    tier,
    company_id,
    uses: 0,
    views: 0,
    status: 'pending',
    created_at: today(),
    company_name,
  }
  db.discounts.push(discount)
  save()
  return discount
}

export function getAllDiscounts() {
  return load().discounts
}

export function getApprovedDiscounts() {
  return load().discounts.filter(d => d.status === 'approved')
}

export function getDiscountsByCompany(companyId) {
  return load().discounts.filter(d => d.company_id === companyId)
}

export function findDiscountById(id) {
  return load().discounts.find(d => d.id === Number(id)) || null
}

export function updateDiscount(id, updates) {
  const db = load()
  const idx = db.discounts.findIndex(d => d.id === Number(id))
  if (idx === -1) return null
  // Auto-set approved_at when status changes to 'approved'
  if (updates.status === 'approved' && db.discounts[idx].status !== 'approved' && !updates.approved_at) {
    updates.approved_at = today()
  }
  // Clear approved_at if status changes away from 'approved'
  if (updates.status && updates.status !== 'approved' && db.discounts[idx].status === 'approved') {
    updates.approved_at = null
  }
  db.discounts[idx] = { ...db.discounts[idx], ...updates }
  save()
  return db.discounts[idx]
}

export function incrementDiscountUses(id) {
  const db = load()
  const idx = db.discounts.findIndex(d => d.id === Number(id))
  if (idx === -1) return null
  db.discounts[idx].uses += 1
  save()
  return db.discounts[idx]
}

export function incrementDiscountViews(id) {
  const db = load()
  const idx = db.discounts.findIndex(d => d.id === Number(id))
  if (idx === -1) return null
  db.discounts[idx].views += 1
  save()
  return db.discounts[idx]
}

export function deleteDiscount(id) {
  const db = load()
  const idx = db.discounts.findIndex(d => d.id === Number(id))
  if (idx === -1) return false
  db.discounts.splice(idx, 1)
  // Clean up related discount_branches
  db.discount_branches = (db.discount_branches || []).filter(l => l.discount_id !== Number(id))
  // Clean up related social_reviews (generic target_type pattern)
  db.social_reviews = (db.social_reviews || []).filter(r => !(r.target_type === 'DISCOUNT' && r.target_id === Number(id)))
  save()
  return true
}

// ── CARDS ──────────────────────────────────────────────────
export function getUserCards(userId) {
  return load().cards.filter(c => c.user_id === userId)
}

export function saveCard(userId, cardData) {
  const db = load()
  const card = { user_id: userId, ...cardData }
  // Replace existing card
  const idx = db.cards.findIndex(c => c.user_id === userId)
  if (idx >= 0) {
    db.cards[idx] = card
  } else {
    db.cards.push(card)
  }
  save()
  return card
}

export function deleteCard(userId) {
  const db = load()
  db.cards = db.cards.filter(c => c.user_id !== userId)
  save()
}

// ── INSTALLMENTS ───────────────────────────────────────────
export function getUserInstallments(userId) {
  return load().installments.filter(i => i.user_id === userId)
}

export function createInstallment({ user_id, name, total, monthly_amount }) {
  const db = load()
  const installment = {
    id: newInstallmentId(),
    user_id,
    name,
    total,
    paid: 0,
    monthly_amount,
    next_due: futureDate(1),
  }
  db.installments.push(installment)
  save()
  return installment
}

export function payInstallment(id, amount) {
  const db = load()
  const idx = db.installments.findIndex(i => i.id === id)
  if (idx === -1) return null
  db.installments[idx].paid += amount
  if (db.installments[idx].paid >= db.installments[idx].total) {
    db.installments[idx].paid = db.installments[idx].total
  }
  // Advance next_due by 1 month
  const d = new Date(db.installments[idx].next_due)
  d.setMonth(d.getMonth() + 1)
  db.installments[idx].next_due = d.toISOString()
  save()
  return db.installments[idx]
}

// Generate promo code (e.g., MUSTAK-2026-ABC123)
function generatePromoCode(discountPct = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'MSTK-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// ── USER SCANS (many-to-many bridge) ───────────────────────
export function recordScan(userId, discountId, details = {}) {
  const db = load()
  const discount = db.discounts.find(d => d.id === Number(discountId))
  const discountPct = discount ? parseInt(discount.discount_percent) : 20
  const basePrice = rand(100, 2000)
  const discountValue = Math.round(basePrice * discountPct / 100)
  // Pick a realistic product name based on discount category
  const productNames = {
    medical: ['كشف طبي شامل', 'تحاليل شاملة', 'أدوية', 'أشعة', 'جلسة علاج'],
    gym: ['اشتراك شهري', 'جلسة تدريب شخصي', 'اشتراك سنوي', 'جلسة ماساج'],
    food: ['وجبة كاملة', 'وجبة عائلة', 'مشروبات', 'حلويات', 'عشاء'],
    fun: ['تذكرة سينما', 'تذكرة دخول', 'جلسة ألعاب', 'رحلة'],
  }
  const catNames = productNames[discount?.category] || ['خدمة']
  const product = details.discountName || catNames[rand(0, catNames.length - 1)]
  const promoCode = generatePromoCode(discountPct)
  const finalPrice = details.priceAfterDiscount ? parseFloat(details.priceAfterDiscount) : (basePrice - discountValue)
  const amountPaid = details.amountPaid ? parseFloat(details.amountPaid) : finalPrice
  const last4Digits = details.last4Digits || `${rand(1000, 9999)}`

  db.user_scans.push({
    user_id: userId,
    discount_id: Number(discountId),
    scanned_at: today(),
    invoice_id: `INV-${Date.now()}-${rand(100, 999)}`,
    product,
    original_price: basePrice,
    discount_percent: `${discountPct}%`,
    discount_value: discountValue,
    final_price: finalPrice,
    promo_code: promoCode,
    amount_paid: amountPaid,
    invoice_last4: last4Digits,
  })
  // Update user scan count + saved
  const user = db.users.find(u => u.id === userId)
  if (user) {
    user.scans += 1
    user.points += 10
    user.saved += rand(20, 100) // simulated saving
  }
  // Update discount uses
  if (discount) discount.uses += 1
  // Update company uses
  if (discount) {
    const company = db.companies.find(c => c.id === discount.company_id)
    if (company) company.uses += 1
  }
  save()
}

export function getUserScans(userId) {
  const db = load()
  return db.user_scans
    .filter(s => s.user_id === userId)
    .map(s => {
      const discount = db.discounts.find(d => d.id === s.discount_id)
      return { ...s, discount: discount || null }
    })
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))
}

export function getAllUserScans() {
  return load().user_scans
}

export function getAllScansWithDetails() {
  const db = load()
  return db.user_scans
    .map(s => {
      const user = db.users.find(u => u.id === s.user_id) || null
      const discount = db.discounts.find(d => d.id === s.discount_id) || null
      return { ...s, user, discount }
    })
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))
}

// ── ADMIN ──────────────────────────────────────────────────
export function findAdmin(email, password) {
  const db = load()
  const admin = db.admins.find(a => a.email === email && a.password === password)
  if (!admin) return null
  // Ensure admin always has an id (backward compat)
  return {
    id: admin.id || 'ADMIN-001',
    name: admin.name || 'مشرف النظام',
    email: admin.email,
    role: admin.role || 'ADMIN',
    isActive: admin.isActive !== false,
    join_date: admin.join_date || admin.createdAt,
  }
}

export function findAdminByEmail(email) {
  const db = load()
  const admin = db.admins.find(a => a.email === email)
  if (!admin) return null
  return {
    id: admin.id || 'ADMIN-001',
    name: admin.name || 'مشرف النظام',
    email: admin.email,
    role: admin.role || 'ADMIN',
    isActive: admin.isActive !== false,
    join_date: admin.join_date || admin.createdAt,
  }
}

export function resetAdminPassword(email, newPassword) {
  const db = load()
  const idx = db.admins.findIndex(a => a.email === email)
  if (idx === -1) return { error: 'البريد الإلكتروني غير موجود' }
  db.admins[idx].password = newPassword
  save()
  return { success: true }
}

// ── GOVERNORATES ──────────────────────────────────────────
export function getGovernorates() {
  return load().governorates
}

// ── MEDICAL CENTERS ──────────────────────────────────────
export function getAllMedicalCenters() {
  return load().medical_centers
}

export function getMedicalCentersByGovernorate(governorate) {
  const db = load()
  if (!governorate || governorate === 'all') return db.medical_centers
  return db.medical_centers.filter(c => c.governorate === governorate)
}

export function findMedicalCenterById(id) {
  return load().medical_centers.find(c => c.id === id) || null
}

// ── BANKS ────────────────────────────────────────────────
export function getAllBanks() {
  return load().banks
}

export function getBanksByGovernorate(governorate) {
  const db = load()
  if (!governorate || governorate === 'all') return db.banks
  return db.banks.filter(b => b.governorate === governorate)
}

export function findBankById(id) {
  return load().banks.find(b => b.id === id) || null
}

// ── RESTAURANTS ─────────────────────────────────────────
export function getAllRestaurants() {
  return load().restaurants || []
}

export function getAllEntertainmentVenues() {
  return load().entertainmentVenues || []
}

// ── USER ENROLLMENTS (medical / financial / combined) ────
export function enrollUserInService(userId, { service_type, center_id, bank_id }) {
  const db = load()
  const enrollment = {
    id: `EN-${Date.now()}-${rand(1000, 9999)}`,
    user_id: userId,
    service_type, // 'medical', 'financial', or 'combined'
    center_id: center_id || null,
    bank_id: bank_id || null,
    enrolled_at: today(),
    status: 'active',
    subscription_confirmed: false,
    subscription_name: null,
    subscription_dob: null,
    subscription_phone: null,
    subscription_data_use_agree: false,
    subscription_terms_agree: false,
    subscription_confirmed_at: null,
  }
  // Remove any existing enrollment for this service type
  const idx = db.user_enrollments.findIndex(e => e.user_id === userId && e.service_type === service_type)
  if (idx >= 0) db.user_enrollments[idx] = enrollment
  else db.user_enrollments.push(enrollment)
  save()
  return enrollment
}

export function getUserEnrollments(userId) {
  const db = load()
  return db.user_enrollments
    .filter(e => e.user_id === userId)
    .map(e => {
      const center = e.center_id ? db.medical_centers.find(c => c.id === e.center_id) || null : null
      const bank = e.bank_id ? db.banks.find(b => b.id === e.bank_id) || null : null
      return { ...e, center, bank }
    })
}

// ── ENROLLMENTS ───────────────────────────────────────────
export function getAllEnrollments() {
  const db = load()
  return db.user_enrollments.map(e => {
    const user = db.users.find(u => u.id === e.user_id) || null
    const center = e.center_id ? db.medical_centers.find(c => c.id === e.center_id) || null : null
    const bank = e.bank_id ? db.banks.find(b => b.id === e.bank_id) || null : null
    return { ...e, user, center, bank }
  })
}

// ── SUBSCRIBERS BY SERVICE TYPE ───────────────────────────
export function getSubscribersByServiceType(type) {
  const db = load()
  const users = db.users
  let userIds = new Set()
  const userActivityMap = {} // userId -> { scans: 0, saved: 0 }

  switch (type) {
    case 'financial': {
      db.user_enrollments.filter(e => e.service_type === 'financial' || e.service_type === 'combined').forEach(e => {
        userIds.add(e.user_id)
      })
      break
    }
    case 'training': {
      db.installments.filter(i => i.name.includes('كورس') || i.name.includes('تعليم') || i.name.includes('Course') || i.name.includes('Training')).forEach(i => {
        userIds.add(i.user_id)
      })
      break
    }
    case 'restaurants': {
      const foodDiscountIds = new Set(db.discounts.filter(d => d.category === 'food').map(d => d.id))
      db.user_scans.forEach(s => {
        if (foodDiscountIds.has(s.discount_id)) {
          userIds.add(s.user_id)
          if (!userActivityMap[s.user_id]) userActivityMap[s.user_id] = { scans: 0, saved: 0 }
          userActivityMap[s.user_id].scans += 1
          userActivityMap[s.user_id].saved += s.discount_value || 0
        }
      })
      break
    }
    case 'clubs': {
      const clubDiscountIds = new Set(db.discounts.filter(d => d.category === 'gym' || d.category === 'fun').map(d => d.id))
      db.user_scans.forEach(s => {
        if (clubDiscountIds.has(s.discount_id)) {
          userIds.add(s.user_id)
          if (!userActivityMap[s.user_id]) userActivityMap[s.user_id] = { scans: 0, saved: 0 }
          userActivityMap[s.user_id].scans += 1
          userActivityMap[s.user_id].saved += s.discount_value || 0
        }
      })
      break
    }
  }

  return users
    .filter(u => userIds.has(u.id))
    .map(u => ({
      ...u,
      typeScans: userActivityMap[u.id]?.scans || 0,
      typeSaved: userActivityMap[u.id]?.saved || 0,
    }))
    .sort((a, b) => b.typeScans - a.typeScans)
}

// ── DISCOUNT USAGE DETAIL ─────────────────────────────────
export function getDiscountUsageDetail(discountId) {
  const db = load()
  return db.user_scans
    .filter(s => s.discount_id === Number(discountId))
    .map(s => {
      const user = db.users.find(u => u.id === s.user_id) || null
      return { ...s, user }
    })
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))
}

export function confirmEnrollmentSubscription(enrollmentId, { name, dob, phone, dataUseAgree, termsAgree }) {
  const db = load()
  const idx = db.user_enrollments.findIndex(e => e.id === enrollmentId)
  if (idx === -1) return null
  db.user_enrollments[idx].subscription_confirmed = true
  db.user_enrollments[idx].subscription_name = name
  db.user_enrollments[idx].subscription_dob = dob
  db.user_enrollments[idx].subscription_phone = phone
  db.user_enrollments[idx].subscription_data_use_agree = dataUseAgree
  db.user_enrollments[idx].subscription_terms_agree = termsAgree
  db.user_enrollments[idx].subscription_confirmed_at = today()
  save()
  return db.user_enrollments[idx]
}

// ── STATISTICS ─────────────────────────────────────────────
export function getStats() {
  const db = load()
  const approvedDiscounts = db.discounts.filter(d => d.status === 'approved')
  const pendingCompanies = db.companies.filter(c => c.status === 'pending')
  const totalRevenue = db.users.reduce((sum, u) => {
    if (u.plan === 'premium') return sum + 99
    if (u.plan === 'elite') return sum + 199
    return sum
  }, 0)
  return {
    totalUsers: db.users.length,
    totalCompanies: db.companies.length,
    totalDiscounts: db.discounts.length,
    approvedDiscounts: approvedDiscounts.length,
    pendingCompanies: pendingCompanies.length,
    pendingDiscounts: db.discounts.filter(d => d.status === 'pending').length,
    totalScans: db.user_scans.length,
    totalRevenue,
  }
}

// ── REVENUE DETAIL (per-client subscription breakdown) ───
export function getAllRevenueDetails() {
  const db = load()
  return db.users
    .map(u => {
      const planRevenue = u.plan === 'premium' ? 99 : u.plan === 'elite' ? 199 : 0
      const userScans = db.user_scans.filter(s => s.user_id === u.id)
      const userInstallments = db.installments.filter(i => i.user_id === u.id)
      const userEnrollments = db.user_enrollments.filter(e => e.user_id === u.id)
      const totalScanValue = userScans.reduce((sum, s) => sum + (s.discount_value || 0), 0)
      return {
        ...u,
        planRevenue,
        subscriptionStatus: u.plan === 'premium' || u.plan === 'elite' ? 'active' : 'inactive',
        totalScans: userScans.length,
        totalScanSaved: totalScanValue,
        userScans,
        userInstallments,
        userEnrollments,
        totalInstallments: userInstallments.length,
        installmentTotalPaid: userInstallments.reduce((sum, i) => sum + i.paid, 0),
        installmentTotalRemaining: userInstallments.reduce((sum, i) => sum + (i.total - i.paid), 0),
      }
    })
    .sort((a, b) => b.planRevenue - a.planRevenue || b.totalScans - a.totalScans)
}

// ── USER FULL DETAIL (aggregated for admin) ──────────────
export function getUserFullDetail(userId) {
  const user = findUserById(userId)
  if (!user) return null
  const cards = getUserCards(userId)
  const scans = getUserScans(userId)
  const installments = getUserInstallments(userId)
  const enrollments = getUserEnrollments(userId)
  return {
    user,
    cards,
    scans,
    installments,
    enrollments,
  }
}

// ── COMPANY BRANCHES ─────────────────────────────────────
export function getCompanyBranches(companyId) {
  const db = load()
  const all = db.company_branches || []
  if (companyId) return all.filter(b => b.company_id === companyId)
  return all
}

export function createCompanyBranch({ company_id, name, address, city, phone, working_hours }) {
  const db = load()
  const branch = {
    id: newBranchId(),
    company_id,
    name,
    address,
    city,
    phone,
    working_hours,
  }
  db.company_branches.push(branch)
  save()
  return branch
}

export function updateCompanyBranch(id, updates) {
  const db = load()
  const idx = (db.company_branches || []).findIndex(b => b.id === id)
  if (idx === -1) return null
  db.company_branches[idx] = { ...db.company_branches[idx], ...updates }
  save()
  return db.company_branches[idx]
}

export function deleteCompanyBranch(id) {
  const db = load()
  db.company_branches = (db.company_branches || []).filter(b => b.id !== id)
  save()
}

export function findCompanyBranchById(id) {
  return (load().company_branches || []).find(b => b.id === id) || null
}

// ── DISCOUNT BRANCHES (many-to-many bridge) ──────────────
export function getDiscountBranches(discountId) {
  const db = load()
  const links = (db.discount_branches || []).filter(l => l.discount_id === Number(discountId))
  // Hydrate with full branch data
  const branches = (db.company_branches || [])
  return links.map(l => {
    const branch = branches.find(b => b.id === l.branch_id)
    return { ...l, branch: branch || null }
  })
}

export function addDiscountBranch(discountId, branchId) {
  const db = load()
  const exists = (db.discount_branches || []).find(l => l.discount_id === Number(discountId) && l.branch_id === branchId)
  if (exists) return exists
  const link = { discount_id: Number(discountId), branch_id: branchId }
  if (!db.discount_branches) db.discount_branches = []
  db.discount_branches.push(link)
  save()
  return link
}

export function removeDiscountBranch(discountId, branchId) {
  const db = load()
  db.discount_branches = (db.discount_branches || []).filter(l => !(l.discount_id === Number(discountId) && l.branch_id === branchId))
  save()
}

export function setDiscountBranches(discountId, branchIds) {
  const db = load()
  // Remove all existing links for this discount
  db.discount_branches = (db.discount_branches || []).filter(l => l.discount_id !== Number(discountId))
  // Add new links
  for (const branchId of branchIds) {
    db.discount_branches.push({ discount_id: Number(discountId), branch_id: branchId })
  }
  save()
}

// ── REVIEWS ──────────────────────────────────────────────
let reviewIdSeq = 4

export function getDiscountReviews(discountId) {
  const db = load()
  return (db.reviews || [])
    .filter(r => r.discount_id === Number(discountId))
    .map(r => {
      const user = db.users.find(u => u.id === r.user_id) || null
      return { ...r, user }
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export function addReview({ discount_id, user_id, rating, comment }) {
  const db = load()
  const review = {
    id: reviewIdSeq++,
    discount_id: Number(discount_id),
    user_id,
    rating,
    comment,
    created_at: today(),
  }
  if (!db.reviews) db.reviews = []
  db.reviews.push(review)
  save()
  return review
}

export function deleteReview(reviewId) {
  const db = load()
  db.reviews = (db.reviews || []).filter(r => r.id !== Number(reviewId))
  save()
}

export function getAllReviews() {
  const db = load()
  return (db.reviews || []).map(r => {
    const user = db.users.find(u => u.id === r.user_id) || null
    const discount = db.discounts.find(d => d.id === r.discount_id) || null
    return { ...r, user, discount }
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

// ── SUBSCRIPTION PLANS ───────────────────────────────────
export function getActivePlans() {
  return (load().subscription_plans || []).filter(p => !p.deleted_at && p.is_active)
}

export function getAllPlans() {
  return (load().subscription_plans || []).filter(p => !p.deleted_at)
}

export function getPlanById(id) {
  return (load().subscription_plans || []).find(p => p.id === id && !p.deleted_at) || null
}

let planSeq = 100
export function createPlan({ name, price, duration_months, max_discount_usage, max_monthly_promo_uses, popular }) {
  const db = load()
  const planId = `plan_${planSeq++}`
  const plan = {
    id: planId,
    name,
    price: Number(price),
    duration_months: Number(duration_months),
    max_discount_usage: name?.includes('غير محدود') || price > 150 ? -1 : Number(price) > 0 ? 10 : 1,
    max_monthly_promo_uses: price > 150 ? -1 : Number(price) > 0 ? 5 : 0,
    popular: !!popular,
    is_active: true,
    created_at: today(),
    deleted_at: null,
  }
  if (max_discount_usage !== undefined) plan.max_discount_usage = Number(max_discount_usage)
  if (max_monthly_promo_uses !== undefined) plan.max_monthly_promo_uses = Number(max_monthly_promo_uses)
  if (!db.subscription_plans) db.subscription_plans = []
  db.subscription_plans.push(plan)
  save()
  return plan
}

export function updatePlan(id, updates) {
  const db = load()
  const idx = (db.subscription_plans || []).findIndex(p => p.id === id && !p.deleted_at)
  if (idx === -1) return null
  const allowed = ['name', 'price', 'duration_months', 'max_discount_usage', 'max_monthly_promo_uses', 'popular', 'is_active']
  for (const key of allowed) {
    if (updates[key] !== undefined) db.subscription_plans[idx][key] = updates[key]
  }
  save()
  return db.subscription_plans[idx]
}

export function softDeletePlan(id) {
  const db = load()
  const plan = (db.subscription_plans || []).find(p => p.id === id && !p.deleted_at)
  if (!plan) return false
  plan.deleted_at = today()
  save()
  return true
}

// ── FEATURES ─────────────────────────────────────────────
export function getFeatures() {
  return load().features || []
}

let featureIdSeq = 12

export function createFeature({ name, key }) {
  const db = load()
  const feature = {
    id: featureIdSeq++,
    name,
    key,
  }
  if (!db.features) db.features = []
  db.features.push(feature)
  save()
  return feature
}

export function updateFeature(id, updates) {
  const db = load()
  const idx = (db.features || []).findIndex(f => f.id === Number(id))
  if (idx === -1) return null
  db.features[idx] = { ...db.features[idx], ...updates }
  save()
  return db.features[idx]
}

export function deleteFeature(id) {
  const db = load()
  const idx = (db.features || []).findIndex(f => f.id === Number(id))
  if (idx === -1) return false
  db.features.splice(idx, 1)
  // Clean up plan_features
  db.plan_features = (db.plan_features || []).filter(pf => pf.feature_id !== Number(id))
  save()
  return true
}


export function getPlanFeatures(planId) {
  const db = load()
  const links = (db.plan_features || []).filter(pf => pf.plan_id === planId)
  return links.map(l => {
    const feature = (db.features || []).find(f => f.id === l.feature_id)
    return { ...l, feature: feature || null }
  }).filter(l => l.feature)
}

export function setPlanFeatures(planId, featureIds) {
  const db = load()
  db.plan_features = [...(db.plan_features || []).filter(pf => pf.plan_id !== planId)]
  for (const fid of featureIds) {
    db.plan_features.push({ plan_id: planId, feature_id: Number(fid) })
  }
  save()
}

// ── USER SUBSCRIPTIONS ───────────────────────────────────
function newSubId() {
  return `SUB-${Date.now()}-${rand(100, 999)}`
}

export function getUserSubscription(userId) {
  const db = load()
  const active = (db.user_subscriptions || [])
    .filter(s => s.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .find(s => s.status === 'ACTIVE' || s.status === 'PENDING')
  if (!active) return null
  // Hydrate with plan
  const plan = getPlanById(active.plan_id)
  return { ...active, plan }
}

export function getUserSubscriptionHistory(userId) {
  const db = load()
  return (db.user_subscriptions || [])
    .filter(s => s.user_id === userId)
    .map(s => ({ ...s, plan: getPlanById(s.plan_id) || null }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export function createUserSubscription({ user_id, plan_id, payment_method }) {
  const db = load()
  const plan = getPlanById(plan_id)
  if (!plan) return { error: 'الخطة غير موجودة' }
  const now = new Date()
  const startDate = now.toISOString()
  const endDate = new Date(now.getTime() + plan.duration_months * 30 * 24 * 60 * 60 * 1000).toISOString()
  const sub = {
    id: newSubId(),
    user_id,
    plan_id,
    status: 'ACTIVE',
    start_date: startDate,
    end_date: endDate,
    created_at: startDate,
    cancelled_at: null,
  }
  if (!db.user_subscriptions) db.user_subscriptions = []
  db.user_subscriptions.push(sub)

  // Auto-create payment record
  const payId = `PAY-${Date.now()}-${rand(100, 999)}`
  if (!db.payments) db.payments = []
  db.payments.push({
    id: payId,
    user_id,
    subscription_id: sub.id,
    amount: plan.price,
    payment_method: payment_method || 'CASH',
    transaction_id: `TXN-${rand(100000, 999999).toString(36).toUpperCase()}`,
    status: 'SUCCESS',
    paid_at: startDate,
  })
  // Update the user's plan field so AuthContext reflects the upgrade immediately
  const userIdx = db.users.findIndex(u => u.id === user_id)
  if (userIdx !== -1) {
    db.users[userIdx].plan = plan_id
  }
  save()
  return { ...sub, plan, user: db.users[userIdx] }
}

export function cancelUserSubscription(id) {
  const db = load()
  const sub = (db.user_subscriptions || []).find(s => s.id === id)
  if (!sub) return null
  sub.status = 'CANCELLED'
  sub.cancelled_at = today()
  save()
  return sub
}

// ── PAYMENTS ─────────────────────────────────────────────
export function getPaymentsByUser(userId) {
  const db = load()
  return (db.payments || [])
    .filter(p => p.user_id === userId)
    .map(p => ({
      ...p,
      subscription: (db.user_subscriptions || []).find(s => s.id === p.subscription_id) || null,
    }))
    .sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
}

export function getAllPayments() {
  const db = load()
  return (db.payments || []).map(p => {
    const user = db.users.find(u => u.id === p.user_id) || null
    const sub = (db.user_subscriptions || []).find(s => s.id === p.subscription_id) || null
    return { ...p, user, subscription: sub }
  }).sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
}

export function createPayment({ user_id, subscription_id, amount, payment_method }) {
  const db = load()
  const pay = {
    id: `PAY-${Date.now()}`,
    user_id,
    subscription_id: subscription_id || null,
    amount: Number(amount),
    payment_method: payment_method || 'CASH',
    transaction_id: `TXN-${rand(100000, 999999).toString(36).toUpperCase()}`,
    status: 'SUCCESS',
    paid_at: today(),
  }
  if (!db.payments) db.payments = []
  db.payments.push(pay)
  save()
  return pay
}

// ── Social Reviews CRUD (generic target_type/target_id) ──────

export function getTargetReviews(targetType, targetId) {
  const db = load()
  const users = db.users || []
  return (db.social_reviews || [])
    .filter(r => r.target_type === targetType && r.target_id === targetId)
    .map(r => ({
      ...r,
      user_name: users.find(u => u.id === r.user_id)?.name || 'مستخدم',
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export function addSocialReview({ target_type, target_id, user_id, rating, comment }) {
  const db = load()
  const review = {
    id: `SR-${Date.now()}`,
    target_type,
    target_id,
    user_id,
    rating: Number(rating),
    comment: comment || '',
    created_at: new Date().toISOString(),
  }
  if (!db.social_reviews) db.social_reviews = []
  db.social_reviews.push(review)
  save()
  return review
}

export function deleteSocialReview(id) {
  const db = load()
  const before = (db.social_reviews || []).length
  db.social_reviews = (db.social_reviews || []).filter(r => r.id !== id)
  if (db.social_reviews.length < before) { save(); return { success: true } }
  return { success: false }
}

// ── Notifications CRUD (ERD: user_id, title, body, type, link, is_read, created_at) ──

export function getUserNotifications(userId) {
  const db = load()
  return (db.notifications || [])
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export function getUnreadNotificationCount(userId) {
  return (load().notifications || []).filter(n => n.user_id === userId && !n.is_read).length
}

let notifSeq = 100
export function createNotification({ user_id, title, body, type = 'INFO', link = '' }) {
  const db = load()
  const notification = {
    id: `NOTIF-${Date.now()}-${notifSeq++}`,
    user_id,
    title,
    body: body || '',
    type,
    link: link || '',
    is_read: false,
    created_at: new Date().toISOString(),
  }
  if (!db.notifications) db.notifications = []
  db.notifications.push(notification)
  save()
  return notification
}

export function markNotificationRead(id) {
  const db = load()
  const n = (db.notifications || []).find(x => x.id === id)
  if (n) { n.is_read = true; save(); return { success: true } }
  return { success: false }
}

export function markAllNotificationsRead(userId) {
  const db = load()
  const found = (db.notifications || []).filter(n => n.user_id === userId && !n.is_read)
  found.forEach(n => { n.is_read = true })
  if (found.length) save()
  return { count: found.length }
}

export function deleteNotification(id) {
  const db = load()
  const before = (db.notifications || []).length
  db.notifications = (db.notifications || []).filter(n => n.id !== id)
  if (db.notifications.length < before) { save(); return { success: true } }
  return { success: false }
}

let _srSeq = 0
export function createServiceRequest({ name, phone, email, address, service_id, service_name, provider_id, provider_name, notes }) {
  const db = load()
  _srSeq++
  const request = {
    id: `SR-${Date.now()}-${_srSeq}`,
    name, phone, email, address, service_id, service_name,
    provider_id: provider_id || null,
    provider_name: provider_name || null,
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  if (!db.service_requests) db.service_requests = []
  db.service_requests.push(request)
  save()
  return { success: true, data: request }
}


