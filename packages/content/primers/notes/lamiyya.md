# Lāmiyyat al-afʿāl: transcriber's notes

Done: `source.json` (13 sections, 52 passages, 114 verses), marker `READY-text`. Working files: `transcribe/01.txt`–`05.txt`
(one line a passage, `page|verse / verse`, hemistichs ` * `, `# heading`).

## The print

- **Base print**: *Majmūʿ min muhimmāt al-mutūn al-mustaʿmala min ghālib khawāṣṣ al-funūn*, Cairo (Miṣr):
  al-Maṭbaʿa al-ʿIlmiyya, 1896 (University of Toronto copy), https://archive.org/details/hdhkitbmajmminmu00jazauoft —
  «متن لامية الأفعال», print pp. 182 (end) – 188 (top). The scan binds these pages in reverse order:
  PDF page = 341 − print page (p. 182 = PDF 159 … p. 188 = PDF 153). Typeset, almost without vowels, so the
  vocalisation is ours. The last three verses (112–114) are at the top of p. 188, followed by «متن السلم».
- **Second witness**: W. Volck, *Ibn Mâlik's Lâmîyat al-afʿâl mit Badraddîn's Commentar*, Leipzig 1866 (public
  domain). Bayerische Staatsbibliothek copy bsb10219143 (found through the Deutsche Digitale Bibliothek), images by
  IIIF: https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb10219143/manifest . The Arabic runs backwards
  through the canvases: p. ١ = canvas 51 … p. ٤٠ = canvas 13 (verses 112–114). The verses carry handwritten numbers
  1–114 in that copy: the same count and order as ours, so the verse numbers below are Volck's. Volck vowels only
  some words, but where he does, and where Badr al-Dīn's commentary names a pattern or gives its examples, that
  decided our vowels **for verses 62–114** and at the doubtful places named below (vv. 13–20, 40). Verses 1–61 were
  otherwise vocalised without Volck: a later pass should compare them (Volck pp. 1–23 = canvases 51–30), above all
  the rare verbs of vv. 21–36.
- **OpenITI** consonantal text (from a modern Shamela edition; /tmp/books/lamiyya/openiti/lam.txt) was used only to
  compare consonants, never for vowels; the print was followed wherever they differ.
- Not used: the Volck copies on Google Books (downloads refused from this environment).

## How the text was made

- Read from the page images (200 dpi, doubtful lines at 400 dpi). Every hemistich was scanned as basīṭ
  (mustafʿilun fāʿilun mustafʿilun faʿilun; the ʿarūḍ always faʿilun) with a scanner; all 114 verses scan except
  v13 and v40, which are kept as printed (below).
- Conventions: a word divided by the hemistich break is written in two parts (وَافْ * تَحْ، مَعَ الْ * لُزُومِ، وَبِتَا
  التْ * تَأْنِيثِ). A hamza dropped for the metre (naql) is written with a bare alif: اوْ، ايْضًا، الَاخِرِ، وَثَلِّثَ
  ارْبَعَهَا. The lengthening of the pronoun (-hū, -hī) and of the plural mīm (عَنْهُمُ v105 and إِيَّاهُمُ v112, read
  ʿanhumū, iyyāhumū) is not written. Pattern names ending in alif maqṣūra are written with ى inside the verse
  (فُعُلَّى، فِعِّيلَى) where the print writes alif; at the rhyme the print's alif is kept (فَعَلَا v68). Punctuation ours.
- The basmala before the first verse is left out (as in The Mantiqi's verse texts). The print's headings are kept;
  the first is «متن لامية الأفعال». The closing verses (110–114: praise, blessing, prayer) have no heading in the
  print and stay in the last section (فصل في بناء الآلة); a lesson may still treat them as the khātima.
- The verse «صحيحست مثالست مضاعف * لفيف ناقص مهموز اجوف» printed just before the title belongs to the text before it
  in the volume, not to the Lāmiyya.

## Doubtful readings and choices (verse numbers as in Volck)

### pp. 182–185 (vv. 1–67)

- v5: «بِفَعْلَلَ الْفِعْلُ»: the print's «بفعل» is فعلل with the lām-lām ligature (metre). v9: «كَسْرًا لِعَيْنِ مُضَارِعٍ»:
  the print runs «كسرالعين» together.
- **v13**: the print reads «وبت قطعا ونم اضممن مع الـ * لزوم في امرر به وجل مثل جلا» (the hemistichs divided inside
  «اللزوم»); Volck reads «وَنَمَّ وَاضْمُمَنْ مَعَ الْـ * ـلُزُومِ … وَجَلَّ مِثْلِ جَلَا». The first hemistich does not scan in
  either form: with «وَاضْمُمَنْ» it is one syllable short at its end («مَعَ الْ»). Kept as printed. (A reading «مَعَ ذِي الْ
  * لُزُومِ» would scan, but neither print has it: for the teacher.) Volck vowels «مِثْلِ جَلَا», we have «مِثْلُ».
- v14: «وَعَمَّ زَمَّ»: the print's dot is small; Volck has زمّ too.
- v15: «وَصَرْخًا شَكَّ أَبَّ وَشَدْ * دَ»: the print runs «وصرخاشك» together. **Volck reads «وَصَوْتًا شَكَّ»** (same
  metre). Kept the print.
- v17: «وَنَبْ * تٌ كَمَّ نَخْلٌ» as printed. The last word is **«بَخِلَا»**: the print has «بخلا» (dot below and dot above,
  the same shapes as «أي بخلا» in v19; the earlier reading «نحلا» was a misreading), Volck too («بخِلا»).
- v18: «صَدَّ أَتَّ»: the print has «أت» (two dots); **Volck has «أَثَّ»** (أثّ يَئِثّ ويَؤُثّ, which has both vowels, as
  this list requires). Kept the print; probably a misprint for أثّ: for the teacher. «حَدَّتْ» and «جَدَّ مَنْ عَمِلَا»
  as Volck.
- v19: «عَنَّ، فَحَّتْ»: Volck has «عنّ فحّت» (the print's فحت is clear there); «شَبَّ حِصَا * نٌ», «أَيْ بَخِلَا» as Volck.
- v20: «مِنْ فَعَلْتُ»: Volck vowels «فَعَلْتَ»; both are possible.
- v22: «لِمَا يَدُلُّ عَلَى فَخْرٍ» as printed (other copies differ); «دَاعِي لُزُومِ انْكِسَارِ الْعَيْنِ»: the print spells «لزم»;
  the metre needs لُزُومِ.
- v23: «وَفَتْحُ مَا حَرْفُ حَلْقٍ غَيْرُ أَوَّلِهِ»: the print spaces «م احرف»; read مَا حَرْفُ.
- v24: «فِي غَيْرِ هَذَا الَّذِي الْحَلْقِيُّ فَتْحًا اشِعْ» as printed (other copies: لِذِي); «اشِعْ» is أَشِعْ with the hamza dropped
  for the metre.
- v28, v32: «الثُّلَاثِي» with the nisba lightened, and «وَخَلْبَسْ» with sukūn, for the metre. v29: «فَمِنْ * هُ اعْتَضْ» as
  printed (other copies: فَعَنْ * هُ).
- v34–36: the lists of rare augmented verbs (زَهْزَقْتُ … قَطْرَنَ الْجَمَلَا; تَرْمَسْتُ … انْتَخَلَا; وَاعْلَوَّطَ …
  لِتَسَلْقَى) are vocalised by us from the patterns they illustrate; «ادْلَمَّسَ» is read from the print (other copies:
  اولمس); «اضْمُمَنْ لِتَسَلْقَى»: the print seems to write «اضمن», the metre needs اضْمُمَنْ. Not yet compared with Volck.
- **v40**: the print reads «في اليا وفي غيرها ان الحق بابى * أو ماله الواو فاء قد وجلا» (checked again on the page
  image). We vowel «إِنْ أُلْحِقَ بِأَبَى»; neither hemistich scans. **Volck reads «إِنْ أُلْحِقَا بِأَبَى * أَوْ مَا لَهُ الْوَاوُ
  فَاءٌ نَحْوُ قَدْ وَجِلَا»**, which scans in both hemistichs. Kept the print as decided; for the teacher.
- v42–44: «الَاخِرِ», «الَاوَّلِ» with the hamza dropped and its vowel moved (naql), as the metre needs; «بِعَيْنٍ اعْتَلَّ»
  indefinite.
- v55: «الْجَزْلَانِ» as printed (with zāy; the usual word is الْجَذْلَان). v57: «صَالِحٌ لِلْكُلِّ» as printed (other copies:
  فِي كُلٍّ). v65: «مُجَرَّدًا أَوْ بِتَا التَّأْنِيثِ» as printed (other copies: وَبِتَا).
- v62–67 (the maṣdar patterns), now checked against Volck's vowels and commentary: «فَعْلٌ وَفِعْلٌ وَفُعْلٌ» (ضَرْب، عِلْم،
  شُغْل); «فَعْلَانُ فِعْلَانُ فُعْلَانُ» (لَيَّان، حِرْمَان، شُكْرَان); «جَلًا رِضًى هُدًى وَصَلَاحٍ»; **«ثُمَّ زِدْ فَعِلَا»**
  (corrected from فَعَلَا: Volck vowels فَعِلا, and the commentary's examples are كَذِب and, with tāʾ, سَرِقَة);
  «فَعَالَةٌ» (ظَرَافَة); «وَالْفَعْلَاءُ» nominative as Volck (we had the genitive); «فِعَالَةٌ وَفُعَالَةٌ» (كِتَابَة، خُفَارَة);
  «الْفُعُولَ»; «ثُمَّ الْفَعِيلُ … وَالْفَعَلَا * نُ» nominative as Volck (we had the accusative); «كَبَيْنُونَةٍ»; «وَمُشْبِهٌ
  شُغُلَا» as printed and as Volck (commentary: شَغَلَهُ شُغُلًا; other copies: فُعُلَا).

### p. 186 (vv. 68–89)

- v68: «وَفُعْلَلٌ وَفَعُولٌ مَعْ فَعَالِيَةٍ * كَذَا فَعِيلِيَّةٌ فُعُلَّةٌ فَعَلَا» as Volck (commentary: سُودَد، قَبُول، كَرَاهِيَة،
  وَلِيدِيَّة، غُلُبَّة، جَمَزَى). Both prints write the rhyme «فعلا» (the pattern فَعَلَى) with alif: kept.
- v69: «مَعْ فَعَلُوتٍ فُعُلَّى مَعْ فُعَلْنِيَةٍ»: the print's last word of the hemistich looks like «فعلتية»; read
  فُعَلْنِيَة with Volck and OpenITI (commentary: سُحَفْنِيَة). «فُعُلَّى»: the print writes «فعلا» (غُلُبَّى).
  «فُعُولِيَّةٌ … وَالْفَتْحُ قَدْ نُقِلَا» (خُصُوصِيَّة and خَصُوصِيَّة).
- v70: «وَمَفْعَلٌ مَفْعِلٌ وَمَفْعُلٌ» as Volck. «قَلَّ مَا حُمِلَا»: the print's «ما حـلا» hides the mīm in the ligature;
  the metre and Volck have حُمِلا.
- v71: «سِوَى فِعْلِ صَوْتٍ، ذَا الْفُعَالُ جَلَا» with Volck's vowels.
- v73: «فَعَالَةً اوْ» (hamza dropped for the metre; Volck writes «او»).
- v75: the print's «كفراريا لفعال» is «كَفِرَارٍ بِالْفِعَالِ» (the dot of the bāʾ missing); Volck has «بالفِعَال».
- v76: the print has «لحرفة» (not «لاحرفة»); «فَعَالَةٌ لِخِصَالٍ» with fatḥa (Volck's commentary); «وَلَا تَهِلَا» from
  وَهَلَ يَهِلُ.
- v77: «فَعْلَةً وَفِعْلَةً» accusative and «الْخُيَلَا» as Volck; «لِهَيْئَةٍ» (Volck spells لهَيْأَة).
- v78: «مَعَ مَدِّ»: the metre needs مَعَ (with حَازَهُو); «مَا الْأَخِيرُ تَلَا» as Volck.
- v79: «مِنْ فِعْلٍ التَّا زِيدَ أَوَّلَهُ» as Volck.
- v80: the print «أت» is «ائْتِ» (Volck «أْتِ»); «بِفِعْلَالٍ» as Volck (زِلْزَال، سِرْهَاف).
- v81: «مِنْ لَامٍ اعْتَلَّ»: the tanwīn is needed by the metre; «أَلْزِمْ» as Volck (the print «الزم» has no hamza;
  الْزَمْ would scan as well).
- v82: «بِتِفِعَّالٍ … وَالْفِعَّالِ فَعَّلَ» as Volck (commentary: تِحِمَّال، كِذَّاب); the metre needs تِفِعَّال.
- v83: the print's «لفعل» is **«لِفَعَّلَ»** (Volck; the metre needs it; تَسْيَار from سَيَّرَ).
- v84: «فِعِّيلَى»: the print writes «فعيلا» (حِثِّيثَى، خِصِّيصَى). «وَمِنْ تَفَاعُلٍ ايْضًا» as Volck: with his tanwīn the
  hamza of أيضا is dropped for the metre.
- v85: the print has «بالفعللة» (no yāʾ); written **«بِالْفُعَلِّيلَةِ»** with Volck and the metre (قُشَعْرِيرَة،
  طُمَأْنِينَة). «الْفُعَلِّلَة» would also scan but is no known pattern.
- v86: «وَفِعْلَةٌ» as Volck (مِرْيَة).
- v87: «وَالِاسْ * تِفْعَالُ» (the scanner misreads وَالِاسْ; checked by hand).
- v88: «تُلْحَقْ» as Volck; «تَبِنْ» as printed and as Volck (OpenITI: يبن).

### pp. 187–188 (vv. 90–114)

- v90: «لَا يَفْعِلْ» with sukūn for the metre; «لِمَصْدَرٍ اوْ»; «قَدْ عُمِلَا» as printed (Volck: فُعِلَا).
- v92: «فَاءً اذَا» (hamza dropped for the metre); «صِدْقَ وِلَا» as Volck.
- v94–97: the commentary says each of these words has both forms (mafʿal and mafʿil); we follow Volck, who vowels
  them with fatḥa: «مَظْلَمَةٌ مَطْلَعُ الْمَجْمَعُ مَحْمَدَةٌ * مَذَمَّةٌ مَنْسَكٌ مَضَنَّةُ الْبُخَلَا», «مَزَلَّةٌ مَفْرَقٌ مَضَلَّةٌ
  وَمَدَبْ * بٌ مَحْشَرٌ مَسْكَنٌ مَحَلُّ مَنْ نَزَلَا», «وَمَعْجَزٌ … مَهْلَكَةٌ * مَعْتَبَةٌ مَفْعَلٌ», «وَزْنُ مَفْعَلَةٍ * مَوْقَعَةٌ».
  «مَطْلَعُ» and «مَضَنَّةُ» without tanwīn for the metre.
- v97: the print reads «كل إذا وجهان»: a stray alif with a mark stands between كل and ذا; read «كُلُّ ذَا» (metre,
  Volck, OpenITI). «وَجْهَانِ» as printed (Volck and OpenITI: وَجْهَاهُ). «مَعْهَا» as both prints.
- v98: «مَأْوٍ» as Volck (the print spells «مأوى»).
- v99: «مِنِ ايْوِ»: the print «ايو» (imperative of أَوَى; Volck «أْوِ»); «وَعُذْرٍ» as Volck; «اظْنُنْ»; «مَنْبِتٍ وَصِلَا»
  as Volck.
- v100: the imperatives as the commentary's verbs (شَرَقَ يَشْرُقُ، غَرَبَ يَغْرُبُ، سَقَطَ يَسْقُطُ، جَزَرَ يَجْزُرُ):
  «بِمَفْعِلِ اشْرُقْ مَعَ اغْرُبْ وَاسْقُطَنْ رَجَعَ اجْ * زُرْ، ثُمَّ مَفْعِلَةِ اقْدِرْ وَاشْرُقَنْ»; «بِمَفْعِلِ» and «مَفْعِلَةِ»
  without tanwīn (metre, Volck). **«بِخَلَا»** is doubtful: Volck's marks are unclear; we read «in an open place»
  (the مَشْرُقَة is a sunny place to sit in winter); بَخِلَا is the other possibility. For the teacher.
- v101: «وَثَلِّثَ ارْبَعَهَا» as Volck (naql); «أَرِبٍ» with tanwīn (metre, Volck); «لِمَهْلِكٍ»: the word takes all three
  vowels (commentary), one chosen.
- v102: «وَلَا تَعْدُ» (عَدَا يَعْدُو).
- v104: «اسْمُ الْأَرْضِ مَفْعَلَةٌ» and «وَالزَّائِدُ اخْتُزِلَا» as Volck.
- v105: the print «كمفعات» is «كَمَفْعَاةٍ» (Volck; أَرْضٌ مَفْعَاةٌ from أَفْعَى); «وَمُفْعِلَةٌ» as Volck (مُضِبَّة،
  مُقْثِئَة); «عَنْهُمُ» is read ʿanhumū for the metre.
- v107: «مِنَ الثُّلَاثِي» with the nisba lightened for the metre.
- v108: «شَذَّ الْمُدُقُّ وَمُسْعُطٌ وَمُكْحُلَةٌ * وَمُدْهُنٌ مُنْصُلٌ» as Volck. **«وَالْآتِ مِنْ نَخَلَا»**: both prints have
  «والآت» (Volck: وَالْآتِ); read as الْآتِي with its yāʾ dropped, «the one that comes from nakhala», i.e. المُنْخُل,
  which the commentary lists. Doubtful; OpenITI has «آلات».
- v109: «يُعْبَأْ» as Volck; the print's «بمن» is cramped.
- v110: «كَمَلَا».
- v112: «وَالصَّحْبِ الْكِرَامِ» as printed (Volck: وَالصَّحَابَةِ); «إِيَّاهُمُ» is read iyyāhumū for the metre.
- v114: «جَذِلًا» as printed and OpenITI (Volck: آمِنًا).

## Superseded

The draft of verses 1–27 that stood here (unchecked, from the first attempt) and the hand-over in
`transcribe/notes.txt` are replaced by this file and `source.json`.
