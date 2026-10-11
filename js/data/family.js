/* ============================================================
   js/data/family.js — flat family-tree people (MOCK DATA)
   ~40 people, 5 generations, two root families.
   parent_id links a person to their parent node (a parent may
   be the father OR the mother in the tree). Roots have null.
   elder_slug links a person to their elders-page profile.
   photo=null -> the 3D tree renders an initial-letter avatar.
   ============================================================ */
window.VillageData = window.VillageData || {};
window.VillageData.family = [
  /* ---------- Family 1: صادقی — 5 generations ---------- */
  { id: 1,  first_name: 'رضا',    last_name: 'صادقی',  gender: 'm', birth_year: 1920, death_year: 1995, photo: 'https://picsum.photos/seed/f-reza/300/300.jpg',   short_bio: 'کدخدای پیشین روستا و بنیان‌گذار نظمِ آب قنات.', parent_id: null, spouse_name: 'گوهر تاج صادقی', elder_slug: 'haj-reza-sadeghi' },
  { id: 2,  first_name: 'محمد',   last_name: 'صادقی',  gender: 'm', birth_year: 1947, death_year: null, photo: null, short_bio: 'کشاورز و باغدار؛ پاسدار توتستان‌های پدری.', parent_id: 1, spouse_name: 'آسیه رحیمی' },
  { id: 3,  first_name: 'زهرا',   last_name: 'صادقی',  gender: 'f', birth_year: 1951, death_year: null, photo: 'https://picsum.photos/seed/f-zahra/300/300.jpg',   short_bio: 'قالی‌باف و مدرس بافی در سرای ابریشم.', parent_id: 1, spouse_name: 'مهدی کریمی', elder_slug: 'zahra-sadeghi' },
  { id: 4,  first_name: 'حسین',   last_name: 'صادقی',  gender: 'm', birth_year: 1955, death_year: 2018, photo: 'https://picsum.photos/seed/f-hossein/300/300.jpg', short_bio: 'معلم بازنشسته و خاطره‌نویس روستا.', parent_id: 1, spouse_name: 'روشنک علیزاده', elder_slug: 'hossein-sadeghi' },
  { id: 5,  first_name: 'یوسف',   last_name: 'صادقی',  gender: 'm', birth_year: 1960, death_year: null, photo: null, short_bio: 'دامدار؛ صاحب گله‌های پشمی دامنه شمالی.', parent_id: 1, spouse_name: 'مریم جعفری' },
  { id: 6,  first_name: 'علی',    last_name: 'صادقی',  gender: 'm', birth_year: 1972, death_year: null, photo: 'https://picsum.photos/seed/f-ali/300/300.jpg',     short_bio: 'مهندس کشاورزی؛ پاسدار توت‌های کهن.', parent_id: 2, spouse_name: 'سمیرا نوروزی', elder_slug: 'ali-sadeghi' },
  { id: 7,  first_name: 'فاطمه',  last_name: 'صادقی',  gender: 'f', birth_year: 1976, death_year: null, photo: null, short_bio: 'پرستار بهداشت روستا.', parent_id: 2, spouse_name: 'کریم ملکی' },
  { id: 8,  first_name: 'حسن',    last_name: 'صادقی',  gender: 'm', birth_year: 1980, death_year: null, photo: null, short_bio: 'راننده و کمک‌کدخدای جوان.', parent_id: 2, spouse_name: null },
  { id: 9,  first_name: 'رضا',    last_name: 'کریمی',  gender: 'm', birth_year: 1975, death_year: null, photo: null, short_bio: 'نجار؛ سازنده درها و دارهای قالی.', parent_id: 3, spouse_name: 'گلنار سعیدی' },
  { id: 10, first_name: 'سارا',   last_name: 'کریمی',  gender: 'f', birth_year: 1979, death_year: null, photo: null, short_bio: 'دبیر ریاضی در شهرستان.', parent_id: 3, spouse_name: 'بهزاد شریفی' },
  { id: 11, first_name: 'زهرا',   last_name: 'صادقی',  gender: 'f', birth_year: 1982, death_year: null, photo: null, short_bio: 'معلم ابتدایی؛ ادامه‌دهنده راه پدر.', parent_id: 4, spouse_name: 'امیر قنبری' },
  { id: 12, first_name: 'محمود',  last_name: 'صادقی',  gender: 'm', birth_year: 1986, death_year: null, photo: null, short_bio: 'پزشک عمومی؛ پایش به روستا می‌رسد.', parent_id: 4, spouse_name: null },
  { id: 13, first_name: 'لیلا',   last_name: 'صادقی',  gender: 'f', birth_year: 1985, death_year: null, photo: null, short_bio: 'گلکار؛ پرورش گل‌های پیازی روستا.', parent_id: 5, spouse_name: 'حسن طاهری' },
  { id: 14, first_name: 'امیر',   last_name: 'صادقی',  gender: 'm', birth_year: 1988, death_year: null, photo: null, short_bio: 'دانشجوی مهندسی عمران.', parent_id: 5, spouse_name: null },
  { id: 15, first_name: 'نگار',   last_name: 'صادقی',  gender: 'f', birth_year: 1996, death_year: null, photo: null, short_bio: 'طراح گرافیک؛ برندِ سوغاتِ روستا کارِ اوست.', parent_id: 6, spouse_name: 'سیاوش رستمی' },
  { id: 16, first_name: 'آرش',    last_name: 'صادقی',  gender: 'm', birth_year: 1999, death_year: null, photo: null, short_bio: 'دانشجوی معماری.', parent_id: 6, spouse_name: null },
  { id: 17, first_name: 'مهسا',   last_name: 'ملکی',   gender: 'f', birth_year: 1999, death_year: null, photo: null, short_bio: 'دانشجوی دامپزشکی.', parent_id: 7, spouse_name: null },
  { id: 18, first_name: 'پویا',   last_name: 'کریمی',  gender: 'm', birth_year: 1997, death_year: null, photo: null, short_bio: 'معمار؛ طراح بازسازی خانه‌های قدیمی روستا.', parent_id: 9, spouse_name: 'الهام دلاوری' },
  { id: 19, first_name: 'هانیه',  last_name: 'کریمی',  gender: 'f', birth_year: 2003, death_year: null, photo: null, short_bio: 'دانش‌آموز و بازیکن والیبال مدرسه.', parent_id: 9, spouse_name: null },
  { id: 20, first_name: 'الناز',  last_name: 'صادقی',  gender: 'f', birth_year: 2008, death_year: null, photo: null, short_bio: 'دانش‌آموز؛ عاشق نقاشی.', parent_id: 11, spouse_name: null },
  { id: 21, first_name: 'سینا',   last_name: 'صادقی',  gender: 'm', birth_year: 2010, death_year: null, photo: null, short_bio: 'کودکِ پرجنب‌وجوش کوچه‌ها.', parent_id: 13, spouse_name: null },
  { id: 22, first_name: 'نیلوفر', last_name: 'صادقی',  gender: 'f', birth_year: 2012, death_year: null, photo: null, short_bio: 'دخترکی با قصه‌های بی‌پایان.', parent_id: 14, spouse_name: null },
  { id: 23, first_name: 'کیان',   last_name: 'کریمی',  gender: 'm', birth_year: 2006, death_year: null, photo: null, short_bio: 'دانش‌آموز و فوتبالیست.', parent_id: 10, spouse_name: null },
  { id: 24, first_name: 'بهار',   last_name: 'صادقی',  gender: 'f', birth_year: 2011, death_year: null, photo: null, short_bio: 'دخترِ کوچه‌ی باغ‌ها.', parent_id: 8, spouse_name: null },
  { id: 25, first_name: 'آوا',    last_name: 'رستمی',  gender: 'f', birth_year: 2019, death_year: null, photo: null, short_bio: 'نوه‌ی کوچکِ درخت توت.', parent_id: 15, spouse_name: null },
  { id: 26, first_name: 'آریا',   last_name: 'کریمی',  gender: 'm', birth_year: 2021, death_year: null, photo: null, short_bio: 'نواده‌ی خنده‌رو.', parent_id: 18, spouse_name: null },
  /* ---------- Family 2: مرادی — 4 generations ---------- */
  { id: 27, first_name: 'اسداله', last_name: 'مرادی',  gender: 'm', birth_year: 1928, death_year: 2008, photo: 'https://picsum.photos/seed/f-asad/300/300.jpg',  short_bio: 'امام جماعت پیشین و خطاط روستا.', parent_id: null, spouse_name: 'شیرین بی‌غم', elder_slug: 'asadollah-moradi' },
  { id: 28, first_name: 'احمد',   last_name: 'مرادی',  gender: 'm', birth_year: 1953, death_year: null, photo: 'https://picsum.photos/seed/f-ahmad/300/300.jpg', short_bio: 'معلم قرآن و ادبیات؛ دبیرِ نسل‌ها.', parent_id: 27, spouse_name: 'زینب فتحی', elder_slug: 'ahmad-moradi' },
  { id: 29, first_name: 'محبوبه', last_name: 'مرادی',  gender: 'f', birth_year: 1957, death_year: null, photo: 'https://picsum.photos/seed/f-mahboobeh/300/300.jpg', short_bio: 'قلم‌زن و نگارگر؛ دستِ پرِ روستا.', parent_id: 27, spouse_name: 'صادق رهنما', elder_slug: 'mahboobeh-moradi' },
  { id: 30, first_name: 'ابراهیم', last_name: 'مرادی', gender: 'm', birth_year: 1962, death_year: null, photo: null, short_bio: 'زنبوردار؛ صاحب باغ‌گل‌های بهاری.', parent_id: 27, spouse_name: 'خاتون اسدی' },
  { id: 31, first_name: 'سجاد',   last_name: 'مرادی',  gender: 'm', birth_year: 1979, death_year: null, photo: null, short_bio: 'کارمند بانک؛ خوش‌صدا.', parent_id: 28, spouse_name: 'مینا کاظمی' },
  { id: 32, first_name: 'زهرا',   last_name: 'مرادی',  gender: 'f', birth_year: 1983, death_year: null, photo: null, short_bio: 'خیاط خانه‌ای؛ طراح لباس محلی.', parent_id: 28, spouse_name: 'رضا وکیلی' },
  { id: 33, first_name: 'لیلا',   last_name: 'مرادی',  gender: 'f', birth_year: 1986, death_year: null, photo: null, short_bio: 'دبیر زیست‌شناسی.', parent_id: 28, spouse_name: null },
  { id: 34, first_name: 'پریسا',  last_name: 'رهنما',  gender: 'f', birth_year: 1981, death_year: null, photo: null, short_bio: 'تصویرگر کتاب‌های کودک.', parent_id: 29, spouse_name: null },
  { id: 35, first_name: 'هومن',   last_name: 'رهنما',  gender: 'm', birth_year: 1985, death_year: null, photo: null, short_bio: 'برنامه‌نویس؛ سازنده فروشگاه اینترنتی روستا.', parent_id: 29, spouse_name: null },
  { id: 36, first_name: 'سینا',   last_name: 'مرادی',  gender: 'm', birth_year: 1990, death_year: null, photo: null, short_bio: 'دانشجوی دکتری کشاورزی.', parent_id: 30, spouse_name: null },
  { id: 37, first_name: 'محمد',   last_name: 'مرادی',  gender: 'm', birth_year: 2004, death_year: null, photo: null, short_bio: 'دانش‌آموز؛ دروازه‌بان تیم والیبال.', parent_id: 31, spouse_name: null },
  { id: 38, first_name: 'یاسمین', last_name: 'مرادی',  gender: 'f', birth_year: 2007, death_year: null, photo: null, short_bio: 'دانش‌آموز و شطرنج‌باز.', parent_id: 31, spouse_name: null },
  { id: 39, first_name: 'نیکا',   last_name: 'رهنما',  gender: 'f', birth_year: 2006, death_year: null, photo: null, short_bio: 'دانش‌آموز؛ نقاشِ کوچک کارگاه نگارگری.', parent_id: 34, spouse_name: null },
  { id: 40, first_name: 'سامر',   last_name: 'رهنما',  gender: 'm', birth_year: 2010, death_year: null, photo: null, short_bio: 'پسری با چشم‌های کنجکاو.', parent_id: 35, spouse_name: null }
];