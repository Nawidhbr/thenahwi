# Arabic glossary (ar)

Arabic is the language of most of the books themselves, so an Arabic page shows the original without a translation
(`docs/i18n.md`). This list fixes the Arabic of what The Nahwi writes in Arabic: the translations of the two Persian
primers into Arabic (Mīzān al-ṣarf, Naḥw-i Mīr: `staging/<id>/translations/ar.json`, our translation, never presented
as an original), and later the lessons, the terms and the interface. The running text uses the terms of column
"العربية: in the text", fully vocalised. When the reader taps such a word, a pop-up gives a plain explanation (column
"pop-up"; a dash: no pop-up). The pop-ups are in `packages/content/glossary/ar.json`; keep that file in step with
this list. The concepts and their order follow the English source list, `packages/content/i18n/GLOSSARY.md`; the
column "Persian of the books" gives the word of the Persian primers that each Arabic term renders.

## Style

- Classical madrasa Arabic, in the plain style of the short Arabic primers (al-Ājurrūmiyya, Hidāyat al-naḥw, Sharḥ
  Miʾat ʿāmil): short sentences, the author's order, no paraphrase and no commentary. **Fully vocalised**: every
  letter that takes a vowel, with tanwīn, shadda and hamzat al-waṣl written as in the books (ٱ not used: plain ا).
  Standard Arabic letters: ي and ك, final ى only for alif maqṣūra (مَعْنًى، مُثَنًّى); no tatweel.
- The Persian formulas of the primers are rendered by the formulas of the Arabic books:
  - «بدان که …» → «اِعْلَمْ أَنَّ …»; «پس» → «فَـ» or «ثُمَّ»; «یعنی» → «أَيْ»; «چون» / «مثل» (as an example)
    → «نَحْوُ» or «مِثْلُ»; «و آن» → «وَهُوَ / وَهِيَ»; «اين را … گویند» → «وَيُسَمَّى هٰذَا …»;
  - «… بر دو قسم است» → «… عَلَى قِسْمَيْنِ» (or «… قِسْمَانِ»); «قسم اوّل» → «القِسْمُ الأَوَّلُ»;
  - the Persian meanings given to Arabic forms («زد آن یک مرد در زمان گذشته») become a short Arabic gloss:
    «ضَرَبَ: أَيْ ضَرَبَ رَجُلٌ وَاحِدٌ غَائِبٌ فِيمَا مَضَى».
- Arabic examples and paradigms of the source are copied exactly, with their vowels; a Persian word quoted as Persian
  (where the author compares with Persian) stays in Persian script, between «».
- Proper names as the Arabic books write them: سِيبَوَيْهِ، ابْنُ مَالِكٍ، ابْنُ آجُرُّومَ، ابْنُ هِشَامٍ، عَبْدُ القَاهِرِ
  الجُرْجَانِيُّ، السَّيِّدُ الشَّرِيفُ الجُرْجَانِيُّ، البِرْكِوِيُّ. Dates: “723هـ/1323م”; “d.” becomes “تُوُفِّيَ” or
  “ت”.
- Headings of the book are translated: «بَابُ الكَلَامِ»، «فَصْلٌ»، «فَصْلٌ فِي …».
- **The lessons, the terms and the interface** (round of 27 November 2026) are written in plain modern fuṣḥā, as the
  Azhar and madrasa textbooks of naḥw are: the technical terms and every Arabic example vocalised, the rest of the prose
  vowelled only where a reader could misread it (above all where two forms differ by one vowel: مَنْصَرٌ / مِنْصَرٌ).
  Titles, diagram labels and table cells are vocalised; SEO titles and descriptions are not (people search unvowelled).
  The full vocalisation above stays the rule for the translations of the two Persian primers.
- The site names: The Nahwi = النَّحْوِيّ (مَوْقِعُ النَّحْوِيِّ where a noun is needed), The Mantiqi = المَنْطِقِيّ.
- In the lessons an Arabic phrase that the English gives in transliteration is written in Arabic script, and its English
  gloss is dropped; conjugated forms come from the taṣrīf engine (`translator-tools/ar/forms.ts`), Qurʾān from the muṣḥaf,
  with the reference as (السورة: الآية). Exercise labels (a) (b) … become (أ) (ب) (ج) (د).
- Persons are named the madrasa way: المُفْرَدُ المُذَكَّرُ الغَائِبُ، المُفْرَدَةُ المُؤَنَّثَةُ الغَائِبَةُ، المُخَاطَبُ،
  المُخَاطَبَةُ، المُتَكَلِّمُ وَحْدَهُ، المُتَكَلِّمُ مَعَ الغَيْرِ. The English “meaning” of a form becomes a short Arabic
  gloss (وَقَعَ مِنْهُ النَّصْرُ فِيمَا مَضَى) or the name of its ṣīgha.
- نَحْوَ is not used for “about, circa” (حَوَالَيْ), so that the word naḥw keeps its technical sense; نَحْوُ “for example”
  stays, as in the books.
- **Reserved words**: a term is not used in a loose everyday sense: كَلِمَةٌ only for the word of the grammarians
  (لَفْظٌ for an utterance in general); حَالٌ only for the ḥāl (شَأْنٌ، صُورَةٌ for a state in general); بَابٌ only for a
  chapter and a conjugation class; صِفَةٌ only for the adjective (naʿt); خَبَرٌ only for the predicate.

## Words

### The two sciences and speech

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| Morphology (ṣarf) | علم صرف | عِلْمُ الصَّرْفِ (التَّصْرِيفِ) | عِلْمٌ بِأَبْنِيَةِ الكَلِمَةِ |
| Syntax (naḥw) | علم نحو | عِلْمُ النَّحْوِ | عِلْمٌ بِأَوَاخِرِ الكَلِمِ إِعْرَابًا وَبِنَاءً |
| The word | کلمه | الكَلِمَةُ | لَفْظٌ وُضِعَ لِمَعْنًى مُفْرَدٍ |
| Speech | کلام | الكَلَامُ | — |
| Utterance | لفظ | اللَّفْظُ | — |
| Compound | مرکّب | المُرَكَّبُ | — |
| Conveying a complete meaning | مفید | المُفِيدُ | — |
| By convention | به وضع | بِالوَضْعِ | — |
| Conjugation | گردان، صرف کردن | التَّصْرِيفُ؛ verb: صَرَّفَ يُصَرِّفُ | — |
| A conjugation table | گردان، صرف صغیر / کبیر | الأَمْثِلَةُ؛ التَّصْرِيفُ الصَّغِيرُ / الكَبِيرُ | — |
| Heard / by analogy | سماعی / قیاسی | سَمَاعِيٌّ / قِيَاسِيٌّ | — |

### The kinds of word

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| The noun / verb / particle | اسم، فعل، حرف | الاسْمُ، الفِعْلُ، الحَرْفُ | — |
| Sign | علامت، نشان | العَلَامَةُ | — |
| Nunation | تنوین | التَّنْوِينُ | — |
| The article al- | الف و لام | الأَلِفُ وَاللَّامُ (لَامُ التَّعْرِيفِ) | — |
| The particles of jarr | حروف جرّ | حُرُوفُ الجَرِّ | — |
| Definite / indefinite | معرفه / نکره | المَعْرِفَةُ / النَّكِرَةُ | — |
| The pronoun | ضمیر | الضَّمِيرُ (المُضْمَرُ) | — |
| The proper name | علم | العَلَمُ | — |
| The demonstrative / the relative | اسم اشاره / اسم موصول | اسْمُ الإِشَارَةِ / الاسْمُ المَوْصُولُ | — |
| Masculine / feminine | مذکّر / مؤنّث | المُذَكَّرُ / المُؤَنَّثُ | — |
| Singular / dual / plural | واحد، مفرد / تثنیه / جمع | الوَاحِدُ (المُفْرَدُ) / التَّثْنِيَةُ (المُثَنَّى) / الجَمْعُ | — |
| Sound masc. / fem. plural, broken plural | جمع مذکّر سالم … جمع مکسّر | جَمْعُ المُذَكَّرِ السَّالِمُ، جَمْعُ المُؤَنَّثِ السَّالِمُ، جَمْعُ التَّكْسِيرِ (المُكَسَّرُ) | — |
| The five (six) nouns / five verbs | اسماء ستّه / افعال خمسه | الأَسْمَاءُ السِّتَّةُ (الخَمْسَةُ) / الأَفْعَالُ الخَمْسَةُ | — |
| The diptote | غیر منصرف | غَيْرُ المُنْصَرِفِ (مَا لَا يَنْصَرِفُ) | — |
| The vague noun (demonstrative) | — | الاسْمُ المُبْهَمُ | — |
| The particle that came for a meaning | — | حَرْفٌ جَاءَ لِمَعْنًى | — |
| Fully declinable / the diptote | — | المُنْصَرِفُ / الاسْمُ الَّذِي لَا يَنْصَرِفُ (المَمْنُوعُ مِنَ الصَّرْفِ) | — |
| The nūn of protection (in ḍarabanī) | — | نُونُ الوِقَايَةِ | — |
| Al- of what is known / of the kind / taking in all | — | أَلِ العَهْدِيَّةُ / الجِنْسِيَّةُ / الاسْتِغْرَاقُ (اسْتِغْرَاقُ الأَفْرَادِ، الصِّفَاتِ) | — |
| Like a muḍāf (a noun that governs what follows) | — | الشَّبِيهُ بِالمُضَافِ | — |

### Root and pattern

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| The morphological scale | میزان، وزن | المِيزَانُ الصَّرْفِيُّ | — |
| The bare / augmented form | مجرّد / مزید فیه | المُجَرَّدُ / المَزِيدُ فِيهِ | — |
| Root / added letters | حروف اصلی / حروف زائد | الحُرُوفُ الأَصْلِيَّةُ / الحُرُوفُ الزَّائِدَةُ | — |
| The fāʾ, ʿayn, lām of the verb | فاء کلمه، عین کلمه، لام کلمه | فَاءُ الفِعْلِ، عَيْنُ الفِعْلِ، لَامُ الفِعْلِ | — |
| Triliteral / quadriliteral | ثلاثی / رباعی | الثُّلَاثِيُّ / الرُّبَاعِيُّ | — |
| Conjugation class / pattern / form | باب / وزن / صیغه | البَابُ / الوَزْنُ / الصِّيغَةُ | — |
| Vowel / vowelled / unvowelled | حرکت / متحرّک / ساکن | الحَرَكَةُ / المُتَحَرِّكُ / السَّاكِنُ | — |
| Fatḥa, ḍamma, kasra, sukūn, shadda | زبر، پیش، زیر، جزم، تشدید | الفَتْحَةُ، الضَّمَّةُ، الكَسْرَةُ، السُّكُونُ، الشَّدَّةُ (التَّشْدِيدُ) | — |
| The model verb of a pattern (the weighed word) | موزون | المَوْزُونُ | — |
| Regular (forms of a table) | مطّرد | المُطَّرِدُ | — |
| The letters of the throat | حروف حلقی | حُرُوفُ الحَلْقِ | — |
| Attached form (mulḥaq) / attachment (ilḥāq) | ملحق / الحاق | المُلْحَقُ / الإِلْحَاقُ | — |
| The meanings of the bābs: transitivity, multiplying, sharing, compliance, effort, intensifying the intransitive | تعدیه، تکثیر، مشارکت، مطاوعه، تکلّف، مبالغهٔ لازم | التَّعْدِيَةُ، التَّكْثِيرُ، المُشَارَكَةُ، المُطَاوَعَةُ، التَّكَلُّفُ، مُبَالَغَةُ اللَّازِمِ | — |
| The eight divisions (bare / augmented, triliteral / quadriliteral, sound / not sound) | اقسام هشتگانه | الأَقْسَامُ الثَّمَانِيَةُ | — |
| The bābs of conjugation (the thirty-five of the Binā) | — | أَبْوَابُ التَّصْرِيفِ | — |
| The letters of the throat (six) | — | حُرُوفُ الحَلْقِ | — |
| Analogy (forming other verbs on the model) | — | القِيَاسُ | — |
| The varied / the regular forms (al-Amthila) | — | الأَمْثِلَةُ المُخْتَلِفَةُ / الأَمْثِلَةُ المُطَّرِدَةُ | — |

### The verb and its tenses

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| The past / present–future / imperative | ماضی / مضارع / امر | المَاضِي / المُضَارِعُ / الأَمْرُ (أَمْرُ الحَاضِرِ، أَمْرُ الغَائِبِ) | — |
| The prohibition | نهی | النَّهْيُ | — |
| The negation / negation of the past | نفی / جحد | النَّفْيُ / الجَحْدُ | — |
| The question | استفهام | الاسْتِفْهَامُ | — |
| Active / passive | معروف (معلوم) / مجهول | المَعْرُوفُ (المَعْلُومُ) / المَجْهُولُ | — |
| Intransitive / transitive | لازم / متعدّی | اللَّازِمُ / المُتَعَدِّي | — |
| Third / second / first person | غائب / حاضر (مخاطب) / متکلّم | الغَائِبُ / الحَاضِرُ (المُخَاطَبُ) / المُتَكَلِّمُ | — |
| First person singular / plural | متکلّم وحده / متکلّم مع الغیر | المُتَكَلِّمُ وَحْدَهُ / المُتَكَلِّمُ مَعَ الغَيْرِ | — |
| The prefixes of the muḍāriʿ | حروف اتین | حُرُوفُ المُضَارَعَةِ (أَتَيْنَ، أَنَيْتُ) | — |
| The nūn of emphasis | نون تأکید ثقیله / خفیفه | نُونُ التَّوْكِيدِ الثَّقِيلَةُ / الخَفِيفَةُ | — |
| Negation of the past with lam (absolute denial) | جحد مطلق | الجَحْدُ المُطْلَقُ | — |
| Negation with lammā (comprehensive denial) | جحد مستغرق | الجَحْدُ المُسْتَغْرِقُ | — |
| Negation of the present (with mā) | نفی حال | نَفْيُ الحَالِ | — |
| Negation of the future (with lā) / its emphatic form (with lan) | نفی استقبال / تأکید نفی استقبال | نَفْيُ الاسْتِقْبَالِ / تَأْكِيدُ نَفْيِ الاسْتِقْبَالِ | — |
| Command / prohibition to the absent (third person) | امر غائب / نهی غائب | أَمْرُ الغَائِبِ / نَهْيُ الغَائِبِ | — |
| Command / prohibition to the one present (second person) | امر حاضر / نهی حاضر | أَمْرُ الحَاضِرِ / نَهْيُ الحَاضِرِ | — |
| The verb of wonder (how … !) | فعل تعجّب | فِعْلُ التَّعَجُّبِ | — |
| The ghābir (an old name of the muḍāriʿ) | غابر | الغَابِرُ | — |
| Complete / incomplete verb | فعل تامّ / فعل ناقص | الفِعْلُ التَّامُّ / النَّاقِصُ | — |
| The hamza of joining / that is always said | — | هَمْزَةُ الوَصْلِ / هَمْزَةُ القَطْعِ | — |
| The lām of command (and of prayer) | — | لَامُ الأَمْرِ (وَالدُّعَاءِ) | — |
| The lā of prohibition / of negation | — | لَا النَّاهِيَةُ / لَا النَّافِيَةُ | — |
| Lammā of time (“when”) | — | لَمَّا الحِينِيَّةُ | — |
| Prayer (a command addressed to God) | — | الدُّعَاءُ | — |

### Sound and weak

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| Sound / weak / wholly sound | صحیح / معتلّ / سالم | الصَّحِيحُ / المُعْتَلُّ / السَّالِمُ | — |
| Doubled / with hamza | مضاعف / مهموز | المُضَاعَفُ / المَهْمُوزُ | — |
| Mithāl / ajwaf / nāqiṣ | مثال / اجوف / ناقص | المِثَالُ / الأَجْوَفُ / النَّاقِصُ | — |
| Lafīf, joined / separated | لفیف مقرون / مفروق | اللَّفِيفُ المَقْرُونُ / المَفْرُوقُ | — |
| The weak letters | حروف علّت | حُرُوفُ العِلَّةِ | — |
| Iʿlāl / idghām / ibdāl | تعلیل، اعلال / ادغام / ابدال | الإِعْلَالُ / الإِدْغَامُ / الإِبْدَالُ | — |
| The seven kinds | هفت اقسام | الأَقْسَامُ السَّبْعَةُ (الأَبْوَابُ السَّبْعَةُ) | — |
| The seven divisions (ṣaḥīḥ, mithāl, ajwaf, nāqiṣ, lafīf, muḍāʿaf, mahmūz) | اقسام هفتگانه | الأَقْسَامُ السَّبْعَةُ | — |
| Hamza as first / second / third root letter | مهموز الفاء / العین / اللام | مَهْمُوزُ الفَاءِ / العَيْنِ / اللَّامِ | — |
| Doubling (of the last two root letters) | تضعیف | التَّضْعِيفُ | — |
| Two like letters / assimilation necessary, permitted, impossible | دو حرف همجنس / ادغام واجب، جایز، ممتنع | المُتَجَانِسَانِ / إِدْغَامٌ وَاجِبٌ، جَائِزٌ، مُمْتَنِعٌ | — |
| Accidental / original sukūn | سکون عارضی / اصلی | سُكُونٌ عَارِضٌ / أَصْلِيٌّ | — |
| Change by moving a vowel / by changing a letter | — | الإِعْلَالُ بِالنَّقْلِ / بِالقَلْبِ (بِالنَّقْلِ وَالقَلْبِ) | — |
| Undoing the merging | — | فَكُّ الإِدْغَامِ | — |
| The hāʾ of pause (qih, rah) | — | هَاءُ السَّكْتِ | — |
| A kasra with a touch of ḍamma (qīla) | — | الإِشْمَامُ | — |

### Derived nouns

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| Maṣdar / active / passive participle | مصدر / اسم فاعل / اسم مفعول | المَصْدَرُ / اسْمُ الفَاعِلِ / اسْمُ المَفْعُولِ | — |
| The derived noun / maṣdar mīmī | مشتق / مصدر میمی | المُشْتَقُّ / المَصْدَرُ المِيمِيُّ | — |
| The adjective like the participle | صفت مشبّهه | الصِّفَةُ المُشَبَّهَةُ | — |
| The elative | اسم تفضیل | اسْمُ التَّفْضِيلِ | — |
| The noun of time / place | اسم ظرف (زمان، مکان) | اسْمُ الظَّرْفِ: اسْمُ الزَّمَانِ / اسْمُ المَكَانِ | — |
| The noun of instrument | اسم آلت (آله) | اسْمُ الآلَةِ | — |
| The intensive form | مبالغه | صِيغَةُ المُبَالَغَةِ | — |
| The noun of one act / of the manner | بنای مرّه / بنای نوع | بِنَاءُ المَرَّةِ / بِنَاءُ النَّوْعِ | — |
| The diminutive | اسم تصغیر | اسْمُ التَّصْغِيرِ | — |
| The relative adjective (nisba) | اسم منسوب | الاسْمُ المَنْسُوبُ | — |
| The pattern of once / of the manner | — | فَعْلَةٌ / فِعْلَةٌ | — |
| The intensive of the active participle | — | مُبَالَغَةُ اسْمِ الفَاعِلِ | — |
| The verb of wonder, first / second form | — | مَا أَفْعَلَهُ / أَفْعِلْ بِهِ؛ المُتَعَجَّبُ مِنْهُ | — |

### Iʿrāb and bināʾ

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| Iʿrāb / bināʾ | اعراب / بنا | الإِعْرَابُ / البِنَاءُ | — |
| Muʿrab / mabnī | معرب / مبنی | المُعْرَبُ / المَبْنِيُّ | — |
| Rafʿ, naṣb, jarr, jazm | رفع، نصب، جرّ، جزم | الرَّفْعُ، النَّصْبُ، الجَرُّ، الجَزْمُ | — |
| Marfūʿ, manṣūb, majrūr, majzūm | مرفوع، منصوب، مجرور، مجزوم | مَرْفُوعٌ، مَنْصُوبٌ، مَجْرُورٌ، مَجْزُومٌ | — |
| The governor / the governed | عامل / معمول | العَامِلُ / المَعْمُولُ | — |
| Verbal / abstract governor | عامل لفظی / معنوی | العَامِلُ اللَّفْظِيُّ / المَعْنَوِيُّ | — |
| Dropping / implied / in the place of | حذف / تقدیر، تقدیری / محلّی | الحَذْفُ / التَّقْدِيرُ، تَقْدِيرًا / مَحَلًّا، فِي مَحَلِّ … | — |
| The effect of governing | عمل | العَمَلُ | — |
| Iʿrāb audible / implied / by place | اعراب لفظی / تقدیری / محلّی | إِعْرَابٌ لَفْظِيٌّ / تَقْدِيرِيٌّ / مَحَلِّيٌّ | — |
| Of complete / incomplete iʿrāb | تامّ‌الاعراب / ناقص‌الاعراب | تَامُّ الإِعْرَابِ / نَاقِصُ الإِعْرَابِ | — |
| Governed in itself / by following; the word followed | معمول به اصالت / به تبعیّت؛ متبوع | مَعْمُولٌ بِالأَصَالَةِ / بِالتَّبَعِيَّةِ؛ المَتْبُوعُ | — |
| The six nouns (the five nouns with hanū) | اسماء ستّه | الأَسْمَاءُ السِّتَّةُ | — |
| The original sign / the signs standing in for it | — | العَلَامَةُ الأَصْلِيَّةُ / العَلَامَاتُ النَّائِبَةُ | — |
| The staying / the dropping of the nūn | — | ثُبُوتُ النُّونِ / حَذْفُ النُّونِ | — |
| Sound / weak in the last letter | — | الصَّحِيحُ الآخِرِ / المُعْتَلُّ الآخِرِ | — |
| Doing the iʿrāb (parsing aloud) | — | الإِعْرَابُ (إِعْرَابُ الجُمْلَةِ) | — |

### The sentence

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| Sentence: nominal / verbal | جملهٔ اسمیّه / فعلیّه | الجُمْلَةُ الاسْمِيَّةُ / الفِعْلِيَّةُ | — |
| Mubtadaʾ / khabar | مبتدا / خبر | المُبْتَدَأُ / الخَبَرُ | — |
| Fāʿil / mafʿūl bihi / nāʾib al-fāʿil | فاعل / مفعول به / مفعول ما لم یسمّ فاعله | الفَاعِلُ / المَفْعُولُ بِهِ / نَائِبُ الفَاعِلِ (مَفْعُولُ مَا لَمْ يُسَمَّ فَاعِلُهُ) | — |
| Condition / its answer | شرط / جزا | الشَّرْطُ / الجَزَاءُ | — |
| Muḍāf / muḍāf ilayhi | مضاف / مضاف الیه | المُضَافُ / المُضَافُ إِلَيْهِ | — |
| Like a sentence (a particle with its noun, an adverb) | — | شِبْهُ الجُمْلَةِ (الجَارُّ وَالمَجْرُورُ، الظَّرْفُ) | — |
| The link back to the mubtadaʾ | — | الرَّابِطُ | — |
| Being put first (the abstract governor of the mubtadaʾ) | — | الابْتِدَاءُ | — |
| A pillar / an addition of the sentence | — | العُمْدَةُ / الفَضْلَةُ | — |
| The completeness of speech | — | تَمَامُ الكَلَامِ | — |
| The pronoun of the matter / the separating pronoun | — | ضَمِيرُ الشَّأْنِ / ضَمِيرُ الفَصْلِ | — |
| The lām of beginning | — | لَامُ الابْتِدَاءِ | — |
| The returner (in the ṣila) | — | العَائِدُ | — |

### The governors (ʿawāmil)

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| Kāna and its sisters | افعال ناقصه | الأَفْعَالُ النَّاقِصَةُ (كَانَ وَأَخَوَاتُهَا) | — |
| Inna and its sisters | حروف مشبّهه بالفعل | الحُرُوفُ المُشَبَّهَةُ بِالفِعْلِ (إِنَّ وَأَخَوَاتُهَا) | — |
| Ẓanna and its sisters | افعال قلوب | أَفْعَالُ القُلُوبِ (ظَنَنْتُ وَأَخَوَاتُهَا) | — |
| The lā that denies the kind | لای نفی جنس | لَا النَّافِيَةُ لِلْجِنْسِ | — |
| Nawāṣib / jawāzim | نواصب / جوازم | النَّوَاصِبُ / الجَوَازِمُ | — |
| Heard / analogical governors | عوامل سماعی / قیاسی | العَوَامِلُ السَّمَاعِيَّةُ / القِيَاسِيَّةُ | — |
| Mā and lā that resemble laysa | ما و لای مشبّه به لیس | مَا وَلَا المُشَبَّهَتَانِ بِلَيْسَ | — |
| The complete vague noun (a number before its tamyīz) | اسم مبهم تامّ | الاسْمُ المُبْهَمُ التَّامُّ | — |
| The meaning of the verb (a word that governs by it) | معنای فعل | مَعْنَى الفِعْلِ | — |
| The cancellers (kāna, inna, ẓanantu and their sisters) | — | النَّوَاسِخُ | — |
| The lām of kay / the lām of denial | — | لَامُ كَيْ / لَامُ الجُحُودِ | — |
| An understood an (the Baṣran view) | — | أَنْ مُضْمَرَةٌ | — |
| The verbs of thinking / knowing / making into | — | أَفْعَالُ الظَّنِّ / اليَقِينِ / التَّصْيِيرِ | — |
| Leaving lā without effect / its repetition | — | الإِلْغَاءُ / التَّكْرَارُ | — |
| The stopping mā (innamā) | — | مَا الكَافَّةُ | — |
| Anna / in lightened | — | أَنِ المُخَفَّفَةُ / إِنِ المُخَفَّفَةُ | — |
| Cancelling / suspension (verbs of the heart) | — | الإِلْغَاءُ / التَّعْلِيقُ | — |
| The mā of the Ḥijāz (like laysa) | — | مَا الحِجَازِيَّةُ | — |

### The objects and other manṣūb nouns

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| Absolute object / adverb (mafʿūl fīhi) | مفعول مطلق / مفعول فیه | المَفْعُولُ المُطْلَقُ / المَفْعُولُ فِيهِ (الظَّرْفُ) | — |
| Object of purpose / of accompaniment | مفعول له / مفعول معه | المَفْعُولُ لَهُ / المَفْعُولُ مَعَهُ | — |
| Ḥāl / tamyīz | حال / تمییز | الحَالُ (ذُو الحَالِ) / التَّمْيِيزُ (المُمَيَّزُ) | — |
| Exception / the excepted | استثنا / مستثنی | الاسْتِثْنَاءُ / المُسْتَثْنَى (المُسْتَثْنَى مِنْهُ) | — |
| The vocative | منادی | المُنَادَى | — |
| Speech affirmative / negative; complete / incomplete (in the exception) | موجَب / منفی؛ تامّ / ناقص | مُوجَبٌ / مَنْفِيٌّ؛ تَامٌّ / نَاقِصٌ | — |
| The disconnected exception | استثنای منقطع | الاسْتِثْنَاءُ المُنْقَطِعُ | — |
| The one the ḥāl belongs to | ذوالحال | صَاحِبُ الحَالِ | — |
| The kinds of munādā: single proper name, intended / unintended indefinite, muḍāf, like the muḍāf | مفرد عَلَم، نکرهٔ مقصوده / غیر مقصوده، مضاف، شبیه به مضاف | المُفْرَدُ العَلَمُ، النَّكِرَةُ المَقْصُودَةُ وَغَيْرُ المَقْصُودَةِ، المُضَافُ، المُشَبَّهُ بِالمُضَافِ | — |
| The emptied exception | — | الاسْتِثْنَاءُ المُفَرَّغُ | — |
| Restriction (“none but”) | — | الحَصْرُ | — |
| The wāw of accompaniment | — | وَاوُ المَعِيَّةِ | — |
| The specification of a relation / of a single word | — | تَمْيِيزُ النِّسْبَةِ / تَمْيِيزُ المُفْرَدِ | — |
| The five objects | — | المَفَاعِيلُ الخَمْسَةُ | — |

### The followers (tawābiʿ)

| English | Persian of the books | العربية: in the text | pop-up |
|---|---|---|---|
| The followers | توابع | التَّوَابِعُ | — |
| Naʿt / ʿaṭf / tawkīd / badal | صفت، نعت / عطف / تأکید / بدل | النَّعْتُ (الصِّفَةُ) / العَطْفُ / التَّأْكِيدُ (التَّوْكِيدُ) / البَدَلُ | — |
| The explicative apposition | عطف بیان | عَطْفُ البَيَانِ | — |
| The kinds of badal: of the whole, of the part, of inclusion, of mistake | بدل کل، بدل بعض، بدل اشتمال، بدل غلط | بَدَلُ الكُلِّ، بَدَلُ البَعْضِ، بَدَلُ الاشْتِمَالِ، بَدَلُ الغَلَطِ | — |
| Emphasis by meaning / by repeating the word | — | التَّوْكِيدُ المَعْنَوِيُّ / التَّوْكِيدُ اللَّفْظِيُّ | — |
| The word emphasised / joined to / replaced | — | المُؤَكَّدُ / المَعْطُوفُ عَلَيْهِ / المُبْدَلُ مِنْهُ | — |
| The meanings of the particles of ʿaṭf: plain joining, order at once, order with delay, turning away, correction | — | مُطْلَقُ الجَمْعِ، التَّرْتِيبُ مَعَ التَّعْقِيبِ، التَّرْتِيبُ مَعَ التَّرَاخِي، الإِضْرَابُ، الاسْتِدْرَاكُ | — |

## Choices between competing terms

- maʿrūf / maʿlūm: the Persian primers of the Indian path say معروف; the Arabic keeps المَعْرُوفُ for them.
- ḥāḍir / mukhāṭab: the Persian primers say حاضر (امر حاضر); the Arabic keeps الحَاضِرُ in the names of the forms
  (أَمْرُ الحَاضِرِ) and says المُخَاطَبُ in running text only where the book does.
- jarr / khafḍ: the Persian primers say جرّ; the Arabic says الجَرُّ.
- tawkīd / taʾkīd: the Arabic writes التَّأْكِيدُ where the Persian writes تأکید, التَّوْكِيدُ in the nūn of emphasis
  (نُونُ التَّوْكِيدِ), as the books do.
- The forms of a paradigm: صِيغَةُ الوَاحِدِ المُذَكَّرِ الغَائِبِ، التَّثْنِيَةُ المُذَكَّرُ الغَائِبُ، الجَمْعُ المُذَكَّرُ
  الغَائِبُ … المُتَكَلِّمُ وَحْدَهُ، المُتَكَلِّمُ مَعَ الغَيْرِ.
- Hamzat al-waṣl of the imperative is written with the vowel of the source (اُنْصُرْ، اِضْرِبْ), copied from the English
  Arabic and from the engine; elsewhere plain ا.
- bināʾ: البِنَاءُ is both the fixed ending (naḥw) and, in the Binā, what a pattern is built for; the lessons say which.
- mufrad: «المُفْرَدُ» keeps the book's word in all three senses (not dual or plural; not a sentence; in the munādā, not
  muḍāf); the lessons explain the sense where it matters.
- Case / position (a grid head in qatr): «المَوْضِعُ», not الحَالُ (reserved for the ḥāl); “a passing state” of the ḥāl is
  «هَيْئَةٌ عَارِضَةٌ», “a lasting quality” of the resembling adjective «مَعْنًى ثَابِتٌ» (صِفَةٌ stays the adjective).
- Contest (mughālaba): «المُغَالَبَةُ»; the verb that tells of a great number: «كَمِ الخَبَرِيَّةُ»; turned (tamyīz):
  «المُحَوَّلُ»; the causal adjective: «النَّعْتُ السَّبَبِيُّ»; cutting off (an adjective): «القَطْعُ» (round 4, qatr).
- An entry of a ṭabaqāt book (Nuzhat al-alibbāʾ): «التَّرْجَمَةُ»; the scan of a print: «الصُّورَةُ» (round 4, interface).
- Correction to the line above: «كَمِ الخَبَرِيَّةُ» is the kam (not a verb) that tells of a great number.
