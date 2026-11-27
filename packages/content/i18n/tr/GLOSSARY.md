# Turkish glossary (tr)

Use these renderings everywhere: in the translations of the books, the lessons, the terms, the tests and the
interface. The running text uses the technical words (column "in the text") as the medrese teaches sarf and nahiv
(Emsile, Binâ, Maksûd, İzzî, Merâh, Avâmil, İzhâr, Kâfiye). When the reader touches such a word, a pop-up gives the
plain word (column "pop-up"; a dash: no pop-up). The pop-ups are in `packages/content/glossary/tr.json`; keep that
file in step with this list. The layout follows the English source list, `packages/content/i18n/GLOSSARY.md`.

## Style

- Clear, plain modern Turkish for medrese students and interested adults, in the register of today's medrese şerhs
  (not Ottoman prose): short sentences, the author's order, no paraphrase and no commentary in a translation.
- Technical terms in the spelling of the medrese books, with the circumflex where it marks a long vowel and with the
  Persian izafet (-i, -ı) where the term has it: fiil-i mâzî, fiil-i muzâri, masdar, ism-i fâil, ism-i mef'ûl, i'râb,
  merfû, mansûb, mecrûr, meczûm, mübtedâ, haber, fâil, mef'ûlün bih. ʿAyn and hamza are written ' (i'râb, mef'ûl).
- **Arabic examples** inside a passage: in the simplified Turkish transliteration of the medrese books, then the
  meaning in quotation marks: *kâme Zeydün* “Zeyd kalktı”, *raeytü Zeyden* “Zeyd'i gördüm”, *merartü bi-Zeydin*
  “Zeyd'e uğradım”. Letters: ş for ش, c for ج, h for ح خ ه, k for ق ك, ğ for غ, s for ث ص س, z for ذ ز ظ, d for ض
  (as in the medrese reading), t for ط ت, v for و; ʿayn and hamza ' where they are heard in the middle; long vowels
  â, î, û; the endings written (*Zeydün, Zeyden, Zeydin*), the article as pronounced (*el-kitâbü*, *er-racülü*).
  Fatha is e, and a when its letter is ح خ ص ض ط ظ ع غ ق ر or the next letter is ح خ ص ض ط ظ غ ق (*darabe*, *nasara*,
  *yensuru*, *mensûrun*); damma is ü after ب ت ث د ذ ز س ش ف ك ل م ن ه unless an emphatic or guttural follows
  (*nasartü*, *tunsaru*), otherwise u; kasra is ı after ص ض ط ظ غ ق خ (*nâsırun*), otherwise i. After a vowel the
  article is joined (*fi'd-dâri*, *kâme'l-kavmü*), and so is Allâh (*bismillâhi*, *ilallâhi*, *billâhi*). The forms of
  the translations are made with this rule by script, so they stay the same in every book.
- Where the English gives an English word with its transliteration ("the doer (fāʿil)"), the Turkish term is the
  Arabic word itself, so it is written once (“fâil”); at the first mention in a definition a short Turkish
  explanation may stand in brackets (“fâil (işi yapan)”). No Western grammar words: do not use özne, yüklem, nesne,
  sıfat (in its Turkish-grammar sense), zarf (in its Turkish-grammar sense), yalın hâl, belirtme hâli, çekim (say
  tasrîf), edat (say harf), isim tamlaması (say izâfet), etken / edilgen (say ma'lûm / meçhûl).
- Proper names and book titles in their established Turkish form: Zeyd, Amr, Sîbeveyh, İbn Mâlik, İbn Âcurrûm, İbn
  Hişâm, Abdülkâhir el-Cürcânî, Seyyid Şerîf el-Cürcânî, Birgivî (İmam Birgivî), Elfiyye, Âcurrûmiyye, Katrü'n-nedâ.
- Dates as in the English: “723/1323”; “d.” becomes “ö.” (“(ö. 723/1323)”).
- Quotation marks: “…”; inside: ‘…’. A heading of the book is translated: “Kelâm Bâbı”, “İ'râb Bâbı”, “Fasıl”.
- **Reserved words**, which must not be used in their everyday sense, or the reader gets a wrong pop-up:
  - “kelime” only for the word (kelime: isim, fiil, harf); a word in the everyday sense is “söz” or “sözcük”;
  - “kelâm” only for speech in the sense of the grammarians (and the science of kelâm where a text names it);
  - “harf” for a particle and for a letter of the alphabet, as the medrese says; where they must be kept apart, a
    particle is “harf (ma'nâ harfi)” and a letter “harf (hece harfi)”;
  - “bâb” only for a chapter of the book and for a conjugation class (nasara bâbı); “haber” only for the predicate
    (news is “havadis”, “bilgi”); “hâl” only for the ḥāl (a state in general is “durum”);
  - “sıfat” only for the adjective of the grammarians (na't); a quality in general is “özellik”.

## Words

### The two sciences and speech

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| Morphology (ṣarf) | عِلْمُ الصَّرْفِ | sarf ilmi (ilm-i sarf) | kelimenin yapı ilmi |
| Syntax (naḥw) | عِلْمُ النَّحْوِ | nahiv ilmi (ilm-i nahiv) | cümle ve son hareke ilmi |
| The word | الكَلِمَةُ | kelime | anlamı olan tek söz |
| Speech | الكَلَامُ | kelâm | tam bir anlam veren söz |
| Utterance | اللَّفْظُ | lafız | harflerden oluşan ses |
| Compound | المُرَكَّبُ | mürekkeb | birden çok kelimeden oluşan |
| Conveying a complete meaning | المُفِيدُ | müfîd | tam bir anlam veren |
| By convention | بِالوَضْعِ | vaz' ile (Arapların koyduğu şekilde) | — |
| Conjugation | التَّصْرِيفُ | tasrîf; verb: tasrîf etmek, çekmek | bir kelimeden başka sîgalar türetmek |
| A conjugation table | الأَمْثِلَةُ | emsile; tasrîf-i istılâhî (sîga sîga) / tasrîf-i lugavî (şahıs şahıs) | — |
| Heard / by analogy | سَمَاعِيٌّ / قِيَاسِيٌّ | semâî / kıyâsî | Araplardan duyulan / kurala göre |

### The kinds of word

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The noun | الاسْمُ | isim | ad |
| The verb | الفِعْلُ | fiil | iş, oluş bildiren kelime |
| The particle | الحَرْفُ | harf | tek başına anlam vermeyen kelime |
| A particle that brings a meaning | حَرْفٌ جَاءَ لِمَعْنًى | bir ma'nâ için gelen harf | — |
| Sign | العَلَامَةُ | alâmet | — |
| Nunation | التَّنْوِينُ | tenvîn | ismin sonundaki -n sesi |
| The article al- | الأَلِفُ وَاللَّامُ | elif-lâm (harf-i ta'rîf) | — |
| The particles of khafḍ | حُرُوفُ الخَفْضِ | hafz harfleri (cer harfleri, hurûf-ı cerr) | — |
| The particles of oath | حُرُوفُ القَسَمِ | kasem harfleri | — |
| The quiescent tāʾ of the feminine | تَاءُ التَّأْنِيثِ السَّاكِنَةُ | sâkin te'nîs tâsı | — |
| Definite | المَعْرِفَةُ | ma'rife | belirli |
| Indefinite | النَّكِرَةُ | nekre | belirsiz |
| The pronoun | الضَّمِيرُ، المُضْمَرُ | zamîr, muzmer | — |
| The proper name | العَلَمُ | alem (özel isim) | — |
| The demonstrative | اسْمُ الإِشَارَةِ | ism-i işâret | — |
| The vague noun | الاسْمُ المُبْهَمُ | ism-i mübhem | — |
| The relative noun | الاسْمُ المَوْصُولُ | ism-i mevsûl | — |
| Masculine / feminine | المُذَكَّرُ / المُؤَنَّثُ | müzekker / müennes | eril / dişil |
| Singular / dual / plural | المُفْرَدُ / المُثَنَّى (التَّثْنِيَةُ) / الجَمْعُ | müfred / tesniye (müsennâ) / cem' | bir / iki / çok |
| The sound masculine plural | جَمْعُ المُذَكَّرِ السَّالِمُ | cem'-i müzekker-i sâlim | — |
| The sound feminine plural | جَمْعُ المُؤَنَّثِ السَّالِمُ | cem'-i müennes-i sâlim | — |
| The broken plural | جَمْعُ التَّكْسِيرِ | cem'-i mükesser (cem'-i teksîr) | — |
| The five nouns | الأَسْمَاءُ الخَمْسَةُ | esmâ-i hamse | — |
| The five verbs | الأَفْعَالُ الخَمْسَةُ | ef'âl-i hamse | — |
| The diptote | غَيْرُ المُنْصَرِفِ | gayr-i munsarif | tenvîn almayan isim |

### Root and pattern

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The morphological scale | المِيزَانُ الصَّرْفِيُّ | mîzân-ı sarfî (vezin) | kelimeyi ف ع ل ile tartmak |
| The bare form | المُجَرَّدُ | mücerred | yalnız aslî harfler |
| The augmented form | المَزِيدُ | mezîd (mezîdün fîh) | zâid harfli |
| Root letters / added letters | الحُرُوفُ الأَصْلِيَّةُ / حُرُوفُ الزِّيَادَةِ | aslî harfler / zâid harfler (hurûf-ı zevâid) | — |
| The fāʾ, ʿayn, lām of the verb | فَاءُ الفِعْلِ، عَيْنُهُ، لَامُهُ | fâü'l-fiil, aynü'l-fiil, lâmü'l-fiil | 1., 2., 3. aslî harf |
| Triliteral / quadriliteral | الثُّلَاثِيُّ / الرُّبَاعِيُّ | sülâsî / rubâî | üç / dört aslî harfli |
| Conjugation class | البَابُ | bâb | — |
| Pattern | الوَزْنُ | vezin | — |
| Form | الصِّيغَةُ | sîga | — |
| Vowel / vowelled / unvowelled | الحَرَكَةُ / مُتَحَرِّكٌ / سَاكِنٌ | hareke / harekeli (müteharrik) / sâkin | — |
| Fatḥa, ḍamma, kasra, sukūn, shadda | الفَتْحَةُ … | fetha (üstün), zamme (ötre), kesre (esre), sükûn (cezm), şedde | — |
| The model verb of a pattern (the weighed word) | المَوْزُونُ | mevzûn | — |
| Regular (forms of a table) | المُطَّرِدُ | muttarid | — |
| The letters of the throat | حُرُوفُ الحَلْقِ | hurûf-ı halk | — |
| Attached form (mulḥaq) / attachment (ilḥāq) | المُلْحَقُ / الإِلْحَاقُ | mülhak / ilhâk | — |
| The meanings of the bābs: transitivity, multiplying, sharing, compliance, effort, intensifying the intransitive | التَّعْدِيَةُ، التَّكْثِيرُ، المُشَارَكَةُ، المُطَاوَعَةُ، التَّكَلُّفُ، مُبَالَغَةُ اللَّازِمِ | ta'diye, teksîr, müşâreket, mutâvaat, tekellüf, lâzımın mübâlağası | — |
| The eight divisions (bare / augmented, triliteral / quadriliteral, sound / not sound) | الأَقْسَامُ الثَّمَانِيَةُ | aksâm-ı semâniye | — |

### The verb and its tenses

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The past tense | الفِعْلُ المَاضِي | fiil-i mâzî | geçmiş zaman fiili |
| The present–future tense | الفِعْلُ المُضَارِعُ | fiil-i muzâri | şimdiki ve gelecek zaman fiili |
| The imperative | فِعْلُ الأَمْرِ | emr (emr-i hâzır, emr-i gâib) | — |
| The prohibition | النَّهْيُ | nehy (nehy-i hâzır, nehy-i gâib) | yasak |
| The negation / of the past | النَّفْيُ / الجَحْدُ | nefy / cahd | olumsuz / geçmişin olumsuzu (lem ile) |
| The question | الاسْتِفْهَامُ | istifhâm | soru |
| Active / passive | المَعْلُومُ (المَعْرُوفُ) / المَجْهُولُ | ma'lûm (ma'rûf) / meçhûl | — |
| Intransitive / transitive | اللَّازِمُ / المُتَعَدِّي | lâzım / müteaddî | mef'ûl almayan / alan |
| Third / second / first person | الغَائِبُ / المُخَاطَبُ (الحَاضِرُ) / المُتَكَلِّمُ | gâib / muhâtab (hâzır) / mütekellim | 3. / 2. / 1. şahıs |
| The prefixes of the muḍāriʿ | حُرُوفُ المُضَارَعَةِ | muzâraat harfleri (eneytü) | — |
| The nūn of emphasis | نُونُ التَّوْكِيدِ | nûn-ı te'kîd-i sakîle / hafîfe | — |
| Negation of the past with lam (absolute denial) | جَحْدٌ مُطْلَقٌ | cahd-ı mutlak | — |
| Negation with lammā (comprehensive denial) | جَحْدٌ مُسْتَغْرِقٌ | cahd-ı müstağrak | — |
| Negation of the present (with mā) | نَفْيُ الحَالِ | nefy-i hâl | — |
| Negation of the future (with lā) / its emphatic form (with lan) | نَفْيُ الاسْتِقْبَالِ / تَأْكِيدُ نَفْيِ الاسْتِقْبَالِ | nefy-i istikbâl / te'kîd-i nefy-i istikbâl | — |
| Command / prohibition to the absent (third person) | أَمْرُ الغَائِبِ / نَهْيُ الغَائِبِ | emr-i gâib / nehy-i gâib | — |
| Command / prohibition to the one present (second person) | أَمْرُ الحَاضِرِ / نَهْيُ الحَاضِرِ | emr-i hâzır / nehy-i hâzır | — |
| The verb of wonder (how … !) | فِعْلُ التَّعَجُّبِ | fiil-i taaccüb | — |
| The ghābir (an old name of the muḍāriʿ) | الغَابِرُ | gâbir | — |
| Complete / incomplete verb | الفِعْلُ التَّامُّ / النَّاقِصُ | fiil-i tâm / fiil-i nâkıs | — |

### Sound and weak

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The sound verb | الصَّحِيحُ | sahîh | illet harfi olmayan |
| The weak verb | المُعْتَلُّ | mu'tel | illet harfi olan |
| Wholly sound | السَّالِمُ | sâlim | — |
| Doubled | المُضَاعَفُ | muzâaf | — |
| With hamza | المَهْمُوزُ | mehmûz | — |
| Weak first letter | المِثَالُ | misâl | — |
| Weak middle letter | الأَجْوَفُ | ecvef | — |
| Weak last letter | النَّاقِصُ | nâkıs | — |
| Doubly weak | اللَّفِيفُ المَقْرُونُ / المَفْرُوقُ | lefîf-i makrûn / lefîf-i mefrûk | — |
| The weak letters | حُرُوفُ العِلَّةِ | illet harfleri (vav, yâ, elif) | — |
| Change of a weak letter | الإِعْلَالُ | i'lâl | — |
| Assimilation | الإِدْغَامُ | idğâm | — |
| Replacing a letter | الإِبْدَالُ | ibdâl | — |
| The seven divisions (ṣaḥīḥ, mithāl, ajwaf, nāqiṣ, lafīf, muḍāʿaf, mahmūz) | الأَقْسَامُ السَّبْعَةُ | aksâm-ı seb'a | — |
| Hamza as first / second / third root letter | مَهْمُوزُ الفَاءِ / العَيْنِ / اللَّامِ | mehmûzü'l-fâ / ayn / lâm | — |
| Doubling (of the last two root letters) | التَّضْعِيفُ | tad'îf | — |
| Two like letters / assimilation necessary, permitted, impossible | المُتَجَانِسَانِ / إِدْغَامٌ وَاجِبٌ، جَائِزٌ، مُمْتَنِعٌ | iki mütecânis / idğâm vâcip, câiz, mümteni' | — |
| Accidental / original sukūn | سُكُونٌ عَارِضٌ / أَصْلِيٌّ | ârızî / aslî sükûn | — |

### Derived nouns

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The verbal noun | المَصْدَرُ | masdar | — |
| The active participle | اسْمُ الفَاعِلِ | ism-i fâil | işi yapan |
| The passive participle | اسْمُ المَفْعُولِ | ism-i mef'ûl | işe uğrayan |
| The derived noun | المُشْتَقُّ | müştak | — |
| The maṣdar mīmī | المَصْدَرُ المِيمِيُّ | masdar-ı mîmî | — |
| The adjective like the participle | الصِّفَةُ المُشَبَّهَةُ | sıfat-ı müşebbehe | — |
| The elative | اسْمُ التَّفْضِيلِ | ism-i tafdîl | daha …, en … |
| The noun of time / of place | اسْمُ الزَّمَانِ / المَكَانِ | ism-i zamân / ism-i mekân | — |
| The noun of instrument | اسْمُ الآلَةِ | ism-i âlet | — |
| The intensive form | صِيغَةُ المُبَالَغَةِ | mübâlağa sîgası (sîga-i mübâlağa) | — |
| The noun of one act / of the manner | بِنَاءُ المَرَّةِ / بِنَاءُ النَّوْعِ | binâ-i merre / binâ-i nev' | — |
| The diminutive | اسْمُ التَّصْغِيرِ | ism-i tasgîr | — |
| The relative adjective (nisba) | الاسْمُ المَنْسُوبُ | ism-i mensûb | — |

### Iʿrāb and bināʾ

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| Inflection of the ending | الإِعْرَابُ | i'râb | kelimenin sonunun değişmesi |
| Fixed ending | البِنَاءُ | binâ | sonu değişmemek |
| The four states of iʿrāb | أَنْوَاعُ الإِعْرَابِ | i'râbın çeşitleri | — |
| Inflected / fixed | المُعْرَبُ / المَبْنِيُّ | mu'reb / mebnî | — |
| Rafʿ / marfūʿ | الرَّفْعُ / مَرْفُوعٌ | ref' / merfû | -u hâli |
| Naṣb / manṣūb | النَّصْبُ / مَنْصُوبٌ | nasb / mansûb | -a hâli |
| Khafḍ, jarr | الخَفْضُ، الجَرُّ / مَخْفُوضٌ، مَجْرُورٌ | hafz (cerr) / mahfûz (mecrûr) | -i hâli |
| Jazm / majzūm | الجَزْمُ / مَجْزُومٌ | cezm / meczûm | sükûn hâli (fiilde) |
| The governor / the governed | العَامِلُ / المَعْمُولُ | âmil / ma'mûl | i'râbı yapan / i'râbı alan |
| Verbal / abstract governor | العَامِلُ اللَّفْظِيُّ / المَعْنَوِيُّ | âmil-i lafzî / âmil-i ma'nevî | — |
| Dropping | الحَذْفُ | hazf | — |
| Implied | التَّقْدِيرُ، مُقَدَّرٌ | takdîr, mukadder (takdîrî) | — |
| In the place of | فِي مَحَلِّ … | mahallen merfû / mansûb … (… mahallinde) | — |
| The effect of governing | العَمَلُ | amel | — |
| Iʿrāb audible / implied / by place | إِعْرَابٌ لَفْظِيٌّ / تَقْدِيرِيٌّ / مَحَلِّيٌّ | lafzî / takdîrî / mahallî i'râb | — |
| Of complete / incomplete iʿrāb | تَامُّ الإِعْرَابِ / نَاقِصُ الإِعْرَابِ | tâmmü'l-i'râb / nâkısü'l-i'râb | — |
| Governed in itself / by following; the word followed | مَعْمُولٌ بِالأَصَالَةِ / بِالتَّبَعِيَّةِ؛ المَتْبُوعُ | asâleten / tebeiyyetle ma'mûl; metbû' | — |
| The six nouns (the five nouns with hanū) | الأَسْمَاءُ السِّتَّةُ | esmâ-i sitte | — |

### The sentence

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The sentence | الجُمْلَةُ | cümle | — |
| The nominal sentence | الجُمْلَةُ الاسْمِيَّةُ | cümle-i ismiyye | isimle başlayan cümle |
| The subject (mubtadaʾ) | المُبْتَدَأُ | mübtedâ | — |
| The predicate (khabar) | الخَبَرُ | haber | — |
| The verbal sentence | الجُمْلَةُ الفِعْلِيَّةُ | cümle-i fi'liyye | fiille başlayan cümle |
| The doer (fāʿil) | الفَاعِلُ | fâil | işi yapan |
| The direct object | المَفْعُولُ بِهِ | mef'ûlün bih | işin üzerine düştüğü |
| The deputy of the doer | نَائِبُ الفَاعِلِ | nâib-i fâil (mef'ûl-i mâ lem yüsemme fâilüh) | fâilin yerine geçen |
| The condition / its answer | الشَّرْطُ / الجَزَاءُ | şart / cezâ (cevâb-ı şart) | — |
| Muḍāf / muḍāf ilayhi | الإِضَافَةُ: المُضَافُ / المُضَافُ إِلَيْهِ | izâfet: muzâf / muzâfun ileyh | — |

### The governors (ʿawāmil)

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| Kāna and its sisters | كَانَ وَأَخَوَاتُهَا | kâne ve kardeşleri (ef'âl-i nâkısa) | — |
| Inna and its sisters | إِنَّ وَأَخَوَاتُهَا | inne ve kardeşleri (hurûf-ı müşebbehe bi'l-fiil) | — |
| Ẓanna and its sisters | ظَنَنْتُ وَأَخَوَاتُهَا | zanentü ve kardeşleri (ef'âl-i kulûb) | — |
| The noun / predicate of kāna, inna | اسْمُ كَانَ، خَبَرُ كَانَ … | kâne'nin ismi, kâne'nin haberi; inne'nin ismi, inne'nin haberi | — |
| The lā that denies the whole kind | لَا النَّافِيَةُ لِلْجِنْسِ | lâ-yı nefy-i cins | — |
| Nawāṣib / jawāzim | النَّوَاصِبُ / الجَوَازِمُ | nevâsıb / cevâzim | — |
| Mā and lā that resemble laysa | مَا وَلَا المُشَبَّهَتَانِ بِلَيْسَ | leyse'ye benzeyen mâ ve lâ | — |
| The complete vague noun (a number before its tamyīz) | الاسْمُ المُبْهَمُ التَّامُّ | tam mübhem isim | — |
| The meaning of the verb (a word that governs by it) | مَعْنَى الفِعْلِ | fiil ma'nâsı | — |

### The objects and other manṣūb nouns

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The absolute object | المَفْعُولُ المُطْلَقُ | mef'ûl-i mutlak | — |
| The adverb of time / of place | ظَرْفُ الزَّمَانِ / المَكَانِ | zarf-ı zamân / zarf-ı mekân (mef'ûlün fîh) | — |
| The object of purpose | المَفْعُولُ مِنْ أَجْلِهِ | mef'ûlün leh (mef'ûlün min eclih) | — |
| The object of accompaniment | المَفْعُولُ مَعَهُ | mef'ûlün maah | — |
| The state | الحَالُ | hâl | — |
| The specification | التَّمْيِيزُ | temyîz | — |
| The exception / the excepted | الاسْتِثْنَاءُ / المُسْتَثْنَى | istisnâ / müstesnâ | — |
| The vocative | المُنَادَى | münâdâ | seslenilen |
| Speech affirmative / negative; complete / incomplete (in the exception) | مُوجَبٌ / مَنْفِيٌّ؛ تَامٌّ / نَاقِصٌ | mûceb / menfî; tam / nâkıs | — |
| The disconnected exception | الاسْتِثْنَاءُ المُنْقَطِعُ | istisnâ-i munkatı' | — |
| The one the ḥāl belongs to | صَاحِبُ الحَالِ (ذُو الحَالِ) | hâlin sâhibi (zü'l-hâl) | — |
| The kinds of munādā: single proper name, intended / unintended indefinite, muḍāf, like the muḍāf | المُفْرَدُ العَلَمُ، النَّكِرَةُ المَقْصُودَةُ وَغَيْرُ المَقْصُودَةِ، المُضَافُ، المُشَبَّهُ بِالمُضَافِ | müfred alem, nekre-i maksûde / gayr-i maksûde, muzâf, şebîh bi'l-muzâf | — |

### The followers (tawābiʿ)

| English | Arabic | in the text | pop-up |
|---|---|---|---|
| The followers | التَّوَابِعُ | tevâbi' (tâbi') | i'râbda öncekine uyanlar |
| The adjective / the described | النَّعْتُ / المَنْعُوتُ | na't (sıfat) / men'ût (mevsûf) | — |
| The conjunction / its particles | العَطْفُ / حُرُوفُ العَطْفِ | atf / atf harfleri; ma'tûf, ma'tûfun aleyh | — |
| The emphasis | التَّوْكِيدُ | te'kîd | — |
| The substitute | البَدَلُ | bedel | — |
| The explicative apposition | عَطْفُ البَيَانِ | atf-ı beyân | — |
| The kinds of badal: of the whole, of the part, of inclusion, of mistake | بَدَلُ الكُلِّ، بَدَلُ البَعْضِ، بَدَلُ الاشْتِمَالِ، بَدَلُ الغَلَطِ | bedel-i küll, bedel-i ba'z, bedel-i iştimâl, bedel-i galat | — |

## Choices between competing terms

- khafḍ and jarr: the translation of a book keeps the word of the book (hafz, mahfûz in the Âcurrûmiyye; cerr,
  mecrûr in the Avâmil and İzhâr); in explanations “hafz (cerr)”.
- mübtedâ is never “özne”, fâil never “özne” either: the two terms stay.
- ma'lûm and ma'rûf: the word of the book (the Emsile and the Binâ say ma'lûm; some primers ma'rûf).
- muhâtab and hâzır: the word of the book (the Emsile: emr-i hâzır; the Arabic books: muhâtab).
- The augmented forms by their masdar (if'âl bâbı, tef'îl bâbı, mufâale bâbı …), as in the Emsile; the bare bâbs by
  their example (nasara bâbı, daraba bâbı …).
- “fiil-i muzâri” (not muzârî), “fâil” (not fail), “mef'ûl” (not meful).
- Turkish suffixes after a transliterated form follow the last vowel (dahrace'ye, ihrenceme'ye).
