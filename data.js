// 核爆庇護所：第 04 檢查哨 — 角色與怪物資料庫（共 31 位訪客：10 名正常人類 + 20 隻偽裝怪物 + 管理人員周軒宇）
// 訪客姓名與職業已完全隱藏破綻，僅在消滅偽人後才揭示其真實異常類型

window.GAME_VISITORS = [
  // ===== 管理人員：周軒宇 =====
  {
    id: 'admin_zhou',
    name: '周軒宇',
    role: '基地管理人員（最高權限）',
    isAdmin: true,
    isMonster: false,
    category: '管理人員',
    temp: 36.6,
    imgNormal: 'assets/portraits/zhou_xuanyu.jpg',
    dialogue: '「檢查員辛苦了！今天值勤是否正常？（我帶了補給過來，體力 +5）」',
    adminReplies: {
      '今天很正常': '「那就好，有你在檢查哨把關，基地裡大家都很安心。我先進去巡視了！」',
      '今天抓了很多偽人': '「辛苦你了……外面的偽人越來越狡猾了，記得適時喝杯咖啡提神。我先進去調度物資！」',
      '覺得很累': '「長時間盯著窗外確實很耗神，撐住！這份體力補給先撐著，換班後再好好休息。」'
    }
  },

  // ===== 20 隻偽裝怪物（外觀名稱與職業完全偽裝為普通人） =====
  // 1-2. 體溫過低 (<15°C)
  {
    id: 'm01',
    name: '王志豪',
    role: '北方避難所逃難者',
    isMonster: true,
    category: '體溫過低 (<15°C)',
    temp: 8.4,
    imgNormal: 'assets/portraits/m01_frost.jpg',
    dialogue: '「好冷……外面下著輻射灰，讓我進去暖暖身子吧……我真的不是那些怪物……」'
  },
  {
    id: 'm02',
    name: '陳俊傑',
    role: '物資搬運工',
    isMonster: true,
    category: '體溫過低 (<15°C)',
    temp: 11.2,
    imgNormal: 'assets/portraits/m02_wax.jpg',
    dialogue: '「請開門。我的身體……很正常。沒有發燒，也沒有受傷。請讓我進去。」'
  },

  // 3-4. 體溫過高 (>42°C)
  {
    id: 'm03',
    name: '李國華',
    role: '發電廠維修員',
    isMonster: true,
    category: '體溫過高 (>42°C)',
    temp: 47.8,
    imgNormal: 'assets/portraits/m03_charred.jpg',
    dialogue: '「呼……這防護服裡頭悶死人了，外面剛發生二次燃爆，快開門放我進去！」'
  },
  {
    id: 'm04',
    name: '張凱文',
    role: '醫療隊跑腿員',
    isMonster: true,
    category: '體溫過高 (>42°C)',
    temp: 44.5,
    imgNormal: 'assets/portraits/m04_boiling.jpg',
    dialogue: '「我剛跑了五公里過來，只是有點喘、有點熱而已！拜託別對我用玻璃罩！」'
  },

  // 5-9. 拍照異常（肉眼正常，拍照顯影露出破綻）
  {
    id: 'm05',
    name: '趙子軒',
    role: '流浪機械師',
    isMonster: true,
    category: '拍照異常（無臉孔）',
    temp: 36.5,
    imgNormal: 'assets/portraits/m05_normal.jpg',
    imgPhoto: 'assets/portraits/m05_photo.jpg',
    photoNote: '【異常】照片裡沒有五官！',
    dialogue: '「長官，我只是想找個乾淨的水源和庇護所。你可以看我的臉，我跟普通人一樣啊。」'
  },
  {
    id: 'm06',
    name: '林俊宏',
    role: '避難所後勤員',
    isMonster: true,
    category: '拍照異常（背後多出人頭）',
    temp: 36.4,
    imgNormal: 'assets/portraits/m06_normal.jpg',
    imgPhoto: 'assets/portraits/m06_photo.jpg',
    photoNote: '【異常】肩後多出慘白人頭！',
    dialogue: '「我是一個人走過來的，同伴都在路上走散了……奇怪，為什麼我總覺得左邊肩膀很重？」'
  },
  {
    id: 'm07',
    name: '周雅雯',
    role: '植物學研究員',
    isMonster: true,
    category: '拍照異常（裂嘴尖牙）',
    temp: 36.8,
    imgNormal: 'assets/portraits/m07_normal.jpg',
    imgPhoto: 'assets/portraits/m07_photo.jpg',
    photoNote: '【異常】照片中嘴裂到耳根！',
    dialogue: '「你好呀，值班人員！要拍照建檔嗎？沒問題，我會好好對著鏡頭微笑的。」'
  },
  {
    id: 'm08',
    name: '吳建華',
    role: '退伍巡邏兵',
    isMonster: true,
    category: '拍照異常（照片裡沒有身體）',
    temp: 36.3,
    imgNormal: 'assets/portraits/m08_normal.jpg',
    imgPhoto: 'assets/portraits/m08_photo.jpg',
    photoNote: '【異常】照片中大衣裡空無一物！',
    dialogue: '「這件大衣很厚實吧？靠它擋了不少輻射塵。快點放行，裡面有人在等我報到。」'
  },
  {
    id: 'm09',
    name: '鄭宇翔',
    role: '地下鐵技工',
    isMonster: true,
    category: '拍照異常（頭顱上下顛倒）',
    temp: 36.7,
    imgNormal: 'assets/portraits/m09_normal.jpg',
    imgPhoto: 'assets/portraits/m09_photo.jpg',
    photoNote: '【異常】照片中頭顱 180 度倒轉！',
    dialogue: '「從剛剛就一直聽說要檢查拍照，拍吧，只要不耽誤我進基地吃晚餐就行。」'
  },

  // 10-14. 外觀直接看出異常
  {
    id: 'm10',
    name: '孫大強',
    role: '外圍拾荒者',
    isMonster: true,
    category: '外觀異常（長角＋第三隻眼）',
    temp: 36.6,
    imgNormal: 'assets/portraits/m10_horned_eye.jpg',
    dialogue: '「別……別用那種眼神看我，只是核輻射讓人長了點小東西而已，我還是人類啊……」'
  },
  {
    id: 'm11',
    name: '何志偉',
    role: '倉儲搬運工',
    isMonster: true,
    category: '外觀異常（三隻手）',
    temp: 36.5,
    imgNormal: 'assets/portraits/m11_three_arms.jpg',
    dialogue: '「我力氣很大，可以幫基地搬運重物！多一隻手幫忙工作不是更好嗎？」'
  },
  {
    id: 'm12',
    name: '高詩涵',
    role: '診所護理師',
    isMonster: true,
    category: '外觀異常（眼睛異常複瞳）',
    temp: 36.4,
    imgNormal: 'assets/portraits/m12_double_pupil.jpg',
    dialogue: '「我看得很清楚……你的動作、你的猶豫，我都看得一清二楚喔。」'
  },
  {
    id: 'm13',
    name: '馮家銘',
    role: '夜間信差',
    isMonster: true,
    category: '外觀異常（三隻腳）',
    temp: 36.7,
    imgNormal: 'assets/portraits/m13_three_legs.jpg',
    dialogue: '「外頭的路很難走，還好我站得很穩……怎麼了？一直往下看幹嘛？」'
  },
  {
    id: 'm14',
    name: '沈志遠',
    role: '建築工人',
    isMonster: true,
    category: '外觀異常（臉頰鰓裂）',
    temp: 36.8,
    imgNormal: 'assets/portraits/m14_split_jaw.jpg',
    dialogue: '「外面的空氣越來越稀薄了，這只是為了多吸幾口氣罷了，讓我進去！」'
  },

  // 15-19. X 光照射才發現異常
  {
    id: 'm15',
    name: '羅文彬',
    role: '淨水廠技師',
    isMonster: true,
    category: 'X 光異常（胸腔寄生蟲）',
    temp: 36.9,
    imgNormal: 'assets/portraits/m15_normal.jpg',
    imgXray: 'assets/portraits/m15_xray.jpg',
    xrayNote: '【異常】胸腔內盤踞巨大節肢蟲！',
    dialogue: '「我肚子有點不舒服，大概是路上吃了過期罐頭。體溫正常，直接放我進去吧。」'
  },
  {
    id: 'm16',
    name: '曾柏翰',
    role: '基地通訊兵',
    isMonster: true,
    category: 'X 光異常（蛇形螺旋脊椎）',
    temp: 36.6,
    imgNormal: 'assets/portraits/m16_normal.jpg',
    imgXray: 'assets/portraits/m16_xray.jpg',
    xrayNote: '【異常】無肋骨且脊椎呈螺旋盤繞！',
    dialogue: '「長官好，我外表與體溫一切正常，請儘快放行，我有急件要轉交指揮室。」'
  },
  {
    id: 'm17',
    name: '楊淑芬',
    role: '中學教師',
    isMonster: true,
    category: 'X 光異常（體內藏三顆頭骨）',
    temp: 36.7,
    imgNormal: 'assets/portraits/m17_normal.jpg',
    imgXray: 'assets/portraits/m17_xray.jpg',
    xrayNote: '【異常】腹腔內塞滿人類頭骨！',
    dialogue: '「我吃得比較飽而已……外面好餓，能順利抵達這裡真是太好了。」'
  },
  {
    id: 'm18',
    name: '梁世昌',
    role: '貨運司機',
    isMonster: true,
    category: 'X 光異常（體內無任何骨骼）',
    temp: 36.5,
    imgNormal: 'assets/portraits/m18_normal.jpg',
    imgXray: 'assets/portraits/m18_xray.jpg',
    xrayNote: '【異常】體內完全沒有骨頭！',
    dialogue: '「你看我這麼壯，進去以後一定能幫忙守夜，不需要浪費體力檢查了吧？」'
  },
  {
    id: 'm19',
    name: '郭俊宇',
    role: '藥劑師',
    isMonster: true,
    category: 'X 光異常（雙心臟畸形）',
    temp: 37.0,
    imgNormal: 'assets/portraits/m19_normal.jpg',
    imgXray: 'assets/portraits/m19_xray.jpg',
    xrayNote: '【異常】胸腔左右各有兩顆心臟！',
    dialogue: '「心跳？我的心臟一直跳得很有力呢，甚至……比一般人還要強壯一倍喔。」'
  },

  // 20. 複合型菁英怪
  {
    id: 'm20',
    name: '韓志強',
    role: '外勤小隊長',
    isMonster: true,
    category: '雙重異常（低溫 12.1°C ＋ 無脊椎）',
    temp: 12.1,
    imgNormal: 'assets/portraits/m20_normal.jpg',
    imgXray: 'assets/portraits/m20_xray.jpg',
    xrayNote: '【異常】體內缺少脊椎骨！',
    dialogue: '「例行換防歸隊。不用照規矩查了，快打開氣閘門，我趕時間。」'
  },

  // ===== 10 名正常人類倖存者 =====
  {
    id: 'h01',
    name: '林志明',
    role: '水電技師',
    isMonster: false,
    category: '正常人類',
    temp: 36.5,
    imgNormal: 'assets/portraits/h01_lin.jpg',
    dialogue: '「總算走到第 04 檢查哨了……我是隔壁區的水電工，工具包裡只有扳手和膠帶。」'
  },
  {
    id: 'h02',
    name: '陳雅婷',
    role: '急診護理師',
    isMonster: false,
    category: '正常人類',
    temp: 36.7,
    imgNormal: 'assets/portraits/h02_chen.jpg',
    dialogue: '「請放心檢查吧，基地裡應該很缺醫護人員，我可以幫忙照顧傷患。」'
  },
  {
    id: 'h03',
    name: '張建國',
    role: '退休教師',
    isMonster: false,
    category: '正常人類',
    temp: 36.3,
    imgNormal: 'assets/portraits/h03_zhang.jpg',
    dialogue: '「年紀大了走得慢，幸好在天黑前趕到。這是我僅存的配給證，請過目。」'
  },
  {
    id: 'h04',
    name: '蘇小雨',
    role: '大學生',
    isMonster: false,
    category: '正常人類',
    temp: 36.8,
    imgNormal: 'assets/portraits/h04_su.jpg',
    dialogue: '「外面剛剛好像有東西在叫……好可怕，檢查完可以讓我進去嗎？」'
  },
  {
    id: 'h05',
    name: '黃大偉',
    role: '農藝研究員',
    isMonster: false,
    category: '正常人類',
    temp: 36.6,
    imgNormal: 'assets/portraits/h05_huang.jpg',
    dialogue: '「我帶了幾包耐輻射的蔬菜種子過來，希望能幫基地建立溫室。」'
  },
  {
    id: 'h06',
    name: '吳美玲',
    role: '廚師',
    isMonster: false,
    category: '正常人類',
    temp: 36.9,
    imgNormal: 'assets/portraits/h06_wu.jpg',
    dialogue: '「只要有基本食材，我就能幫大家煮熱湯！你們值班員應該都吃冷罐頭吧？」'
  },
  {
    id: 'h07',
    name: '劉家豪',
    role: '無線電愛好者',
    isMonster: false,
    category: '正常人類',
    temp: 36.4,
    imgNormal: 'assets/portraits/h07_liu.jpg',
    dialogue: '「我剛剛在半路上收到基地的緊急廣播才趕來的，現在外面訊號很亂。」'
  },
  {
    id: 'h08',
    name: '蔡佩珊',
    role: '幼兒園老師',
    isMonster: false,
    category: '正常人類',
    temp: 36.6,
    imgNormal: 'assets/portraits/h08_cai.jpg',
    dialogue: '「謝謝你願意守在這裡……有你在前面把關，大家才能睡個好覺。」'
  },
  {
    id: 'h09',
    name: '許文傑',
    role: '消防員',
    isMonster: false,
    category: '正常人類',
    temp: 37.1,
    imgNormal: 'assets/portraits/h09_xu.jpg',
    dialogue: '「剛滅完避難所外圍的小火趕過來，身上有點煙味，體溫可能微高一點點但絕對正常。」'
  },
  {
    id: 'h10',
    name: '謝靜怡',
    role: '氣象觀測員',
    isMonster: false,
    category: '正常人類',
    temp: 36.2,
    imgNormal: 'assets/portraits/h10_xie.jpg',
    dialogue: '「今天晚上的落塵濃度又升高了，你在裡面值班也要注意通風過濾器喔。」'
  },
  {
    id: 'h11',
    name: '林阿豪',
    role: '外圍物資搜集員',
    isMonster: false,
    category: '正常人類（配戴小丑面具）',
    temp: 36.4,
    imgNormal: 'assets/portraits/h11_mask_clown.jpg',
    dialogue: '「長官別誤會、別按紅鈕啊！這只是我在廢棄遊樂園撿來嚇怪物用的小丑面具，你看我臉旁有黑色的綁線！」'
  },
  {
    id: 'h12',
    name: '方志遠',
    role: '廢墟巡守員',
    isMonster: false,
    category: '正常人類（配戴骷髏面具）',
    temp: 36.6,
    imgNormal: 'assets/portraits/h12_mask_skull.jpg',
    dialogue: '「別緊張！這只是我在外面撿來防輻射塵跟嚇阻怪物的面具，你看我耳邊還有綁線呢……體溫完全正常。」'
  }
];
