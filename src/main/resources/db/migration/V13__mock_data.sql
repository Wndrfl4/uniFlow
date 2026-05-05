-- ============================================================
-- V13: Мок деректер — пайдаланушылар, посттар, комментарийлер,
--       лайктар және хабарламалар (қазақша)
-- ============================================================

DO $$
DECLARE
    -- Пайдаланушылар (users)
    u_aibek     BIGINT;   -- IT студенті
    u_dinara    BIGINT;   -- Медицина студенті
    u_yerlan    BIGINT;   -- Заңтану студенті
    u_saltanat  BIGINT;   -- Экономика студенті
    u_askar     BIGINT;   -- Инженерия студенті
    u_madina    BIGINT;   -- Педагогика студенті
    u_zarina    BIGINT;   -- Сәулет студенті
    u_damir     BIGINT;   -- IT студенті-2
    u_prof_it   BIGINT;   -- IT оқытушысы
    u_prof_med  BIGINT;   -- Медицина оқытушысы
    u_prof_law  BIGINT;   -- Заңтану оқытушысы

    -- Посттар (posts)
    p1 BIGINT; p2 BIGINT; p3 BIGINT; p4 BIGINT; p5 BIGINT;
    p6 BIGINT; p7 BIGINT; p8 BIGINT; p9 BIGINT; p10 BIGINT;

BEGIN

-- ============================================================
-- ПАЙДАЛАНУШЫЛАР
-- Барлығы үшін пароль: "Uniflow123!" (BCrypt хэш)
-- ============================================================

-- IT студенті
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('aibek.seitkali@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Айбек', 'Сейткали', 'STUDENT', true, false,
        NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days')
RETURNING id INTO u_aibek;

-- Медицина студенті
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('dinara.bekova@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Динара', 'Бекова', 'STUDENT', true, false,
        NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days')
RETURNING id INTO u_dinara;

-- Заңтану студенті
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('yerlan.akhmetov@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Ерлан', 'Ахметов', 'STUDENT', true, false,
        NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days')
RETURNING id INTO u_yerlan;

-- Экономика студенті
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('saltanat.nurmagambetova@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Салтанат', 'Нұрмағамбетова', 'STUDENT', true, false,
        NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days')
RETURNING id INTO u_saltanat;

-- Инженерия студенті
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('askar.dzhaksybekov@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Асқар', 'Жақсыбеков', 'STUDENT', true, false,
        NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days')
RETURNING id INTO u_askar;

-- Педагогика студенті
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('madina.karimova@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Мадина', 'Қарімова', 'STUDENT', true, false,
        NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days')
RETURNING id INTO u_madina;

-- Сәулет студенті
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('zarina.ospanova@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Зарина', 'Оспанова', 'STUDENT', true, false,
        NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days')
RETURNING id INTO u_zarina;

-- IT студенті-2
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('damir.nurbekov@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Дамир', 'Нурбеков', 'STUDENT', true, false,
        NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days')
RETURNING id INTO u_damir;

-- IT оқытушысы
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('prof.umarov@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Болат', 'Умаров', 'TEACHER', true, false,
        NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days')
RETURNING id INTO u_prof_it;

-- Медицина оқытушысы
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('prof.seitkali@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Гүлнар', 'Сейткали', 'TEACHER', true, false,
        NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days')
RETURNING id INTO u_prof_med;

-- Заңтану оқытушысы
INSERT INTO users (email, password, first_name, last_name, role, enabled, anonymized, created_at, updated_at)
VALUES ('prof.mamytov@uniflow.edu',
        '$2a$10$X7PWHCDoW.Hk4xG6N45EeOFTUjxqNPN20QOoaKXyb/O9GVWnJBu5e',
        'Бауыржан', 'Мамытов', 'TEACHER', true, false,
        NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days')
RETURNING id INTO u_prof_law;

-- ============================================================
-- ПОСТТАР (жарияланған)
-- ============================================================

-- 1. IT: Python оқу жолдары
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Python тілін үйрену бойынша жол картасы 2024',
    E'Сәлем, әріптестер!\n\n'
    'Бүгін мен сіздермен Python бағдарламалау тілін меңгеру жолы туралы тәжірибемді бөліскім келеді.\n\n'
    '**1-кезең: Негіздер (1-2 ай)**\n'
    'Python синтаксисін үйреніңіз: айнымалылар, шарттар, циклдар, функциялар. '
    'https://docs.python.org — ресми құжаттама, ал "Automate the Boring Stuff with Python" кітабы бастаушыларға өте тиімді.\n\n'
    '**2-кезең: ООП және модульдер (1-2 ай)**\n'
    'Объектіге бағытталған программалауды (ООП) меңгеріңіз. Кластар, мұрагерлік, инкапсуляция — осылардың бәрін практикада қолданыңыз.\n\n'
    '**3-кезең: Фреймворктар мен кітапханалар (2-3 ай)**\n'
    '- Django немесе FastAPI (веб-разработка үшін)\n'
    '- Pandas, NumPy (деректер ғылымы үшін)\n'
    '- TensorFlow, PyTorch (жасанды интеллект үшін)\n\n'
    '**4-кезең: Нақты жобалар**\n'
    'Теорияны оқумен бірге нақты жоба жасаңыз. GitHub-та профайл жасаңыз, жобаларыңызды жариялаңыз.\n\n'
    'Ең маңыздысы — күнде кем дегенде 1-2 сағат код жазыңыз. Сәттілік тілеймін!',
    'PUBLISHED', u_aibek, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'
) RETURNING id INTO p1;

-- 2. IT: Git практикада
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Git пен GitHub: командалық жұмыстағы негізгі дағдылар',
    E'Сәлем, IT мамандығының болашақ мамандары!\n\n'
    'Бүгін Git — заманауи программисттің ажырамас құралы туралы сөйлеседік.\n\n'
    '**Git дегеніміз не?**\n'
    'Git — бұл код өзгерістерін бақылайтын версия басқару жүйесі. '
    'Командамен жұмыс істегенде бірнеше адам бір кодта бір мезгілде жұмыс істей алады.\n\n'
    '**Негізгі командалар:**\n'
    '```\n'
    'git init          — жаңа репозиторий жасау\n'
    'git clone <url>   — репозиторийді жүктеу\n'
    'git add .         — өзгерістерді индекске қосу\n'
    'git commit -m ""  — өзгерістерді сақтау\n'
    'git push origin   — серверге жіберу\n'
    'git pull          — серверден жүктеу\n'
    'git branch        — тармақтармен жұмыс\n'
    'git merge         — тармақтарды біріктіру\n'
    '```\n\n'
    '**Pull Request дегеніміз не?**\n'
    'PR — бұл сіздің командаңызға: "Менің кодымды тексеріңіз, негізгі тармаққа қосыңыз" деген сұраныс.\n\n'
    'GitHub, GitLab, Bitbucket — осы платформалардың бірінде тіркелу міндетті. '
    'Жұмысқа алу кезінде GitHub профайлыңызды сұрайды!',
    'PUBLISHED', u_aibek, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'
) RETURNING id INTO p2;

-- 3. Медицина: Анатомия
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Анатомиядан сессияға дайындалу: менің тәсілдерім',
    E'Сәлем, медицина студенттері!\n\n'
    'Анатомия — медицинаның ең қиын пәндерінің бірі. '
    'Бірақ дұрыс жоспарлау арқылы сессияны жақсы баға алып өтуге болады.\n\n'
    '**1. Атласпен жұмыс**\n'
    'Sobotta немесе Netter атластарын міндетті түрде қолданыңыз. '
    'Тек мәтінді оқу жеткіліксіз — суреттерді, схемаларды зерттеңіз.\n\n'
    '**2. Препараттармен жұмыс**\n'
    'Анатомия кабинетінде мүмкіндігінше көп уақыт өткізіңіз. '
    'Нақты препаратты ұстап, зерттеу — кітаптан оқығаннан мың есе тиімді.\n\n'
    '**3. Мнемоникалар**\n'
    'Қиын терминдерді есте сақтау үшін мнемоникалар ойлап табыңыз. '
    'Мысалы, иық өрімінің тамырлары — C5-T1.\n\n'
    '**4. Топпен оқу**\n'
    'Бір-бірлеріңізге сұрақ қойыңыз. Топпен оқыған кезде материал 40% жақсырақ есте сақталады.\n\n'
    '**5. Анки карточкалары**\n'
    'Anki қосымшасында флэш-карточкалар жасаңыз. Күнде 20-30 минут қайталау — сессия алдындағы паника жоқ!\n\n'
    'Барлығыңызға сәттілік! Медицина — ауыр жол, бірақ адамдарды сауықтыру — ұлы мақсат!',
    'PUBLISHED', u_dinara, NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days'
) RETURNING id INTO p3;

-- 4. Медицина: Практика тәжірибесі
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Клиникалық практикадан алған бірінші тәжірибем',
    E'Сәлемдер!\n\n'
    'Осы жуырда мен бірінші рет клиникаға практикаға бардым. '
    'Ол туралы тәжірибемді бөліскім келеді.\n\n'
    '**Ең алғашқы күн**\n'
    'Бірінші күні мен өте қорықтым. Науқастармен тікелей сөйлесу — '
    'мектеп стендіндегі манекенмен жұмыстан мүлдем өзгеше. '
    'Бірақ менің тәлімгерім Гүлнар Сейткали оқытушы маған жағдайды түсіндіріп, '
    'қалай сөйлесу керектігін үйретті.\n\n'
    '**Ең маңызды сабақтар:**\n'
    '1. Науқасты тыңдау — диагноздың 70% анамнезден келеді\n'
    '2. Эмпатия — медицинадағы ең маңызды дағды\n'
    '3. Нақты байқау — симптомдарды дұрыс анықтау\n'
    '4. Командамен жұмыс — дәрігерлер бірлесіп жұмыс істейді\n\n'
    '**Медицина студентіне кеңес:**\n'
    'Практикаға ерте барыңыз. Тіпті 3-курстан-ақ аурухана мен клиникаларда '
    'волонтер болуға болады. Тәжірибе — ең үлкен оқытушы!\n\n'
    'Медицина — бұл ғана жол, оны таңдаған кезде жауапкершілігіңізді ұмытпаңыз.',
    'PUBLISHED', u_dinara, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'
) RETURNING id INTO p4;

-- 5. Заңтану: Конституция
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'ҚР Конституциясының негізгі баптары: заң студентіне нұсқаулық',
    E'Сәлем, болашақ заңгерлер!\n\n'
    'Қазақстан Республикасының Конституциясы — еліміздің ең жоғары заңы. '
    'Оны жақсы білу — кез келген заңгер үшін міндетті.\n\n'
    '**Конституцияның құрылымы (9 бөлім, 99 бап):**\n\n'
    '**І бөлім: Жалпы ережелер**\n'
    'Қазақстан — демократиялық, зайырлы, құқықтық және әлеуметтік мемлекет. '
    'Мемлекеттік тіл — қазақ тілі, орыс тілі ресми қолданылады.\n\n'
    '**ІІ бөлім: Адам және азамат**\n'
    'Ең маңызды бөлім! Өмір сүру құқығы, жеке бас бостандығы, сөз бостандығы, '
    'меншік құқығы — бұлардың бәрі осында.\n\n'
    '**ІІІ бөлім: Президент**\n'
    'Президент — мемлекет басшысы және Конституцияның кепілі. '
    '5 жылға сайланады, 2 реттен артық болмайды (54-бап).\n\n'
    '**Іс жүзіндегі кеңес:**\n'
    'Конституцияны тек жаттамаңыз — мазмұнын түсініңіз. '
    'Сот тәжірибесінен мысалдар қараңыз. Конституциялық Кеңестің шешімдерін оқыңыз.',
    'PUBLISHED', u_yerlan, NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'
) RETURNING id INTO p5;

-- 6. Заңтану: Сот тәжірибесі
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Азаматтық іс жүргізу: сот мәжілісіне бірінші рет бару тәжірибесі',
    E'Сәлем!\n\n'
    'Өткен аптада Бауыржан Мамытов оқытушының ұйымдастыруымен біз '
    'Алматы қалалық сотына оқу сапарына бардық. Осы тәжірибемді бөліскім келеді.\n\n'
    '**Сот мәжілісінің барысы:**\n'
    'Азаматтық дау — меншік дауы болды. Тараптар: жауапкер мен талапкер. '
    'Судья алдымен іс мән-жайларын анықтады, содан соң тараптар сөз сөйледі.\n\n'
    '**Маған ең таңқаларлық болған:**\n'
    '- Заң тілі кітаптардағыдан мүлдем өзгеше\n'
    '- Адвокаттар өте нақты және қысқа сөйлейді\n'
    '- Дәлелдемелер (доказательства) — істің жаны\n'
    '- Сот залындағы тәртіп өте қатаң\n\n'
    '**Азаматтық іс жүргізу кодексінің негізгі принциптері:**\n'
    '1. Жариялылық принципі\n'
    '2. Жарыспалылық принципі\n'
    '3. Тараптардың теңдігі\n'
    '4. Процессуальдық эконoмия\n\n'
    'Заң студенттеріне кеңесім: сотқа барыңыздар! Іс жүргізуді тәжірибеде көру — '
    'кітаптан оқығаннан мың есе тиімді.',
    'PUBLISHED', u_yerlan, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'
) RETURNING id INTO p6;

-- 7. Экономика: Инфляция
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Инфляция дегеніміз не: экономика студентінен қарапайым тіл',
    E'Сәлем!\n\n'
    'Инфляция — барлығы естіген, бірақ аз адам дұрыс түсінетін ұғым. '
    'Бүгін мен оны қарапайым тілмен түсіндіруге тырысамын.\n\n'
    '**Инфляция дегеніміз не?**\n'
    'Инфляция — бұл тауарлар мен қызметтердің жалпы баға деңгейінің өсуі. '
    'Яғни, ақшаның сатып алу қабілеті төмендейді.\n\n'
    '**Мысал:**\n'
    '2020 жылы 1 нан 150 теңге болды. 2024 жылы сол нан 350 теңге. '
    'Инфляция осы сияқты жұмыс істейді.\n\n'
    '**Инфляцияның түрлері:**\n'
    '- Сырғанаушы (2-3%) — қалыпты, экономика үшін пайдалы\n'
    '- Жылдам (3-10%) — алаңдатады, бірақ бақылауда\n'
    '- Галопирлеуші (10-50%) — қауіпті\n'
    '- Гиперинфляция (50%+) — экономикалық апат\n\n'
    '**Инфляцияға қарсы не істеуге болады?**\n'
    '- Ұлттық Банк пайыздық мөлшерлемені өзгертеді\n'
    '- Мемлекет шығысын қысқартады\n'
    '- Валюта интервенциясы\n\n'
    'Қазақстанда инфляция деңгейі туралы Ұлттық Банктің сайтынан қарауға болады.',
    'PUBLISHED', u_saltanat, NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days'
) RETURNING id INTO p7;

-- 8. Экономика: Стартап
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Студент ретінде стартап іске қосу: менің тәжірибем',
    E'Сәлем, болашақ кәсіпкерлер!\n\n'
    'Мен 3-курс экономика студентімін. Осы жылы бірінші шағын бизнесімді іске қостым. '
    'Тәжірибемді бөліскім келеді.\n\n'
    '**Идея:**\n'
    'Университет студенттеріне арналған репетиторлық платформа. '
    'Жоғары курс студенттері 1-2 курс студенттеріне ақылы сабақ береді.\n\n'
    '**Іске қосу кезеңдері:**\n'
    '1. **Идеяны тексеру** — 20 студентпен сұхбат жасадым. Қажеттілік бар ма?\n'
    '2. **MVP жасау** — қарапайым Telegram боты. Тек репетитор табу функциясы.\n'
    '3. **Пилот** — 10 репетитор, 30 студент. Бір ай жұмыс.\n'
    '4. **Кері байланыс** — не жақсы, не жаман екенін анықтау.\n'
    '5. **Жетілдіру** — ақшалай транзакциялар, рейтинг жүйесі.\n\n'
    '**Маңызды сабақтар:**\n'
    '- Нарықты алдымен зерттеңіз\n'
    '- Мінсіз болмаса да, ерте іске қосыңыз\n'
    '- Клиенттер пікірін үнемі тыңдаңыз\n'
    '- Командасыз жалғыз кәсіпкер — қиын жол\n\n'
    'Қазір бізде айына 150+ транзакция бар. Кішкентай бастама — үлкен нәтиже!',
    'PUBLISHED', u_saltanat, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'
) RETURNING id INTO p8;

-- 9. Инженерия: AutoCAD
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'AutoCAD-та сызба жасау: инженер студентіне практикалық нұсқаулық',
    E'Сәлем, инженерия факультетінің студенттері!\n\n'
    'AutoCAD — заманауи инженердің ең маңызды құралдарының бірі. '
    'Бүгін мен негізгі командалар мен тәсілдерді бөліскім келеді.\n\n'
    '**AutoCAD негіздері:**\n'
    'AutoCAD — Autodesk компаниясының 2D/3D сызба жасауға арналған бағдарламасы. '
    'Студентке тегін лицензия бар: autodesk.com/education.\n\n'
    '**Маңызды командалар:**\n'
    '```\n'
    'L (Line)      — сызық салу\n'
    'C (Circle)    — шеңбер салу\n'
    'REC (Rect)    — тіктөртбұрыш\n'
    'TR (Trim)     — кесу\n'
    'EX (Extend)   — ұзарту\n'
    'M (Move)      — жылжыту\n'
    'CO (Copy)     — көшіру\n'
    'DIM           — өлшем қою\n'
    'HATCH         — штриховка\n'
    '```\n\n'
    '**Курстық жоба жасау кезеңдері:**\n'
    '1. Масштабты анықтаңыз (1:100, 1:50)\n'
    '2. Қабаттарды (layers) дұрыс реттеңіз\n'
    '3. Өлшем стилін ГОСТ бойынша баптаңыз\n'
    '4. Штамп (угловой штамп) дұрыс толтырыңыз\n'
    '5. PDF форматта экспорт жасаңыз\n\n'
    'Сызба жасауды AutoCAD-та үйрену — болашақта SolidWorks немесе Revit-ке '
    'оңай өту мүмкіндігін береді.',
    'PUBLISHED', u_askar, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'
) RETURNING id INTO p9;

-- 10. Педагогика: Оқыту әдістері
INSERT INTO posts (title, content, status, author_id, created_at, updated_at)
VALUES (
    'Заманауи оқыту технологиялары: педагогика студентінің көзқарасы',
    E'Сәлем!\n\n'
    'Педагогика — тек сабақ беру емес, ол — ғылым. '
    'Бүгін заманауи оқыту технологиялары туралы сөйлеседік.\n\n'
    '**Дәстүрлі vs Заманауи оқыту:**\n'
    'Дәстүрлі: мұғалім айтады — оқушы тыңдайды.\n'
    'Заманауи: оқушы іздейді, ашады, зерттейді — мұғалім бағыттайды.\n\n'
    '**Тиімді оқыту технологиялары:**\n\n'
    '**1. Флипп класс (Flipped Classroom)**\n'
    'Үйде бейне лекцияны қарайды, класта — тапсырмаларды шешеді. '
    'Уақытты тиімді пайдалану!\n\n'
    '**2. Геймификация**\n'
    'Оқуды ойынға айналдыру. Kahoot!, Quizlet, Duolingo — осының мысалдары. '
    'Студенттердің ынтасын арттырады.\n\n'
    '**3. Жобалық оқыту (Project-based learning)**\n'
    'Нақты мәселені шешу арқылы оқу. Студент практикада дағды қалыптастырады.\n\n'
    '**4. Критикалық ойлау дамыту**\n'
    'Сократ әдісі: сұрақ-жауап арқылы ойлауды дамыту. '
    '"Неге?" деген сұрақты үнемі қойыңыз.\n\n'
    '**5. Цифрлық технологиялар**\n'
    'Google Classroom, Moodle, Zoom — заманауи оқытудың ажырамас бөлігі.\n\n'
    'Болашақ мұғалімдер — болашақ ұрпақты тәрбиелейміз. Үлкен жауапкершілік!',
    'PUBLISHED', u_madina, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'
) RETURNING id INTO p10;

-- ============================================================
-- ТЕГТЕР (tags)
-- ============================================================

INSERT INTO post_tags (post_id, tag) VALUES
    (p1, 'python'), (p1, 'программалау'), (p1, 'IT'),
    (p2, 'git'), (p2, 'github'), (p2, 'IT'),
    (p3, 'медицина'), (p3, 'анатомия'), (p3, 'сессия'),
    (p4, 'медицина'), (p4, 'практика'), (p4, 'клиника'),
    (p5, 'заңтану'), (p5, 'конституция'), (p5, 'ҚР'),
    (p6, 'заңтану'), (p6, 'сот'), (p6, 'азаматтық'),
    (p7, 'экономика'), (p7, 'инфляция'), (p7, 'финанс'),
    (p8, 'экономика'), (p8, 'стартап'), (p8, 'бизнес'),
    (p9, 'инженерия'), (p9, 'autocad'), (p9, 'сызба'),
    (p10, 'педагогика'), (p10, 'оқыту'), (p10, 'технология');

-- ============================================================
-- ЛАЙКТАР
-- ============================================================

INSERT INTO post_likes (post_id, user_id) VALUES
    -- p1 (Python): лайктайды
    (p1, u_damir), (p1, u_saltanat), (p1, u_madina), (p1, u_zarina),
    (p1, u_prof_it),
    -- p2 (Git)
    (p2, u_damir), (p2, u_askar), (p2, u_yerlan), (p2, u_prof_it),
    -- p3 (Анатомия)
    (p3, u_aibek), (p3, u_madina), (p3, u_zarina), (p3, u_yerlan),
    (p3, u_prof_med),
    -- p4 (Клиника)
    (p4, u_saltanat), (p4, u_madina), (p4, u_prof_med), (p4, u_aibek),
    -- p5 (Конституция)
    (p5, u_saltanat), (p5, u_madina), (p5, u_damir), (p5, u_prof_law),
    -- p6 (Сот)
    (p6, u_aibek), (p6, u_dinara), (p6, u_prof_law), (p6, u_saltanat),
    -- p7 (Инфляция)
    (p7, u_aibek), (p7, u_damir), (p7, u_yerlan), (p7, u_madina),
    (p7, u_zarina),
    -- p8 (Стартап)
    (p8, u_aibek), (p8, u_damir), (p8, u_askar), (p8, u_dinara),
    (p8, u_yerlan), (p8, u_zarina), (p8, u_madina), (p8, u_prof_it),
    -- p9 (AutoCAD)
    (p9, u_damir), (p9, u_aibek), (p9, u_zarina),
    -- p10 (Педагогика)
    (p10, u_aibek), (p10, u_dinara), (p10, u_yerlan), (p10, u_saltanat),
    (p10, u_damir), (p10, u_prof_it);

-- ============================================================
-- КОММЕНТАРИЙЛЕР
-- ============================================================

-- p1: Python жол картасы
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p1, u_damir,    'Өте пайдалы мақала! Мен қазір 1-кезеңдемін, Python негіздерін үйреніп жатырмын. Кішкентай жобалар жасауға кеңес берер мсіз?', NOW() - INTERVAL '44 days'),
(p1, u_aibek,    '@Дамир, иә! Кішкентай есептер шығарыңыз: калькулятор, сандарды бағыттау, қарапайым ойындар. LeetCode-тың Easy деңгейіндегі есептерін шешіңіз.', NOW() - INTERVAL '43 days'),
(p1, u_zarina,   'Мен де Python үйренгім келеді. Сәулет мамандығымда ғимараттарды автоматты анализдеу үшін пайдаланғым келеді.', NOW() - INTERVAL '42 days'),
(p1, u_prof_it,  'Жақсы мақала! Тағы қосарым: алгоритмдер мен деректер құрылымын (data structures) ерте үйреніңіз. Бұл кез келген тілде жұмыс істейді.', NOW() - INTERVAL '40 days'),
(p1, u_saltanat, 'Python-ды Excel макростарын ауыстыру үшін пайдалансам болады ма? Экономика есептері үшін.', NOW() - INTERVAL '39 days');

-- p2: Git
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p2, u_askar,    'Өте қажетті тақырып! Бізде топтық жоба болды — Git-ты білмегендіктен файлдарды email арқылы жіберіп жатыр едік 😅 Енді міндетті түрде үйренемін!', NOW() - INTERVAL '39 days'),
(p2, u_aibek,    '@Асқар, ха-ха, бұл классикалық жағдай! Git-ты үйренгеннен кейін: "Бұрын қалай өмір сүрдім?" деп ойлайсыз 😄', NOW() - INTERVAL '38 days'),
(p2, u_yerlan,   'Заңтану студенті ретінде айтарым: заңгерлер де құжат версияларын бақылау үшін Git секілді жүйе пайдалана алар еді. Контракттардың версиялары...', NOW() - INTERVAL '37 days'),
(p2, u_prof_it,  'GitHub Student Pack туралы айтпадыңыз — студентке 200$+ тегін құралдар бар. github.education/pack сайтын тексеріңіздер.', NOW() - INTERVAL '36 days');

-- p3: Анатомия
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p3, u_aibek,    'Менің туысым медицина студенті, ол да осы Анки карточкаларын пайдаланады! Керемет тәсіл екен. Басқа факультет студенттері де пайдалана алады.', NOW() - INTERVAL '37 days'),
(p3, u_madina,   'Педагогика тұрғысынан айтарым: мнемоника — ең тиімді есте сақтау тәсілдерінің бірі. Когнитив психология дәлелдеген.', NOW() - INTERVAL '36 days'),
(p3, u_prof_med, 'Динара, өте жақсы кеңестер! Анатомиядан озат студенттер — дәл осылай оқиды. Тағы бір кеңес: Gray''s Anatomy атласы + анатомиялық моделдер дүкенінде пластик модельдер сатып алыңдар.', NOW() - INTERVAL '35 days'),
(p3, u_zarina,   'Сәулет мамандығы үшін де анатомия пайдалы! Адам ауқымына (эргономика) лайық кеңістік жасауда керек.', NOW() - INTERVAL '33 days');

-- p4: Клиника
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p4, u_saltanat, 'Бұл оқу сапары менде де болды. Сот залына барғанда да дәл осы сезімді сезіндім — теория мен практика арасындағы алшақтық.', NOW() - INTERVAL '29 days'),
(p4, u_madina,   'Эмпатия туралы бөлімге толық қосыламын. Кез келген мамандықта адамдармен жұмыс істесе — эмпатия ең маңызды дағды.', NOW() - INTERVAL '28 days'),
(p4, u_prof_med, 'Динара, сіздің осы рефлексия жасау қабілетіңіз — болашақ дәрігердің белгісі. Клиникалық тәжірибені жазып алу дағдысын сақтаңыз.', NOW() - INTERVAL '27 days');

-- p5: Конституция
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p5, u_madina,   'Педагогика бағдарламасында да Конституция пәні бар. Бірақ заң студенттерінің тереңдігінде емес. Бұл мақала мені конституцияны қайтадан оқып шығуға ынталандырды!', NOW() - INTERVAL '34 days'),
(p5, u_damir,    '54-бап туралы айтқаныңыз маңызды. Саяси науаларда бұл бап жиі талқыланады. Конституциялық Кеңес шешімдерін қайдан оқуға болады?', NOW() - INTERVAL '33 days'),
(p5, u_yerlan,   '@Дамир, ksksm.gov.kz — Конституциялық Кеңестің ресми сайты. Барлық шешімдер қазақша және орысша жарияланады.', NOW() - INTERVAL '32 days'),
(p5, u_prof_law, 'Ерлан, жақсы мақала! Ескерту: 54-бап президент өкілеттік мерзімі туралы — соңғы өзгертулерді де атаңыз. 2022 жылғы референдум нәтижесінде Конституцияға өзгерістер енгізілді.', NOW() - INTERVAL '30 days');

-- p6: Сот тәжірибесі
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p6, u_aibek,    'Заңды жақсы білу — тек заңгерге емес, барлығына керек! IT-да да лицензиялық шарттар, жеке деректер заңы маңызды.', NOW() - INTERVAL '27 days'),
(p6, u_dinara,   'Медицинада да сот болады — медициналық дауlar. Дұрыс емдемеген үшін іс қозғайды. Осы себепті медициналық этика мен заңды білу міндетті!', NOW() - INTERVAL '26 days'),
(p6, u_prof_law, 'Өте жақсы байқаулар. Тағы қосарым: прокуратура тағылымдамасы (практика) туралы да мақала жазсаңыз, пайдалы болар еді.', NOW() - INTERVAL '25 days');

-- p7: Инфляция
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p7, u_aibek,    'Нанның бағасы мысалы — өте нақты түсіндіру! Экономиканы қарапайым мысалмен түсіндіру — үлкен дағды.', NOW() - INTERVAL '31 days'),
(p7, u_damir,    'Қазақстандағы инфляция 2023 жылы 18-20% болды. Бұл "жылдам" санатына жатады. Ұлттық Банк пайыздық мөлшерлемені 16,75%-ке дейін көтерді.', NOW() - INTERVAL '30 days'),
(p7, u_yerlan,   'Инфляция заңгерлерге де тікелей әсер етеді — контракттарда индексация (инфляцияға бейімдеу) шарттарын жазу маңызды.', NOW() - INTERVAL '29 days'),
(p7, u_madina,   'Мектепте экономиканы дұрыс оқытсақ, халық финансты жақсы түсінер еді. Мен болашақта мектепте осы тақырыпты жақсы түсіндіргім келеді!', NOW() - INTERVAL '28 days');

-- p8: Стартап
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p8, u_aibek,    'Telegram боты идеясы — керемет MVP! Мен де IT жағынан осындай жобаға серіктес болуға дайынмын. Бот серверлік жағынан не пайдаланасыз?', NOW() - INTERVAL '24 days'),
(p8, u_saltanat, '@Айбек, Python + Aiogram кітапханасы. Серверде Heroku пайдаланамыз. Тегін tier жеткілікті. Хабарласыңыз!', NOW() - INTERVAL '23 days'),
(p8, u_damir,    'MVP-ді ерте іске қосу — Lean Startup методологиясы. Эрик Рис кітабын оқыдыңыз ба? "The Lean Startup" — кәсіпкерліктің Інжілі.', NOW() - INTERVAL '22 days'),
(p8, u_askar,    'Инженерияда да осындай платформа керек. Курстық жоба жасауда тәжірибелі студент іздейміз жиі.', NOW() - INTERVAL '21 days'),
(p8, u_prof_it,  'Керемет бастама! Қазақстан стартап экожүйесі туралы: NURIS, QazTech Ventures — мемлекеттік гранттар бар. Іздеңіз!', NOW() - INTERVAL '20 days');

-- p9: AutoCAD
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p9, u_damir,    'Студент лицензиясы туралы білмейттінмін! Autodesk Education-ға тіркелдім. Рахмет!', NOW() - INTERVAL '21 days'),
(p9, u_aibek,    'AutoCAD пен Python-ды байланыстыруға болады — pyautocad кітапханасы бар. Қайталанатын сызба жұмыстарын автоматтандыруға болады!', NOW() - INTERVAL '20 days'),
(p9, u_zarina,   'Сәулет мамандығы үшін AutoCAD-тан басқа Revit BIM маңыздырақ болды. Бірақ негіз ретінде AutoCAD міндетті. Жақсы мақала!', NOW() - INTERVAL '19 days');

-- p10: Педагогика
INSERT INTO comments (post_id, author_id, content, created_at) VALUES
(p10, u_aibek,   'Геймификация туралы бөлім маған ұнады. Kahoot-ты университетте де пайдалансақ болады — лектор сабақ соңында тест жасаса.', NOW() - INTERVAL '19 days'),
(p10, u_dinara,  'Медицинада да Flipped Classroom кеңінен қолданылады. Лекция бейне форматта — аудиторияда практикалық жағдайлар шешіледі.', NOW() - INTERVAL '18 days'),
(p10, u_yerlan,  'Сократ әдісі — заң мектептерінде жүздеген жылдан бері қолданылады! Casebook method деп аталады.', NOW() - INTERVAL '17 days'),
(p10, u_saltanat,'Мektепте жақсы мұғалім болған кісіге Рахмет айтқым келеді — олар өмірімді өзгертті. Болашақ мұғалімдер — үлкен миссия!', NOW() - INTERVAL '16 days'),
(p10, u_damir,   'Moodle-дан Notion-ға ауысқан кластар бар. Notion-ды курс материалдары үшін пайдалансақ болады ма?', NOW() - INTERVAL '15 days');

-- ============================================================
-- ХАТ АЛМАСУЛАР (messages) — оқу туралы қазақша диалогтар
-- ============================================================

-- Диалог 1: Айбек ↔ Дамир (IT студенттері)
INSERT INTO messages (sender_id, receiver_id, content, type, is_read, created_at) VALUES
(u_aibek, u_damir, 'Дамир, сәлем! React-тан Django REST-ке сұраныс жіберуде мәселе бар. CORS қатесі шығады. Сен осымен кездестің бе?', 'TEXT', true, NOW() - INTERVAL '20 days'),
(u_damir, u_aibek, 'Сәлем! Иә, классикалық мәселе 😄 Django-да corsheaders кітапханасын орнату керек. pip install django-cors-headers, содан settings.py-да CORS_ALLOWED_ORIGINS-ке React адресін қос.', 'TEXT', true, NOW() - INTERVAL '20 days' + INTERVAL '5 minutes'),
(u_aibek, u_damir, 'Тексердім — жұмыс істеді! Рахмет! Ал JWT токен жаңартуда да мәселе бар. Access токен бітсе не болады?', 'TEXT', true, NOW() - INTERVAL '20 days' + INTERVAL '10 minutes'),
(u_damir, u_aibek, 'Refresh token пайдаланасың ба? Axios interceptor-ды баптау керек — 401 жауап келсе, автоматты токен жаңарту болады. Мысал кодты жібере аламын.', 'TEXT', true, NOW() - INTERVAL '20 days' + INTERVAL '15 minutes'),
(u_aibek, u_damir, 'Жіберші! Курстық жоба қорғауы 2 аптада. Аяқтауым керек 🙏', 'TEXT', true, NOW() - INTERVAL '20 days' + INTERVAL '20 minutes'),
(u_damir, u_aibek, 'Міне код: client.interceptors.response.use(... Whatsapp-та жіберемін, ол жерде форматтау жақсырақ.', 'TEXT', true, NOW() - INTERVAL '20 days' + INTERVAL '25 minutes'),
(u_aibek, u_damir, 'Жарайды. Кешке кофе ішіп, жобаны бірге тексерейік?', 'TEXT', true, NOW() - INTERVAL '20 days' + INTERVAL '30 minutes'),
(u_damir, u_aibek, '18:00-де кітапханада. Тамаша! 👍', 'TEXT', true, NOW() - INTERVAL '20 days' + INTERVAL '35 minutes');

-- Диалог 2: Динара ↔ Мадина (Медицина ↔ Педагогика)
INSERT INTO messages (sender_id, receiver_id, content, type, is_read, created_at) VALUES
(u_dinara, u_madina, 'Мадина, сәлем! Сенің педагогика оқулықтарыңды оқыдым. Мнемоника туралы айттың — анатомиядан мысал жасауға көмектесе аласың ба?', 'TEXT', true, NOW() - INTERVAL '18 days'),
(u_madina, u_dinara, 'Сәлем Динара! Әрине! Мнемоника жасау принципі: сөздің бас әріптерін алып, жаңа сөз немесе сөйлем жасайсың. Қандай тақырып?', 'TEXT', true, NOW() - INTERVAL '18 days' + INTERVAL '10 minutes'),
(u_dinara, u_madina, 'Краниальды нервтер — олардың реті мен атаулары. 12 нерв бар!', 'TEXT', true, NOW() - INTERVAL '18 days' + INTERVAL '15 minutes'),
(u_madina, u_dinara, 'Классика! Орысша мнемоника: "Обоняет, Зрит, Глазодвигает, Блок, Тройничный, Отводит, Лицевой, Вестибуло, Языкоглоточный, Блуждает, Добавочный, Подъязычный". Бас әріптер: О-З-Г-Б-Т-О-Л-В-Я-Б-Д-П.', 'TEXT', true, NOW() - INTERVAL '18 days' + INTERVAL '20 minutes'),
(u_dinara, u_madina, 'Керемет! Бұл менің ойламаған тәсілім. Педагогика — шынымен ғылым екен. Рахмет!', 'TEXT', true, NOW() - INTERVAL '18 days' + INTERVAL '25 minutes'),
(u_madina, u_dinara, 'Медицинаны оқыту — өте қиын жұмыс. Мен болашақта медицина мектептерінде оқыту методикасымен айналысқым келеді!', 'TEXT', true, NOW() - INTERVAL '18 days' + INTERVAL '30 minutes'),
(u_dinara, u_madina, 'О, бұл өте маңызды мамандық. Жақсы медицина оқытушысы — болашақ дәрігерлерді тәрбиелейді. Армандарыңа жет!', 'TEXT', false, NOW() - INTERVAL '18 days' + INTERVAL '35 minutes');

-- Диалог 3: Ерлан ↔ Салтанат (Заңтану ↔ Экономика)
INSERT INTO messages (sender_id, receiver_id, content, type, is_read, created_at) VALUES
(u_yerlan, u_saltanat, 'Салтанат, сәлем! Стартап мақалаңды оқыдым — өте қызықты! Заңдық жақтан сұрайын: ЖК ашу керек пе бизнес үшін?', 'TEXT', true, NOW() - INTERVAL '15 days'),
(u_saltanat, u_yerlan, 'Сәлем Ерлан! Рахмет! Бастапқыда ЖК ашпадым — алдымен MVP тексердім. Бірақ ақша алуға кірісу алдында ЖК немесе ЖШС ашу заңды.', 'TEXT', true, NOW() - INTERVAL '15 days' + INTERVAL '8 minutes'),
(u_yerlan, u_saltanat, 'ЖК (жеке кәсіпкер) ашу оңай — egov.kz арқылы онлайн. Салық жүйесі: жеңілдетілген декларация немесе патент. Ай сайын 1% болады айналымнан.', 'TEXT', true, NOW() - INTERVAL '15 days' + INTERVAL '12 minutes'),
(u_saltanat, u_yerlan, 'Патент туралы білмеппін! Репетиторлық қызмет үшін қолданса болады ма?', 'TEXT', true, NOW() - INTERVAL '15 days' + INTERVAL '18 minutes'),
(u_yerlan, u_saltanat, 'Иә, білім беру қызметі патент негізінде жұмыс істей алады. Бірақ нақты шарттарды Кәсіпкерлік кодексінен тексер — 2024 жылдан өзгеріс болды.', 'TEXT', true, NOW() - INTERVAL '15 days' + INTERVAL '25 minutes'),
(u_saltanat, u_yerlan, 'Сен — болашақ тамаша заңгер! Рахмет! Жобама заңдық кеңесші ретінде қосылғың келе ме? 😊', 'TEXT', true, NOW() - INTERVAL '15 days' + INTERVAL '30 minutes'),
(u_yerlan, u_saltanat, 'Ха-ха, тегін тәжірибе ретінде келісемін! Бірақ диплом алғаннан кейін ақылы болады 😄', 'TEXT', true, NOW() - INTERVAL '15 days' + INTERVAL '35 minutes'),
(u_saltanat, u_yerlan, 'Келісім! 🤝 Алдымен іске қоялық, содан ойлармыз.', 'TEXT', false, NOW() - INTERVAL '15 days' + INTERVAL '40 minutes');

-- Диалог 4: Асқар ↔ Зарина (Инженерия ↔ Сәулет)
INSERT INTO messages (sender_id, receiver_id, content, type, is_read, created_at) VALUES
(u_askar, u_zarina, 'Зарина, сәлем! Сенің мамандығың — сәулет. AutoCAD пен Revit екеуін де пайдаланасың ба?', 'TEXT', true, NOW() - INTERVAL '12 days'),
(u_zarina, u_askar, 'Сәлем Асқар! Иә, AutoCAD 2D сызбалар үшін, Revit — 3D BIM жоба үшін. Олардың айырмашылығы үлкен. Revit — тек сызба емес, бүкіл ғимараттың ақпараттық моделі.', 'TEXT', true, NOW() - INTERVAL '12 days' + INTERVAL '5 minutes'),
(u_askar, u_zarina, 'Инженерияда да BIM-ге ауысу болуда. Конструктивтік есептер үшін Robot Structural Analysis мен Revit интеграциясын пайдаланамыз.', 'TEXT', true, NOW() - INTERVAL '12 days' + INTERVAL '15 minutes'),
(u_zarina, u_askar, 'О, бұл керемет! Сәулет + конструктивтік инженерия бірге жұмыс істесе — ғимарат жобасы дұрыс шығады. BIM жобада олар бір файлда жұмыс істей алады.', 'TEXT', true, NOW() - INTERVAL '12 days' + INTERVAL '20 minutes'),
(u_askar, u_zarina, 'Оқу орнымызда BIM бойынша ортақ курстық жоба жасасақ болмай ма? Инженерия + Сәулет студенттер бірлесіп.', 'TEXT', true, NOW() - INTERVAL '12 days' + INTERVAL '25 minutes'),
(u_zarina, u_askar, 'Тамаша идея! Менің жетекшім осы семестрде ортақ жоба ұсыныс жасауды айтқан. Бірге профессорларға ұсынайық!', 'TEXT', true, NOW() - INTERVAL '12 days' + INTERVAL '30 minutes'),
(u_askar, u_zarina, 'Жарайды! Ертең кездесіп, ұсыныс дайындайық. 14:00 кафедрада?', 'TEXT', false, NOW() - INTERVAL '12 days' + INTERVAL '35 minutes');

-- Диалог 5: IT Оқытушы ↔ Айбек (Профессор ↔ Студент)
INSERT INTO messages (sender_id, receiver_id, content, type, is_read, created_at) VALUES
(u_prof_it, u_aibek, 'Айбек, блогыңда Python мен Git туралы мақалалар жаздыңыз. Жақсы бастама! Курстық жобаңда REST API қандай технологиямен жасайсыз?', 'TEXT', true, NOW() - INTERVAL '10 days'),
(u_aibek, u_prof_it, 'Болат Умарович, сәлем! Рахмет! Django REST Framework пайдаланамын. PostgreSQL-мен байланыстыруды аяқтадым, JWT аутентификация да дайын.', 'TEXT', true, NOW() - INTERVAL '10 days' + INTERVAL '2 hours'),
(u_prof_it, u_aibek, 'Керемет! Тест жабу деңгейі қандай? Unit тестілер жаздыңыз ба?', 'TEXT', true, NOW() - INTERVAL '10 days' + INTERVAL '2 hours' + INTERVAL '30 minutes'),
(u_aibek, u_prof_it, 'Шынымды айтсам, тестілер аз жаздым — тек 3 endpoint үшін. Уақытым жетпеді. Қорғауда мәселе болып кетпес пе?', 'TEXT', true, NOW() - INTERVAL '9 days'),
(u_prof_it, u_aibek, 'Тест Coverage аз болса — 1 балл кемітемін. Бірақ критикалық функционалға тест жазсаңыз жеткілікті. Аутентификация мен негізгі CRUD тестіленсе — ол жақсы.', 'TEXT', true, NOW() - INTERVAL '9 days' + INTERVAL '1 hour'),
(u_aibek, u_prof_it, 'Түсіндім. Бүгін кешке тестілерді жазамын. Pytest немесе unittest пайдалансам болады ма?', 'TEXT', true, NOW() - INTERVAL '9 days' + INTERVAL '2 hours'),
(u_prof_it, u_aibek, 'Django үшін pytest-django кітапханасы ыңғайлырақ. factory_boy-ды тест деректері үшін пайдаланыңыз. Сәттілік!', 'TEXT', false, NOW() - INTERVAL '9 days' + INTERVAL '3 hours');

-- Диалог 6: Мадина ↔ Ерлан (Педагогика ↔ Заңтану)
INSERT INTO messages (sender_id, receiver_id, content, type, is_read, created_at) VALUES
(u_madina, u_yerlan, 'Ерлан, сәлем! Балалар құқығы бойынша сұрайын — мектепте бала зорлыққа ұшыраса, мұғалім заңды жауапкершілік алады ма?', 'TEXT', true, NOW() - INTERVAL '8 days'),
(u_yerlan, u_madina, 'Сәлем Мадина! Маңызды сұрақ! Иә, мұғалім хабарламаса — "хабарламау" үшін жауапкершілік болуы мүмкін. ҚК 136-бап туралы оқы.', 'TEXT', true, NOW() - INTERVAL '8 days' + INTERVAL '1 hour'),
(u_madina, u_yerlan, 'Мектептегі психологтың рөлі? Олар не міндетті хабарлауы керек?', 'TEXT', true, NOW() - INTERVAL '8 days' + INTERVAL '2 hours'),
(u_yerlan, u_madina, '"Баланың құқықтары туралы" Заңда — кез келген маман бала зорлыққа ұшырағанда ішкі істер органдарына хабарлауға міндетті. Психолог та, мұғалім де.', 'TEXT', true, NOW() - INTERVAL '8 days' + INTERVAL '3 hours'),
(u_madina, u_yerlan, 'Рахмет! Педагогика студенттері бұл туралы аз біледі. Мен дипломдық жұмысымды "Мұғалімнің заңдық сауаттылығы" тақырыбына жаза аламын!', 'TEXT', true, NOW() - INTERVAL '8 days' + INTERVAL '4 hours'),
(u_yerlan, u_madina, 'Тамаша тақырып! Егер дипломдықта заңдық бөлімді тексертуге кімнен сұрарыңды білмесеңіз — хабарлас, көмектесемін.', 'TEXT', false, NOW() - INTERVAL '7 days');

END $$;
