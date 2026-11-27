# Glossary: the English source list

The concepts of The Nahwi in English with their Arabic, under the chapters of al-Mabādiʾ (ṣarf first), and the
English style. Every language gets a `GLOSSARY.md` in `i18n/<code>/` in the same layout (Style; Words under the same
headings; Choices between competing terms) before its translation starts (`docs/i18n.md`). A concept added to the
terms gets a row here first, and then in every language.

## Style

- The technical term in its transliteration (fāʿil, mubtadaʾ, maṣdar) once it has been introduced; the English
  (the doer, the subject, the verbal noun) where the term is first explained and in the pop-ups.
- Arabic always vocalised, with its transliteration (ALA-LC, as in the terms: ʿayn ʿ, hamza ʾ, long vowels ā ī ū).
- The patterns are written on the root ف ع ل (فَعَلَ يَفْعُلُ), the examples on نَصَرَ, ضَرَبَ, فَتَحَ, سَمِعَ, كَرُمَ, حَسِبَ.
- Names of people and books as in the English (Sībawayh, Ibn Mālik, the Alfiyya, al-Ājurrūmiyya).
- "Ṣarf" and "naḥw" stay untranslated in running text; "morphology" and "syntax" only to explain them.
- **Translations of the books** (`staging/<id>/translations/en.json`): the author's sentences in their order, in
  plain English. Where the author defines a term, the English comes first with the term in brackets ("The doer
  (fāʿil) is …"); after that the transliterated term alone. Arabic examples inside a passage are given in
  transliteration with their meaning in curly quotation marks: qāma Zaydun “Zayd stood”. No markdown (no asterisks)
  in the JSON strings, in any language. Verse stays one line per hemistich pair, the hemistichs split by " / ".
  Words the translation adds for sense go in square brackets.
- Case endings are written in the transliteration of examples (*Zaydun*, *Zaydan*, *Zaydin*), and pausal forms only
  where the author speaks of the pause.

## Words

### The two sciences and speech

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| Morphology (ṣarf) | عِلْمُ الصَّرْفِ | ʿilm al-ṣarf | sarf |
| Syntax (naḥw) | عِلْمُ النَّحْوِ | ʿilm al-naḥw | nahw |
| The word | الكَلِمَةُ | al-kalima | nahw |
| Speech (a complete statement) | الكَلَامُ | al-kalām | nahw |
| Utterance | اللَّفْظُ | al-lafẓ | nahw |
| Compound (of more than one word) | المُرَكَّبُ | al-murakkab | nahw |
| Conveying a complete meaning | المُفِيدُ | al-mufīd | nahw |
| By convention (of the Arabs) | بِالوَضْعِ | bi-l-waḍʿ | nahw |
| Conjugation (deriving the forms) | التَّصْرِيفُ | al-taṣrīf | sarf |
| A conjugation table, paradigm | الأَمْثِلَةُ، التَّصْرِيفُ | al-amthila, al-taṣrīf | sarf |
| Usage heard from the Arabs / by analogy | سَمَاعِيٌّ / قِيَاسِيٌّ | samāʿī / qiyāsī | both |

### The kinds of word

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The noun | الاِسْمُ | al-ism | nahw |
| The verb | الفِعْلُ | al-fiʿl | nahw |
| The particle | الحَرْفُ | al-ḥarf | nahw |
| A particle that brings a meaning | حَرْفٌ جَاءَ لِمَعْنًى | ḥarf jāʾa li-maʿnan | nahw |
| Sign (mark) of a kind | العَلَامَةُ | al-ʿalāma | nahw |
| Nunation (tanwīn) | التَّنْوِينُ | al-tanwīn | nahw |
| The article al- (alif and lām) | الأَلِفُ وَاللَّامُ | al-alif wa-l-lām | nahw |
| The particles of khafḍ (prepositions) | حُرُوفُ الخَفْضِ، حُرُوفُ الجَرِّ | ḥurūf al-khafḍ, ḥurūf al-jarr | nahw |
| The particles of oath | حُرُوفُ القَسَمِ | ḥurūf al-qasam | nahw |
| The quiescent tāʾ of the feminine | تَاءُ التَّأْنِيثِ السَّاكِنَةُ | tāʾ al-taʾnīth al-sākina | nahw |
| Definite (maʿrifa) | المَعْرِفَةُ | al-maʿrifa | nahw |
| Indefinite (nakira) | النَّكِرَةُ | al-nakira | nahw |
| The pronoun | الضَّمِيرُ، المُضْمَرُ | al-ḍamīr, al-muḍmar | nahw |
| The proper name | العَلَمُ | al-ʿalam | nahw |
| The demonstrative | اسْمُ الإِشَارَةِ | ism al-ishāra | nahw |
| The vague noun (demonstratives and relatives) | الاسْمُ المُبْهَمُ | al-ism al-mubham | nahw |
| The relative noun | الاسْمُ المَوْصُولُ | al-ism al-mawṣūl | nahw |
| Masculine / feminine | المُذَكَّرُ / المُؤَنَّثُ | al-mudhakkar / al-muʾannath | both |
| Singular / dual / plural | المُفْرَدُ (الوَاحِدُ) / المُثَنَّى (التَّثْنِيَةُ) / الجَمْعُ | al-mufrad (al-wāḥid) / al-muthannā (al-tathniya) / al-jamʿ | both |
| The sound masculine plural | جَمْعُ المُذَكَّرِ السَّالِمُ | jamʿ al-mudhakkar al-sālim | nahw |
| The sound feminine plural | جَمْعُ المُؤَنَّثِ السَّالِمُ | jamʿ al-muʾannath al-sālim | nahw |
| The broken plural | جَمْعُ التَّكْسِيرِ (المُكَسَّرُ) | jamʿ al-taksīr (al-mukassar) | both |
| The five nouns | الأَسْمَاءُ الخَمْسَةُ | al-asmāʾ al-khamsa | nahw |
| The five verbs | الأَفْعَالُ الخَمْسَةُ | al-afʿāl al-khamsa | nahw |
| The diptote (a noun that takes no tanwīn) | مَا لَا يَنْصَرِفُ، غَيْرُ المُنْصَرِفِ | mā lā yanṣarif, ghayr al-munṣarif | nahw |

### Root and pattern

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The morphological scale (faʿala) | المِيزَانُ الصَّرْفِيُّ | al-mīzān al-ṣarfī | sarf |
| The bare form | المُجَرَّدُ | al-mujarrad | sarf |
| The augmented form | المَزِيدُ | al-mazīd | sarf |
| Root letters / added letters | الحُرُوفُ الأَصْلِيَّةُ / حُرُوفُ الزِّيَادَةِ | al-ḥurūf al-aṣliyya / ḥurūf al-ziyāda | sarf |
| The fāʾ, ʿayn and lām of the verb (first, second, third root letter) | فَاءُ الفِعْلِ، عَيْنُهُ، لَامُهُ | fāʾ al-fiʿl, ʿaynuhu, lāmuhu | sarf |
| Triliteral / quadriliteral | الثُّلَاثِيُّ / الرُّبَاعِيُّ | al-thulāthī / al-rubāʿī | sarf |
| Conjugation class (bāb) | البَابُ | al-bāb | sarf |
| Pattern (wazn) | الوَزْنُ | al-wazn | sarf |
| Form (ṣīgha) | الصِّيغَةُ | al-ṣīgha | sarf |
| Vowel / vowelled / unvowelled | الحَرَكَةُ / مُتَحَرِّكٌ / سَاكِنٌ | al-ḥaraka / mutaḥarrik / sākin | both |
| Fatḥa, ḍamma, kasra, sukūn, shadda | الفَتْحَةُ، الضَّمَّةُ، الكَسْرَةُ، السُّكُونُ، الشَّدَّةُ | al-fatḥa, al-ḍamma, al-kasra, al-sukūn, al-shadda | both |

### The verb and its tenses

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The past tense | الفِعْلُ المَاضِي | al-fiʿl al-māḍī | sarf |
| The present–future tense | الفِعْلُ المُضَارِعُ | al-fiʿl al-muḍāriʿ | sarf |
| The imperative | فِعْلُ الأَمْرِ | fiʿl al-amr | sarf |
| The prohibition | النَّهْيُ | al-nahy | sarf |
| The negation (with mā, lā) / the negation of the past (with lam) | النَّفْيُ / الجَحْدُ | al-nafy / al-jaḥd | sarf |
| The question | الاسْتِفْهَامُ | al-istifhām | both |
| Active / passive | المَعْلُومُ (المَعْرُوفُ) / المَجْهُولُ | al-maʿlūm (al-maʿrūf) / al-majhūl | sarf |
| Intransitive / transitive | اللَّازِمُ / المُتَعَدِّي | al-lāzim / al-mutaʿaddī | both |
| Third / second / first person | الغَائِبُ / المُخَاطَبُ (الحَاضِرُ) / المُتَكَلِّمُ | al-ghāʾib / al-mukhāṭab (al-ḥāḍir) / al-mutakallim | sarf |
| The prefixes of the muḍāriʿ (a, n, y, t) | حُرُوفُ المُضَارَعَةِ (أَنَيْتُ) | ḥurūf al-muḍāraʿa (anaytu) | sarf |
| The nūn of emphasis, heavy / light | نُونُ التَّوْكِيدِ الثَّقِيلَةُ / الخَفِيفَةُ | nūn al-tawkīd al-thaqīla / al-khafīfa | sarf |

### Sound and weak

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The sound verb | الصَّحِيحُ | al-ṣaḥīḥ | sarf |
| The weak verb | المُعْتَلُّ | al-muʿtall | sarf |
| Wholly sound (no weak letter, hamza or doubling) | السَّالِمُ | al-sālim | sarf |
| Doubled | المُضَاعَفُ | al-muḍāʿaf | sarf |
| With hamza | المَهْمُوزُ | al-mahmūz | sarf |
| Weak first letter (mithāl) | المِثَالُ | al-mithāl | sarf |
| Weak middle letter (hollow, ajwaf) | الأَجْوَفُ | al-ajwaf | sarf |
| Weak last letter (defective, nāqiṣ) | النَّاقِصُ | al-nāqiṣ | sarf |
| Doubly weak, joined / separated (lafīf) | اللَّفِيفُ المَقْرُونُ / المَفْرُوقُ | al-lafīf al-maqrūn / al-mafrūq | sarf |
| The weak letters (w, y, ā) | حُرُوفُ العِلَّةِ | ḥurūf al-ʿilla | sarf |
| Change of a weak letter (iʿlāl) | الإِعْلَالُ | al-iʿlāl | sarf |
| Assimilation of a letter into the next (idghām) | الإِدْغَامُ | al-idghām | sarf |
| Replacing a letter (ibdāl) | الإِبْدَالُ | al-ibdāl | sarf |

### Derived nouns

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The verbal noun | المَصْدَرُ | al-maṣdar | sarf |
| The active participle | اسْمُ الفَاعِلِ | ism al-fāʿil | sarf |
| The passive participle | اسْمُ المَفْعُولِ | ism al-mafʿūl | sarf |
| The derived noun | المُشْتَقُّ | al-mushtaqq | sarf |
| The verbal noun with m- (maṣdar mīmī) | المَصْدَرُ المِيمِيُّ | al-maṣdar al-mīmī | sarf |
| The adjective like the participle | الصِّفَةُ المُشَبَّهَةُ | al-ṣifa al-mushabbaha | sarf |
| The elative (more, most) | اسْمُ التَّفْضِيلِ | ism al-tafḍīl | sarf |
| The noun of time / of place | اسْمُ الزَّمَانِ / اسْمُ المَكَانِ | ism al-zamān / ism al-makān | sarf |
| The noun of instrument | اسْمُ الآلَةِ | ism al-āla | sarf |
| The intensive form | صِيغَةُ المُبَالَغَةِ | ṣīghat al-mubālagha | sarf |

### Iʿrāb and bināʾ

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| Inflection of the ending (iʿrāb) | الإِعْرَابُ | al-iʿrāb | nahw |
| Fixed ending (bināʾ) | البِنَاءُ | al-bināʾ | nahw |
| The four states of iʿrāb | أَنْوَاعُ الإِعْرَابِ | anwāʿ al-iʿrāb | nahw |
| Inflected / with a fixed ending | المُعْرَبُ / المَبْنِيُّ | al-muʿrab / al-mabnī | nahw |
| The -u state (rafʿ) / in it | الرَّفْعُ / مَرْفُوعٌ | al-rafʿ / marfūʿ | nahw |
| The -a state (naṣb) / in it | النَّصْبُ / مَنْصُوبٌ | al-naṣb / manṣūb | nahw |
| The -i state (khafḍ, jarr) / in it | الخَفْضُ، الجَرُّ / مَخْفُوضٌ، مَجْرُورٌ | al-khafḍ, al-jarr / makhfūḍ, majrūr | nahw |
| The state of the verb with sukūn (jazm) / in it | الجَزْمُ / مَجْزُومٌ | al-jazm / majzūm | nahw |
| The governor / the governed word | العَامِلُ / المَعْمُولُ | al-ʿāmil / al-maʿmūl | nahw |
| Expressed (spoken) / abstract governor | العَامِلُ اللَّفْظِيُّ / المَعْنَوِيُّ | al-ʿāmil al-lafẓī / al-maʿnawī | nahw |
| Explicit noun / pronoun (of a fāʿil, mubtadaʾ …) | الظَّاهِرُ / المُضْمَرُ | al-ẓāhir / al-muḍmar | nahw |
| Attached / separate pronoun | المُتَّصِلُ / المُنْفَصِلُ | al-muttaṣil / al-munfaṣil | nahw |
| Dropping (of a letter or a word) | الحَذْفُ | al-ḥadhf | both |
| Implied (understood) | التَّقْدِيرُ، مُقَدَّرٌ | al-taqdīr, muqaddar | nahw |
| In the place of (an iʿrāb state) | فِي مَحَلِّ … | fī maḥall … | nahw |

### The sentence

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The sentence | الجُمْلَةُ | al-jumla | nahw |
| The nominal sentence | الجُمْلَةُ الاسْمِيَّةُ | al-jumla al-ismiyya | nahw |
| The subject (mubtadaʾ) | المُبْتَدَأُ | al-mubtadaʾ | nahw |
| The predicate (khabar) | الخَبَرُ | al-khabar | nahw |
| The verbal sentence | الجُمْلَةُ الفِعْلِيَّةُ | al-jumla al-fiʿliyya | nahw |
| The doer (fāʿil) | الفَاعِلُ | al-fāʿil | nahw |
| The direct object | المَفْعُولُ بِهِ | al-mafʿūl bihi | nahw |
| The deputy of the doer (the subject of a passive verb) | نَائِبُ الفَاعِلِ؛ المَفْعُولُ الَّذِي لَمْ يُسَمَّ فَاعِلُهُ | nāʾib al-fāʿil; al-mafʿūl alladhī lam yusamma fāʿiluhu | nahw |
| The condition / its answer | الشَّرْطُ / الجَزَاءُ، جَوَابُ الشَّرْطِ | al-sharṭ / al-jazāʾ, jawāb al-sharṭ | nahw |
| The genitive construction: the first / the second term | الإِضَافَةُ: المُضَافُ / المُضَافُ إِلَيْهِ | al-iḍāfa: al-muḍāf / al-muḍāf ilayhi | nahw |

### The governors (ʿawāmil)

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| Kāna and its sisters (the incomplete verbs) | كَانَ وَأَخَوَاتُهَا (الأَفْعَالُ النَّاقِصَةُ) | kāna wa-akhawātuhā (al-afʿāl al-nāqiṣa) | nahw |
| Inna and its sisters (the particles like the verb) | إِنَّ وَأَخَوَاتُهَا (الحُرُوفُ المُشَبَّهَةُ بِالفِعْلِ) | inna wa-akhawātuhā (al-ḥurūf al-mushabbaha bi-l-fiʿl) | nahw |
| Ẓanna and its sisters (the verbs of the heart) | ظَنَنْتُ وَأَخَوَاتُهَا (أَفْعَالُ القُلُوبِ) | ẓanantu wa-akhawātuhā (afʿāl al-qulūb) | nahw |
| The noun / the predicate of kāna, of inna | اسْمُ كَانَ، خَبَرُ كَانَ؛ اسْمُ إِنَّ، خَبَرُ إِنَّ | ism kāna, khabar kāna; ism inna, khabar inna | nahw |
| The lā that denies the whole kind | لَا النَّافِيَةُ لِلْجِنْسِ | lā al-nāfiya li-l-jins | nahw |
| What puts the muḍāriʿ in naṣb / in jazm | النَّوَاصِبُ / الجَوَازِمُ | al-nawāṣib / al-jawāzim | nahw |

### The objects and other manṣūb nouns

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The absolute object (the maṣdar of the verb) | المَفْعُولُ المُطْلَقُ | al-mafʿūl al-muṭlaq | nahw |
| The adverb of time / of place (mafʿūl fīhi) | ظَرْفُ الزَّمَانِ / ظَرْفُ المَكَانِ | ẓarf al-zamān / ẓarf al-makān | nahw |
| The object of purpose | المَفْعُولُ مِنْ أَجْلِهِ (لَهُ) | al-mafʿūl min ajlihi (lahu) | nahw |
| The object of accompaniment | المَفْعُولُ مَعَهُ | al-mafʿūl maʿahu | nahw |
| The state (ḥāl) | الحَالُ | al-ḥāl | nahw |
| The specification (tamyīz) | التَّمْيِيزُ | al-tamyīz | nahw |
| The exception / the excepted | الاسْتِثْنَاءُ / المُسْتَثْنَى | al-istithnāʾ / al-mustathnā | nahw |
| The one called (vocative, munādā) | المُنَادَى | al-munādā | nahw |

### The followers (tawābiʿ)

| English | Arabic | Transliteration | Science |
| --- | --- | --- | --- |
| The followers | التَّوَابِعُ | al-tawābiʿ | nahw |
| The adjective (naʿt, ṣifa) / the word it describes | النَّعْتُ (الصِّفَةُ) / المَنْعُوتُ | al-naʿt (al-ṣifa) / al-manʿūt | nahw |
| The conjunction (ʿaṭf) / the particles of ʿaṭf | العَطْفُ / حُرُوفُ العَطْفِ | al-ʿaṭf / ḥurūf al-ʿaṭf | nahw |
| The emphasis (tawkīd) | التَّوْكِيدُ | al-tawkīd | nahw |
| The substitute (badal) | البَدَلُ | al-badal | nahw |

## Choices between competing terms

- khafḍ and jarr: khafḍ is the word of al-Ājurrūmiyya, jarr that of the Alfiyya and most later books; al-Mabādiʾ
  says khafḍ and names jarr beside it, and a translation keeps both.
- "subject" is the mubtadaʾ, never the fāʿil ("the doer"), so the two are not confused.
- maʿlūm and maʿrūf (active): a translation keeps the word of its book; the English is "active" in both.
- mukhāṭab and ḥāḍir (second person): the Arabic books say mukhāṭab, the Persian and Ottoman primers often ḥāḍir;
  the English is "second person" for both.
- The augmented forms are named by their maṣdar (ifʿāl, tafʿīl, mufāʿala, tafaʿʿul, tafāʿul, infiʿāl, iftiʿāl,
  ifʿilāl, istifʿāl …), never by Western numbers in a translation (the lessons may add "form IV").
- The bābs of the bare triliteral are named by their example verb (the bāb of naṣara), as the books do.
