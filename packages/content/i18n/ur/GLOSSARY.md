# Urdu glossary (ur)

Use these renderings everywhere: in the translations of the books, the lessons, the terms, the tests and the
interface. The running text keeps the technical terms (column "اردو: in the text") as the dars-i niẓāmī teaches ṣarf
and naḥw in Urdu (Mīzān al-ṣarf, Munshaʿib, Ṣarf-i Mīr, ʿIlm al-ṣīgha, Panj Ganj, Naḥw-i Mīr, Hidāyat al-naḥw, the
Kāfiya), in Deobandi and Barelvi madrasas alike. When the reader taps such a word, a pop-up gives the plain word
(column "pop-up"; a dash: no pop-up). The pop-ups are in `packages/content/glossary/ur.json`; keep that file in step
with this list. The concepts and their order follow the English source list, `packages/content/i18n/GLOSSARY.md`.

## Style

- Plain, clear Urdu prose in Urdu script (no Roman Urdu), in the register of the Urdu shurūḥ of the dars-i niẓāmī:
  ordinary syntax, one idea per sentence, the author's order; no paraphrase and no commentary in a translation.
- The technical terms are the Arabic terms as the Urdu madrasa writes them (فعلِ ماضی، فعلِ مضارع، مصدر، اسمِ فاعل،
  اعراب، مرفوع، منصوب، مجرور، مجزوم، مبتدا، خبر، فاعل، مفعول بہ). Izafat is written with a zer where it helps reading
  (فعلِ ماضی، اسمِ فاعل، جمعِ مکسر); after ہ with ۂ (جملۂ اسمیہ، جملۂ فعلیہ). Keep the standard spellings مستثنیٰ،
  منادیٰ، معنیٰ، مثنّٰی/تثنیہ، اولیٰ.
- **Arabic examples** inside a passage stay in Arabic script, fully vocalised, with the meaning after them in Urdu:
  “قَامَ زَيْدٌ (زید کھڑا ہوا)”. Arabic quotations, forms and paradigms are copied exactly as in the source, with
  Arabic ي and ك; the Urdu text around them uses ی and ک.
- Where the English gives an English word with its transliteration ("the doer (fāʿil)"), the Urdu term already is that
  Arabic term, so it is written once (فاعل). No Latin transliterations in brackets in the running text; where the
  text discusses the Arabic word itself, write that word in Arabic script. No English grammar words (subject,
  object, verb …) and no Urdu-grammar words that stand for something else (فعلِ متعدی is the Arabic sense only).
- Proper names in Urdu script, without the Arabic article, as in the Urdu books: سیبویہ، ابنِ مالک، ابنِ آجرُّوم، ابنِ
  ہشام، عبد القاہر جرجانی، سید شریف جرجانی، برکوی، ابنِ حاجب؛ Zayd and ʿAmr: زید، عمرو. Book titles: آجرومیہ، الفیہ،
  کافیہ، مأۃ عامل (شرحِ مائۃ عامل)، ہدایۃ النحو، نحوِ میر، میزان الصرف، قطر الندیٰ.
- Dates as in the English (“723/1323”); “d.” becomes “وفات” (“(وفات 723ھ/1323ء)”).
- Headings of the book are translated: “باب: کلام”، “اعراب کا باب”، “فصل”.
- **Reserved words.** Some terms are also everyday Urdu words; do not use them in their everyday sense, or the reader
  gets a wrong pop-up:
  - کلمہ only for the word of the grammarians (اسم، فعل، حرف); a word in general is لفظ, but لفظ is also a term
    (lafẓ): in running prose “بات”، “جملہ” where possible;
  - حرف for a particle and for a letter, as the madrasa says; where they must be kept apart, a particle is “حرف
    (حرفِ معنی)” and a letter “حرف (حرفِ تہجی)”;
  - خبر only for the predicate (news: اطلاع); حال only for the ḥāl (a state in general: کیفیت، صورت); صفت only for
    the adjective (naʿt), a quality in general: خوبی؛ باب only for a chapter and a conjugation class;
  - عامل only for the governor; تمیز in everyday Urdu is “manners”: the term is always تمییز (two yāʾs).

## Words

### The two sciences and speech

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| Morphology (ṣarf) | عِلْمُ الصَّرْفِ | علمِ صرف | کلمے کی بناوٹ کا علم |
| Syntax (naḥw) | عِلْمُ النَّحْوِ | علمِ نحو | جملے کی ترکیب اور آخری حرکت کا علم |
| The word | الكَلِمَةُ | کلمہ | با معنی مفرد لفظ |
| Speech | الكَلَامُ | کلام | پوری بات کا فائدہ دینے والا مرکب |
| Utterance | اللَّفْظُ | لفظ | — |
| Compound | المُرَكَّبُ | مرکب | — |
| Conveying a complete meaning | المُفِيدُ | مفید | — |
| By convention | بِالوَضْعِ | وضع سے (عرب کی وضع کے مطابق) | — |
| Conjugation | التَّصْرِيفُ | تصریف؛ گردان (verb: گردان کرنا) | ایک کلمے سے دوسرے صیغے نکالنا |
| A conjugation table | الأَمْثِلَةُ | گردان؛ صرفِ صغیر / صرفِ کبیر | — |
| Heard / by analogy | سَمَاعِيٌّ / قِيَاسِيٌّ | سماعی / قیاسی | — |

### The kinds of word

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The noun | الاسْمُ | اسم | — |
| The verb | الفِعْلُ | فعل | — |
| The particle | الحَرْفُ | حرف | — |
| A particle that brings a meaning | حَرْفٌ جَاءَ لِمَعْنًى | وہ حرف جو کسی معنی کے لیے آئے | — |
| Sign | العَلَامَةُ | علامت | — |
| Nunation | التَّنْوِينُ | تنوین | — |
| The article al- | الأَلِفُ وَاللَّامُ | الف لام | — |
| The particles of khafḍ | حُرُوفُ الخَفْضِ | حروفِ خفض (حروفِ جار) | — |
| The particles of oath | حُرُوفُ القَسَمِ | حروفِ قسم | — |
| The quiescent tāʾ of the feminine | تَاءُ التَّأْنِيثِ السَّاكِنَةُ | تائے تانیث ساکنہ | — |
| Definite / indefinite | المَعْرِفَةُ / النَّكِرَةُ | معرفہ / نکرہ | معین / غیر معین |
| The pronoun | الضَّمِيرُ، المُضْمَرُ | ضمیر، مضمر | — |
| The proper name | العَلَمُ | علَم | — |
| The demonstrative | اسْمُ الإِشَارَةِ | اسمِ اشارہ | — |
| The vague noun | الاسْمُ المُبْهَمُ | اسمِ مبہم | — |
| The relative noun | الاسْمُ المَوْصُولُ | اسمِ موصول | — |
| Masculine / feminine | المُذَكَّرُ / المُؤَنَّثُ | مذکر / مؤنث | — |
| Singular / dual / plural | المُفْرَدُ / المُثَنَّى / الجَمْعُ | واحد (مفرد) / تثنیہ / جمع | — |
| The sound masculine plural | جَمْعُ المُذَكَّرِ السَّالِمُ | جمعِ مذکر سالم | — |
| The sound feminine plural | جَمْعُ المُؤَنَّثِ السَّالِمُ | جمعِ مؤنث سالم | — |
| The broken plural | جَمْعُ التَّكْسِيرِ | جمعِ مکسر (جمعِ تکسیر) | — |
| The five nouns | الأَسْمَاءُ الخَمْسَةُ | اسمائے خمسہ | — |
| The five verbs | الأَفْعَالُ الخَمْسَةُ | افعالِ خمسہ | — |
| The diptote | غَيْرُ المُنْصَرِفِ | غیر منصرف | وہ اسم جس پر تنوین نہ آئے |

### Root and pattern

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The morphological scale | المِيزَانُ الصَّرْفِيُّ | میزانِ صرفی (وزن) | ف ع ل سے کلمے کو تولنا |
| The bare form | المُجَرَّدُ | مجرد (ثلاثی مجرد) | صرف اصلی حروف |
| The augmented form | المَزِيدُ | مزید فیہ (ثلاثی مزید فیہ) | زائد حروف والا |
| Root / added letters | الحُرُوفُ الأَصْلِيَّةُ / حُرُوفُ الزِّيَادَةِ | حروفِ اصلیہ / حروفِ زائدہ | — |
| The fāʾ, ʿayn, lām of the verb | فَاءُ الفِعْلِ، عَيْنُهُ، لَامُهُ | فاء کلمہ، عین کلمہ، لام کلمہ | پہلا، دوسرا، تیسرا اصلی حرف |
| Triliteral / quadriliteral | الثُّلَاثِيُّ / الرُّبَاعِيُّ | ثلاثی / رباعی | — |
| Conjugation class | البَابُ | باب | — |
| Pattern | الوَزْنُ | وزن | — |
| Form | الصِّيغَةُ | صیغہ (جمع: صیغے) | — |
| Vowel / vowelled / unvowelled | الحَرَكَةُ / مُتَحَرِّكٌ / سَاكِنٌ | حرکت / متحرک / ساکن | — |
| Fatḥa, ḍamma, kasra, sukūn, shadda | الفَتْحَةُ … | فتحہ (زبر)، ضمہ (پیش)، کسرہ (زیر)، سکون (جزم)، تشدید | — |
| The model verb of a pattern (the weighed word) | المَوْزُونُ | موزون | — |
| Regular (forms of a table) | المُطَّرِدُ | مطّرد | — |
| The letters of the throat | حُرُوفُ الحَلْقِ | حروفِ حلقی | — |
| Attached form (mulḥaq) / attachment (ilḥāq) | المُلْحَقُ / الإِلْحَاقُ | ملحق / الحاق | — |
| The meanings of the bābs: transitivity, multiplying, sharing, compliance, effort, intensifying the intransitive | التَّعْدِيَةُ، التَّكْثِيرُ، المُشَارَكَةُ، المُطَاوَعَةُ، التَّكَلُّفُ، مُبَالَغَةُ اللَّازِمِ | تعدیہ، تکثیر، مشارکت، مطاوعت، تکلّف، لازم کا مبالغہ | — |
| The eight divisions (bare / augmented, triliteral / quadriliteral, sound / not sound) | الأَقْسَامُ الثَّمَانِيَةُ | اقسامِ ثمانیہ | — |

### The verb and its tenses

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The past tense | الفِعْلُ المَاضِي | فعلِ ماضی | گزرا ہوا زمانہ |
| The present–future tense | الفِعْلُ المُضَارِعُ | فعلِ مضارع | حال اور مستقبل |
| The imperative | فِعْلُ الأَمْرِ | امر (امرِ حاضر، امرِ غائب) | حکم |
| The prohibition | النَّهْيُ | نہی (نہیِ حاضر، نہیِ غائب) | منع کرنا |
| The negation / of the past | النَّفْيُ / الجَحْدُ | نفی / جحد (نفیِ جحد بلم) | — |
| The question | الاسْتِفْهَامُ | استفہام | سوال |
| Active / passive | المَعْلُومُ (المَعْرُوفُ) / المَجْهُولُ | معروف / مجہول | — |
| Intransitive / transitive | اللَّازِمُ / المُتَعَدِّي | لازم / متعدی | — |
| Third / second / first person | الغَائِبُ / المُخَاطَبُ (الحَاضِرُ) / المُتَكَلِّمُ | غائب / حاضر (مخاطب) / متکلم | — |
| The prefixes of the muḍāriʿ | حُرُوفُ المُضَارَعَةِ | علاماتِ مضارع (حروفِ اَتَین) | — |
| The nūn of emphasis | نُونُ التَّوْكِيدِ | نونِ تاکید ثقیلہ / خفیفہ | — |
| Negation of the past with lam (absolute denial) | جَحْدٌ مُطْلَقٌ | جحدِ مطلق | — |
| Negation with lammā (comprehensive denial) | جَحْدٌ مُسْتَغْرِقٌ | جحدِ مستغرق | — |
| Negation of the present (with mā) | نَفْيُ الحَالِ | نفیِ حال | — |
| Negation of the future (with lā) / its emphatic form (with lan) | نَفْيُ الاسْتِقْبَالِ / تَأْكِيدُ نَفْيِ الاسْتِقْبَالِ | نفیِ استقبال / تاکیدِ نفیِ استقبال | — |
| Command / prohibition to the absent (third person) | أَمْرُ الغَائِبِ / نَهْيُ الغَائِبِ | امرِ غائب / نہیِ غائب | — |
| Command / prohibition to the one present (second person) | أَمْرُ الحَاضِرِ / نَهْيُ الحَاضِرِ | امرِ حاضر / نہیِ حاضر | — |
| The verb of wonder (how … !) | فِعْلُ التَّعَجُّبِ | فعلِ تعجب | — |
| The ghābir (an old name of the muḍāriʿ) | الغَابِرُ | غابر | — |
| Complete / incomplete verb | الفِعْلُ التَّامُّ / النَّاقِصُ | فعلِ تام / فعلِ ناقص | — |

### Sound and weak

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The sound verb | الصَّحِيحُ | صحیح | — |
| The weak verb | المُعْتَلُّ | معتل | — |
| Wholly sound | السَّالِمُ | سالم | — |
| Doubled | المُضَاعَفُ | مضاعف | — |
| With hamza | المَهْمُوزُ | مہموز | — |
| Weak first letter | المِثَالُ | مثال | — |
| Weak middle letter | الأَجْوَفُ | اجوف | — |
| Weak last letter | النَّاقِصُ | ناقص | — |
| Doubly weak | اللَّفِيفُ المَقْرُونُ / المَفْرُوقُ | لفیف مقرون / لفیف مفروق | — |
| The weak letters | حُرُوفُ العِلَّةِ | حروفِ علت (و، ی، ا) | — |
| Change of a weak letter | الإِعْلَالُ | تعلیل (اعلال) | — |
| Assimilation | الإِدْغَامُ | ادغام | — |
| Replacing a letter | الإِبْدَالُ | ابدال | — |
| The seven divisions (ṣaḥīḥ, mithāl, ajwaf, nāqiṣ, lafīf, muḍāʿaf, mahmūz) | الأَقْسَامُ السَّبْعَةُ | ہفت اقسام | — |
| Hamza as first / second / third root letter | مَهْمُوزُ الفَاءِ / العَيْنِ / اللَّامِ | مہموز الفاء / العین / اللام | — |
| Doubling (of the last two root letters) | التَّضْعِيفُ | تضعیف | — |
| Two like letters / assimilation necessary, permitted, impossible | المُتَجَانِسَانِ / إِدْغَامٌ وَاجِبٌ، جَائِزٌ، مُمْتَنِعٌ | دو ہم جنس حرف / ادغامِ واجب، جائز، ممتنع | — |
| Accidental / original sukūn | سُكُونٌ عَارِضٌ / أَصْلِيٌّ | سکونِ عارضی / اصلی | — |

### Derived nouns

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The verbal noun | المَصْدَرُ | مصدر | — |
| The active participle | اسْمُ الفَاعِلِ | اسمِ فاعل | کام کرنے والا |
| The passive participle | اسْمُ المَفْعُولِ | اسمِ مفعول | جس پر کام ہوا |
| The derived noun | المُشْتَقُّ | مشتق | — |
| The maṣdar mīmī | المَصْدَرُ المِيمِيُّ | مصدرِ میمی | — |
| The adjective like the participle | الصِّفَةُ المُشَبَّهَةُ | صفتِ مشبہ | — |
| The elative | اسْمُ التَّفْضِيلِ | اسمِ تفضیل | — |
| The noun of time / of place | اسْمُ الزَّمَانِ / المَكَانِ | اسمِ ظرف: ظرفِ زمان / ظرفِ مکان | — |
| The noun of instrument | اسْمُ الآلَةِ | اسمِ آلہ | — |
| The intensive form | صِيغَةُ المُبَالَغَةِ | مبالغہ کا صیغہ (اسمِ مبالغہ) | — |
| The noun of one act / of the manner | بِنَاءُ المَرَّةِ / بِنَاءُ النَّوْعِ | اسمِ مرّہ / اسمِ نوع | — |
| The diminutive | اسْمُ التَّصْغِيرِ | اسمِ تصغیر | — |
| The relative adjective (nisba) | الاسْمُ المَنْسُوبُ | اسمِ منسوب | — |

### Iʿrāb and bināʾ

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| Inflection of the ending | الإِعْرَابُ | اعراب | آخر کا بدلنا |
| Fixed ending | البِنَاءُ | بنا | آخر کا نہ بدلنا |
| The four states of iʿrāb | أَنْوَاعُ الإِعْرَابِ | اعراب کی قسمیں | — |
| Inflected / fixed | المُعْرَبُ / المَبْنِيُّ | معرب / مبنی | — |
| Rafʿ / marfūʿ | الرَّفْعُ / مَرْفُوعٌ | رفع / مرفوع | — |
| Naṣb / manṣūb | النَّصْبُ / مَنْصُوبٌ | نصب / منصوب | — |
| Khafḍ, jarr | الخَفْضُ، الجَرُّ / مَخْفُوضٌ، مَجْرُورٌ | خفض (جر) / مخفوض (مجرور) | — |
| Jazm / majzūm | الجَزْمُ / مَجْزُومٌ | جزم / مجزوم | — |
| The governor / the governed | العَامِلُ / المَعْمُولُ | عامل / معمول | — |
| Verbal / abstract governor | العَامِلُ اللَّفْظِيُّ / المَعْنَوِيُّ | عاملِ لفظی / عاملِ معنوی | — |
| Dropping | الحَذْفُ | حذف | — |
| Implied | التَّقْدِيرُ، مُقَدَّرٌ | تقدیر، مقدّر (تقدیری) | — |
| In the place of | فِي مَحَلِّ … | محلاً مرفوع / منصوب … | — |
| The effect of governing | العَمَلُ | عمل | — |
| Iʿrāb audible / implied / by place | إِعْرَابٌ لَفْظِيٌّ / تَقْدِيرِيٌّ / مَحَلِّيٌّ | اعرابِ لفظی / تقدیری / محلی | — |
| Of complete / incomplete iʿrāb | تَامُّ الإِعْرَابِ / نَاقِصُ الإِعْرَابِ | تامُّ الاعراب / ناقصُ الاعراب | — |
| Governed in itself / by following; the word followed | مَعْمُولٌ بِالأَصَالَةِ / بِالتَّبَعِيَّةِ؛ المَتْبُوعُ | اصالتاً / تبعاً معمول؛ متبوع | — |
| The six nouns (the five nouns with hanū) | الأَسْمَاءُ السِّتَّةُ | اسمائے ستّہ | — |

### The sentence

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The sentence | الجُمْلَةُ | جملہ | — |
| The nominal sentence | الجُمْلَةُ الاسْمِيَّةُ | جملۂ اسمیہ | — |
| The subject (mubtadaʾ) | المُبْتَدَأُ | مبتدا | — |
| The predicate (khabar) | الخَبَرُ | خبر | — |
| The verbal sentence | الجُمْلَةُ الفِعْلِيَّةُ | جملۂ فعلیہ | — |
| The doer (fāʿil) | الفَاعِلُ | فاعل | — |
| The direct object | المَفْعُولُ بِهِ | مفعول بہ | — |
| The deputy of the doer | نَائِبُ الفَاعِلِ | نائبِ فاعل (مفعولِ ما لم یسمَّ فاعلہ) | — |
| The condition / its answer | الشَّرْطُ / الجَزَاءُ | شرط / جزا (جوابِ شرط) | — |
| Muḍāf / muḍāf ilayhi | الإِضَافَةُ: المُضَافُ / المُضَافُ إِلَيْهِ | اضافت: مضاف / مضاف الیہ | — |

### The governors (ʿawāmil)

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| Kāna and its sisters | كَانَ وَأَخَوَاتُهَا | کانَ اور اس کے اخوات (افعالِ ناقصہ) | — |
| Inna and its sisters | إِنَّ وَأَخَوَاتُهَا | اِنَّ اور اس کے اخوات (حروفِ مشبّہ بالفعل) | — |
| Ẓanna and its sisters | ظَنَنْتُ وَأَخَوَاتُهَا | ظنَنتُ اور اس کے اخوات (افعالِ قلوب) | — |
| The noun / predicate of kāna, inna | اسْمُ كَانَ … | کان کا اسم، کان کی خبر؛ اِنّ کا اسم، اِنّ کی خبر | — |
| The lā that denies the whole kind | لَا النَّافِيَةُ لِلْجِنْسِ | لائے نفیِ جنس | — |
| Nawāṣib / jawāzim | النَّوَاصِبُ / الجَوَازِمُ | نواصب / جوازم | — |
| Mā and lā that resemble laysa | مَا وَلَا المُشَبَّهَتَانِ بِلَيْسَ | لیس کے مشابہ ما اور لا | — |
| The complete vague noun (a number before its tamyīz) | الاسْمُ المُبْهَمُ التَّامُّ | اسمِ مبہمِ تام | — |
| The meaning of the verb (a word that governs by it) | مَعْنَى الفِعْلِ | معنیِ فعل | — |

### The objects and other manṣūb nouns

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The absolute object | المَفْعُولُ المُطْلَقُ | مفعولِ مطلق | — |
| The adverb of time / of place | ظَرْفُ الزَّمَانِ / المَكَانِ | ظرفِ زمان / ظرفِ مکان (مفعول فیہ) | — |
| The object of purpose | المَفْعُولُ مِنْ أَجْلِهِ | مفعول لہ (مفعول من اجلہ) | — |
| The object of accompaniment | المَفْعُولُ مَعَهُ | مفعول معہ | — |
| The state | الحَالُ | حال (ذو الحال) | — |
| The specification | التَّمْيِيزُ | تمییز (ممیَّز) | — |
| The exception / the excepted | الاسْتِثْنَاءُ / المُسْتَثْنَى | استثنا / مستثنیٰ (مستثنیٰ منہ) | — |
| The vocative | المُنَادَى | منادیٰ (حرفِ ندا) | — |
| Speech affirmative / negative; complete / incomplete (in the exception) | مُوجَبٌ / مَنْفِيٌّ؛ تَامٌّ / نَاقِصٌ | موجب / منفی؛ تام / ناقص | — |
| The disconnected exception | الاسْتِثْنَاءُ المُنْقَطِعُ | استثنائے منقطع | — |
| The one the ḥāl belongs to | صَاحِبُ الحَالِ (ذُو الحَالِ) | ذو الحال | — |
| The kinds of munādā: single proper name, intended / unintended indefinite, muḍāf, like the muḍāf | المُفْرَدُ العَلَمُ، النَّكِرَةُ المَقْصُودَةُ وَغَيْرُ المَقْصُودَةِ، المُضَافُ، المُشَبَّهُ بِالمُضَافِ | مفرد علَم، نکرۂ مقصودہ / غیر مقصودہ، مضاف، مشابہ بالمضاف | — |

### The followers (tawābiʿ)

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The followers | التَّوَابِعُ | توابع (تابع) | — |
| The adjective / the described | النَّعْتُ / المَنْعُوتُ | صفت (نعت) / موصوف (منعوت) | — |
| The conjunction / its particles | العَطْفُ / حُرُوفُ العَطْفِ | عطف / حروفِ عطف؛ معطوف، معطوف علیہ | — |
| The emphasis | التَّوْكِيدُ | تاکید (مؤکَّد) | — |
| The substitute | البَدَلُ | بدل (مبدل منہ) | — |
| The explicative apposition | عَطْفُ البَيَانِ | عطفِ بیان | — |
| The kinds of badal: of the whole, of the part, of inclusion, of mistake | بَدَلُ الكُلِّ، بَدَلُ البَعْضِ، بَدَلُ الاشْتِمَالِ، بَدَلُ الغَلَطِ | بدلِ کل، بدلِ بعض، بدلِ اشتمال، بدلِ غلط | — |

## Choices between competing terms

- khafḍ and jarr: the translation of a book keeps the word of the book (خفض، مخفوض in the Ājurrūmiyya; جر، مجرور in
  the ʿAwāmil, the Hidāya and Naḥw-i Mīr); in explanations “خفض (جر)”.
- maʿlūm / maʿrūf: Urdu madrasas say معروف; a book that says مَعْلُوم keeps it in the Arabic, and the Urdu is معروف.
- mukhāṭab / ḥāḍir: Urdu madrasas say حاضر (واحد مذکر حاضر); مخاطب where the book says it.
- The forms of a paradigm are named as in Urdu ṣarf: واحد مذکر غائب، تثنیہ مذکر غائب، جمع مذکر غائب، واحد مؤنث
  غائبہ … واحد متکلم، جمع متکلم.
- The augmented forms by their maṣdar (بابِ اِفعال، بابِ تفعیل، بابِ مفاعلہ …); the bare bābs by their example
  (نصَر ینصُر، ضرَب یضرِب …).
- مصدر has the plural مصادر; صیغہ: صیغے (oblique صیغوں); جمعِ مکسر, not جمعِ تکسیر, in running text.
- naʿt: the books that say النَّعْت (al-Ājurrūmiyya) are translated نعت, with «نعت (صفت)» at its first mention, since in
  everyday Urdu نعت is a poem in praise of the Prophet ﷺ; the term page and running prose say صفت.
- Arabic examples in a translation keep their vowels; the names of particles and terms written in Urdu (اِنّ، ثُمّ، اِلّا)
  carry only the marks a reader needs.
- Site and course names (27 November 2026): The Nahwi and The Mantiqi stay in Latin letters, as in The Mantiqi's Urdu
  interface; al-Mabādiʾ is المبادی. The other titles: میزان الصرف، نحوِ میر، مأۃ عامل، ہدایۃ النحو، کافیہ، شرحِ جامی،
  شافیہ، الامثلہ، بناء الافعال، المقصود، العزی، مراح الارواح، العوامل (of Birgivī)، اظہار الاسرار، آجرومیہ، لامیۃ
  الافعال، قطر الندیٰ، الفیہ. The article stays where the bare word is an everyday word (المبادی، الامثلہ، المقصود،
  العزی، العوامل).
- The madrasa paths: ہندوستانی، عثمانی، مغاربی (مدرسہ، راستہ); the stages ابتدائی، متوسط، اعلیٰ.
- Vowel marks (tashkīl) are حرکات, never اعراب, which is only the term iʿrāb.
- In tables the column of persons is صیغہ; the persons are named واحد مذکر غائب، تثنیہ مذکر غائب، جمع مذکر غائب،
  واحد مؤنث غائبہ، تثنیہ مؤنث غائبہ، جمع مؤنث غائبہ، واحد مذکر حاضر … واحد مؤنث حاضرہ، تثنیہ مؤنث حاضرہ، جمع مؤنث
  حاضرہ، واحد متکلم، جمع متکلم; in running text "the speaker with others" is متکلم مع الغیر.
- A form that the English gives only in transliteration (faʿalū, fī l-bayti) is written in Arabic script, vocalised;
  a root is written with spaced letters (ن ص ر); a pattern as an Arabic word (فَعَلَ، اِسْتَفْعَلَ).
- Mīzān al-ṣarf: its tense names as in the book (مستقبل، حال، ماضی مطلق / قریب / بعید / استمراری / احتمالی /
  تمنائی); نفیِ تاکید بلن، نفیِ جحد بلم؛ نونِ ثقیلہ / خفیفہ؛ الفِ فاصلہ؛ ہمزۂ وصل؛ لامِ امر؛ لائے نہی، لائے نافیہ؛
  the mnemonic of the weak letters «آی» (as the print), the signs of the muḍāriʿ أَتَيْنَ.
- Hidāyat al-naḥw (round 2, lessons 13–72), as the Urdu shurūḥ say them: مفعولِ ما لم یسمَّ فاعلہ؛ مسند الیہ / مسند بہ؛
  ابتدا (the abstract governor)؛ نکرہ جس میں تخصیص ہو؛ ضمیرِ عائد؛ ناسخ (for the cancellers in a table)؛ تحذیر؛ «تفسیر کی
  شرط پر» and اشتغال؛ مندوب، ندبہ؛ ترخیم، مرخّم؛ لامِ استغاثہ؛ مشابہ بالمضاف؛ نکرۂ مقصودہ / غیر مقصودہ؛ ظرفِ مبہم / محدود؛
  مستثنیٰ متصل / منقطع / مفرغ؛ کلامِ موجب / غیر موجب؛ ممیز (the counted noun after a number)؛ اضافتِ معنوی / لفظی؛
  «انفصال کی نیت میں»؛ تبعیت / بالاصالت؛ صفتِ سببی؛ عطفِ نسق؛ تاکیدِ لفظی / معنوی؛ بدلِ کل، بعض، اشتمال، غلط؛
  بالفعل / بالقوہ (built in fact / inflected in potential)؛ ضمیرِ مستتر؛ ضمیرِ شان / قصہ؛ فصل؛ مبہمات؛ غایات؛ کنایات؛
  اسمائے افعال؛ اصوات؛ مرکبات؛ جمعِ قلت / کثرت؛ حدوث / ثبوت؛ اعتماد (of the participle)؛ احسن / حسن / قبیح (the
  eighteen questions)؛ الغا / تعلیق؛ کانِ تامہ / ناقصہ / زائدہ؛ افعالِ مقاربہ (رجا، حصول، شروع)؛ جامد؛ مخصوص بالمدح؛
  مجاوزت، استعلا، الصاق، استعانت، تعدیہ، اختصاص؛ مَا کافّہ؛ لامِ فارقہ؛ استدراک، تمنی، ترجی؛ اضراب؛ حروفِ تنبیہ، ایجاب،
  تحضیض؛ حرفِ توقع / تقریب؛ حرفِ ردع؛ أَنْ مفسرہ؛ تنوینِ تمکن، تنکیر، عوض، مقابلہ، ترنم؛ نونِ خفیفہ / ثقیلہ؛ التقائے ساکنین۔
  Quotations of the book in «…»; Qurʾān references as (البقرہ 2:221); the tribe Ṭayyiʾ is طے.
- Correction (27 November 2026, round 4): the Amthila's title is الامثلۃ المختلفہ (not الامثلہ, as in the list of titles
  above); in running text the series is امثلۂ مختلفہ.
- al-ʿAwāmil al-jadīda of Birgivī (round 4): title العوامل الجدیدہ (العوامل in running text); عواملِ سماعیہ / قیاسیہ /
  معنویہ (عاملِ لفظی / معنوی)؛ نوع for the five kinds of heard governor; معمولات، اصالتاً / تبعاً معمول، متبوع؛ حروفِ اضافت؛
  کافِ زائدہ؛ واوِ قسم، تائے قسم، جوابِ قسم؛ لغتِ عقیل؛ مَا حجازیہ، بنو تمیم؛ لیس کے مشابہ ما اور لا؛ استثنائے منقطع؛
  أَنْ مقدّرہ، لامِ كَيْ، لامِ جحود؛ کلماتِ شرط، شرط / جزا؛ اسمِ فعل؛ مسئلۂ کحل (the elative's narrow case)؛ ترکیب for
  the madrasa's parsing of a sentence; تامُّ الاعراب / ناقصُ الاعراب؛ حرکت کا حذف، آخری حرف کا حذف، نون کا حذف (Birgivī's
  three droppings)؛ اعرابِ لفظی / تقدیری / محلی، محلاً مجرور؛ نونِ نسوہ؛ جمع اور تثنیہ کے ملحق (أُولُو، عِشْرُونَ، اِثْنَانِ،
  كِلَا)؛ مکبّر / مصغر. Birgivī is برکوی (برگی کے محمد برکوی at the first mention), with the respectful plural.
- al-ʿIzzī (round 4): the book's السالم is سالم (not صحیح); مبنی للفاعل / للمفعول = معروف / مجہول («جس کا فاعل ذکر نہ کیا
  جائے»)؛ پہلا متحرک حرف؛ درج (connected speech)؛ اصلِ مرفوض؛ صیغے سے امر (امرِ حاضر)؛ امثلۂ خمسہ؛ تائے افتعال؛ اطباق / جہر؛
  اَصَمّ، مطابق؛ ادغامِ واجب / جائز / ممتنع، مدغم / مدغم فیہ، فکِّ ادغام؛ ضمیرِ مرفوع متحرک (a pronoun that begins with a
  consonant: ـتُ، ـنَ، ـنَا)؛ حروفِ مد و لین؛ ذو الثلاثہ، ذو الاربعہ؛ اعلال بالنقل / بالقلب / بالنقل والقلب (نقل، قلب)؛ تعویض؛
  صحت؛ لفیف مقرون / مفروق؛ کثرتِ استعمال؛ خلافِ قیاس؛ تخفیفِ ہمزہ؛ «مؤنث مذکر کی فرع ہے»، تائے طاریہ؛ اسمِ آلہ، اسمِ مرّہ،
  اسمِ نوع؛ تقدیر (the underlying form)؛ أَمَاتُوا (متروک کر دیا). Long vowels named in prose as «اُو»، «ای». ghazā: غزوہ کرنا.
- Interface (round 4, ui/p9.json): بغیۃ الوعاۃ؛ سیوطی؛ تذکرہ for a biographical "dictionary"؛ اہلِ لغت؛ اشاعت ("Edition")؛
  مصحح ("the corrector").
- Qaṭr al-nadā (round 4, qatr book translator): the book says جر in the chapter of iʿrāb and خفض in the chapter of the
  مخفوضات, and the Urdu follows it (جر / مجرور، خفض / مخفوض)؛ the chapter of the followers says نعت, with «نعت (صفت)» at its
  first mention (lesson 41); the ḥāl and the diptote's cause are وصف (not صفت), وصفیت؛ امثلۂ خمسہ؛ نونِ نسوہ؛ مائے مصدریہ،
  لَمَّا رابطہ؛ كَيْ مصدریہ؛ أَنَّ مخففہ؛ أَنْ مضمرہ، لامِ تعلیل، لامِ جحود، فائے سببیہ، واوِ معیت، نفیِ محض؛ جوابِ طلب، لامِ طلب،
  لائے طلب (دعا)؛ ادواتِ شرط، إِذَا فجائیہ؛ ضمیرِ مستتر / بارز، متصل / منفصل، وجوباً / جوازاً؛ علَمِ شخصی / جنسی، لقب، کنیت؛
  عائد، صلہ، الف لامِ موصولہ؛ الف لامِ عہدی / جنسی، استغراقِ افراد / صفات؛ رابط، ضمیرِ شان، ضمیرِ فصل؛ متعلقِ محذوف
  (مُسْتَقِرٌّ / اسْتَقَرَّ)؛ کانِ تامہ / زائدہ؛ مائے حجازیہ؛ مائے کافّہ؛ استدراک، ترجی، اشفاق؛ لامِ ابتدا؛ افعالِ قلوب، الغا، تعلیق،
  ملغیٰ، معلّق؛ اکلونی البراغیث کی لغت؛ اشتغال، مشغول عنہ، فعلِ مفسِّر، دو رخ والا جملہ؛ تنازع، اعمالِ اول / ثانی؛ فضلہ؛
  مختص و متصرف؛ اشمام؛ نکرۂ مقصودہ / غیر مقصودہ، ترخیم، مرخّم، مستغیث، مستغاث، ندبہ، مندوب، ہائے سکت؛ مفعول فیہ (ظرف)،
  مبہم؛ صاحبِ حال؛ تمییزِ نسبت، محوَّل / غیر محوَّل؛ كَمِ استفہامیہ / خبریہ (the particle in Arabic letters)؛ استثنائے متصل /
  منقطع / مفرغ؛ اضافتِ معنوی / لفظی؛ اعتماد؛ حکایتِ حال (حالِ ماضیہ)؛ الْمِثَالُ for the book's name of the intensive form
  (مبالغہ کا صیغہ)؛ ثبوت؛ مسئلۂ کحل؛ نعتِ سببی، قطع؛ تاکیدِ لفظی / معنوی؛ بدلِ کل، بعض، اشتمال، اضراب، غلط، نسیان؛ معدود؛
  عددِ ترتیبی؛ عدل، عجمہ، علمیت، صیغۂ منتہی الجموع؛ متفاوت؛ وقف، افصح؛ ہمزۂ وصل. Column heads: «Fixed on» مبنی بر.
  Qurʾān references as «(الروم 30:4)»، sūras 38 and 50 as «(سورۂ ص 38:24)»، «(سورۂ ق 50:…)» so they are not read as a page
  «(ص 5)». The everyday «ہر حال میں» is written «ہر صورت میں», since حال is reserved for the ḥāl.
- Iẓhār al-asrār of Birgivī (book translator, 28 November 2026; all 52 lessons): title اظہار الاسرار; the same Birgivī terms
  as the ʿAwāmil above (عواملِ سماعیہ / قیاسیہ، عاملِ معنوی، حروفِ مشبّہ بالفعل، مسئلۂ کحل، the three droppings، عقیل)، and:
  عمل for "the governing"؛ معرِب (muʿrib)؛ واسطہ (the intermediary)؛ متعلَّق؛ ظرفِ مستقر / ظرفِ لغو؛ حرفِ زائد؛ مفعول بہ غیر
  صریح؛ ظرفِ مکانِ مبہم / محدود؛ حذف و ایصال؛ مَا کافّہ؛ ملغیٰ for a cancelled particle، الغا / تعلیق؛ أَنْ مخففہ، افعالِ
  تحقیق، فاصل حرف؛ متصرف / غیر متصرف؛ کلماتِ مجازات for the book's "words of requital" (كَلِمُ الْمُجَازَاةِ; the ʿAwāmil's
  "words of condition" stay کلماتِ شرط)؛ اعتماد، مبالغہ کے اوزان؛ اسمِ منسوب، اسمِ مستعار؛ صلہ، عائد؛ ضمیرِ منتقل؛ اصالتاً /
  تبعاً معمول؛ واجب الاستتار / جائز الاستتار، ضمیرِ بارز / مستتر؛ مؤنثِ حقیقی / لفظی؛ ذوی العقول مذکر کی جمعِ مکسر؛ جملۂ
  خبریہ / انشائیہ؛ رابط (of a ḥāl sentence)؛ حروف کے ذریعے عطف؛ عطفِ بیان؛ اعرابِ محکی، حکایت؛ اسمِ منقوص؛ تنوینِ عوض؛
  مبنی الاصل / مبنی العارض؛ واجب البنا / جائز البنا؛ نونِ نسوہ. Reserved words kept apart: "the quality of iʿrāb" is کیفیت
  (not صفت); gender in agreement is تذکیر و تانیث (not جنس, kept for the genus); a state in general is حالت (حال is the ḥāl);
  the act of a doer is کام where فعل would be read as "verb". Sūrat Ṣād is written (سورۂ ص 38:30), so as not to read as a page.
