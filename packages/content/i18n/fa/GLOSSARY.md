# Persian glossary (fa)

Use these renderings everywhere: in the translations of the books, the lessons, the terms, the tests and the
interface. The running text keeps the technical terms (column "فارسی: in the text") as the ḥawza teaches ṣarf and naḥw
in Persian in Iran and Afghanistan (Ṣarf-i Mīr, ʿAwāmil, Hidāya, Ṣamadiyya, Sharḥ-i Amthila, the Jāmī, the
Mughnī; the Ḥanafī madāris of Afghanistan and Khorasan read Mīzān, Munshaʿib, Naḥw-i Mīr and the Kāfiya). When the
reader taps such a word, a pop-up gives the plain word (column "pop-up"; a dash: no pop-up). The pop-ups are in
`packages/content/glossary/fa.json`; keep that file in step with this list. The concepts and their order follow the
English source list, `packages/content/i18n/GLOSSARY.md`.

## Style

- Plain, clear standard Persian (as written in Iran and Afghanistan alike: no words of only one country where a
  shared one exists), in the register of the ḥawza's Persian shurūḥ: short sentences, the author's order; no
  paraphrase and no commentary in a translation.
- The technical terms are the Arabic terms as the Persian books write them (فعل ماضی، فعل مضارع، مصدر، اسم فاعل، اعراب،
  مرفوع، منصوب، مجرور، مجزوم، مبتدا، خبر، فاعل، مفعولٌ‌به). Persian letters ی and ک in the Persian text; the zero-width
  non-joiner where Persian writes it (می‌شود، کلمه‌ها، مفعول‌به); the izafe after ه as ٔ (جملهٔ اسمیّه، صیغهٔ مبالغه),
  otherwise unwritten; tashdīd on the terms where it helps reading (مرکّب، معتلّ، مذکّر، مؤنّث، جرّ).
- **Arabic examples** inside a passage stay in Arabic script, fully vocalised, with the meaning after them in
  Persian: «قَامَ زَيْدٌ (زید برخاست)». Arabic quotations, forms and paradigms are copied exactly as in the source,
  with Arabic ي and ك.
- Where the English gives an English word with its transliteration ("the doer (fāʿil)"), the Persian term already is
  that Arabic term, so it is written once (فاعل). No Latin transliterations in brackets in the running text, and no
  Persian-grammar terms that stand for something else (نهاد، گزاره، مسند، مسندالیه، متمّم، حرف اضافه are not used).
- Proper names in Persian script, without the Arabic article, as in the Persian books: سیبویه، ابن مالک، ابن آجرّوم، ابن
  هشام، عبدالقاهر جرجانی، میر سید شریف جرجانی، برکوی، ابن حاجب؛ Zayd and ʿAmr: زید، عمرو. Book titles: آجرّومیّه،
  الفیّه، کافیه، عوامل، هدایة النحو، نحو میر، میزان الصرف، قطر الندی.
- Dates as in the English (“723/1323”); “d.” becomes “درگذشتهٔ” (“(درگذشتهٔ 723ق/1323م)”). Quotation marks « ».
- Headings of the book are translated: «باب کلام»، «باب اعراب»، «فصل».
- **Reserved words.** Some terms are also everyday Persian words; do not use them in their everyday sense:
  - کلمه only for the word of the grammarians (اسم، فعل، حرف); a word in general is واژه;
  - حرف for a particle and for a letter, as the books say; where they must be kept apart: «حرف (حرف معنا)» and «حرف
    (حرف الفبا)»; in everyday sense “speech, talk” never حرف, but سخن;
  - خبر only for the predicate (news: آگاهی); حال only for the ḥāl (a state in general: وضع، چگونگی); صفت only for the
    adjective (naʿt), a quality in general: ویژگی؛ باب only for a chapter and a conjugation class.

## Words

### The two sciences and speech

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| Morphology (ṣarf) | عِلْمُ الصَّرْفِ | علم صرف | دانش ساختمان کلمه |
| Syntax (naḥw) | عِلْمُ النَّحْوِ | علم نحو | دانش ترکیب جمله و حرکت آخر کلمه |
| The word | الكَلِمَةُ | کلمه | لفظ مفرد معنادار |
| Speech | الكَلَامُ | کلام | سخنی که فایدهٔ تامّ دهد |
| Utterance | اللَّفْظُ | لفظ | — |
| Compound | المُرَكَّبُ | مرکّب | — |
| Conveying a complete meaning | المُفِيدُ | مفید | — |
| By convention | بِالوَضْعِ | به وضع (به قرارداد عرب) | — |
| Conjugation | التَّصْرِيفُ | تصریف؛ گردان (verb: صرف کردن، گرداندن) | ساختن صیغه‌های دیگر از یک کلمه |
| A conjugation table | الأَمْثِلَةُ | امثله؛ صرف صغیر / صرف کبیر | — |
| Heard / by analogy | سَمَاعِيٌّ / قِيَاسِيٌّ | سماعی / قیاسی | — |

### The kinds of word

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The noun | الاسْمُ | اسم | — |
| The verb | الفِعْلُ | فعل | — |
| The particle | الحَرْفُ | حرف | — |
| A particle that brings a meaning | حَرْفٌ جَاءَ لِمَعْنًى | حرفی که برای معنایی آمده است | — |
| Sign | العَلَامَةُ | علامت (نشانه) | — |
| Nunation | التَّنْوِينُ | تنوین | — |
| The article al- | الأَلِفُ وَاللَّامُ | الف و لام | — |
| The particles of khafḍ | حُرُوفُ الخَفْضِ | حروف خفض (حروف جرّ) | — |
| The particles of oath | حُرُوفُ القَسَمِ | حروف قسم | — |
| The quiescent tāʾ of the feminine | تَاءُ التَّأْنِيثِ السَّاكِنَةُ | تاء تأنیث ساکن | — |
| Definite / indefinite | المَعْرِفَةُ / النَّكِرَةُ | معرفه / نکره | شناخته / ناشناخته |
| The pronoun | الضَّمِيرُ، المُضْمَرُ | ضمیر، مضمر | — |
| The proper name | العَلَمُ | عَلَم | — |
| The demonstrative | اسْمُ الإِشَارَةِ | اسم اشاره | — |
| The vague noun | الاسْمُ المُبْهَمُ | اسم مبهم | — |
| The relative noun | الاسْمُ المَوْصُولُ | اسم موصول | — |
| Masculine / feminine | المُذَكَّرُ / المُؤَنَّثُ | مذکّر / مؤنّث | — |
| Singular / dual / plural | المُفْرَدُ / المُثَنَّى / الجَمْعُ | مفرد (واحد) / مثنّی (تثنیه) / جمع | — |
| The sound masculine plural | جَمْعُ المُذَكَّرِ السَّالِمُ | جمع مذکّر سالم | — |
| The sound feminine plural | جَمْعُ المُؤَنَّثِ السَّالِمُ | جمع مؤنّث سالم | — |
| The broken plural | جَمْعُ التَّكْسِيرِ | جمع مکسّر (جمع تکسیر) | — |
| The five nouns | الأَسْمَاءُ الخَمْسَةُ | اسماء خمسه | — |
| The five verbs | الأَفْعَالُ الخَمْسَةُ | افعال خمسه | — |
| The diptote | غَيْرُ المُنْصَرِفِ | غیر منصرف | اسمی که تنوین نمی‌پذیرد |

### Root and pattern

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The morphological scale | المِيزَانُ الصَّرْفِيُّ | میزان صرفی (وزن) | سنجیدن کلمه با ف ع ل |
| The bare form | المُجَرَّدُ | مجرّد (ثلاثی مجرّد) | تنها حروف اصلی |
| The augmented form | المَزِيدُ | مزیدٌفیه (ثلاثی مزید) | با حرف زائد |
| Root / added letters | الحُرُوفُ الأَصْلِيَّةُ / حُرُوفُ الزِّيَادَةِ | حروف اصلی / حروف زائد | — |
| The fāʾ, ʿayn, lām of the verb | فَاءُ الفِعْلِ، عَيْنُهُ، لَامُهُ | فاءالفعل، عین‌الفعل، لام‌الفعل | حرف اصلی اوّل، دوم، سوم |
| Triliteral / quadriliteral | الثُّلَاثِيُّ / الرُّبَاعِيُّ | ثلاثی / رباعی | — |
| Conjugation class | البَابُ | باب | — |
| Pattern | الوَزْنُ | وزن | — |
| Form | الصِّيغَةُ | صیغه | — |
| Vowel / vowelled / unvowelled | الحَرَكَةُ / مُتَحَرِّكٌ / سَاكِنٌ | حرکت / متحرّک / ساکن | — |
| Fatḥa, ḍamma, kasra, sukūn, shadda | الفَتْحَةُ … | فتحه (زبر)، ضمّه (پیش)، کسره (زیر)، سکون، تشدید | — |
| The model verb of a pattern (the weighed word) | المَوْزُونُ | موزون | — |
| Regular (forms of a table) | المُطَّرِدُ | مطّرد | — |
| The letters of the throat | حُرُوفُ الحَلْقِ | حروف حلقی | — |
| Attached form (mulḥaq) / attachment (ilḥāq) | المُلْحَقُ / الإِلْحَاقُ | ملحق / الحاق | — |
| The meanings of the bābs: transitivity, multiplying, sharing, compliance, effort, intensifying the intransitive | التَّعْدِيَةُ، التَّكْثِيرُ، المُشَارَكَةُ، المُطَاوَعَةُ، التَّكَلُّفُ، مُبَالَغَةُ اللَّازِمِ | تعدیه، تکثیر، مشارکت، مطاوعه، تکلّف، مبالغهٔ لازم | — |
| The eight divisions (bare / augmented, triliteral / quadriliteral, sound / not sound) | الأَقْسَامُ الثَّمَانِيَةُ | اقسام هشتگانه | — |

### The verb and its tenses

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The past tense | الفِعْلُ المَاضِي | فعل ماضی | گذشته |
| The present–future tense | الفِعْلُ المُضَارِعُ | فعل مضارع | حال و آینده |
| The imperative | فِعْلُ الأَمْرِ | امر (امر حاضر، امر غائب) | فرمان |
| The prohibition | النَّهْيُ | نهی (نهی حاضر، نهی غائب) | بازداشتن |
| The negation / of the past | النَّفْيُ / الجَحْدُ | نفی / جحد (نفی جحد با لم) | — |
| The question | الاسْتِفْهَامُ | استفهام | پرسش |
| Active / passive | المَعْلُومُ (المَعْرُوفُ) / المَجْهُولُ | معلوم (معروف) / مجهول | — |
| Intransitive / transitive | اللَّازِمُ / المُتَعَدِّي | لازم / متعدّی | — |
| Third / second / first person | الغَائِبُ / المُخَاطَبُ (الحَاضِرُ) / المُتَكَلِّمُ | غائب / مخاطب (حاضر) / متکلّم | — |
| The prefixes of the muḍāriʿ | حُرُوفُ المُضَارَعَةِ | حروف مضارعه (اَتَین) | — |
| The nūn of emphasis | نُونُ التَّوْكِيدِ | نون تأکید ثقیله / خفیفه | — |
| Negation of the past with lam (absolute denial) | جَحْدٌ مُطْلَقٌ | جحد مطلق | — |
| Negation with lammā (comprehensive denial) | جَحْدٌ مُسْتَغْرِقٌ | جحد مستغرق | — |
| Negation of the present (with mā) | نَفْيُ الحَالِ | نفی حال | — |
| Negation of the future (with lā) / its emphatic form (with lan) | نَفْيُ الاسْتِقْبَالِ / تَأْكِيدُ نَفْيِ الاسْتِقْبَالِ | نفی استقبال / تأکید نفی استقبال | — |
| Command / prohibition to the absent (third person) | أَمْرُ الغَائِبِ / نَهْيُ الغَائِبِ | امر غائب / نهی غائب | — |
| Command / prohibition to the one present (second person) | أَمْرُ الحَاضِرِ / نَهْيُ الحَاضِرِ | امر حاضر / نهی حاضر | — |
| The verb of wonder (how … !) | فِعْلُ التَّعَجُّبِ | فعل تعجّب | — |
| The ghābir (an old name of the muḍāriʿ) | الغَابِرُ | غابر | — |
| Complete / incomplete verb | الفِعْلُ التَّامُّ / النَّاقِصُ | فعل تامّ / فعل ناقص | — |

### Sound and weak

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The sound verb | الصَّحِيحُ | صحیح | — |
| The weak verb | المُعْتَلُّ | معتلّ | — |
| Wholly sound | السَّالِمُ | سالم | — |
| Doubled | المُضَاعَفُ | مضاعف | — |
| With hamza | المَهْمُوزُ | مهموز | — |
| Weak first letter | المِثَالُ | مثال | — |
| Weak middle letter | الأَجْوَفُ | اجوف | — |
| Weak last letter | النَّاقِصُ | ناقص | — |
| Doubly weak | اللَّفِيفُ المَقْرُونُ / المَفْرُوقُ | لفیف مقرون / لفیف مفروق | — |
| The weak letters | حُرُوفُ العِلَّةِ | حروف علّه (و، ی، ا) | — |
| Change of a weak letter | الإِعْلَالُ | اعلال | — |
| Assimilation | الإِدْغَامُ | ادغام | — |
| Replacing a letter | الإِبْدَالُ | ابدال | — |
| The seven divisions (ṣaḥīḥ, mithāl, ajwaf, nāqiṣ, lafīf, muḍāʿaf, mahmūz) | الأَقْسَامُ السَّبْعَةُ | اقسام هفتگانه | — |
| Hamza as first / second / third root letter | مَهْمُوزُ الفَاءِ / العَيْنِ / اللَّامِ | مهموز الفاء / العین / اللام | — |
| Doubling (of the last two root letters) | التَّضْعِيفُ | تضعیف | — |
| Two like letters / assimilation necessary, permitted, impossible | المُتَجَانِسَانِ / إِدْغَامٌ وَاجِبٌ، جَائِزٌ، مُمْتَنِعٌ | دو حرف همجنس / ادغام واجب، جایز، ممتنع | — |
| Accidental / original sukūn | سُكُونٌ عَارِضٌ / أَصْلِيٌّ | سکون عارضی / اصلی | — |

### Derived nouns

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The verbal noun | المَصْدَرُ | مصدر | — |
| The active participle | اسْمُ الفَاعِلِ | اسم فاعل | کننده |
| The passive participle | اسْمُ المَفْعُولِ | اسم مفعول | کار بر او واقع شده |
| The derived noun | المُشْتَقُّ | مشتق | — |
| The maṣdar mīmī | المَصْدَرُ المِيمِيُّ | مصدر میمی | — |
| The adjective like the participle | الصِّفَةُ المُشَبَّهَةُ | صفت مشبّهه | — |
| The elative | اسْمُ التَّفْضِيلِ | اسم تفضیل | — |
| The noun of time / of place | اسْمُ الزَّمَانِ / المَكَانِ | اسم زمان / اسم مکان (اسم ظرف) | — |
| The noun of instrument | اسْمُ الآلَةِ | اسم آلت (اسم آله) | — |
| The intensive form | صِيغَةُ المُبَالَغَةِ | صیغهٔ مبالغه | — |
| The noun of one act / of the manner | بِنَاءُ المَرَّةِ / بِنَاءُ النَّوْعِ | بنای مرّه / بنای نوع | — |
| The diminutive | اسْمُ التَّصْغِيرِ | اسم تصغیر | — |
| The relative adjective (nisba) | الاسْمُ المَنْسُوبُ | اسم منسوب | — |

### Iʿrāb and bināʾ

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| Inflection of the ending | الإِعْرَابُ | اعراب | دگرگونی آخر کلمه |
| Fixed ending | البِنَاءُ | بنا | ثابت ماندن آخر کلمه |
| The four states of iʿrāb | أَنْوَاعُ الإِعْرَابِ | انواع اعراب | — |
| Inflected / fixed | المُعْرَبُ / المَبْنِيُّ | معرب / مبنی | — |
| Rafʿ / marfūʿ | الرَّفْعُ / مَرْفُوعٌ | رفع / مرفوع | — |
| Naṣb / manṣūb | النَّصْبُ / مَنْصُوبٌ | نصب / منصوب | — |
| Khafḍ, jarr | الخَفْضُ، الجَرُّ / مَخْفُوضٌ، مَجْرُورٌ | خفض (جرّ) / مخفوض (مجرور) | — |
| Jazm / majzūm | الجَزْمُ / مَجْزُومٌ | جزم / مجزوم | — |
| The governor / the governed | العَامِلُ / المَعْمُولُ | عامل / معمول | — |
| Verbal / abstract governor | العَامِلُ اللَّفْظِيُّ / المَعْنَوِيُّ | عامل لفظی / عامل معنوی | — |
| Dropping | الحَذْفُ | حذف | — |
| Implied | التَّقْدِيرُ، مُقَدَّرٌ | تقدیر، مقدّر (تقدیری) | — |
| In the place of | فِي مَحَلِّ … | در محلّ رفع / نصب … (محلّاً مرفوع) | — |
| The effect of governing | العَمَلُ | عمل | — |
| Iʿrāb audible / implied / by place | إِعْرَابٌ لَفْظِيٌّ / تَقْدِيرِيٌّ / مَحَلِّيٌّ | اعراب لفظی / تقدیری / محلّی | — |
| Of complete / incomplete iʿrāb | تَامُّ الإِعْرَابِ / نَاقِصُ الإِعْرَابِ | تامّ‌الاعراب / ناقص‌الاعراب | — |
| Governed in itself / by following; the word followed | مَعْمُولٌ بِالأَصَالَةِ / بِالتَّبَعِيَّةِ؛ المَتْبُوعُ | معمول به اصالت / به تبعیّت؛ متبوع | — |
| The six nouns (the five nouns with hanū) | الأَسْمَاءُ السِّتَّةُ | اسماء ستّه | — |

### The sentence

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The sentence | الجُمْلَةُ | جمله | — |
| The nominal sentence | الجُمْلَةُ الاسْمِيَّةُ | جملهٔ اسمیّه | — |
| The subject (mubtadaʾ) | المُبْتَدَأُ | مبتدا | — |
| The predicate (khabar) | الخَبَرُ | خبر | — |
| The verbal sentence | الجُمْلَةُ الفِعْلِيَّةُ | جملهٔ فعلیّه | — |
| The doer (fāʿil) | الفَاعِلُ | فاعل | — |
| The direct object | المَفْعُولُ بِهِ | مفعولٌ‌به | — |
| The deputy of the doer | نَائِبُ الفَاعِلِ | نائب فاعل (مفعولی که فاعلش نام برده نشده) | — |
| The condition / its answer | الشَّرْطُ / الجَزَاءُ | شرط / جزا (جواب شرط) | — |
| Muḍāf / muḍāf ilayhi | الإِضَافَةُ: المُضَافُ / المُضَافُ إِلَيْهِ | اضافه: مضاف / مضافٌ‌الیه | — |

### The governors (ʿawāmil)

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| Kāna and its sisters | كَانَ وَأَخَوَاتُهَا | کانَ و اخوات آن (افعال ناقصه) | — |
| Inna and its sisters | إِنَّ وَأَخَوَاتُهَا | اِنَّ و اخوات آن (حروف مشبّهه بالفعل) | — |
| Ẓanna and its sisters | ظَنَنْتُ وَأَخَوَاتُهَا | ظَنَنتُ و اخوات آن (افعال قلوب) | — |
| The noun / predicate of kāna, inna | اسْمُ كَانَ … | اسم کان، خبر کان؛ اسم اِنّ، خبر اِنّ | — |
| The lā that denies the whole kind | لَا النَّافِيَةُ لِلْجِنْسِ | لای نفی جنس | — |
| Nawāṣib / jawāzim | النَّوَاصِبُ / الجَوَازِمُ | نواصب / جوازم | — |
| Mā and lā that resemble laysa | مَا وَلَا المُشَبَّهَتَانِ بِلَيْسَ | ما و لای مشبّه به لیس | — |
| The complete vague noun (a number before its tamyīz) | الاسْمُ المُبْهَمُ التَّامُّ | اسم مبهم تامّ | — |
| The meaning of the verb (a word that governs by it) | مَعْنَى الفِعْلِ | معنای فعل | — |

### The objects and other manṣūb nouns

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The absolute object | المَفْعُولُ المُطْلَقُ | مفعول مطلق | — |
| The adverb of time / of place | ظَرْفُ الزَّمَانِ / المَكَانِ | ظرف زمان / ظرف مکان (مفعولٌ‌فیه) | — |
| The object of purpose | المَفْعُولُ مِنْ أَجْلِهِ | مفعولٌ‌له (مفعول من اجله) | — |
| The object of accompaniment | المَفْعُولُ مَعَهُ | مفعولٌ‌معه | — |
| The state | الحَالُ | حال (ذوالحال) | — |
| The specification | التَّمْيِيزُ | تمییز (ممیَّز) | — |
| The exception / the excepted | الاسْتِثْنَاءُ / المُسْتَثْنَى | استثنا / مستثنی (مستثنی‌منه) | — |
| The vocative | المُنَادَى | منادا (حرف ندا) | — |
| Speech affirmative / negative; complete / incomplete (in the exception) | مُوجَبٌ / مَنْفِيٌّ؛ تَامٌّ / نَاقِصٌ | موجَب / منفی؛ تامّ / ناقص | — |
| The disconnected exception | الاسْتِثْنَاءُ المُنْقَطِعُ | استثنای منقطع | — |
| The one the ḥāl belongs to | صَاحِبُ الحَالِ (ذُو الحَالِ) | ذوالحال | — |
| The kinds of munādā: single proper name, intended / unintended indefinite, muḍāf, like the muḍāf | المُفْرَدُ العَلَمُ، النَّكِرَةُ المَقْصُودَةُ وَغَيْرُ المَقْصُودَةِ، المُضَافُ، المُشَبَّهُ بِالمُضَافِ | مفرد عَلَم، نکرهٔ مقصوده / غیر مقصوده، مضاف، شبیه به مضاف | — |

### The followers (tawābiʿ)

| English | Arabic | فارسی: in the text | pop-up |
|---|---|---|---|
| The followers | التَّوَابِعُ | توابع (تابع) | — |
| The adjective / the described | النَّعْتُ / المَنْعُوتُ | صفت (نعت) / موصوف (منعوت) | — |
| The conjunction / its particles | العَطْفُ / حُرُوفُ العَطْفِ | عطف / حروف عطف؛ معطوف، معطوفٌ‌علیه | — |
| The emphasis | التَّوْكِيدُ | تأکید (مؤکَّد) | — |
| The substitute | البَدَلُ | بدل (مبدلٌ‌منه) | — |
| The explicative apposition | عَطْفُ البَيَانِ | عطف بیان | — |
| The kinds of badal: of the whole, of the part, of inclusion, of mistake | بَدَلُ الكُلِّ، بَدَلُ البَعْضِ، بَدَلُ الاشْتِمَالِ، بَدَلُ الغَلَطِ | بدل کل، بدل بعض، بدل اشتمال، بدل غلط | — |

## Choices between competing terms

- khafḍ and jarr: the translation of a book keeps the word of the book (خفض، مخفوض in the Ājurrūmiyya; جرّ، مجرور in
  the ʿAwāmil and the Hidāya); in explanations «خفض (جرّ)».
- maʿlūm / maʿrūf: Iranian books say معلوم, Afghan Ḥanafī primers often معروف; the translation keeps the word of the
  book, and explanations say معلوم.
- mukhāṭab / ḥāḍir: مخاطب in the text; حاضر where the book says it (امر حاضر).
- The forms of a paradigm are named as in Persian ṣarf: صیغهٔ مفرد مذکّر غائب، مثنّای مذکّر غائب، جمع مذکّر غائب …
  متکلّم وحده، متکلّم مع الغیر.
- The augmented forms by their maṣdar (باب اِفعال، باب تفعیل، باب مفاعله …); the bare bābs by their example
  (نَصَرَ یَنصُرُ، ضَرَبَ یَضرِبُ …).
- مفعولٌ‌به, مفعولٌ‌فیه, مفعولٌ‌له, مفعولٌ‌معه with the tanwīn and the non-joiner, as the ḥawza writes them; in
  plain prose «مفعول‌به» is also accepted as a pop-up form.
- مسند / مسند الیه: not used for mubtadaʾ and khabar in our own explanations (Style), but kept where a book itself
  uses them as its terms (Naḥw-i Mīr: «مسند الیه … مبتدا گویند»), written as the book writes them: «مسند الیه».
- In the lessons of the two Persian books (Mīzān al-ṣarf, Naḥw-i Mīr) a sentence the English quotes from the book is
  given in the book's own Persian words, in « », copied from the passage; the book's terms are then the lesson's terms
  (مستقبل beside مضارع, حاضر for the second person, ماضی قریب / بعید / استمراری / احتمالی / تمنّائی).

## Words met in the books (added by the translator)

| English | Arabic | فارسی: in the text |
|---|---|---|
| The firmly placed noun / not firmly placed | الْمُتَمَكِّنُ / غَيْرُ الْمُتَمَكِّنِ | اسم متمکّن / غیر متمکّن |
| What is fixed in origin | مَبْنِيُّ الْأَصْلِ | مبنیّ اصل |
| The iḍāfa / bināʾ / tanwīn-keeping compound | الْمُرَكَّبُ الْإِضَافِيُّ / الْبِنَائِيُّ / مَنْعُ الصَّرْفِ | مرکّب اضافی / بنائی / منع صرف |
| Vague nouns; allusive nouns | الْمُبْهَمَاتُ؛ الْكِنَايَاتُ | مبهمات؛ کنایات |
| Nouns of verbs; nouns of sounds | أَسْمَاءُ الْأَفْعَالِ؛ أَسْمَاءُ الْأَصْوَاتِ | اسمای افعال؛ اسمای اصوات |
| Plural of few / of many; the furthest plural | جَمْعُ الْقِلَّةِ / الْكَثْرَةِ؛ مُنْتَهَى الْجُمُوعِ | جمع قلّت / کثرت؛ منتهی الجموع |
| Maqṣūr / manqūṣ | الْمَقْصُورُ / الْمَنْقُوصُ | مقصور / منقوص |
| Leaning (of a participle on a word before it) | الِاعْتِمَادُ | اعتماد |
| The complete noun (before its tamyīz) | الِاسْمُ التَّامُّ | اسم تامّ |
| Joining by a particle | عَطْفُ النَّسَقِ | عطف نسق (عطف به حرف) |
| The passive / its marfūʿ (Indian books) | فِعْلُ / مَفْعُولُ مَا لَمْ يُسَمَّ فَاعِلُهُ | فعل / مفعول ما لم یسمّ فاعله |
| Verbs of nearness; of praise and blame | أَفْعَالُ الْمُقَارَبَةِ؛ أَفْعَالُ الْمَدْحِ وَالذَّمِّ | افعال مقاربه؛ افعال مدح و ذمّ |
| The particles that do not govern | الْحُرُوفُ غَيْرُ الْعَامِلَةِ | حروف غیر عامله |
| The kinds of tanwīn | تَنْوِينُ التَّمَكُّنِ، التَّنْكِيرِ، الْعِوَضِ، الْمُقَابَلَةِ، التَّرَنُّمِ | تنوین تمکّن، تنکیر، عوض، مقابله، ترنّم |
| The nūn of iʿrāb | نُونُ الْإِعْرَابِ | نون اعرابی |
| The separating alif | الْأَلِفُ الْفَاصِلَةُ | الف فاصل |
| The hamza of connection | هَمْزَةُ الْوَصْلِ | همزهٔ وصل |
| The engine (the site's conjugation tool) | — | ابزار صرف فعل |
| Contest (the verb of outdoing, yafʿulu) | الْمُغَالَبَةُ | مغالبه |
| The two ways (a muḍāriʿ with either vowel) | الْوَجْهَانِ | دو وجه |
| The noun of once / the manner (fiʿla) | اسْمُ الْمَرَّةِ / الْهَيْئَةُ | اسم مرّه / هیئت |
| Waṣf, waṣfiyya (cause of the diptote) | الْوَصْفُ / الْوَصْفِيَّةُ | وصف / وصفیّت (not صفت) |
| What a particle of jarr is attached to | الْمُتَعَلَّقُ | متعلَّق |
| The settled / the idle adverb | الظَّرْفُ الْمُسْتَقَرُّ / اللَّغْوُ | ظرفِ مستقرّ / ظرفِ لغو |
| Dropping and joining | الْحَذْفُ وَالْإِيصَالُ | حذف و ایصال |
| Vague / limited adverb of place | ظَرْفُ مَكَانٍ مُبْهَمٌ / مَحْدُودٌ | ظرفِ مکانِ مبهم / محدود |
