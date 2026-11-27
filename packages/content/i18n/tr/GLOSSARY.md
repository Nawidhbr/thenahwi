# Turkish glossary (tr)

Use these renderings everywhere: in the translations of the books, the lessons, the terms, the tests and the
interface. The running text uses the technical words (column "in the text") as the medrese teaches sarf and nahiv
(Emsile, Bina, Maksud, İzzi, Merah, Avamil, İzhar, Kafiye). When the reader touches such a word, a pop-up gives the
plain word (column "pop-up"; a dash: no pop-up). The pop-ups are in `packages/content/glossary/tr.json`; keep that
file in step with this list. The layout follows the English source list, `packages/content/i18n/GLOSSARY.md`.

## Style

- Clear, plain modern Turkish for medrese students and interested adults, in the register of today's medrese şerhs
  (not Ottoman prose): short sentences, the author's order, no paraphrase and no commentary in a translation.
- Technical terms in the spelling of the medrese books, without the circumflex (see below) and with the
  Persian izafet (-i, -ı) where the term has it: fiil-i mazi, fiil-i muzari, masdar, ism-i fail, ism-i mef'ul, i'rab,
  merfu, mansub, mecrur, meczum, mübteda, haber, fail, mef'ulün bih. ʿAyn and hamza are written ' (i'rab, mef'ul).
- **Arabic examples** inside a passage: in the simplified Turkish transliteration of the medrese books, then the
  meaning in quotation marks: *kame Zeydün* “Zeyd kalktı”, *raeytü Zeyden* “Zeyd'i gördüm”, *merartü bi-Zeydin*
  “Zeyd'e uğradım”. Letters: ş for ش, c for ج, h for ح خ ه, k for ق ك, ğ for غ, s for ث ص س, z for ذ ز ظ, d for ض
  (as in the medrese reading), t for ط ت, v for و; ʿayn and hamza ' where they are heard in the middle; long vowels
  unmarked; the endings written (*Zeydün, Zeyden, Zeydin*), the article as pronounced (*el-kitabü*, *er-racülü*).
  Fatha is e, and a when its letter is ح خ ص ض ط ظ ع غ ق ر or the next letter is ح خ ص ض ط ظ غ ق (*darabe*, *nasara*,
  *yensuru*, *mensurun*); damma is ü after ب ت ث د ذ ز س ش ف ك ل م ن ه unless an emphatic or guttural follows
  (*nasartü*, *tunsaru*), otherwise u; kasra is ı after ص ض ط ظ غ ق خ (*nasırun*), otherwise i. After a vowel the
  article is joined (*fi'd-dari*, *kame'l-kavmü*), and so is Allah (*bismillahi*, *ilallahi*, *billahi*). The forms of
  the translations are made with this rule by script, so they stay the same in every book.
- No marks on Latin letters that Turkish does not have (the owner's rule, 2026-11-27): no â, î, û, neither in terms
  (kelam, müfid, tenvin, ma'na, fiil-i mazi) nor in examples (ila, fi, kale Zeydün). The Turkish letters ç ş ğ ı ö ü İ
  and the apostrophe for ʿayn and hamza stay. Where two forms would then look alike in one place, a short word in
  brackets tells them apart instead of a mark: a dual in a list without its meaning (nusıra nusıra [tesniye] nusıru),
  a form with an alif beside one without (if'alle [elifle], nussarun [elifle] ve nussarun), a ye (fi'alen ve fi'alen
  [ye ile]), a plural (nasıratün [cem']), a vav that drops (aslı vav ile li-yakul'dur). A Turkish word that would
  become another word (hâlâ, bâba) is rephrased.
- Where the English gives an English word with its transliteration ("the doer (fāʿil)"), the Turkish term is the
  Arabic word itself, so it is written once (“fail”); at the first mention in a definition a short Turkish
  explanation may stand in brackets (“fail (işi yapan)”). No Western grammar words: do not use özne, yüklem, nesne,
  sıfat (in its Turkish-grammar sense), zarf (in its Turkish-grammar sense), yalın hal, belirtme hali, çekim (say
  tasrif), edat (say harf), isim tamlaması (say izafet), etken / edilgen (say ma'lum / meçhul).
- Proper names and book titles in their established Turkish form: Zeyd, Amr, Sibeveyh, İbn Malik, İbn Acurrum, İbn
  Hişam, Abdülkahir el-Cürcani, Seyyid Şerif el-Cürcani, Birgivi (İmam Birgivi), Elfiyye, Acurrumiyye, Katrü'n-neda.
- Dates as in the English: “723/1323”; “d.” becomes “ö.” (“(ö. 723/1323)”).
- Quotation marks: “…”; inside: ‘…’. A heading of the book is translated: “Kelam Babı”, “İ'rab Babı”, “Fasıl”.
- **Reserved words**, which must not be used in their everyday sense, or the reader gets a wrong pop-up:
  - “kelime” only for the word (kelime: isim, fiil, harf); a word in the everyday sense is “söz” or “sözcük”;
  - “kelam” only for speech in the sense of the grammarians (and the science of kelam where a text names it);
  - “harf” for a particle and for a letter of the alphabet, as the medrese says; where they must be kept apart, a
    particle is “harf (ma'na harfi)” and a letter “harf (hece harfi)”;
  - “bab” only for a chapter of the book and for a conjugation class (nasara babı); “haber” only for the predicate
    (news is “havadis”, “bilgi”); “hal” only for the ḥāl (a state in general is “durum”);
  - “sıfat” only for the adjective of the grammarians (na't); a quality in general is “özellik”.

## Words

### The two sciences and speech

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| Morphology (ṣarf) | عِلْمُ الصَّرْفِ | sarf ilmi (ilm-i sarf) | kelimenin yapı ilmi |
| Syntax (naḥw) | عِلْمُ النَّحْوِ | nahiv ilmi (ilm-i nahiv) | cümle ve son hareke ilmi |
| The word | الكَلِمَةُ | kelime | anlamı olan tek söz |
| Speech | الكَلَامُ | kelam | tam bir anlam veren söz |
| Utterance | اللَّفْظُ | lafız | harflerden oluşan ses |
| Compound | المُرَكَّبُ | mürekkeb | birden çok kelimeden oluşan |
| Conveying a complete meaning | المُفِيدُ | müfid | tam bir anlam veren |
| By convention | بِالوَضْعِ | vaz' ile (Arapların koyduğu şekilde) | — |
| Conjugation | التَّصْرِيفُ | tasrif; verb: tasrif etmek, çekmek | bir kelimeden başka sigalar türetmek |
| A conjugation table | الأَمْثِلَةُ | emsile; tasrif-i istılahi (siga siga) / tasrif-i lugavi (şahıs şahıs) | — |
| Heard / by analogy | سَمَاعِيٌّ / قِيَاسِيٌّ | semai / kıyasi | Araplardan duyulan / kurala göre |

### The kinds of word

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The noun | الاسْمُ | isim | ad |
| The verb | الفِعْلُ | fiil | iş, oluş bildiren kelime |
| The particle | الحَرْفُ | harf | tek başına anlam vermeyen kelime |
| A particle that brings a meaning | حَرْفٌ جَاءَ لِمَعْنًى | bir ma'na için gelen harf | — |
| Sign | العَلَامَةُ | alamet | — |
| Nunation | التَّنْوِينُ | tenvin | ismin sonundaki -n sesi |
| The article al- | الأَلِفُ وَاللَّامُ | elif-lam (harf-i ta'rif) | — |
| The particles of khafḍ | حُرُوفُ الخَفْضِ | hafz harfleri (cer harfleri, huruf-ı cerr) | — |
| The particles of oath | حُرُوفُ القَسَمِ | kasem harfleri | — |
| The quiescent tāʾ of the feminine | تَاءُ التَّأْنِيثِ السَّاكِنَةُ | sakin te'nis tası | — |
| Definite | المَعْرِفَةُ | ma'rife | belirli |
| Indefinite | النَّكِرَةُ | nekre | belirsiz |
| The pronoun | الضَّمِيرُ، المُضْمَرُ | zamir, muzmer | — |
| The proper name | العَلَمُ | alem (özel isim) | — |
| The demonstrative | اسْمُ الإِشَارَةِ | ism-i işaret | — |
| The vague noun | الاسْمُ المُبْهَمُ | ism-i mübhem | — |
| The relative noun | الاسْمُ المَوْصُولُ | ism-i mevsul | — |
| Masculine / feminine | المُذَكَّرُ / المُؤَنَّثُ | müzekker / müennes | eril / dişil |
| Singular / dual / plural | المُفْرَدُ / المُثَنَّى (التَّثْنِيَةُ) / الجَمْعُ | müfred / tesniye (müsenna) / cem' | bir / iki / çok |
| The sound masculine plural | جَمْعُ المُذَكَّرِ السَّالِمُ | cem'-i müzekker-i salim | — |
| The sound feminine plural | جَمْعُ المُؤَنَّثِ السَّالِمُ | cem'-i müennes-i salim | — |
| The broken plural | جَمْعُ التَّكْسِيرِ | cem'-i mükesser (cem'-i teksir) | — |
| The five nouns | الأَسْمَاءُ الخَمْسَةُ | esma-i hamse | — |
| The five verbs | الأَفْعَالُ الخَمْسَةُ | ef'al-i hamse | — |
| The diptote | غَيْرُ المُنْصَرِفِ | gayr-i munsarif | tenvin almayan isim |

### Root and pattern

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The morphological scale | المِيزَانُ الصَّرْفِيُّ | mizan-ı sarfi (vezin) | kelimeyi ف ع ل ile tartmak |
| The bare form | المُجَرَّدُ | mücerred | yalnız asli harfler |
| The augmented form | المَزِيدُ | mezid (mezidün fih) | zaid harfli |
| Root letters / added letters | الحُرُوفُ الأَصْلِيَّةُ / حُرُوفُ الزِّيَادَةِ | asli harfler / zaid harfler (huruf-ı zevaid) | — |
| The fāʾ, ʿayn, lām of the verb | فَاءُ الفِعْلِ، عَيْنُهُ، لَامُهُ | faü'l-fiil, aynü'l-fiil, lamü'l-fiil | 1., 2., 3. asli harf |
| Triliteral / quadriliteral | الثُّلَاثِيُّ / الرُّبَاعِيُّ | sülasi / rubai | üç / dört asli harfli |
| Conjugation class | البَابُ | bab | — |
| Pattern | الوَزْنُ | vezin | — |
| Form | الصِّيغَةُ | siga | — |
| Vowel / vowelled / unvowelled | الحَرَكَةُ / مُتَحَرِّكٌ / سَاكِنٌ | hareke / harekeli (müteharrik) / sakin | — |
| Fatḥa, ḍamma, kasra, sukūn, shadda | الفَتْحَةُ … | fetha (üstün), zamme (ötre), kesre (esre), sükun (cezm), şedde | — |
| The model verb of a pattern (the weighed word) | المَوْزُونُ | mevzun | — |
| Regular (forms of a table) | المُطَّرِدُ | muttarid | — |
| The letters of the throat | حُرُوفُ الحَلْقِ | huruf-ı halk | — |
| Attached form (mulḥaq) / attachment (ilḥāq) | المُلْحَقُ / الإِلْحَاقُ | mülhak / ilhak | — |
| The meanings of the bābs: transitivity, multiplying, sharing, compliance, effort, intensifying the intransitive | التَّعْدِيَةُ، التَّكْثِيرُ، المُشَارَكَةُ، المُطَاوَعَةُ، التَّكَلُّفُ، مُبَالَغَةُ اللَّازِمِ | ta'diye, teksir, müşareket, mutavaat, tekellüf, lazımın mübalağası | — |
| The eight divisions (bare / augmented, triliteral / quadriliteral, sound / not sound) | الأَقْسَامُ الثَّمَانِيَةُ | aksam-ı semaniye | — |

### The verb and its tenses

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The past tense | الفِعْلُ المَاضِي | fiil-i mazi | geçmiş zaman fiili |
| The present–future tense | الفِعْلُ المُضَارِعُ | fiil-i muzari | şimdiki ve gelecek zaman fiili |
| The imperative | فِعْلُ الأَمْرِ | emr (emr-i hazır, emr-i gaib) | — |
| The prohibition | النَّهْيُ | nehy (nehy-i hazır, nehy-i gaib) | yasak |
| The negation / of the past | النَّفْيُ / الجَحْدُ | nefy / cahd | olumsuz / geçmişin olumsuzu (lem ile) |
| The question | الاسْتِفْهَامُ | istifham | soru |
| Active / passive | المَعْلُومُ (المَعْرُوفُ) / المَجْهُولُ | ma'lum (ma'ruf) / meçhul | — |
| Intransitive / transitive | اللَّازِمُ / المُتَعَدِّي | lazım / müteaddi | mef'ul almayan / alan |
| Third / second / first person | الغَائِبُ / المُخَاطَبُ (الحَاضِرُ) / المُتَكَلِّمُ | gaib / muhatab (hazır) / mütekellim | 3. / 2. / 1. şahıs |
| The prefixes of the muḍāriʿ | حُرُوفُ المُضَارَعَةِ | muzaraat harfleri (eneytü) | — |
| The nūn of emphasis | نُونُ التَّوْكِيدِ | nun-ı te'kid-i sakile / hafife | — |
| Negation of the past with lam (absolute denial) | جَحْدٌ مُطْلَقٌ | cahd-ı mutlak | — |
| Negation with lammā (comprehensive denial) | جَحْدٌ مُسْتَغْرِقٌ | cahd-ı müstağrak | — |
| Negation of the present (with mā) | نَفْيُ الحَالِ | nefy-i hal | — |
| Negation of the future (with lā) / its emphatic form (with lan) | نَفْيُ الاسْتِقْبَالِ / تَأْكِيدُ نَفْيِ الاسْتِقْبَالِ | nefy-i istikbal / te'kid-i nefy-i istikbal | — |
| Command / prohibition to the absent (third person) | أَمْرُ الغَائِبِ / نَهْيُ الغَائِبِ | emr-i gaib / nehy-i gaib | — |
| Command / prohibition to the one present (second person) | أَمْرُ الحَاضِرِ / نَهْيُ الحَاضِرِ | emr-i hazır / nehy-i hazır | — |
| The verb of wonder (how … !) | فِعْلُ التَّعَجُّبِ | fiil-i taaccüb | — |
| The ghābir (an old name of the muḍāriʿ) | الغَابِرُ | gabir | — |
| Complete / incomplete verb | الفِعْلُ التَّامُّ / النَّاقِصُ | fiil-i tam / fiil-i nakıs | — |

### Sound and weak

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The sound verb | الصَّحِيحُ | sahih | illet harfi olmayan |
| The weak verb | المُعْتَلُّ | mu'tel | illet harfi olan |
| Wholly sound | السَّالِمُ | salim | — |
| Doubled | المُضَاعَفُ | muzaaf | — |
| With hamza | المَهْمُوزُ | mehmuz | — |
| Weak first letter | المِثَالُ | misal | — |
| Weak middle letter | الأَجْوَفُ | ecvef | — |
| Weak last letter | النَّاقِصُ | nakıs | — |
| Doubly weak | اللَّفِيفُ المَقْرُونُ / المَفْرُوقُ | lefif-i makrun / lefif-i mefruk | — |
| The weak letters | حُرُوفُ العِلَّةِ | illet harfleri (vav, ya, elif) | — |
| Change of a weak letter | الإِعْلَالُ | i'lal | — |
| Assimilation | الإِدْغَامُ | idğam | — |
| Replacing a letter | الإِبْدَالُ | ibdal | — |
| The seven divisions (ṣaḥīḥ, mithāl, ajwaf, nāqiṣ, lafīf, muḍāʿaf, mahmūz) | الأَقْسَامُ السَّبْعَةُ | aksam-ı seb'a | — |
| Hamza as first / second / third root letter | مَهْمُوزُ الفَاءِ / العَيْنِ / اللَّامِ | mehmuzü'l-fa / ayn / lam | — |
| Doubling (of the last two root letters) | التَّضْعِيفُ | tad'if | — |
| Two like letters / assimilation necessary, permitted, impossible | المُتَجَانِسَانِ / إِدْغَامٌ وَاجِبٌ، جَائِزٌ، مُمْتَنِعٌ | iki mütecanis / idğam vacip, caiz, mümteni' | — |
| Accidental / original sukūn | سُكُونٌ عَارِضٌ / أَصْلِيٌّ | arızi / asli sükun | — |

### Derived nouns

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The verbal noun | المَصْدَرُ | masdar | — |
| The active participle | اسْمُ الفَاعِلِ | ism-i fail | işi yapan |
| The passive participle | اسْمُ المَفْعُولِ | ism-i mef'ul | işe uğrayan |
| The derived noun | المُشْتَقُّ | müştak | — |
| The maṣdar mīmī | المَصْدَرُ المِيمِيُّ | masdar-ı mimi | — |
| The adjective like the participle | الصِّفَةُ المُشَبَّهَةُ | sıfat-ı müşebbehe | — |
| The elative | اسْمُ التَّفْضِيلِ | ism-i tafdil | daha …, en … |
| The noun of time / of place | اسْمُ الزَّمَانِ / المَكَانِ | ism-i zaman / ism-i mekan | — |
| The noun of instrument | اسْمُ الآلَةِ | ism-i alet | — |
| The intensive form | صِيغَةُ المُبَالَغَةِ | mübalağa sigası (siga-i mübalağa) | — |
| The noun of one act / of the manner | بِنَاءُ المَرَّةِ / بِنَاءُ النَّوْعِ | bina-i merre / bina-i nev' | — |
| The diminutive | اسْمُ التَّصْغِيرِ | ism-i tasgir | — |
| The relative adjective (nisba) | الاسْمُ المَنْسُوبُ | ism-i mensub | — |

### Iʿrāb and bināʾ

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| Inflection of the ending | الإِعْرَابُ | i'rab | kelimenin sonunun değişmesi |
| Fixed ending | البِنَاءُ | bina | sonu değişmemek |
| The four states of iʿrāb | أَنْوَاعُ الإِعْرَابِ | i'rabın çeşitleri | — |
| Inflected / fixed | المُعْرَبُ / المَبْنِيُّ | mu'reb / mebni | — |
| Rafʿ / marfūʿ | الرَّفْعُ / مَرْفُوعٌ | ref' / merfu | -u hali |
| Naṣb / manṣūb | النَّصْبُ / مَنْصُوبٌ | nasb / mansub | -a hali |
| Khafḍ, jarr | الخَفْضُ، الجَرُّ / مَخْفُوضٌ، مَجْرُورٌ | hafz (cerr) / mahfuz (mecrur) | -i hali |
| Jazm / majzūm | الجَزْمُ / مَجْزُومٌ | cezm / meczum | sükun hali (fiilde) |
| The governor / the governed | العَامِلُ / المَعْمُولُ | amil / ma'mul | i'rabı yapan / i'rabı alan |
| Verbal / abstract governor | العَامِلُ اللَّفْظِيُّ / المَعْنَوِيُّ | amil-i lafzi / amil-i ma'nevi | — |
| Dropping | الحَذْفُ | hazf | — |
| Implied | التَّقْدِيرُ، مُقَدَّرٌ | takdir, mukadder (takdiri) | — |
| In the place of | فِي مَحَلِّ … | mahallen merfu / mansub … (… mahallinde) | — |
| The effect of governing | العَمَلُ | amel | — |
| Iʿrāb audible / implied / by place | إِعْرَابٌ لَفْظِيٌّ / تَقْدِيرِيٌّ / مَحَلِّيٌّ | lafzi / takdiri / mahalli i'rab | — |
| Of complete / incomplete iʿrāb | تَامُّ الإِعْرَابِ / نَاقِصُ الإِعْرَابِ | tammü'l-i'rab / nakısü'l-i'rab | — |
| Governed in itself / by following; the word followed | مَعْمُولٌ بِالأَصَالَةِ / بِالتَّبَعِيَّةِ؛ المَتْبُوعُ | asaleten / tebeiyyetle ma'mul; metbu' | — |
| The six nouns (the five nouns with hanū) | الأَسْمَاءُ السِّتَّةُ | esma-i sitte | — |

### The sentence

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The sentence | الجُمْلَةُ | cümle | — |
| The nominal sentence | الجُمْلَةُ الاسْمِيَّةُ | cümle-i ismiyye | isimle başlayan cümle |
| The subject (mubtadaʾ) | المُبْتَدَأُ | mübteda | — |
| The predicate (khabar) | الخَبَرُ | haber | — |
| The verbal sentence | الجُمْلَةُ الفِعْلِيَّةُ | cümle-i fi'liyye | fiille başlayan cümle |
| The doer (fāʿil) | الفَاعِلُ | fail | işi yapan |
| The direct object | المَفْعُولُ بِهِ | mef'ulün bih | işin üzerine düştüğü |
| The deputy of the doer | نَائِبُ الفَاعِلِ | naib-i fail (mef'ul-i ma lem yüsemme failüh) | failin yerine geçen |
| The condition / its answer | الشَّرْطُ / الجَزَاءُ | şart / ceza (cevab-ı şart) | — |
| Muḍāf / muḍāf ilayhi | الإِضَافَةُ: المُضَافُ / المُضَافُ إِلَيْهِ | izafet: muzaf / muzafun ileyh | — |

### The governors (ʿawāmil)

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| Kāna and its sisters | كَانَ وَأَخَوَاتُهَا | kane ve kardeşleri (ef'al-i nakısa) | — |
| Inna and its sisters | إِنَّ وَأَخَوَاتُهَا | inne ve kardeşleri (huruf-ı müşebbehe bi'l-fiil) | — |
| Ẓanna and its sisters | ظَنَنْتُ وَأَخَوَاتُهَا | zanentü ve kardeşleri (ef'al-i kulub) | — |
| The noun / predicate of kāna, inna | اسْمُ كَانَ، خَبَرُ كَانَ … | kane'nin ismi, kane'nin haberi; inne'nin ismi, inne'nin haberi | — |
| The lā that denies the whole kind | لَا النَّافِيَةُ لِلْجِنْسِ | la-yı nefy-i cins | — |
| Nawāṣib / jawāzim | النَّوَاصِبُ / الجَوَازِمُ | nevasıb / cevazim | — |
| Mā and lā that resemble laysa | مَا وَلَا المُشَبَّهَتَانِ بِلَيْسَ | leyse'ye benzeyen ma ve la | — |
| The complete vague noun (a number before its tamyīz) | الاسْمُ المُبْهَمُ التَّامُّ | tam mübhem isim | — |
| The meaning of the verb (a word that governs by it) | مَعْنَى الفِعْلِ | fiil ma'nası | — |

### The objects and other manṣūb nouns

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The absolute object | المَفْعُولُ المُطْلَقُ | mef'ul-i mutlak | — |
| The adverb of time / of place | ظَرْفُ الزَّمَانِ / المَكَانِ | zarf-ı zaman / zarf-ı mekan (mef'ulün fih) | — |
| The object of purpose | المَفْعُولُ مِنْ أَجْلِهِ | mef'ulün leh (mef'ulün min eclih) | — |
| The object of accompaniment | المَفْعُولُ مَعَهُ | mef'ulün maah | — |
| The state | الحَالُ | hal | — |
| The specification | التَّمْيِيزُ | temyiz | — |
| The exception / the excepted | الاسْتِثْنَاءُ / المُسْتَثْنَى | istisna / müstesna | — |
| The vocative | المُنَادَى | münada | seslenilen |
| Speech affirmative / negative; complete / incomplete (in the exception) | مُوجَبٌ / مَنْفِيٌّ؛ تَامٌّ / نَاقِصٌ | muceb / menfi; tam / nakıs | — |
| The disconnected exception | الاسْتِثْنَاءُ المُنْقَطِعُ | istisna-i munkatı' | — |
| The one the ḥāl belongs to | صَاحِبُ الحَالِ (ذُو الحَالِ) | halin sahibi (zü'l-hal) | — |
| The kinds of munādā: single proper name, intended / unintended indefinite, muḍāf, like the muḍāf | المُفْرَدُ العَلَمُ، النَّكِرَةُ المَقْصُودَةُ وَغَيْرُ المَقْصُودَةِ، المُضَافُ، المُشَبَّهُ بِالمُضَافِ | müfred alem, nekre-i maksude / gayr-i maksude, muzaf, şebih bi'l-muzaf | — |

### The followers (tawābiʿ)

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The followers | التَّوَابِعُ | tevabi' (tabi') | i'rabda öncekine uyanlar |
| The adjective / the described | النَّعْتُ / المَنْعُوتُ | na't (sıfat) / men'ut (mevsuf) | — |
| The conjunction / its particles | العَطْفُ / حُرُوفُ العَطْفِ | atf / atf harfleri; ma'tuf, ma'tufun aleyh | — |
| The emphasis | التَّوْكِيدُ | te'kid | — |
| The substitute | البَدَلُ | bedel | — |
| The explicative apposition | عَطْفُ البَيَانِ | atf-ı beyan | — |
| The kinds of badal: of the whole, of the part, of inclusion, of mistake | بَدَلُ الكُلِّ، بَدَلُ البَعْضِ، بَدَلُ الاشْتِمَالِ، بَدَلُ الغَلَطِ | bedel-i küll, bedel-i ba'z, bedel-i iştimal, bedel-i galat | — |

## Choices between competing terms

- khafḍ and jarr: the translation of a book keeps the word of the book (hafz, mahfuz in the Acurrumiyye; cerr,
  mecrur in the Avamil and İzhar); in explanations “hafz (cerr)”.
- mübteda is never “özne”, fail never “özne” either: the two terms stay.
- ma'lum and ma'ruf: the word of the book (the Emsile and the Bina say ma'lum; some primers ma'ruf).
- muhatab and hazır: the word of the book (the Emsile: emr-i hazır; the Arabic books: muhatab).
- The augmented forms by their masdar (if'al babı, tef'il babı, mufaale babı …), as in the Emsile; the bare babs by
  their example (nasara babı, daraba babı …).
- “fiil-i muzari” (not muzari), “fail” (not fail), “mef'ul” (not meful).
- Turkish suffixes after a transliterated form follow the last vowel (dahrace'ye, ihrenceme'ye).

## Choices added in round 4 (izhar, lamiyya, marah 56–62)

- İzhar: müteallak (what a particle of jarr is attached to); zarf-ı müstakar / zarf-ı lağv; hazf ve isal; huruf-ı
  müşebbehe bi'l-fiil in running text “fiile benzeyen harfler”; muhaffefe in / en; şe'n zamiri; ef'al-i mukarebe,
  şuru' fiilleri; ilga / ta'lik; esma-i ef'al (ism-i fiil); muzmer / muzhar, müstetir / bariz, vücuben / cevazen
  müstetir; muttasıl / munfasıl zamir; hakiki / lafzi müennes; müstesna minh, muceb kelam; rabıt; cümle-i haberiyye /
  inşaiyye; ahd lamı / cins lamı; ivaz tenvini; gaye kelimeleri; mahki (hikaye edilen) i'rab; temekkün tenvini;
  aslen / arızi mebni.
- Lamiyye and Merah 56–62: ism-i menkus; ibdal: “vacip ve muttarid”, “caiz ve muttarid”, “caiz ama muttarid değil”;
  hems / cehr, mahreç, hafa; mugalebe; mutavaat te'si; ivaz te'si; teslis; mef'ale (bolluk yeri); ism-i alet; basit
  bahri, tef'ile; in a definition, a metre is “aruz bahri” (vezin stays the pattern). Pattern names that meet without
  marks take a bracket: fe'il [ya ile], fe'al [elifle], fu'ul [vav ile], mif'al [elifle].
