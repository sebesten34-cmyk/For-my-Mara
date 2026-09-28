import { Letter, MonthAlbum, Song, FutureMilestone, BucketItem } from '../types';

// Month 1 - Decembrie 2025
import m1Photo1 from '../assets/images/m1_dec_1.png';
import m1Photo2 from '../assets/images/m1_dec_2.png';
import m1Photo3 from '../assets/images/m1_dec_3.png';

// Month 2 - Ianuarie 2026
import m2Photo1 from '../assets/images/m2_jan_1.png';
import m2Photo2 from '../assets/images/m2_jan_2.png';
import m2Photo3 from '../assets/images/m2_jan_3.png';

// Month 3 - Februarie 2026
import m3Photo1 from '../assets/images/m3_feb_1.png';
import m3Photo2 from '../assets/images/m3_feb_2.png';
import m3Photo3 from '../assets/images/m3_feb_3.png';

// Month 4 - Martie 2026
import m4Photo1 from '../assets/images/m4_mar_1.png';
import m4Photo2 from '../assets/images/m4_mar_2.jpg';
import m4Photo3 from '../assets/images/m4_mar_3.jpg';

// Month 5 - Aprilie 2026
import m5Photo1 from '../assets/images/m5_apr_1.jpg';
import m5Photo2 from '../assets/images/m5_apr_2.jpg';
import m5Photo3 from '../assets/images/m5_apr_3.jpg';

// Month 6 - Mai 2026
import m6Photo1 from '../assets/images/m6_may_1.jpg';
import m6Photo2 from '../assets/images/m6_may_2.jpg';
import m6Photo3 from '../assets/images/m6_may_3.jpg';

// Month 7 - Iunie 2026
import m7Photo1 from '../assets/images/m7_jun_1.jpg';
import m7Photo2 from '../assets/images/m7_jun_2.jpg';
import m7Photo3 from '../assets/images/m7_jun_3.jpg';

// Month 8 - Iulie 2026
import m8Photo1 from '../assets/images/m8_jul_1.jpg';
import m8Photo2 from '../assets/images/m8_jul_2.jpg';
import m8Photo3 from '../assets/images/m8_jul_3.jpg';

// Month 9 - August & Septembrie 2026
import m9Photo1 from '../assets/images/m9_aug_1.jpg';
import m9Photo2 from '../assets/images/m9_sep_1.jpg';
import m9Photo3 from '../assets/images/m9_sep_2.jpg';

export const RELATIONSHIP_START_DATE = '2025-12-22T00:00:00';
export const CORRECT_SAFE_PIN = '2212';

export const INITIAL_LETTERS: Letter[] = [
  {
    id: 'letter-1',
    title: 'Când ai o zi grea și ești obosită',
    category: 'Mângâiere',
    subtitle: 'You are not doing this battle alone... ☕',
    envelopeColor: 'from-pink-100 to-rose-200',
    stampEmoji: '☕',
    content: `Draga Mara, stiu ca lucrurile nu sunt foarte usoare si de cele mai multe ori nici ceea ce ne dorim noi sa fie, dar nu uita niciodata ca you are not doing this battle alone. I know ca esti obosita, si I know ca cateodata simti ca efectiv nu mai poti, but I am here to prove you, ca inca se poate, si ca esti The best in everything. Inca sunt aici, sa te ajut sa devii cea mai buna versiune a ta, inca sunt aici sa te fac sa zambesti, si inca sunt aici, sa iti redau energia (si poate sa ti si fac un latte cu caramel daca esti extra-obosita 😛) dii mereeuu vooooii fiii aaiiciiii!!! Te iubesc cel mai mult my little Bon Bon, esti tot ce mi am dorit vreodata.`,
  },
  {
    id: 'letter-2',
    title: 'Când nu poți să adormi noaptea',
    category: 'Noapte bună',
    subtitle: 'Dacă cumva te apucă overthinking-ul, ignoră-l... 🌙',
    envelopeColor: 'from-purple-100 to-pink-200',
    stampEmoji: '🌙',
    content: `Hei pretty baby, im sad ca nu poti adormi 😕 Daca cumva te apuca vreun moment din acela de overthinking, IGNORA-L. Vreau sa stii ca tu esti cea mai superba femeie ever iar eu doar pe tine te doresc. In momentul de fata, te as dori la mine n brate sa te pupacesc pana adormi pe pieptul meu, but sadly I cant so I will give you cateva rezolvari pentru problema ta cu somnul:
Inchideti ochii printesa, si prefa-te ca numeri oi, care sar peste un gard, si tot numara (daca te ajuta. imagineaza ti ca sar eu gardul :)))")
Joaca-te ceva jocuri, brawl, roblox etcc ca sa mai treaca timpul ca usor usor iti va fii somn
Iar daca cele de sus nu au mers, poti ofc sa ma suni pentru ca voi ramane treaz cu tine :)
Oricum my little baby, vreau sa stii ca Te iubesc enorm de mult si esti iubirea vietii mele 💕`,
  },
  {
    id: 'letter-3',
    title: 'Când te îndoiești de cât de minunată ești',
    category: 'Valoare & Frumusețe',
    subtitle: 'Nici să nu te aud! Ești CEA MAI MINUNATĂ! 👑',
    envelopeColor: 'from-rose-100 to-pink-300',
    stampEmoji: '👑',
    content: `Baby, nici sa nu te aud. ESTI SUPERBA!! ESTI CEA MAI PERFECTA FEMEIE DE PE TOT UNIVERSUL ASTA. CU ASTA AM SA INCEP, DRAGA MARA. Nu te indoi de cat de minunata esti pentru ca esti CEA MAI MINUNATA SI SUPERBA SI LOVELY FATA DE PE TOT UNIVERSUL ASTA!!! And the most important: MINE!!!!!
Dar pe bune acum printesica, esti superba, din toate punctele de vedere. In primul rand ai ochisorii aia frumosi si dragalasi dulci de ma topesc cand se uita la mine, in al doilea rand ai zambetul ala atat de frumos deci VAAAIII ca innebunesc cand te vad zambind, iaaar in al treilea rand ai rasul ala superb, deci ador cum razi iubire. Sa nu mai zic de parul ala blond SUPERB, de urechile aleaa dragalase, de nasucul ala superb pe cate l as pupa si musca chiar in momentul de fata. Te rog scumpete, nu te indoi de tine, esti the best si asa vei fii mereu for me. Te iubeescc!!`,
  },
  {
    id: 'letter-4',
    title: 'Când ți-e dor de îmbrățișările mele',
    category: 'Dor',
    subtitle: 'Și mie îmi este extraordinar de dor... 🧸',
    envelopeColor: 'from-amber-100 to-pink-200',
    stampEmoji: '🧸',
    content: `Hei printesa, vreau sa incep prin a-ti spune ca si mie imi este extraordinar de dor se imbratisarile tale si de pupicii tai. Iti promit ca cand ne vedem, o sa iti dau cele mai stranse inbratisari si cei mai multi pupicei si saruturi, de te saturi de ele (that's impossible). I miss you so much, si in momentul asta in care scriu, dar si in momentul in care citesti cu mesajul asta, si imi va fi dor de tine si cand il vei citi din nou, si cand il mai citesti odata, si de fiecare data pentru ca imi este dor de tine tot timpul cand nu sunt langa tine. Esti printesica mea si nu pot sta fara tine, I miss you so much si iti promit cei mai multi pupici pe cand ne vedem, Te iuubeeste unicull tauu brunett!!`,
  },
  {
    id: 'letter-5',
    title: 'Când ești supărată pe mine',
    category: 'Iertare',
    subtitle: 'Te rog iubire, iartă-mă... Suntem noi doi împreună 🥺',
    envelopeColor: 'from-red-100 to-pink-200',
    stampEmoji: '🥺',
    content: `Draga blondina, Stiu ca poate am facut ceva ce nu trebuia sa fac, sau am zis chestii pe care nu trebuia sa le zic, sau am reactionat naspa pe ceva la care nu trebuia sa reactionez in asa sens, si imi cer scuze. Nu vreau sa te pierd niciodata, pentru ca esti cea mai importanta persoana din viata mea. Please dont give up on me and on us, cu toate ca ne certam si asa, mereu vreau sa ramanem impreuna, pentru ca, at the end of the day, it's still the both of us texting eachother a good night and an I love you message every night. Stiu ca nu sunt cel mai perfect, si stiu ca si eu gresesc enorm de mult, dar te rog iubire, iarta-ma, pentru ca chiar incerc si chair fac tot ce pot sa ne fie bine la amandoi. Te iubesc enorm de mult iubirea mea si nu vreau sa te pierd niciodata.
Cu drag, iubirea vietii tale`,
  },
  {
    id: 'letter-6',
    title: 'Când te gândești la viitorul nostru',
    category: 'Viitor & Vise',
    subtitle: 'O sobă electrică, Cartoon Network și familia noastră... 🏡',
    envelopeColor: 'from-pink-200 to-fuchsia-200',
    stampEmoji: '🏡',
    content: `Heei mica mea blondina superba,
Ma bucur mult ca te gandesti la viitorul nostru. Si eu o fac sometimes, de aia am facut o scrisoare si pentru asta. Iar eu cand ma gandesc la viitorul nostru, mie imi vine in cap asa: O soba din aia electrica in mijloc care sa incalzeasca camera si sa fie foarte stylish, Un televizor langa el, pe cartoon network, o canapea in fata televizorului, si 4 oameni frumosi alaturi de doua animalute superbe: Eu, Iubirea vietii mele (Mara), Dora (Fiica noastra) si Aris (baiatul nostru), dar si Kota si Tyson, catelusii nostri. That's what I imagine thinking about our future, si abia astept sa ajungem acolo. I am so proud to be your boyfriend and I am even prouder to have a girlfriend like you. Dar, sincer sa fiu, pot fi si mai proud: Avand o sotie ca tine, dar atentie, nu doar ca tine, ci exact tu. That's what I want: You as my wife and a happy life together, and thats what we will get. I love you so much wifey!!
Semnat digital
Niksuletul tau brunet :)`,
  },
  {
    id: 'letter-7',
    title: 'Prima scrisoare pe care ti-am facut-o',
    category: 'Prima Scrisoare',
    subtitle: 'Cerul are multe stele... dar dacă tu ești luna mea? 🌟',
    envelopeColor: 'from-pink-100 to-rose-300',
    stampEmoji: '💌',
    content: `DRAGA MARA, 
îți scriu scrisoarea asta pe timp de seară, moment al zilei în care stelele sclipesc pe cer iar luna le luminează, exact așa cum tu, iubirea mea, îmi luminezi mie zilele și mă încarci cu energie pozitivă pe zi ce trece. Și, sincer sa fiu, n-aș da asta pentru nimic în lume, pentru ca asta este felul tău de a fii, știi să mă faci de fiecare dată mai fericit, mult mai optimist și mă pui mereu cu picioarele pe pământ, iar pentru asta îți sunt și voi fi recunoscător o viață intreaga. Revenind la stelele noastre, știm amândoi ca tu strălucești mai tare decât toate stelele astea, și vorbind retoric despre acel vers foarte cunoscut "Cerul are multe stele", păi, poate avea câte stele vrea ea, dacă tu ești luna mea. Nu îi glazing ce spun eu aici, îi partea mea sinceră despre tine, sau mai bine zis, sentimentele mele puse pe o foaie :)
În scrisoarea precedentă am omis personalitatea ta, pentru ca știam ca o să am mult de scris, și m-am gândit să-ți relatez câte puțin despre acea personalitate în scrisoarea asta. 
Am să încep asta insa, spunând ca, îmi place, îmi place la nebunie personalitatea ta. Este aspectul meu preferat în legătură cu tine, iar faptul ca ești și cea mai frumoasă fată, este doar un bonus, bonus pe care nu îl pot ignora sub nicio formă. O să vorbesc imediat despre cat de frumoasă ești, dar, pentru moment, am să ți zic în continuare ca mereu gândești pozitiv, mereu ai acel vibe superb în tine, dar și nonchalanta aia a ta de necombătut :)))   
pe care normal, ca îl pot face să dispară.
Știi si tu ca mai glumesc câteodată, în momentele în care îți dau "fake kiss", doar ca să ți mai iau din nonchalanta aia :))), iar piedicile pe care ți le dau, normal, tot din același motiv (și ca să te enervez putin) NU MAI SUFLA 
Credeai ca am uitat? cum să uit? buzele alea? vai. Sunt așa de frumoase, și se completează atât de bine cu dinții ăia perfecți și cu fața ta cutie și perfectă, forma ta a ochilor este ceva ce n am mai văzut, și jur, ca prima mea mașină va avea oglinzile retrovizoare după forma ochilor tăi. O să sune ciudat, dar oricum sunt un ciudat, așa o să ți zic și ca ador forma urechilor tale și îmi place la nebunie cum alegi tu ce cercei să ți pui și cat de bine îți stă cu ei. Și da, doamne, ador cum te îmbraci. Ai un stil așa de frumos și atât de smash, îți stă super bine cu toate hainele alea, și nu numa ca sunt hainele frumoase, dar zici ca sunt făcute leit pentru corpul tău. Și doamne, tot timpul îmi aduc aminte de cât de multe emoții am avut prima dată când te am ținut de mână, acolo, fix pe careiului, lângă mall, înainte de lidl și când te conduceam acasă. Da, am ținut minte, exact așa o să țin minte mereu data de 22.12.2025 și 08.08.2009, pentru ca reprezintă cele mai importante chestii pentru mine baby, adică tu. 
Și cel mai important lucru, pe care vreau să l tii minte mereu, este faptul ca Te iubesc enorm de mult, mai mult decât a iubit o Romeo pe julieta, mai mult decât îți iubești tu porumbelul pe adopt me, mai mult decât orice pe pământul ăsta, și pe orice altă planetă. În tine văd un viitor perfect, cu niște copii extrem de frumoși și de educați, și desigur, cu o cada in mijlocul băii :)) 
                        Cu sinceritate și admirație, 
                                unicul tău Dominik :)`,
  },
];

export const INITIAL_MONTHS: MonthAlbum[] = [
  {
    id: 1,
    monthNumber: 1,
    monthName: 'Decembrie 2025',
    year: 2025,
    tagline: '22 Decembrie — Ziua în care ai spus DA! 💍',
    memoryNote: 'Momentul când povestea noastră oficială a început. O zi de iarnă rece transformată în cea mai caldă zi din viața noastră.',
    photos: [
      {
        id: 'dec-1',
        caption: 'Primele noastre poze împreună — primele noastre zâmbete și priviri dulci din Decembrie 2025 📸❤️',
        dateText: 'Decembrie 2025',
        url: m1Photo1,
      },
      {
        id: 'dec-2',
        caption: 'Primele noastre poze împreună — momente de neuitat și căldură sufletească la începutul poveștii 🥰✨',
        dateText: 'Decembrie 2025',
        url: m1Photo2,
      },
      {
        id: 'dec-3',
        caption: 'Aici ai fost de acord ca The only man beside me sa fie kota, and good girl ca te tii de promisiune 🐾💖',
        dateText: 'Decembrie 2025',
        url: m1Photo3,
      },
    ],
  },
  {
    id: 2,
    monthNumber: 2,
    monthName: 'Ianuarie 2026',
    year: 2026,
    tagline: 'Prima noastră lună plină & amintiri magice de iarnă ❄️',
    memoryNote: 'Zile speciale petrecute împreună, zâmbete sincere și primele noastre amintiri de neuitat din noul an.',
    photos: [
      {
        id: 'jan-1',
        caption: 'Ala a fost primul nostru story pe instagram 📱❤️',
        dateText: 'Ianuarie 2026',
        url: m2Photo1,
      },
      {
        id: 'jan-2',
        caption: 'Aici muream de frig amandoi dar ne iubeam neconditionat ❄️🧣❤️',
        dateText: 'Ianuarie 2026',
        url: m2Photo2,
      },
      {
        id: 'jan-3',
        caption: 'Poza asta nu ti a placut dar eu tot o pun ca mie mi place 😜🥰💖',
        dateText: 'Ianuarie 2026',
        url: m2Photo3,
      },
    ],
  },
  {
    id: 3,
    monthNumber: 3,
    monthName: 'Februarie 2026',
    year: 2026,
    tagline: 'Luna iubirii & primul Valentine\'s Day ❤️',
    memoryNote: 'Inimioare peste tot, glume dulci și sentimentul că fiecare zi cu tine este o sărbătoare a dragostei.',
    photos: [
      {
        id: 'feb-1',
        caption: 'Aici eram la mall ca afara ne era frig, uite ce frumosi suntem 🛍️🥶🥰✨',
        dateText: 'Februarie 2026',
        url: m3Photo1,
      },
      {
        id: 'feb-2',
        caption: 'Aici ti-ai luat blanita pe tine, sa fii extra extra hottie ca faceam poze de story 🧥💅🔥💖',
        dateText: 'Februarie 2026',
        url: m3Photo2,
      },
      {
        id: 'feb-3',
        caption: 'Aiciiii ne am petrecut primul Valentines Day impreuna. I love you, my Valentine! 💘🌹💌✨',
        dateText: 'Februarie 2026',
        url: m3Photo3,
      },
    ],
  },
  {
    id: 4,
    monthNumber: 4,
    monthName: 'Martie 2026',
    year: 2026,
    tagline: 'Mărțișorul meu dulce & renașterea primăverii 🌷',
    memoryNote: 'Zilele au început să se încălzească, iar dragostea noastră a înflorit odată cu primii ghiocei.',
    photos: [
      {
        id: 'mar-1',
        caption: 'Aiciii ti am dat martisooor 🌸🌷🎀🤍',
        dateText: 'Martie 2026',
        url: m4Photo1,
      },
      {
        id: 'mar-2',
        caption: 'Aici faceam again poze de story, we were matchy aswell, like our souls matched 📸👯‍♀️💫💕',
        dateText: 'Martie 2026',
        url: m4Photo2,
      },
      {
        id: 'mar-3',
        caption: 'Inainte sa facem poza, ne-am certat, dar ne-am impacat, like we always do, because we were slowly learning to choose eachother no mather what 🥺❤️🩹🤞💖',
        dateText: 'Martie 2026',
        url: m4Photo3,
      },
    ],
  },
  {
    id: 5,
    monthNumber: 5,
    monthName: 'Aprilie 2026',
    year: 2026,
    tagline: 'Primăvară în floare, seri calde și ciocolată 🍫',
    memoryNote: 'Plimbări nesfârșite sub cerul senin de primăvară, râsete copioase și îmbrățișări strânse.',
    photos: [
      {
        id: 'apr-1',
        caption: 'Aiciiii am fost prima data la tine AND I WAS SHITTING MY PANTS ca ti-am cunoscut toata familia, dar am lasat o impresie buna and Im glad for it 🫣😅🏡💖',
        dateText: 'Aprilie 2026',
        url: m5Photo1,
      },
      {
        id: 'apr-2',
        caption: 'Aici a cerut mother poza cu noi, UITE CE DRAGUTI SUNTEEEMMM 🥹📸👩‍👦💕✨',
        dateText: 'Aprilie 2026',
        url: m5Photo2,
      },
      {
        id: 'apr-3',
        caption: 'Aici ai fost TU prima data la mine, si tot atunci a fost the first time when we got intimate and si ne-am aratat unul altuia cat de multa incredere avem unul in altul. I love you pretty! 🫂🧸🔐❤️',
        dateText: 'Aprilie 2026',
        url: m5Photo3,
      },
    ],
  },
  {
    id: 6,
    monthNumber: 6,
    monthName: 'Mai 2026',
    year: 2026,
    tagline: 'Luna florilor & priviri îndrăgostite 🌺',
    memoryNote: 'Seri lungi când soarele apunea târziu, iar noi număram stelele și visam la viitorul nostru împreună.',
    photos: [
      {
        id: 'may-1',
        caption: 'Again poza de storyy, but de pe telefonul meu hehehee 📱📸😋✌️',
        dateText: 'Mai 2026',
        url: m6Photo1,
      },
      {
        id: 'may-2',
        caption: 'Aici again la mall, prima data caaand ai purtat geaca ta de blug cu sclipicele hehehe 🧥✨🛍️🥰',
        dateText: 'Mai 2026',
        url: m6Photo2,
      },
      {
        id: 'may-3',
        caption: 'WALL-E and EVA 🤖🌱💕🚀',
        dateText: 'Mai 2026',
        url: m6Photo3,
      },
    ],
  },
  {
    id: 7,
    monthNumber: 7,
    monthName: 'Iunie 2026',
    year: 2026,
    tagline: 'Începutul primei noastre veri de poveste ☀️',
    memoryNote: 'Căldură, înghețată, vacanță și sentimentul liber de a fi îndrăgostit până peste cap.',
    photos: [
      {
        id: 'jun-1',
        caption: 'Aici m-ai vazut prima data mort de beat, dar te-ai imbatat si tu hehehe 🍻🤪🥴❤️',
        dateText: 'Iunie 2026',
        url: m7Photo1,
      },
      {
        id: 'jun-2',
        caption: 'Doi indragostiti pe o banca langa dig 🌊🪑🌅💑✨',
        dateText: 'Iunie 2026',
        url: m7Photo2,
      },
      {
        id: 'jun-3',
        caption: 'Aici a adormit pestele cel mare in bratele mele 🐟😴🧸💤💕',
        dateText: 'Iunie 2026',
        url: m7Photo3,
      },
    ],
  },
  {
    id: 8,
    monthNumber: 8,
    monthName: 'Iulie 2026',
    year: 2026,
    tagline: 'Nopți sub stele & aventuri de iulie ✨',
    memoryNote: 'Vara în plină desfășurare, râsete nesfârșite și dorințe puse pe stele căzătoare pentru noi doi.',
    photos: [
      {
        id: 'jul-1',
        caption: 'Aiciii ti am ales rochita pentru majoraaat 👗👑✨😍',
        dateText: 'Iulie 2026',
        url: m8Photo1,
      },
      {
        id: 'jul-2',
        caption: 'Aici eram doi frumosi indragostiti care mergeau la majorat impreunaaa 💃🕺🥂🎉💖',
        dateText: 'Iulie 2026',
        url: m8Photo2,
      },
      {
        id: 'jul-3',
        caption: 'FIRST TIME COOKING TOGETHEEERR (moments before disaster...) 👩‍🍳🍳🔥😂🍝',
        dateText: 'Iulie 2026',
        url: m8Photo3,
      },
    ],
  },
  {
    id: 9,
    monthNumber: 9,
    monthName: 'August & Septembrie 2026',
    year: 2026,
    tagline: 'Astăzi: 9 LUNI! Sărbătoarea noastră regală 👑',
    memoryNote: '9 luni pline de fericire sinceră, de sprijin și de visuri mărețe. Astăzi sărbătorim cel mai dulce capitol din viața noastră!',
    photos: [
      {
        id: 'aug-1',
        caption: 'AICIII A FOST MY 18TH BIRTHDAYY, THANK YOU FOR THE GIFTT BON BON 🎂🎁🔞🎉❤️',
        dateText: 'August 2026',
        url: m9Photo1,
      },
      {
        id: 'sep-1',
        caption: 'Aici cu iubirea vietii mele eram la Aqua 🌊🏊‍♂️💦☀️👙🥰',
        dateText: 'August 2026',
        url: m9Photo2,
      },
      {
        id: 'sep-2',
        caption: 'Aici a fost ziua fetitei mele, LA MULTI ANI BON BONNN!!! 🥳🎂👑💖🎀✨',
        dateText: 'August 2026',
        url: m9Photo3,
      },
    ],
  },
];

export const SONGS_PLAYLIST: Song[] = [
  {
    id: 'song-1',
    title: 'I Wanna Be Yours',
    artist: 'Arctic Monkeys',
    duration: '3:04',
    dedication: '„Piesa noastră atemporală... Indiferent de ce s-ar întâmpla în lumea asta, I just wanna be yours pentru totdeauna, prințesa mea!”',
    themeColor: 'from-slate-700 to-rose-600',
    melodyType: 'romantic',
    audioUrl: '/audio/arctic_monkeys_i_wanna_be_yours.mp3',
  },
  {
    id: 'song-2',
    title: 'K.',
    artist: 'Cigarettes After Sex',
    duration: '5:19',
    dedication: '„Piesa aia nocturnă în care ne privim în ochi și timpul stă în loc. „Think I like you best when you are just with me and no one else”. Ești blondina mea perfectă!”',
    themeColor: 'from-gray-800 to-pink-500',
    melodyType: 'dream',
    audioUrl: '/audio/cigarettes_after_sex_k.mp3',
  },
  {
    id: 'song-3',
    title: 'Those Eyes',
    artist: 'New West',
    duration: '3:40',
    dedication: '„Ochii tăi superbi în care mă pierd... „All of the small things that you do are what remind me why I fell for you”. Te ador cu toată ființa mea!”',
    themeColor: 'from-pink-500 to-rose-600',
    melodyType: 'canon',
    audioUrl: '/audio/new_west_those_eyes.mp3',
  },
  {
    id: 'song-4',
    title: 'Vorbește vinul',
    artist: 'Bitză ft. Cheloo',
    duration: '3:33',
    dedication: '„Chiar și când ne certăm sau când greșesc, tot la tine vin și tot la tine țin. Cu tine vreau să-mi fac o viață întreagă!”',
    themeColor: 'from-red-600 to-rose-800',
    melodyType: 'romantic',
    audioUrl: '/audio/bitza_cheloo_vorbeste_vinul.mp3',
  },
  {
    id: 'song-5',
    title: 'Risk It All',
    artist: 'Bruno Mars',
    duration: '3:25',
    dedication: '„Aș învăța să zbor și aș urca orice munte din lume doar ca să-ți țin mâna și să te numesc a mea. Aș risca totul pentru tine!”',
    themeColor: 'from-amber-500 to-rose-500',
    melodyType: 'waltz',
    audioUrl: '/audio/bruno_mars_risk_it_all.mp3',
  },
  {
    id: 'song-6',
    title: 'Dacă n-ai fi tu',
    artist: 'Codu\' Penal ft. Monik (Shobby)',
    duration: '4:43',
    dedication: '„Dacă n-ai fi tu, mi-ar rămâne gol sufletul... N-aș putea și nu vreau să te înlocuiesc cu nimeni în viața asta, Mara mea!”',
    themeColor: 'from-fuchsia-600 to-pink-600',
    melodyType: 'dream',
    audioUrl: '/audio/codu_penal_daca_n_ai_fi_tu.mp3',
  },
  {
    id: 'song-7',
    title: 'Suflet pereche',
    artist: 'Sorin Copilul De Aur',
    duration: '4:06',
    dedication: '„Sufletul meu pereche pe viață! Să ne iubim ca-n prima zi, pentru că tu ești stăpâna sufletului meu și iubirea mea dintâi!”',
    themeColor: 'from-rose-500 to-pink-400',
    melodyType: 'waltz',
    audioUrl: '/audio/sorin_copilul_de_aur_suflet_pereche.mp3',
  },
  {
    id: 'song-8',
    title: 'Sper că ești bine',
    artist: 'Sami G',
    duration: '2:54',
    dedication: '„„N-ai nicio greșeală, cum poți să fii așa corectă? Îți iubesc defectele, adică ești perfectă!” Ești tot ce mi-am dorit vreodată!”',
    themeColor: 'from-violet-500 to-rose-500',
    melodyType: 'lullaby',
    audioUrl: '/audio/sami_g_sper_ca_esti_bine.mp3',
  },
];

export const FUTURE_MILESTONES: FutureMilestone[] = [
  {
    id: 'm-1',
    title: 'Să facem 1 an de relație',
    timelineLabel: '22 Decembrie 2026',
    targetDate: '2026-12-22T00:00:00',
    description: 'Primul nostru an complet impreuna! O aniversare uriasa pentru noi, cu surprize si iubire neconditionata din partea amandurora, intradevar.',
    icon: 'HeartHandshake',
    category: 'aniversare',
    isKeyMilestone: true,
  },
  {
    id: 'm-2',
    title: 'Să facem Revelionul împreună',
    timelineLabel: '31 Decembrie 2026',
    targetDate: '2026-12-31T23:59:59',
    description: 'Să numărăm secundele până la miezul nopții, să ne privim în ochi și primul sărut din noul an să fie al nostru sub artificii.',
    icon: 'Sparkles',
    category: 'aniversare',
    isKeyMilestone: true,
  },
  {
    id: 'm-3',
    title: 'Sa terminam liceul',
    timelineLabel: 'Pasul spre viitor',
    description: 'Să ne susținem reciproc la examene, să învățăm împreună și să fim cei mai mândri parteneri la absolvire.',
    icon: 'GraduationCap',
    category: 'scoli',
  },
  {
    id: 'm-4',
    title: 'Să ne mutăm împreună în căminul nostru',
    timelineLabel: 'Cuibul nostru de vis',
    description: 'Să ne decorăm apartamentul cu accesorii roz și Hello Kitty, să gătim micul dejun împreună și să adormim îmbrățișați în fiecare seară.',
    icon: 'Home',
    category: 'viata',
    isKeyMilestone: true,
  },
  {
    id: 'm-5',
    title: 'Să facem 5 ani de când suntem împreună',
    timelineLabel: '22 Decembrie 2030',
    targetDate: '2030-12-22T00:00:00',
    description: 'Jumătate de deceniu de iubire neclintită, amintiri adunate în zeci de albume și o dragoste mai puternică ca oricând.',
    icon: 'CalendarHeart',
    category: 'aniversare',
    isKeyMilestone: true,
  },
  {
    id: 'm-6',
    title: 'Să ne logodim — Inelul tău de vis',
    timelineLabel: 'Cererea în căsătorie 💍',
    description: 'O cerere magică, romantică și intimă, în care îți voi cere să fii a mea pentru tot restul vieții, cu cel mai strălucitor inel.',
    icon: 'Gem',
    category: 'viata',
    isKeyMilestone: true,
  },
  {
    id: 'm-7',
    title: 'Să terminăm facultatea',
    timelineLabel: 'Succes & Carieră 🎓',
    description: 'Să ne aruncăm tocile spre cer, știind că am trecut prin toți anii de studiu ținându-ne strâns de mână și încurajându-ne zi de zi.',
    icon: 'BookOpen',
    category: 'scoli',
  },
  {
    id: 'm-8',
    title: 'Să ne căsătorim — Nunta de basm',
    timelineLabel: 'Cea mai frumoasă zi din viață 👰‍♀️🤵‍♂️',
    description: 'Mara în cea mai spectaculoasă rochie de mireasă, jurămintele noastre sincere și dansul mirilor pe melodia noastră de suflet.',
    icon: 'Crown',
    category: 'familie',
    isKeyMilestone: true,
  },
  {
    id: 'm-9',
    title: 'Să facem copii — Mica noastră familie',
    timelineLabel: 'Îngerașii noștri dulci 👶🍼',
    description: 'Să aducem pe lume copii sănătoși și iubiți, care vor avea zâmbetul și bunătatea ta și dragostea infinită a noastră.',
    icon: 'Baby',
    category: 'familie',
    isKeyMilestone: true,
  },
  {
    id: 'm-10',
    title: 'Să trăim fericiți până la adânci bătrâneți',
    timelineLabel: 'Eternitate & Dragoste Adevărată 👵👴❤️',
    description: 'Privind cum copiii noștri o să-și găsească și ei, la vârsta noastră de acum, sufletele lor pereche, așa cum noi doi ne-am găsit unul pe celălalt pe 22 Decembrie 2025.',
    icon: 'Infinity',
    category: 'pentru-totdeauna',
    isKeyMilestone: true,
  },
];

export const INITIAL_BUCKET_LIST: BucketItem[] = [
  { id: 'b-1', text: 'Sa facem un picnic impreuna, asa cum stiu ca iti doresti', dateAdded: 'Septembrie 2026', isCompleted: true, heartCount: 22 },
  { id: 'b-2', text: 'Sa petrecem revelionul in Moftin cu prietenii nostri', dateAdded: 'Septembrie 2026', isCompleted: false, heartCount: 19 },
  { id: 'b-3', text: 'Să ne facem hanorace sau tricouri asortate de cuplu 👕👚', dateAdded: 'Septembrie 2026', isCompleted: false, heartCount: 15 },
  { id: 'b-4', text: 'Sa facem random o muzica cu AI impreuna :)))', dateAdded: 'Septembrie 2026', isCompleted: false, heartCount: 28 },
  { id: 'b-5', text: 'Sa facem un tort aniversar pentru un an impreuna si sa ne batem cu frisca', dateAdded: 'Septembrie 2026', isCompleted: false, heartCount: 14 },
  { id: 'b-6', text: 'Sa adoptam o pisicuta de pe strada si sa o facem a noastra', dateAdded: 'Septembrie 2026', isCompleted: false, heartCount: 30 },
  { id: 'b-7', text: 'Sa ne luam doi porumbei', dateAdded: 'Septembrie 2026', isCompleted: false, heartCount: 25 },
  { id: 'b-8', text: 'Sa murim de fericire la batranete impreuna <3', dateAdded: 'Septembrie 2026', isCompleted: false, heartCount: 99 },
];
