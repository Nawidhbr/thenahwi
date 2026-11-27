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

### The followers (tawābiʿ)

| English | Arabic | اردو: in the text | pop-up |
|---|---|---|---|
| The followers | التَّوَابِعُ | توابع (تابع) | — |
| The adjective / the described | النَّعْتُ / المَنْعُوتُ | صفت (نعت) / موصوف (منعوت) | — |
| The conjunction / its particles | العَطْفُ / حُرُوفُ العَطْفِ | عطف / حروفِ عطف؛ معطوف، معطوف علیہ | — |
| The emphasis | التَّوْكِيدُ | تاکید (مؤکَّد) | — |
| The substitute | البَدَلُ | بدل (مبدل منہ) | — |

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
