# 數論密室 · 章節關卡藍圖

> **職責：本檔＝敘事/章節設計層（非 gen 規格）。** 逐關施工數值一律以 `LEVEL_SPEC.md`（canonical，28 關）為準；本檔僅供章節故事與煉金階段對照。
> **狀態（2026-06-17）：v2 機制重構進行中（branch `v2-refactor`）**；下方「落地狀態」描述的是 v1（29 關，已凍結於 branch `v1-stable`）。v1→v2 對映見 `_scratch\qed_v1_v2_mapping.md`。
>
> 設計藍圖（非程式碼）。定案後再落地成 `index.html` 內的資料結構。
> 來源課程：`F:\claude_code\cryptography`（ch1–ch13 + arithmetic/algebra + demos）。
> 範圍：**數論 → 公鑰核心**（對稱密碼 DES/AES 偏位元操作，與「BigInt 數論卡牌」引擎不合拍，本作不收）。
> 建立 2026-06-17。
>
> **機制／教學架構見 [`GAME_ARCH.md`](GAME_ARCH.md)（v2 重構）**：零能量記步數、謂詞勝利、破解兩段式、去公式化提示、why 閘題庫、四類分類體系、Paar 題庫對映。本檔管「章節內容」，GAME_ARCH 管「玩法邏輯」。
> **逐關施工規格見 [`LEVEL_SPEC.md`](LEVEL_SPEC.md)**：28 關每關配好 Paar 題號＋小參數＋盤面／手牌／謂詞／par，照著寫 gen 函式。

## 落地狀態（2026-06-17）
- **決策定案**：roguelike 編排採 **A 章節選單線性解鎖**；**ECC（Ch4）延後**補。
- **波 1 已落地並通過引擎驗證**：E1 章節資料層（`CHAPTERS[]`）＋章節地圖選單＋localStorage 解鎖進度；新卡 `modadd`/`modsub`/`phi`/`crt`；**Ch0 質料準備（5 關）、Ch1 黑化（3 關）、Ch2 白化 RSA（5 關）全關**。13 關各 200 次隨機 roll、verifyInstance 全綠 0 fail，王關通關→解鎖下一章→終章「大功業完成」流程實測通過。
- **互動改造已落地（2026-06-17）**：運算卡由「點卡→讀文字提示→依序點數」改為 **嬗變槽公式建構器**——選卡後**底部浮現浮動抽屜**（`position:fixed`，零流式空間，不推擠下方內容，見 [[feedback_no_layout_reflow]]），顯示真實公式模板（如 `▢^▢ mod ▢`，標角色），盤面數可**拖入**任一空格或**點選**依序填入，槽內即時顯示值、下方**即時預覽結果**，按「嬗變」才提交（保留點選與鍵盤 a11y）；工作檯保留一行靜態提示。實測：零位移(boardShift=handShift=0)/拖放/點選/亂序填格/清格/預覽/王關 6 步全綠。
- **波 2 已落地並通過驗證（2026-06-17）**：E2 等值勝利（`inst.winCount`，預設 1；=2 即「兩 token 同值」＝K_A==K_B / m′==H(m)，改 `verifyInstance` 與 `checkVictory`）；新卡 `dlog`（離散對數，線性搜尋，el=struct，cost 3）/`hash`（玩具雜湊 H(x)=x³+x+1 mod 19，新元素 `sal 🜔`，cost 1）；**Ch3 黃化 DLP（5 關：立基元/雙鑰交換/共識之鑰/ElGamal/破DLP王）、Ch5 封印簽章（5 關：落款/驗印/偽造之誘/生日碰撞/大功業完成終王）全關**。node 重放 `_scratch/verify_wave2.js` 抽 index.html 真引擎跑 23 關各 3000 次＝0 fail 0 fallback；DOM 實機自動解：winCount=2 等值勝利、8 步大功業鏈(Q.E.D.)、dlog 王關全綠、無 console error。
- **波 3 已落地並通過驗證（2026-06-17）**：E3 點 token 型別＝`token.value` 可為 BigInt 或點 `{x,y,a,b,p}`／無窮遠 `{inf:true,a,b,p}`；新增 `valEq()`（跨 BigInt/點的值相等，取代所有 `===inst.target`）＋`fmtVal()`（點顯示 `(x, y)`／`𝒪`，覆蓋 renderTokens/renderVessel/preview/log/drag-ghost 全顯示點）。EC 數學全 Fp 實作：`ecAdd/ecDbl/ecMul/ecOrder/ecFindPoint/ecCurve/ecdlogSolve/ecOnCurve/ecNeg`。新元素 `rubeus 🜂`（火紅，`--el-rub`）。新卡 4 張：`ptadd`/`ptdbl`(rub,cost1)、`scalarmul`(rub,cost2,double-and-add)、`ecdlog`(struct,cost3,暴搜純量)。**Ch4 紅化 ECC 全 6 關**：點加之術/倍點之術/弦切之鏈(3P=2P⊕P)/點乘之階(kP)/曲線交鑰(ECDH,winCount2 點相等)/破ECDLP(王,ecdlog→純量)。**章節陣列已正序定案**：Ch0 質料／Ch1 黑化／Ch2 白化／Ch3 黃化 DLP／Ch4 紅化 ECC／封印簽章（共 6 章 29 關）。node `_scratch/verify_wave2.js` 跑 29 關各 3000 次＝0 fail 0 fallback；DOM 實機：點加 P⊕Q、ECDH winCount2 雙點相等、破ECDLP ecdlog→k、點以 `(x,y)` 渲染、紅化 boss overlay、地圖 6 章正序、19 張卡全綠、無 console error。（截圖工具因動畫 rAF 迴圈逾時，非程式錯。）
- **三波全部完成**。
- **通關轉錄匯出 PDF＋數學註解已落地（2026-06-17）**：structured transcript（步驟存物件 `{cardId,card,ins,outs}`，undo 連帶還原）＋ `state.proofLog`（逐關歸檔，整章累積）＋ 18 卡 `CARD_NOTE` 運算級繁中註解 ＋ `buildProofDoc()`/`exportProof()` 用瀏覽器 `window.print()`（零依賴）＋ `#proofdoc` 列印容器與 `@media print`（`body>*:not(#proofdoc)` 只印證明）。win overlay 加「匯出證明 PDF」鈕。實機驗證：跑完整 Ch1（3 關 8 步）proofLog 正確歸檔、註解齊全、Q.E.D./頁尾、undo 還原 transcript、node 29 關仍 0/0。
- 剩餘 backlog：標籤合成偶有醜字微調；未來線代/微積分各為 qed-lab 一支、抽共用 engine-core。
- 細節未改：標籤合成偶有醜字（如 `c=13^e=7⁻¹`），列為 Wave 2 收尾微調。

---

## 0. 設計總綱

### 0.1 一句話
把密碼學課程的「數論地基 → 三大公鑰系統 → 簽章認證」重排成 **6 個章節關卡集**，每章一個煉金階段，玩家用數論運算卡牌在工作檯上一步步把目標數「煉」出來，引擎用 BigInt 實際計算驗證每一步、保證可解。

### 0.2 章節 ↔ 煉金大功業 ↔ 課程對照

| 章 | 煉金階段 | 主題 | 對應課程 | 關數 | 角色 |
|----|---------|------|---------|------|------|
| **0** | 質料準備 _Materia Prima_ | 數論基礎 | `arithmetic.html` | 5 | 序章 / 教學 |
| **1** | 黑化 _Nigredo_ | 古典密碼 | `ch1_introduction.html` | 3 | 暖身 |
| **2** | 白化 _Albedo_ | RSA | `ch7_rsa.html` | 5 | 主線王關 |
| **3** | 黃化 _Citrinitas_ | 離散對數 / DH | `ch8_discrete_log.html` | 5 | 主線王關 |
| **4** | 紅化 _Rubedo_ | 橢圓曲線 | `ch9_ecc.html` | 6 | 主線王關（最難） |
| **5** | 封印 _Sigillum_ | 簽章 / 雜湊 / MAC | `ch10`–`ch12` | 5 | 終章 |

> 敘事弧：黑（拆解原料）→白（純化＝RSA 還原）→黃（點化＝離散對數）→紅（完成體＝橢圓曲線），最後以「簽章封印」蓋章作結（Q.E.D.）。

### 0.3 對照課程依賴圖（前置鎖）
```
Ch0 數論基礎 ─┬─→ Ch1 古典（modadd/modmul/modinv）
              ├─→ Ch2 RSA（phi/modinv/modpow/crt/factor）
              ├─→ Ch3 DLP（modpow）
              ├─→ Ch4 ECC（modinv/modmul → ptadd/ptdbl/scalarmul）
              └─→ Ch5 簽章（modpow + hash）
```
Ch0 是所有後續章的共同前置；Ch2–Ch5 彼此獨立，可在章節選單自由挑（但建議照黑白黃紅順序解鎖）。

---

## 1. 卡牌總表

### 1.1 現有 9 張（沿用，`index.html` 行 377–399）
| ID | 名稱 | 元素 | 耗能 | 運算 |
|----|------|------|------|------|
| `modsq` | 平方 | cong ≡ | 1 | a² mod m |
| `modmul` | 模乘 | cong ≡ | 1 | a·b mod m |
| `modpow` | 模冪 | cong ≡ | 1 | b^e mod m |
| `modinv` | 模逆 | struct ∴ | 1 | a⁻¹ mod m（gcd≠1 報錯） |
| `gcd` | 歐幾里得 | struct ∴ | 1 | gcd(a,b) |
| `fermat` | 費馬約簡 | struct ∴ | 1 | e mod (p−1)（非質數報錯） |
| `mul` | 整數乘 | int ℤ | 1 | a·b |
| `dec` | 減一 | int ℤ | 1 | a−1 |
| `factor` | 分解 | fac ∣ | 2 | n → p, q（質數報錯） |

### 1.2 需新增的卡（標 ★＝必要、☆＝可選加味）
| ID | 名稱 | 元素 | 耗能 | 運算 | 用於 | 急迫度 |
|----|------|------|------|------|------|--------|
| `modadd` | 模加 | cong ≡ | 1 | (a+b) mod m | Ch1 古典 | ★ |
| `phi` | 歐拉函數 | struct ∴ | 1 | φ(n)；接 factor 後 (p−1)(q−1) | Ch0/Ch2 | ★ |
| `crt` | 孫子合併 | struct ∴ | 2 | {a₁ mod m₁, a₂ mod m₂} → x mod m₁m₂ | Ch0/Ch2 | ★ |
| `ptadd` | 點加 | rubeus 🜂 | 1 | P+Q（曲線群法則） | Ch4 ECC | ★ |
| `ptdbl` | 倍點 | rubeus 🜂 | 1 | 2P | Ch4 ECC | ★ |
| `scalarmul` | 點乘 | rubeus 🜂 | 2 | kP（double-and-add） | Ch4 ECC | ★ |
| `dlog` | 離散對數 | struct ∴ | 3 | 解 g^x≡h，回傳 x（baby-step giant-step） | Ch3 王關 | ☆ |
| `hash` | 雜湊 | sal 🜔 | 1 | H(m)（玩具雜湊，固定算法） | Ch5 | ☆ |

> 新元素 `rubeus 🜂`（火/紅）給橢圓曲線點運算，呼應紅化階段；`sal 🜔`（鹽）給雜湊。沿用現有 4 元素美術系統再加這兩色即可。

---

## 2. 引擎擴充需求（依優先序）

現引擎：`runPath → verifyInstance → rollInstance`，token = `{id, value:BigInt, label, kind?}`，勝利＝盤面出現 `target`。要支援新章節，需以下擴充：

| # | 擴充 | 為什麼 | 影響章 | 規模 |
|---|------|--------|--------|------|
| E1 | **章節資料層**：`FLOOR_DEFS` → `CHAPTERS[{id,name,opus,floors[]}]`，state 加 `chapter` | 關卡集分章；章節選單 | 全部 | 中 |
| E2 | **等值勝利條件**：除「出現 target」外，支援「兩 token 相等」 | DH 共享密鑰 K_A==K_B、驗章 m'==m | Ch3,Ch5 | 小 |
| E3 | **點 token 型別**：token.value 可為 `{x,y}` 或 ∞，附曲線上下文 (a,b,p) | ECC 整章 | Ch4 | 大 |
| E4 | `modadd` / `phi` / `crt` 卡（純 BigInt，沿用現 resolve 模式） | Ch0,Ch1,Ch2 | Ch0–2 | 小 |
| E5 | **多同餘輸入**：CRT 卡要吃「值+模」配對，盤面需能表達同餘式 token | crt 卡 | Ch0,Ch2 | 中 |
| E6 | `dlog`/`hash` 卡（玩具規模，純計算） | DLP/簽章王關 | Ch3,Ch5 | 小 |
| E7 | **章節選單 + 解鎖進度**（localStorage 存已通章節） | roguelike 章節編排 | 全部 | 中 |

> 建議落地序：E1+E4（先把章節骨架與簡單新卡做出來，Ch0–Ch2 即可玩）→ E2（Ch3）→ E3（Ch4，最大工程）→ E6/E7 收尾。

---

## 3. 章節關卡集詳表

> 格式：每關列 **目標 / 手牌 / 前置 / 新需求 / 預算建議**。預算＝energy（沿用現制，每關過關可 +2 強化）。

### 第 0 章 · 質料準備（數論基礎）　對應 `arithmetic.html`
煉金房點燃前，先認識四種「質料」（運算）。純教學，每關手把手。

| 關 | 標題 | 目標 | 手牌 | 前置 | 新需求 | 預算 |
|----|------|------|------|------|--------|------|
| 0.1 | 同餘之火 | a·b mod m（給定數煉出餘數） | `modmul`,`modsq` | — | — | 3 |
| 0.2 | 輾轉之輪 | 求 gcd(a,b)，判互質 | `gcd` | — | — | 3 |
| 0.3 | 逆元之鏡 | 求 a⁻¹ mod m | `modinv`,`modmul` | 0.2 | — | 3 |
| 0.4 | 孫子之盤 | 由 {x≡a₁(m₁), x≡a₂(m₂)} 合出 x | `crt`,`modmul` | 0.3 | `crt`★, E5 | 4 |
| 0.5 | 歐拉之計 | 由 n 求 φ(n)（先 factor 再 phi） | `factor`,`phi` | 0.2 | `phi`★ | 4 |

### 第 1 章 · 黑化 Nigredo（古典密碼）　對應 `ch1_introduction.html`
最原始的密碼＝模算術披上字母外衣。短暖身章。

| 關 | 標題 | 目標 | 手牌 | 前置 | 新需求 | 預算 |
|----|------|------|------|------|--------|------|
| 1.1 | 凱撒之位移 | 解 c=(m+k) mod 26，還原明文 m | `modadd` | 0.1 | `modadd`★ | 3 |
| 1.2 | 仿射之鎖 | 解 c=(a·m+b) mod 26，需 a⁻¹ | `modinv`,`modmul`,`modadd` | 0.3,1.1 | — | 4 |
| 1.3 | 破譯（王） | 已知一對 (m,c) 反求金鑰 (a,b) | `modadd`,`modmul`,`modinv` | 1.2 | — | 5 |

### 第 2 章 · 白化 Albedo（RSA）　對應 `ch7_rsa.html` · `demos/demo_rsa.html`
把原料純化成金鑰對，再從密文還原明文。**主線第一座王關**，吸收現有「定理」關。

| 關 | 標題 | 目標 | 手牌 | 前置 | 新需求 | 預算 |
|----|------|------|------|------|--------|------|
| 2.1 | 鑄鑰 | 由 p,q 求 n=pq、φ=(p−1)(q−1)、d=e⁻¹ mod φ | `mul`,`phi`,`modinv`,`dec` | Ch0 全 | — | 5 |
| 2.2 | 封印（加密） | c = m^e mod n | `modpow` | 2.1 | — | 2 |
| 2.3 | 啟封（解密） | m = c^d mod n | `modpow` | 2.2 | — | 2 |
| 2.4 | 孫子捷徑 | 用 CRT 拆 mod p / mod q 加速解密 | `crt`,`modpow`,`fermat` | 0.4,2.3 | E5 | 5 |
| 2.5 | 破譯 RSA（王） | 給 n,e,c → factor → φ → d → m | `factor`,`phi`,`modinv`,`modpow`,`dec` | 全章 | — | 9 |

> 2.5 ＝現有 `genTheorem()` 王關，直接遷入本章作章末王。

### 第 3 章 · 黃化 Citrinitas（離散對數 / DH）　對應 `ch8_discrete_log.html` · `demos/demo_dh.html`
不再分解，而是「點化」：指數正向易、反向難。

| 關 | 標題 | 目標 | 手牌 | 前置 | 新需求 | 預算 |
|----|------|------|------|------|--------|------|
| 3.1 | 立基元 | 給 p,g，算公開值 A=g^a mod p | `modpow` | 0.1 | — | 2 |
| 3.2 | 雙鑰交換 | 算 A=g^a、B=g^b（兩公開值） | `modpow` | 3.1 | — | 3 |
| 3.3 | 共識之鑰 | 算 K_A=B^a、K_B=A^b，**驗 K_A==K_B** | `modpow` | 3.2 | E2★ | 3 |
| 3.4 | ElGamal 封印 | 公鑰 (p,g,y)、明文 m → 密文 (c₁,c₂) | `modpow`,`modmul` | 3.3 | — | 4 |
| 3.5 | 破 DLP（王） | 給 g,p,h=g^x，反求 x | `dlog`,`modpow` | 全章 | `dlog`☆ | 6 |

### 第 4 章 · 紅化 Rubedo（橢圓曲線）　對應 `ch9_ecc.html` · `demos/demo_ecc.html`
完成體：把「數」換成「曲線上的點」，群運算取代乘冪。**工程最大、難度最高**。

| 關 | 標題 | 目標 | 手牌 | 前置 | 新需求 | 預算 |
|----|------|------|------|------|--------|------|
| 4.1 | 鑄曲線 | 給 y²=x³+ax+b mod p，驗證點 P 在曲線上 | （驗證型） | — | E3★ | 2 |
| 4.2 | 點加之術 | P+Q（兩相異點） | `ptadd` | 4.1 | `ptadd`★ | 3 |
| 4.3 | 倍點之術 | 2P | `ptdbl` | 4.2 | `ptdbl`★ | 3 |
| 4.4 | 點乘之階 | kP（double-and-add 組合 ptadd/ptdbl） | `ptadd`,`ptdbl`,`scalarmul` | 4.3 | `scalarmul`★ | 5 |
| 4.5 | ECDH | 雙方算 a(bP)=b(aP)，**驗相等** | `scalarmul` | 4.4,E2 | — | 4 |
| 4.6 | 破 ECDLP（王） | 給 P,Q=kP（小曲線），反求 k | `ptadd`,`ptdbl`,`scalarmul` | 全章 | — | 8 |

> Ch4 依賴 **E3 點 token 型別**，是全藍圖最大工程。若要分期交付，Ch4 可獨立成「第二批」。

### 第 5 章 · 封印 Sigillum（簽章 / 雜湊 / MAC）　對應 `ch10`–`ch12`
大功業蓋章：用私鑰簽、公鑰驗，以雜湊封住完整性。終章，回收前面所有卡。

| 關 | 標題 | 目標 | 手牌 | 前置 | 新需求 | 預算 |
|----|------|------|------|------|--------|------|
| 5.1 | 落款（簽章） | sig = H(m)^d mod n | `hash`,`modpow` | Ch2 | `hash`☆ | 3 |
| 5.2 | 驗印 | m'=sig^e mod n，**驗 m'==H(m)** | `hash`,`modpow` | 5.1,E2 | — | 3 |
| 5.3 | 偽造之誘（王前） | 無雜湊時演示存在性偽造：選 sig 反推可驗 m | `modpow` | 5.2 | — | 4 |
| 5.4 | 生日碰撞 | 玩具雜湊找 H(m₁)==H(m₂) | `hash` | 5.1 | — | 5 |
| 5.5 | 大功業完成（最終王） | 自簽一條訊息鏈：鑄鑰→簽→驗，全綠則 Q.E.D. | `mul`,`phi`,`modinv`,`hash`,`modpow` | 全遊戲 | — | 10 |

---

## 4. 難度曲線

```
能量預算/步數
 10 |                                              ●5.5
  9 |                          ●2.5                ●
  8 |                                   ●4.6      /
  6 |                       ●3.5      ●4.4 ●4.5  /
  5 |        ●1.3   ●2.1●2.4    ●3.4           /
  4 |  ●0.4●0.5 ●1.2  ●3.3 ●4.5
  3 |●0.1-0.3 ●1.1 ●2.2-2.3 ●3.1-3.2 ●4.2-4.3
    +----------------------------------------------→
    Ch0   Ch1    Ch2     Ch3     Ch4      Ch5
   教學  暖身   王關①   王關②   王關③    終章
```
- 每章 3–6 關，章末一個「王關」（破譯/破 DLP/破 ECDLP/最終簽章鏈）。
- 章內沿用現制：過一關選一項強化（energy +2 或 undo +2）。
- 王關預算明顯高、卡池最全，呼應現有「定理」關 energy=9。

---

## 5. 現有 4 關遷移對照

| 現關（`index.html`） | 新位置 | 處理 |
|---------------------|--------|------|
| 引理一 · 反覆平方（modsq） | **0.1 同餘之火** | 直接遷入，作教學首關 |
| 引理二 · 模逆元（modinv） | **0.3 逆元之鏡** | 直接遷入 |
| 引理三 · 快速模冪 / 費馬（modpow,fermat） | **2.4 孫子捷徑** 的費馬支線 + 散入 Ch2/Ch3 | 拆用 |
| 定理 · RSA 還原（factor…） | **2.5 破譯 RSA（王）** | 直接遷入作 Ch2 王關 |

> 結論：現有 4 關全部有歸宿，無一浪費；新增主要是 Ch0 補齊地基、Ch3/Ch4/Ch5 擴張。

---

## 6. Roguelike 編排結構（待你拍板）

兩種可行編排，預設採 **A**：

- **A. 章節選單 + 線性解鎖（推薦）**：主畫面一張「煉金大功業地圖」，六章依黑白黃紅順序解鎖；選一章＝一個小 run（含章內強化）。通章存進 localStorage。最貼合「章節關卡集」字面，也最像備審展示用的「課程關卡」。
- **B. 單一長 run 連打到底**：Ch0→Ch5 一氣呵成，死了重來。更硬核 roguelike，但 30+ 關一條龍對備審 demo 太長。

> 需你選 A / B（或混合：A 為主，另開「無盡模式」串接所有王關）。E7 章節解鎖即為 A 而設。

---

## 7. 建議下一步（落地順序）

1. **E1 章節資料層**：把 `FLOOR_DEFS` 重構成 `CHAPTERS[]`，搬入現有 4 關 → 先確認骨架可跑。
2. **E4 簡單新卡**（`modadd`,`phi`,`crt`）+ **Ch0、Ch1、Ch2 全關** → 第一個可玩里程碑（純 BigInt，零點型別風險）。
3. **E2 等值勝利** → **Ch3 DLP**。
4. **E3 點型別** → **Ch4 ECC**（最大工程，可獨立一個 session）。
5. **E6/E7** → **Ch5 終章 + 章節選單解鎖**。
6. 通關轉錄匯出 PDF＋數學註解（INDEX 既定下一步），收尾。

> 每批落地後跑現有 node 重放驗證（12000 局 0 fallback 的同一套），確保新關 100% 可解再進下一批。
