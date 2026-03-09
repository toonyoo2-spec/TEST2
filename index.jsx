import React, { useState, useMemo, useEffect, useCallback } from "react";

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
  {id:202,nm:"스팸김치볶음밥",e:"🍳",ig:["spam","kimchi","egg","rice","greenonion"],tm:15,cal:480,pro:18,tag:"메인",st:[{i:"🔪",t:"스팸+김치 잘게 썰기"},{i:"🔥",t:"스팸 먼저 볶기"},{i:"🍚",t:"밥+간장 센불에 볶기"},{i:"🍳",t:"계란후라이 올려 완성"}],tp:"💡 김치 충분히 볶아서 수분날리기"},
  {id:203,nm:"참치볶음밥",e:"🍳",ig:["tuna_can","egg","rice","greenonion","garlic","onion"],tm:15,cal:420,pro:24,tag:"메인",st:[{i:"🐟",t:"참치+양파 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀후라이"}],tp:"💡 참치기름이 윤기"},
  {id:204,nm:"참치김치볶음밥",e:"🍳",ig:["tuna_can","kimchi","rice","egg","greenonion","garlic"],tm:15,cal:430,pro:22,tag:"메인",st:[{i:"🐟",t:"참치+김치 볶기"},{i:"🍚",t:"밥 센불 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 참치+김치는 볶음밥의 정석"},
  {id:205,nm:"달걀볶음밥",e:"🍳",ig:["egg","rice","greenonion","garlic","onion"],tm:10,cal:350,pro:14,tag:"메인",st:[{i:"🥚",t:"달걀 스크램블"},{i:"🍚",t:"밥+간장 볶기"},{i:"🌿",t:"파+참기름"}],tp:"💡 달걀을 먼저 익혀두고 밥 볶은 뒤 합치기"},
  {id:206,nm:"다짐육볶음밥",e:"🍳",ig:["ground_pork","egg","rice","onion","garlic","greenonion"],tm:15,cal:450,pro:20,tag:"메인",st:[{i:"🥩",t:"다짐육+양파 볶기"},{i:"🍚",t:"밥+간장 볶기"},{i:"🍳",t:"달걀"}],tp:"💡 다짐육을 잘게 볶아야 밥에 잘 섞여요"},
  {id:207,nm:"목살볶음밥",e:"🍳",ig:["pork_neck","egg","rice","onion","garlic","greenonion","cabbage"],tm:15,cal:460,pro:22,tag:"메인",st:[{i:"🥩",t:"목살 잘게 볶기"},{i:"🥗",t:"양배추+양파 볶기"},{i:"🍚",t:"밥+간장"},{i:"🍳",t:"달걀"}],tp:"💡 양배추가 단맛을 더해줘요"},
  {id:210,nm:"스팸마요덮밥",e:"🍚",ig:["spam","egg","rice","greenonion","onion"],tm:15,cal:520,pro:16,tag:"메인",st:[{i:"🥫",t:"스팸1cm 굽기"},{i:"🍳",t:"달걀후라이"},{i:"🍚",t:"밥+올리기"},{i:" Spoon",t:"마요+간장소스"}],tp:"💡 후추 뿌리고 구우면 고급"},
  {id:211,nm:"닭가슴살덮밥",e:"🍗",ig:["chicken_breast","onion","egg","rice","greenonion","garlic"],tm:25,cal:380,pro:35,tag:"메인",st:[{i:"🍗",t:"닭 한입크기"},{i:" Spoon",t:"간장+미림+설탕 끓이기"},{i:" Onion",t:"양파+닭 조리기"},{i:" Egg",t:"달걀 뚜껑10초→반숙!"}],tp:"💡 오야코동!"},
  {id:212,nm:"삼겹덮밥",e:"🍚",ig:["pork_belly","onion","rice","greenonion","garlic","cabbage"],tm:20,cal:500,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹 구워 썰기"},{i:" Veggie",t:"양배추 채"},{i:" Rice",t:"밥+양배추+삼겹"},{i:" Sauce",t:"마요+간장"}],tp:"💡 양배추가 느끼함 잡아줘요"},
  {id:213,nm:"콩나물불고기덮밥",e:"🍚",ig:["bean_sprout","pork_neck","onion","garlic","greenonion","rice"],tm:20,cal:420,pro:24,tag:"메인",ai:1,st:[{i:"🌱",t:"콩나물 깔기"},{i:"🥩",t:"목살 양념 볶기"},{i:" Rice",t:"밥+불고기"},{i:" Egg",t:"달걀+고추장"}],tp:"🤖 뚝배기→누룽지"},
  {id:214,nm:"다짐육카레",e:"🍛",ig:["ground_pork","potato","carrot","onion","rice","garlic"],tm:35,cal:450,pro:18,tag:"메인",st:[{i:"🔪",t:"채소 깍둑"},{i:"🥩",t:"다짐육+채소 볶기"},{i:" Water",t:"물3컵 15분"},{i:" Curry",t:"불끄고 카레루→약불5분"}],tp:"💡 카레루는 불 끄고!"},
  {id:215,nm:"참치마요덮밥",e:"🍚",ig:["tuna_can","egg","rice","onion","greenonion"],tm:15,cal:400,pro:24,tag:"메인",st:[{i:"🐟",t:"참치+마요+양파 섞기"},{i:" Rice",t:"밥 위에 올리기"},{i:" Egg",t:"달걀후라이+간장"}],tp:"💡 양파를 다져넣으면 식감 UP"},
  {id:216,nm:"제육덮밥",e:"🍚",ig:["pork_neck","onion","rice","garlic","greenonion","cabbage","pepper"],tm:25,cal:480,pro:26,tag:"메인",st:[{i:"🥩",t:"목살+고추장양념 볶기"},{i:" Veggie",t:"양배추 채"},{i:" Rice",t:"밥+양배추+제육"}],tp:"💡 쌈채소 깔면 더 맛있어요"},
  {id:217,nm:"두부스크램블덮밥",e:"🍚",ig:["tofu","egg","onion","garlic","greenonion","carrot","rice"],tm:15,cal:360,pro:22,tag:"메인",ai:1,st:[{i:" Tofu",t:"두부 으깨기"},{i:" Egg",t:"달걀+채소 섞기"},{i:" Fire",t:"스크램블"},{i:" Rice",t:"밥 위에"}],tp:"🤖 고단백 브런치 덮밥"},
  {id:218,nm:"계란토스트밥",e:"🍳",ig:["egg","cabbage","carrot","rice","garlic"],tm:15,cal:350,pro:14,tag:"메인",st:[{i:" Egg",t:"달걀2+다진채소"},{i:" Rice",t:"팬에 밥 얇게"},{i:" Fire",t:"달걀물 붓고 접기"}],tp:"💡 바삭→토스트식감"},
  {id:219,nm:"콩나물비빔밥",e:"🍚",ig:["bean_sprout","egg","rice","greenonion","garlic","kimchi"],tm:15,cal:360,pro:16,tag:"메인",st:[{i:"🌱",t:"콩나물 삶기"},{i:" Rice",t:"밥+콩나물+김치"},{i:" Egg",t:"달걀+고추장+참기름"}],tp:"💡 뚝배기→누룽지"},
  {id:220,nm:"다짐육비빔밥",e:"🍚",ig:["ground_pork","carrot","spinach","bean_sprout","rice","egg","garlic","greenonion"],tm:30,cal:450,pro:25,tag:"메인",st:[{i:" Veggie",t:"나물 데쳐 무치기"},{i:"🥩",t:"다짐육 양념 볶기"},{i:" Rice",t:"밥+나물+고기"},{i:" Egg",t:"달걀+고추장"}],tp:"💡 나물 미리→3일 활용"},
  {id:221,nm:"감자달걀그라탕",e:"🧀",ig:["potato","egg","onion","garlic","mushroom"],tm:30,cal:350,pro:14,tag:"메인",ai:1,st:[{i:" Potato",t:"감자 슬라이스"},{i:" Fire",t:"팬에 겹겹이"},{i:" Egg",t:"달걀+우유"},{i:" Time",t:"뚜껑 약불15분"}],tp:"🤖 오븐없이!"},
  {id:225,nm:"잔치국수",e:"🍜",ig:["noodle","zucchini","egg","greenonion","anchovy","garlic"],tm:25,cal:350,pro:14,tag:"메인",st:[{i:"🐟",t:"멸치육수10분"},{i:" Noodle",t:"소면 삶기"},{i:" Veggie",t:"호박+달걀지단"},{i:" Soup",t:"면+육수+고명"}],tp:"💡 면 찬물에 헹구기"},
  {id:226,nm:"비빔국수",e:"🍜",ig:["noodle","egg","carrot","onion","greenonion","garlic","cabbage"],tm:20,cal:380,pro:12,tag:"메인",st:[{i:" Noodle",t:"소면 삶아 헹구기"},{i:" Sauce",t:"고추장+식초+설탕+참기름"},{i:"🔪",t:"채소 채썰기"},{i:" Egg",t:"비비고 달걀"}],tp:"💡 사이다2스푼→상큼"},
  {id:227,nm:"라면볶이",e:"🍜",ig:["ramen","cabbage","carrot","onion","greenonion","garlic"],tm:15,cal:400,pro:10,tag:"메인",st:[{i:"🍜",t:"라면 2분만(덜!)"},{i:"🔪",t:"채소 볶기"},{i:" Fire",t:"면+수프반+고추장"}],tp:"💡 덜삶아야 쫄깃"},
  {id:228,nm:"원팬삼겹파스타",e:"🍝",ig:["pork_belly","onion","garlic","mushroom","cabbage"],tm:25,cal:520,pro:16,tag:"메인",ai:1,st:[{i:"🥩",t:"삼겹 바삭"},{i:" Mushroom",t:"채소 볶기"},{i:" Noodle",t:"소면 넣기"},{i:" Milk",t:"우유반컵+후추"}],tp:"🤖 소면+삼겹기름+우유=크림파스타!"},
  {id:229,nm:"김치볶음 우동",e:"🍜",ig:["noodle","kimchi","pork_belly","greenonion","garlic","egg"],tm:15,cal:420,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹+김치 볶기"},{i:" Noodle",t:"삶은 소면 넣기"},{i:" Sauce",t:"간장+고추장"},{i:" Egg",t:"달걀후라이"}],tp:"💡 소면이 우동면처럼! 굵은면 없을 때"},
  {id:230,nm:"참치 비빔국수",e:"🍜",ig:["noodle","tuna_can","onion","greenonion","garlic","egg"],tm:15,cal:390,pro:22,tag:"메인",st:[{i:" Noodle",t:"소면 삶아 헹구기"},{i:"🐟",t:"참치+고추장+식초 양념"},{i:" Egg",t:"삶은달걀 올리기"}],tp:"💡 참치+고추장은 비빔국수의 왕도"},
  {id:231,nm:"스팸 볶음면",e:"🍜",ig:["ramen","spam","cabbage","onion","greenonion","garlic"],tm:15,cal:480,pro:16,tag:"메인",st:[{i:"🥫",t:"스팸 깍둑 볶기"},{i:"🍜",t:"라면 2분 삶기"},{i:" Fire",t:"채소+면+수프 볶기"}],tp:"💡 라면수프 반만! 짜지않게"},
  {id:232,nm:"간장비빔면",e:"🍜",ig:["noodle","egg","greenonion","garlic","onion"],tm:15,cal:350,pro:12,tag:"메인",st:[{i:" Noodle",t:"소면 삶기"},{i:" Sauce",t:"간장2+참기름1+설탕반+깨"},{i:" Egg",t:"달걀후라이 올리기"}],tp:"💡 매운게 싫을 때! 간장비빔면"},
  {id:233,nm:"콩나물국수",e:"🍜",ig:["noodle","bean_sprout","kimchi","greenonion","garlic","anchovy"],tm:20,cal:340,pro:12,tag:"메인",st:[{i:"🐟",t:"멸치+콩나물 육수"},{i:" Noodle",t:"소면 삶기"},{i:" Veggie",t:"김치+파 올리기"}],tp:"💡 콩나물 육수가 시원!"},
  {id:240,nm:"삼겹살김치볶음",e:"🥘",ig:["pork_belly","kimchi","onion","greenonion","garlic"],tm:20,cal:380,pro:18,tag:"메인",st:[{i:"🔪",t:"삼겹150g 한입"},{i:" Fire",t:"기름없이 삼겹 3분"},{i:" Veggie",t:"김치+양파 3분"},{i:" Sauce",t:"고추장반+설탕반"},{i:"🌿",t:"파"}],tp:"💡 삼겹기름으로 김치볶기"},
  {id:241,nm:"두부김치",e:"🥘",ig:["tofu","kimchi","pork_belly","greenonion"],tm:20,cal:280,pro:20,tag:"메인",st:[{i:"🧈",t:"두부 노릇 굽기"},{i:"🥩",t:"삼겹+김치 볶기"},{i:" Dish",t:"접시에 함께"}],tp:"💡 두부 전자레인지 2분→속 따뜻"},
  {id:242,nm:"목살간장불고기",e:"🥩",ig:["pork_neck","onion","greenonion","garlic","carrot"],tm:30,cal:340,pro:24,tag:"메인",st:[{i:"🥩",t:"목살 얇게"},{i:" Sauce",t:"간장+설탕+참기름+마늘"},{i:" Time",t:"30분 숙성"},{i:" Fire",t:"센불+채소 볶기"}],tp:"💡 키위1/4갈면 부드러워요"},
  {id:243,nm:"목살제육볶음",e:"🥩",ig:["pork_neck","onion","greenonion","garlic","cabbage","pepper"],tm:25,cal:400,pro:26,tag:"메인",st:[{i:"🥩",t:"목살 얇게"},{i:" Sauce",t:"고추장+고춧가루+간장+설탕"},{i:" Fire",t:"고기+채소 볶기"}],tp:"💡 양배추와 함께 볶으면 달콤"},
  {id:244,nm:"닭볶음탕",e:"🍗",ig:["chicken_thigh","potato","carrot","onion","greenonion","garlic"],tm:45,cal:350,pro:28,tag:"메인",st:[{i:"🍗",t:"닭 핏물빼기"},{i:"🔪",t:"감자·당근·양파 큼직"},{i:" Sauce",t:"고추장+간장+설탕+고춧가루"},{i:" Pot",t:"중불 30분"},{i:"🌿",t:"파"}],tp:"💡 감자 크게!"},
  {id:245,nm:"참치마요주먹밥",e:"🍙",ig:["tuna_can","rice","egg","greenonion"],tm:15,cal:380,pro:22,tag:"메인",st:[{i:"🐟",t:"참치+마요2 섞기"},{i:" Rice",t:"밥+참기름+깨"},{i:" Ball",t:"랩으로 동그랗게"}],tp:"💡 단무지 다져넣으면 식감UP"},
  {id:246,nm:"닭가슴살샐러드",e:"🥗",ig:["chicken_breast","onion","carrot","cabbage"],tm:20,cal:200,pro:30,tag:"메인",st:[{i:"🍗",t:"닭 삶아 찢기"},{i:"🔪",t:"채소 채썰기"},{i:" Sauce",t:"올리브유+식초+소금"}],tp:"💡 꿀한스푼→고급"},
  {id:247,nm:"무스테이크",e:"🥬",ig:["radish","garlic","greenonion","mushroom"],tm:25,cal:120,pro:3,tag:"메인",ai:1,st:[{i:"🔪",t:"무 2cm+칼집"},{i:" Fire",t:"간장+버터 양면"},{i:" Mushroom",t:"버섯소스"}],tp:"🤖 전자레인지3분→겉바속촉"},
  {id:250,nm:"스팸달걀덮밥",e:"🍚",ig:["spam","egg","rice","greenonion"],tm:10,cal:480,pro:18,tag:"메인",st:[{i:"🥫",t:"스팸 굽기"},{i:" Egg",t:"달걀후라이"},{i:" Rice",t:"밥+올리기"}],tp:"💡 최소재료 최대만족"},
  {id:251,nm:"감자 카레볶음밥",e:"🍳",ig:["potato","egg","rice","onion","garlic","carrot"],tm:20,cal:400,pro:12,tag:"메인",st:[{i:" Potato",t:"감자 작게 볶기"},{i:" Rice",t:"밥+카레가루 볶기"},{i:" Egg",t:"달걀후라이"}],tp:"💡 카레루 대신 카레가루로 간편하게"},
  {id:252,nm:"양배추 삼겹 볶음",e:"🥗",ig:["cabbage","pork_belly","onion","garlic","greenonion"],tm:15,cal:350,pro:14,tag:"메인",st:[{i:"🥩",t:"삼겹 볶기"},{i:" Veggie",t:"양배추+양파 넣기"},{i:" Salt",t:"소금+후추+간장"}],tp:"💡 양배추가 삼겹 기름을 잡아줘요"},
  {id:253,nm:"버섯 덮밥",e:"🍚",ig:["mushroom","onion","egg","rice","garlic","greenonion"],tm:20,cal:320,pro:12,tag:"메인",st:[{i:" Mushroom",t:"버섯+양파 볶기"},{i:" Sauce",t:"간장+미림+설탕"},{i:" Egg",t:"달걀 반숙으로"},{i:" Rice",t:"밥 위에"}],tp:"💡 버섯을 가득 넣으면 고기 안부러워요"},
  {id:254,nm:"김치 달걀볶음",e:"🥘",ig:["kimchi","egg","greenonion","garlic","rice"],tm:10,cal:320,pro:14,tag:"메인",st:[{i:" Veggie",t:"김치 볶기"},{i:" Egg",t:"달걀 스크램블"},{i:" Rice",t:"밥과 함께"}],tp:"💡 2분이면 완성! 혼밥의 정석"},
  {id:255,nm:"삼겹 고추장볶음",e:"🥩",ig:["pork_belly","onion","garlic","greenonion","pepper","cabbage"],tm:20,cal:420,pro:16,tag:"메인",st:[{i:"🥩",t:"삼겹 볶기"},{i:" Sauce",t:"고추장+고추 양념"},{i:" Veggie",t:"양배추+양파 볶기"}],tp:"💡 고추장이 매콤달콤하게"},
  {id:256,nm:"닭가슴살 볶음밥",e:"🍳",ig:["chicken_breast","egg","rice","onion","garlic","greenonion","carrot"],tm:20,cal:380,pro:30,tag:"메인",st:[{i:"🍗",t:"닭가슴살 다지기"},{i:" Fire",t:"채소+닭 볶기"},{i:" Rice",t:"밥+간장"},{i:" Egg",t:"달걀"}],tp:"💡 고단백 볶음밥!"},
  {id:257,nm:"소고기 덮밥",e:"🍚",ig:["beef_soup","onion","egg","rice","garlic","greenonion"],tm:25,cal:420,pro:26,tag:"메인",st:[{i:"🥩",t:"소고기 볶기"},{i:" Onion",t:"양파+간장 양념"},{i:" Egg",t:"달걀 반숙"},{i:" Rice",t:"밥 위에"}],tp:"💡 규동 스타일! 양파를 듬뿍"},
  {id:258,nm:"닭다리 간장조림",e:"🍗",ig:["chicken_thigh","potato","garlic","greenonion","onion"],tm:40,cal:380,pro:24,tag:"메인",st:[{i:"🍗",t:"닭다리 핏물 빼기"},{i:" Potato",t:"감자+양파 큼직"},{i:" Sauce",t:"간장3+설탕1+마늘"},{i:" Time",t:"중불 25분 조리기"}],tp:"💡 조림장이 자작해질 때까지"},
  {id:259,nm:"두부 스테이크",e:"🧈",ig:["tofu","mushroom","onion","garlic","greenonion"],tm:20,cal:200,pro:14,tag:"메인",st:[{i:"🧈",t:"두부 두껍게 굽기"},{i:" Mushroom",t:"버섯+양파 소스"},{i:" Sauce",t:"간장+버터 소스"}],tp:"💡 두부를 충분히 눌러구워야 바삭"},
  {id:260,nm:"달걀 오므라이스",e:"🍳",ig:["egg","rice","onion","carrot","garlic","greenonion"],tm:20,cal:380,pro:16,tag:"메인",st:[{i:"🔪",t:"양파+당근 다지기"},{i:" Rice",t:"볶음밥 만들기"},{i:" Egg",t:"달걀 얇게 부치기"},{i:" Fold",t:"볶음밥 감싸기"}],tp:"💡 달걀을 덜 익혀서 반숙으로!"},
  {id:261,nm:"김치 라면",e:"🍜",ig:["ramen","kimchi","egg","greenonion"],tm:10,cal:450,pro:14,tag:"메인",st:[{i:"🍜",t:"라면 끓이기"},{i:" Veggie",t:"김치 넣기"},{i:" Egg",t:"달걀 올리기"}],tp:"💡 김치를 먼저 볶고 물 넣으면 더 맛있어요"},
  {id:262,nm:"삼겹살 볶음면",e:"🍜",ig:["ramen","pork_belly","cabbage","onion","greenonion","garlic"],tm:15,cal:520,pro:18,tag:"메인",st:[{i:"🥩",t:"삼겹 볶기"},{i:"🍜",t:"라면 2분 삶기"},{i:" Fire",t:"채소+면+수프반 볶기"}],tp:"💡 삼겹기름으로 볶으면 윤기"},
  {id:263,nm:"두부김치덮밥",e:"🍚",ig:["tofu","kimchi","pork_belly","rice","greenonion"],tm:20,cal:422,pro:22,tag:"메인",st:[{i:"🧈",t:"두부 굽기"},{i:"🥩",t:"삼겹+김치 볶기"},{i:" Rice",t:"밥+두부+김치볶음"}],tp:"💡 두부김치를 밥 위에!"}
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
    const m=pick(ms,uM);if(m){uM.add(m.id);addC(m);din.push({...m,role:"메인"})}
    const s=pick(ss,uS);if(s){uS.add(s.id);addC(s);din.push({...s,role:"국/찌개"})}
    const s1=pick(sd,uSd);if(s1){uSd.add(s1.id);addC(s1);din.push({...s1,role:"밑반찬"})}
    if(isW){const s2=pick(sd,uSd);if(s2){uSd.add(s2.id);addC(s2);din.push({...s2,role:"밑반찬"})}}
    let lu=null;
    if(isW){const lm=pick(ms,uM);if(lm){uM.add(lm.id);addC(lm);lu={...lm,role:"점심"}}}
    plan.push({day:labs[i],isW,dinner:din,lunch:lu})
  }
  const unc=sel.filter(id=>cov[id]===0&&!["rice","garlic","greenonion"].includes(id));
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
  const[page,setPage]=useState("home");
  const[step,setStep]=useState(0);
  const[pt,setPt]=useState(null);
  const[sel,setSel]=useState(["rice","garlic","greenonion"]);
  const[res,setRes]=useState(null);
  const[di,setDi]=useState(0);
  const[mod,setMod]=useState(null);
  const[saved,setSaved]=useState([]);
  const[viewPlan,setViewPlan]=useState(null);
  const[viewDay,setViewDay]=useState(0);
  const[saveMsg,setSaveMsg]=useState("");
  const[showSaveModal,setShowSaveModal]=useState(false);
  const[saveWeek,setSaveWeek]=useState(0);

  useEffect(() => {
    try {
      const r = localStorage.getItem("saved_plans");
      if (r) setSaved(JSON.parse(r));
    } catch (e) {
      console.error("Load error", e);
    }
  }, []);

  const savePlan = (weekOffset = 0) => {
    if (!res) return;
    const now = new Date();
    const mon = getMonday(now);
    mon.setDate(mon.getDate() + weekOffset * 7);
    const entry = { id: Date.now(), created: now.toISOString(), weekStart: mon.toISOString(), planType: pt, plan: res.plan, sel: [...sel], total: sh.reduce((s, i) => s + i.p, 0) };
    const next = [entry, ...saved.filter(s => s.weekStart !== mon.toISOString())].slice(0, 20);
    setSaved(next);
    try {
      localStorage.setItem("saved_plans", JSON.stringify(next));
    } catch (e) {
      console.error("Save error", e);
    }
    setSaveMsg("✅ 저장완료!"); setShowSaveModal(false); setTimeout(() => setSaveMsg(""), 2000);
  };

  const deletePlan = (id) => {
    const next = saved.filter(s => s.id !== id);
    setSaved(next);
    try {
      localStorage.setItem("saved_plans", JSON.stringify(next));
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  const tog=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const av=useMemo(()=>RCP.filter(r=>r.ig.every(i=>sel.includes(i))),[sel]);
  const sh=INGS.filter(i=>sel.includes(i.id));
  const tot=sh.reduce((s,i)=>s+i.p,0);
  const nut=res?analyzeNut(res.plan):null;
  const gen=()=>{setRes(buildPlan(sel,pt==="7day"?7:5,pt==="7day"));setDi(0);setStep(3);setPage("plan")};

  const getMonday=(d)=>{const dt=new Date(d);const day=dt.getDay();const diff=dt.getDate()-day+(day===0?-6:1);return new Date(dt.setDate(diff))};
  const fmtDate=(d)=>{const dt=new Date(d);return`${dt.getMonth()+1}/${dt.getDate()}`};
  const fmtWeek=(d)=>{const dt=new Date(d);const end=new Date(dt);end.setDate(end.getDate()+6);return`${dt.getMonth()+1}/${dt.getDate()} ~ ${end.getMonth()+1}/${end.getDate()}`};
  const getWeekLabel=(offset)=>{const m=getMonday(new Date());m.setDate(m.getDate()+offset*7);const e=new Date(m);e.setDate(e.getDate()+6);const monthNum=m.getMonth()+1;const weekOfMonth=Math.ceil(m.getDate()/7);return{label:`${monthNum}월 ${weekOfMonth}주차`,range:`${m.getMonth()+1}/${m.getDate()}~${e.getMonth()+1}/${e.getDate()}`}};

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

  const Nav=()=>(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"100vw",background:"#fff",borderTop:`1px solid ${bd}`,display:"flex",zIndex:50,paddingBottom:"env(safe-area-inset-bottom)"}}>
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
            <span style={{color:ac,fontWeight:700}}>₩{tot.toLocaleString()}</span> · 끼니당 <strong>₩{Math.round(tot/nut.ml).toLocaleString()}</strong>
          </p>

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

          <div style={{background:"#fff",borderRadius:16,padding:16,border:`1px solid ${bd}`,marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>📊 영양분석</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"일평균 칼로리",v:`${nut.dc}kcal`,c:nut.dc<400?"#e53e3e":gn},{l:"일평균 단백질",v:`${nut.dp}g`,c:nut.dp<30?"#e53e3e":gn}].map((n,i)=>(
                <div key={i} style={{background:bg,borderRadius:10,padding:10,textAlign:"center"}}>
                  <div style={{fontSize:10.5,color:su,marginBottom:3}}>{n.l}</div>
                  <div style={{fontSize:17,fontWeight:800,color:n.c}}>{n.v}</div></div>))}
            </div>
          </div>

          <div style={{background:"#fff",borderRadius:16,padding:16,border:`1px solid ${bd}`,marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:10}}>🛒 장보기</h3>
            {sh.map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<sh.length-1?`1px solid ${bd}`:"none",fontSize:13}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span>{item.e}</span><div><div style={{fontWeight:600}}>{item.n}</div><div style={{fontSize:10.5,color:su}}>{item.u}</div></div>
                </div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:700}}>₩{item.p.toLocaleString()}</div></div>
              </div>))}
            <div style={{marginTop:10,paddingTop:10,borderTop:`2px solid ${tx}`,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontWeight:700}}>합계</span><span style={{fontWeight:800,fontSize:20,color:ac}}>₩{tot.toLocaleString()}</span>
            </div></div>
        </div>
      )}

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
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[...saved].sort((a,b)=>new Date(a.weekStart)-new Date(b.weekStart)).map((s)=>(
                    <div key={s.id} style={{background:"#fff",borderRadius:16,padding:16,border:`1px solid ${bd}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <div style={{fontWeight:700,fontSize:14}}>{(()=>{const dt=new Date(s.weekStart);return`${dt.getMonth()+1}월 ${Math.ceil(dt.getDate()/7)}주차`})()}</div>
                          <div style={{fontSize:11.5,color:su,marginTop:2}}>{fmtWeek(s.weekStart)}</div>
                        </div>
                        <button onClick={()=>deletePlan(s.id)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#ccc",padding:4}}>×</button>
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
            <div>
              <button onClick={()=>setViewPlan(null)} style={{background:"none",border:"none",fontSize:14,color:su,cursor:"pointer",marginBottom:16,fontFamily:"inherit"}}>← 목록으로</button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:3}}>📅 {fmtWeek(viewPlan.weekStart)}</h2>
              <div style={{display:"flex",gap:5,marginBottom:16,overflowX:"auto",paddingBottom:3}}>
                {viewPlan.plan.map((d,i)=>(
                  <button key={i} onClick={()=>setViewDay(i)}
                    style={{padding:"8px 14px",borderRadius:10,border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",
                      background:viewDay===i?tx:"#fff",color:viewDay===i?"#fff":su,fontWeight:viewDay===i?700:500}}>
                    {d.day}
                  </button>))}
              </div>
              {viewPlan.plan[viewDay]&&(
                <div>
                  <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
                    {viewPlan.plan[viewDay].dinner.map((m,i)=><Card key={i} r={m}/>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Nav/>

      {showSaveModal&&(
        <div onClick={()=>setShowSaveModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:bg,borderRadius:20,width:"90%",padding:24}}>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:18}}>📅 어느 주에 저장할까요?</h3>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {[0,1,2].map(off=>{
                const wk=getWeekLabel(off);
                return(
                  <button key={off} onClick={()=>savePlan(off)}
                    style={{padding:"14px 16px",borderRadius:14,border:`1.5px solid ${bd}`,background:"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                    <div style={{fontWeight:700,fontSize:14}}>{wk.label}</div>
                    <div style={{fontSize:12,color:su}}>{wk.range}</div>
                  </button>);
              })}
            </div>
          </div>
        </div>
      )}

      {mod&&(
        <div onClick={()=>setMod(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:bg,borderRadius:"24px 24px 0 0",width:"100%",maxHeight:"88vh",overflowY:"auto",padding:"20px 20px 28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:32}}>{mod.e}</span>
                <div style={{fontWeight:800,fontSize:18}}>{mod.nm}</div>
              </div>
              <button onClick={()=>setMod(null)} style={{background:"none",border:"none",fontSize:26,cursor:"pointer",color:su}}>×</button>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>🧂 재료</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {mod.ig.map(id=>{const ig=IG(id); return ig?(<span key={id} style={{padding:"5px 10px",borderRadius:999,background:wm,fontSize:12}}>{ig.e} {ig.n}</span>):null;})}
              </div>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>👨‍🍳 조리 순서</div>
              {mod.st.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:12}}>
                  <span style={{width:24,height:24,borderRadius:"50%",background:tx,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span>
                  <div style={{background:"#fff",borderRadius:12,padding:"10px 14px",flex:1,border:`1px solid ${bd}`,fontSize:13}}>{s.t}</div>
                </div>))}
            </div>
          </div>
        </div>
      )}
      import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
    </div>)
}
