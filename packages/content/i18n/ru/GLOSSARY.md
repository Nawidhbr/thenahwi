# Russian glossary (ru)

Use these renderings everywhere: in the lessons of the books, the translations of the passages, the terms, the tests
and the interface. The running text uses the technical words of the column «в тексте», as Russian-language madrasa
books and the Russian Arabist grammars write ṣarf and naḥw; the column «пояснение» is the plain word for a pop-up
(`packages/content/glossary/ru.json`, not written yet: keep it in step with this list when it is made). The layout
follows the English source list, `packages/content/i18n/GLOSSARY.md`.

## Style

- Clear standard Russian for Russian-speaking Muslims (Russia, the Caucasus, Central Asia) and students of Arabic:
  short sentences, the author's order, no paraphrase and no commentary in a translation of a passage. Impersonal or
  «мы» as the English does; «вы» where the English addresses the reader. Write ё.
- **Terms.** Where the English uses an English word (the noun, the verb, the particle, the past tense, the pattern,
  the active participle), use the Russian word of the list («имя», «глагол», «частица», «прошедшее время», «модель»,
  «действительное причастие»). Where the English uses the transliterated term (fāʿil, mubtadaʾ, khabar, maṣdar,
  iʿrāb, rafʿ, the muḍāriʿ), use its Cyrillic form from the list («фаиль», «мубтада», «хабар», «масдар», «иъраб»,
  «рафъ», «мудари»). "The doer (fāʿil)" at a first definition becomes «деятель (фаиль)», after that «фаиль» alone.
  One concept, one word, in every book.
- **Cyrillic forms of the terms** (fixed in the list below, not made anew): ʿayn is «ъ» after or before a consonant
  and between short vowels (иъраб, фиъль, мафъуль, рафъ, маъна), and is left out at the start of a word, after a long
  vowel and at the end after a vowel (ильм, фаиль, мудари, марфу); hamza likewise (мубтада, наиб, раъс); no long
  vowels; ṣ ḍ ṭ ẓ ḥ are с д т з х; th and dh are с and з; q is к; j is дж; l before a is «ля» (калям, ляфз, лязим),
  at the end and before a consonant «ль» (фиъль, фаиль, амиль), except in «Аллах». The article is «аль-», assimilated
  before the sun letters (ас-сарф, ан-нахв, ар-рафъ). Terms are declined as Russian nouns where they take Russian
  endings («иъраба», «фаилем», «масдары», «мубтада» and «бина» indeclinable).
- **Arabic examples inside the Russian text** (lessons, tasks, tests, passages): in Cyrillic transliteration with
  the case endings, then the meaning in «…»: кама Зайдун «Зайд встал», раайту Зайдан «я увидел Зайда», марарту
  би-Зайдин «я прошёл мимо Зайда». The transliteration is made by script from the English one (the rule above, with
  the article joined: фи ль-байти, ва-с-сарф), never by hand, so it is the same in every book
  (`/home/claude/ru-tools/translit.py`: the draft writes ⟦qāma Zaydun⟧ and the script converts it). Arabic script
  is copied, never retyped.
- No Latin letters with marks (ā, ṣ, ḥ, ʿ) in Russian text, and no Latin transliterations in running text: the
  Arabic and its transliteration stand at the head of every term and lesson.
- Names in the forms of Russian Islamic studies, the article in lower case with a hyphen (capital at the start of a
  sentence): Сибавейхи, аль-Халиль, аль-Кисаи, аль-Фарра, аль-Мубаррад, Ибн Джинни, аз-Замахшари, Абд аль-Кахир
  аль-Джурджани, Ибн аль-Хаджиб, Ибн Малик, Ибн Хишам, ас-Суюти, Ибн Аджуррум, ар-Ради, Сейид Шариф аль-Джурджани
  (Мир Сейид Шариф), аз-Зинджани, Имам Биргиви (аль-Биргиви), Ахмад ибн Али ибн Масуд, Зайд, Амр, Бакр, Халид.
  God is «Аллах», the Prophet «Пророк».
- Book titles in «…», declined as nouns where they end like Russian nouns: «Аджуррумия» («Аджуррумии»),
  «Альфия», «Катр ан-нада», «Кафия», «Шафия», «Изхар аль-асрар» («Изхар»), «Хидаят ан-нахв», «Иззи»
  («ат-Тасриф аль-Иззи»), «Марах аль-арвах», «Амсила», «Бина аль-афъаль» («Бина»), «Максуд», «Авамиль» (of
  al-Birgivi), «Сто амилей» («Миат амиль», of al-Jurjānī), «Ламийят аль-афъаль», «Мизан ас-сарф» («Мизан»),
  «Нахв-и Мир», «аль-Мабади» (the term course of this site), «аль-Китаб» of Сибавейхи.
- Quotation marks «…», inside „…“. Dates as in the English («723/1323»); "d." is «ум.»; centuries in Roman numerals
  («VIII/XIV век»). Numbers and plurals as Russian writes them (1 урок, 2 урока, 5 уроков).
- Headings of a book are translated: «Глава о калям», «Глава об иърабе», «Раздел».
- Verse in a passage: one line per hemistich pair, the halves split by " / ", as in the English.
- **Reserved words**, not to be used in their everyday sense:
  - «род» only for grammatical gender (мужской / женский род); the jins of the lā of negation is «весь вид»
    («ля, отрицающая весь вид»), a sort in general is «разновидность»;
  - «баб» only for the conjugation class (баб насара); a chapter of a book is «глава»;
  - «хабар» only for the predicate; news is «новости»; «халь» only for the ḥāl (a state in general is «состояние»);
  - «частица» only for the ḥarf as a kind of word; a letter of the alphabet is «буква»;
  - «модель» only for the wazn; «форма» for the ṣīgha;
  - «подлежащее» only for the mubtadaʾ (in pop-ups and first definitions), never for the fāʿil («деятель»).

## Words

### The two sciences and speech

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| Morphology (ṣarf) | عِلْمُ الصَّرْفِ | сарф, наука сарф (ильм ас-сарф) | наука о строении слова |
| Syntax (naḥw) | عِلْمُ النَّحْوِ | нахв, наука нахв (ильм ан-нахв) | наука о связи слов и окончаниях |
| The word | الكَلِمَةُ | слово; калима (where the Arabic word is meant) | одно слово с одним смыслом |
| Speech (a complete statement) | الكَلَامُ | калям (речь) | законченное высказывание |
| Utterance | اللَّفْظُ | ляфз (произнесённое) | звук с буквами |
| Compound | المُرَكَّبُ | составное (мураккаб) | из двух слов и более |
| Conveying a complete meaning | المُفِيدُ | дающее законченный смысл (муфид) | — |
| By convention (of the Arabs) | بِالوَضْعِ | по установлению (би-ль-вадъ) | — |
| Conjugation (deriving the forms) | التَّصْرِيفُ | тасриф (образование форм) | спряжение и образование форм |
| A conjugation table, paradigm | الأَمْثِلَةُ، التَّصْرِيفُ | таблица форм, парадигма (амсила) | — |
| Heard / by analogy | سَمَاعِيٌّ / قِيَاسِيٌّ | самаи (известное по слышанному) / кыяси (по аналогии) | — |

### The kinds of word

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The noun | الاِسْمُ | имя (исм) | — |
| The verb | الفِعْلُ | глагол (фиъль) | — |
| The particle | الحَرْفُ | частица (харф) | слово, смысл которого виден только с другими словами |
| A particle that brings a meaning | حَرْفٌ جَاءَ لِمَعْنًى | частица, пришедшая для смысла | — |
| Sign (mark) of a kind | العَلَامَةُ | признак (аляма) | — |
| Nunation | التَّنْوِينُ | танвин | нун на конце имени, не пишущийся буквой |
| The article al- | الأَلِفُ وَاللَّامُ | алиф и лям (артикль аль-) | — |
| Particles of khafḍ | حُرُوفُ الخَفْضِ، حُرُوفُ الجَرِّ | частицы хафда, частицы джарра (предлоги) | — |
| Particles of oath | حُرُوفُ القَسَمِ | частицы клятвы | — |
| Quiescent tāʾ of the feminine | تَاءُ التَّأْنِيثِ السَّاكِنَةُ | неогласованная та женского рода | — |
| Definite / indefinite | المَعْرِفَةُ / النَّكِرَةُ | определённое (маърифа) / неопределённое (накира) | — |
| The pronoun | الضَّمِيرُ، المُضْمَرُ | местоимение (дамир, мудмар) | — |
| The proper name | العَلَمُ | имя собственное (алям) | — |
| The demonstrative | اسْمُ الإِشَارَةِ | указательное имя (исм аль-ишара) | — |
| The vague noun | الاسْمُ المُبْهَمُ | неясное имя (мубхам) | указательные и относительные имена |
| The relative noun | الاسْمُ المَوْصُولُ | относительное имя (исм мавсуль) | — |
| Masculine / feminine | المُذَكَّرُ / المُؤَنَّثُ | мужской / женский род (музаккар / муаннас) | — |
| Singular / dual / plural | المُفْرَدُ / المُثَنَّى / الجَمْعُ | единственное / двойственное / множественное число (муфрад / мусанна / джамъ) | — |
| Sound masculine plural | جَمْعُ المُذَكَّرِ السَّالِمُ | правильное множественное мужского рода | — |
| Sound feminine plural | جَمْعُ المُؤَنَّثِ السَّالِمُ | правильное множественное женского рода | — |
| Broken plural | جَمْعُ التَّكْسِيرِ | ломаное множественное (джамъ ат-таксир) | — |
| The five nouns / the six nouns | الأَسْمَاءُ الخَمْسَةُ / السِّتَّةُ | пять имён / шесть имён | — |
| The five verbs | الأَفْعَالُ الخَمْسَةُ | пять глаголов | — |
| The diptote | مَا لَا يَنْصَرِفُ، غَيْرُ المُنْصَرِفِ | двухпадежное имя (гайр мунсариф) | имя без танвина |

### Root and pattern

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The morphological scale | المِيزَانُ الصَّرْفِيُّ | морфологическая мера (мизан) | мера слова по ف ع ل |
| The bare form | المُجَرَّدُ | простой (муджаррад) | без добавленных букв |
| The augmented form | المَزِيدُ | приращённый (мазид) | с добавленными буквами |
| Root letters / added letters | الحُرُوفُ الأَصْلِيَّةُ / حُرُوفُ الزِّيَادَةِ | коренные буквы / добавочные буквы | — |
| fāʾ, ʿayn, lām of the verb | فَاءُ الفِعْلِ، عَيْنُهُ، لَامُهُ | фа, айн, лям глагола (первая, вторая, третья коренная) | — |
| Triliteral / quadriliteral | الثُّلَاثِيُّ / الرُّبَاعِيُّ | трёхбуквенный / четырёхбуквенный | — |
| Conjugation class | البَابُ | баб (баб насара) | класс спряжения |
| Pattern | الوَزْنُ | модель (вазн) | — |
| Form | الصِّيغَةُ | форма (сига) | — |
| Vowel / vowelled / unvowelled | الحَرَكَةُ / مُتَحَرِّكٌ / سَاكِنٌ | огласовка / огласованный / неогласованный (сакин) | — |
| Fatḥa, ḍamma, kasra, sukūn, shadda | الفَتْحَةُ … الشَّدَّةُ | фатха, дамма, касра, сукун, шадда | — |
| The weighed word | المَوْزُونُ | взвешиваемое слово (мавзун) | — |
| Regular | المُطَّرِدُ | регулярный | — |
| The letters of the throat | حُرُوفُ الحَلْقِ | гортанные буквы | — |
| Mulḥaq / ilḥāq | المُلْحَقُ / الإِلْحَاقُ | приравненный (мульхак) / приравнивание (ильхак) | — |
| Meanings of the bābs | التَّعْدِيَةُ، التَّكْثِيرُ، المُشَارَكَةُ، المُطَاوَعَةُ، التَّكَلُّفُ، مُبَالَغَةُ اللَّازِمِ | переходность, умножение, взаимность, подчинение действию (мутаваа), усилие, усиление непереходного | — |
| The eight divisions | الأَقْسَامُ الثَّمَانِيَةُ | восемь разделов | — |

### The verb and its tenses

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The past tense | الفِعْلُ المَاضِي | прошедшее время (мади) | — |
| The present–future tense | الفِعْلُ المُضَارِعُ | настояще-будущее время (мудари) | — |
| The imperative | فِعْلُ الأَمْرِ | повелительное наклонение (амр) | — |
| The prohibition | النَّهْيُ | запрещение (нахй) | — |
| Negation / negation of the past | النَّفْيُ / الجَحْدُ | отрицание (нафй) / отрицание прошедшего (джахд) | — |
| The question | الاسْتِفْهَامُ | вопрос (истифхам) | — |
| Active / passive | المَعْلُومُ (المَعْرُوفُ) / المَجْهُولُ | действительный (маълюм, маъруф) / страдательный (маджхуль) залог | — |
| Intransitive / transitive | اللَّازِمُ / المُتَعَدِّي | непереходный (лязим) / переходный (мутаадди) | — |
| Third / second / first person | الغَائِبُ / المُخَاطَبُ (الحَاضِرُ) / المُتَكَلِّمُ | третье лицо (гаиб) / второе лицо (мухатаб, хадир) / первое лицо (мутакаллим) | — |
| The prefixes of the muḍāriʿ | حُرُوفُ المُضَارَعَةِ (أَنَيْتُ) | приставки мудари («анайту») | — |
| The nūn of emphasis | نُونُ التَّوْكِيدِ الثَّقِيلَةُ / الخَفِيفَةُ | нун усиления, тяжёлый / лёгкий | — |
| Jaḥd muṭlaq | جَحْدٌ مُطْلَقٌ | абсолютное отрицание прошедшего (с лам) | — |
| Jaḥd mustaghriq | جَحْدٌ مُسْتَغْرِقٌ | всеохватное отрицание (с ламма) | — |
| Nafy al-ḥāl | نَفْيُ الحَالِ | отрицание настоящего (с ма) | — |
| Nafy al-istiqbāl / its emphatic form | نَفْيُ الاسْتِقْبَالِ / تَأْكِيدُ نَفْيِ الاسْتِقْبَالِ | отрицание будущего (с ля) / усиленное отрицание будущего (с лан) | — |
| Amr / nahy al-ghāʾib | أَمْرُ الغَائِبِ / نَهْيُ الغَائِبِ | повеление / запрещение отсутствующему (третьему лицу) | — |
| Amr / nahy al-ḥāḍir | أَمْرُ الحَاضِرِ / نَهْيُ الحَاضِرِ | повеление / запрещение присутствующему (второму лицу) | — |
| The verb of wonder | فِعْلُ التَّعَجُّبِ | глагол удивления | — |
| The ghābir | الغَابِرُ | габир (старое название мудари) | — |
| Complete / incomplete verb | الفِعْلُ التَّامُّ / النَّاقِصُ | полный / неполный глагол | — |

### Sound and weak

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The sound verb | الصَّحِيحُ | правильный глагол (сахих) | — |
| The weak verb | المُعْتَلُّ | слабый глагол (муътал) | со слабой коренной буквой |
| Wholly sound | السَّالِمُ | целый (салим) | без слабой буквы, хамзы и удвоения |
| Doubled | المُضَاعَفُ | удвоенный (мудааф) | — |
| With hamza | المَهْمُوزُ | хамзованный (махмуз) | — |
| Weak first letter | المِثَالُ | мисаль | слабая первая коренная |
| Weak middle letter | الأَجْوَفُ | полый (аджваф) | слабая вторая коренная |
| Weak last letter | النَّاقِصُ | недостаточный (накис) | слабая третья коренная |
| Doubly weak, joined / separated | اللَّفِيفُ المَقْرُونُ / المَفْرُوقُ | ляфиф макрун / ляфиф мафрук | две слабые коренные |
| The weak letters | حُرُوفُ العِلَّةِ | слабые буквы (و ي ا) | — |
| Iʿlāl | الإِعْلَالُ | иълаль (изменение слабой буквы) | — |
| Idghām | الإِدْغَامُ | идгам (слияние букв) | — |
| Ibdāl | الإِبْدَالُ | ибдаль (замена буквы) | — |
| The seven divisions | الأَقْسَامُ السَّبْعَةُ | семь разделов | — |
| Hamza as first / second / third root letter | مَهْمُوزُ الفَاءِ / العَيْنِ / اللَّامِ | хамза на месте фа / айна / ляма | — |
| Doubling | التَّضْعِيفُ | удвоение (тадъиф) | — |
| Two like letters; idghām necessary, permitted, impossible | المُتَجَانِسَانِ؛ إِدْغَامٌ وَاجِبٌ، جَائِزٌ، مُمْتَنِعٌ | две однородные буквы; идгам обязательный, допустимый, невозможный | — |
| Accidental / original sukūn | سُكُونٌ عَارِضٌ / أَصْلِيٌّ | случайный / исконный сукун | — |

### Derived nouns

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The verbal noun | المَصْدَرُ | масдар (отглагольное имя) | имя действия |
| The active participle | اسْمُ الفَاعِلِ | действительное причастие (исм аль-фаиль) | — |
| The passive participle | اسْمُ المَفْعُولِ | страдательное причастие (исм аль-мафъуль) | — |
| The derived noun | المُشْتَقُّ | производное имя (муштакк) | — |
| Maṣdar mīmī | المَصْدَرُ المِيمِيُّ | масдар мими | — |
| The adjective like the participle | الصِّفَةُ المُشَبَّهَةُ | уподобленное прилагательное (сифа мушаббаха) | — |
| The elative | اسْمُ التَّفْضِيلِ | имя превосходства (исм ат-тафдиль) | — |
| The noun of time / of place | اسْمُ الزَّمَانِ / اسْمُ المَكَانِ | имя времени / имя места | — |
| The noun of instrument | اسْمُ الآلَةِ | имя орудия | — |
| The intensive form | صِيغَةُ المُبَالَغَةِ | форма усиления (мубалага) | — |
| One act / manner | بِنَاءُ المَرَّةِ / بِنَاءُ النَّوْعِ | имя однократности / имя образа действия | — |
| The diminutive | اسْمُ التَّصْغِيرِ | уменьшительное имя (тасгир) | — |
| The nisba | الاسْمُ المَنْسُوبُ | относительное прилагательное (нисба) | — |

### Iʿrāb and bināʾ

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| Inflection of the ending | الإِعْرَابُ | иъраб | изменение окончания |
| Fixed ending | البِنَاءُ | бина | неизменное окончание |
| The four states of iʿrāb | أَنْوَاعُ الإِعْرَابِ | четыре вида иъраба | — |
| Inflected / fixed | المُعْرَبُ / المَبْنِيُّ | муъраб (изменяемое) / мабни (неизменяемое) | — |
| Rafʿ / marfūʿ | الرَّفْعُ / مَرْفُوعٌ | рафъ / марфу (в рафъе) | состояние на -у |
| Naṣb / manṣūb | النَّصْبُ / مَنْصُوبٌ | насб / мансуб (в насбе) | состояние на -а |
| Khafḍ, jarr / makhfūḍ, majrūr | الخَفْضُ، الجَرُّ / مَخْفُوضٌ، مَجْرُورٌ | хафд, джарр / махфуд, маджрур | состояние на -и |
| Jazm / majzūm | الجَزْمُ / مَجْزُومٌ | джазм / маджзум | состояние глагола с сукуном |
| The governor / governed | العَامِلُ / المَعْمُولُ | амиль (управляющее) / маъмуль (управляемое) | — |
| Expressed / abstract governor | العَامِلُ اللَّفْظِيُّ / المَعْنَوِيُّ | словесный / смысловой амиль | — |
| Heard / analogical governor | العَامِلُ السَّمَاعِيُّ / القِيَاسِيُّ | слышимый (самаи) / аналогический (кыяси) амиль | the Arabic term in brackets keeps it apart from иъраб слышимый (lafẓī) |
| Explicit noun / pronoun | الظَّاهِرُ / المُضْمَرُ | явное имя (захир) / местоимение (мудмар) | — |
| Attached / separate pronoun | المُتَّصِلُ / المُنْفَصِلُ | слитное / раздельное местоимение | — |
| Dropping | الحَذْفُ | опущение (хазф) | — |
| Implied | التَّقْدِيرُ، مُقَدَّرٌ | подразумеваемый (такдир, мукаддар) | — |
| In the place of | فِي مَحَلِّ … | на месте … (фи махалли …) | — |
| The effect of governing | العَمَلُ | действие амиля (амаль) | — |
| Iʿrāb audible / implied / by place | إِعْرَابٌ لَفْظِيٌّ / تَقْدِيرِيٌّ / مَحَلِّيٌّ | иъраб слышимый / подразумеваемый / по месту | — |
| Of complete / incomplete iʿrāb | تَامُّ الإِعْرَابِ / نَاقِصُ الإِعْرَابِ | с полным / неполным иърабом | — |
| Governed in itself / by following; the word followed | مَعْمُولٌ بِالأَصَالَةِ / بِالتَّبَعِيَّةِ؛ المَتْبُوعُ | управляемое само по себе / как последующее; предшествующее (матбу) | — |

### The sentence

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The sentence | الجُمْلَةُ | предложение (джумля) | — |
| The nominal sentence | الجُمْلَةُ الاسْمِيَّةُ | именное предложение | начинается с имени |
| The subject (mubtadaʾ) | المُبْتَدَأُ | мубтада | подлежащее именного предложения |
| The predicate (khabar) | الخَبَرُ | хабар | сказуемое |
| The verbal sentence | الجُمْلَةُ الفِعْلِيَّةُ | глагольное предложение | начинается с глагола |
| The doer (fāʿil) | الفَاعِلُ | фаиль (деятель) | тот, кто совершает действие |
| The direct object | المَفْعُولُ بِهِ | прямое дополнение (мафъуль бихи) | — |
| The deputy of the doer | نَائِبُ الفَاعِلِ | наиб аль-фаиль (заместитель деятеля) | подлежащее страдательного глагола |
| The condition / its answer | الشَّرْطُ / الجَزَاءُ، جَوَابُ الشَّرْطِ | условие (шарт) / ответ условия (джаза) | — |
| The genitive construction | الإِضَافَةُ: المُضَافُ / المُضَافُ إِلَيْهِ | идафа: мудаф / мудаф илейхи | — |

### The governors (ʿawāmil)

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| Kāna and its sisters | كَانَ وَأَخَوَاتُهَا | кана и её сёстры (неполные глаголы) | — |
| Inna and its sisters | إِنَّ وَأَخَوَاتُهَا | инна и её сёстры (частицы, подобные глаголу) | — |
| Ẓanna and its sisters | ظَنَنْتُ وَأَخَوَاتُهَا | занна и её сёстры (глаголы сердца) | — |
| The noun / predicate of kāna, of inna | اسْمُ كَانَ … خَبَرُ إِنَّ | исм кана, хабар кана; исм инна, хабар инна | — |
| The lā that denies the whole kind | لَا النَّافِيَةُ لِلْجِنْسِ | ля, отрицающая весь вид | — |
| Nawāṣib / jawāzim | النَّوَاصِبُ / الجَوَازِمُ | то, что ставит мудари в насб / в джазм (навасиб / джавазим) | — |
| Mā and lā like laysa | مَا وَلَا المُشَبَّهَتَانِ بِلَيْسَ | ма и ля, подобные ляйса | — |
| The complete vague noun | الاسْمُ المُبْهَمُ التَّامُّ | полное неясное имя | — |
| The meaning of the verb | مَعْنَى الفِعْلِ | смысл глагола | — |

### The objects and other manṣūb nouns

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The absolute object | المَفْعُولُ المُطْلَقُ | абсолютное дополнение (мафъуль мутлак) | — |
| Adverb of time / place | ظَرْفُ الزَّمَانِ / ظَرْفُ المَكَانِ | обстоятельство времени / места (зарф, мафъуль фихи) | — |
| The object of purpose | المَفْعُولُ مِنْ أَجْلِهِ | дополнение цели (мафъуль ли-аджлихи) | — |
| The object of accompaniment | المَفْعُولُ مَعَهُ | дополнение сопровождения (мафъуль маъаху) | — |
| The state (ḥāl) | الحَالُ | халь (обстоятельство состояния) | — |
| The specification (tamyīz) | التَّمْيِيزُ | тамйиз (уточнение) | — |
| The exception / the excepted | الاسْتِثْنَاءُ / المُسْتَثْنَى | исключение (истисна) / исключаемое (мустасна) | — |
| The one called (munādā) | المُنَادَى | мунада (зовомый) | — |
| Affirmative / negative; complete / incomplete speech | مُوجَبٌ / مَنْفِيٌّ؛ تَامٌّ / نَاقِصٌ | утвердительная / отрицательная; полная / неполная речь | — |
| The disconnected exception | الاسْتِثْنَاءُ المُنْقَطِعُ | отделённое исключение | — |
| The one the ḥāl belongs to | صَاحِبُ الحَالِ | сахиб аль-халь | — |
| Kinds of munādā | المُفْرَدُ العَلَمُ … المُشَبَّهُ بِالمُضَافِ | одиночное имя собственное, подразумеваемое / неподразумеваемое неопределённое, мудаф, подобное мудафу | — |

### The followers (tawābiʿ)

| English | Arabic | в тексте | пояснение |
| --- | --- | --- | --- |
| The followers | التَّوَابِعُ | последующие (таваби) | — |
| The adjective / the word described | النَّعْتُ (الصِّفَةُ) / المَنْعُوتُ | определение (наът) / определяемое (манъут) | — |
| The conjunction / its particles | العَطْفُ / حُرُوفُ العَطْفِ | сочинение (атф) / сочинительные частицы | — |
| The emphasis | التَّوْكِيدُ | усиление (таукид) | — |
| The substitute | البَدَلُ | бадаль (замещение) | — |
| The explicative apposition | عَطْفُ البَيَانِ | пояснительное приложение (атф аль-баян) | — |
| Kinds of badal | بَدَلُ الكُلِّ … بَدَلُ الغَلَطِ | бадаль целого, части, включения, ошибки | — |

## Choices between competing terms

- иъраб, not «ирааб» or «и'раб»; фиъль, not «филь»; мафъуль, not «мафуль»: the ʿayn is kept as «ъ» where the
  madrasa books in Russian keep it (the rule in Style).
- khafḍ and jarr: «хафд» in al-Ājurrūmiyya and the books that say it, «джарр» elsewhere; al-Mabādiʾ says «хафд»
  and names «джарр» beside it, as the English does.
- mubtadaʾ is «мубтада», with «подлежащее» only to explain it; the fāʿil is «фаиль» («деятель»), never
  «подлежащее», so the two are not confused. khabar is «хабар», explained as «сказуемое».
- iḍāfa is «идафа» (Russian Arabist usage), not «изафа».
- The Western cases (именительный, винительный, родительный падеж) are not used for rafʿ, naṣb, khafḍ: write «рафъ»,
  «насб», «хафд/джарр», «джазм»; «в состоянии рафъ» may explain them. «склонение» and «спряжение» only where the
  English says "declension", "conjugation"; the taṣrīf of the madrasa is «тасриф».
- The augmented forms are named by their masdar (ифъаль, тафъиль, муфаала, тафаъуль, тафаул, инфиъаль, ифтиъаль,
  ифъиляль, истифъаль), never by «порода IV» (the lessons may add "form IV" as «IV порода» where the English does).
- The bābs of the bare triliteral by their verb: «баб насара», «баб дараба».
- maʿlūm and maʿrūf: the word of the book; the Russian is «действительный залог» for both. mukhāṭab and ḥāḍir:
  the word of the book; «второе лицо» for both.
- Persian verse inside an Arabic book is given in Cyrillic transliteration with its meaning, as the English does.
