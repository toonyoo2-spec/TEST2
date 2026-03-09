import { useState, useMemo, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// 🍚 이번주뭐먹지 V5
// Min 3 dishes/day · Calendar · Save/Load · Smart Suggestions
// ═══════════════════════════════════════════════════════════════

const INGS=[
  {id:"radish",n:"무",e:"🥬",u:"1개(1kg)",p:3500,c:"채소",s:"냉장2주",t:"단단하고 무거운 것",pr:1},
  {id:"potato",n:"감자",e:"🥔",u:"3개(500g)",p:4500,c:"채소",s:"실온2주",t:"싹 없는 것",pr:2},
  {id:"sweetpotato",n:"고구마",e:"🍠",u:"3개(500g)",p:4500,c:"채소",s:"실온2주",t:"단단하고 흠 없는 것",pr:1},
  {id:"onion",n:"양파",e:"🧅",u:"3개",p:3000,c:"채소",s:"실온3주",t:"단단한 것",pr:1},
  {id:"zucchini",n:"애호박",e:"🥒",u:"1개",p:2500,c:"채소",s:"냉장5일",t:"꼭지 싱싱",pr:1},
  {id:"greenonion",n:"대파",e:"🌿",u:"2대",p:2500,c:"채소",s:"냉장1주",t:"뿌리 흰 게 달아요",pr:2},
  {id:"carrot",n:"당근",e:"🥕",u:"2개",p:3000,c:"채소",s:"냉장2주",t:"색 진한 것",pr:1},
  {id:"mushroom",n:"버섯(모듬)",e:"🍄",u:"1팩(300g)",p:3500,c:"채소",s:"냉장5일",t:"팽이+새송이+느타리",pr:3},
  {id:"bean_sprout",n:"콩나물",e:"🌱",u:"1봉(300g)",p:1800,c:"채소",s:"냉장3일",t:"빨리 쓰기",pr:4},
  {id:"spinach",n:"시금치",e:"🥬",u:"1단",p:4000,c:"채소",s:"냉장3일",t:"잎 두꺼운 것",pr:3},
  {id:"cabbage",n:"양배추",e:"🥗",u:"1/2통",p:3500,c:"채소",s:"냉장2주",t:"랩 보관",pr:1},
  {id:"garlic",n:"마늘",e:"🧄",u:"다진마늘1봉",p:4500,c:"채소",s:"냉장3주",t:"다진마늘 편해요",pr:6},
  {id:"pepper",n:"고추",e:"🌶️",u:"10개",p:3500,c:"채소",s:"냉장1주",t:"청양 포함",pr:2},
  {id:"sesame_leaf",n:"깻잎",e:"🌿",u:"1봉(30장)",p:2000,c:"채소",s:"냉장5일",t:"쌈+무침 활용",pr:2},
  {id:"pork_belly",n:"삼겹살",e:"🥩",u:"600g",p:16000,c:"육류",s:"냉동1달",t:"소분 냉동",pr:15},
  {id:"pork_neck",n:"목살",e:"🥩",u:"500g",p:13000,c:"육류",s:"냉동1달",t:"구이+볶음",pr:18},
  {id:"chicken_breast",n:"닭가슴살",e:"🍗",u:"500g",p:7500,c:"육류",s:"냉동1달",t:"다이어트 최고",pr:31},
  {id:"chicken_thigh",n:"닭다리살",e:"🍗",u:"500g",p:8500,c:"육류",s:"냉동1달",t:"볶음탕에 최고",pr:20},
  {id:"beef_soup",n:"소고기(국거리)",e:"🥩",u:"300g",p:14000,c:"육류",s:"냉동2주",t:"양지 or 사태",pr:26},
  {id:"ground_pork",n:"다짐육",e:"🥩",u:"300g",p:7000,c:"육류",s:"냉동1달",t:"만두+볶음밥",pr:17},
  {id:"egg",n:"달걀",e:"🥚",u:"10개입",p:4500,c:"기타",s:"냉장3주",t:"만능!",pr:13},
  {id:"tofu",n:"두부",e:"🧈",u:"1모(300g)",p:2500,c:"기타",s:"냉장5일",t:"물 갈아주면 오래",pr:8},
  {id:"kimchi",n:"김치",e:"🥬",u:"500g",p:7000,c:"기타",s:"냉장한달+",t:"익을수록 찌개에",pr:2},
  {id:"rice",n:"쌀",e:"🍚",u:"2kg",p:12000,c:"기타",s:"실온2달",t:"밀폐 보관",pr:7},
  {id:"spam",n:"스팸",e:"🥫",u:"1캔(340g)",p:6500,c:"기타",s:"실온2년",t:"비상식량",pr:13},
  {id:"tuna_can",n:"참치캔",e:"🐟",u:"2캔",p:5500,c:"기타",s:"실온3년",t:"주먹밥 필수",pr:26},
  {id:"anchovy",n:"멸치",e:"🐟",u:"100g",p:4500,c:"기타",s:"냉동6개월",t:"육수 핵심",pr:45},
  {id:"fishcake",n:"어묵",e:"🍢",u:"1팩(400g)",p:4000,c:"기타",s:"냉장1주",t:"국물+볶음 활용",pr:10},
  {id:"ricecake",n:"떡(떡볶이용)",e:"🍡",u:"500g",p:3500,c:"기타",s:"냉동3개월",t:"떡볶이+국+볶음",pr:3},
  {id:"noodle",n:"소면",e:"🍜",u:"1봉(500g)",p:2500,c:"기타",s:"실온1년",t:"국수+비빔면",pr:10},
  {id:"ramen",n:"라면",e:"🍜",u:"1봉(5개)",p:5000,c:"기타",s:"실온6개월",t:"재료넣으면 별미",pr:9},
];
const IG=id=>INGS.find(i=>i.id===id);

// === RECIPES: tag = "메인"|"국/찌개"|"밑반찬" ===

// ═══════════════════════════════════════════════════════════════
// 📦 Recipe Database (182개)
// 나중에 이 배열을 fetch('/api/recipes')로 교체하면 API 연동 완료
// const RCP = await fetch('/api/recipes').then(r => r.json());
// ═══════════════════════════════════════════════════════════════
const RCP=[
  {id:101,nm:"소고기 무국",e:"🍲",ig:["beef_soup","radish","greenonion","garlic"],tm:40,cal:180,pro:14,tag:"국/찌개",st:[{i:"🔪",t:"무 나박썰기(0.5cm)"},{i:"🥩",t:"소고기 참기름에 2분 볶기"},{i:"💧",t:"물 6컵 센불"},{i:"🥬",t:"무 넣고 중불 20분"},{i:"🧂",t:"국간장2+소금+파"}],tp:"💡 무를 먼저 볶으면 단맛 2배"},
  {id:102,nm:"김치찌개",e:"🍲",ig:["kimchi","pork_belly","tofu","greenonion","garlic"],tm:25,cal:250,pro:18,tag:"국/찌개",st:[{i:"🔪",t:"김치150g+삼겹100g 한입크기"},{i:"🔥",t:"참기름에 3분 볶기"},{i:"💧",t:"물3컵+고추장 반스푼"},{i:"🧈",t:"두부 넣고 5분"},{i:"🌿",t:"파 올리기"}],tp:"💡 김치를 충분히 볶는 게 핵심"},
  {id:103,nm:"된장찌개",e:"🍲",ig:["tofu","zucchini","potato","greenonion","garlic","mushroom"],tm:30,cal:160,pro:10,tag:"국/찌개",st:[{i:"🐟",t:"멸치육수 내기"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"감자·호박·버섯 넣고 15분"},{i:"🧈",t:"두부 5분"},{i:"🌿",t:"파+청양고추"}],tp:"💡 감자 풀어질 때까지"},
  {id:104,nm:"참치김치찌개",e:"🍲",ig:["tuna_can","kimchi","tofu","greenonion","garlic"],tm:20,cal:220,pro:20,tag:"국/찌개",st:[{i:"🐟",t:"참치캔 기름째+김치 볶기"},{i:"💧",t:"물 2.5컵"},{i:"🧈",t:"두부 5분"},{i:"🌿",t:"파"}],tp:"💡 참치 기름이 육수의 반!"},
  {id:105,nm:"콩나물국",e:"🍲",ig:["bean_sprout","garlic","greenonion"],tm:15,cal:60,pro:5,tag:"국/찌개",st:[{i:"💧",t:"물 4컵"},{i:"🌱",t:"콩나물+뚜껑 닫기"},{i:"⏱️",t:"10분 (뚜껑 열지 말기!)"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 절대 뚜껑 열지 말기!"},
  {id:106,nm:"계란국",e:"🍲",ig:["egg","greenonion","garlic"],tm:10,cal:80,pro:7,tag:"국/찌개",st:[{i:"💧",t:"물3컵+국간장+소금"},{i:"🔥",t:"팔팔 끓이기"},{i:"🥚",t:"달걀 천천히 풀기"},{i:"🌿",t:"파+참기름"}],tp:"💡 팔팔 끓을 때 넣기!"},
  {id:107,nm:"감자탕풍찌개",e:"🍲",ig:["potato","pork_neck","greenonion","garlic","kimchi","cabbage"],tm:40,cal:320,pro:22,tag:"국/찌개",st:[{i:"🥩",t:"목살200g 한입"},{i:"🥄",t:"고추장+고춧가루+간장+설탕"},{i:"🍲",t:"전부+물4컵"},{i:"⏱️",t:"중불 30분"},{i:"✨",t:"들깻가루2+파"}],tp:"💡 들깻가루가 핵심!"},
  {id:108,nm:"순두부찌개",e:"🍲",ig:["tofu","egg","kimchi","greenonion","garlic"],tm:20,cal:200,pro:15,tag:"국/찌개",st:[{i:"🔥",t:"참기름+김치 볶기"},{i:"💧",t:"물2컵+고춧가루"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀+뚜껑 2분"}],tp:"💡 뚝배기 미리 달구기"},
  {id:109,nm:"무맑은국",e:"🍲",ig:["radish","anchovy","greenonion","garlic"],tm:20,cal:40,pro:3,tag:"국/찌개",st:[{i:"🐟",t:"멸치+대파 육수"},{i:"🥬",t:"무 넣고 끓이기"},{i:"🧂",t:"국간장+소금"}],tp:"💡 깔끔한 국물"},
  {id:110,nm:"버섯된장국",e:"🍲",ig:["mushroom","tofu","greenonion","garlic"],tm:20,cal:100,pro:8,tag:"국/찌개",st:[{i:"🥄",t:"된장1 풀기"},{i:"🍄",t:"버섯+두부 10분"},{i:"🌿",t:"파"}],tp:"💡 표고쓰면 향 깊어요"},
  {id:111,nm:"시금치된장국",e:"🍲",ig:["spinach","tofu","garlic","greenonion"],tm:15,cal:70,pro:7,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🧈",t:"두부 끓이기"},{i:"🥬",t:"시금치 마지막에"}],tp:"💡 시금치 30초만!"},
  {id:112,nm:"소고기미역국",e:"🍲",ig:["beef_soup","greenonion","garlic"],tm:40,cal:150,pro:16,tag:"국/찌개",st:[{i:"💧",t:"미역 30분 불리기"},{i:"🥩",t:"소고기+참기름 3분"},{i:"🍲",t:"미역+물 30분"},{i:"🧂",t:"국간장"}],tp:"💡 소고기 충분히 볶기"},
  {id:113,nm:"김치콩나물국",e:"🍲",ig:["kimchi","bean_sprout","garlic","greenonion"],tm:20,cal:90,pro:6,tag:"국/찌개",st:[{i:"🥬",t:"김치 볶기"},{i:"🌱",t:"콩나물+물"},{i:"⏱️",t:"10분 뚜껑닫고"}],tp:"💡 해장에 최고"},
  {id:114,nm:"애호박찌개",e:"🍲",ig:["zucchini","tofu","greenonion","garlic","pepper"],tm:25,cal:130,pro:9,tag:"국/찌개",st:[{i:"🥄",t:"된장+고추장 풀기"},{i:"🥒",t:"호박+두부+고추"},{i:"🌿",t:"파"}],tp:"💡 고추장→밥도둑찌개"},
  {id:115,nm:"라면김치전골",e:"🍜",ig:["ramen","kimchi","spam","egg","greenonion"],tm:15,cal:500,pro:20,tag:"국/찌개",st:[{i:"🥫",t:"스팸+김치 깔기"},{i:"🍜",t:"라면+물"},{i:"🥚",t:"달걀"}],tp:"💡 부대찌개느낌!"},
  {id:116,nm:"스팸김치찌개",e:"🍲",ig:["spam","kimchi","tofu","greenonion","garlic"],tm:20,cal:300,pro:18,tag:"국/찌개",st:[{i:"🥫",t:"스팸+김치 볶기"},{i:"💧",t:"물+끓이기"},{i:"🧈",t:"두부 5분"}],tp:"💡 고기없을때 스팸 대타"},
  {id:117,nm:"양배추된장국",e:"🍲",ig:["cabbage","garlic","greenonion","tofu"],tm:20,cal:80,pro:6,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥗",t:"양배추+두부"}],tp:"💡 양배추 단맛"},
  {id:118,nm:"무들깨수프",e:"🍲",ig:["radish","mushroom","garlic","greenonion"],tm:25,cal:110,pro:4,tag:"국/찌개",ai:1,st:[{i:"🔪",t:"무+버섯 채썰기"},{i:"💧",t:"육수 15분"},{i:"✨",t:"들깻가루3"}],tp:"🤖 들깻가루=천연크림소스"},
  {id:119,nm:"당근계란국",e:"🍲",ig:["carrot","egg","greenonion","garlic"],tm:12,cal:90,pro:8,tag:"국/찌개",st:[{i:"🥕",t:"당근채 끓이기"},{i:"🥚",t:"달걀 풀기"},{i:"🌿",t:"파+참기름"}],tp:"💡 당근 단맛"},
  {id:120,nm:"감자수프",e:"🍲",ig:["potato","onion","garlic"],tm:25,cal:180,pro:4,tag:"국/찌개",st:[{i:"🥔",t:"감자+양파 볶기"},{i:"💧",t:"끓여 으깨기"},{i:"🥛",t:"우유반컵+소금"}],tp:"💡 크리미한 양식수프"},
  {id:121,nm:"육개장풍 찌개",e:"🍲",ig:["beef_soup","bean_sprout","greenonion","garlic","egg"],tm:40,cal:280,pro:22,tag:"국/찌개",st:[{i:"🥩",t:"소고기 삶아 찢기"},{i:"🌱",t:"콩나물+대파 넣기"},{i:"🥄",t:"고춧가루2+간장1+참기름"},{i:"🥚",t:"달걀 풀어 넣기"}],tp:"💡 고기를 미리 삶아 육수로 쓰면 깊은 맛"},
  {id:122,nm:"돼지고기 김치국",e:"🍲",ig:["pork_neck","kimchi","greenonion","garlic","tofu"],tm:25,cal:230,pro:20,tag:"국/찌개",st:[{i:"🥩",t:"목살 볶기"},{i:"🥬",t:"김치+물 끓이기"},{i:"🧈",t:"두부 넣기"}],tp:"💡 찌개보다 국물 많게 → 시원한 국"},
  {id:123,nm:"버섯들깨탕",e:"🍲",ig:["mushroom","spinach","garlic","greenonion"],tm:20,cal:90,pro:5,tag:"국/찌개",st:[{i:"🍄",t:"버섯 찢기"},{i:"💧",t:"육수에 끓이기"},{i:"✨",t:"들깻가루2+시금치"}],tp:"💡 들깻가루가 국물을 고소하게"},
  {id:124,nm:"감자된장국",e:"🍲",ig:["potato","garlic","greenonion","tofu"],tm:25,cal:140,pro:7,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥔",t:"감자+두부 끓이기"},{i:"🌿",t:"파"}],tp:"💡 감자가 포슬포슬 풀어지면 완성"},
  {id:125,nm:"참치 된장찌개",e:"🍲",ig:["tuna_can","zucchini","tofu","greenonion","garlic"],tm:20,cal:190,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"된장+참치캔 풀기"},{i:"🥒",t:"호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 참치캔이 된장찌개에도 어울려요"},
  {id:126,nm:"달걀 순두부국",e:"🍲",ig:["tofu","egg","greenonion","garlic"],tm:15,cal:120,pro:12,tag:"국/찌개",st:[{i:"💧",t:"물 끓이기"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀+파+간장"}],tp:"💡 매운게 싫을 때 담백한 순두부"},
  {id:127,nm:"콩나물 김치국",e:"🍲",ig:["bean_sprout","kimchi","garlic","greenonion","pork_belly"],tm:20,cal:170,pro:12,tag:"국/찌개",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🌱",t:"콩나물+김치+물"},{i:"⏱️",t:"15분 끓이기"}],tp:"💡 삼겹 기름이 국물에 감칠맛"},
  {id:128,nm:"양배추 스프",e:"🍲",ig:["cabbage","onion","carrot","garlic"],tm:25,cal:100,pro:3,tag:"국/찌개",st:[{i:"🔪",t:"양배추+양파+당근 채썰기"},{i:"💧",t:"물+소금+후추 끓이기"},{i:"⏱️",t:"15분 푹 끓이기"}],tp:"💡 다이어트 수프! 양배추가 달달"},
  {id:129,nm:"시래기된장국",e:"🍲",ig:["radish","garlic","greenonion","pork_neck"],tm:35,cal:160,pro:14,tag:"국/찌개",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"된장+무채 끓이기"},{i:"⏱️",t:"중불 20분"}],tp:"💡 무채가 시래기 대용! 구수한 맛"},
  {id:130,nm:"두부맑은국",e:"🍲",ig:["tofu","egg","greenonion","garlic","anchovy"],tm:15,cal:100,pro:10,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🧈",t:"두부 넣기"},{i:"🥚",t:"달걀+파"}],tp:"💡 심플하지만 깊은 국물"},
  {id:131,nm:"삼겹살 된장찌개",e:"🍲",ig:["pork_belly","tofu","zucchini","greenonion","garlic","mushroom"],tm:30,cal:280,pro:18,tag:"국/찌개",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"된장 풀기"},{i:"🔪",t:"호박+버섯+두부"},{i:"🌿",t:"파"}],tp:"💡 삼겹 기름으로 된장찌개가 한층 고소"},
  {id:132,nm:"감자 계란국",e:"🍲",ig:["potato","egg","greenonion","garlic"],tm:20,cal:150,pro:9,tag:"국/찌개",st:[{i:"🥔",t:"감자 깍둑 끓이기"},{i:"🥚",t:"달걀 풀어 넣기"},{i:"🌿",t:"파+참기름"}],tp:"💡 감자가 반쯤 풀어지면 걸쭉"},
  {id:133,nm:"닭가슴살 된장국",e:"🍲",ig:["chicken_breast","garlic","greenonion","mushroom","tofu"],tm:25,cal:160,pro:24,tag:"국/찌개",st:[{i:"🍗",t:"닭가슴살 삶기"},{i:"🥄",t:"된장+버섯+두부"},{i:"🌿",t:"파"}],tp:"💡 닭 삶은 물이 육수 역할! 고단백 국"},
  {id:134,nm:"무 된장국",e:"🍲",ig:["radish","garlic","greenonion","tofu"],tm:25,cal:90,pro:6,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥬",t:"무+두부 끓이기"},{i:"🌿",t:"파"}],tp:"💡 무의 단맛+된장의 구수함"},
  {id:135,nm:"다짐육 된장찌개",e:"🍲",ig:["ground_pork","tofu","zucchini","garlic","greenonion"],tm:25,cal:220,pro:16,tag:"국/찌개",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"된장 풀기"},{i:"🔪",t:"호박+두부"}],tp:"💡 다짐육이 든든함을 더해줘요"},
  {id:136,nm:"스팸 부대찌개",e:"🍲",ig:["spam","ramen","kimchi","onion","greenonion","garlic"],tm:20,cal:550,pro:22,tag:"국/찌개",st:[{i:"🥫",t:"스팸+김치+양파 깔기"},{i:"🍜",t:"라면+물+고추장"},{i:"🔥",t:"끓이기"}],tp:"💡 고춧가루+설탕 반스푼이 비밀"},
  {id:137,nm:"버섯맑은국",e:"🍲",ig:["mushroom","greenonion","garlic","egg"],tm:15,cal:70,pro:6,tag:"국/찌개",st:[{i:"🍄",t:"버섯+물 끓이기"},{i:"🥚",t:"달걀 풀기"},{i:"🧂",t:"국간장+파"}],tp:"💡 버섯 육수가 자연 감칠맛"},
  {id:138,nm:"양파 계란국",e:"🍲",ig:["onion","egg","greenonion","garlic"],tm:10,cal:90,pro:7,tag:"국/찌개",st:[{i:"🧅",t:"양파 채썰어 끓이기"},{i:"🥚",t:"달걀 풀기"},{i:"🌿",t:"파"}],tp:"💡 양파가 국물을 달달하게"},
  {id:139,nm:"닭다리 감자탕",e:"🍲",ig:["chicken_thigh","potato","cabbage","greenonion","garlic","kimchi"],tm:45,cal:340,pro:26,tag:"국/찌개",st:[{i:"🍗",t:"닭다리 핏물 빼기"},{i:"🥔",t:"감자+양배추+김치"},{i:"🥄",t:"고추장 양념"},{i:"⏱️",t:"30분 끓이기"}],tp:"💡 돼지 대신 닭으로! 담백한 감자탕"},
  {id:140,nm:"호박 된장찌개",e:"🍲",ig:["zucchini","onion","tofu","garlic","greenonion"],tm:25,cal:120,pro:8,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥒",t:"호박+양파+두부"},{i:"🌿",t:"파"}],tp:"💡 심플 된장찌개의 정석"},
  {id:141,nm:"당근 된장국",e:"🍲",ig:["carrot","garlic","greenonion","tofu"],tm:20,cal:80,pro:5,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥕",t:"당근+두부 끓이기"},{i:"🌿",t:"파"}],tp:"💡 당근의 단맛이 의외로 잘 어울려"},
  {id:142,nm:"고추장찌개",e:"🍲",ig:["pork_belly","zucchini","onion","garlic","greenonion","pepper"],tm:25,cal:280,pro:16,tag:"국/찌개",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🥄",t:"고추장+고추 넣기"},{i:"🥒",t:"호박+양파 끓이기"}],tp:"💡 된장 대신 고추장! 매콤한 국물"},
  {id:143,nm:"두부 김치국",e:"🍲",ig:["tofu","kimchi","greenonion","garlic"],tm:15,cal:100,pro:8,tag:"국/찌개",st:[{i:"🥬",t:"김치+물 끓이기"},{i:"🧈",t:"두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 고기 없이도 깊은 맛"},
  {id:144,nm:"참치 콩나물국",e:"🍲",ig:["tuna_can","bean_sprout","garlic","greenonion"],tm:15,cal:100,pro:14,tag:"국/찌개",st:[{i:"🐟",t:"참치+콩나물+물"},{i:"⏱️",t:"뚜껑닫고 10분"},{i:"🧂",t:"소금+파"}],tp:"💡 참치향이 콩나물과 환상조합"},
  {id:145,nm:"스팸 감자국",e:"🍲",ig:["spam","potato","greenonion","garlic"],tm:20,cal:250,pro:12,tag:"국/찌개",st:[{i:"🥫",t:"스팸 깍둑+감자"},{i:"💧",t:"물+소금 끓이기"},{i:"🌿",t:"파"}],tp:"💡 군대식 감자국! 의외로 맛있어요"},
  {id:146,nm:"시금치 계란국",e:"🍲",ig:["spinach","egg","garlic","greenonion"],tm:12,cal:70,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물+국간장 끓이기"},{i:"🥬",t:"시금치+달걀"},{i:"🌿",t:"파"}],tp:"💡 영양 만점 간단 국"},
  {id:147,nm:"다짐육 김치찌개",e:"🍲",ig:["ground_pork","kimchi","tofu","greenonion","garlic"],tm:20,cal:240,pro:18,tag:"국/찌개",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥬",t:"김치+물"},{i:"🧈",t:"두부 넣기"}],tp:"💡 삼겹 대신 다짐육! 더 담백"},
  {id:148,nm:"목살 김치찌개",e:"🍲",ig:["pork_neck","kimchi","tofu","greenonion","garlic"],tm:25,cal:260,pro:22,tag:"국/찌개",st:[{i:"🥩",t:"목살 볶기"},{i:"🥬",t:"김치+물 끓이기"},{i:"🧈",t:"두부 5분"}],tp:"💡 목살이 삼겹보다 담백"},
  {id:149,nm:"소고기 버섯국",e:"🍲",ig:["beef_soup","mushroom","greenonion","garlic"],tm:30,cal:140,pro:16,tag:"국/찌개",st:[{i:"🥩",t:"소고기 볶기"},{i:"🍄",t:"버섯+물 끓이기"},{i:"🧂",t:"국간장+파"}],tp:"💡 소고기+버섯 감칠맛 폭발"},
  {id:201,nm:"삼겹살김치볶음밥",e:"🍳",ig:["pork_belly","kimchi","egg","rice","greenonion","garlic"],tm:15,cal:500,pro:20,tag:"메인",st:[{i:"🥩",t:"삼겹 작게 볶기"},{i:"🥬",t:"김치+밥 볶기"},{i:"🧂",t:"간장+참기름"},{i:"🍳",t:"계란후라이"}],tp:"💡 삼겹 기름으로 볶으면 윤기"},
  {id:202,nm:"스팸김치볶음밥",e:"🍳",ig:["spam","kimchi","egg","rice","greenonion"],tm:15,cal:480,pro:18,tag:"메인",st:[{i:"🔪",t:"스팸+김치 다지기"},{i:"🔥",t:"스팸 노릇 2분"},{i:"🍚",t:"김치→밥 볶기"},{i:"🍳",t:"계란후라이"}],tp:"💡 김치 충분히 볶아서 수분날리기"},
  {id:203,nm:"참치볶음밥",e:"🍳",ig:["tuna_can","egg","rice","greenonion","garlic","onion"],tm:15,cal:420,pro:24,tag:"메인",st:[{i:"🐟",t:"참치+양파 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 참치기름이 윤기"},
  {id:204,nm:"참치김치볶음밥",e:"🍳",ig:["tuna_can","kimchi","rice","egg","greenonion","garlic"],tm:15,cal:430,pro:22,tag:"메인",st:[{i:"🐟",t:"참치+김치 볶기"},{i:"🍚",t:"밥 센불 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 참치+김치는 볶음밥의 정석"},
  {id:205,nm:"달걀볶음밥",e:"🍳",ig:["egg","rice","greenonion","garlic","onion"],tm:10,cal:350,pro:14,tag:"메인",st:[{i:"🥚",t:"달걀 스크램블"},{i:"🍚",t:"밥+간장 볶기"},{i:"🌿",t:"파+참기름"}],tp:"💡 달걀을 먼저 익혀두고 밥 볶은 뒤 합치기"},
  {id:206,nm:"다짐육볶음밥",e:"🍳",ig:["ground_pork","egg","rice","onion","garlic","greenonion"],tm:15,cal:450,pro:20,tag:"메인",st:[{i:"🥩",t:"다짐육+양파 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 다짐육을 잘게 볶아야 밥에 잘 섞여요"},
  {id:207,nm:"목살볶음밥",e:"🍳",ig:["pork_neck","egg","rice","onion","garlic","greenonion","cabbage"],tm:15,cal:460,pro:22,tag:"메인",st:[{i:"🥩",t:"목살 잘게 볶기"},{i:"🥗",t:"양배추+양파 볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추가 단맛을 더해줘요"},
  {id:210,nm:"스팸마요덮밥",e:"🍚",ig:["spam","egg","rice","greenonion","onion"],tm:15,cal:520,pro:16,tag:"메인",st:[{i:"🥫",t:"스팸1cm 굽기"},{i:"🍳",t:"달걀후라이"},{i:"🍚",t:"밥+올리기"},{i:"🥄",t:"마요+간장소스"}],tp:"💡 후추 뿌리고 구우면 고급"},
  {id:211,nm:"닭가슴살덮밥",e:"🍗",ig:["chicken_breast","onion","egg","rice","greenonion","garlic"],tm:25,cal:380,pro:35,tag:"메인",st:[{i:"🍗",t:"닭 한입크기"},{i:"🥄",t:"간장+미림+설탕 끓이기"},{i:"🧅",t:"양파+닭 조리기"},{i:"🥚",t:"달걀 뚜껑10초→반숙!"}],tp:"💡 오야코동!"},
  {id:212,nm:"삼겹덮밥",e:"🍚",ig:["pork_belly","onion","rice","greenonion","garlic","cabbage"],tm:20,cal:500,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹 구워 썰기"},{i:"🥗",t:"양배추 채"},{i:"🍚",t:"밥+양배추+삼겹"},{i:"🥄",t:"마요+간장"}],tp:"💡 양배추가 느끼함 잡아줘요"},
  {id:213,nm:"콩나물불고기덮밥",e:"🍚",ig:["bean_sprout","pork_neck","onion","garlic","greenonion","rice"],tm:20,cal:420,pro:24,tag:"메인",ai:1,st:[{i:"🌱",t:"콩나물 깔기"},{i:"🥩",t:"목살 양념 볶기"},{i:"🍚",t:"밥+불고기"},{i:"🍳",t:"달걀+고추장"}],tp:"🤖 뚝배기→누룽지"},
  {id:214,nm:"다짐육카레",e:"🍛",ig:["ground_pork","potato","carrot","onion","rice","garlic"],tm:35,cal:450,pro:18,tag:"메인",st:[{i:"🔪",t:"채소 깍둑"},{i:"🥩",t:"다짐육+채소 볶기"},{i:"💧",t:"물3컵 15분"},{i:"🍛",t:"불끄고 카레루→약불5분"}],tp:"💡 카레루는 불 끄고!"},
  {id:215,nm:"참치마요덮밥",e:"🍚",ig:["tuna_can","egg","rice","onion","greenonion"],tm:15,cal:400,pro:24,tag:"메인",st:[{i:"🐟",t:"참치+마요+양파 섞기"},{i:"🍚",t:"밥 위에 올리기"},{i:"🍳",t:"달걀후라이+간장"}],tp:"💡 양파를 다져넣으면 식감 UP"},
  {id:216,nm:"제육덮밥",e:"🍚",ig:["pork_neck","onion","rice","garlic","greenonion","cabbage","pepper"],tm:25,cal:480,pro:26,tag:"메인",st:[{i:"🥩",t:"목살+고추장양념 볶기"},{i:"🥗",t:"양배추 채"},{i:"🍚",t:"밥+양배추+제육"}],tp:"💡 쌈채소 깔면 더 맛있어요"},
  {id:217,nm:"두부스크램블덮밥",e:"🍚",ig:["tofu","egg","onion","garlic","greenonion","carrot","rice"],tm:15,cal:360,pro:22,tag:"메인",ai:1,st:[{i:"🧈",t:"두부 으깨기"},{i:"🥚",t:"달걀+채소 섞기"},{i:"🔥",t:"스크램블"},{i:"🍚",t:"밥 위에"}],tp:"🤖 고단백 브런치 덮밥"},
  {id:218,nm:"계란토스트밥",e:"🍳",ig:["egg","cabbage","carrot","rice","garlic"],tm:15,cal:350,pro:14,tag:"메인",st:[{i:"🥚",t:"달걀2+다진채소"},{i:"🍚",t:"팬에 밥 얇게"},{i:"🍳",t:"달걀물 붓고 접기"}],tp:"💡 바삭→토스트식감"},
  {id:219,nm:"콩나물비빔밥",e:"🍚",ig:["bean_sprout","egg","rice","greenonion","garlic","kimchi"],tm:15,cal:360,pro:16,tag:"메인",st:[{i:"🌱",t:"콩나물 삶기"},{i:"🍚",t:"밥+콩나물+김치"},{i:"🍳",t:"달걀+고추장+참기름"}],tp:"💡 뚝배기→누룽지"},
  {id:220,nm:"다짐육비빔밥",e:"🍚",ig:["ground_pork","carrot","spinach","bean_sprout","rice","egg","garlic","greenonion"],tm:30,cal:450,pro:25,tag:"메인",st:[{i:"🥬",t:"나물 데쳐 무치기"},{i:"🥩",t:"다짐육 양념 볶기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 나물 미리→3일 활용"},
  {id:221,nm:"감자달걀그라탕",e:"🧀",ig:["potato","egg","onion","garlic","mushroom"],tm:30,cal:350,pro:14,tag:"메인",ai:1,st:[{i:"🥔",t:"감자 슬라이스"},{i:"🍳",t:"팬에 겹겹이"},{i:"🥚",t:"달걀+우유"},{i:"⏱️",t:"뚜껑 약불15분"}],tp:"🤖 오븐없이!"},
  {id:225,nm:"잔치국수",e:"🍜",ig:["noodle","zucchini","egg","greenonion","anchovy","garlic"],tm:25,cal:350,pro:14,tag:"메인",st:[{i:"🐟",t:"멸치육수10분"},{i:"🍜",t:"소면 삶기"},{i:"🥒",t:"호박+달걀지단"},{i:"🍜",t:"면+육수+고명"}],tp:"💡 면 찬물에 헹구기"},
  {id:226,nm:"비빔국수",e:"🍜",ig:["noodle","egg","carrot","onion","greenonion","garlic","cabbage"],tm:20,cal:380,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶아 헹구기"},{i:"🥄",t:"고추장+식초+설탕+참기름"},{i:"🔪",t:"채소 채썰기"},{i:"🥚",t:"비비고 달걀"}],tp:"💡 사이다2스푼→상큼"},
  {id:227,nm:"라면볶이",e:"🍜",ig:["ramen","cabbage","carrot","onion","greenonion","garlic"],tm:15,cal:400,pro:10,tag:"메인",st:[{i:"🍜",t:"라면 2분만(덜!)"},{i:"🔪",t:"채소 볶기"},{i:"🔥",t:"면+수프반+고추장"}],tp:"💡 덜삶아야 쫄깃"},
  {id:228,nm:"원팬삼겹파스타",e:"🍝",ig:["pork_belly","onion","garlic","mushroom","cabbage"],tm:25,cal:520,pro:16,tag:"메인",ai:1,st:[{i:"🥩",t:"삼겹 바삭"},{i:"🍄",t:"채소 볶기"},{i:"🍜",t:"소면 넣기"},{i:"🥛",t:"우유반컵+후추"}],tp:"🤖 소면+삼겹기름+우유=크림파스타!"},
  {id:229,nm:"김치볶음 우동",e:"🍜",ig:["noodle","kimchi","pork_belly","greenonion","garlic","egg"],tm:15,cal:420,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹+김치 볶기"},{i:"🍜",t:"삶은 소면 넣기"},{i:"🥄",t:"간장+고추장"},{i:"🥚",t:"달걀후라이"}],tp:"💡 소면이 우동면처럼! 굵은면 없을 때"},
  {id:230,nm:"참치 비빔국수",e:"🍜",ig:["noodle","tuna_can","onion","greenonion","garlic","egg"],tm:15,cal:390,pro:22,tag:"메인",st:[{i:"🍜",t:"소면 삶아 헹구기"},{i:"🐟",t:"참치+고추장+식초 양념"},{i:"🥚",t:"삶은달걀 올리기"}],tp:"💡 참치+고추장은 비빔국수의 왕도"},
  {id:231,nm:"스팸 볶음면",e:"🍜",ig:["ramen","spam","cabbage","onion","greenonion","garlic"],tm:15,cal:480,pro:16,tag:"메인",st:[{i:"🥫",t:"스팸 깍둑 볶기"},{i:"🍜",t:"라면 2분 삶기"},{i:"🔥",t:"채소+면+수프 볶기"}],tp:"💡 라면수프 반만! 짜지않게"},
  {id:232,nm:"간장비빔면",e:"🍜",ig:["noodle","egg","greenonion","garlic","onion"],tm:15,cal:350,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥄",t:"간장2+참기름1+설탕반+깨"},{i:"🥚",t:"달걀후라이 올리기"}],tp:"💡 매운게 싫을 때! 간장비빔면"},
  {id:233,nm:"콩나물국수",e:"🍜",ig:["noodle","bean_sprout","kimchi","greenonion","garlic","anchovy"],tm:20,cal:340,pro:12,tag:"메인",st:[{i:"🐟",t:"멸치+콩나물 육수"},{i:"🍜",t:"소면 삶기"},{i:"🥬",t:"김치+파 올리기"}],tp:"💡 콩나물 육수가 시원!"},
  {id:240,nm:"삼겹살김치볶음",e:"🥘",ig:["pork_belly","kimchi","onion","greenonion","garlic"],tm:20,cal:380,pro:18,tag:"메인",st:[{i:"🔪",t:"삼겹150g 한입"},{i:"🔥",t:"기름없이 삼겹 3분"},{i:"🥬",t:"김치+양파 3분"},{i:"🥄",t:"고추장반+설탕반"},{i:"🌿",t:"파"}],tp:"💡 삼겹기름으로 김치볶기"},
  {id:241,nm:"두부김치",e:"🥘",ig:["tofu","kimchi","pork_belly","greenonion"],tm:20,cal:280,pro:20,tag:"메인",st:[{i:"🧈",t:"두부 노릇 굽기"},{i:"🥩",t:"삼겹+김치 볶기"},{i:"🍽️",t:"접시에 함께"}],tp:"💡 두부 전자레인지 2분→속 따뜻"},
  {id:242,nm:"목살간장불고기",e:"🥩",ig:["pork_neck","onion","greenonion","garlic","carrot"],tm:30,cal:340,pro:24,tag:"메인",st:[{i:"🥩",t:"목살 얇게"},{i:"🥄",t:"간장+설탕+참기름+마늘"},{i:"⏱️",t:"30분 숙성"},{i:"🔥",t:"센불+채소 볶기"}],tp:"💡 키위1/4갈면 부드러워요"},
  {id:243,nm:"목살제육볶음",e:"🥩",ig:["pork_neck","onion","greenonion","garlic","cabbage","pepper"],tm:25,cal:400,pro:26,tag:"메인",st:[{i:"🥩",t:"목살 얇게"},{i:"🥄",t:"고추장+고춧가루+간장+설탕"},{i:"🔥",t:"고기+채소 볶기"}],tp:"💡 양배추와 함께 볶으면 달콤"},
  {id:244,nm:"닭볶음탕",e:"🍗",ig:["chicken_thigh","potato","carrot","onion","greenonion","garlic"],tm:45,cal:350,pro:28,tag:"메인",st:[{i:"🍗",t:"닭 핏물빼기"},{i:"🔪",t:"감자·당근·양파 큼직"},{i:"🥄",t:"고추장+간장+설탕+고춧가루"},{i:"🍲",t:"중불 30분"},{i:"🌿",t:"파"}],tp:"💡 감자 크게!"},
  {id:245,nm:"참치마요주먹밥",e:"🍙",ig:["tuna_can","rice","egg","greenonion"],tm:15,cal:380,pro:22,tag:"메인",st:[{i:"🐟",t:"참치+마요2 섞기"},{i:"🍚",t:"밥+참기름+깨"},{i:"🍙",t:"랩으로 동그랗게"}],tp:"💡 단무지 다져넣으면 식감UP"},
  {id:246,nm:"닭가슴살샐러드",e:"🥗",ig:["chicken_breast","onion","carrot","cabbage"],tm:20,cal:200,pro:30,tag:"메인",st:[{i:"🍗",t:"닭 삶아 찢기"},{i:"🔪",t:"채소 채썰기"},{i:"🥄",t:"올리브유+식초+소금"}],tp:"💡 꿀한스푼→고급"},
  {id:247,nm:"무스테이크",e:"🥬",ig:["radish","garlic","greenonion","mushroom"],tm:25,cal:120,pro:3,tag:"메인",ai:1,st:[{i:"🔪",t:"무 2cm+칼집"},{i:"🔥",t:"간장+버터 양면"},{i:"🍄",t:"버섯소스"}],tp:"🤖 전자레인지3분→겉바속촉"},
  {id:250,nm:"스팸달걀덮밥",e:"🍚",ig:["spam","egg","rice","greenonion"],tm:10,cal:480,pro:18,tag:"메인",st:[{i:"🥫",t:"스팸 굽기"},{i:"🥚",t:"달걀후라이"},{i:"🍚",t:"밥+올리기"}],tp:"💡 최소재료 최대만족"},
  {id:251,nm:"감자 카레볶음밥",e:"🍳",ig:["potato","egg","rice","onion","garlic","carrot"],tm:20,cal:400,pro:12,tag:"메인",st:[{i:"🥔",t:"감자 작게 볶기"},{i:"🍚",t:"밥+카레가루 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 카레루 대신 카레가루로 간편하게"},
  {id:252,nm:"양배추 삼겹 볶음",e:"🥗",ig:["cabbage","pork_belly","onion","garlic","greenonion"],tm:15,cal:350,pro:14,tag:"메인",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🥗",t:"양배추+양파 넣기"},{i:"🧂",t:"소금+후추+간장"}],tp:"💡 양배추가 삼겹 기름을 잡아줘요"},
  {id:253,nm:"버섯 덮밥",e:"🍚",ig:["mushroom","onion","egg","rice","garlic","greenonion"],tm:20,cal:320,pro:12,tag:"메인",st:[{i:"🍄",t:"버섯+양파 볶기"},{i:"🥄",t:"간장+미림+설탕"},{i:"🥚",t:"달걀 반숙으로"},{i:"🍚",t:"밥 위에"}],tp:"💡 버섯을 가득 넣으면 고기 안부러워요"},
  {id:254,nm:"김치 달걀볶음",e:"🥘",ig:["kimchi","egg","greenonion","garlic","rice"],tm:10,cal:320,pro:14,tag:"메인",st:[{i:"🥬",t:"김치 볶기"},{i:"🥚",t:"달걀 스크램블"},{i:"🍚",t:"밥과 함께"}],tp:"💡 2분이면 완성! 혼밥의 정석"},
  {id:255,nm:"삼겹 고추장볶음",e:"🥩",ig:["pork_belly","onion","garlic","greenonion","pepper","cabbage"],tm:20,cal:420,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🥄",t:"고추장+고추 양념"},{i:"🥗",t:"양배추+양파 볶기"}],tp:"💡 고추장이 매콤달콤하게"},
  {id:256,nm:"닭가슴살 볶음밥",e:"🍳",ig:["chicken_breast","egg","rice","onion","garlic","greenonion","carrot"],tm:20,cal:380,pro:30,tag:"메인",st:[{i:"🍗",t:"닭가슴살 다지기"},{i:"🔥",t:"채소+닭 볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 고단백 볶음밥!"},
  {id:257,nm:"소고기 덮밥",e:"🍚",ig:["beef_soup","onion","egg","rice","garlic","greenonion"],tm:25,cal:420,pro:26,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🧅",t:"양파+간장 양념"},{i:"🥚",t:"달걀 반숙"},{i:"🍚",t:"밥 위에"}],tp:"💡 규동 스타일! 양파를 듬뿍"},
  {id:258,nm:"닭다리 간장조림",e:"🍗",ig:["chicken_thigh","potato","garlic","greenonion","onion"],tm:40,cal:380,pro:24,tag:"메인",st:[{i:"🍗",t:"닭다리 핏물 빼기"},{i:"🥔",t:"감자+양파 큼직"},{i:"🥄",t:"간장3+설탕1+마늘"},{i:"⏱️",t:"중불 25분 조리기"}],tp:"💡 조림장이 자작해질 때까지"},
  {id:259,nm:"두부 스테이크",e:"🧈",ig:["tofu","mushroom","onion","garlic","greenonion"],tm:20,cal:200,pro:14,tag:"메인",st:[{i:"🧈",t:"두부 두껍게 굽기"},{i:"🍄",t:"버섯+양파 소스"},{i:"🥄",t:"간장+버터 소스"}],tp:"💡 두부를 충분히 눌러구워야 바삭"},
  {id:260,nm:"달걀 오므라이스",e:"🍳",ig:["egg","rice","onion","carrot","garlic","greenonion"],tm:20,cal:380,pro:16,tag:"메인",st:[{i:"🔪",t:"양파+당근 다지기"},{i:"🍚",t:"볶음밥 만들기"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 달걀을 덜 익혀서 반숙으로!"},
  {id:261,nm:"김치 라면",e:"🍜",ig:["ramen","kimchi","egg","greenonion"],tm:10,cal:450,pro:14,tag:"메인",st:[{i:"🍜",t:"라면 끓이기"},{i:"🥬",t:"김치 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 김치를 먼저 볶고 물 넣으면 더 맛있어요"},
  {id:262,nm:"삼겹살 볶음면",e:"🍜",ig:["ramen","pork_belly","cabbage","onion","greenonion","garlic"],tm:15,cal:520,pro:18,tag:"메인",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🍜",t:"라면 2분 삶기"},{i:"🔥",t:"채소+면+수프반 볶기"}],tp:"💡 삼겹기름으로 볶으면 윤기"},
  {id:263,nm:"두부김치덮밥",e:"🍚",ig:["tofu","kimchi","pork_belly","rice","greenonion"],tm:20,cal:420,pro:22,tag:"메인",st:[{i:"🧈",t:"두부 굽기"},{i:"🥩",t:"삼겹+김치 볶기"},{i:"🍚",t:"밥+두부+김치볶음"}],tp:"💡 두부김치를 밥 위에!"},
  {id:264,nm:"닭가슴살 비빔밥",e:"🍚",ig:["chicken_breast","carrot","spinach","rice","egg","garlic","greenonion"],tm:25,cal:380,pro:32,tag:"메인",st:[{i:"🍗",t:"닭 삶아 찢기"},{i:"🥬",t:"시금치+당근 무치기"},{i:"🍚",t:"밥+나물+닭"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 고단백 비빔밥"},
  {id:265,nm:"소고기 볶음밥",e:"🍳",ig:["beef_soup","egg","rice","onion","garlic","greenonion"],tm:20,cal:450,pro:24,tag:"메인",st:[{i:"🥩",t:"소고기 잘게 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 소고기 육즙으로 볶으면 감칠맛"},
  {id:266,nm:"스팸 볶음밥",e:"🍳",ig:["spam","egg","rice","greenonion","garlic"],tm:10,cal:480,pro:16,tag:"메인",st:[{i:"🥫",t:"스팸 다져 볶기"},{i:"🍚",t:"밥 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 간단하지만 절대 실패 없는"},
  {id:267,nm:"감자 볶음면",e:"🍜",ig:["ramen","potato","onion","garlic","greenonion","egg"],tm:20,cal:430,pro:12,tag:"메인",st:[{i:"🥔",t:"감자 채썰기"},{i:"🍜",t:"라면 2분 삶기"},{i:"🔥",t:"감자+면+수프 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 감자가 면과 잘 어울려요"},
  {id:268,nm:"참치 오므라이스",e:"🍳",ig:["tuna_can","egg","rice","onion","garlic","greenonion"],tm:20,cal:400,pro:24,tag:"메인",st:[{i:"🐟",t:"참치+양파 볶음밥"},{i:"🥚",t:"달걀 부치기"},{i:"🍳",t:"감싸기"}],tp:"💡 참치로 간편 오므라이스"},
  {id:269,nm:"닭다리 카레",e:"🍛",ig:["chicken_thigh","potato","carrot","onion","rice","garlic"],tm:40,cal:480,pro:26,tag:"메인",st:[{i:"🍗",t:"닭다리 볶기"},{i:"🔪",t:"채소 깍둑"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"불끄고 카레루"}],tp:"💡 닭카레! 다짐육보다 씹는 맛이 좋아요"},
  {id:270,nm:"소고기 카레",e:"🍛",ig:["beef_soup","potato","carrot","onion","rice","garlic"],tm:40,cal:480,pro:24,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"채소 깍둑"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"불끄고 카레루"}],tp:"💡 소고기카레는 역시 클래식"},
  {id:271,nm:"목살 덮밥",e:"🍚",ig:["pork_neck","onion","rice","garlic","greenonion","egg"],tm:20,cal:440,pro:24,tag:"메인",st:[{i:"🥩",t:"목살 양념 볶기"},{i:"🧅",t:"양파 볶기"},{i:"🍚",t:"밥 위에"},{i:"🥚",t:"달걀후라이"}],tp:"💡 간장양념이면 일식풍, 고추장이면 한식풍"},
  {id:272,nm:"버섯볶음덮밥",e:"🍚",ig:["mushroom","onion","egg","rice","garlic","greenonion","carrot"],tm:15,cal:300,pro:10,tag:"메인",st:[{i:"🍄",t:"버섯+채소 볶기"},{i:"🥄",t:"굴소스+간장"},{i:"🍚",t:"밥 위에"},{i:"🥚",t:"달걀"}],tp:"💡 버섯 가득 저칼로리 덮밥"},
  {id:273,nm:"김치 비빔면",e:"🍜",ig:["noodle","kimchi","egg","greenonion","garlic"],tm:15,cal:360,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥬",t:"김치 송송+참기름+깨"},{i:"🥚",t:"삶은달걀"}],tp:"💡 매콤한게 땡길 때 간단하게"},
  {id:274,nm:"스팸김치우동",e:"🍜",ig:["noodle","spam","kimchi","greenonion","garlic","egg"],tm:15,cal:460,pro:18,tag:"메인",st:[{i:"🥫",t:"스팸+김치 볶기"},{i:"🍜",t:"소면 삶아 넣기"},{i:"🥄",t:"간장+고추장"},{i:"🥚",t:"달걀"}],tp:"💡 스팸+김치는 면요리의 정석"},
  {id:301,nm:"무생채",e:"🥗",ig:["radish","greenonion","garlic"],tm:15,cal:60,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"무채→소금5분→짜기"},{i:"🥄",t:"고춧가루+식초+설탕+액젓"},{i:"🥗",t:"버무리기"}],tp:"💡 물기 짜기 핵심"},
  {id:302,nm:"무조림",e:"🍛",ig:["radish","garlic","greenonion"],tm:30,cal:90,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"무 깍둑"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"✨",t:"파+참기름"}],tp:"💡 먼저 구우면 맛2배"},
  {id:303,nm:"무나물",e:"🥬",ig:["radish","garlic","greenonion"],tm:20,cal:70,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"무채"},{i:"🔥",t:"참기름+물+뚜껑"},{i:"🧂",t:"국간장"}],tp:"💡 새우젓→감칠맛"},
  {id:304,nm:"계란말이",e:"🍳",ig:["egg","greenonion","carrot"],tm:15,cal:200,pro:14,tag:"밑반찬",st:[{i:"🥚",t:"달걀3+채소+소금"},{i:"🔥",t:"약불 천천히 말기"},{i:"🔪",t:"식혀서 썰기"}],tp:"💡 마요1스푼→식어도촉촉"},
  {id:305,nm:"감자볶음",e:"🥔",ig:["potato","onion","garlic"],tm:20,cal:160,pro:3,tag:"밑반찬",st:[{i:"🔪",t:"감자 채"},{i:"💧",t:"찬물10분"},{i:"🔥",t:"바삭볶기+소금+깨"}],tp:"💡 전분 확실히 빼기"},
  {id:306,nm:"두부조림",e:"🍛",ig:["tofu","greenonion","garlic","onion"],tm:20,cal:150,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🥄",t:"간장+고춧가루+설탕+물"},{i:"🔥",t:"조리기"}],tp:"💡 소금물→안부서져요"},
  {id:307,nm:"멸치볶음",e:"🐟",ig:["anchovy","garlic","greenonion"],tm:15,cal:120,pro:10,tag:"밑반찬",st:[{i:"🐟",t:"마른팬 볶기"},{i:"🥄",t:"간장+올리고당"},{i:"✨",t:"깨"}],tp:"💡 견과류추가→고급"},
  {id:308,nm:"버섯볶음",e:"🍄",ig:["mushroom","onion","garlic","greenonion"],tm:15,cal:80,pro:3,tag:"밑반찬",st:[{i:"🍄",t:"찢기"},{i:"🔥",t:"센불 마늘→버섯"},{i:"🥄",t:"굴소스+참기름"}],tp:"💡 물 날려야 식감"},
  {id:309,nm:"어묵볶음",e:"🍢",ig:["onion","carrot","greenonion","garlic"],tm:15,cal:150,pro:6,tag:"밑반찬",st:[{i:"🍢",t:"한입크기"},{i:"🥄",t:"간장+올리고당+물"},{i:"🔥",t:"채소와 볶기"}],tp:"💡 데치면 깔끔"},
  {id:310,nm:"콩나물무침",e:"🌱",ig:["bean_sprout","garlic","greenonion"],tm:10,cal:50,pro:4,tag:"밑반찬",st:[{i:"🌱",t:"삶기(뚜껑!)"},{i:"💧",t:"헹구기"},{i:"🥄",t:"참기름+소금+깨"}],tp:"💡 뚜껑안열기!"},
  {id:311,nm:"시금치나물",e:"🥬",ig:["spinach","garlic"],tm:10,cal:45,pro:3,tag:"밑반찬",st:[{i:"🥬",t:"30초 데치기"},{i:"💧",t:"물기짜기"},{i:"🥄",t:"참기름+국간장+깨"}],tp:"💡 소금+기름데치면 색선명"},
  {id:312,nm:"양배추쌈",e:"🥗",ig:["cabbage","garlic"],tm:10,cal:30,pro:1,tag:"밑반찬",st:[{i:"🥗",t:"한잎씩"},{i:"💧",t:"30초 데치기"},{i:"🥄",t:"쌈장과 함께"}],tp:"💡 전자레인지2분OK"},
  {id:313,nm:"당근라페",e:"🥕",ig:["carrot","onion"],tm:10,cal:70,pro:1,tag:"밑반찬",st:[{i:"🥕",t:"채썰기"},{i:"🥄",t:"올리브유+레몬즙+소금"}],tp:"💡 30분숙성→맛UP"},
  {id:314,nm:"애호박전",e:"🥒",ig:["zucchini","egg","garlic"],tm:20,cal:140,pro:8,tag:"밑반찬",st:[{i:"🥒",t:"0.7cm 동글게"},{i:"🧂",t:"소금5분→닦기"},{i:"🍳",t:"밀가루+달걀 굽기"}],tp:"💡 0.7cm 최적"},
  {id:315,nm:"감자조림",e:"🥔",ig:["potato","garlic","greenonion"],tm:25,cal:170,pro:3,tag:"밑반찬",st:[{i:"🥔",t:"깍둑"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"✨",t:"깨"}],tp:"💡 자작할때까지"},
  {id:316,nm:"고추장감자",e:"🥔",ig:["potato","onion","garlic","pepper"],tm:20,cal:180,pro:3,tag:"밑반찬",st:[{i:"🥔",t:"깍둑"},{i:"🔥",t:"볶기"},{i:"🥄",t:"고추장+올리고당"}],tp:"💡 카레가루→카레감자"},
  {id:317,nm:"양파장아찌",e:"🧅",ig:["onion","garlic","pepper"],tm:15,cal:40,pro:1,tag:"밑반찬",st:[{i:"🧅",t:"큼직 썰기"},{i:"🍲",t:"간장:식초:설탕:물 끓이기"},{i:"💧",t:"부어 식히기"}],tp:"💡 하루뒤→일주일OK"},
  {id:318,nm:"달걀장조림",e:"🥚",ig:["egg","garlic","greenonion","pepper"],tm:30,cal:180,pro:14,tag:"밑반찬",st:[{i:"🥚",t:"반숙(6분)"},{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 반숙→노른자촉촉"},
  {id:319,nm:"캐러멜양파",e:"🧅",ig:["onion","garlic"],tm:20,cal:60,pro:1,tag:"밑반찬",ai:1,st:[{i:"🧅",t:"양파채"},{i:"🔥",t:"약불20분"},{i:"🥄",t:"간장1스푼"}],tp:"🤖 극한으로 볶으면 카라멜!"},
  {id:320,nm:"대파볶음",e:"🌿",ig:["greenonion","garlic","carrot"],tm:10,cal:50,pro:2,tag:"밑반찬",ai:1,st:[{i:"🌿",t:"대파+당근 송송"},{i:"🔥",t:"참기름에"},{i:"🧂",t:"소금+깨"}],tp:"🤖 대파초록도 맛있어요"},
  {id:321,nm:"감자전",e:"🥔",ig:["potato","egg","garlic"],tm:25,cal:200,pro:6,tag:"밑반찬",st:[{i:"🥔",t:"감자 갈기"},{i:"🧂",t:"소금 넣기"},{i:"🍳",t:"팬에 노릇 굽기"}],tp:"💡 감자를 갈아서 전분물째 부치면 쫀득"},
  {id:322,nm:"김치전",e:"🥬",ig:["kimchi","egg","greenonion"],tm:15,cal:180,pro:8,tag:"밑반찬",st:[{i:"🥬",t:"김치 다지기"},{i:"🥚",t:"밀가루+물+달걀 반죽"},{i:"🍳",t:"노릇 부치기"}],tp:"💡 비오는 날 김치전이 진리"},
  {id:323,nm:"버섯전",e:"🍄",ig:["mushroom","egg","garlic"],tm:20,cal:130,pro:7,tag:"밑반찬",st:[{i:"🍄",t:"새송이 슬라이스"},{i:"🥚",t:"밀가루+달걀물"},{i:"🍳",t:"부치기"}],tp:"💡 새송이버섯이 전에 최고"},
  {id:324,nm:"두부전",e:"🧈",ig:["tofu","egg","greenonion"],tm:15,cal:160,pro:12,tag:"밑반찬",st:[{i:"🧈",t:"두부 으깨기"},{i:"🥚",t:"달걀+파 섞기"},{i:"🍳",t:"동그랗게 부치기"}],tp:"💡 두부를 꼭 짜서 수분 제거!"},
  {id:325,nm:"양파볶음",e:"🧅",ig:["onion","garlic","greenonion"],tm:10,cal:50,pro:1,tag:"밑반찬",st:[{i:"🧅",t:"양파 채"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"간장+소금"}],tp:"💡 고기 반찬 옆에 가니쉬로"},
  {id:326,nm:"당근볶음",e:"🥕",ig:["carrot","garlic","greenonion"],tm:10,cal:60,pro:1,tag:"밑반찬",st:[{i:"🥕",t:"당근 채"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 도시락 반찬 단골"},
  {id:327,nm:"시금치 달걀볶음",e:"🥬",ig:["spinach","egg","garlic"],tm:10,cal:100,pro:8,tag:"밑반찬",st:[{i:"🥬",t:"시금치 데치기"},{i:"🥚",t:"달걀과 볶기"},{i:"🧂",t:"소금+후추"}],tp:"💡 서양식 시금치 스크램블"},
  {id:328,nm:"고추참치볶음",e:"🌶️",ig:["pepper","tuna_can","garlic","greenonion"],tm:10,cal:120,pro:14,tag:"밑반찬",st:[{i:"🌶️",t:"고추 송송"},{i:"🐟",t:"참치+고추 볶기"},{i:"🧂",t:"간장 한 방울"}],tp:"💡 밥도둑! 매콤고소"},
  {id:329,nm:"두부부침",e:"🧈",ig:["tofu","egg","garlic"],tm:15,cal:150,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 슬라이스"},{i:"🍳",t:"밀가루+달걀 입히기"},{i:"🔥",t:"노릇 굽기"}],tp:"💡 간장양념장에 찍어먹으면 최고"},
  {id:330,nm:"감자채볶음(매운맛)",e:"🥔",ig:["potato","pepper","garlic"],tm:20,cal:170,pro:3,tag:"밑반찬",st:[{i:"🥔",t:"감자 채"},{i:"🌶️",t:"고추 송송"},{i:"🔥",t:"볶기+소금"}],tp:"💡 청양고추 넣으면 매콤 감자채"},
  {id:331,nm:"양배추볶음",e:"🥗",ig:["cabbage","onion","garlic"],tm:10,cal:50,pro:2,tag:"밑반찬",st:[{i:"🥗",t:"양배추 한입 크기"},{i:"🔥",t:"센불 볶기"},{i:"🧂",t:"소금+후추+참기름"}],tp:"💡 심플하지만 달달한 양배추"},
  {id:332,nm:"무말랭이무침",e:"🥬",ig:["radish","garlic","greenonion","pepper"],tm:15,cal:70,pro:1,tag:"밑반찬",st:[{i:"🥬",t:"무 채썰어 말리기(또는 무채)"},{i:"🥄",t:"고춧가루+간장+설탕+참기름"},{i:"🥗",t:"버무리기"}],tp:"💡 무채를 소금에 절여 대용 가능"},
  {id:333,nm:"콩나물김치무침",e:"🌱",ig:["bean_sprout","kimchi","garlic","greenonion"],tm:10,cal:60,pro:4,tag:"밑반찬",st:[{i:"🌱",t:"콩나물 삶기"},{i:"🥬",t:"김치 송송"},{i:"🥄",t:"참기름+깨 무치기"}],tp:"💡 콩나물+김치의 아삭한 조합"},
  {id:334,nm:"달걀프라이",e:"🍳",ig:["egg","garlic"],tm:5,cal:90,pro:7,tag:"밑반찬",st:[{i:"🍳",t:"팬에 기름"},{i:"🥚",t:"달걀 부치기"},{i:"🧂",t:"소금+후추"}],tp:"💡 반숙이면 밥에 비벼먹기 좋아요"},
  {id:335,nm:"스팸구이",e:"🥫",ig:["spam","garlic"],tm:10,cal:250,pro:10,tag:"밑반찬",st:[{i:"🥫",t:"스팸 슬라이스"},{i:"🔥",t:"노릇 굽기"},{i:"🧂",t:"후추"}],tp:"💡 한입크기로 구우면 반찬으로 딱"},
  {id:336,nm:"참치전",e:"🐟",ig:["tuna_can","egg","onion","greenonion"],tm:15,cal:180,pro:16,tag:"밑반찬",st:[{i:"🐟",t:"참치+양파+달걀 섞기"},{i:"🍳",t:"동그랗게 부치기"}],tp:"💡 반찬으로도 간식으로도"},
  {id:337,nm:"감자 달걀샐러드",e:"🥗",ig:["potato","egg","onion","carrot"],tm:20,cal:180,pro:8,tag:"밑반찬",st:[{i:"🥔",t:"감자+달걀 삶기"},{i:"🔪",t:"으깨서 양파+당근 다지기"},{i:"🥄",t:"마요+소금+후추"}],tp:"💡 마요 넉넉히! 빵에 발라도 맛있어요"},
  {id:338,nm:"숙주나물",e:"🌱",ig:["bean_sprout","garlic","greenonion"],tm:10,cal:40,pro:3,tag:"밑반찬",st:[{i:"🌱",t:"콩나물 삶기"},{i:"💧",t:"헹구기"},{i:"🥄",t:"소금+참기름+마늘"}],tp:"💡 콩나물보다 더 아삭한 식감"},
  {id:339,nm:"당근계란볶음",e:"🥕",ig:["carrot","egg","garlic"],tm:10,cal:120,pro:8,tag:"밑반찬",st:[{i:"🥕",t:"당근 채"},{i:"🥚",t:"달걀 풀어 넣기"},{i:"🔥",t:"볶기"}],tp:"💡 달걀이 당근에 코팅돼서 부드러워요"},
  {id:340,nm:"오이무침",e:"🥒",ig:["zucchini","garlic","greenonion"],tm:10,cal:40,pro:1,tag:"밑반찬",st:[{i:"🥒",t:"호박 반달썰기"},{i:"🧂",t:"소금 절이기"},{i:"🥄",t:"고춧가루+참기름+깨"}],tp:"💡 호박을 오이 대용! 아삭한 무침"},
  {id:341,nm:"김치볶음",e:"🥬",ig:["kimchi","garlic","greenonion"],tm:10,cal:60,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 자르기"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"설탕 반스푼"}],tp:"💡 묵은지를 볶으면 새 김치처럼!"},
  {id:342,nm:"두부양념구이",e:"🧈",ig:["tofu","garlic","greenonion","pepper"],tm:15,cal:140,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🥄",t:"간장+고춧가루+참기름+파"},{i:"🔥",t:"양념 올려 마무리"}],tp:"💡 양념을 구운 두부 위에 올리면 끝"},
  {id:343,nm:"감자버터구이",e:"🥔",ig:["potato","garlic","onion"],tm:20,cal:200,pro:3,tag:"밑반찬",st:[{i:"🥔",t:"감자 삶기"},{i:"🔥",t:"버터에 구우기"},{i:"🧂",t:"소금+후추+파슬리"}],tp:"💡 삶은 감자를 으깨서 구우면 해시브라운"},
  {id:344,nm:"양배추 겉절이",e:"🥗",ig:["cabbage","garlic","greenonion","pepper"],tm:10,cal:40,pro:1,tag:"밑반찬",st:[{i:"🥗",t:"양배추 한입 썰기"},{i:"🥄",t:"고춧가루+액젓+설탕+참기름"},{i:"🥗",t:"버무리기"}],tp:"💡 김치 대용 즉석 겉절이"},
  {id:345,nm:"버섯간장조림",e:"🍄",ig:["mushroom","garlic","greenonion"],tm:15,cal:70,pro:3,tag:"밑반찬",st:[{i:"🍄",t:"버섯 찢기"},{i:"🥄",t:"간장+올리고당+물"},{i:"🔥",t:"조리기"}],tp:"💡 쫀득한 버섯조림"},
  {id:346,nm:"무피클",e:"🥬",ig:["radish","onion","garlic"],tm:10,cal:30,pro:0,tag:"밑반찬",st:[{i:"🥬",t:"무+양파 썰기"},{i:"🥄",t:"식초+설탕+소금+물"},{i:"💧",t:"부어서 냉장"}],tp:"💡 치킨 시켜먹을 때 곁들이기 좋아요"},
  {id:347,nm:"고추 달걀볶음",e:"🌶️",ig:["pepper","egg","garlic","greenonion"],tm:10,cal:110,pro:8,tag:"밑반찬",st:[{i:"🌶️",t:"고추 송송"},{i:"🥚",t:"달걀 풀어 볶기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 매콤하지만 달걀이 순하게 잡아줘요"},
  {id:348,nm:"참치 감자조림",e:"🥔",ig:["potato","tuna_can","garlic","greenonion"],tm:25,cal:200,pro:14,tag:"밑반찬",st:[{i:"🥔",t:"감자 깍둑"},{i:"🐟",t:"참치+간장+설탕"},{i:"🍲",t:"조리기"}],tp:"💡 참치가 감자조림에 감칠맛 추가"},
  {id:349,nm:"삼겹살 콩나물볶음",e:"🌱",ig:["bean_sprout","pork_belly","garlic","greenonion"],tm:15,cal:200,pro:12,tag:"밑반찬",st:[{i:"🥩",t:"삼겹 소량 볶기"},{i:"🌱",t:"콩나물 넣기"},{i:"🧂",t:"소금+참기름"}],tp:"💡 삼겹 기름이 콩나물에 스며들어요"},
  {id:350,nm:"달걀 감자볶음",e:"🥔",ig:["potato","egg","onion","garlic"],tm:15,cal:200,pro:10,tag:"밑반찬",st:[{i:"🥔",t:"감자 채볶기"},{i:"🥚",t:"달걀 스크램블 합치기"},{i:"🧂",t:"소금+후추"}],tp:"💡 감자+달걀은 든든한 반찬"},
  {id:400,nm:"라면+달걀",e:"🍜",ig:["ramen","egg","greenonion"],tm:10,cal:420,pro:14,tag:"메인",st:[{i:"🍜",t:"라면 끓이기"},{i:"🥚",t:"달걀 올리기"},{i:"🌿",t:"파 송송"}],tp:"💡 달걀은 반숙이 진리"},
  {id:401,nm:"김치라면",e:"🍜",ig:["ramen","kimchi","egg","greenonion"],tm:10,cal:450,pro:14,tag:"메인",st:[{i:"🥬",t:"김치 넣고 끓이기"},{i:"🍜",t:"라면+수프"},{i:"🥚",t:"달걀"}],tp:"💡 김치를 먼저 볶고 물 넣으면 맛 UP"},
  {id:402,nm:"참치라면",e:"🍜",ig:["ramen","tuna_can","egg","greenonion"],tm:10,cal:460,pro:20,tag:"메인",st:[{i:"🐟",t:"참치캔 넣기"},{i:"🍜",t:"라면 끓이기"},{i:"🥚",t:"달걀"}],tp:"💡 참치기름이 라면을 고급지게"},
  {id:403,nm:"달걀죽",e:"🍚",ig:["egg","rice","garlic","greenonion"],tm:20,cal:200,pro:10,tag:"메인",st:[{i:"🍚",t:"밥+물 끓이기"},{i:"🥚",t:"달걀 풀어 넣기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속이 편할 때, 아플 때 최고"},
  {id:404,nm:"참치죽",e:"🍚",ig:["tuna_can","rice","carrot","garlic","greenonion"],tm:25,cal:250,pro:16,tag:"메인",st:[{i:"🐟",t:"참치+당근 볶기"},{i:"🍚",t:"밥+물 넣고 끓이기"},{i:"🧂",t:"참기름+소금"}],tp:"💡 속편한 한끼"},
  {id:405,nm:"계란토스트",e:"🍳",ig:["egg","cabbage","carrot","garlic"],tm:10,cal:250,pro:12,tag:"메인",st:[{i:"🥚",t:"달걀+채소 섞기"},{i:"🍳",t:"팬에 부치기"},{i:"✨",t:"케첩+마요"}],tp:"💡 식빵 없어도! 달걀만으로"},
  {id:406,nm:"닭가슴살 볶음",e:"🍗",ig:["chicken_breast","onion","garlic","greenonion","pepper"],tm:20,cal:220,pro:28,tag:"메인",st:[{i:"🍗",t:"닭 한입크기"},{i:"🔥",t:"양파+고추와 볶기"},{i:"🧂",t:"간장+후추"}],tp:"💡 고단백 안주겸 반찬"},
  {id:407,nm:"감자볶음밥",e:"🍳",ig:["potato","egg","rice","onion","garlic","greenonion"],tm:20,cal:380,pro:12,tag:"메인",st:[{i:"🥔",t:"감자 작게 볶기"},{i:"🍚",t:"밥 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 감자의 포슬함+볶음밥"},
  {id:408,nm:"버섯볶음밥",e:"🍳",ig:["mushroom","egg","rice","onion","garlic","greenonion"],tm:15,cal:340,pro:12,tag:"메인",st:[{i:"🍄",t:"버섯 다져 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 버섯향이 밥에 배어요"},
  {id:409,nm:"콩나물볶음밥",e:"🍳",ig:["bean_sprout","egg","rice","kimchi","garlic","greenonion"],tm:15,cal:360,pro:14,tag:"메인",st:[{i:"🌱",t:"콩나물 볶기"},{i:"🍚",t:"밥+김치 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 아삭한 콩나물이 볶음밥에!"},
  {id:410,nm:"시금치 볶음밥",e:"🍳",ig:["spinach","egg","rice","garlic","greenonion","onion"],tm:15,cal:340,pro:14,tag:"메인",st:[{i:"🥬",t:"시금치 데쳐 다지기"},{i:"🍚",t:"밥+시금치 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 녹색 볶음밥! 영양 만점"},
  {id:411,nm:"양배추 볶음밥",e:"🍳",ig:["cabbage","egg","rice","garlic","greenonion","onion"],tm:15,cal:350,pro:12,tag:"메인",st:[{i:"🥗",t:"양배추 다져 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 양배추가 밥에 단맛을 더해줘요"},
  {id:412,nm:"당근볶음밥",e:"🍳",ig:["carrot","egg","rice","onion","garlic","greenonion"],tm:15,cal:350,pro:12,tag:"메인",st:[{i:"🥕",t:"당근 다져 볶기"},{i:"🍚",t:"밥 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 당근의 단맛이 볶음밥에 잘 어울려요"},
  {id:413,nm:"소고기 무국밥",e:"🍲",ig:["beef_soup","radish","rice","greenonion","garlic"],tm:40,cal:350,pro:18,tag:"메인",st:[{i:"🍲",t:"소고기무국 끓이기"},{i:"🍚",t:"밥 말아 넣기"},{i:"🌿",t:"파+후추"}],tp:"💡 국밥집 느낌 그대로"},
  {id:414,nm:"삼겹 김치국밥",e:"🍲",ig:["pork_belly","kimchi","rice","greenonion","garlic"],tm:25,cal:450,pro:18,tag:"메인",st:[{i:"🥩",t:"삼겹+김치 끓이기"},{i:"🍚",t:"밥 말아 넣기"},{i:"🌿",t:"파"}],tp:"💡 돼지국밥 스타일"},
  {id:415,nm:"콩나물국밥",e:"🍲",ig:["bean_sprout","rice","greenonion","garlic","kimchi"],tm:20,cal:300,pro:10,tag:"메인",st:[{i:"🌱",t:"콩나물국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🥬",t:"김치 곁들이기"}],tp:"💡 전주식 콩나물국밥"},
  {id:416,nm:"닭가슴살국수",e:"🍜",ig:["chicken_breast","noodle","greenonion","garlic","anchovy"],tm:25,cal:340,pro:28,tag:"메인",st:[{i:"🍗",t:"닭 삶아 찢기"},{i:"🐟",t:"멸치+닭육수"},{i:"🍜",t:"소면 삶기"},{i:"🌿",t:"면+육수+닭+파"}],tp:"💡 닭 삶은 물이 육수! 고단백 국수"},
  {id:417,nm:"소고기 볶음면",e:"🍜",ig:["beef_soup","ramen","onion","carrot","garlic","greenonion"],tm:20,cal:460,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🍜",t:"라면 2분 삶기"},{i:"🔥",t:"고기+채소+면 볶기"}],tp:"💡 소고기로 고급 볶음면"},
  {id:418,nm:"두부면(소면+두부)",e:"🍜",ig:["noodle","tofu","egg","greenonion","garlic","anchovy"],tm:20,cal:340,pro:18,tag:"메인",st:[{i:"🐟",t:"멸치 육수"},{i:"🍜",t:"소면 삶기"},{i:"🧈",t:"두부+달걀 고명"},{i:"🌿",t:"면+육수+고명"}],tp:"💡 두부가 들어간 든든한 국수"},
  {id:419,nm:"고추장 삼겹덮밥",e:"🍚",ig:["pork_belly","onion","rice","garlic","greenonion","pepper"],tm:20,cal:500,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🥄",t:"고추장+고추 양념"},{i:"🍚",t:"밥 위에"}],tp:"💡 간장 대신 고추장! 매콤 삼겹덮밥"},
  {id:420,nm:"두부 카레",e:"🍛",ig:["tofu","potato","carrot","onion","rice","garlic"],tm:30,cal:380,pro:14,tag:"메인",st:[{i:"🧈",t:"두부 깍둑"},{i:"🔪",t:"채소 볶기"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루+두부"}],tp:"💡 고기 대신 두부! 채식 카레"},
  {id:421,nm:"계란 김치죽",e:"🍚",ig:["egg","kimchi","rice","garlic","greenonion"],tm:20,cal:280,pro:12,tag:"메인",st:[{i:"🥬",t:"김치 볶기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🥚",t:"달걀 풀어 넣기"}],tp:"💡 매콤한 김치죽! 속이 든든"},
  // 어묵·떡·고구마·깻잎 활용 레시피
  {id:500,nm:"어묵탕",e:"🍢",ig:["fishcake","radish","greenonion","garlic","anchovy"],tm:25,cal:180,pro:14,tag:"국/찌개",st:[{i:"🐟",t:"멸치+무 육수 내기"},{i:"🍢",t:"어묵 꼬치에 꿰기"},{i:"💧",t:"육수에 어묵 넣고 끓이기"},{i:"🧂",t:"간장+소금+파"}],tp:"💡 편의점 어묵탕을 집에서! 무가 국물을 시원하게"},
  {id:501,nm:"어묵볶음(매콤)",e:"🍢",ig:["fishcake","onion","carrot","greenonion","garlic","pepper"],tm:15,cal:180,pro:10,tag:"밑반찬",st:[{i:"🍢",t:"어묵 한입크기"},{i:"🔪",t:"채소 썰기"},{i:"🥄",t:"고추장+간장+올리고당"},{i:"🔥",t:"볶기"}],tp:"💡 고추장 넣으면 매콤 어묵볶음"},
  {id:502,nm:"어묵국수",e:"🍜",ig:["fishcake","noodle","greenonion","garlic","anchovy","egg"],tm:20,cal:380,pro:18,tag:"메인",st:[{i:"🐟",t:"멸치 육수 내기"},{i:"🍜",t:"소면 삶기"},{i:"🍢",t:"어묵+달걀지단 고명"},{i:"🌿",t:"면+육수+고명"}],tp:"💡 어묵이 들어간 잔치국수 업그레이드"},
  {id:503,nm:"떡볶이",e:"🍡",ig:["ricecake","fishcake","cabbage","greenonion","garlic","egg"],tm:20,cal:400,pro:12,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장 끓이기"},{i:"🍡",t:"떡+어묵+양배추 넣기"},{i:"⏱️",t:"떡 말랑해질 때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 분식집 맛! 설탕 조절로 매운맛 조절"},
  {id:504,nm:"떡국",e:"🍲",ig:["ricecake","egg","greenonion","garlic","anchovy"],tm:25,cal:350,pro:12,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수 내기"},{i:"🍡",t:"떡 넣고 끓이기"},{i:"🥚",t:"달걀 풀어 넣기"},{i:"🌿",t:"파+간장"}],tp:"💡 명절 아니어도! 든든한 한끼 떡국"},
  {id:505,nm:"떡볶이 덮밥",e:"🍚",ig:["ricecake","fishcake","rice","cabbage","greenonion","garlic"],tm:20,cal:480,pro:12,tag:"메인",st:[{i:"🥄",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+어묵 넣기"},{i:"🍚",t:"밥 위에 올리기"}],tp:"💡 떡볶이를 밥 위에! 분식 덮밥"},
  {id:506,nm:"고구마조림",e:"🍠",ig:["sweetpotato","garlic","greenonion"],tm:25,cal:200,pro:2,tag:"밑반찬",st:[{i:"🍠",t:"고구마 깍둑썰기"},{i:"🍲",t:"간장+설탕+올리고당+물 조리기"},{i:"✨",t:"깨+참기름"}],tp:"💡 달달한 고구마조림은 밥도둑"},
  {id:507,nm:"고구마볶음밥",e:"🍳",ig:["sweetpotato","egg","rice","onion","garlic","greenonion"],tm:20,cal:400,pro:12,tag:"메인",st:[{i:"🍠",t:"고구마 작게 깍둑"},{i:"🔥",t:"고구마+양파 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 고구마의 단맛이 볶음밥에!"},
  {id:508,nm:"고구마맛탕",e:"🍠",ig:["sweetpotato","garlic"],tm:20,cal:250,pro:2,tag:"밑반찬",st:[{i:"🍠",t:"고구마 깍둑"},{i:"🔥",t:"기름에 튀기듯 굽기"},{i:"🥄",t:"설탕+물엿 코팅"}],tp:"💡 간식으로도 반찬으로도"},
  {id:509,nm:"깻잎무침",e:"🌿",ig:["sesame_leaf","garlic","greenonion","pepper"],tm:10,cal:40,pro:2,tag:"밑반찬",st:[{i:"🌿",t:"깻잎 씻어 쌓기"},{i:"🥄",t:"간장+고춧가루+참기름+마늘+파"},{i:"✨",t:"한장씩 양념 바르기"}],tp:"💡 밥도둑! 깻잎장아찌 스타일"},
  {id:510,nm:"깻잎전",e:"🌿",ig:["sesame_leaf","egg","ground_pork","garlic","onion"],tm:20,cal:200,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"다짐육+양파+마늘 양념"},{i:"🌿",t:"깻잎 사이에 고기 넣기"},{i:"🍳",t:"달걀물 입혀 굽기"}],tp:"💡 깻잎향+고기의 완벽한 조합"},
  {id:511,nm:"떡꼬치",e:"🍡",ig:["ricecake","fishcake","garlic","greenonion"],tm:15,cal:280,pro:8,tag:"밑반찬",st:[{i:"🍡",t:"떡+어묵 꼬치에 꿰기"},{i:"🔥",t:"팬에 노릇 굽기"},{i:"🥄",t:"고추장+올리고당 소스"}],tp:"💡 분식집 떡꼬치를 집에서"},
  {id:512,nm:"어묵 떡볶이탕",e:"🍲",ig:["ricecake","fishcake","cabbage","greenonion","garlic","egg"],tm:25,cal:380,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 많이+고추장+간장"},{i:"🍡",t:"떡+어묵+양배추"},{i:"🥚",t:"달걀"},{i:"⏱️",t:"국물 넉넉한 떡볶이"}],tp:"💡 국물 떡볶이! 라볶이처럼"},
  {id:513,nm:"고구마 된장국",e:"🍲",ig:["sweetpotato","garlic","greenonion","tofu"],tm:25,cal:160,pro:7,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🍠",t:"고구마+두부 끓이기"},{i:"🌿",t:"파"}],tp:"💡 고구마의 단맛+된장의 구수함"},
  {id:514,nm:"어묵김치볶음밥",e:"🍳",ig:["fishcake","kimchi","egg","rice","greenonion","garlic"],tm:15,cal:420,pro:16,tag:"메인",st:[{i:"🍢",t:"어묵 다져 볶기"},{i:"🥬",t:"김치+밥 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 어묵이 볶음밥에 쫄깃한 식감"},
  // ═══ AI 생성 레시피 (895 개) ═══
  {id:1001,nm:"삼겹살 김치볶음밥",e:"🍳",ig:["pork_belly", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:419,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+김치 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1002,nm:"삼겹살 양파볶음밥",e:"🍳",ig:["pork_belly", "onion", "egg", "rice", "garlic", "greenonion"],tm:10,cal:498,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+양파 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1003,nm:"삼겹살 당근볶음밥",e:"🍳",ig:["pork_belly", "carrot", "egg", "rice", "garlic", "greenonion"],tm:20,cal:417,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+당근 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 당근의 수분을 날려야 밥이 파라파라"},
  {id:1004,nm:"삼겹살 양배추볶음밥",e:"🍳",ig:["pork_belly", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:10,cal:468,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+양배추 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 양배추의 수분을 날려야 밥이 파라파라"},
  {id:1005,nm:"삼겹살 버섯볶음밥",e:"🍳",ig:["pork_belly", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:465,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+버섯 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1006,nm:"삼겹살 콩나물볶음밥",e:"🍳",ig:["pork_belly", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:20,cal:474,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+콩나물 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 삼겹살를 먼저 볶아야 맛이 살아요"},
  {id:1007,nm:"삼겹살 시금치볶음밥",e:"🍳",ig:["pork_belly", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:471,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+시금치 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 삼겹살+시금치은 의외의 꿀조합!"},
  {id:1008,nm:"삼겹살 애호박볶음밥",e:"🍳",ig:["pork_belly", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:436,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+애호박 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1009,nm:"삼겹살 고추볶음밥",e:"🍳",ig:["pork_belly", "pepper", "egg", "rice", "garlic", "greenonion"],tm:20,cal:399,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+고추 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1010,nm:"삼겹살 고구마볶음밥",e:"🍳",ig:["pork_belly", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:10,cal:390,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+고구마 잘게 썰기"},{i:"🔥",t:"삼겹살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1011,nm:"목살 김치볶음밥",e:"🍳",ig:["pork_neck", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:358,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+김치 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 목살+김치은 의외의 꿀조합!"},
  {id:1012,nm:"목살 양파볶음밥",e:"🍳",ig:["pork_neck", "onion", "egg", "rice", "garlic", "greenonion"],tm:10,cal:414,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+양파 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 양파의 수분을 날려야 밥이 파라파라"},
  {id:1013,nm:"목살 당근볶음밥",e:"🍳",ig:["pork_neck", "carrot", "egg", "rice", "garlic", "greenonion"],tm:15,cal:399,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+당근 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 목살를 먼저 볶아야 맛이 살아요"},
  {id:1014,nm:"목살 양배추볶음밥",e:"🍳",ig:["pork_neck", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:457,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+양배추 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 목살를 먼저 볶아야 맛이 살아요"},
  {id:1015,nm:"목살 버섯볶음밥",e:"🍳",ig:["pork_neck", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:10,cal:382,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+버섯 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 목살+버섯은 의외의 꿀조합!"},
  {id:1016,nm:"목살 콩나물볶음밥",e:"🍳",ig:["pork_neck", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:381,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+콩나물 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 콩나물의 수분을 날려야 밥이 파라파라"},
  {id:1017,nm:"목살 시금치볶음밥",e:"🍳",ig:["pork_neck", "spinach", "egg", "rice", "garlic", "greenonion"],tm:20,cal:485,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+시금치 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1018,nm:"목살 애호박볶음밥",e:"🍳",ig:["pork_neck", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:479,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+애호박 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 목살를 먼저 볶아야 맛이 살아요"},
  {id:1019,nm:"목살 고추볶음밥",e:"🍳",ig:["pork_neck", "pepper", "egg", "rice", "garlic", "greenonion"],tm:10,cal:378,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+고추 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 고추의 수분을 날려야 밥이 파라파라"},
  {id:1020,nm:"목살 고구마볶음밥",e:"🍳",ig:["pork_neck", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:20,cal:486,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+고구마 잘게 썰기"},{i:"🔥",t:"목살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 고구마의 수분을 날려야 밥이 파라파라"},
  {id:1021,nm:"닭가슴살 김치볶음밥",e:"🍳",ig:["chicken_breast", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:383,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+김치 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살를 먼저 볶아야 맛이 살아요"},
  {id:1022,nm:"닭가슴살 양파볶음밥",e:"🍳",ig:["chicken_breast", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:368,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+양파 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살를 먼저 볶아야 맛이 살아요"},
  {id:1023,nm:"닭가슴살 당근볶음밥",e:"🍳",ig:["chicken_breast", "carrot", "egg", "rice", "garlic", "greenonion"],tm:20,cal:399,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+당근 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살+당근은 의외의 꿀조합!"},
  {id:1024,nm:"닭가슴살 양배추볶음밥",e:"🍳",ig:["chicken_breast", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:391,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+양배추 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살를 먼저 볶아야 맛이 살아요"},
  {id:1025,nm:"닭가슴살 버섯볶음밥",e:"🍳",ig:["chicken_breast", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:378,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+버섯 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 버섯의 수분을 날려야 밥이 파라파라"},
  {id:1026,nm:"닭가슴살 콩나물볶음밥",e:"🍳",ig:["chicken_breast", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:472,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+콩나물 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1027,nm:"닭가슴살 시금치볶음밥",e:"🍳",ig:["chicken_breast", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:357,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+시금치 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살를 먼저 볶아야 맛이 살아요"},
  {id:1028,nm:"닭가슴살 애호박볶음밥",e:"🍳",ig:["chicken_breast", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:447,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+애호박 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살+애호박은 의외의 꿀조합!"},
  {id:1029,nm:"닭가슴살 고추볶음밥",e:"🍳",ig:["chicken_breast", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:376,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+고추 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살를 먼저 볶아야 맛이 살아요"},
  {id:1030,nm:"닭가슴살 고구마볶음밥",e:"🍳",ig:["chicken_breast", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:10,cal:423,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+고구마 잘게 썰기"},{i:"🔥",t:"닭가슴살 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 닭가슴살를 먼저 볶아야 맛이 살아요"},
  {id:1031,nm:"소고기 김치볶음밥",e:"🍳",ig:["beef_soup", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:455,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+김치 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 소고기를 먼저 볶아야 맛이 살아요"},
  {id:1032,nm:"소고기 양파볶음밥",e:"🍳",ig:["beef_soup", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:442,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+양파 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 소고기+양파은 의외의 꿀조합!"},
  {id:1033,nm:"소고기 당근볶음밥",e:"🍳",ig:["beef_soup", "carrot", "egg", "rice", "garlic", "greenonion"],tm:15,cal:490,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+당근 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 당근의 수분을 날려야 밥이 파라파라"},
  {id:1034,nm:"소고기 양배추볶음밥",e:"🍳",ig:["beef_soup", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:10,cal:393,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+양배추 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 소고기+양배추은 의외의 꿀조합!"},
  {id:1035,nm:"소고기 버섯볶음밥",e:"🍳",ig:["beef_soup", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:448,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+버섯 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 버섯의 수분을 날려야 밥이 파라파라"},
  {id:1036,nm:"소고기 콩나물볶음밥",e:"🍳",ig:["beef_soup", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:433,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+콩나물 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 소고기+콩나물은 의외의 꿀조합!"},
  {id:1037,nm:"소고기 시금치볶음밥",e:"🍳",ig:["beef_soup", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:444,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+시금치 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 소고기+시금치은 의외의 꿀조합!"},
  {id:1038,nm:"소고기 애호박볶음밥",e:"🍳",ig:["beef_soup", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:489,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+애호박 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1039,nm:"소고기 고추볶음밥",e:"🍳",ig:["beef_soup", "pepper", "egg", "rice", "garlic", "greenonion"],tm:20,cal:498,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+고추 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 소고기+고추은 의외의 꿀조합!"},
  {id:1040,nm:"소고기 고구마볶음밥",e:"🍳",ig:["beef_soup", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:382,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+고구마 잘게 썰기"},{i:"🔥",t:"소고기 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1041,nm:"다짐육 김치볶음밥",e:"🍳",ig:["ground_pork", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:369,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+김치 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 김치의 수분을 날려야 밥이 파라파라"},
  {id:1042,nm:"다짐육 양파볶음밥",e:"🍳",ig:["ground_pork", "onion", "egg", "rice", "garlic", "greenonion"],tm:10,cal:385,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+양파 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1043,nm:"다짐육 당근볶음밥",e:"🍳",ig:["ground_pork", "carrot", "egg", "rice", "garlic", "greenonion"],tm:15,cal:411,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+당근 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 다짐육를 먼저 볶아야 맛이 살아요"},
  {id:1044,nm:"다짐육 양배추볶음밥",e:"🍳",ig:["ground_pork", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:10,cal:418,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+양배추 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 다짐육+양배추은 의외의 꿀조합!"},
  {id:1045,nm:"다짐육 버섯볶음밥",e:"🍳",ig:["ground_pork", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:10,cal:396,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+버섯 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 버섯의 수분을 날려야 밥이 파라파라"},
  {id:1046,nm:"다짐육 콩나물볶음밥",e:"🍳",ig:["ground_pork", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:352,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+콩나물 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 콩나물의 수분을 날려야 밥이 파라파라"},
  {id:1047,nm:"다짐육 시금치볶음밥",e:"🍳",ig:["ground_pork", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:398,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+시금치 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1048,nm:"다짐육 애호박볶음밥",e:"🍳",ig:["ground_pork", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:20,cal:491,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+애호박 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 다짐육+애호박은 의외의 꿀조합!"},
  {id:1049,nm:"다짐육 고추볶음밥",e:"🍳",ig:["ground_pork", "pepper", "egg", "rice", "garlic", "greenonion"],tm:10,cal:452,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+고추 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 다짐육+고추은 의외의 꿀조합!"},
  {id:1050,nm:"다짐육 고구마볶음밥",e:"🍳",ig:["ground_pork", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:20,cal:428,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+고구마 잘게 썰기"},{i:"🔥",t:"다짐육 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1051,nm:"스팸 김치볶음밥",e:"🍳",ig:["spam", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:474,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+김치 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 김치의 수분을 날려야 밥이 파라파라"},
  {id:1052,nm:"스팸 양파볶음밥",e:"🍳",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:369,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+양파 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 스팸를 먼저 볶아야 맛이 살아요"},
  {id:1053,nm:"스팸 당근볶음밥",e:"🍳",ig:["spam", "carrot", "egg", "rice", "garlic", "greenonion"],tm:15,cal:388,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+당근 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 당근의 수분을 날려야 밥이 파라파라"},
  {id:1054,nm:"스팸 양배추볶음밥",e:"🍳",ig:["spam", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:397,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+양배추 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 스팸를 먼저 볶아야 맛이 살아요"},
  {id:1055,nm:"스팸 버섯볶음밥",e:"🍳",ig:["spam", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:10,cal:392,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+버섯 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1056,nm:"스팸 콩나물볶음밥",e:"🍳",ig:["spam", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:355,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+콩나물 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 콩나물의 수분을 날려야 밥이 파라파라"},
  {id:1057,nm:"스팸 시금치볶음밥",e:"🍳",ig:["spam", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:390,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+시금치 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 스팸+시금치은 의외의 꿀조합!"},
  {id:1058,nm:"스팸 애호박볶음밥",e:"🍳",ig:["spam", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:392,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+애호박 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 스팸를 먼저 볶아야 맛이 살아요"},
  {id:1059,nm:"스팸 고추볶음밥",e:"🍳",ig:["spam", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:355,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+고추 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 스팸+고추은 의외의 꿀조합!"},
  {id:1060,nm:"스팸 고구마볶음밥",e:"🍳",ig:["spam", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:10,cal:382,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+고구마 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 고구마의 수분을 날려야 밥이 파라파라"},
  {id:1061,nm:"참치 김치볶음밥",e:"🍳",ig:["tuna_can", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:438,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+김치 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 김치의 수분을 날려야 밥이 파라파라"},
  {id:1062,nm:"참치 양파볶음밥",e:"🍳",ig:["tuna_can", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:364,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+양파 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 양파의 수분을 날려야 밥이 파라파라"},
  {id:1063,nm:"참치 당근볶음밥",e:"🍳",ig:["tuna_can", "carrot", "egg", "rice", "garlic", "greenonion"],tm:20,cal:400,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+당근 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1064,nm:"참치 양배추볶음밥",e:"🍳",ig:["tuna_can", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:486,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+양배추 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 양배추의 수분을 날려야 밥이 파라파라"},
  {id:1065,nm:"참치 버섯볶음밥",e:"🍳",ig:["tuna_can", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:392,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+버섯 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1066,nm:"참치 콩나물볶음밥",e:"🍳",ig:["tuna_can", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:10,cal:439,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+콩나물 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1067,nm:"참치 시금치볶음밥",e:"🍳",ig:["tuna_can", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:462,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+시금치 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 참치+시금치은 의외의 꿀조합!"},
  {id:1068,nm:"참치 애호박볶음밥",e:"🍳",ig:["tuna_can", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:482,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+애호박 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1069,nm:"참치 고추볶음밥",e:"🍳",ig:["tuna_can", "pepper", "egg", "rice", "garlic", "greenonion"],tm:10,cal:452,pro:20,tag:"메인",st:[{i:"🔪",t:"참치+고추 잘게 썰기"},{i:"🔥",t:"참치 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 고추의 수분을 날려야 밥이 파라파라"},
  {id:1070,nm:"어묵 김치볶음밥",e:"🍳",ig:["fishcake", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:10,cal:353,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+김치 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 김치의 수분을 날려야 밥이 파라파라"},
  {id:1071,nm:"어묵 양파볶음밥",e:"🍳",ig:["fishcake", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:427,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+양파 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 양파의 수분을 날려야 밥이 파라파라"},
  {id:1072,nm:"어묵 당근볶음밥",e:"🍳",ig:["fishcake", "carrot", "egg", "rice", "garlic", "greenonion"],tm:15,cal:451,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+당근 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 당근의 수분을 날려야 밥이 파라파라"},
  {id:1073,nm:"어묵 양배추볶음밥",e:"🍳",ig:["fishcake", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:483,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+양배추 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 어묵를 먼저 볶아야 맛이 살아요"},
  {id:1074,nm:"어묵 버섯볶음밥",e:"🍳",ig:["fishcake", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:367,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+버섯 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1075,nm:"어묵 콩나물볶음밥",e:"🍳",ig:["fishcake", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:10,cal:351,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+콩나물 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1076,nm:"어묵 애호박볶음밥",e:"🍳",ig:["fishcake", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:20,cal:413,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+애호박 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1077,nm:"어묵 고추볶음밥",e:"🍳",ig:["fishcake", "pepper", "egg", "rice", "garlic", "greenonion"],tm:20,cal:495,pro:12,tag:"메인",st:[{i:"🔪",t:"어묵+고추 잘게 썰기"},{i:"🔥",t:"어묵 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 간장 한 바퀴 + 참기름으로 마무리"},
  {id:1078,nm:"삼겹살 간장덮밥",e:"🍚",ig:["pork_belly", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:414,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 한입크기로 볶기"},{i:"🥄",t:"간장+설탕+미림 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 간장 양념이 삼겹살에 잘 어울려요"},
  {id:1079,nm:"삼겹살 고추장덮밥",e:"🍚",ig:["pork_belly", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:419,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 한입크기로 볶기"},{i:"🥄",t:"고추장+고춧가루 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 고추장 양념이 삼겹살에 잘 어울려요"},
  {id:1080,nm:"삼겹살 카레덮밥",e:"🍚",ig:["pork_belly", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:441,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 한입크기로 볶기"},{i:"🥄",t:"카레가루+물 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 카레 양념이 삼겹살에 잘 어울려요"},
  {id:1081,nm:"목살 간장덮밥",e:"🍚",ig:["pork_neck", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:421,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 한입크기로 볶기"},{i:"🥄",t:"간장+설탕+미림 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 간장 양념이 목살에 잘 어울려요"},
  {id:1082,nm:"목살 고추장덮밥",e:"🍚",ig:["pork_neck", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:467,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 한입크기로 볶기"},{i:"🥄",t:"고추장+고춧가루 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 고추장 양념이 목살에 잘 어울려요"},
  {id:1083,nm:"목살 카레덮밥",e:"🍚",ig:["pork_neck", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:434,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 한입크기로 볶기"},{i:"🥄",t:"카레가루+물 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 카레 양념이 목살에 잘 어울려요"},
  {id:1084,nm:"닭가슴살 간장덮밥",e:"🍚",ig:["chicken_breast", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:454,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 한입크기로 볶기"},{i:"🥄",t:"간장+설탕+미림 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 간장 양념이 닭가슴살에 잘 어울려요"},
  {id:1085,nm:"닭가슴살 고추장덮밥",e:"🍚",ig:["chicken_breast", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:420,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 한입크기로 볶기"},{i:"🥄",t:"고추장+고춧가루 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 고추장 양념이 닭가슴살에 잘 어울려요"},
  {id:1086,nm:"닭가슴살 카레덮밥",e:"🍚",ig:["chicken_breast", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:464,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 한입크기로 볶기"},{i:"🥄",t:"카레가루+물 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 카레 양념이 닭가슴살에 잘 어울려요"},
  {id:1087,nm:"소고기 간장덮밥",e:"🍚",ig:["beef_soup", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:436,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 한입크기로 볶기"},{i:"🥄",t:"간장+설탕+미림 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 간장 양념이 소고기에 잘 어울려요"},
  {id:1088,nm:"소고기 고추장덮밥",e:"🍚",ig:["beef_soup", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:456,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 한입크기로 볶기"},{i:"🥄",t:"고추장+고춧가루 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 고추장 양념이 소고기에 잘 어울려요"},
  {id:1089,nm:"소고기 카레덮밥",e:"🍚",ig:["beef_soup", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:432,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 한입크기로 볶기"},{i:"🥄",t:"카레가루+물 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 카레 양념이 소고기에 잘 어울려요"},
  {id:1090,nm:"다짐육 간장덮밥",e:"🍚",ig:["ground_pork", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:454,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 한입크기로 볶기"},{i:"🥄",t:"간장+설탕+미림 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 간장 양념이 다짐육에 잘 어울려요"},
  {id:1091,nm:"다짐육 고추장덮밥",e:"🍚",ig:["ground_pork", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:442,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 한입크기로 볶기"},{i:"🥄",t:"고추장+고춧가루 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 고추장 양념이 다짐육에 잘 어울려요"},
  {id:1092,nm:"다짐육 카레덮밥",e:"🍚",ig:["ground_pork", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:422,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 한입크기로 볶기"},{i:"🥄",t:"카레가루+물 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 카레 양념이 다짐육에 잘 어울려요"},
  {id:1093,nm:"스팸 간장덮밥",e:"🍚",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:413,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 한입크기로 볶기"},{i:"🥄",t:"간장+설탕+미림 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 간장 양념이 스팸에 잘 어울려요"},
  {id:1094,nm:"스팸 고추장덮밥",e:"🍚",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:412,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 한입크기로 볶기"},{i:"🥄",t:"고추장+고춧가루 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 고추장 양념이 스팸에 잘 어울려요"},
  {id:1095,nm:"스팸 카레덮밥",e:"🍚",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:399,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 한입크기로 볶기"},{i:"🥄",t:"카레가루+물 양념 만들기"},{i:"🧅",t:"양파와 함께 조리기"},{i:"🍚",t:"밥 위에 올리고 달걀 반숙"}],tp:"💡 카레 양념이 스팸에 잘 어울려요"},
  {id:1096,nm:"삼겹살 콩나물 된장국",e:"🍲",ig:["pork_belly", "bean_sprout", "garlic", "greenonion"],tm:15,cal:188,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"삼겹살+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 삼겹살이 잘 어울려요"},
  {id:1097,nm:"삼겹살 무 된장국",e:"🍲",ig:["pork_belly", "radish", "garlic", "greenonion"],tm:30,cal:174,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"삼겹살+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 삼겹살이 잘 어울려요"},
  {id:1098,nm:"삼겹살 당근 된장국",e:"🍲",ig:["pork_belly", "carrot", "garlic", "greenonion"],tm:25,cal:176,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"삼겹살+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 삼겹살이 잘 어울려요"},
  {id:1099,nm:"목살 시금치 된장국",e:"🍲",ig:["pork_neck", "spinach", "garlic", "greenonion"],tm:30,cal:229,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"목살+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 목살이 잘 어울려요"},
  {id:1100,nm:"목살 김치 된장국",e:"🍲",ig:["pork_neck", "kimchi", "garlic", "greenonion", "tofu"],tm:30,cal:210,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"목살+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 목살이 잘 어울려요"},
  {id:1101,nm:"목살 애호박 된장국",e:"🍲",ig:["pork_neck", "zucchini", "garlic", "greenonion"],tm:25,cal:153,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"목살+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 목살이 잘 어울려요"},
  {id:1102,nm:"소고기 김치 된장국",e:"🍲",ig:["beef_soup", "kimchi", "garlic", "greenonion", "tofu"],tm:15,cal:216,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"소고기+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 소고기이 잘 어울려요"},
  {id:1103,nm:"소고기 고구마 된장국",e:"🍲",ig:["beef_soup", "sweetpotato", "garlic", "greenonion"],tm:20,cal:146,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"소고기+고구마 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 소고기이 잘 어울려요"},
  {id:1104,nm:"소고기 감자 된장국",e:"🍲",ig:["beef_soup", "potato", "garlic", "greenonion", "tofu"],tm:20,cal:223,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"소고기+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 소고기이 잘 어울려요"},
  {id:1105,nm:"다짐육 무 된장국",e:"🍲",ig:["ground_pork", "radish", "garlic", "greenonion", "tofu"],tm:30,cal:211,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"다짐육+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 다짐육이 잘 어울려요"},
  {id:1106,nm:"다짐육 김치 된장국",e:"🍲",ig:["ground_pork", "kimchi", "garlic", "greenonion"],tm:30,cal:194,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"다짐육+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 다짐육이 잘 어울려요"},
  {id:1107,nm:"다짐육 당근 된장국",e:"🍲",ig:["ground_pork", "carrot", "garlic", "greenonion"],tm:15,cal:174,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"다짐육+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 다짐육이 잘 어울려요"},
  {id:1108,nm:"참치 무 된장국",e:"🍲",ig:["tuna_can", "radish", "garlic", "greenonion"],tm:15,cal:114,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"참치+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 참치이 잘 어울려요"},
  {id:1109,nm:"참치 버섯 된장국",e:"🍲",ig:["tuna_can", "mushroom", "garlic", "greenonion", "tofu"],tm:20,cal:213,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"참치+버섯 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 참치이 잘 어울려요"},
  {id:1110,nm:"참치 김치 된장국",e:"🍲",ig:["tuna_can", "kimchi", "garlic", "greenonion", "tofu"],tm:15,cal:203,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"참치+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 참치이 잘 어울려요"},
  {id:1111,nm:"스팸 양배추 된장국",e:"🍲",ig:["spam", "cabbage", "garlic", "greenonion", "tofu"],tm:15,cal:117,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"스팸+양배추 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 스팸이 잘 어울려요"},
  {id:1112,nm:"스팸 콩나물 된장국",e:"🍲",ig:["spam", "bean_sprout", "garlic", "greenonion", "tofu"],tm:25,cal:208,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"스팸+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 스팸이 잘 어울려요"},
  {id:1113,nm:"스팸 감자 된장국",e:"🍲",ig:["spam", "potato", "garlic", "greenonion"],tm:20,cal:186,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"스팸+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 스팸이 잘 어울려요"},
  {id:1114,nm:"두부 시금치 된장국",e:"🍲",ig:["tofu", "spinach", "garlic", "greenonion"],tm:25,cal:159,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"두부+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 두부이 잘 어울려요"},
  {id:1115,nm:"두부 애호박 된장국",e:"🍲",ig:["tofu", "zucchini", "garlic", "greenonion"],tm:25,cal:212,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"두부+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 두부이 잘 어울려요"},
  {id:1116,nm:"두부 당근 된장국",e:"🍲",ig:["tofu", "carrot", "garlic", "greenonion"],tm:25,cal:210,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"두부+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 두부이 잘 어울려요"},
  {id:1117,nm:"달걀 버섯 된장국",e:"🍲",ig:["egg", "mushroom", "garlic", "greenonion"],tm:15,cal:131,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"달걀+버섯 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 달걀이 잘 어울려요"},
  {id:1118,nm:"달걀 감자 된장국",e:"🍲",ig:["egg", "potato", "garlic", "greenonion", "tofu"],tm:25,cal:138,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"달걀+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 달걀이 잘 어울려요"},
  {id:1119,nm:"달걀 시금치 된장국",e:"🍲",ig:["egg", "spinach", "garlic", "greenonion", "tofu"],tm:25,cal:158,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"달걀+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 달걀이 잘 어울려요"},
  {id:1120,nm:"어묵 당근 된장국",e:"🍲",ig:["fishcake", "carrot", "garlic", "greenonion", "tofu"],tm:30,cal:221,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"어묵+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 어묵이 잘 어울려요"},
  {id:1121,nm:"어묵 콩나물 된장국",e:"🍲",ig:["fishcake", "bean_sprout", "garlic", "greenonion"],tm:15,cal:144,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"어묵+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 어묵이 잘 어울려요"},
  {id:1122,nm:"어묵 버섯 된장국",e:"🍲",ig:["fishcake", "mushroom", "garlic", "greenonion"],tm:15,cal:228,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🥄",t:"된장 1.5스푼 풀기"},{i:"🔪",t:"어묵+버섯 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 된장 베이스에 어묵이 잘 어울려요"},
  {id:1123,nm:"삼겹살 무 고추장국",e:"🍲",ig:["pork_belly", "radish", "garlic", "greenonion"],tm:25,cal:204,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"삼겹살+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 삼겹살이 잘 어울려요"},
  {id:1124,nm:"삼겹살 감자 고추장국",e:"🍲",ig:["pork_belly", "potato", "garlic", "greenonion"],tm:15,cal:123,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"삼겹살+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 삼겹살이 잘 어울려요"},
  {id:1125,nm:"삼겹살 애호박 고추장국",e:"🍲",ig:["pork_belly", "zucchini", "garlic", "greenonion"],tm:25,cal:172,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"삼겹살+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 삼겹살이 잘 어울려요"},
  {id:1126,nm:"목살 당근 고추장국",e:"🍲",ig:["pork_neck", "carrot", "garlic", "greenonion", "tofu"],tm:15,cal:227,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"목살+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 목살이 잘 어울려요"},
  {id:1127,nm:"목살 감자 고추장국",e:"🍲",ig:["pork_neck", "potato", "garlic", "greenonion"],tm:15,cal:140,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"목살+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 목살이 잘 어울려요"},
  {id:1128,nm:"목살 콩나물 고추장국",e:"🍲",ig:["pork_neck", "bean_sprout", "garlic", "greenonion"],tm:20,cal:181,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"목살+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 목살이 잘 어울려요"},
  {id:1129,nm:"소고기 김치 고추장국",e:"🍲",ig:["beef_soup", "kimchi", "garlic", "greenonion"],tm:15,cal:153,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"소고기+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 소고기이 잘 어울려요"},
  {id:1130,nm:"소고기 애호박 고추장국",e:"🍲",ig:["beef_soup", "zucchini", "garlic", "greenonion"],tm:20,cal:213,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"소고기+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 소고기이 잘 어울려요"},
  {id:1131,nm:"소고기 고구마 고추장국",e:"🍲",ig:["beef_soup", "sweetpotato", "garlic", "greenonion"],tm:30,cal:191,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"소고기+고구마 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 소고기이 잘 어울려요"},
  {id:1132,nm:"다짐육 당근 고추장국",e:"🍲",ig:["ground_pork", "carrot", "garlic", "greenonion"],tm:25,cal:223,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"다짐육+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 다짐육이 잘 어울려요"},
  {id:1133,nm:"다짐육 양배추 고추장국",e:"🍲",ig:["ground_pork", "cabbage", "garlic", "greenonion"],tm:20,cal:172,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"다짐육+양배추 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 다짐육이 잘 어울려요"},
  {id:1134,nm:"다짐육 콩나물 고추장국",e:"🍲",ig:["ground_pork", "bean_sprout", "garlic", "greenonion"],tm:25,cal:153,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"다짐육+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 다짐육이 잘 어울려요"},
  {id:1135,nm:"참치 감자 고추장국",e:"🍲",ig:["tuna_can", "potato", "garlic", "greenonion", "tofu"],tm:25,cal:224,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"참치+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 참치이 잘 어울려요"},
  {id:1136,nm:"참치 애호박 고추장국",e:"🍲",ig:["tuna_can", "zucchini", "garlic", "greenonion"],tm:25,cal:225,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"참치+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 참치이 잘 어울려요"},
  {id:1137,nm:"참치 고구마 고추장국",e:"🍲",ig:["tuna_can", "sweetpotato", "garlic", "greenonion", "tofu"],tm:20,cal:199,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"참치+고구마 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 참치이 잘 어울려요"},
  {id:1138,nm:"스팸 시금치 고추장국",e:"🍲",ig:["spam", "spinach", "garlic", "greenonion", "tofu"],tm:25,cal:138,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"스팸+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 스팸이 잘 어울려요"},
  {id:1139,nm:"스팸 양배추 고추장국",e:"🍲",ig:["spam", "cabbage", "garlic", "greenonion"],tm:25,cal:151,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"스팸+양배추 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 스팸이 잘 어울려요"},
  {id:1140,nm:"스팸 감자 고추장국",e:"🍲",ig:["spam", "potato", "garlic", "greenonion"],tm:30,cal:169,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"스팸+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 스팸이 잘 어울려요"},
  {id:1141,nm:"두부 무 고추장국",e:"🍲",ig:["tofu", "radish", "garlic", "greenonion"],tm:20,cal:116,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"두부+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 두부이 잘 어울려요"},
  {id:1142,nm:"두부 감자 고추장국",e:"🍲",ig:["tofu", "potato", "garlic", "greenonion"],tm:20,cal:120,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"두부+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 두부이 잘 어울려요"},
  {id:1143,nm:"두부 시금치 고추장국",e:"🍲",ig:["tofu", "spinach", "garlic", "greenonion"],tm:30,cal:157,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"두부+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 두부이 잘 어울려요"},
  {id:1144,nm:"달걀 애호박 고추장국",e:"🍲",ig:["egg", "zucchini", "garlic", "greenonion"],tm:25,cal:128,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"달걀+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 달걀이 잘 어울려요"},
  {id:1145,nm:"달걀 무 고추장국",e:"🍲",ig:["egg", "radish", "garlic", "greenonion"],tm:30,cal:124,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"달걀+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 달걀이 잘 어울려요"},
  {id:1146,nm:"달걀 양배추 고추장국",e:"🍲",ig:["egg", "cabbage", "garlic", "greenonion", "tofu"],tm:15,cal:171,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"달걀+양배추 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 달걀이 잘 어울려요"},
  {id:1147,nm:"어묵 고구마 고추장국",e:"🍲",ig:["fishcake", "sweetpotato", "garlic", "greenonion"],tm:15,cal:145,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"어묵+고구마 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 어묵이 잘 어울려요"},
  {id:1148,nm:"어묵 양배추 고추장국",e:"🍲",ig:["fishcake", "cabbage", "garlic", "greenonion"],tm:20,cal:123,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"어묵+양배추 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 어묵이 잘 어울려요"},
  {id:1149,nm:"어묵 김치 고추장국",e:"🍲",ig:["fishcake", "kimchi", "garlic", "greenonion"],tm:25,cal:149,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🌶️",t:"고추장+고춧가루 넣기"},{i:"🔪",t:"어묵+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 고추장 베이스에 어묵이 잘 어울려요"},
  {id:1150,nm:"삼겹살 감자 맑은국",e:"🍲",ig:["pork_belly", "potato", "garlic", "greenonion"],tm:25,cal:210,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"삼겹살+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 삼겹살이 잘 어울려요"},
  {id:1151,nm:"삼겹살 김치 맑은국",e:"🍲",ig:["pork_belly", "kimchi", "garlic", "greenonion", "tofu"],tm:20,cal:174,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"삼겹살+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 삼겹살이 잘 어울려요"},
  {id:1152,nm:"삼겹살 버섯 맑은국",e:"🍲",ig:["pork_belly", "mushroom", "garlic", "greenonion", "tofu"],tm:15,cal:143,pro:16,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"삼겹살+버섯 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 삼겹살이 잘 어울려요"},
  {id:1153,nm:"목살 김치 맑은국",e:"🍲",ig:["pork_neck", "kimchi", "garlic", "greenonion"],tm:25,cal:122,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"목살+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 목살이 잘 어울려요"},
  {id:1154,nm:"목살 애호박 맑은국",e:"🍲",ig:["pork_neck", "zucchini", "garlic", "greenonion"],tm:30,cal:171,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"목살+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 목살이 잘 어울려요"},
  {id:1155,nm:"목살 시금치 맑은국",e:"🍲",ig:["pork_neck", "spinach", "garlic", "greenonion"],tm:20,cal:230,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"목살+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 목살이 잘 어울려요"},
  {id:1156,nm:"소고기 무 맑은국",e:"🍲",ig:["beef_soup", "radish", "garlic", "greenonion"],tm:20,cal:211,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"소고기+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 소고기이 잘 어울려요"},
  {id:1157,nm:"소고기 버섯 맑은국",e:"🍲",ig:["beef_soup", "mushroom", "garlic", "greenonion", "tofu"],tm:25,cal:198,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"소고기+버섯 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 소고기이 잘 어울려요"},
  {id:1158,nm:"소고기 콩나물 맑은국",e:"🍲",ig:["beef_soup", "bean_sprout", "garlic", "greenonion", "tofu"],tm:15,cal:179,pro:20,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"소고기+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 소고기이 잘 어울려요"},
  {id:1159,nm:"다짐육 버섯 맑은국",e:"🍲",ig:["ground_pork", "mushroom", "garlic", "greenonion"],tm:15,cal:213,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"다짐육+버섯 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 다짐육이 잘 어울려요"},
  {id:1160,nm:"다짐육 고구마 맑은국",e:"🍲",ig:["ground_pork", "sweetpotato", "garlic", "greenonion"],tm:20,cal:123,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"다짐육+고구마 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 다짐육이 잘 어울려요"},
  {id:1161,nm:"다짐육 시금치 맑은국",e:"🍲",ig:["ground_pork", "spinach", "garlic", "greenonion"],tm:30,cal:130,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"다짐육+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 다짐육이 잘 어울려요"},
  {id:1162,nm:"참치 콩나물 맑은국",e:"🍲",ig:["tuna_can", "bean_sprout", "garlic", "greenonion", "tofu"],tm:25,cal:223,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"참치+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 참치이 잘 어울려요"},
  {id:1163,nm:"참치 시금치 맑은국",e:"🍲",ig:["tuna_can", "spinach", "garlic", "greenonion", "tofu"],tm:30,cal:136,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"참치+시금치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 참치이 잘 어울려요"},
  {id:1164,nm:"참치 고구마 맑은국",e:"🍲",ig:["tuna_can", "sweetpotato", "garlic", "greenonion"],tm:25,cal:195,pro:18,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"참치+고구마 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 참치이 잘 어울려요"},
  {id:1165,nm:"스팸 양배추 맑은국",e:"🍲",ig:["spam", "cabbage", "garlic", "greenonion"],tm:25,cal:149,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"스팸+양배추 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 스팸이 잘 어울려요"},
  {id:1166,nm:"스팸 당근 맑은국",e:"🍲",ig:["spam", "carrot", "garlic", "greenonion", "tofu"],tm:25,cal:228,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"스팸+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 스팸이 잘 어울려요"},
  {id:1167,nm:"스팸 김치 맑은국",e:"🍲",ig:["spam", "kimchi", "garlic", "greenonion"],tm:15,cal:219,pro:14,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"스팸+김치 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 스팸이 잘 어울려요"},
  {id:1168,nm:"두부 무 맑은국",e:"🍲",ig:["tofu", "radish", "garlic", "greenonion"],tm:25,cal:222,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"두부+무 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 두부이 잘 어울려요"},
  {id:1169,nm:"두부 고구마 맑은국",e:"🍲",ig:["tofu", "sweetpotato", "garlic", "greenonion"],tm:20,cal:155,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"두부+고구마 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 두부이 잘 어울려요"},
  {id:1170,nm:"두부 콩나물 맑은국",e:"🍲",ig:["tofu", "bean_sprout", "garlic", "greenonion"],tm:20,cal:195,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"두부+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 두부이 잘 어울려요"},
  {id:1171,nm:"달걀 애호박 맑은국",e:"🍲",ig:["egg", "zucchini", "garlic", "greenonion"],tm:30,cal:113,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"달걀+애호박 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 달걀이 잘 어울려요"},
  {id:1172,nm:"달걀 콩나물 맑은국",e:"🍲",ig:["egg", "bean_sprout", "garlic", "greenonion", "tofu"],tm:30,cal:216,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"달걀+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 달걀이 잘 어울려요"},
  {id:1173,nm:"달걀 양배추 맑은국",e:"🍲",ig:["egg", "cabbage", "garlic", "greenonion"],tm:20,cal:155,pro:8,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"달걀+양배추 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 달걀이 잘 어울려요"},
  {id:1174,nm:"어묵 당근 맑은국",e:"🍲",ig:["fishcake", "carrot", "garlic", "greenonion", "tofu"],tm:25,cal:135,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"어묵+당근 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 어묵이 잘 어울려요"},
  {id:1175,nm:"어묵 콩나물 맑은국",e:"🍲",ig:["fishcake", "bean_sprout", "garlic", "greenonion", "tofu"],tm:25,cal:123,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"어묵+콩나물 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 어묵이 잘 어울려요"},
  {id:1176,nm:"어묵 감자 맑은국",e:"🍲",ig:["fishcake", "potato", "garlic", "greenonion"],tm:15,cal:201,pro:10,tag:"국/찌개",st:[{i:"💧",t:"물 또는 멸치육수 준비"},{i:"🧂",t:"국간장+소금"},{i:"🔪",t:"어묵+감자 넣고 끓이기"},{i:"🌿",t:"파 올려 완성"}],tp:"💡 간장맑은 베이스에 어묵이 잘 어울려요"},
  {id:1178,nm:"당근나물",e:"🥕",ig:["carrot", "garlic", "greenonion"],tm:20,cal:32,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"당근 손질하기"},{i:"🥗",t:"데쳐서 참기름+국간장+깨 무침"}],tp:"💡 당근나물은 밑반찬의 기본!"},
  {id:1179,nm:"애호박나물",e:"🥒",ig:["zucchini", "garlic", "greenonion"],tm:15,cal:55,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"애호박 손질하기"},{i:"🥗",t:"데쳐서 참기름+국간장+깨 무침"}],tp:"💡 애호박나물은 밑반찬의 기본!"},
  {id:1180,nm:"버섯나물",e:"🍄",ig:["mushroom", "garlic", "greenonion"],tm:20,cal:60,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"버섯 손질하기"},{i:"🥗",t:"데쳐서 참기름+국간장+깨 무침"}],tp:"💡 버섯나물은 밑반찬의 기본!"},
  {id:1181,nm:"콩나물나물",e:"🌱",ig:["bean_sprout", "garlic", "greenonion"],tm:20,cal:43,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"콩나물 손질하기"},{i:"🥗",t:"데쳐서 참기름+국간장+깨 무침"}],tp:"💡 콩나물나물은 밑반찬의 기본!"},
  {id:1183,nm:"양배추나물",e:"🥗",ig:["cabbage", "garlic", "greenonion"],tm:25,cal:48,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양배추 손질하기"},{i:"🥗",t:"데쳐서 참기름+국간장+깨 무침"}],tp:"💡 양배추나물은 밑반찬의 기본!"},
  {id:1184,nm:"깻잎나물",e:"🌿",ig:["sesame_leaf", "garlic", "greenonion"],tm:25,cal:37,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"깻잎 손질하기"},{i:"🥗",t:"데쳐서 참기름+국간장+깨 무침"}],tp:"💡 깻잎나물은 밑반찬의 기본!"},
  {id:1185,nm:"무볶음",e:"🥬",ig:["radish", "garlic", "greenonion"],tm:10,cal:77,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"무 손질하기"},{i:"🔥",t:"참기름에 센불 볶기"}],tp:"💡 무볶음은 밑반찬의 기본!"},
  {id:1188,nm:"애호박볶음",e:"🥒",ig:["zucchini", "garlic", "greenonion"],tm:15,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"애호박 손질하기"},{i:"🔥",t:"참기름에 센불 볶기"}],tp:"💡 애호박볶음은 밑반찬의 기본!"},
  {id:1190,nm:"콩나물볶음",e:"🌱",ig:["bean_sprout", "garlic", "greenonion"],tm:20,cal:71,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"콩나물 손질하기"},{i:"🔥",t:"참기름에 센불 볶기"}],tp:"💡 콩나물볶음은 밑반찬의 기본!"},
  {id:1191,nm:"시금치볶음",e:"🥬",ig:["spinach", "garlic", "greenonion"],tm:20,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"시금치 손질하기"},{i:"🔥",t:"참기름에 센불 볶기"}],tp:"💡 시금치볶음은 밑반찬의 기본!"},
  {id:1194,nm:"고구마볶음",e:"🍠",ig:["sweetpotato", "garlic", "greenonion"],tm:25,cal:95,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"고구마 손질하기"},{i:"🔥",t:"참기름에 센불 볶기"}],tp:"💡 고구마볶음은 밑반찬의 기본!"},
  {id:1195,nm:"고추볶음",e:"🌶️",ig:["pepper", "garlic", "greenonion"],tm:20,cal:77,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"고추 손질하기"},{i:"🔥",t:"참기름에 센불 볶기"}],tp:"💡 고추볶음은 밑반찬의 기본!"},
  {id:1196,nm:"깻잎볶음",e:"🌿",ig:["sesame_leaf", "garlic", "greenonion"],tm:25,cal:82,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"깻잎 손질하기"},{i:"🔥",t:"참기름에 센불 볶기"}],tp:"💡 깻잎볶음은 밑반찬의 기본!"},
  {id:1199,nm:"당근조림",e:"🥕",ig:["carrot", "garlic", "greenonion"],tm:10,cal:108,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"당근 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 당근조림은 밑반찬의 기본!"},
  {id:1200,nm:"애호박조림",e:"🥒",ig:["zucchini", "garlic", "greenonion"],tm:15,cal:102,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"애호박 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 애호박조림은 밑반찬의 기본!"},
  {id:1201,nm:"버섯조림",e:"🍄",ig:["mushroom", "garlic", "greenonion"],tm:25,cal:107,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"버섯 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 버섯조림은 밑반찬의 기본!"},
  {id:1202,nm:"콩나물조림",e:"🌱",ig:["bean_sprout", "garlic", "greenonion"],tm:25,cal:115,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"콩나물 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 콩나물조림은 밑반찬의 기본!"},
  {id:1203,nm:"시금치조림",e:"🥬",ig:["spinach", "garlic", "greenonion"],tm:10,cal:128,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"시금치 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 시금치조림은 밑반찬의 기본!"},
  {id:1204,nm:"양배추조림",e:"🥗",ig:["cabbage", "garlic", "greenonion"],tm:25,cal:99,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양배추 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 양배추조림은 밑반찬의 기본!"},
  {id:1205,nm:"양파조림",e:"🧅",ig:["onion", "garlic", "greenonion"],tm:10,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양파 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 양파조림은 밑반찬의 기본!"},
  {id:1207,nm:"고추조림",e:"🌶️",ig:["pepper", "garlic", "greenonion"],tm:10,cal:129,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"고추 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 고추조림은 밑반찬의 기본!"},
  {id:1208,nm:"깻잎조림",e:"🌿",ig:["sesame_leaf", "garlic", "greenonion"],tm:10,cal:123,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"깻잎 손질하기"},{i:"🍲",t:"간장+설탕+물 조리기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 깻잎조림은 밑반찬의 기본!"},
  {id:1209,nm:"무전",e:"🥬",ig:["radish", "garlic", "greenonion", "egg"],tm:10,cal:150,pro:11,tag:"밑반찬",st:[{i:"🔪",t:"무 손질하기"},{i:"🍳",t:"밀가루+달걀물 입혀 굽기"}],tp:"💡 무전은 밑반찬의 기본!"},
  {id:1211,nm:"당근전",e:"🥕",ig:["carrot", "garlic", "greenonion", "egg"],tm:25,cal:163,pro:11,tag:"밑반찬",st:[{i:"🔪",t:"당근 손질하기"},{i:"🍳",t:"밀가루+달걀물 입혀 굽기"}],tp:"💡 당근전은 밑반찬의 기본!"},
  {id:1214,nm:"양배추전",e:"🥗",ig:["cabbage", "garlic", "greenonion", "egg"],tm:15,cal:172,pro:11,tag:"밑반찬",st:[{i:"🔪",t:"양배추 손질하기"},{i:"🍳",t:"밀가루+달걀물 입혀 굽기"}],tp:"💡 양배추전은 밑반찬의 기본!"},
  {id:1215,nm:"고구마전",e:"🍠",ig:["sweetpotato", "garlic", "greenonion", "egg"],tm:10,cal:161,pro:11,tag:"밑반찬",st:[{i:"🔪",t:"고구마 손질하기"},{i:"🍳",t:"밀가루+달걀물 입혀 굽기"}],tp:"💡 고구마전은 밑반찬의 기본!"},
  {id:1216,nm:"고추전",e:"🌶️",ig:["pepper", "garlic", "greenonion", "egg"],tm:20,cal:171,pro:11,tag:"밑반찬",st:[{i:"🔪",t:"고추 손질하기"},{i:"🍳",t:"밀가루+달걀물 입혀 굽기"}],tp:"💡 고추전은 밑반찬의 기본!"},
  {id:1217,nm:"무무침",e:"🥬",ig:["radish", "garlic", "greenonion"],tm:20,cal:52,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"무 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 무무침은 밑반찬의 기본!"},
  {id:1218,nm:"감자무침",e:"🥔",ig:["potato", "garlic", "greenonion"],tm:20,cal:72,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"감자 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 감자무침은 밑반찬의 기본!"},
  {id:1219,nm:"당근무침",e:"🥕",ig:["carrot", "garlic", "greenonion"],tm:10,cal:77,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"당근 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 당근무침은 밑반찬의 기본!"},
  {id:1220,nm:"애호박무침",e:"🥒",ig:["zucchini", "garlic", "greenonion"],tm:25,cal:74,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"애호박 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 애호박무침은 밑반찬의 기본!"},
  {id:1221,nm:"버섯무침",e:"🍄",ig:["mushroom", "garlic", "greenonion"],tm:15,cal:44,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"버섯 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 버섯무침은 밑반찬의 기본!"},
  {id:1223,nm:"시금치무침",e:"🥬",ig:["spinach", "garlic", "greenonion"],tm:10,cal:76,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"시금치 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 시금치무침은 밑반찬의 기본!"},
  {id:1224,nm:"양배추무침",e:"🥗",ig:["cabbage", "garlic", "greenonion"],tm:25,cal:80,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 양배추무침은 밑반찬의 기본!"},
  {id:1225,nm:"양파무침",e:"🧅",ig:["onion", "garlic", "greenonion"],tm:20,cal:41,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양파 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 양파무침은 밑반찬의 기본!"},
  {id:1226,nm:"고구마무침",e:"🍠",ig:["sweetpotato", "garlic", "greenonion"],tm:10,cal:66,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고구마 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 고구마무침은 밑반찬의 기본!"},
  {id:1227,nm:"고추무침",e:"🌶️",ig:["pepper", "garlic", "greenonion"],tm:10,cal:53,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고추 손질하기"},{i:"🥗",t:"고춧가루+식초+설탕 버무리기"}],tp:"💡 고추무침은 밑반찬의 기본!"},
  {id:1229,nm:"무장아찌",e:"🥬",ig:["radish", "garlic", "greenonion"],tm:25,cal:31,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"무 손질하기"},{i:"🧅",t:"간장+식초+설탕 끓여 붓기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 무장아찌은 밑반찬의 기본!"},
  {id:1230,nm:"당근장아찌",e:"🥕",ig:["carrot", "garlic", "greenonion"],tm:15,cal:32,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"당근 손질하기"},{i:"🧅",t:"간장+식초+설탕 끓여 붓기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 당근장아찌은 밑반찬의 기본!"},
  {id:1231,nm:"애호박장아찌",e:"🥒",ig:["zucchini", "garlic", "greenonion"],tm:25,cal:59,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"애호박 손질하기"},{i:"🧅",t:"간장+식초+설탕 끓여 붓기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 애호박장아찌은 밑반찬의 기본!"},
  {id:1232,nm:"양배추장아찌",e:"🥗",ig:["cabbage", "garlic", "greenonion"],tm:15,cal:33,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추 손질하기"},{i:"🧅",t:"간장+식초+설탕 끓여 붓기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 양배추장아찌은 밑반찬의 기본!"},
  {id:1234,nm:"고추장아찌",e:"🌶️",ig:["pepper", "garlic", "greenonion"],tm:10,cal:32,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고추 손질하기"},{i:"🧅",t:"간장+식초+설탕 끓여 붓기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 고추장아찌은 밑반찬의 기본!"},
  {id:1235,nm:"깻잎장아찌",e:"🌿",ig:["sesame_leaf", "garlic", "greenonion"],tm:15,cal:69,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"깻잎 손질하기"},{i:"🧅",t:"간장+식초+설탕 끓여 붓기"},{i:"⏱️",t:"중불에서 조리기"}],tp:"💡 깻잎장아찌은 밑반찬의 기본!"},
  {id:1236,nm:"삼겹 콩나물 비빔국수",e:"🍜",ig:["noodle", "pork_belly", "bean_sprout", "egg", "garlic", "greenonion"],tm:25,cal:407,pro:14,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"삼겹+콩나물 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 삼겹+콩나물의 비빔 조합!"},
  {id:1237,nm:"목살 양배추 비빔국수",e:"🍜",ig:["noodle", "pork_neck", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:395,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"목살+양배추 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 목살+양배추의 비빔 조합!"},
  {id:1238,nm:"닭가슴살 김치 비빔국수",e:"🍜",ig:["noodle", "chicken_breast", "kimchi", "egg", "garlic", "greenonion"],tm:20,cal:367,pro:24,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+김치 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 닭가슴살+김치의 비빔 조합!"},
  {id:1239,nm:"닭가슴살 콩나물 비빔국수",e:"🍜",ig:["noodle", "chicken_breast", "bean_sprout", "egg", "garlic", "greenonion"],tm:20,cal:386,pro:24,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+콩나물 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 닭가슴살+콩나물의 비빔 조합!"},
  {id:1240,nm:"참치 김치 비빔국수",e:"🍜",ig:["noodle", "tuna_can", "kimchi", "egg", "garlic", "greenonion"],tm:15,cal:378,pro:18,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"참치+김치 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 참치+김치의 비빔 조합!"},
  {id:1241,nm:"어묵 버섯 비빔국수",e:"🍜",ig:["noodle", "fishcake", "mushroom", "egg", "garlic", "greenonion"],tm:25,cal:424,pro:10,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+버섯 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 어묵+버섯의 비빔 조합!"},
  {id:1242,nm:"어묵 콩나물 비빔국수",e:"🍜",ig:["noodle", "fishcake", "bean_sprout", "egg", "garlic", "greenonion"],tm:15,cal:381,pro:10,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+콩나물 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 어묵+콩나물의 비빔 조합!"},
  {id:1243,nm:"스팸 김치 비빔국수",e:"🍜",ig:["noodle", "spam", "kimchi", "egg", "garlic", "greenonion"],tm:15,cal:446,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"스팸+김치 볶기"},{i:"🥄",t:"고추장+식초+설탕+참기름 양념"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 스팸+김치의 비빔 조합!"},
  {id:1244,nm:"삼겹 버섯 국수국수",e:"🍜",ig:["noodle", "pork_belly", "mushroom", "egg", "garlic", "greenonion"],tm:15,cal:388,pro:14,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"삼겹+버섯 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 삼겹+버섯의 국수 조합!"},
  {id:1245,nm:"목살 버섯 국수국수",e:"🍜",ig:["noodle", "pork_neck", "mushroom", "egg", "garlic", "greenonion"],tm:20,cal:328,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"목살+버섯 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 목살+버섯의 국수 조합!"},
  {id:1246,nm:"닭가슴살 양배추 국수국수",e:"🍜",ig:["noodle", "chicken_breast", "cabbage", "egg", "garlic", "greenonion"],tm:25,cal:404,pro:24,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+양배추 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 닭가슴살+양배추의 국수 조합!"},
  {id:1247,nm:"닭가슴살 버섯 국수국수",e:"🍜",ig:["noodle", "chicken_breast", "mushroom", "egg", "garlic", "greenonion"],tm:20,cal:320,pro:24,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+버섯 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 닭가슴살+버섯의 국수 조합!"},
  {id:1248,nm:"참치 양배추 국수국수",e:"🍜",ig:["noodle", "tuna_can", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:367,pro:18,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"참치+양배추 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 참치+양배추의 국수 조합!"},
  {id:1249,nm:"참치 콩나물 국수국수",e:"🍜",ig:["noodle", "tuna_can", "bean_sprout", "egg", "garlic", "greenonion"],tm:15,cal:416,pro:18,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"참치+콩나물 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 참치+콩나물의 국수 조합!"},
  {id:1250,nm:"어묵 양배추 국수국수",e:"🍜",ig:["noodle", "fishcake", "cabbage", "egg", "garlic", "greenonion"],tm:25,cal:416,pro:10,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+양배추 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 어묵+양배추의 국수 조합!"},
  {id:1251,nm:"어묵 콩나물 국수국수",e:"🍜",ig:["noodle", "fishcake", "bean_sprout", "egg", "garlic", "greenonion"],tm:25,cal:411,pro:10,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+콩나물 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 어묵+콩나물의 국수 조합!"},
  {id:1252,nm:"스팸 양배추 국수국수",e:"🍜",ig:["noodle", "spam", "cabbage", "egg", "garlic", "greenonion"],tm:25,cal:411,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"스팸+양배추 볶기"},{i:"🥄",t:"멸치 육수에 넣기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 스팸+양배추의 국수 조합!"},
  {id:1253,nm:"삼겹 김치 볶음면",e:"🍜",ig:["ramen", "pork_belly", "kimchi", "egg", "garlic", "greenonion"],tm:25,cal:409,pro:14,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"삼겹+김치 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 삼겹+김치의 볶음 조합!"},
  {id:1254,nm:"삼겹 콩나물 볶음면",e:"🍜",ig:["ramen", "pork_belly", "bean_sprout", "egg", "garlic", "greenonion"],tm:15,cal:451,pro:14,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"삼겹+콩나물 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 삼겹+콩나물의 볶음 조합!"},
  {id:1255,nm:"목살 김치 볶음면",e:"🍜",ig:["ramen", "pork_neck", "kimchi", "egg", "garlic", "greenonion"],tm:15,cal:487,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"목살+김치 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 목살+김치의 볶음 조합!"},
  {id:1256,nm:"목살 콩나물 볶음면",e:"🍜",ig:["ramen", "pork_neck", "bean_sprout", "egg", "garlic", "greenonion"],tm:25,cal:411,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"목살+콩나물 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 목살+콩나물의 볶음 조합!"},
  {id:1257,nm:"닭가슴살 콩나물 볶음면",e:"🍜",ig:["ramen", "chicken_breast", "bean_sprout", "egg", "garlic", "greenonion"],tm:20,cal:426,pro:24,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"닭가슴살+콩나물 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 닭가슴살+콩나물의 볶음 조합!"},
  {id:1258,nm:"참치 양배추 볶음면",e:"🍜",ig:["ramen", "tuna_can", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:434,pro:18,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+양배추 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 참치+양배추의 볶음 조합!"},
  {id:1259,nm:"참치 콩나물 볶음면",e:"🍜",ig:["ramen", "tuna_can", "bean_sprout", "egg", "garlic", "greenonion"],tm:15,cal:473,pro:18,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+콩나물 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 참치+콩나물의 볶음 조합!"},
  {id:1260,nm:"어묵 김치 볶음면",e:"🍜",ig:["ramen", "fishcake", "kimchi", "egg", "garlic", "greenonion"],tm:25,cal:442,pro:10,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"어묵+김치 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 어묵+김치의 볶음 조합!"},
  {id:1261,nm:"스팸 김치 볶음면",e:"🍜",ig:["ramen", "spam", "kimchi", "egg", "garlic", "greenonion"],tm:15,cal:454,pro:12,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"스팸+김치 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 스팸+김치의 볶음 조합!"},
  {id:1262,nm:"스팸 양배추 볶음면",e:"🍜",ig:["ramen", "spam", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:406,pro:12,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"스팸+양배추 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 스팸+양배추의 볶음 조합!"},
  {id:1263,nm:"스팸 버섯 볶음면",e:"🍜",ig:["ramen", "spam", "mushroom", "egg", "garlic", "greenonion"],tm:15,cal:428,pro:12,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"스팸+버섯 볶기"},{i:"🥄",t:"수프 반봉지+고추장 볶기"},{i:"🥚",t:"달걀 올리기"}],tp:"💡 스팸+버섯의 볶음 조합!"},
  {id:1264,nm:"삼겹 양배추 떡볶이",e:"🍡",ig:["ricecake", "pork_belly", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:443,pro:14,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+삼겹+양배추 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 삼겹이 들어간 떡볶이!"},
  {id:1265,nm:"삼겹 양파 떡볶이",e:"🍡",ig:["ricecake", "pork_belly", "onion", "garlic", "greenonion", "egg"],tm:20,cal:433,pro:14,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+삼겹+양파 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 삼겹이 들어간 떡볶이!"},
  {id:1266,nm:"삼겹 김치 떡볶이",e:"🍡",ig:["ricecake", "pork_belly", "kimchi", "garlic", "greenonion", "egg"],tm:20,cal:428,pro:14,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+삼겹+김치 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 삼겹이 들어간 떡볶이!"},
  {id:1267,nm:"스팸 양배추 떡볶이",e:"🍡",ig:["ricecake", "spam", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:466,pro:12,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+스팸+양배추 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 스팸이 들어간 떡볶이!"},
  {id:1268,nm:"스팸 양파 떡볶이",e:"🍡",ig:["ricecake", "spam", "onion", "garlic", "greenonion", "egg"],tm:20,cal:430,pro:12,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+스팸+양파 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 스팸이 들어간 떡볶이!"},
  {id:1269,nm:"스팸 김치 떡볶이",e:"🍡",ig:["ricecake", "spam", "kimchi", "garlic", "greenonion", "egg"],tm:20,cal:426,pro:12,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+스팸+김치 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 스팸이 들어간 떡볶이!"},
  {id:1270,nm:"어묵 양배추 떡볶이",e:"🍡",ig:["ricecake", "fishcake", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:428,pro:10,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+어묵+양배추 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 어묵이 들어간 떡볶이!"},
  {id:1271,nm:"어묵 양파 떡볶이",e:"🍡",ig:["ricecake", "fishcake", "onion", "garlic", "greenonion", "egg"],tm:20,cal:429,pro:10,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+어묵+양파 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 어묵이 들어간 떡볶이!"},
  {id:1272,nm:"어묵 김치 떡볶이",e:"🍡",ig:["ricecake", "fishcake", "kimchi", "garlic", "greenonion", "egg"],tm:20,cal:480,pro:10,tag:"메인",st:[{i:"💧",t:"물+고추장+고춧가루+설탕+간장"},{i:"🍡",t:"떡+어묵+김치 넣기"},{i:"⏱️",t:"떡 말랑해질때까지"},{i:"🥚",t:"삶은달걀 곁들이기"}],tp:"💡 어묵이 들어간 떡볶이!"},
  {id:1273,nm:"김치양파 볶음밥",e:"🍳",ig:["kimchi", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:383,pro:10,tag:"메인",st:[{i:"🔪",t:"김치+양파 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 김치+양파의 건강 볶음밥"},
  {id:1274,nm:"김치버섯 볶음밥",e:"🍳",ig:["kimchi", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:351,pro:10,tag:"메인",st:[{i:"🔪",t:"김치+버섯 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 김치+버섯의 건강 볶음밥"},
  {id:1275,nm:"김치시금치 볶음밥",e:"🍳",ig:["kimchi", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:327,pro:10,tag:"메인",st:[{i:"🔪",t:"김치+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 김치+시금치의 건강 볶음밥"},
  {id:1276,nm:"김치애호박 볶음밥",e:"🍳",ig:["kimchi", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:335,pro:10,tag:"메인",st:[{i:"🔪",t:"김치+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 김치+애호박의 건강 볶음밥"},
  {id:1277,nm:"김치고추 볶음밥",e:"🍳",ig:["kimchi", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:322,pro:10,tag:"메인",st:[{i:"🔪",t:"김치+고추 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 김치+고추의 건강 볶음밥"},
  {id:1278,nm:"김치감자 볶음밥",e:"🍳",ig:["kimchi", "potato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:376,pro:10,tag:"메인",st:[{i:"🔪",t:"김치+감자 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 김치+감자의 건강 볶음밥"},
  {id:1279,nm:"김치고구마 볶음밥",e:"🍳",ig:["kimchi", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:337,pro:10,tag:"메인",st:[{i:"🔪",t:"김치+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 김치+고구마의 건강 볶음밥"},
  {id:1280,nm:"양파시금치 볶음밥",e:"🍳",ig:["onion", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:326,pro:10,tag:"메인",st:[{i:"🔪",t:"양파+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양파+시금치의 건강 볶음밥"},
  {id:1281,nm:"양파애호박 볶음밥",e:"🍳",ig:["onion", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:359,pro:10,tag:"메인",st:[{i:"🔪",t:"양파+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양파+애호박의 건강 볶음밥"},
  {id:1282,nm:"양파고추 볶음밥",e:"🍳",ig:["onion", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:369,pro:10,tag:"메인",st:[{i:"🔪",t:"양파+고추 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양파+고추의 건강 볶음밥"},
  {id:1283,nm:"양파감자 볶음밥",e:"🍳",ig:["onion", "potato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:378,pro:10,tag:"메인",st:[{i:"🔪",t:"양파+감자 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양파+감자의 건강 볶음밥"},
  {id:1284,nm:"양파고구마 볶음밥",e:"🍳",ig:["onion", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:360,pro:10,tag:"메인",st:[{i:"🔪",t:"양파+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양파+고구마의 건강 볶음밥"},
  {id:1285,nm:"당근김치 볶음밥",e:"🍳",ig:["carrot", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:400,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+김치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+김치의 건강 볶음밥"},
  {id:1286,nm:"당근양파 볶음밥",e:"🍳",ig:["carrot", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:374,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+양파 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+양파의 건강 볶음밥"},
  {id:1287,nm:"당근버섯 볶음밥",e:"🍳",ig:["carrot", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:349,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+버섯 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+버섯의 건강 볶음밥"},
  {id:1288,nm:"당근시금치 볶음밥",e:"🍳",ig:["carrot", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:389,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+시금치의 건강 볶음밥"},
  {id:1289,nm:"당근애호박 볶음밥",e:"🍳",ig:["carrot", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:378,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+애호박의 건강 볶음밥"},
  {id:1290,nm:"당근고추 볶음밥",e:"🍳",ig:["carrot", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:356,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+고추 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+고추의 건강 볶음밥"},
  {id:1291,nm:"당근감자 볶음밥",e:"🍳",ig:["carrot", "potato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:345,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+감자 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+감자의 건강 볶음밥"},
  {id:1292,nm:"당근고구마 볶음밥",e:"🍳",ig:["carrot", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:355,pro:10,tag:"메인",st:[{i:"🔪",t:"당근+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 당근+고구마의 건강 볶음밥"},
  {id:1293,nm:"양배추김치 볶음밥",e:"🍳",ig:["cabbage", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:362,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+김치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+김치의 건강 볶음밥"},
  {id:1294,nm:"양배추양파 볶음밥",e:"🍳",ig:["cabbage", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:333,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+양파 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+양파의 건강 볶음밥"},
  {id:1295,nm:"양배추당근 볶음밥",e:"🍳",ig:["cabbage", "carrot", "egg", "rice", "garlic", "greenonion"],tm:15,cal:395,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+당근 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+당근의 건강 볶음밥"},
  {id:1296,nm:"양배추버섯 볶음밥",e:"🍳",ig:["cabbage", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:363,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+버섯 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+버섯의 건강 볶음밥"},
  {id:1297,nm:"양배추시금치 볶음밥",e:"🍳",ig:["cabbage", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:357,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+시금치의 건강 볶음밥"},
  {id:1298,nm:"양배추애호박 볶음밥",e:"🍳",ig:["cabbage", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:400,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+애호박의 건강 볶음밥"},
  {id:1299,nm:"양배추고추 볶음밥",e:"🍳",ig:["cabbage", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:331,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+고추 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+고추의 건강 볶음밥"},
  {id:1300,nm:"양배추감자 볶음밥",e:"🍳",ig:["cabbage", "potato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:328,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+감자 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+감자의 건강 볶음밥"},
  {id:1301,nm:"양배추고구마 볶음밥",e:"🍳",ig:["cabbage", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:349,pro:10,tag:"메인",st:[{i:"🔪",t:"양배추+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추+고구마의 건강 볶음밥"},
  {id:1302,nm:"버섯양파 볶음밥",e:"🍳",ig:["mushroom", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:380,pro:10,tag:"메인",st:[{i:"🔪",t:"버섯+양파 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 버섯+양파의 건강 볶음밥"},
  {id:1303,nm:"버섯시금치 볶음밥",e:"🍳",ig:["mushroom", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:342,pro:10,tag:"메인",st:[{i:"🔪",t:"버섯+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 버섯+시금치의 건강 볶음밥"},
  {id:1304,nm:"버섯애호박 볶음밥",e:"🍳",ig:["mushroom", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:349,pro:10,tag:"메인",st:[{i:"🔪",t:"버섯+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 버섯+애호박의 건강 볶음밥"},
  {id:1305,nm:"버섯고추 볶음밥",e:"🍳",ig:["mushroom", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:326,pro:10,tag:"메인",st:[{i:"🔪",t:"버섯+고추 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 버섯+고추의 건강 볶음밥"},
  {id:1306,nm:"버섯감자 볶음밥",e:"🍳",ig:["mushroom", "potato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:400,pro:10,tag:"메인",st:[{i:"🔪",t:"버섯+감자 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 버섯+감자의 건강 볶음밥"},
  {id:1307,nm:"버섯고구마 볶음밥",e:"🍳",ig:["mushroom", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:381,pro:10,tag:"메인",st:[{i:"🔪",t:"버섯+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 버섯+고구마의 건강 볶음밥"},
  {id:1308,nm:"콩나물김치 볶음밥",e:"🍳",ig:["bean_sprout", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:356,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+김치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+김치의 건강 볶음밥"},
  {id:1309,nm:"콩나물양파 볶음밥",e:"🍳",ig:["bean_sprout", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:347,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+양파 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+양파의 건강 볶음밥"},
  {id:1310,nm:"콩나물당근 볶음밥",e:"🍳",ig:["bean_sprout", "carrot", "egg", "rice", "garlic", "greenonion"],tm:15,cal:368,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+당근 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+당근의 건강 볶음밥"},
  {id:1311,nm:"콩나물양배추 볶음밥",e:"🍳",ig:["bean_sprout", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:391,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+양배추 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+양배추의 건강 볶음밥"},
  {id:1312,nm:"콩나물버섯 볶음밥",e:"🍳",ig:["bean_sprout", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:395,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+버섯 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+버섯의 건강 볶음밥"},
  {id:1313,nm:"콩나물시금치 볶음밥",e:"🍳",ig:["bean_sprout", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:376,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+시금치의 건강 볶음밥"},
  {id:1314,nm:"콩나물애호박 볶음밥",e:"🍳",ig:["bean_sprout", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:332,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+애호박의 건강 볶음밥"},
  {id:1315,nm:"콩나물고추 볶음밥",e:"🍳",ig:["bean_sprout", "pepper", "egg", "rice", "garlic", "greenonion"],tm:15,cal:393,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+고추 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+고추의 건강 볶음밥"},
  {id:1316,nm:"콩나물감자 볶음밥",e:"🍳",ig:["bean_sprout", "potato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:353,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+감자 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+감자의 건강 볶음밥"},
  {id:1317,nm:"콩나물고구마 볶음밥",e:"🍳",ig:["bean_sprout", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:355,pro:10,tag:"메인",st:[{i:"🔪",t:"콩나물+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 콩나물+고구마의 건강 볶음밥"},
  {id:1318,nm:"시금치애호박 볶음밥",e:"🍳",ig:["spinach", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:337,pro:10,tag:"메인",st:[{i:"🔪",t:"시금치+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 시금치+애호박의 건강 볶음밥"},
  {id:1319,nm:"시금치고구마 볶음밥",e:"🍳",ig:["spinach", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:354,pro:10,tag:"메인",st:[{i:"🔪",t:"시금치+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 시금치+고구마의 건강 볶음밥"},
  {id:1320,nm:"고추시금치 볶음밥",e:"🍳",ig:["pepper", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:331,pro:10,tag:"메인",st:[{i:"🔪",t:"고추+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 고추+시금치의 건강 볶음밥"},
  {id:1321,nm:"고추애호박 볶음밥",e:"🍳",ig:["pepper", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:386,pro:10,tag:"메인",st:[{i:"🔪",t:"고추+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 고추+애호박의 건강 볶음밥"},
  {id:1322,nm:"고추감자 볶음밥",e:"🍳",ig:["pepper", "potato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:386,pro:10,tag:"메인",st:[{i:"🔪",t:"고추+감자 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 고추+감자의 건강 볶음밥"},
  {id:1323,nm:"고추고구마 볶음밥",e:"🍳",ig:["pepper", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:385,pro:10,tag:"메인",st:[{i:"🔪",t:"고추+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 고추+고구마의 건강 볶음밥"},
  {id:1324,nm:"감자시금치 볶음밥",e:"🍳",ig:["potato", "spinach", "egg", "rice", "garlic", "greenonion"],tm:15,cal:375,pro:10,tag:"메인",st:[{i:"🔪",t:"감자+시금치 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 감자+시금치의 건강 볶음밥"},
  {id:1325,nm:"감자애호박 볶음밥",e:"🍳",ig:["potato", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:342,pro:10,tag:"메인",st:[{i:"🔪",t:"감자+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 감자+애호박의 건강 볶음밥"},
  {id:1326,nm:"감자고구마 볶음밥",e:"🍳",ig:["potato", "sweetpotato", "egg", "rice", "garlic", "greenonion"],tm:15,cal:354,pro:10,tag:"메인",st:[{i:"🔪",t:"감자+고구마 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 감자+고구마의 건강 볶음밥"},
  {id:1327,nm:"고구마애호박 볶음밥",e:"🍳",ig:["sweetpotato", "zucchini", "egg", "rice", "garlic", "greenonion"],tm:15,cal:384,pro:10,tag:"메인",st:[{i:"🔪",t:"고구마+애호박 다지기"},{i:"🔥",t:"볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 고구마+애호박의 건강 볶음밥"},
  {id:1328,nm:"삼겹살 당근 된장찌개",e:"🍲",ig:["pork_belly", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:253,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 삼겹살+당근"},
  {id:1329,nm:"삼겹살 버섯 된장찌개",e:"🍲",ig:["pork_belly", "mushroom", "tofu", "garlic", "greenonion"],tm:20,cal:165,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 삼겹살+버섯"},
  {id:1330,nm:"삼겹살 콩나물 된장찌개",e:"🍲",ig:["pork_belly", "bean_sprout", "tofu", "garlic", "greenonion"],tm:20,cal:290,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 삼겹살+콩나물"},
  {id:1331,nm:"삼겹살 시금치 된장찌개",e:"🍲",ig:["pork_belly", "spinach", "tofu", "garlic", "greenonion"],tm:20,cal:175,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 삼겹살+시금치"},
  {id:1332,nm:"삼겹살 감자 된장찌개",e:"🍲",ig:["pork_belly", "potato", "tofu", "garlic", "greenonion"],tm:30,cal:225,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 삼겹살+감자"},
  {id:1333,nm:"삼겹살 고구마 된장찌개",e:"🍲",ig:["pork_belly", "sweetpotato", "tofu", "garlic", "greenonion"],tm:30,cal:219,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 삼겹살+고구마"},
  {id:1334,nm:"삼겹살 당근 고추장찌개",e:"🍲",ig:["pork_belly", "carrot", "tofu", "garlic", "greenonion"],tm:30,cal:177,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 삼겹살+당근"},
  {id:1335,nm:"삼겹살 버섯 고추장찌개",e:"🍲",ig:["pork_belly", "mushroom", "tofu", "garlic", "greenonion"],tm:30,cal:254,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 삼겹살+버섯"},
  {id:1336,nm:"삼겹살 콩나물 고추장찌개",e:"🍲",ig:["pork_belly", "bean_sprout", "tofu", "garlic", "greenonion"],tm:30,cal:196,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 삼겹살+콩나물"},
  {id:1337,nm:"삼겹살 시금치 고추장찌개",e:"🍲",ig:["pork_belly", "spinach", "tofu", "garlic", "greenonion"],tm:30,cal:194,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 삼겹살+시금치"},
  {id:1338,nm:"삼겹살 애호박 고추장찌개",e:"🍲",ig:["pork_belly", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:209,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 삼겹살+애호박"},
  {id:1339,nm:"삼겹살 감자 고추장찌개",e:"🍲",ig:["pork_belly", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:237,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 삼겹살+감자"},
  {id:1340,nm:"목살 양파 된장찌개",e:"🍲",ig:["pork_neck", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:254,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 목살+양파"},
  {id:1341,nm:"목살 당근 된장찌개",e:"🍲",ig:["pork_neck", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:159,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 목살+당근"},
  {id:1342,nm:"목살 시금치 된장찌개",e:"🍲",ig:["pork_neck", "spinach", "tofu", "garlic", "greenonion"],tm:30,cal:159,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 목살+시금치"},
  {id:1343,nm:"목살 고추 된장찌개",e:"🍲",ig:["pork_neck", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:244,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 목살+고추"},
  {id:1344,nm:"목살 고구마 된장찌개",e:"🍲",ig:["pork_neck", "sweetpotato", "tofu", "garlic", "greenonion"],tm:20,cal:185,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 목살+고구마"},
  {id:1345,nm:"목살 당근 고추장찌개",e:"🍲",ig:["pork_neck", "carrot", "tofu", "garlic", "greenonion"],tm:20,cal:196,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 목살+당근"},
  {id:1346,nm:"목살 버섯 고추장찌개",e:"🍲",ig:["pork_neck", "mushroom", "tofu", "garlic", "greenonion"],tm:20,cal:293,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 목살+버섯"},
  {id:1347,nm:"목살 콩나물 고추장찌개",e:"🍲",ig:["pork_neck", "bean_sprout", "tofu", "garlic", "greenonion"],tm:30,cal:218,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 목살+콩나물"},
  {id:1348,nm:"목살 애호박 고추장찌개",e:"🍲",ig:["pork_neck", "zucchini", "tofu", "garlic", "greenonion"],tm:20,cal:226,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 목살+애호박"},
  {id:1349,nm:"목살 고추 고추장찌개",e:"🍲",ig:["pork_neck", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:280,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 목살+고추"},
  {id:1350,nm:"목살 감자 고추장찌개",e:"🍲",ig:["pork_neck", "potato", "tofu", "garlic", "greenonion"],tm:20,cal:290,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 목살+감자"},
  {id:1351,nm:"목살 고구마 고추장찌개",e:"🍲",ig:["pork_neck", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:234,pro:18,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 목살+고구마"},
  {id:1352,nm:"닭가슴살 양파 된장찌개",e:"🍲",ig:["chicken_breast", "onion", "tofu", "garlic", "greenonion"],tm:30,cal:245,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 닭가슴살+양파"},
  {id:1353,nm:"닭가슴살 버섯 된장찌개",e:"🍲",ig:["chicken_breast", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:286,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 닭가슴살+버섯"},
  {id:1354,nm:"닭가슴살 콩나물 된장찌개",e:"🍲",ig:["chicken_breast", "bean_sprout", "tofu", "garlic", "greenonion"],tm:30,cal:268,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 닭가슴살+콩나물"},
  {id:1355,nm:"닭가슴살 애호박 된장찌개",e:"🍲",ig:["chicken_breast", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:249,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 닭가슴살+애호박"},
  {id:1356,nm:"닭가슴살 고구마 된장찌개",e:"🍲",ig:["chicken_breast", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:270,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 닭가슴살+고구마"},
  {id:1357,nm:"닭가슴살 양파 고추장찌개",e:"🍲",ig:["chicken_breast", "onion", "tofu", "garlic", "greenonion"],tm:30,cal:265,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 닭가슴살+양파"},
  {id:1358,nm:"닭가슴살 당근 고추장찌개",e:"🍲",ig:["chicken_breast", "carrot", "tofu", "garlic", "greenonion"],tm:30,cal:215,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 닭가슴살+당근"},
  {id:1359,nm:"닭가슴살 양배추 고추장찌개",e:"🍲",ig:["chicken_breast", "cabbage", "tofu", "garlic", "greenonion"],tm:30,cal:194,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 닭가슴살+양배추"},
  {id:1360,nm:"닭가슴살 애호박 고추장찌개",e:"🍲",ig:["chicken_breast", "zucchini", "tofu", "garlic", "greenonion"],tm:20,cal:154,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 닭가슴살+애호박"},
  {id:1361,nm:"닭가슴살 고추 고추장찌개",e:"🍲",ig:["chicken_breast", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:183,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 닭가슴살+고추"},
  {id:1362,nm:"닭가슴살 감자 고추장찌개",e:"🍲",ig:["chicken_breast", "potato", "tofu", "garlic", "greenonion"],tm:30,cal:264,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 닭가슴살+감자"},
  {id:1363,nm:"닭가슴살 고구마 고추장찌개",e:"🍲",ig:["chicken_breast", "sweetpotato", "tofu", "garlic", "greenonion"],tm:30,cal:269,pro:28,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 닭가슴살+고구마"},
  {id:1364,nm:"소고기 양파 된장찌개",e:"🍲",ig:["beef_soup", "onion", "tofu", "garlic", "greenonion"],tm:30,cal:221,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 소고기+양파"},
  {id:1365,nm:"소고기 당근 된장찌개",e:"🍲",ig:["beef_soup", "carrot", "tofu", "garlic", "greenonion"],tm:30,cal:214,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 소고기+당근"},
  {id:1366,nm:"소고기 애호박 된장찌개",e:"🍲",ig:["beef_soup", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:228,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 소고기+애호박"},
  {id:1367,nm:"소고기 고추 된장찌개",e:"🍲",ig:["beef_soup", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:247,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 소고기+고추"},
  {id:1368,nm:"소고기 고구마 된장찌개",e:"🍲",ig:["beef_soup", "sweetpotato", "tofu", "garlic", "greenonion"],tm:30,cal:178,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 소고기+고구마"},
  {id:1369,nm:"소고기 당근 고추장찌개",e:"🍲",ig:["beef_soup", "carrot", "tofu", "garlic", "greenonion"],tm:20,cal:238,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 소고기+당근"},
  {id:1370,nm:"소고기 양배추 고추장찌개",e:"🍲",ig:["beef_soup", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:205,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 소고기+양배추"},
  {id:1371,nm:"소고기 버섯 고추장찌개",e:"🍲",ig:["beef_soup", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:287,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 소고기+버섯"},
  {id:1372,nm:"소고기 고추 고추장찌개",e:"🍲",ig:["beef_soup", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:251,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 소고기+고추"},
  {id:1373,nm:"소고기 고구마 고추장찌개",e:"🍲",ig:["beef_soup", "sweetpotato", "tofu", "garlic", "greenonion"],tm:20,cal:215,pro:22,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 소고기+고구마"},
  {id:1374,nm:"다짐육 양배추 된장찌개",e:"🍲",ig:["ground_pork", "cabbage", "tofu", "garlic", "greenonion"],tm:30,cal:291,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 다짐육+양배추"},
  {id:1375,nm:"다짐육 버섯 된장찌개",e:"🍲",ig:["ground_pork", "mushroom", "tofu", "garlic", "greenonion"],tm:20,cal:213,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 다짐육+버섯"},
  {id:1376,nm:"다짐육 애호박 된장찌개",e:"🍲",ig:["ground_pork", "zucchini", "tofu", "garlic", "greenonion"],tm:20,cal:193,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 다짐육+애호박"},
  {id:1377,nm:"다짐육 고구마 된장찌개",e:"🍲",ig:["ground_pork", "sweetpotato", "tofu", "garlic", "greenonion"],tm:20,cal:166,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 다짐육+고구마"},
  {id:1378,nm:"다짐육 양파 고추장찌개",e:"🍲",ig:["ground_pork", "onion", "tofu", "garlic", "greenonion"],tm:30,cal:236,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 다짐육+양파"},
  {id:1379,nm:"다짐육 당근 고추장찌개",e:"🍲",ig:["ground_pork", "carrot", "tofu", "garlic", "greenonion"],tm:30,cal:215,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 다짐육+당근"},
  {id:1380,nm:"다짐육 양배추 고추장찌개",e:"🍲",ig:["ground_pork", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:189,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 다짐육+양배추"},
  {id:1381,nm:"다짐육 애호박 고추장찌개",e:"🍲",ig:["ground_pork", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:217,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 다짐육+애호박"},
  {id:1382,nm:"다짐육 고추 고추장찌개",e:"🍲",ig:["ground_pork", "pepper", "tofu", "garlic", "greenonion"],tm:20,cal:281,pro:16,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 다짐육+고추"},
  {id:1383,nm:"스팸 시금치 된장찌개",e:"🍲",ig:["spam", "spinach", "tofu", "garlic", "greenonion"],tm:30,cal:176,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 스팸+시금치"},
  {id:1384,nm:"스팸 애호박 된장찌개",e:"🍲",ig:["spam", "zucchini", "tofu", "garlic", "greenonion"],tm:20,cal:279,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 스팸+애호박"},
  {id:1385,nm:"스팸 감자 된장찌개",e:"🍲",ig:["spam", "potato", "tofu", "garlic", "greenonion"],tm:20,cal:247,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 스팸+감자"},
  {id:1386,nm:"스팸 고구마 된장찌개",e:"🍲",ig:["spam", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:248,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 스팸+고구마"},
  {id:1387,nm:"스팸 양파 고추장찌개",e:"🍲",ig:["spam", "onion", "tofu", "garlic", "greenonion"],tm:20,cal:180,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 스팸+양파"},
  {id:1388,nm:"스팸 버섯 고추장찌개",e:"🍲",ig:["spam", "mushroom", "tofu", "garlic", "greenonion"],tm:20,cal:286,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 스팸+버섯"},
  {id:1389,nm:"스팸 콩나물 고추장찌개",e:"🍲",ig:["spam", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:157,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 스팸+콩나물"},
  {id:1390,nm:"스팸 시금치 고추장찌개",e:"🍲",ig:["spam", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:197,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 스팸+시금치"},
  {id:1391,nm:"스팸 애호박 고추장찌개",e:"🍲",ig:["spam", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:289,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 스팸+애호박"},
  {id:1392,nm:"스팸 고추 고추장찌개",e:"🍲",ig:["spam", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:289,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 스팸+고추"},
  {id:1393,nm:"스팸 감자 고추장찌개",e:"🍲",ig:["spam", "potato", "tofu", "garlic", "greenonion"],tm:20,cal:239,pro:14,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"스팸 볶기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 스팸+감자"},
  {id:1394,nm:"참치 버섯 된장찌개",e:"🍲",ig:["tuna_can", "mushroom", "tofu", "garlic", "greenonion"],tm:30,cal:191,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 참치+버섯"},
  {id:1395,nm:"참치 고추 된장찌개",e:"🍲",ig:["tuna_can", "pepper", "tofu", "garlic", "greenonion"],tm:20,cal:269,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 참치+고추"},
  {id:1396,nm:"참치 고구마 된장찌개",e:"🍲",ig:["tuna_can", "sweetpotato", "tofu", "garlic", "greenonion"],tm:30,cal:291,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 참치+고구마"},
  {id:1397,nm:"참치 양파 고추장찌개",e:"🍲",ig:["tuna_can", "onion", "tofu", "garlic", "greenonion"],tm:30,cal:190,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 참치+양파"},
  {id:1398,nm:"참치 양배추 고추장찌개",e:"🍲",ig:["tuna_can", "cabbage", "tofu", "garlic", "greenonion"],tm:30,cal:218,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 참치+양배추"},
  {id:1399,nm:"참치 콩나물 고추장찌개",e:"🍲",ig:["tuna_can", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:156,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 참치+콩나물"},
  {id:1400,nm:"참치 시금치 고추장찌개",e:"🍲",ig:["tuna_can", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:173,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 참치+시금치"},
  {id:1401,nm:"참치 애호박 고추장찌개",e:"🍲",ig:["tuna_can", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:196,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 참치+애호박"},
  {id:1402,nm:"참치 고추 고추장찌개",e:"🍲",ig:["tuna_can", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:179,pro:20,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"참치 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 참치+고추"},
  {id:1403,nm:"어묵 양파 된장찌개",e:"🍲",ig:["fishcake", "onion", "tofu", "garlic", "greenonion"],tm:30,cal:253,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 어묵+양파"},
  {id:1404,nm:"어묵 양배추 된장찌개",e:"🍲",ig:["fishcake", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:253,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 어묵+양배추"},
  {id:1405,nm:"어묵 버섯 된장찌개",e:"🍲",ig:["fishcake", "mushroom", "tofu", "garlic", "greenonion"],tm:20,cal:217,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 어묵+버섯"},
  {id:1406,nm:"어묵 시금치 된장찌개",e:"🍲",ig:["fishcake", "spinach", "tofu", "garlic", "greenonion"],tm:20,cal:284,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 어묵+시금치"},
  {id:1407,nm:"어묵 애호박 된장찌개",e:"🍲",ig:["fishcake", "zucchini", "tofu", "garlic", "greenonion"],tm:20,cal:181,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 어묵+애호박"},
  {id:1408,nm:"어묵 고추 된장찌개",e:"🍲",ig:["fishcake", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:213,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 어묵+고추"},
  {id:1409,nm:"어묵 감자 된장찌개",e:"🍲",ig:["fishcake", "potato", "tofu", "garlic", "greenonion"],tm:30,cal:202,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"된장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 된장 베이스에 어묵+감자"},
  {id:1410,nm:"어묵 양파 고추장찌개",e:"🍲",ig:["fishcake", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:178,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 어묵+양파"},
  {id:1411,nm:"어묵 콩나물 고추장찌개",e:"🍲",ig:["fishcake", "bean_sprout", "tofu", "garlic", "greenonion"],tm:20,cal:284,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 어묵+콩나물"},
  {id:1412,nm:"어묵 시금치 고추장찌개",e:"🍲",ig:["fishcake", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:208,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 어묵+시금치"},
  {id:1413,nm:"어묵 애호박 고추장찌개",e:"🍲",ig:["fishcake", "zucchini", "tofu", "garlic", "greenonion"],tm:20,cal:217,pro:12,tag:"국/찌개",st:[{i:"🥄",t:"고추장 풀기"},{i:"🥩",t:"어묵 볶기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파 올리기"}],tp:"💡 고추장 베이스에 어묵+애호박"},
  {id:1414,nm:"소고기 김치 맑은국",e:"🍲",ig:["beef_soup", "kimchi", "garlic", "greenonion", "anchovy"],tm:20,cal:110,pro:20,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"소고기+김치 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 소고기 김치 국"},
  {id:1415,nm:"소고기 시금치 맑은국",e:"🍲",ig:["beef_soup", "spinach", "garlic", "greenonion", "anchovy"],tm:15,cal:89,pro:20,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"소고기+시금치 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 소고기 시금치 국"},
  {id:1416,nm:"소고기 고구마 맑은국",e:"🍲",ig:["beef_soup", "sweetpotato", "garlic", "greenonion", "anchovy"],tm:15,cal:127,pro:20,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"소고기+고구마 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 소고기 고구마 국"},
  {id:1417,nm:"달걀 양파 맑은국",e:"🍲",ig:["egg", "onion", "garlic", "greenonion", "anchovy"],tm:15,cal:96,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"달걀+양파 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 달걀 양파 국"},
  {id:1418,nm:"달걀 당근 맑은국",e:"🍲",ig:["egg", "carrot", "garlic", "greenonion", "anchovy"],tm:20,cal:94,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"달걀+당근 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 달걀 당근 국"},
  {id:1419,nm:"달걀 시금치 맑은국",e:"🍲",ig:["egg", "spinach", "garlic", "greenonion", "anchovy"],tm:15,cal:103,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"달걀+시금치 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 달걀 시금치 국"},
  {id:1420,nm:"달걀 고추 맑은국",e:"🍲",ig:["egg", "pepper", "garlic", "greenonion", "anchovy"],tm:15,cal:137,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"달걀+고추 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 달걀 고추 국"},
  {id:1421,nm:"달걀 감자 맑은국",e:"🍲",ig:["egg", "potato", "garlic", "greenonion", "anchovy"],tm:15,cal:82,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"달걀+감자 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 달걀 감자 국"},
  {id:1422,nm:"두부 양파 맑은국",e:"🍲",ig:["tofu", "onion", "garlic", "greenonion", "anchovy"],tm:20,cal:72,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"두부+양파 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 두부 양파 국"},
  {id:1423,nm:"두부 양배추 맑은국",e:"🍲",ig:["tofu", "cabbage", "garlic", "greenonion", "anchovy"],tm:20,cal:131,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"두부+양배추 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 두부 양배추 국"},
  {id:1424,nm:"두부 시금치 맑은국",e:"🍲",ig:["tofu", "spinach", "garlic", "greenonion", "anchovy"],tm:15,cal:72,pro:8,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"두부+시금치 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 두부 시금치 국"},
  {id:1425,nm:"어묵 시금치 맑은국",e:"🍲",ig:["fishcake", "spinach", "garlic", "greenonion", "anchovy"],tm:15,cal:114,pro:10,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"어묵+시금치 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 어묵 시금치 국"},
  {id:1426,nm:"어묵 애호박 맑은국",e:"🍲",ig:["fishcake", "zucchini", "garlic", "greenonion", "anchovy"],tm:20,cal:72,pro:10,tag:"국/찌개",st:[{i:"🐟",t:"멸치 육수"},{i:"🔪",t:"어묵+애호박 넣기"},{i:"🧂",t:"국간장+소금+파"}],tp:"💡 깔끔한 어묵 애호박 국"},
  {id:1427,nm:"삼겹살 양파 간장덮밥",e:"🍚",ig:["pork_belly", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:394,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 삼겹살+양파 덮밥"},
  {id:1428,nm:"삼겹살 양파 고추장덮밥",e:"🍚",ig:["pork_belly", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:428,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 삼겹살+양파 덮밥"},
  {id:1429,nm:"삼겹살 버섯 간장덮밥",e:"🍚",ig:["pork_belly", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:458,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 삼겹살+버섯 덮밥"},
  {id:1430,nm:"삼겹살 버섯 고추장덮밥",e:"🍚",ig:["pork_belly", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:414,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 삼겹살+버섯 덮밥"},
  {id:1431,nm:"삼겹살 양배추 간장덮밥",e:"🍚",ig:["pork_belly", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:441,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 삼겹살+양배추 덮밥"},
  {id:1432,nm:"삼겹살 양배추 고추장덮밥",e:"🍚",ig:["pork_belly", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:429,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 삼겹살+양배추 덮밥"},
  {id:1433,nm:"삼겹살 콩나물 간장덮밥",e:"🍚",ig:["pork_belly", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:455,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 삼겹살+콩나물 덮밥"},
  {id:1434,nm:"삼겹살 콩나물 고추장덮밥",e:"🍚",ig:["pork_belly", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:381,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 삼겹살+콩나물 덮밥"},
  {id:1435,nm:"목살 김치 고추장덮밥",e:"🍚",ig:["pork_neck", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:412,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 목살+김치 덮밥"},
  {id:1436,nm:"목살 김치 카레덮밥",e:"🍚",ig:["pork_neck", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:419,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 목살+김치 덮밥"},
  {id:1437,nm:"목살 양파 고추장덮밥",e:"🍚",ig:["pork_neck", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:455,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 목살+양파 덮밥"},
  {id:1438,nm:"목살 버섯 카레덮밥",e:"🍚",ig:["pork_neck", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:413,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 목살+버섯 덮밥"},
  {id:1439,nm:"목살 양배추 고추장덮밥",e:"🍚",ig:["pork_neck", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:25,cal:457,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 목살+양배추 덮밥"},
  {id:1440,nm:"목살 콩나물 간장덮밥",e:"🍚",ig:["pork_neck", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:431,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 목살+콩나물 덮밥"},
  {id:1441,nm:"목살 콩나물 카레덮밥",e:"🍚",ig:["pork_neck", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:395,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 목살+콩나물 덮밥"},
  {id:1442,nm:"닭가슴살 김치 카레덮밥",e:"🍚",ig:["chicken_breast", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:455,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 닭가슴살+김치 덮밥"},
  {id:1443,nm:"닭가슴살 양파 고추장덮밥",e:"🍚",ig:["chicken_breast", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:410,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 닭가슴살+양파 덮밥"},
  {id:1444,nm:"닭가슴살 양파 카레덮밥",e:"🍚",ig:["chicken_breast", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:439,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 닭가슴살+양파 덮밥"},
  {id:1445,nm:"닭가슴살 버섯 간장덮밥",e:"🍚",ig:["chicken_breast", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:459,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 닭가슴살+버섯 덮밥"},
  {id:1446,nm:"닭가슴살 버섯 고추장덮밥",e:"🍚",ig:["chicken_breast", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:382,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 닭가슴살+버섯 덮밥"},
  {id:1447,nm:"닭가슴살 버섯 카레덮밥",e:"🍚",ig:["chicken_breast", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:437,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 닭가슴살+버섯 덮밥"},
  {id:1448,nm:"닭가슴살 양배추 간장덮밥",e:"🍚",ig:["chicken_breast", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:20,cal:418,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 닭가슴살+양배추 덮밥"},
  {id:1449,nm:"닭가슴살 양배추 고추장덮밥",e:"🍚",ig:["chicken_breast", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:20,cal:383,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 닭가슴살+양배추 덮밥"},
  {id:1450,nm:"닭가슴살 콩나물 고추장덮밥",e:"🍚",ig:["chicken_breast", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:408,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 닭가슴살+콩나물 덮밥"},
  {id:1451,nm:"소고기 김치 카레덮밥",e:"🍚",ig:["beef_soup", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:455,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 소고기+김치 덮밥"},
  {id:1452,nm:"소고기 양파 간장덮밥",e:"🍚",ig:["beef_soup", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:470,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 소고기+양파 덮밥"},
  {id:1453,nm:"소고기 양파 카레덮밥",e:"🍚",ig:["beef_soup", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:424,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 소고기+양파 덮밥"},
  {id:1454,nm:"소고기 버섯 카레덮밥",e:"🍚",ig:["beef_soup", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:392,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 소고기+버섯 덮밥"},
  {id:1455,nm:"소고기 양배추 고추장덮밥",e:"🍚",ig:["beef_soup", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:25,cal:455,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 소고기+양배추 덮밥"},
  {id:1456,nm:"다짐육 김치 카레덮밥",e:"🍚",ig:["ground_pork", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:419,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 다짐육+김치 덮밥"},
  {id:1457,nm:"다짐육 양파 고추장덮밥",e:"🍚",ig:["ground_pork", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:449,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 다짐육+양파 덮밥"},
  {id:1458,nm:"다짐육 양파 카레덮밥",e:"🍚",ig:["ground_pork", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:480,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 다짐육+양파 덮밥"},
  {id:1459,nm:"다짐육 버섯 카레덮밥",e:"🍚",ig:["ground_pork", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:383,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 다짐육+버섯 덮밥"},
  {id:1460,nm:"다짐육 양배추 카레덮밥",e:"🍚",ig:["ground_pork", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:25,cal:401,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 다짐육+양배추 덮밥"},
  {id:1461,nm:"다짐육 콩나물 간장덮밥",e:"🍚",ig:["ground_pork", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:20,cal:439,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 다짐육+콩나물 덮밥"},
  {id:1462,nm:"다짐육 콩나물 카레덮밥",e:"🍚",ig:["ground_pork", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:20,cal:403,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 다짐육+콩나물 덮밥"},
  {id:1463,nm:"스팸 김치 간장덮밥",e:"🍚",ig:["spam", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:25,cal:476,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 스팸+김치 덮밥"},
  {id:1464,nm:"스팸 김치 고추장덮밥",e:"🍚",ig:["spam", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:424,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 스팸+김치 덮밥"},
  {id:1465,nm:"스팸 김치 카레덮밥",e:"🍚",ig:["spam", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:418,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 스팸+김치 덮밥"},
  {id:1466,nm:"스팸 양파 간장덮밥",e:"🍚",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:15,cal:380,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 스팸+양파 덮밥"},
  {id:1467,nm:"스팸 양파 고추장덮밥",e:"🍚",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:423,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 스팸+양파 덮밥"},
  {id:1468,nm:"스팸 양파 카레덮밥",e:"🍚",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:442,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 스팸+양파 덮밥"},
  {id:1469,nm:"스팸 양배추 간장덮밥",e:"🍚",ig:["spam", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:386,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 스팸+양배추 덮밥"},
  {id:1470,nm:"스팸 양배추 고추장덮밥",e:"🍚",ig:["spam", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:25,cal:470,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 스팸+양배추 덮밥"},
  {id:1471,nm:"스팸 콩나물 고추장덮밥",e:"🍚",ig:["spam", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:452,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 스팸+콩나물 덮밥"},
  {id:1472,nm:"스팸 콩나물 카레덮밥",e:"🍚",ig:["spam", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:460,pro:14,tag:"메인",st:[{i:"🥩",t:"스팸 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 스팸+콩나물 덮밥"},
  {id:1473,nm:"참치 김치 고추장덮밥",e:"🍚",ig:["tuna_can", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:419,pro:20,tag:"메인",st:[{i:"🥩",t:"참치 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 참치+김치 덮밥"},
  {id:1474,nm:"참치 양파 고추장덮밥",e:"🍚",ig:["tuna_can", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:430,pro:20,tag:"메인",st:[{i:"🥩",t:"참치 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 참치+양파 덮밥"},
  {id:1475,nm:"참치 버섯 고추장덮밥",e:"🍚",ig:["tuna_can", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:15,cal:436,pro:20,tag:"메인",st:[{i:"🥩",t:"참치 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"버섯 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 참치+버섯 덮밥"},
  {id:1476,nm:"참치 양배추 간장덮밥",e:"🍚",ig:["tuna_can", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:25,cal:461,pro:20,tag:"메인",st:[{i:"🥩",t:"참치 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 참치+양배추 덮밥"},
  {id:1477,nm:"참치 콩나물 고추장덮밥",e:"🍚",ig:["tuna_can", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:15,cal:456,pro:20,tag:"메인",st:[{i:"🥩",t:"참치 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 참치+콩나물 덮밥"},
  {id:1478,nm:"어묵 김치 간장덮밥",e:"🍚",ig:["fishcake", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:396,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 어묵+김치 덮밥"},
  {id:1479,nm:"어묵 김치 고추장덮밥",e:"🍚",ig:["fishcake", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:15,cal:391,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 어묵+김치 덮밥"},
  {id:1480,nm:"어묵 김치 카레덮밥",e:"🍚",ig:["fishcake", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:25,cal:447,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"김치 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 어묵+김치 덮밥"},
  {id:1481,nm:"어묵 양파 간장덮밥",e:"🍚",ig:["fishcake", "onion", "egg", "rice", "garlic", "greenonion"],tm:25,cal:393,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 어묵+양파 덮밥"},
  {id:1482,nm:"어묵 양파 카레덮밥",e:"🍚",ig:["fishcake", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:392,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"카레 양념"},{i:"🔪",t:"양파 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 카레 어묵+양파 덮밥"},
  {id:1483,nm:"어묵 양배추 간장덮밥",e:"🍚",ig:["fishcake", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:15,cal:406,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 어묵+양배추 덮밥"},
  {id:1484,nm:"어묵 양배추 고추장덮밥",e:"🍚",ig:["fishcake", "cabbage", "egg", "rice", "garlic", "greenonion"],tm:20,cal:469,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"양배추 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 어묵+양배추 덮밥"},
  {id:1485,nm:"어묵 콩나물 간장덮밥",e:"🍚",ig:["fishcake", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:460,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"간장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 간장 어묵+콩나물 덮밥"},
  {id:1486,nm:"어묵 콩나물 고추장덮밥",e:"🍚",ig:["fishcake", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:472,pro:12,tag:"메인",st:[{i:"🥩",t:"어묵 볶기"},{i:"🥄",t:"고추장 양념"},{i:"🔪",t:"콩나물 넣기"},{i:"🍚",t:"밥 위에+달걀"}],tp:"💡 고추장 어묵+콩나물 덮밥"},
  {id:1487,nm:"삼겹살 당근 볶음면",e:"🍜",ig:["ramen", "pork_belly", "carrot", "egg", "garlic", "greenonion"],tm:15,cal:395,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"삼겹살+당근 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+당근 볶음면!"},
  {id:1488,nm:"삼겹살 양배추 국수",e:"🍜",ig:["noodle", "pork_belly", "cabbage", "egg", "garlic", "greenonion"],tm:25,cal:344,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"삼겹살+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+양배추 국수!"},
  {id:1489,nm:"삼겹살 양배추 볶음면",e:"🍜",ig:["ramen", "pork_belly", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:434,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"삼겹살+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+양배추 볶음면!"},
  {id:1490,nm:"삼겹살 버섯 볶음면",e:"🍜",ig:["ramen", "pork_belly", "mushroom", "egg", "garlic", "greenonion"],tm:15,cal:440,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"삼겹살+버섯 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+버섯 볶음면!"},
  {id:1491,nm:"삼겹살 시금치 볶음면",e:"🍜",ig:["ramen", "pork_belly", "spinach", "egg", "garlic", "greenonion"],tm:25,cal:448,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"삼겹살+시금치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+시금치 볶음면!"},
  {id:1492,nm:"삼겹살 감자 국수",e:"🍜",ig:["noodle", "pork_belly", "potato", "egg", "garlic", "greenonion"],tm:25,cal:384,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"삼겹살+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+감자 국수!"},
  {id:1493,nm:"삼겹살 감자 볶음면",e:"🍜",ig:["ramen", "pork_belly", "potato", "egg", "garlic", "greenonion"],tm:15,cal:418,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"삼겹살+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+감자 볶음면!"},
  {id:1494,nm:"삼겹살 고구마 국수",e:"🍜",ig:["noodle", "pork_belly", "sweetpotato", "egg", "garlic", "greenonion"],tm:25,cal:415,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"삼겹살+고구마 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살+고구마 국수!"},
  {id:1495,nm:"목살 양파 국수",e:"🍜",ig:["noodle", "pork_neck", "onion", "egg", "garlic", "greenonion"],tm:20,cal:348,pro:18,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"목살+양파 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 목살+양파 국수!"},
  {id:1496,nm:"목살 양배추 볶음면",e:"🍜",ig:["ramen", "pork_neck", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:350,pro:18,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"목살+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 목살+양배추 볶음면!"},
  {id:1497,nm:"목살 버섯 볶음면",e:"🍜",ig:["ramen", "pork_neck", "mushroom", "egg", "garlic", "greenonion"],tm:20,cal:449,pro:18,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"목살+버섯 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 목살+버섯 볶음면!"},
  {id:1498,nm:"목살 콩나물 국수",e:"🍜",ig:["noodle", "pork_neck", "bean_sprout", "egg", "garlic", "greenonion"],tm:20,cal:396,pro:18,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"목살+콩나물 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 목살+콩나물 국수!"},
  {id:1499,nm:"목살 감자 국수",e:"🍜",ig:["noodle", "pork_neck", "potato", "egg", "garlic", "greenonion"],tm:20,cal:452,pro:18,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"목살+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 목살+감자 국수!"},
  {id:1500,nm:"목살 감자 볶음면",e:"🍜",ig:["ramen", "pork_neck", "potato", "egg", "garlic", "greenonion"],tm:20,cal:404,pro:18,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"목살+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 목살+감자 볶음면!"},
  {id:1501,nm:"닭가슴살 김치 국수",e:"🍜",ig:["noodle", "chicken_breast", "kimchi", "egg", "garlic", "greenonion"],tm:15,cal:363,pro:28,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+김치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+김치 국수!"},
  {id:1502,nm:"닭가슴살 양파 볶음면",e:"🍜",ig:["ramen", "chicken_breast", "onion", "egg", "garlic", "greenonion"],tm:25,cal:438,pro:28,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"닭가슴살+양파 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+양파 볶음면!"},
  {id:1503,nm:"닭가슴살 당근 국수",e:"🍜",ig:["noodle", "chicken_breast", "carrot", "egg", "garlic", "greenonion"],tm:15,cal:390,pro:28,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+당근 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+당근 국수!"},
  {id:1504,nm:"닭가슴살 양배추 국수",e:"🍜",ig:["noodle", "chicken_breast", "cabbage", "egg", "garlic", "greenonion"],tm:15,cal:353,pro:28,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+양배추 국수!"},
  {id:1505,nm:"닭가슴살 양배추 볶음면",e:"🍜",ig:["ramen", "chicken_breast", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:373,pro:28,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"닭가슴살+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+양배추 볶음면!"},
  {id:1506,nm:"닭가슴살 콩나물 국수",e:"🍜",ig:["noodle", "chicken_breast", "bean_sprout", "egg", "garlic", "greenonion"],tm:15,cal:399,pro:28,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+콩나물 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+콩나물 국수!"},
  {id:1507,nm:"닭가슴살 시금치 국수",e:"🍜",ig:["noodle", "chicken_breast", "spinach", "egg", "garlic", "greenonion"],tm:20,cal:385,pro:28,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+시금치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+시금치 국수!"},
  {id:1508,nm:"닭가슴살 시금치 볶음면",e:"🍜",ig:["ramen", "chicken_breast", "spinach", "egg", "garlic", "greenonion"],tm:15,cal:398,pro:28,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"닭가슴살+시금치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+시금치 볶음면!"},
  {id:1509,nm:"닭가슴살 애호박 볶음면",e:"🍜",ig:["ramen", "chicken_breast", "zucchini", "egg", "garlic", "greenonion"],tm:20,cal:385,pro:28,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"닭가슴살+애호박 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+애호박 볶음면!"},
  {id:1510,nm:"닭가슴살 고추 국수",e:"🍜",ig:["noodle", "chicken_breast", "pepper", "egg", "garlic", "greenonion"],tm:25,cal:349,pro:28,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"닭가슴살+고추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살+고추 국수!"},
  {id:1511,nm:"소고기 김치 국수",e:"🍜",ig:["noodle", "beef_soup", "kimchi", "egg", "garlic", "greenonion"],tm:25,cal:459,pro:22,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"소고기+김치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+김치 국수!"},
  {id:1512,nm:"소고기 양파 국수",e:"🍜",ig:["noodle", "beef_soup", "onion", "egg", "garlic", "greenonion"],tm:15,cal:453,pro:22,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"소고기+양파 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+양파 국수!"},
  {id:1513,nm:"소고기 양파 볶음면",e:"🍜",ig:["ramen", "beef_soup", "onion", "egg", "garlic", "greenonion"],tm:25,cal:377,pro:22,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"소고기+양파 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+양파 볶음면!"},
  {id:1514,nm:"소고기 당근 볶음면",e:"🍜",ig:["ramen", "beef_soup", "carrot", "egg", "garlic", "greenonion"],tm:15,cal:405,pro:22,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"소고기+당근 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+당근 볶음면!"},
  {id:1515,nm:"소고기 양배추 국수",e:"🍜",ig:["noodle", "beef_soup", "cabbage", "egg", "garlic", "greenonion"],tm:25,cal:414,pro:22,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"소고기+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+양배추 국수!"},
  {id:1516,nm:"소고기 버섯 국수",e:"🍜",ig:["noodle", "beef_soup", "mushroom", "egg", "garlic", "greenonion"],tm:25,cal:343,pro:22,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"소고기+버섯 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+버섯 국수!"},
  {id:1517,nm:"소고기 콩나물 볶음면",e:"🍜",ig:["ramen", "beef_soup", "bean_sprout", "egg", "garlic", "greenonion"],tm:20,cal:393,pro:22,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"소고기+콩나물 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+콩나물 볶음면!"},
  {id:1518,nm:"소고기 시금치 국수",e:"🍜",ig:["noodle", "beef_soup", "spinach", "egg", "garlic", "greenonion"],tm:15,cal:358,pro:22,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"소고기+시금치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+시금치 국수!"},
  {id:1519,nm:"소고기 고추 볶음면",e:"🍜",ig:["ramen", "beef_soup", "pepper", "egg", "garlic", "greenonion"],tm:20,cal:445,pro:22,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"소고기+고추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+고추 볶음면!"},
  {id:1520,nm:"소고기 감자 국수",e:"🍜",ig:["noodle", "beef_soup", "potato", "egg", "garlic", "greenonion"],tm:20,cal:425,pro:22,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"소고기+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 소고기+감자 국수!"},
  {id:1521,nm:"다짐육 양파 국수",e:"🍜",ig:["noodle", "ground_pork", "onion", "egg", "garlic", "greenonion"],tm:20,cal:421,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"다짐육+양파 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+양파 국수!"},
  {id:1522,nm:"다짐육 당근 국수",e:"🍜",ig:["noodle", "ground_pork", "carrot", "egg", "garlic", "greenonion"],tm:25,cal:383,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"다짐육+당근 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+당근 국수!"},
  {id:1523,nm:"다짐육 양배추 국수",e:"🍜",ig:["noodle", "ground_pork", "cabbage", "egg", "garlic", "greenonion"],tm:15,cal:423,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"다짐육+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+양배추 국수!"},
  {id:1524,nm:"다짐육 버섯 국수",e:"🍜",ig:["noodle", "ground_pork", "mushroom", "egg", "garlic", "greenonion"],tm:20,cal:374,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"다짐육+버섯 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+버섯 국수!"},
  {id:1525,nm:"다짐육 버섯 볶음면",e:"🍜",ig:["ramen", "ground_pork", "mushroom", "egg", "garlic", "greenonion"],tm:15,cal:355,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"다짐육+버섯 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+버섯 볶음면!"},
  {id:1526,nm:"다짐육 콩나물 볶음면",e:"🍜",ig:["ramen", "ground_pork", "bean_sprout", "egg", "garlic", "greenonion"],tm:25,cal:400,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"다짐육+콩나물 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+콩나물 볶음면!"},
  {id:1527,nm:"다짐육 고추 볶음면",e:"🍜",ig:["ramen", "ground_pork", "pepper", "egg", "garlic", "greenonion"],tm:15,cal:396,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"다짐육+고추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+고추 볶음면!"},
  {id:1528,nm:"다짐육 감자 국수",e:"🍜",ig:["noodle", "ground_pork", "potato", "egg", "garlic", "greenonion"],tm:25,cal:450,pro:16,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"다짐육+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+감자 국수!"},
  {id:1529,nm:"다짐육 감자 볶음면",e:"🍜",ig:["ramen", "ground_pork", "potato", "egg", "garlic", "greenonion"],tm:25,cal:381,pro:16,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"다짐육+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육+감자 볶음면!"},
  {id:1530,nm:"스팸 당근 볶음면",e:"🍜",ig:["ramen", "spam", "carrot", "egg", "garlic", "greenonion"],tm:15,cal:390,pro:14,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"스팸+당근 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 스팸+당근 볶음면!"},
  {id:1531,nm:"스팸 양배추 국수",e:"🍜",ig:["noodle", "spam", "cabbage", "egg", "garlic", "greenonion"],tm:20,cal:393,pro:14,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"스팸+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 스팸+양배추 국수!"},
  {id:1532,nm:"스팸 콩나물 볶음면",e:"🍜",ig:["ramen", "spam", "bean_sprout", "egg", "garlic", "greenonion"],tm:25,cal:392,pro:14,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"스팸+콩나물 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 스팸+콩나물 볶음면!"},
  {id:1533,nm:"스팸 시금치 국수",e:"🍜",ig:["noodle", "spam", "spinach", "egg", "garlic", "greenonion"],tm:25,cal:454,pro:14,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"스팸+시금치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 스팸+시금치 국수!"},
  {id:1534,nm:"스팸 애호박 국수",e:"🍜",ig:["noodle", "spam", "zucchini", "egg", "garlic", "greenonion"],tm:15,cal:406,pro:14,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"스팸+애호박 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 스팸+애호박 국수!"},
  {id:1535,nm:"스팸 고추 국수",e:"🍜",ig:["noodle", "spam", "pepper", "egg", "garlic", "greenonion"],tm:15,cal:455,pro:14,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"스팸+고추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 스팸+고추 국수!"},
  {id:1536,nm:"참치 김치 볶음면",e:"🍜",ig:["ramen", "tuna_can", "kimchi", "egg", "garlic", "greenonion"],tm:25,cal:385,pro:20,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+김치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+김치 볶음면!"},
  {id:1537,nm:"참치 양파 국수",e:"🍜",ig:["noodle", "tuna_can", "onion", "egg", "garlic", "greenonion"],tm:15,cal:458,pro:20,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"참치+양파 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+양파 국수!"},
  {id:1538,nm:"참치 양파 볶음면",e:"🍜",ig:["ramen", "tuna_can", "onion", "egg", "garlic", "greenonion"],tm:25,cal:449,pro:20,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+양파 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+양파 볶음면!"},
  {id:1539,nm:"참치 당근 볶음면",e:"🍜",ig:["ramen", "tuna_can", "carrot", "egg", "garlic", "greenonion"],tm:15,cal:343,pro:20,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+당근 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+당근 볶음면!"},
  {id:1540,nm:"참치 버섯 볶음면",e:"🍜",ig:["ramen", "tuna_can", "mushroom", "egg", "garlic", "greenonion"],tm:25,cal:397,pro:20,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+버섯 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+버섯 볶음면!"},
  {id:1541,nm:"참치 시금치 볶음면",e:"🍜",ig:["ramen", "tuna_can", "spinach", "egg", "garlic", "greenonion"],tm:25,cal:439,pro:20,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+시금치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+시금치 볶음면!"},
  {id:1542,nm:"참치 고추 국수",e:"🍜",ig:["noodle", "tuna_can", "pepper", "egg", "garlic", "greenonion"],tm:15,cal:378,pro:20,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"참치+고추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+고추 국수!"},
  {id:1543,nm:"참치 감자 볶음면",e:"🍜",ig:["ramen", "tuna_can", "potato", "egg", "garlic", "greenonion"],tm:25,cal:355,pro:20,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"참치+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+감자 볶음면!"},
  {id:1544,nm:"참치 고구마 국수",e:"🍜",ig:["noodle", "tuna_can", "sweetpotato", "egg", "garlic", "greenonion"],tm:25,cal:399,pro:20,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"참치+고구마 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 참치+고구마 국수!"},
  {id:1545,nm:"어묵 당근 국수",e:"🍜",ig:["noodle", "fishcake", "carrot", "egg", "garlic", "greenonion"],tm:20,cal:428,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+당근 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+당근 국수!"},
  {id:1546,nm:"어묵 양배추 국수",e:"🍜",ig:["noodle", "fishcake", "cabbage", "egg", "garlic", "greenonion"],tm:15,cal:445,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+양배추 국수!"},
  {id:1547,nm:"어묵 양배추 볶음면",e:"🍜",ig:["ramen", "fishcake", "cabbage", "egg", "garlic", "greenonion"],tm:15,cal:414,pro:12,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"어묵+양배추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+양배추 볶음면!"},
  {id:1548,nm:"어묵 버섯 볶음면",e:"🍜",ig:["ramen", "fishcake", "mushroom", "egg", "garlic", "greenonion"],tm:20,cal:385,pro:12,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"어묵+버섯 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+버섯 볶음면!"},
  {id:1549,nm:"어묵 콩나물 국수",e:"🍜",ig:["noodle", "fishcake", "bean_sprout", "egg", "garlic", "greenonion"],tm:25,cal:436,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+콩나물 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+콩나물 국수!"},
  {id:1550,nm:"어묵 시금치 국수",e:"🍜",ig:["noodle", "fishcake", "spinach", "egg", "garlic", "greenonion"],tm:25,cal:395,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+시금치 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+시금치 국수!"},
  {id:1551,nm:"어묵 고추 볶음면",e:"🍜",ig:["ramen", "fishcake", "pepper", "egg", "garlic", "greenonion"],tm:20,cal:455,pro:12,tag:"메인",st:[{i:"🍜",t:"라면 삶기"},{i:"🥩",t:"어묵+고추 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+고추 볶음면!"},
  {id:1552,nm:"어묵 감자 국수",e:"🍜",ig:["noodle", "fishcake", "potato", "egg", "garlic", "greenonion"],tm:25,cal:418,pro:12,tag:"메인",st:[{i:"🍜",t:"소면 삶기"},{i:"🥩",t:"어묵+감자 볶기"},{i:"🥄",t:"양념"},{i:"🥚",t:"달걀"}],tp:"💡 어묵+감자 국수!"},
  {id:1553,nm:"삼겹 시금치볶음",e:"🥘",ig:["pork_belly", "spinach", "garlic", "greenonion"],tm:20,cal:211,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🔪",t:"시금치 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 삼겹+시금치 볶음 반찬"},
  {id:1554,nm:"삼겹 고추볶음",e:"🥘",ig:["pork_belly", "pepper", "garlic", "greenonion"],tm:10,cal:202,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🔪",t:"고추 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 삼겹+고추 볶음 반찬"},
  {id:1555,nm:"삼겹 감자볶음",e:"🥘",ig:["pork_belly", "potato", "garlic", "greenonion"],tm:10,cal:230,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🔪",t:"감자 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 삼겹+감자 볶음 반찬"},
  {id:1556,nm:"삼겹 고구마볶음",e:"🥘",ig:["pork_belly", "sweetpotato", "garlic", "greenonion"],tm:20,cal:173,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🔪",t:"고구마 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 삼겹+고구마 볶음 반찬"},
  {id:1557,nm:"목살 김치볶음",e:"🥘",ig:["pork_neck", "kimchi", "garlic", "greenonion"],tm:10,cal:233,pro:16,tag:"밑반찬",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"김치 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 목살+김치 볶음 반찬"},
  {id:1558,nm:"목살 당근볶음",e:"🥘",ig:["pork_neck", "carrot", "garlic", "greenonion"],tm:15,cal:249,pro:16,tag:"밑반찬",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"당근 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 목살+당근 볶음 반찬"},
  {id:1559,nm:"목살 양배추볶음",e:"🥘",ig:["pork_neck", "cabbage", "garlic", "greenonion"],tm:10,cal:230,pro:16,tag:"밑반찬",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"양배추 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 목살+양배추 볶음 반찬"},
  {id:1560,nm:"목살 콩나물볶음",e:"🥘",ig:["pork_neck", "bean_sprout", "garlic", "greenonion"],tm:10,cal:180,pro:16,tag:"밑반찬",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"콩나물 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 목살+콩나물 볶음 반찬"},
  {id:1561,nm:"목살 시금치볶음",e:"🥘",ig:["pork_neck", "spinach", "garlic", "greenonion"],tm:10,cal:216,pro:16,tag:"밑반찬",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"시금치 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 목살+시금치 볶음 반찬"},
  {id:1562,nm:"목살 고추볶음",e:"🥘",ig:["pork_neck", "pepper", "garlic", "greenonion"],tm:20,cal:174,pro:16,tag:"밑반찬",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"고추 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 목살+고추 볶음 반찬"},
  {id:1563,nm:"목살 고구마볶음",e:"🥘",ig:["pork_neck", "sweetpotato", "garlic", "greenonion"],tm:15,cal:201,pro:16,tag:"밑반찬",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"고구마 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 목살+고구마 볶음 반찬"},
  {id:1564,nm:"닭가슴살 김치볶음",e:"🥘",ig:["chicken_breast", "kimchi", "garlic", "greenonion"],tm:10,cal:201,pro:24,tag:"밑반찬",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"김치 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 닭가슴살+김치 볶음 반찬"},
  {id:1565,nm:"닭가슴살 양파볶음",e:"🥘",ig:["chicken_breast", "onion", "garlic", "greenonion"],tm:10,cal:185,pro:24,tag:"밑반찬",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"양파 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 닭가슴살+양파 볶음 반찬"},
  {id:1566,nm:"닭가슴살 당근볶음",e:"🥘",ig:["chicken_breast", "carrot", "garlic", "greenonion"],tm:15,cal:153,pro:24,tag:"밑반찬",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"당근 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 닭가슴살+당근 볶음 반찬"},
  {id:1567,nm:"닭가슴살 양배추볶음",e:"🥘",ig:["chicken_breast", "cabbage", "garlic", "greenonion"],tm:20,cal:242,pro:24,tag:"밑반찬",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"양배추 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 닭가슴살+양배추 볶음 반찬"},
  {id:1568,nm:"닭가슴살 시금치볶음",e:"🥘",ig:["chicken_breast", "spinach", "garlic", "greenonion"],tm:10,cal:224,pro:24,tag:"밑반찬",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"시금치 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 닭가슴살+시금치 볶음 반찬"},
  {id:1569,nm:"닭가슴살 애호박볶음",e:"🥘",ig:["chicken_breast", "zucchini", "garlic", "greenonion"],tm:20,cal:218,pro:24,tag:"밑반찬",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"애호박 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 닭가슴살+애호박 볶음 반찬"},
  {id:1570,nm:"다짐육 당근볶음",e:"🥘",ig:["ground_pork", "carrot", "garlic", "greenonion"],tm:15,cal:208,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"당근 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 다짐육+당근 볶음 반찬"},
  {id:1571,nm:"다짐육 콩나물볶음",e:"🥘",ig:["ground_pork", "bean_sprout", "garlic", "greenonion"],tm:10,cal:178,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"콩나물 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 다짐육+콩나물 볶음 반찬"},
  {id:1572,nm:"다짐육 애호박볶음",e:"🥘",ig:["ground_pork", "zucchini", "garlic", "greenonion"],tm:20,cal:214,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"애호박 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 다짐육+애호박 볶음 반찬"},
  {id:1573,nm:"다짐육 고추볶음",e:"🥘",ig:["ground_pork", "pepper", "garlic", "greenonion"],tm:20,cal:248,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"고추 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 다짐육+고추 볶음 반찬"},
  {id:1574,nm:"다짐육 고구마볶음",e:"🥘",ig:["ground_pork", "sweetpotato", "garlic", "greenonion"],tm:15,cal:181,pro:14,tag:"밑반찬",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"고구마 넣기"},{i:"🧂",t:"간장+참기름"}],tp:"💡 다짐육+고구마 볶음 반찬"},
  {id:1575,nm:"삼겹살 양파 떡볶이",e:"🍡",ig:["ricecake", "pork_belly", "onion", "garlic", "greenonion", "egg"],tm:20,cal:407,pro:16,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+삼겹살+양파"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 삼겹살 양파 떡볶이!"},
  {id:1576,nm:"목살 양배추 떡볶이",e:"🍡",ig:["ricecake", "pork_neck", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:435,pro:18,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+목살+양배추"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 목살 양배추 떡볶이!"},
  {id:1577,nm:"목살 양파 떡볶이",e:"🍡",ig:["ricecake", "pork_neck", "onion", "garlic", "greenonion", "egg"],tm:20,cal:416,pro:18,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+목살+양파"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 목살 양파 떡볶이!"},
  {id:1578,nm:"목살 버섯 떡볶이",e:"🍡",ig:["ricecake", "pork_neck", "mushroom", "garlic", "greenonion", "egg"],tm:20,cal:429,pro:18,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+목살+버섯"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 목살 버섯 떡볶이!"},
  {id:1579,nm:"닭가슴살 양배추 떡볶이",e:"🍡",ig:["ricecake", "chicken_breast", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:449,pro:28,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+닭가슴살+양배추"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살 양배추 떡볶이!"},
  {id:1580,nm:"닭가슴살 김치 떡볶이",e:"🍡",ig:["ricecake", "chicken_breast", "kimchi", "garlic", "greenonion", "egg"],tm:20,cal:463,pro:28,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+닭가슴살+김치"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살 김치 떡볶이!"},
  {id:1581,nm:"닭가슴살 버섯 떡볶이",e:"🍡",ig:["ricecake", "chicken_breast", "mushroom", "garlic", "greenonion", "egg"],tm:20,cal:406,pro:28,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+닭가슴살+버섯"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 닭가슴살 버섯 떡볶이!"},
  {id:1582,nm:"소고기 양배추 떡볶이",e:"🍡",ig:["ricecake", "beef_soup", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:405,pro:22,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+소고기+양배추"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 소고기 양배추 떡볶이!"},
  {id:1583,nm:"소고기 김치 떡볶이",e:"🍡",ig:["ricecake", "beef_soup", "kimchi", "garlic", "greenonion", "egg"],tm:20,cal:442,pro:22,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+소고기+김치"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 소고기 김치 떡볶이!"},
  {id:1584,nm:"다짐육 양배추 떡볶이",e:"🍡",ig:["ricecake", "ground_pork", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:446,pro:16,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+다짐육+양배추"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육 양배추 떡볶이!"},
  {id:1585,nm:"다짐육 양파 떡볶이",e:"🍡",ig:["ricecake", "ground_pork", "onion", "garlic", "greenonion", "egg"],tm:20,cal:451,pro:16,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+다짐육+양파"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육 양파 떡볶이!"},
  {id:1586,nm:"다짐육 김치 떡볶이",e:"🍡",ig:["ricecake", "ground_pork", "kimchi", "garlic", "greenonion", "egg"],tm:20,cal:401,pro:16,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+다짐육+김치"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 다짐육 김치 떡볶이!"},
  {id:1587,nm:"참치 양배추 떡볶이",e:"🍡",ig:["ricecake", "tuna_can", "cabbage", "garlic", "greenonion", "egg"],tm:20,cal:432,pro:20,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+참치+양배추"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 참치 양배추 떡볶이!"},
  {id:1588,nm:"참치 양파 떡볶이",e:"🍡",ig:["ricecake", "tuna_can", "onion", "garlic", "greenonion", "egg"],tm:20,cal:476,pro:20,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+참치+양파"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 참치 양파 떡볶이!"},
  {id:1589,nm:"참치 김치 떡볶이",e:"🍡",ig:["ricecake", "tuna_can", "kimchi", "garlic", "greenonion", "egg"],tm:20,cal:459,pro:20,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+참치+김치"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 참치 김치 떡볶이!"},
  {id:1590,nm:"참치 버섯 떡볶이",e:"🍡",ig:["ricecake", "tuna_can", "mushroom", "garlic", "greenonion", "egg"],tm:20,cal:405,pro:20,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+참치+버섯"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 참치 버섯 떡볶이!"},
  {id:1591,nm:"어묵 버섯 떡볶이",e:"🍡",ig:["ricecake", "fishcake", "mushroom", "garlic", "greenonion", "egg"],tm:20,cal:411,pro:12,tag:"메인",st:[{i:"💧",t:"고추장 양념 끓이기"},{i:"🍡",t:"떡+어묵+버섯"},{i:"⏱️",t:"말랑해질때까지"},{i:"🥚",t:"달걀"}],tp:"💡 어묵 버섯 떡볶이!"},
  {id:1592,nm:"달걀 당근죽",e:"🍚",ig:["egg", "carrot", "rice", "garlic", "greenonion"],tm:25,cal:202,pro:10,tag:"메인",st:[{i:"🔪",t:"달걀+당근 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 달걀 당근죽"},
  {id:1593,nm:"달걀 버섯죽",e:"🍚",ig:["egg", "mushroom", "rice", "garlic", "greenonion"],tm:25,cal:252,pro:10,tag:"메인",st:[{i:"🔪",t:"달걀+버섯 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 달걀 버섯죽"},
  {id:1594,nm:"달걀 김치죽",e:"🍚",ig:["egg", "kimchi", "rice", "garlic", "greenonion"],tm:25,cal:210,pro:10,tag:"메인",st:[{i:"🔪",t:"달걀+김치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 달걀 김치죽"},
  {id:1595,nm:"달걀 시금치죽",e:"🍚",ig:["egg", "spinach", "rice", "garlic", "greenonion"],tm:25,cal:206,pro:10,tag:"메인",st:[{i:"🔪",t:"달걀+시금치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 달걀 시금치죽"},
  {id:1596,nm:"달걀 양파죽",e:"🍚",ig:["egg", "onion", "rice", "garlic", "greenonion"],tm:25,cal:204,pro:10,tag:"메인",st:[{i:"🔪",t:"달걀+양파 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 달걀 양파죽"},
  {id:1597,nm:"참치 당근죽",e:"🍚",ig:["tuna_can", "carrot", "rice", "garlic", "greenonion"],tm:25,cal:263,pro:18,tag:"메인",st:[{i:"🔪",t:"참치+당근 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 참치 당근죽"},
  {id:1598,nm:"참치 버섯죽",e:"🍚",ig:["tuna_can", "mushroom", "rice", "garlic", "greenonion"],tm:25,cal:219,pro:18,tag:"메인",st:[{i:"🔪",t:"참치+버섯 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 참치 버섯죽"},
  {id:1599,nm:"참치 김치죽",e:"🍚",ig:["tuna_can", "kimchi", "rice", "garlic", "greenonion"],tm:25,cal:224,pro:18,tag:"메인",st:[{i:"🔪",t:"참치+김치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 참치 김치죽"},
  {id:1600,nm:"참치 시금치죽",e:"🍚",ig:["tuna_can", "spinach", "rice", "garlic", "greenonion"],tm:25,cal:206,pro:18,tag:"메인",st:[{i:"🔪",t:"참치+시금치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 참치 시금치죽"},
  {id:1601,nm:"참치 양파죽",e:"🍚",ig:["tuna_can", "onion", "rice", "garlic", "greenonion"],tm:25,cal:224,pro:18,tag:"메인",st:[{i:"🔪",t:"참치+양파 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 참치 양파죽"},
  {id:1602,nm:"닭가슴살 당근죽",e:"🍚",ig:["chicken_breast", "carrot", "rice", "garlic", "greenonion"],tm:25,cal:220,pro:24,tag:"메인",st:[{i:"🔪",t:"닭가슴살+당근 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 닭가슴살 당근죽"},
  {id:1603,nm:"닭가슴살 버섯죽",e:"🍚",ig:["chicken_breast", "mushroom", "rice", "garlic", "greenonion"],tm:25,cal:249,pro:24,tag:"메인",st:[{i:"🔪",t:"닭가슴살+버섯 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 닭가슴살 버섯죽"},
  {id:1604,nm:"닭가슴살 김치죽",e:"🍚",ig:["chicken_breast", "kimchi", "rice", "garlic", "greenonion"],tm:25,cal:275,pro:24,tag:"메인",st:[{i:"🔪",t:"닭가슴살+김치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 닭가슴살 김치죽"},
  {id:1605,nm:"닭가슴살 시금치죽",e:"🍚",ig:["chicken_breast", "spinach", "rice", "garlic", "greenonion"],tm:25,cal:279,pro:24,tag:"메인",st:[{i:"🔪",t:"닭가슴살+시금치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 닭가슴살 시금치죽"},
  {id:1606,nm:"닭가슴살 양파죽",e:"🍚",ig:["chicken_breast", "onion", "rice", "garlic", "greenonion"],tm:25,cal:273,pro:24,tag:"메인",st:[{i:"🔪",t:"닭가슴살+양파 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 닭가슴살 양파죽"},
  {id:1607,nm:"소고기 당근죽",e:"🍚",ig:["beef_soup", "carrot", "rice", "garlic", "greenonion"],tm:25,cal:267,pro:20,tag:"메인",st:[{i:"🔪",t:"소고기+당근 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 소고기 당근죽"},
  {id:1608,nm:"소고기 버섯죽",e:"🍚",ig:["beef_soup", "mushroom", "rice", "garlic", "greenonion"],tm:25,cal:224,pro:20,tag:"메인",st:[{i:"🔪",t:"소고기+버섯 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 소고기 버섯죽"},
  {id:1609,nm:"소고기 김치죽",e:"🍚",ig:["beef_soup", "kimchi", "rice", "garlic", "greenonion"],tm:25,cal:242,pro:20,tag:"메인",st:[{i:"🔪",t:"소고기+김치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 소고기 김치죽"},
  {id:1610,nm:"소고기 시금치죽",e:"🍚",ig:["beef_soup", "spinach", "rice", "garlic", "greenonion"],tm:25,cal:280,pro:20,tag:"메인",st:[{i:"🔪",t:"소고기+시금치 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 소고기 시금치죽"},
  {id:1611,nm:"소고기 양파죽",e:"🍚",ig:["beef_soup", "onion", "rice", "garlic", "greenonion"],tm:25,cal:267,pro:20,tag:"메인",st:[{i:"🔪",t:"소고기+양파 다지기"},{i:"🍚",t:"밥+물 끓이기"},{i:"🧂",t:"참기름+소금+파"}],tp:"💡 속 편한 소고기 양파죽"},
  {id:1612,nm:"무고구마 볶음",e:"🥗",ig:["radish", "sweetpotato", "garlic", "greenonion"],tm:10,cal:84,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"무+고구마 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 무+고구마 볶음"},
  {id:1613,nm:"무고구마 무침",e:"🥗",ig:["radish", "sweetpotato", "garlic", "greenonion"],tm:15,cal:75,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"무+고구마 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 무+고구마 무침"},
  {id:1614,nm:"무애호박 볶음",e:"🥗",ig:["radish", "zucchini", "garlic", "greenonion"],tm:15,cal:108,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"무+애호박 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 무+애호박 볶음"},
  {id:1615,nm:"무시금치 무침",e:"🥗",ig:["radish", "spinach", "garlic", "greenonion"],tm:10,cal:80,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"무+시금치 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 무+시금치 무침"},
  {id:1616,nm:"감자무 볶음",e:"🥗",ig:["potato", "radish", "garlic", "greenonion"],tm:15,cal:89,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"감자+무 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 감자+무 볶음"},
  {id:1617,nm:"감자고구마 볶음",e:"🥗",ig:["potato", "sweetpotato", "garlic", "greenonion"],tm:10,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"감자+고구마 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 감자+고구마 볶음"},
  {id:1618,nm:"감자애호박 볶음",e:"🥗",ig:["potato", "zucchini", "garlic", "greenonion"],tm:10,cal:91,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"감자+애호박 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 감자+애호박 볶음"},
  {id:1619,nm:"감자깻잎 볶음",e:"🥗",ig:["potato", "sesame_leaf", "garlic", "greenonion"],tm:10,cal:104,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"감자+깻잎 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 감자+깻잎 볶음"},
  {id:1620,nm:"고구마애호박 볶음",e:"🥗",ig:["sweetpotato", "zucchini", "garlic", "greenonion"],tm:15,cal:85,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"고구마+애호박 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고구마+애호박 볶음"},
  {id:1621,nm:"양파무 무침",e:"🥗",ig:["onion", "radish", "garlic", "greenonion"],tm:15,cal:80,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양파+무 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+무 무침"},
  {id:1622,nm:"양파감자 무침",e:"🥗",ig:["onion", "potato", "garlic", "greenonion"],tm:10,cal:60,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양파+감자 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+감자 무침"},
  {id:1623,nm:"양파고구마 볶음",e:"🥗",ig:["onion", "sweetpotato", "garlic", "greenonion"],tm:10,cal:91,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양파+고구마 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+고구마 볶음"},
  {id:1624,nm:"양파애호박 볶음",e:"🥗",ig:["onion", "zucchini", "garlic", "greenonion"],tm:10,cal:99,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양파+애호박 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+애호박 볶음"},
  {id:1625,nm:"양파애호박 무침",e:"🥗",ig:["onion", "zucchini", "garlic", "greenonion"],tm:10,cal:57,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양파+애호박 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+애호박 무침"},
  {id:1626,nm:"양파시금치 볶음",e:"🥗",ig:["onion", "spinach", "garlic", "greenonion"],tm:10,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양파+시금치 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+시금치 볶음"},
  {id:1627,nm:"양파고추 무침",e:"🥗",ig:["onion", "pepper", "garlic", "greenonion"],tm:15,cal:76,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양파+고추 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+고추 무침"},
  {id:1628,nm:"양파깻잎 볶음",e:"🥗",ig:["onion", "sesame_leaf", "garlic", "greenonion"],tm:15,cal:100,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양파+깻잎 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+깻잎 볶음"},
  {id:1629,nm:"양파깻잎 무침",e:"🥗",ig:["onion", "sesame_leaf", "garlic", "greenonion"],tm:15,cal:66,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양파+깻잎 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양파+깻잎 무침"},
  {id:1630,nm:"당근무 볶음",e:"🥗",ig:["carrot", "radish", "garlic", "greenonion"],tm:15,cal:105,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"당근+무 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+무 볶음"},
  {id:1631,nm:"당근감자 볶음",e:"🥗",ig:["carrot", "potato", "garlic", "greenonion"],tm:15,cal:106,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"당근+감자 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+감자 볶음"},
  {id:1632,nm:"당근감자 무침",e:"🥗",ig:["carrot", "potato", "garlic", "greenonion"],tm:10,cal:70,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"당근+감자 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+감자 무침"},
  {id:1633,nm:"당근양파 볶음",e:"🥗",ig:["carrot", "onion", "garlic", "greenonion"],tm:10,cal:106,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"당근+양파 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+양파 볶음"},
  {id:1634,nm:"당근애호박 무침",e:"🥗",ig:["carrot", "zucchini", "garlic", "greenonion"],tm:15,cal:55,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"당근+애호박 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+애호박 무침"},
  {id:1635,nm:"당근버섯 볶음",e:"🥗",ig:["carrot", "mushroom", "garlic", "greenonion"],tm:10,cal:84,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"당근+버섯 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+버섯 볶음"},
  {id:1636,nm:"당근버섯 무침",e:"🥗",ig:["carrot", "mushroom", "garlic", "greenonion"],tm:10,cal:75,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"당근+버섯 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+버섯 무침"},
  {id:1637,nm:"당근깻잎 볶음",e:"🥗",ig:["carrot", "sesame_leaf", "garlic", "greenonion"],tm:10,cal:98,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"당근+깻잎 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 당근+깻잎 볶음"},
  {id:1638,nm:"버섯무 볶음",e:"🥗",ig:["mushroom", "radish", "garlic", "greenonion"],tm:10,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"버섯+무 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+무 볶음"},
  {id:1639,nm:"버섯무 무침",e:"🥗",ig:["mushroom", "radish", "garlic", "greenonion"],tm:15,cal:62,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"버섯+무 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+무 무침"},
  {id:1640,nm:"버섯고구마 무침",e:"🥗",ig:["mushroom", "sweetpotato", "garlic", "greenonion"],tm:15,cal:61,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"버섯+고구마 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+고구마 무침"},
  {id:1641,nm:"버섯양파 볶음",e:"🥗",ig:["mushroom", "onion", "garlic", "greenonion"],tm:15,cal:84,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"버섯+양파 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+양파 볶음"},
  {id:1642,nm:"버섯양파 무침",e:"🥗",ig:["mushroom", "onion", "garlic", "greenonion"],tm:15,cal:66,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"버섯+양파 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+양파 무침"},
  {id:1643,nm:"버섯애호박 볶음",e:"🥗",ig:["mushroom", "zucchini", "garlic", "greenonion"],tm:15,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"버섯+애호박 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+애호박 볶음"},
  {id:1644,nm:"버섯애호박 무침",e:"🥗",ig:["mushroom", "zucchini", "garlic", "greenonion"],tm:15,cal:72,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"버섯+애호박 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+애호박 무침"},
  {id:1645,nm:"버섯시금치 무침",e:"🥗",ig:["mushroom", "spinach", "garlic", "greenonion"],tm:10,cal:50,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"버섯+시금치 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+시금치 무침"},
  {id:1646,nm:"버섯고추 볶음",e:"🥗",ig:["mushroom", "pepper", "garlic", "greenonion"],tm:10,cal:105,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"버섯+고추 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+고추 볶음"},
  {id:1647,nm:"버섯깻잎 볶음",e:"🥗",ig:["mushroom", "sesame_leaf", "garlic", "greenonion"],tm:15,cal:100,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"버섯+깻잎 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 버섯+깻잎 볶음"},
  {id:1648,nm:"콩나물무 볶음",e:"🥗",ig:["bean_sprout", "radish", "garlic", "greenonion"],tm:15,cal:94,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+무 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+무 볶음"},
  {id:1649,nm:"콩나물무 무침",e:"🥗",ig:["bean_sprout", "radish", "garlic", "greenonion"],tm:15,cal:72,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+무 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+무 무침"},
  {id:1650,nm:"콩나물고구마 무침",e:"🥗",ig:["bean_sprout", "sweetpotato", "garlic", "greenonion"],tm:10,cal:52,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+고구마 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+고구마 무침"},
  {id:1651,nm:"콩나물양파 볶음",e:"🥗",ig:["bean_sprout", "onion", "garlic", "greenonion"],tm:15,cal:81,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+양파 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+양파 볶음"},
  {id:1652,nm:"콩나물양파 무침",e:"🥗",ig:["bean_sprout", "onion", "garlic", "greenonion"],tm:10,cal:71,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+양파 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+양파 무침"},
  {id:1653,nm:"콩나물애호박 무침",e:"🥗",ig:["bean_sprout", "zucchini", "garlic", "greenonion"],tm:10,cal:77,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+애호박 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+애호박 무침"},
  {id:1654,nm:"콩나물당근 무침",e:"🥗",ig:["bean_sprout", "carrot", "garlic", "greenonion"],tm:10,cal:76,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+당근 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+당근 무침"},
  {id:1655,nm:"콩나물버섯 무침",e:"🥗",ig:["bean_sprout", "mushroom", "garlic", "greenonion"],tm:10,cal:79,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+버섯 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+버섯 무침"},
  {id:1656,nm:"콩나물시금치 무침",e:"🥗",ig:["bean_sprout", "spinach", "garlic", "greenonion"],tm:10,cal:78,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+시금치 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+시금치 무침"},
  {id:1657,nm:"콩나물양배추 무침",e:"🥗",ig:["bean_sprout", "cabbage", "garlic", "greenonion"],tm:10,cal:61,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+양배추 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+양배추 무침"},
  {id:1658,nm:"콩나물고추 볶음",e:"🥗",ig:["bean_sprout", "pepper", "garlic", "greenonion"],tm:15,cal:109,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+고추 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+고추 볶음"},
  {id:1659,nm:"콩나물깻잎 볶음",e:"🥗",ig:["bean_sprout", "sesame_leaf", "garlic", "greenonion"],tm:10,cal:82,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"콩나물+깻잎 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 콩나물+깻잎 볶음"},
  {id:1660,nm:"시금치고구마 볶음",e:"🥗",ig:["spinach", "sweetpotato", "garlic", "greenonion"],tm:10,cal:80,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"시금치+고구마 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 시금치+고구마 볶음"},
  {id:1661,nm:"시금치애호박 볶음",e:"🥗",ig:["spinach", "zucchini", "garlic", "greenonion"],tm:10,cal:90,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"시금치+애호박 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 시금치+애호박 볶음"},
  {id:1662,nm:"시금치애호박 무침",e:"🥗",ig:["spinach", "zucchini", "garlic", "greenonion"],tm:15,cal:58,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"시금치+애호박 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 시금치+애호박 무침"},
  {id:1663,nm:"양배추무 무침",e:"🥗",ig:["cabbage", "radish", "garlic", "greenonion"],tm:10,cal:73,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추+무 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양배추+무 무침"},
  {id:1664,nm:"양배추감자 무침",e:"🥗",ig:["cabbage", "potato", "garlic", "greenonion"],tm:10,cal:69,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추+감자 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양배추+감자 무침"},
  {id:1665,nm:"양배추고구마 무침",e:"🥗",ig:["cabbage", "sweetpotato", "garlic", "greenonion"],tm:15,cal:59,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추+고구마 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양배추+고구마 무침"},
  {id:1666,nm:"양배추양파 무침",e:"🥗",ig:["cabbage", "onion", "garlic", "greenonion"],tm:15,cal:73,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추+양파 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양배추+양파 무침"},
  {id:1667,nm:"양배추당근 볶음",e:"🥗",ig:["cabbage", "carrot", "garlic", "greenonion"],tm:10,cal:100,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"양배추+당근 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양배추+당근 볶음"},
  {id:1668,nm:"양배추당근 무침",e:"🥗",ig:["cabbage", "carrot", "garlic", "greenonion"],tm:10,cal:62,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추+당근 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양배추+당근 무침"},
  {id:1669,nm:"양배추버섯 무침",e:"🥗",ig:["cabbage", "mushroom", "garlic", "greenonion"],tm:15,cal:62,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"양배추+버섯 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 양배추+버섯 무침"},
  {id:1670,nm:"고추무 무침",e:"🥗",ig:["pepper", "radish", "garlic", "greenonion"],tm:15,cal:66,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고추+무 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+무 무침"},
  {id:1671,nm:"고추감자 볶음",e:"🥗",ig:["pepper", "potato", "garlic", "greenonion"],tm:15,cal:82,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"고추+감자 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+감자 볶음"},
  {id:1672,nm:"고추감자 무침",e:"🥗",ig:["pepper", "potato", "garlic", "greenonion"],tm:15,cal:79,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고추+감자 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+감자 무침"},
  {id:1673,nm:"고추고구마 볶음",e:"🥗",ig:["pepper", "sweetpotato", "garlic", "greenonion"],tm:10,cal:95,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"고추+고구마 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+고구마 볶음"},
  {id:1674,nm:"고추애호박 무침",e:"🥗",ig:["pepper", "zucchini", "garlic", "greenonion"],tm:15,cal:62,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고추+애호박 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+애호박 무침"},
  {id:1675,nm:"고추시금치 무침",e:"🥗",ig:["pepper", "spinach", "garlic", "greenonion"],tm:15,cal:59,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고추+시금치 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+시금치 무침"},
  {id:1676,nm:"고추깻잎 볶음",e:"🥗",ig:["pepper", "sesame_leaf", "garlic", "greenonion"],tm:10,cal:87,pro:2,tag:"밑반찬",st:[{i:"🔪",t:"고추+깻잎 손질"},{i:"🔥",t:"참기름에 볶기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+깻잎 볶음"},
  {id:1677,nm:"고추깻잎 무침",e:"🥗",ig:["pepper", "sesame_leaf", "garlic", "greenonion"],tm:10,cal:54,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"고추+깻잎 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 고추+깻잎 무침"},
  {id:1678,nm:"깻잎애호박 무침",e:"🥗",ig:["sesame_leaf", "zucchini", "garlic", "greenonion"],tm:15,cal:79,pro:1,tag:"밑반찬",st:[{i:"🔪",t:"깻잎+애호박 손질"},{i:"🥗",t:"양념에 무치기"},{i:"🧂",t:"소금+깨"}],tp:"💡 깻잎+애호박 무침"},
  {id:1679,nm:"무 달걀볶음",e:"🍳",ig:["radish", "egg", "garlic", "greenonion"],tm:10,cal:123,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"무 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 무+달걀 조합"},
  {id:1680,nm:"무 달걀전",e:"🍳",ig:["radish", "egg", "garlic", "greenonion"],tm:10,cal:166,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"무 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 무+달걀 조합"},
  {id:1681,nm:"감자 달걀볶음",e:"🍳",ig:["potato", "egg", "garlic", "greenonion"],tm:15,cal:147,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"감자 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 감자+달걀 조합"},
  {id:1682,nm:"감자 달걀전",e:"🍳",ig:["potato", "egg", "garlic", "greenonion"],tm:15,cal:174,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"감자 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 감자+달걀 조합"},
  {id:1683,nm:"고구마 달걀볶음",e:"🍳",ig:["sweetpotato", "egg", "garlic", "greenonion"],tm:15,cal:150,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"고구마 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 고구마+달걀 조합"},
  {id:1684,nm:"고구마 달걀전",e:"🍳",ig:["sweetpotato", "egg", "garlic", "greenonion"],tm:10,cal:172,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"고구마 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 고구마+달걀 조합"},
  {id:1685,nm:"양파 달걀볶음",e:"🍳",ig:["onion", "egg", "garlic", "greenonion"],tm:10,cal:146,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"양파 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 양파+달걀 조합"},
  {id:1686,nm:"양파 달걀전",e:"🍳",ig:["onion", "egg", "garlic", "greenonion"],tm:10,cal:176,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"양파 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 양파+달걀 조합"},
  {id:1687,nm:"애호박 달걀볶음",e:"🍳",ig:["zucchini", "egg", "garlic", "greenonion"],tm:10,cal:150,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"애호박 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 애호박+달걀 조합"},
  {id:1688,nm:"애호박 달걀전",e:"🍳",ig:["zucchini", "egg", "garlic", "greenonion"],tm:15,cal:174,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"애호박 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 애호박+달걀 조합"},
  {id:1689,nm:"당근 달걀볶음",e:"🍳",ig:["carrot", "egg", "garlic", "greenonion"],tm:15,cal:138,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"당근 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 당근+달걀 조합"},
  {id:1690,nm:"당근 달걀전",e:"🍳",ig:["carrot", "egg", "garlic", "greenonion"],tm:15,cal:160,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"당근 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 당근+달걀 조합"},
  {id:1691,nm:"버섯 달걀볶음",e:"🍳",ig:["mushroom", "egg", "garlic", "greenonion"],tm:10,cal:122,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"버섯 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 버섯+달걀 조합"},
  {id:1692,nm:"버섯 달걀전",e:"🍳",ig:["mushroom", "egg", "garlic", "greenonion"],tm:10,cal:187,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"버섯 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 버섯+달걀 조합"},
  {id:1693,nm:"콩나물 달걀볶음",e:"🍳",ig:["bean_sprout", "egg", "garlic", "greenonion"],tm:15,cal:135,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"콩나물 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 콩나물+달걀 조합"},
  {id:1694,nm:"콩나물 달걀전",e:"🍳",ig:["bean_sprout", "egg", "garlic", "greenonion"],tm:15,cal:180,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"콩나물 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 콩나물+달걀 조합"},
  {id:1696,nm:"시금치 달걀전",e:"🍳",ig:["spinach", "egg", "garlic", "greenonion"],tm:10,cal:176,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"시금치 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 시금치+달걀 조합"},
  {id:1697,nm:"양배추 달걀볶음",e:"🍳",ig:["cabbage", "egg", "garlic", "greenonion"],tm:10,cal:138,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"양배추 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 양배추+달걀 조합"},
  {id:1698,nm:"양배추 달걀전",e:"🍳",ig:["cabbage", "egg", "garlic", "greenonion"],tm:15,cal:181,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"양배추 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 양배추+달걀 조합"},
  {id:1700,nm:"고추 달걀전",e:"🍳",ig:["pepper", "egg", "garlic", "greenonion"],tm:15,cal:173,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"고추 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 고추+달걀 조합"},
  {id:1701,nm:"깻잎 달걀볶음",e:"🍳",ig:["sesame_leaf", "egg", "garlic", "greenonion"],tm:15,cal:132,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"깻잎 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 깻잎+달걀 조합"},
  {id:1702,nm:"깻잎 달걀전",e:"🍳",ig:["sesame_leaf", "egg", "garlic", "greenonion"],tm:10,cal:189,pro:8,tag:"밑반찬",st:[{i:"🔪",t:"깻잎 손질"},{i:"🥚",t:"달걀과 함께"},{i:"🍳",t:"부치기/볶기"}],tp:"💡 깻잎+달걀 조합"},
  {id:1703,nm:"무 두부볶음",e:"🧈",ig:["tofu", "radish", "garlic", "greenonion"],tm:20,cal:136,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"무 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+무 조합"},
  {id:1704,nm:"감자 두부볶음",e:"🧈",ig:["tofu", "potato", "garlic", "greenonion"],tm:20,cal:134,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"감자 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+감자 조합"},
  {id:1705,nm:"양파 두부볶음",e:"🧈",ig:["tofu", "onion", "garlic", "greenonion"],tm:20,cal:142,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"양파 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+양파 조합"},
  {id:1706,nm:"애호박 두부볶음",e:"🧈",ig:["tofu", "zucchini", "garlic", "greenonion"],tm:20,cal:136,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"애호박 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+애호박 조합"},
  {id:1707,nm:"당근 두부볶음",e:"🧈",ig:["tofu", "carrot", "garlic", "greenonion"],tm:20,cal:156,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"당근 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+당근 조합"},
  {id:1708,nm:"버섯 두부볶음",e:"🧈",ig:["tofu", "mushroom", "garlic", "greenonion"],tm:20,cal:139,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"버섯 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+버섯 조합"},
  {id:1709,nm:"시금치 두부볶음",e:"🧈",ig:["tofu", "spinach", "garlic", "greenonion"],tm:20,cal:159,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"시금치 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+시금치 조합"},
  {id:1710,nm:"양배추 두부볶음",e:"🧈",ig:["tofu", "cabbage", "garlic", "greenonion"],tm:20,cal:144,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"양배추 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+양배추 조합"},
  {id:1711,nm:"감자 두부조림",e:"🧈",ig:["tofu", "potato", "garlic", "greenonion"],tm:20,cal:171,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"감자 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+감자 조합"},
  {id:1712,nm:"콩나물 두부조림",e:"🧈",ig:["tofu", "bean_sprout", "garlic", "greenonion"],tm:20,cal:161,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"콩나물 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+콩나물 조합"},
  {id:1713,nm:"양배추 두부조림",e:"🧈",ig:["tofu", "cabbage", "garlic", "greenonion"],tm:20,cal:153,pro:10,tag:"밑반찬",st:[{i:"🧈",t:"두부 굽기"},{i:"🔪",t:"양배추 넣기"},{i:"🥄",t:"간장 양념"}],tp:"💡 두부+양배추 조합"},
  {id:1714,nm:"소고기 무 국밥",e:"🍲",ig:["beef_soup", "radish", "rice", "garlic", "greenonion"],tm:30,cal:394,pro:20,tag:"메인",st:[{i:"🍲",t:"소고기+무 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 소고기 무 국밥!"},
  {id:1715,nm:"소고기 콩나물 국밥",e:"🍲",ig:["beef_soup", "bean_sprout", "rice", "garlic", "greenonion"],tm:30,cal:416,pro:20,tag:"메인",st:[{i:"🍲",t:"소고기+콩나물 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 소고기 콩나물 국밥!"},
  {id:1716,nm:"소고기 김치 국밥",e:"🍲",ig:["beef_soup", "kimchi", "rice", "garlic", "greenonion"],tm:30,cal:436,pro:20,tag:"메인",st:[{i:"🍲",t:"소고기+김치 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 소고기 김치 국밥!"},
  {id:1717,nm:"소고기 버섯 국밥",e:"🍲",ig:["beef_soup", "mushroom", "rice", "garlic", "greenonion"],tm:30,cal:410,pro:20,tag:"메인",st:[{i:"🍲",t:"소고기+버섯 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 소고기 버섯 국밥!"},
  {id:1718,nm:"삼겹 무 국밥",e:"🍲",ig:["pork_belly", "radish", "rice", "garlic", "greenonion"],tm:30,cal:432,pro:14,tag:"메인",st:[{i:"🍲",t:"삼겹+무 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 삼겹 무 국밥!"},
  {id:1719,nm:"삼겹 콩나물 국밥",e:"🍲",ig:["pork_belly", "bean_sprout", "rice", "garlic", "greenonion"],tm:30,cal:358,pro:14,tag:"메인",st:[{i:"🍲",t:"삼겹+콩나물 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 삼겹 콩나물 국밥!"},
  {id:1720,nm:"삼겹 김치 국밥",e:"🍲",ig:["pork_belly", "kimchi", "rice", "garlic", "greenonion"],tm:30,cal:428,pro:14,tag:"메인",st:[{i:"🍲",t:"삼겹+김치 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 삼겹 김치 국밥!"},
  {id:1721,nm:"삼겹 버섯 국밥",e:"🍲",ig:["pork_belly", "mushroom", "rice", "garlic", "greenonion"],tm:30,cal:403,pro:14,tag:"메인",st:[{i:"🍲",t:"삼겹+버섯 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 삼겹 버섯 국밥!"},
  {id:1722,nm:"목살 무 국밥",e:"🍲",ig:["pork_neck", "radish", "rice", "garlic", "greenonion"],tm:30,cal:393,pro:16,tag:"메인",st:[{i:"🍲",t:"목살+무 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 목살 무 국밥!"},
  {id:1723,nm:"목살 콩나물 국밥",e:"🍲",ig:["pork_neck", "bean_sprout", "rice", "garlic", "greenonion"],tm:30,cal:427,pro:16,tag:"메인",st:[{i:"🍲",t:"목살+콩나물 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 목살 콩나물 국밥!"},
  {id:1724,nm:"목살 김치 국밥",e:"🍲",ig:["pork_neck", "kimchi", "rice", "garlic", "greenonion"],tm:30,cal:369,pro:16,tag:"메인",st:[{i:"🍲",t:"목살+김치 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 목살 김치 국밥!"},
  {id:1725,nm:"목살 버섯 국밥",e:"🍲",ig:["pork_neck", "mushroom", "rice", "garlic", "greenonion"],tm:30,cal:387,pro:16,tag:"메인",st:[{i:"🍲",t:"목살+버섯 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 목살 버섯 국밥!"},
  {id:1726,nm:"어묵 무 국밥",e:"🍲",ig:["fishcake", "radish", "rice", "garlic", "greenonion"],tm:30,cal:394,pro:10,tag:"메인",st:[{i:"🍲",t:"어묵+무 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 어묵 무 국밥!"},
  {id:1727,nm:"어묵 콩나물 국밥",e:"🍲",ig:["fishcake", "bean_sprout", "rice", "garlic", "greenonion"],tm:30,cal:395,pro:10,tag:"메인",st:[{i:"🍲",t:"어묵+콩나물 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 어묵 콩나물 국밥!"},
  {id:1728,nm:"어묵 김치 국밥",e:"🍲",ig:["fishcake", "kimchi", "rice", "garlic", "greenonion"],tm:30,cal:391,pro:10,tag:"메인",st:[{i:"🍲",t:"어묵+김치 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 어묵 김치 국밥!"},
  {id:1729,nm:"어묵 버섯 국밥",e:"🍲",ig:["fishcake", "mushroom", "rice", "garlic", "greenonion"],tm:30,cal:402,pro:10,tag:"메인",st:[{i:"🍲",t:"어묵+버섯 국 끓이기"},{i:"🍚",t:"밥 말기"},{i:"🌿",t:"파+후추"}],tp:"💡 어묵 버섯 국밥!"},
  {id:1730,nm:"삼겹살 당근 비빔밥",e:"🍚",ig:["pork_belly", "carrot", "egg", "rice", "garlic", "greenonion"],tm:25,cal:417,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 양념 볶기"},{i:"🥬",t:"당근 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 삼겹살+당근 비빔밥"},
  {id:1731,nm:"삼겹살 시금치 비빔밥",e:"🍚",ig:["pork_belly", "spinach", "egg", "rice", "garlic", "greenonion"],tm:25,cal:448,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 양념 볶기"},{i:"🥬",t:"시금치 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 삼겹살+시금치 비빔밥"},
  {id:1732,nm:"삼겹살 콩나물 비빔밥",e:"🍚",ig:["pork_belly", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:415,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 양념 볶기"},{i:"🥬",t:"콩나물 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 삼겹살+콩나물 비빔밥"},
  {id:1733,nm:"삼겹살 버섯 비빔밥",e:"🍚",ig:["pork_belly", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:429,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 양념 볶기"},{i:"🥬",t:"버섯 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 삼겹살+버섯 비빔밥"},
  {id:1734,nm:"목살 당근 비빔밥",e:"🍚",ig:["pork_neck", "carrot", "egg", "rice", "garlic", "greenonion"],tm:25,cal:458,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 양념 볶기"},{i:"🥬",t:"당근 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 목살+당근 비빔밥"},
  {id:1735,nm:"목살 시금치 비빔밥",e:"🍚",ig:["pork_neck", "spinach", "egg", "rice", "garlic", "greenonion"],tm:25,cal:456,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 양념 볶기"},{i:"🥬",t:"시금치 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 목살+시금치 비빔밥"},
  {id:1736,nm:"목살 콩나물 비빔밥",e:"🍚",ig:["pork_neck", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:465,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 양념 볶기"},{i:"🥬",t:"콩나물 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 목살+콩나물 비빔밥"},
  {id:1737,nm:"닭가슴살 당근 비빔밥",e:"🍚",ig:["chicken_breast", "carrot", "egg", "rice", "garlic", "greenonion"],tm:25,cal:408,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 양념 볶기"},{i:"🥬",t:"당근 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 닭가슴살+당근 비빔밥"},
  {id:1738,nm:"닭가슴살 버섯 비빔밥",e:"🍚",ig:["chicken_breast", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:462,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 양념 볶기"},{i:"🥬",t:"버섯 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 닭가슴살+버섯 비빔밥"},
  {id:1739,nm:"닭가슴살 김치 비빔밥",e:"🍚",ig:["chicken_breast", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:25,cal:444,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 양념 볶기"},{i:"🥬",t:"김치 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 닭가슴살+김치 비빔밥"},
  {id:1740,nm:"소고기 콩나물 비빔밥",e:"🍚",ig:["beef_soup", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:478,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 양념 볶기"},{i:"🥬",t:"콩나물 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 소고기+콩나물 비빔밥"},
  {id:1741,nm:"소고기 버섯 비빔밥",e:"🍚",ig:["beef_soup", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:25,cal:478,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 양념 볶기"},{i:"🥬",t:"버섯 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 소고기+버섯 비빔밥"},
  {id:1742,nm:"소고기 김치 비빔밥",e:"🍚",ig:["beef_soup", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:25,cal:434,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 양념 볶기"},{i:"🥬",t:"김치 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 소고기+김치 비빔밥"},
  {id:1743,nm:"다짐육 시금치 비빔밥",e:"🍚",ig:["ground_pork", "spinach", "egg", "rice", "garlic", "greenonion"],tm:25,cal:416,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 양념 볶기"},{i:"🥬",t:"시금치 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 다짐육+시금치 비빔밥"},
  {id:1744,nm:"다짐육 콩나물 비빔밥",e:"🍚",ig:["ground_pork", "bean_sprout", "egg", "rice", "garlic", "greenonion"],tm:25,cal:459,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 양념 볶기"},{i:"🥬",t:"콩나물 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 다짐육+콩나물 비빔밥"},
  {id:1745,nm:"다짐육 김치 비빔밥",e:"🍚",ig:["ground_pork", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:25,cal:438,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 양념 볶기"},{i:"🥬",t:"김치 무치기"},{i:"🍚",t:"밥+나물+고기"},{i:"🥚",t:"달걀+고추장"}],tp:"💡 다짐육+김치 비빔밥"},
  {id:1746,nm:"삼겹살 무 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:266,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1747,nm:"삼겹살 감자 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:225,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1748,nm:"삼겹살 고구마 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:207,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1749,nm:"삼겹살 양파 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:284,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1750,nm:"삼겹살 애호박 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:218,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1751,nm:"삼겹살 당근 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:291,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1752,nm:"삼겹살 버섯 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:273,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1753,nm:"삼겹살 콩나물 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:239,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1754,nm:"삼겹살 시금치 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:226,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1755,nm:"삼겹살 양배추 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:266,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1756,nm:"삼겹살 고추 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:250,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1757,nm:"삼겹살 깻잎 김치찌개",e:"🍲",ig:["kimchi", "pork_belly", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:230,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1758,nm:"목살 무 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:224,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1759,nm:"목살 감자 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:267,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1760,nm:"목살 고구마 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:222,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1761,nm:"목살 양파 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:241,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1762,nm:"목살 애호박 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:289,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1763,nm:"목살 당근 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:253,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1764,nm:"목살 버섯 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:223,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1765,nm:"목살 콩나물 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:253,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1766,nm:"목살 시금치 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:201,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1767,nm:"목살 양배추 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:284,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1768,nm:"목살 고추 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:274,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1769,nm:"목살 깻잎 김치찌개",e:"🍲",ig:["kimchi", "pork_neck", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:217,pro:18,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1770,nm:"닭가슴살 무 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:226,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1771,nm:"닭가슴살 감자 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:212,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1772,nm:"닭가슴살 고구마 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:251,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1773,nm:"닭가슴살 양파 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:256,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1774,nm:"닭가슴살 애호박 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:254,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1775,nm:"닭가슴살 당근 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:258,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1776,nm:"닭가슴살 버섯 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:298,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1777,nm:"닭가슴살 콩나물 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:272,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1778,nm:"닭가슴살 시금치 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:294,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1779,nm:"닭가슴살 양배추 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:284,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1780,nm:"닭가슴살 고추 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:278,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1781,nm:"닭가슴살 깻잎 김치찌개",e:"🍲",ig:["kimchi", "chicken_breast", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:220,pro:28,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1782,nm:"소고기 무 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:295,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1783,nm:"소고기 감자 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:253,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1784,nm:"소고기 고구마 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:204,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1785,nm:"소고기 양파 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:270,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1786,nm:"소고기 애호박 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:279,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1787,nm:"소고기 당근 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:223,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1788,nm:"소고기 버섯 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:258,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1789,nm:"소고기 콩나물 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:271,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1790,nm:"소고기 시금치 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:293,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1791,nm:"소고기 양배추 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:220,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1792,nm:"소고기 고추 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:226,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1793,nm:"소고기 깻잎 김치찌개",e:"🍲",ig:["kimchi", "beef_soup", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:294,pro:22,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1794,nm:"다짐육 무 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:205,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1795,nm:"다짐육 감자 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:246,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1796,nm:"다짐육 고구마 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:214,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1797,nm:"다짐육 양파 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:296,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1798,nm:"다짐육 애호박 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:296,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1799,nm:"다짐육 당근 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:240,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1800,nm:"다짐육 버섯 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:234,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1801,nm:"다짐육 콩나물 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:278,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1802,nm:"다짐육 시금치 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:289,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1803,nm:"다짐육 양배추 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:298,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1804,nm:"다짐육 고추 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:275,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1805,nm:"다짐육 깻잎 김치찌개",e:"🍲",ig:["kimchi", "ground_pork", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:223,pro:16,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1806,nm:"스팸 무 김치찌개",e:"🍲",ig:["kimchi", "spam", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:205,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1807,nm:"스팸 감자 김치찌개",e:"🍲",ig:["kimchi", "spam", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:238,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1808,nm:"스팸 고구마 김치찌개",e:"🍲",ig:["kimchi", "spam", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:237,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1809,nm:"스팸 양파 김치찌개",e:"🍲",ig:["kimchi", "spam", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:205,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1810,nm:"스팸 애호박 김치찌개",e:"🍲",ig:["kimchi", "spam", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:238,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1811,nm:"스팸 당근 김치찌개",e:"🍲",ig:["kimchi", "spam", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:241,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1812,nm:"스팸 버섯 김치찌개",e:"🍲",ig:["kimchi", "spam", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:216,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1813,nm:"스팸 콩나물 김치찌개",e:"🍲",ig:["kimchi", "spam", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:278,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1814,nm:"스팸 시금치 김치찌개",e:"🍲",ig:["kimchi", "spam", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:275,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1815,nm:"스팸 양배추 김치찌개",e:"🍲",ig:["kimchi", "spam", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:250,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1816,nm:"스팸 고추 김치찌개",e:"🍲",ig:["kimchi", "spam", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:277,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1817,nm:"스팸 깻잎 김치찌개",e:"🍲",ig:["kimchi", "spam", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:239,pro:14,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1818,nm:"참치 무 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:278,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1819,nm:"참치 감자 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:269,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1820,nm:"참치 고구마 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:268,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1821,nm:"참치 양파 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:283,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1822,nm:"참치 애호박 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:272,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1823,nm:"참치 당근 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:298,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1824,nm:"참치 버섯 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:225,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1825,nm:"참치 콩나물 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:264,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1826,nm:"참치 시금치 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:272,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1827,nm:"참치 양배추 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:276,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1828,nm:"참치 고추 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:264,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1829,nm:"참치 깻잎 김치찌개",e:"🍲",ig:["kimchi", "tuna_can", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:204,pro:20,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1830,nm:"어묵 무 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "radish", "tofu", "garlic", "greenonion"],tm:25,cal:217,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"무+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 무 추가!"},
  {id:1831,nm:"어묵 감자 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "potato", "tofu", "garlic", "greenonion"],tm:25,cal:238,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"감자+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 감자 추가!"},
  {id:1832,nm:"어묵 고구마 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "sweetpotato", "tofu", "garlic", "greenonion"],tm:25,cal:244,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고구마+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고구마 추가!"},
  {id:1833,nm:"어묵 양파 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "onion", "tofu", "garlic", "greenonion"],tm:25,cal:204,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양파+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양파 추가!"},
  {id:1834,nm:"어묵 애호박 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "zucchini", "tofu", "garlic", "greenonion"],tm:25,cal:217,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"애호박+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 애호박 추가!"},
  {id:1835,nm:"어묵 당근 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "carrot", "tofu", "garlic", "greenonion"],tm:25,cal:232,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"당근+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 당근 추가!"},
  {id:1836,nm:"어묵 버섯 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "mushroom", "tofu", "garlic", "greenonion"],tm:25,cal:236,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"버섯+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 버섯 추가!"},
  {id:1837,nm:"어묵 콩나물 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "bean_sprout", "tofu", "garlic", "greenonion"],tm:25,cal:271,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"콩나물+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 콩나물 추가!"},
  {id:1838,nm:"어묵 시금치 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "spinach", "tofu", "garlic", "greenonion"],tm:25,cal:246,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"시금치+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 시금치 추가!"},
  {id:1839,nm:"어묵 양배추 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "cabbage", "tofu", "garlic", "greenonion"],tm:25,cal:211,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"양배추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 양배추 추가!"},
  {id:1840,nm:"어묵 고추 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "pepper", "tofu", "garlic", "greenonion"],tm:25,cal:283,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"고추+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 고추 추가!"},
  {id:1841,nm:"어묵 깻잎 김치찌개",e:"🍲",ig:["kimchi", "fishcake", "sesame_leaf", "tofu", "garlic", "greenonion"],tm:25,cal:262,pro:12,tag:"국/찌개",st:[{i:"🥬",t:"김치+고기 볶기"},{i:"💧",t:"물 넣고 끓이기"},{i:"🔪",t:"깻잎+두부 넣기"},{i:"🌿",t:"파"}],tp:"💡 김치찌개에 깻잎 추가!"},
  {id:1842,nm:"김치무볶음",e:"🥬",ig:["kimchi", "radish", "garlic", "greenonion"],tm:10,cal:87,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"무 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+무 볶음"},
  {id:1843,nm:"김치감자볶음",e:"🥬",ig:["kimchi", "potato", "garlic", "greenonion"],tm:10,cal:74,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"감자 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+감자 볶음"},
  {id:1844,nm:"김치고구마볶음",e:"🥬",ig:["kimchi", "sweetpotato", "garlic", "greenonion"],tm:10,cal:70,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"고구마 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+고구마 볶음"},
  {id:1845,nm:"김치양파볶음",e:"🥬",ig:["kimchi", "onion", "garlic", "greenonion"],tm:10,cal:76,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"양파 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+양파 볶음"},
  {id:1846,nm:"김치애호박볶음",e:"🥬",ig:["kimchi", "zucchini", "garlic", "greenonion"],tm:10,cal:61,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"애호박 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+애호박 볶음"},
  {id:1847,nm:"김치당근볶음",e:"🥬",ig:["kimchi", "carrot", "garlic", "greenonion"],tm:10,cal:100,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"당근 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+당근 볶음"},
  {id:1848,nm:"김치버섯볶음",e:"🥬",ig:["kimchi", "mushroom", "garlic", "greenonion"],tm:10,cal:91,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"버섯 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+버섯 볶음"},
  {id:1849,nm:"김치콩나물볶음",e:"🥬",ig:["kimchi", "bean_sprout", "garlic", "greenonion"],tm:10,cal:77,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"콩나물 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+콩나물 볶음"},
  {id:1850,nm:"김치시금치볶음",e:"🥬",ig:["kimchi", "spinach", "garlic", "greenonion"],tm:10,cal:84,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"시금치 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+시금치 볶음"},
  {id:1851,nm:"김치양배추볶음",e:"🥬",ig:["kimchi", "cabbage", "garlic", "greenonion"],tm:10,cal:83,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"양배추 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+양배추 볶음"},
  {id:1852,nm:"김치고추볶음",e:"🥬",ig:["kimchi", "pepper", "garlic", "greenonion"],tm:10,cal:60,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"고추 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+고추 볶음"},
  {id:1853,nm:"김치깻잎볶음",e:"🥬",ig:["kimchi", "sesame_leaf", "garlic", "greenonion"],tm:10,cal:66,pro:2,tag:"밑반찬",st:[{i:"🥬",t:"김치 볶기"},{i:"🔪",t:"깻잎 넣기"},{i:"🧂",t:"참기름"}],tp:"💡 김치+깻잎 볶음"},
  {id:1854,nm:"삼겹살 양파 오므라이스",e:"🍳",ig:["pork_belly", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:393,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+양파 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 삼겹살 양파 오므라이스"},
  {id:1855,nm:"삼겹살 김치 오므라이스",e:"🍳",ig:["pork_belly", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:438,pro:16,tag:"메인",st:[{i:"🔪",t:"삼겹살+김치 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 삼겹살 김치 오므라이스"},
  {id:1856,nm:"목살 양파 오므라이스",e:"🍳",ig:["pork_neck", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:439,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+양파 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 목살 양파 오므라이스"},
  {id:1857,nm:"목살 버섯 오므라이스",e:"🍳",ig:["pork_neck", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:20,cal:380,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+버섯 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 목살 버섯 오므라이스"},
  {id:1858,nm:"목살 김치 오므라이스",e:"🍳",ig:["pork_neck", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:453,pro:18,tag:"메인",st:[{i:"🔪",t:"목살+김치 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 목살 김치 오므라이스"},
  {id:1859,nm:"닭가슴살 김치 오므라이스",e:"🍳",ig:["chicken_breast", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:412,pro:28,tag:"메인",st:[{i:"🔪",t:"닭가슴살+김치 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 닭가슴살 김치 오므라이스"},
  {id:1860,nm:"소고기 양파 오므라이스",e:"🍳",ig:["beef_soup", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:435,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+양파 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 소고기 양파 오므라이스"},
  {id:1861,nm:"소고기 버섯 오므라이스",e:"🍳",ig:["beef_soup", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:20,cal:421,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+버섯 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 소고기 버섯 오므라이스"},
  {id:1862,nm:"소고기 당근 오므라이스",e:"🍳",ig:["beef_soup", "carrot", "egg", "rice", "garlic", "greenonion"],tm:20,cal:415,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+당근 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 소고기 당근 오므라이스"},
  {id:1863,nm:"소고기 김치 오므라이스",e:"🍳",ig:["beef_soup", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:423,pro:22,tag:"메인",st:[{i:"🔪",t:"소고기+김치 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 소고기 김치 오므라이스"},
  {id:1864,nm:"다짐육 버섯 오므라이스",e:"🍳",ig:["ground_pork", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:20,cal:412,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+버섯 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 다짐육 버섯 오므라이스"},
  {id:1865,nm:"다짐육 김치 오므라이스",e:"🍳",ig:["ground_pork", "kimchi", "egg", "rice", "garlic", "greenonion"],tm:20,cal:436,pro:16,tag:"메인",st:[{i:"🔪",t:"다짐육+김치 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 다짐육 김치 오므라이스"},
  {id:1866,nm:"스팸 양파 오므라이스",e:"🍳",ig:["spam", "onion", "egg", "rice", "garlic", "greenonion"],tm:20,cal:449,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+양파 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 스팸 양파 오므라이스"},
  {id:1867,nm:"스팸 버섯 오므라이스",e:"🍳",ig:["spam", "mushroom", "egg", "rice", "garlic", "greenonion"],tm:20,cal:435,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+버섯 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 스팸 버섯 오므라이스"},
  {id:1868,nm:"스팸 당근 오므라이스",e:"🍳",ig:["spam", "carrot", "egg", "rice", "garlic", "greenonion"],tm:20,cal:409,pro:14,tag:"메인",st:[{i:"🔪",t:"스팸+당근 볶음밥"},{i:"🥚",t:"달걀 얇게 부치기"},{i:"🍳",t:"볶음밥 감싸기"}],tp:"💡 스팸 당근 오므라이스"},
  {id:1869,nm:"삼겹살 감자 카레",e:"🍛",ig:["pork_belly", "potato", "onion", "carrot", "rice", "garlic"],tm:35,cal:456,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"감자+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 감자 넣은 삼겹살 카레"},
  {id:1870,nm:"삼겹살 고구마 카레",e:"🍛",ig:["pork_belly", "sweetpotato", "onion", "carrot", "rice", "garlic"],tm:35,cal:430,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"고구마+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 고구마 넣은 삼겹살 카레"},
  {id:1871,nm:"삼겹살 양배추 카레",e:"🍛",ig:["pork_belly", "cabbage", "onion", "carrot", "rice", "garlic"],tm:35,cal:477,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"양배추+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 양배추 넣은 삼겹살 카레"},
  {id:1872,nm:"삼겹살 버섯 카레",e:"🍛",ig:["pork_belly", "mushroom", "onion", "carrot", "rice", "garlic"],tm:35,cal:476,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹살 볶기"},{i:"🔪",t:"버섯+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 버섯 넣은 삼겹살 카레"},
  {id:1873,nm:"목살 감자 카레",e:"🍛",ig:["pork_neck", "potato", "onion", "carrot", "rice", "garlic"],tm:35,cal:488,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"감자+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 감자 넣은 목살 카레"},
  {id:1874,nm:"목살 고구마 카레",e:"🍛",ig:["pork_neck", "sweetpotato", "onion", "carrot", "rice", "garlic"],tm:35,cal:482,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"고구마+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 고구마 넣은 목살 카레"},
  {id:1875,nm:"목살 양배추 카레",e:"🍛",ig:["pork_neck", "cabbage", "onion", "carrot", "rice", "garlic"],tm:35,cal:470,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"양배추+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 양배추 넣은 목살 카레"},
  {id:1876,nm:"목살 버섯 카레",e:"🍛",ig:["pork_neck", "mushroom", "onion", "carrot", "rice", "garlic"],tm:35,cal:458,pro:18,tag:"메인",st:[{i:"🥩",t:"목살 볶기"},{i:"🔪",t:"버섯+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 버섯 넣은 목살 카레"},
  {id:1877,nm:"닭가슴살 감자 카레",e:"🍛",ig:["chicken_breast", "potato", "onion", "carrot", "rice", "garlic"],tm:35,cal:484,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"감자+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 감자 넣은 닭가슴살 카레"},
  {id:1878,nm:"닭가슴살 고구마 카레",e:"🍛",ig:["chicken_breast", "sweetpotato", "onion", "carrot", "rice", "garlic"],tm:35,cal:490,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"고구마+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 고구마 넣은 닭가슴살 카레"},
  {id:1879,nm:"닭가슴살 양배추 카레",e:"🍛",ig:["chicken_breast", "cabbage", "onion", "carrot", "rice", "garlic"],tm:35,cal:433,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"양배추+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 양배추 넣은 닭가슴살 카레"},
  {id:1880,nm:"닭가슴살 버섯 카레",e:"🍛",ig:["chicken_breast", "mushroom", "onion", "carrot", "rice", "garlic"],tm:35,cal:463,pro:28,tag:"메인",st:[{i:"🥩",t:"닭가슴살 볶기"},{i:"🔪",t:"버섯+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 버섯 넣은 닭가슴살 카레"},
  {id:1881,nm:"소고기 감자 카레",e:"🍛",ig:["beef_soup", "potato", "onion", "carrot", "rice", "garlic"],tm:35,cal:431,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"감자+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 감자 넣은 소고기 카레"},
  {id:1882,nm:"소고기 고구마 카레",e:"🍛",ig:["beef_soup", "sweetpotato", "onion", "carrot", "rice", "garlic"],tm:35,cal:434,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"고구마+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 고구마 넣은 소고기 카레"},
  {id:1883,nm:"소고기 양배추 카레",e:"🍛",ig:["beef_soup", "cabbage", "onion", "carrot", "rice", "garlic"],tm:35,cal:477,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"양배추+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 양배추 넣은 소고기 카레"},
  {id:1884,nm:"소고기 버섯 카레",e:"🍛",ig:["beef_soup", "mushroom", "onion", "carrot", "rice", "garlic"],tm:35,cal:454,pro:22,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:"🔪",t:"버섯+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 버섯 넣은 소고기 카레"},
  {id:1885,nm:"다짐육 감자 카레",e:"🍛",ig:["ground_pork", "potato", "onion", "carrot", "rice", "garlic"],tm:35,cal:444,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"감자+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 감자 넣은 다짐육 카레"},
  {id:1886,nm:"다짐육 고구마 카레",e:"🍛",ig:["ground_pork", "sweetpotato", "onion", "carrot", "rice", "garlic"],tm:35,cal:463,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"고구마+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 고구마 넣은 다짐육 카레"},
  {id:1887,nm:"다짐육 양배추 카레",e:"🍛",ig:["ground_pork", "cabbage", "onion", "carrot", "rice", "garlic"],tm:35,cal:446,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"양배추+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 양배추 넣은 다짐육 카레"},
  {id:1888,nm:"다짐육 버섯 카레",e:"🍛",ig:["ground_pork", "mushroom", "onion", "carrot", "rice", "garlic"],tm:35,cal:488,pro:16,tag:"메인",st:[{i:"🥩",t:"다짐육 볶기"},{i:"🔪",t:"버섯+양파+당근"},{i:"💧",t:"물+끓이기"},{i:"🍛",t:"카레루 녹이기"}],tp:"💡 버섯 넣은 다짐육 카레"},
  {id:1889,nm:"삼겹 김치 순두부찌개",e:"🍲",ig:["pork_belly", "tofu", "egg", "garlic", "greenonion", "kimchi"],tm:20,cal:259,pro:14,tag:"국/찌개",st:[{i:"🔥",t:"삼겹 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 김치 맛 삼겹 순두부"},
  {id:1890,nm:"삼겹 해물풍 순두부찌개",e:"🍲",ig:["pork_belly", "tofu", "egg", "garlic", "greenonion", "mushroom"],tm:20,cal:191,pro:14,tag:"국/찌개",st:[{i:"🔥",t:"삼겹 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 해물풍 맛 삼겹 순두부"},
  {id:1891,nm:"삼겹 맑은 순두부찌개",e:"🍲",ig:["pork_belly", "tofu", "egg", "garlic", "greenonion"],tm:20,cal:184,pro:14,tag:"국/찌개",st:[{i:"🔥",t:"삼겹 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 맑은 맛 삼겹 순두부"},
  {id:1892,nm:"목살 김치 순두부찌개",e:"🍲",ig:["pork_neck", "tofu", "egg", "garlic", "greenonion", "kimchi"],tm:20,cal:219,pro:16,tag:"국/찌개",st:[{i:"🔥",t:"목살 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 김치 맛 목살 순두부"},
  {id:1893,nm:"목살 해물풍 순두부찌개",e:"🍲",ig:["pork_neck", "tofu", "egg", "garlic", "greenonion", "mushroom"],tm:20,cal:244,pro:16,tag:"국/찌개",st:[{i:"🔥",t:"목살 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 해물풍 맛 목살 순두부"},
  {id:1894,nm:"목살 맑은 순두부찌개",e:"🍲",ig:["pork_neck", "tofu", "egg", "garlic", "greenonion"],tm:20,cal:239,pro:16,tag:"국/찌개",st:[{i:"🔥",t:"목살 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 맑은 맛 목살 순두부"},
  {id:1895,nm:"스팸 김치 순두부찌개",e:"🍲",ig:["spam", "tofu", "egg", "garlic", "greenonion", "kimchi"],tm:20,cal:226,pro:12,tag:"국/찌개",st:[{i:"🔥",t:"스팸 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 김치 맛 스팸 순두부"},
  {id:1896,nm:"스팸 해물풍 순두부찌개",e:"🍲",ig:["spam", "tofu", "egg", "garlic", "greenonion", "mushroom"],tm:20,cal:240,pro:12,tag:"국/찌개",st:[{i:"🔥",t:"스팸 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 해물풍 맛 스팸 순두부"},
  {id:1897,nm:"스팸 맑은 순두부찌개",e:"🍲",ig:["spam", "tofu", "egg", "garlic", "greenonion"],tm:20,cal:213,pro:12,tag:"국/찌개",st:[{i:"🔥",t:"스팸 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 맑은 맛 스팸 순두부"},
  {id:1898,nm:"참치 김치 순두부찌개",e:"🍲",ig:["tuna_can", "tofu", "egg", "garlic", "greenonion", "kimchi"],tm:20,cal:203,pro:16,tag:"국/찌개",st:[{i:"🔥",t:"참치 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 김치 맛 참치 순두부"},
  {id:1899,nm:"참치 해물풍 순두부찌개",e:"🍲",ig:["tuna_can", "tofu", "egg", "garlic", "greenonion", "mushroom"],tm:20,cal:252,pro:16,tag:"국/찌개",st:[{i:"🔥",t:"참치 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 해물풍 맛 참치 순두부"},
  {id:1900,nm:"참치 맑은 순두부찌개",e:"🍲",ig:["tuna_can", "tofu", "egg", "garlic", "greenonion"],tm:20,cal:222,pro:16,tag:"국/찌개",st:[{i:"🔥",t:"참치 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 맑은 맛 참치 순두부"},
  {id:1901,nm:"어묵 김치 순두부찌개",e:"🍲",ig:["fishcake", "tofu", "egg", "garlic", "greenonion", "kimchi"],tm:20,cal:214,pro:10,tag:"국/찌개",st:[{i:"🔥",t:"어묵 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 김치 맛 어묵 순두부"},
  {id:1902,nm:"어묵 해물풍 순두부찌개",e:"🍲",ig:["fishcake", "tofu", "egg", "garlic", "greenonion", "mushroom"],tm:20,cal:183,pro:10,tag:"국/찌개",st:[{i:"🔥",t:"어묵 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 해물풍 맛 어묵 순두부"},
  {id:1903,nm:"어묵 맑은 순두부찌개",e:"🍲",ig:["fishcake", "tofu", "egg", "garlic", "greenonion"],tm:20,cal:232,pro:10,tag:"국/찌개",st:[{i:"🔥",t:"어묵 볶기"},{i:"💧",t:"물+양념"},{i:"🧈",t:"두부 떠넣기"},{i:"🥚",t:"달걀"}],tp:"💡 맑은 맛 어묵 순두부"},
  {id:1904,nm:"소고기 양파 장조림",e:"🍛",ig:["beef_soup", "onion", "garlic", "greenonion"],tm:30,cal:132,pro:20,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"소고기+양파 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 소고기 양파 장조림"},
  {id:1905,nm:"소고기 버섯 장조림",e:"🍛",ig:["beef_soup", "mushroom", "garlic", "greenonion"],tm:30,cal:160,pro:20,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"소고기+버섯 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 소고기 버섯 장조림"},
  {id:1906,nm:"소고기 깻잎 장조림",e:"🍛",ig:["beef_soup", "sesame_leaf", "garlic", "greenonion"],tm:30,cal:130,pro:20,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"소고기+깻잎 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 소고기 깻잎 장조림"},
  {id:1907,nm:"달걀 감자 장조림",e:"🍛",ig:["egg", "potato", "garlic", "greenonion"],tm:30,cal:139,pro:12,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"달걀+감자 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 달걀 감자 장조림"},
  {id:1908,nm:"달걀 깻잎 장조림",e:"🍛",ig:["egg", "sesame_leaf", "garlic", "greenonion"],tm:30,cal:140,pro:12,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"달걀+깻잎 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 달걀 깻잎 장조림"},
  {id:1909,nm:"두부 감자 장조림",e:"🍛",ig:["tofu", "potato", "garlic", "greenonion"],tm:30,cal:148,pro:8,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"두부+감자 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 두부 감자 장조림"},
  {id:1910,nm:"두부 버섯 장조림",e:"🍛",ig:["tofu", "mushroom", "garlic", "greenonion"],tm:30,cal:134,pro:8,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"두부+버섯 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 두부 버섯 장조림"},
  {id:1911,nm:"두부 깻잎 장조림",e:"🍛",ig:["tofu", "sesame_leaf", "garlic", "greenonion"],tm:30,cal:170,pro:8,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"두부+깻잎 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 두부 깻잎 장조림"},
  {id:1912,nm:"스팸 감자 장조림",e:"🍛",ig:["spam", "potato", "garlic", "greenonion"],tm:30,cal:130,pro:10,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"스팸+감자 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 스팸 감자 장조림"},
  {id:1913,nm:"스팸 깻잎 장조림",e:"🍛",ig:["spam", "sesame_leaf", "garlic", "greenonion"],tm:30,cal:126,pro:10,tag:"밑반찬",st:[{i:"🍲",t:"간장+설탕+마늘 끓이기"},{i:"🥩",t:"스팸+깻잎 넣기"},{i:"⏱️",t:"약불 15분"}],tp:"💡 스팸 깻잎 장조림"}
];
function buildPlan(sel,nDays,wk){
  const av=RCP.filter(r=>r.ig.every(i=>sel.includes(i)));
  const ms=av.filter(r=>r.tag==="메인"),ss=av.filter(r=>r.tag==="국/찌개"),sd=av.filter(r=>r.tag==="밑반찬");
  const cov={};sel.forEach(id=>{cov[id]=0});
  const addC=r=>r.ig.forEach(id=>{if(cov[id]!==undefined)cov[id]++});
  const sc=r=>r.ig.filter(id=>(cov[id]||0)===0).length*10+r.ig.filter(id=>(cov[id]||0)<2).length*3;
  const pick=(pool,used)=>{const c=pool.filter(r=>!used.has(r.id));if(!c.length)return null;c.sort((a,b)=>sc(b)-sc(a));const t=c.slice(0,Math.min(3,c.length));return t[Math.floor(Math.random()*t.length)]};
  const labs=wk?["월","화","수","목","금","토","일"]:["월","화","수","목","금"];
  const uM=new Set,uS=new Set,uSd=new Set;const plan=[];
  for(let i=0;i<nDays;i++){
    const isW=wk&&i>=5;const din=[];
    // 무조건 메인1 + 국1 + 반찬1
    const m=pick(ms,uM);if(m){uM.add(m.id);addC(m);din.push({...m,role:"메인"})}
    const s=pick(ss,uS);if(s){uS.add(s.id);addC(s);din.push({...s,role:"국/찌개"})}
    const s1=pick(sd,uSd);if(s1){uSd.add(s1.id);addC(s1);din.push({...s1,role:"밑반찬"})}
    // 주말 반찬 추가
    if(isW){const s2=pick(sd,uSd);if(s2){uSd.add(s2.id);addC(s2);din.push({...s2,role:"밑반찬"})}}
    let lu=null;
    if(isW){const lm=pick(ms,uM);if(lm){uM.add(lm.id);addC(lm);lu={...lm,role:"점심"}}}
    plan.push({day:labs[i],isW,dinner:din,lunch:lu})
  }
  const unc=sel.filter(id=>cov[id]===0&&!["rice","garlic","greenonion"].includes(id));
  // 추가재료 추천
  const suggest=[];
  const notSel=INGS.filter(i=>!sel.includes(i.id));
  notSel.forEach(ig=>{
    const extra=RCP.filter(r=>r.tag==="메인"&&!r.ig.every(i=>sel.includes(i))&&r.ig.includes(ig.id)&&r.ig.filter(i=>!sel.includes(i)).length===1);
    if(extra.length>=2)suggest.push({ing:ig,recipes:extra.slice(0,3)});
  });
  return{plan,cov,unc,suggest:suggest.slice(0,3)}
}

function analyzeNut(plan){
  let tc=0,tp=0,ml=0;
  plan.forEach(d=>{d.dinner.forEach(m=>{tc+=m.cal;tp+=m.pro;ml++});if(d.lunch){tc+=d.lunch.cal;tp+=d.lunch.pro;ml++}});
  const dc=Math.round(tc/plan.length),dp=Math.round(tp/plan.length);
  const tips=[];
  if(dp<30)tips.push({icon:"🥩",text:"단백질 부족! 육류·달걀·두부 추가 필요",t:"danger"});
  else if(dp<45)tips.push({icon:"🥚",text:"단백질 조금 부족. 달걀·두부 보충 추천",t:"warn"});
  else tips.push({icon:"💪",text:"단백질 양호! 균형 잡힌 식단이에요",t:"good"});
  tips.push({icon:"🥛",text:"유제품+과일 간식으로 칼슘·비타민C 보충",t:"info"});
  tips.push({icon:"🐟",text:"주 1~2회 생선이나 견과류 추가 추천",t:"info"});
  return{tc,tp,dc,dp,ml,tips}
}

const leftTips={radish:"무채 냉동→다음주 무국",potato:"삶아 으깨→샐러드·수프",sweetpotato:"삶아서 간식/조림",bean_sprout:"데쳐서 참기름무침",spinach:"소분 냉동→된장국",mushroom:"찢어 냉동→한달OK",carrot:"스틱으로 간식",cabbage:"쌈/샐러드로",pepper:"다져 냉동→찌개",zucchini:"얇게 냉동→찌개",anchovy:"밀폐냉동→6개월",noodle:"유통기한 길어요",ramen:"실온6개월OK",fishcake:"냉동보관→어묵탕에",ricecake:"냉동3개월→떡볶이에",sesame_leaf:"물에 꽂아 냉장→5일"};

// ═══ APP ═══
export default function App(){
  const[page,setPage]=useState("home"); // home|plan|calendar
  const[step,setStep]=useState(0);
  const[pt,setPt]=useState(null);
  const[sel,setSel]=useState(["rice","garlic","greenonion"]);
  const[res,setRes]=useState(null);
  const[di,setDi]=useState(0);
  const[mod,setMod]=useState(null);
  const[saved,setSaved]=useState([]);
  const[viewPlan,setViewPlan]=useState(null); // saved plan being viewed
  const[viewDay,setViewDay]=useState(0); // day index in viewed plan
  const[saveMsg,setSaveMsg]=useState("");
  const[showSaveModal,setShowSaveModal]=useState(false);
  const[saveWeek,setSaveWeek]=useState(0); // 0=이번주, 1=다음주, etc

  // Load saved plans from storage
  useEffect(()=>{
    (async()=>{try{const r=await window.storage.get("saved_plans");if(r)setSaved(JSON.parse(r.value))}catch(e){}})();
  },[]);

  const savePlan=async(weekOffset=0)=>{
    if(!res)return;
    const now=new Date();
    const mon=getMonday(now);
    mon.setDate(mon.getDate()+weekOffset*7);
    const entry={id:Date.now(),created:now.toISOString(),weekStart:mon.toISOString(),planType:pt,plan:res.plan,sel:[...sel],total:sh.reduce((s,i)=>s+i.p,0)};
    const next=[entry,...saved.filter(s=>s.weekStart!==mon.toISOString())].slice(0,20);
    setSaved(next);
    try{await window.storage.set("saved_plans",JSON.stringify(next))}catch(e){}
    setSaveMsg("✅ 저장완료!");setShowSaveModal(false);setTimeout(()=>setSaveMsg(""),2000);
  };

  const deletePlan=async(id)=>{
    const next=saved.filter(s=>s.id!==id);
    setSaved(next);
    try{await window.storage.set("saved_plans",JSON.stringify(next))}catch(e){}
  };

  const tog=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const av=useMemo(()=>RCP.filter(r=>r.ig.every(i=>sel.includes(i))),[sel]);
  const sh=INGS.filter(i=>sel.includes(i.id));
  const tot=sh.reduce((s,i)=>s+i.p,0);
  const nut=res?analyzeNut(res.plan):null;
  const gen=()=>{setRes(buildPlan(sel,pt==="7day"?7:5,pt==="7day"));setDi(0);setStep(3);setPage("plan")};

  // Calendar helpers
  const getMonday=(d)=>{const dt=new Date(d);const day=dt.getDay();const diff=dt.getDate()-day+(day===0?-6:1);return new Date(dt.setDate(diff))};
  const fmtDate=(d)=>{const dt=new Date(d);return`${dt.getMonth()+1}/${dt.getDate()}`};
  const fmtWeek=(d)=>{const dt=new Date(d);const end=new Date(dt);end.setDate(end.getDate()+6);return`${dt.getMonth()+1}/${dt.getDate()} ~ ${end.getMonth()+1}/${end.getDate()}`};
  const getWeekLabel=(offset)=>{const m=getMonday(new Date());m.setDate(m.getDate()+offset*7);const e=new Date(m);e.setDate(e.getDate()+6);const monthNum=m.getMonth()+1;const weekOfMonth=Math.ceil(m.getDate()/7);return{label:`${monthNum}월 ${weekOfMonth}주차`,range:`${m.getMonth()+1}/${m.getDate()}~${e.getMonth()+1}/${e.getDate()}`}};

  // Colors
  const bg="#FAF7F2",tx="#2D2418",su="#8B7E6A",ac="#E8613C",gn="#2B7A4B",pu="#7C3AED",bd="#EDE8E0",wm="#F5E6D3";
  const tcol=(tag,ai)=>{if(ai)return{bg:pu,c:"#fff"};if(tag==="국/찌개")return{bg:"#2563EB",c:"#fff"};if(tag==="메인")return{bg:ac,c:"#fff"};return{bg:gn,c:"#fff"}};

  const Card=({r})=>{const c=tcol(r.tag,r.ai);return(
    <div onClick={()=>setMod(r)} style={{background:r.ai?"#FDFBFF":"#fff",borderRadius:14,padding:"12px 14px",border:r.ai?"1.5px solid #DDD6FE":`1px solid ${bd}`,cursor:"pointer",transition:"all .15s"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.06)";e.currentTarget.style.transform="translateY(-1px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <span style={{fontSize:22}}>{r.e}</span>
          <div><div style={{fontWeight:700,fontSize:13.5}}>{r.nm}</div>
            <div style={{fontSize:11,color:su,marginTop:1}}>⏱{r.tm}분 · 🔥{r.cal}kcal · 💪{r.pro}g</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:10.5,fontWeight:600,padding:"2px 7px",borderRadius:5,background:c.bg,color:c.c}}>{r.role}</span>
          <span style={{color:"#ccc",fontSize:14}}>›</span>
        </div>
      </div>
    </div>)};

  // ═══ NAV BAR ═══
  const Nav=()=>(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",width:"100%",maxWidth:"100vw",background:"#fff",borderTop:`1px solid ${bd}`,display:"flex",zIndex:50,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {[{k:"home",l:"🍳 식단짜기"},{k:"calendar",l:"📅 캘린더"},{k:"plan",l:"📋 내 식단"}].map(t=>(
        <button key={t.k} onClick={()=>{setPage(t.k);if(t.k==="home")setStep(0);if(t.k==="calendar")setViewPlan(null)}}
          style={{flex:1,padding:"12px 0 10px",background:"none",border:"none",fontSize:12,fontWeight:page===t.k?700:500,
            color:page===t.k?ac:su,cursor:"pointer",fontFamily:"inherit"}}>
          {t.l}
        </button>))}
    </div>
  );

  return(
    <div style={{width:"100%",maxWidth:"100vw",margin:"0 auto",minHeight:"100vh",overflowX:"hidden",background:bg,fontFamily:"'Pretendard',-apple-system,sans-serif",color:tx,paddingBottom:70}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}html,body{width:100%;overflow-x:hidden}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>

      {/* ═══ HOME ═══ */}
      {page==="home"&&(
        <div style={{padding:"0 24px",minHeight:"calc(100vh - 70px)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center"}}>
          <div style={{fontSize:72,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🍚</div>
          <h1 style={{fontFamily:"'Nanum Pen Script',cursive",fontSize:44,marginBottom:6}}>이번 주, 뭐 먹지?</h1>
          <p style={{fontSize:20,fontWeight:800,color:ac,marginBottom:16}}>고민 끝, 장보기 한번이면 일주일!</p>
          <p style={{fontSize:14,color:su,lineHeight:1.7,marginBottom:24,maxWidth:300}}>
            매일 <strong>1092개 레시피</strong>에서 메인+국+반찬 풀구성<br/>재료 완전 소진 + 영양 분석 + 저장까지 🍳
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:28}}>
            {["🍽️ 하루3품 보장","♻️ 재료낭비 제로","📅 캘린더 저장"].map((t,i)=>(
              <span key={i} style={{padding:"7px 13px",borderRadius:999,background:wm,fontSize:12.5,fontWeight:500}}>{t}</span>))}
          </div>
          <button onClick={()=>{setStep(1);setPage("plan")}} style={{padding:"16px 48px",borderRadius:16,border:"none",background:tx,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",animation:"pulse 2.5s ease-in-out infinite"}}>식단 짜러 가기 →</button>
        </div>
      )}

      {page==="plan"&&step===1&&(
        <div style={{padding:"36px 24px"}}>
          <button onClick={()=>{setStep(0);setPage("home")}} style={{background:"none",border:"none",fontSize:14,color:su,cursor:"pointer",marginBottom:24,fontFamily:"inherit"}}>← 처음으로</button>
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>어떤 플랜으로?</h2>
          <p style={{color:su,fontSize:13,marginBottom:24}}>생활 패턴에 맞게</p>
          {[{t:"5day",title:"평일 5일",sub2:"월~금 저녁 5끼",em:"📅",badge:"5끼",c:"#2563EB"},
            {t:"7day",title:"풀 7일",sub2:"평일5+주말4끼",em:"🗓️",badge:"9끼",c:ac}].map(p=>(
            <button key={p.t} onClick={()=>{setPt(p.t);setStep(2)}}
              style={{display:"block",width:"100%",padding:20,borderRadius:16,border:`2px solid ${bd}`,background:"#fff",cursor:"pointer",textAlign:"left",marginBottom:12,fontFamily:"inherit",transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=p.c} onMouseLeave={e=>e.currentTarget.style.borderColor=bd}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:28,marginBottom:4}}>{p.em}</div><div style={{fontSize:17,fontWeight:700}}>{p.title}</div><div style={{fontSize:12.5,color:su}}>{p.sub2}</div></div>
                <span style={{fontSize:12,fontWeight:700,padding:"5px 12px",borderRadius:8,background:p.c,color:"#fff"}}>{p.badge}</span>
              </div></button>))}
        </div>
      )}

      {page==="plan"&&step===2&&(
        <div style={{padding:"24px 24px 140px"}}>
          <button onClick={()=>setStep(1)} style={{background:"none",border:"none",fontSize:14,color:su,cursor:"pointer",marginBottom:16,fontFamily:"inherit"}}>← 플랜 선택</button>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:3}}>먹고 싶은 재료를 골라주세요 🛒</h2>
          <p style={{color:su,fontSize:12.5,marginBottom:20}}>편하게 고르면 나머진 저희가!</p>
          {[{k:"채소",l:"🥬 채소"},{k:"육류",l:"🥩 육류"},{k:"기타",l:"📦 기타"}].map(c=>(
            <div key={c.k} style={{marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:700,color:su,marginBottom:8}}>{c.l}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {INGS.filter(i=>i.c===c.k).map(ig=>(
                  <button key={ig.id} onClick={()=>tog(ig.id)}
                    style={{display:"inline-flex",alignItems:"center",gap:4,padding:"6px 11px",borderRadius:999,fontSize:12.5,cursor:"pointer",fontFamily:"inherit",border:"none",
                      background:sel.includes(ig.id)?tx:"#fff",color:sel.includes(ig.id)?"#fff":tx,
                      boxShadow:sel.includes(ig.id)?"none":`inset 0 0 0 1.5px ${bd}`,fontWeight:sel.includes(ig.id)?600:400,transition:"all .12s",whiteSpace:"nowrap"}}>
                    <span style={{fontSize:13}}>{ig.e}</span>{ig.n}
                    {sel.includes(ig.id)&&<span style={{fontSize:9,opacity:.7}}>✓</span>}
                  </button>))}
              </div></div>))}
          <div style={{background:"#fff",borderRadius:14,padding:14,border:`1px solid ${bd}`,marginTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontWeight:700,fontSize:13}}>레시피</span>
              <span style={{fontSize:18,fontWeight:800,color:av.length>=15?gn:av.length>=8?ac:"#e53e3e"}}>{av.length}개</span>
            </div>
            <div style={{display:"flex",gap:5,marginBottom:6}}>
              {["메인","국/찌개","밑반찬"].map(t=>{const cnt=av.filter(r=>r.tag===t).length;return <span key={t} style={{fontSize:11,padding:"2px 7px",borderRadius:5,background:cnt<3?"#FEF2F2":wm,fontWeight:600,color:cnt<3?"#dc2626":tx}}>{t} {cnt}{cnt<3?" ⚠️":""}</span>})}
            </div>
            <div style={{fontSize:12.5,color:su}}>예상 <strong style={{color:tx}}>₩{tot.toLocaleString()}</strong></div>
          </div>

          {/* 재료 부족 시 추천 */}
          {(av.filter(r=>r.tag==="메인").length<3||av.filter(r=>r.tag==="국/찌개").length<3)&&(
            <div style={{background:"#FFF7ED",borderRadius:14,padding:14,border:"1px solid #FED7AA",marginTop:8}}>
              <div style={{fontWeight:700,fontSize:13,color:"#C2410C",marginBottom:8}}>💡 이 재료를 추가하면 식단이 완성돼요!</div>
              {(()=>{
                const notSel=INGS.filter(i=>!sel.includes(i.id));
                const recs=[];
                notSel.forEach(ig=>{
                  const newSel=[...sel,ig.id];
                  const newAv=RCP.filter(r=>r.ig.every(i=>newSel.includes(i)));
                  const newM=newAv.filter(r=>r.tag==="메인").length;
                  const newS=newAv.filter(r=>r.tag==="국/찌개").length;
                  const gain=newAv.length-av.length;
                  if(gain>=3)recs.push({ig,gain,newM,newS});
                });
                recs.sort((a,b)=>b.gain-a.gain);
                return recs.slice(0,4).map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<3?`1px solid ${bd}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:16}}>{r.ig.e}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{r.ig.n} <span style={{color:su,fontWeight:400}}>+₩{r.ig.p.toLocaleString()}</span></div>
                        <div style={{fontSize:11,color:gn}}>+{r.gain}개 레시피 (메인{r.newM} 국{r.newS})</div>
                      </div>
                    </div>
                    <button onClick={()=>tog(r.ig.id)} style={{background:ac,border:"none",color:"#fff",fontSize:11,fontWeight:700,padding:"5px 10px",borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>+ 추가</button>
                  </div>
                ));
              })()}
            </div>
          )}
          <div style={{position:"fixed",bottom:70,left:0,right:0,width:"100%",padding:"12px 24px 16px",background:`linear-gradient(transparent,${bg} 30%)`,paddingTop:36}}>
            <button onClick={gen} disabled={av.filter(r=>r.tag==="메인").length<3||av.filter(r=>r.tag==="국/찌개").length<3}
              style={{width:"100%",padding:15,borderRadius:16,border:"none",fontSize:15,fontWeight:700,cursor:av.filter(r=>r.tag==="메인").length>=3?"pointer":"default",fontFamily:"inherit",
                background:av.filter(r=>r.tag==="메인").length>=3?tx:"#ddd",color:av.filter(r=>r.tag==="메인").length>=3?"#fff":"#999"}}>
              {av.filter(r=>r.tag==="메인").length>=3?`메인+국+반찬 풀구성 ${pt==="7day"?"7일":"5일"} 만들기 ✨`:"메인·국 각 3개 이상 필요해요"}
            </button></div>
        </div>
      )}

      {page==="plan"&&step===3&&res&&(
        <div style={{padding:"20px 24px 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <button onClick={()=>setStep(2)} style={{background:"none",border:"none",fontSize:13,color:su,cursor:"pointer",fontFamily:"inherit"}}>← 재료수정</button>
            <div style={{display:"flex",gap:8}}>
              <button onClick={gen} style={{background:"none",border:"none",fontSize:12,color:ac,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>🔄 다시짜기</button>
              <button onClick={()=>setShowSaveModal(true)} style={{background:gn,border:"none",fontSize:12,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:"4px 10px",borderRadius:8}}>{saveMsg||"💾 저장"}</button>
            </div>
          </div>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:3}}>이번 주 식단 🎉</h2>
          <p style={{color:su,fontSize:12.5,marginBottom:3}}>
            <span style={{color:ac,fontWeight:700}}>₩{tot.toLocaleString()}</span> · 끼니당 <strong>₩{Math.round(tot/nut.ml).toLocaleString()}</strong> · 하루 메인+국+반찬 보장
          </p>
          <p style={{fontSize:11,color:su,marginBottom:16}}>👆 카드를 누르면 자세한 레시피</p>

          <div style={{display:"flex",gap:5,marginBottom:16,overflowX:"auto",paddingBottom:3}}>
            {res.plan.map((d,i)=>(
              <button key={i} onClick={()=>setDi(i)}
                style={{padding:"8px 14px",borderRadius:10,border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",
                  background:di===i?tx:"#fff",color:di===i?"#fff":su,fontWeight:di===i?700:500}}>
                {d.day}{d.isW?"🌙":""}
              </button>))}
          </div>

          {res.plan[di]&&(<div>
            {res.plan[di].lunch&&(<div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:700,color:su,marginBottom:6}}>🌤️ 점심</div><Card r={res.plan[di].lunch}/></div>)}
            <div style={{fontSize:11,fontWeight:700,color:su,marginBottom:6}}>🌙 저녁</div>
            <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
              {res.plan[di].dinner.map((m,i)=><Card key={i} r={m}/>)}</div>
          </div>)}

          {/* 추가재료 추천 - 실제 추가 가능 */}
          {res.suggest.length>0&&(
            <div style={{background:"linear-gradient(135deg,#F5F3FF,#EDE9FE)",borderRadius:16,padding:16,border:"1px solid #DDD6FE",marginBottom:14}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:4,color:pu}}>🛒 이 재료 추가하면?</h3>
              <p style={{fontSize:11,color:su,marginBottom:10}}>버튼을 누르면 장바구니에 추가되고 식단이 업데이트돼요</p>
              {res.suggest.map((s,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.8)",borderRadius:12,padding:"10px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{s.ing.e} {s.ing.n} <span style={{color:su,fontWeight:400}}>+₩{s.ing.p.toLocaleString()}</span></div>
                    <div style={{fontSize:11,color:su,marginTop:2}}>→ {s.recipes.map(r=>r.nm).join(", ")}</div>
                  </div>
                  <button onClick={()=>{
                    const newSel=[...sel,s.ing.id];
                    setSel(newSel);
                    const newRes=buildPlan(newSel,pt==="7day"?7:5,pt==="7day");
                    setRes(newRes);setDi(0);
                  }} style={{background:pu,border:"none",color:"#fff",fontSize:11,fontWeight:700,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",marginLeft:8}}>
                    + 추가
                  </button>
                </div>))}
            </div>)}

          {/* 영양 */}
          <div style={{background:"#fff",borderRadius:16,padding:16,border:`1px solid ${bd}`,marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>📊 영양분석</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"일평균 칼로리",v:`${nut.dc}kcal`,c:nut.dc<400?"#e53e3e":gn},{l:"일평균 단백질",v:`${nut.dp}g`,c:nut.dp<30?"#e53e3e":gn}].map((n,i)=>(
                <div key={i} style={{background:bg,borderRadius:10,padding:10,textAlign:"center"}}>
                  <div style={{fontSize:10.5,color:su,marginBottom:3}}>{n.l}</div>
                  <div style={{fontSize:17,fontWeight:800,color:n.c}}>{n.v}</div></div>))}
            </div>
            {nut.tips.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",padding:"8px 10px",borderRadius:8,marginBottom:4,fontSize:12,lineHeight:1.5,
                background:t.t==="danger"?"#FEF2F2":t.t==="warn"?"#FFF7ED":t.t==="good"?"#F0FFF4":bg,
                border:`1px solid ${t.t==="danger"?"#FECACA":t.t==="warn"?"#FED7AA":t.t==="good"?"#BBF7D0":bd}`}}>
                <span style={{fontSize:14}}>{t.icon}</span><span>{t.text}</span></div>))}
          </div>

          {/* 남는재료 */}
          {res.unc.length>0&&(
            <div style={{background:"#FFF7ED",borderRadius:16,padding:14,border:"1px solid #FED7AA",marginBottom:14}}>
              <h3 style={{fontSize:13,fontWeight:700,marginBottom:8,color:"#C2410C"}}>♻️ 남는 재료 활용</h3>
              {res.unc.map(id=>{const ig=IG(id);if(!ig)return null;
                return(<div key={id} style={{marginBottom:6,fontSize:12.5,lineHeight:1.4}}>
                  <strong>{ig.e} {ig.n}</strong>: {leftTips[id]||"볶음/나물로 활용"}</div>)})}
            </div>)}

          {/* 장보기 */}
          <div style={{background:"#fff",borderRadius:16,padding:16,border:`1px solid ${bd}`,marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>🛒 장보기</h3>
            {sh.map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<sh.length-1?`1px solid ${bd}`:"none",fontSize:13}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span>{item.e}</span><div><div style={{fontWeight:600}}>{item.n}</div><div style={{fontSize:10.5,color:su}}>{item.u}</div></div>
                </div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:700}}>₩{item.p.toLocaleString()}</div>
                  <div style={{fontSize:10.5,color:res.cov[item.id]>0?gn:"#e53e3e"}}>{res.cov[item.id]||0}회</div></div>
              </div>))}
            <div style={{marginTop:10,paddingTop:10,borderTop:`2px solid ${tx}`,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontWeight:700}}>합계</span><span style={{fontWeight:800,fontSize:20,color:ac}}>₩{tot.toLocaleString()}</span>
            </div></div>
        </div>
      )}

      {/* ═══ CALENDAR PAGE ═══ */}
      {page==="calendar"&&(
        <div style={{padding:"24px"}}>
          {!viewPlan?(
            <>
              <h2 style={{fontSize:22,fontWeight:800,marginBottom:4}}>📅 저장된 식단</h2>
              <p style={{color:su,fontSize:13,marginBottom:20}}>저장한 주간 식단을 확인하세요</p>

              {saved.length===0?(
                <div style={{textAlign:"center",padding:"60px 0",color:su}}>
                  <div style={{fontSize:48,marginBottom:12}}>📋</div>
                  <p style={{fontSize:14}}>아직 저장된 식단이 없어요</p>
                  <p style={{fontSize:12,marginTop:4}}>식단을 만들고 💾 저장 버튼을 눌러보세요</p>
                  <button onClick={()=>{setStep(1);setPage("plan")}} style={{marginTop:16,padding:"10px 24px",borderRadius:12,border:"none",background:tx,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    식단 만들러 가기
                  </button>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[...saved].sort((a,b)=>new Date(a.weekStart)-new Date(b.weekStart)).map((s)=>(
                    <div key={s.id} style={{background:"#fff",borderRadius:16,padding:16,border:`1px solid ${bd}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <div style={{fontWeight:700,fontSize:14}}>{(()=>{const dt=new Date(s.weekStart);return`${dt.getMonth()+1}월 ${Math.ceil(dt.getDate()/7)}주차`})()}</div>
                          <div style={{fontSize:11.5,color:su,marginTop:2}}>{fmtWeek(s.weekStart)} · {s.planType==="7day"?"7일":"5일"} · <span style={{color:ac,fontWeight:600}}>₩{s.total?.toLocaleString()}</span></div>
                        </div>
                        <button onClick={()=>deletePlan(s.id)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#ccc",padding:4}}>×</button>
                      </div>
                      {/* Clickable day grid */}
                      <div style={{display:"grid",gridTemplateColumns:`repeat(${s.plan.length},1fr)`,gap:4,marginBottom:10}}>
                        {s.plan.map((d,di)=>(
                          <div key={di} onClick={()=>{setViewPlan(s);setViewDay(di)}}
                            style={{background:bg,borderRadius:8,padding:"8px 4px",textAlign:"center",cursor:"pointer",transition:"all .15s",border:"2px solid transparent"}}
                            onMouseEnter={e=>e.currentTarget.style.borderColor=ac}
                            onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                            <div style={{fontSize:11,fontWeight:700,color:su,marginBottom:4}}>{d.day}</div>
                            <div style={{fontSize:16,lineHeight:1.2}}>
                              {d.dinner.slice(0,3).map((m,mi)=><span key={mi}>{m.e}</span>)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={()=>{setViewPlan(s);setViewDay(0)}}
                        style={{width:"100%",padding:"8px",borderRadius:8,border:`1px solid ${bd}`,background:"transparent",fontSize:12,fontWeight:600,color:su,cursor:"pointer",fontFamily:"inherit"}}>
                        상세 보기 →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ):(
            /* ═══ SAVED PLAN DETAIL VIEW ═══ */
            <div>
              <button onClick={()=>setViewPlan(null)} style={{background:"none",border:"none",fontSize:14,color:su,cursor:"pointer",marginBottom:16,fontFamily:"inherit"}}>← 목록으로</button>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                <div>
                  <h2 style={{fontSize:20,fontWeight:800,marginBottom:3}}>📅 {fmtWeek(viewPlan.weekStart)}</h2>
                  <p style={{color:su,fontSize:12.5}}>
                    {viewPlan.planType==="7day"?"7일 플랜":"5일 플랜"} · <span style={{color:ac,fontWeight:700}}>₩{viewPlan.total?.toLocaleString()}</span>
                  </p>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{
                    // 이 식단의 재료로 새로 짜기
                    setSel(viewPlan.sel||["rice","garlic","greenonion"]);
                    setPt(viewPlan.planType);
                    setViewPlan(null);
                    setStep(2);setPage("plan");
                  }} style={{background:ac,border:"none",color:"#fff",fontSize:11,fontWeight:600,padding:"6px 10px",borderRadius:8,cursor:"pointer",fontFamily:"inherit"}}>
                    ✏️ 수정
                  </button>
                  <button onClick={async()=>{
                    await deletePlan(viewPlan.id);
                    setViewPlan(null);
                  }} style={{background:"none",border:`1px solid #fca5a5`,color:"#dc2626",fontSize:11,fontWeight:600,padding:"6px 10px",borderRadius:8,cursor:"pointer",fontFamily:"inherit"}}>
                    🗑️ 삭제
                  </button>
                </div>
              </div>
              <div style={{height:12}}/>

              {/* Day tabs */}
              <div style={{display:"flex",gap:5,marginBottom:16,overflowX:"auto",paddingBottom:3}}>
                {viewPlan.plan.map((d,i)=>(
                  <button key={i} onClick={()=>setViewDay(i)}
                    style={{padding:"8px 14px",borderRadius:10,border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",
                      background:viewDay===i?tx:"#fff",color:viewDay===i?"#fff":su,fontWeight:viewDay===i?700:500}}>
                    {d.day}{d.isW?"🌙":""}
                  </button>))}
              </div>

              {/* Day meals - clickable cards */}
              {viewPlan.plan[viewDay]&&(
                <div>
                  {viewPlan.plan[viewDay].lunch&&(
                    <div style={{marginBottom:14}}>
                      <div style={{fontSize:11,fontWeight:700,color:su,marginBottom:6}}>🌤️ 점심</div>
                      <Card r={viewPlan.plan[viewDay].lunch}/>
                    </div>
                  )}
                  <div style={{fontSize:11,fontWeight:700,color:su,marginBottom:6}}>🌙 저녁</div>
                  <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
                    {viewPlan.plan[viewDay].dinner.map((m,i)=><Card key={i} r={m}/>)}
                  </div>
                </div>
              )}

              {/* Day's ingredients */}
              {viewPlan.plan[viewDay]&&(
                <div style={{background:"#fff",borderRadius:14,padding:14,border:`1px solid ${bd}`,marginBottom:14}}>
                  <h3 style={{fontSize:13,fontWeight:700,marginBottom:10}}>🧂 오늘 필요한 재료</h3>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {[...new Set([
                      ...(viewPlan.plan[viewDay].lunch?.ig||[]),
                      ...viewPlan.plan[viewDay].dinner.flatMap(m=>m.ig)
                    ])].map(id=>{
                      const ig=IG(id);
                      return ig?(
                        <span key={id} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:999,background:wm,fontSize:12}}>
                          {ig.e} {ig.n}
                        </span>
                      ):null;
                    })}
                  </div>
                </div>
              )}

              {/* Full shopping list for this saved plan */}
              <div style={{background:"#fff",borderRadius:14,padding:14,border:`1px solid ${bd}`,marginBottom:14}}>
                <h3 style={{fontSize:13,fontWeight:700,marginBottom:10}}>🛒 이 주의 전체 장보기 리스트</h3>
                {(viewPlan.sel||[]).map(id=>{
                  const ig=IG(id);
                  if(!ig)return null;
                  return(
                    <div key={id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${bd}`,fontSize:13}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span>{ig.e}</span>
                        <div><div style={{fontWeight:600}}>{ig.n}</div><div style={{fontSize:10.5,color:su}}>{ig.u}</div></div>
                      </div>
                      <div style={{fontWeight:700}}>₩{ig.p.toLocaleString()}</div>
                    </div>
                  );
                })}
                <div style={{marginTop:8,paddingTop:8,borderTop:`2px solid ${tx}`,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontWeight:700,fontSize:13}}>합계</span>
                  <span style={{fontWeight:800,fontSize:18,color:ac}}>₩{viewPlan.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Nav/>

      {/* ═══ SAVE WEEK PICKER MODAL ═══ */}
      {showSaveModal&&(
        <div onClick={()=>setShowSaveModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:bg,borderRadius:20,width:"90%",maxWidth:"90vw",padding:24,animation:"slideUp .3s ease"}}>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:4}}>📅 어느 주에 저장할까요?</h3>
            <p style={{fontSize:12.5,color:su,marginBottom:18}}>식단을 적용할 주를 선택하세요</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {[0,1,2,3].map(off=>{
                const wk=getWeekLabel(off);
                const isNow=off===0;
                return(
                  <button key={off} onClick={()=>savePlan(off)}
                    style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderRadius:14,
                      border:isNow?`2px solid ${ac}`:`1.5px solid ${bd}`,background:"#fff",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;e.currentTarget.style.transform="translateY(-1px)"}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=isNow?ac:bd;e.currentTarget.style.transform="none"}}>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontWeight:700,fontSize:14}}>{wk.label}{isNow?" (이번 주)":""}</div>
                      <div style={{fontSize:12,color:su,marginTop:2}}>{wk.range}</div>
                    </div>
                    <span style={{fontSize:12,fontWeight:600,color:ac}}>저장 →</span>
                  </button>
                );
              })}
            </div>
            <button onClick={()=>setShowSaveModal(false)} style={{width:"100%",padding:12,borderRadius:12,border:`1.5px solid ${bd}`,background:"transparent",fontSize:13,fontWeight:600,color:su,cursor:"pointer",fontFamily:"inherit"}}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* ═══ MODAL ═══ */}
      {mod&&(
        <div onClick={()=>setMod(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:bg,borderRadius:"24px 24px 0 0",width:"100%",width:"100%",maxWidth:"100vw",maxHeight:"88vh",overflowY:"auto",padding:"20px 20px 28px",animation:"slideUp .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:32}}>{mod.e}</span>
                <div><div style={{fontWeight:800,fontSize:18}}>{mod.nm}</div>
                  <div style={{display:"flex",gap:4,marginTop:3}}>
                    <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:5,background:tcol(mod.tag,mod.ai).bg,color:tcol(mod.tag,mod.ai).c}}>{mod.role||mod.tag}</span>
                    {mod.ai&&<span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:5,background:"#F3E8FF",color:pu}}>🤖AI</span>}
                  </div></div>
              </div>
              <button onClick={()=>setMod(null)} style={{background:"none",border:"none",fontSize:26,cursor:"pointer",color:su}}>×</button>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {[`⏱${mod.tm}분`,`🔥${mod.cal}kcal`,`💪${mod.pro}g`,`📊${"⭐".repeat(Math.min(mod.tm>30?2:1,2))}`].map((t,i)=>(
                <span key={i} style={{padding:"4px 8px",borderRadius:6,background:wm,fontSize:11,fontWeight:600}}>{t}</span>))}
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>🧂 재료</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {mod.ig.map(id=>{const ig=IG(id);if(!ig)return null;
                  // 버섯 세분화: 레시피 이름/단계에 따라 추천 버섯 표시
                  let subInfo="";
                  if(id==="mushroom"){
                    const nm=mod.nm+mod.st.map(s=>s.t).join("");
                    if(nm.includes("된장")||nm.includes("찌개"))subInfo=" (팽이·느타리 추천)";
                    else if(nm.includes("볶음")||nm.includes("스테이크"))subInfo=" (새송이 추천)";
                    else if(nm.includes("탕")||nm.includes("전골"))subInfo=" (표고 추천)";
                    else subInfo=" (팽이·새송이·느타리)";
                  }
                  return <span key={id} style={{padding:"5px 10px",borderRadius:999,background:wm,fontSize:12}}>{ig.e} {ig.n}{subInfo}</span>;
                })}</div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>👨‍🍳 조리 순서</div>
              {mod.st.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:12}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <span style={{width:30,height:30,borderRadius:"50%",background:tx,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span>
                    {i<mod.st.length-1&&<div style={{width:2,flex:1,background:bd}}/>}
                  </div>
                  <div style={{background:"#fff",borderRadius:12,padding:"10px 14px",flex:1,border:`1px solid ${bd}`}}>
                    <div style={{fontSize:18,marginBottom:4}}>{s.i}</div>
                    <div style={{fontSize:13,lineHeight:1.6}}>{s.t}</div>
                  </div></div>))}
            </div>
            <div style={{background:mod.ai?"linear-gradient(135deg,#F5F3FF,#EDE9FE)":wm,borderRadius:14,padding:14}}>
              <div style={{fontWeight:700,fontSize:12,marginBottom:4,color:mod.ai?pu:ac}}>{mod.ai?"🤖 Claude 팁":"💡 꿀팁"}</div>
              <div style={{fontSize:13,lineHeight:1.7}}>{mod.tp}</div>
            </div>
            <div style={{marginTop:12,fontSize:10.5,color:"#bbb",textAlign:"center"}}>{mod.ai?"🤖 Claude AI 오리지널":"📋 공공레시피DB · 만개의레시피 참고"}</div>
          </div></div>)}
    </div>)
}
