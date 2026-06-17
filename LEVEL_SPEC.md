# 數論密室 · 關卡施工藍圖（v2）

> **本檔＝gen 函式的唯一規格來源（canonical）。** 28 關定案。LEVEL_BLUEPRINT 管敘事、GAME_ARCH 管玩法機制；逐關參數/盤面/手牌/謂詞/par 一律以本檔為準。v1→v2 對映見 `_scratch\qed_v1_v2_mapping.md`。DLP 兩段攻擊編號統一為 **3.3**。
>
> 把 [GAME_ARCH.md](GAME_ARCH.md) §11 四類 lineup × §12 Paar 題庫，落成**逐關可實作規格**。
> 照此表寫 `gen` 函式：給 `seeds`（盤面）、`hand`（含誘餌）、`path`（算 par＋讓引擎自動算 target）、`goal`（謂詞）。
> 參數刻意取小（模數多 <60，王關攻擊例外）。target 多由引擎跑 path 算出，不手填。
> 機制縮寫見 GAME_ARCH：**兩段式**=§5 破解／**whyGate**=§10 題庫／**誘餌**=手牌含多餘卡逼選擇／謂詞 equals·tokensEqual·inverts·forges·impossible 見 §3。

格式：`關 標題　主類　| Paar源` → 參數 / 盤面 / 手牌 / 目標(path, par) / 備註

---

## Ch0 質料準備（5 關）　地基，無真攻擊

**0.1 同餘之火　計算　| Paar 1.7**
- 參數 a=15, b=29, m=13
- 盤面 `15` `29` `13(mod)`
- 手牌 modmul, modsq(誘餌)
- 目標 equals → path `modmul(15,29,13)`=6　par 1
- onramp

**0.2 輾轉之輪　計算　| Paar 6.5/6.8**
- 參數 a=48, b=30
- 盤面 `48` `30`
- 手牌 gcd
- 目標 equals → `gcd(48,30)`=6　par 1

**0.3 逆元之鏡　推導　| Paar 1.10**
- 參數 a=5, m=13
- 盤面 `5` `13(mod)`
- 手牌 modinv, modmul, **modadd(誘餌)**, **modsub(誘餌)**
- 目標 equals → `modinv(5,13)`=8　par 1
- 去公式化：不告知用哪張，逼選 modinv

**0.4 孫子之盤　推導　| 6.x CRT**
- 參數 x≡2(mod3), x≡3(mod5)
- 盤面 `2` `3(mod)` `3` `5(mod)`
- 手牌 crt, **modmul(誘餌)**
- 目標 equals → `crt(2,3,3,5)`=8　par 1

**0.5 歐拉之計（王）　證明　| Paar 6.9 + 6.11**
- 參數 p=3, q=5（n=15）
- 盤面 `15`
- 手牌 factor, phi, dec, mul
- 目標 equals(φ=8) → path `factor(15)`→`phi` 或 `dec·dec·mul`((p−1)(q−1))　par 3
- **whyGate**（Ch0 題）：8 在 mod12 有無逆元？→無（gcd=4）。確立命題「φ(pq)=(p−1)(q−1)」

---

## Ch1 黑化（4 關）　**翻轉：攻擊主導**

**1.1 凱撒之位移　計算　| 凱撒加密**
- 參數 m=7(H), k=3, mod26
- 盤面 `7` `3` `26(mod)`
- 手牌 modadd
- 目標 equals → `modadd(7,3,26)`=10(K)　par 1
- onramp（先做正向加密）

**1.2 仿射之鎖　推導　| Paar 1.13**
- 參數 a=7, b=22, c=24（明文 m=4）
- 盤面 `24(c)` `7(a)` `22(b)` `26(mod)`
- 手牌 modinv, modsub, modmul, **modadd(誘餌)**
- 目標 equals → path `modinv(7,26)`=15 → `modsub(24,22,26)`=2 → `modmul(15,2,26)`=4　par 3
- 自己組解密式 m=a⁻¹(c−b)

**1.3 頻率之破　攻擊　| Paar 1.2**
- 參數 位移密文片段（k 未知），crib＝最高頻字母對映 e
- 盤面 密文 token＋字母頻率表
- 機制 `SearchSpec{ forward:k→shift(密文,k), range:[0,25], 命中:還原出 crib }`
- 目標 inverts（找出 k）　par＝試到命中
- **單段式**（金鑰空間僅 26→暴搜必成）；教學點＝古典金鑰太小

**1.4 已知明文（王）　攻擊　| Paar 仿射已知明文**
- 參數 兩對 (m₁=0,c₁=22), (m₂=1,c₂=3)（真鑰 a=7,b=22）
- 盤面 `0` `22` `1` `3` `26(mod)`
- 手牌 modsub, modinv, modmul
- 目標 equals(a=7) → path `modsub(c₁,c₂)`→`modsub(m₁,m₂)`→`modinv`→`modmul`　par 3
- **whyGate**（Ch1 題）：仿射 a=13 為何無法唯一解密（gcd(13,26)≠1）

---

## Ch2 白化 RSA（5 關）

**2.1 封印　計算　| Paar 7.3**
- 參數 p=3,q=11(n=33), e=3, M=5
- 盤面 `5(M)` `3(e)` `33(n,mod)`
- 手牌 modpow
- 目標 equals → `modpow(5,3,33)`=26　par 1

**2.2 啟封　計算　| Paar 7.3**
- 參數 n=33, d=7, c=26
- 盤面 `26(c)` `7(d)` `33(mod)`
- 手牌 modpow
- 目標 equals → `modpow(26,7,33)`=5　par 1

**2.3 鑄鑰　推導/判定　| Paar 7.1**
- 參數 p=5,q=11(φ=40), e=3
- 盤面 `5(p)` `11(q)` `3(e)`
- 手牌 dec, mul, phi, modinv, **modadd(誘餌)**
- 目標 equals(d=27) → path `dec(5)`→`dec(11)`→`mul(4,10)`=40→`modinv(3,40)`=27　par 4
- 內含判定：e 須與 φ 互質才有 d

**2.4 破譯 RSA（攻擊）　| Paar 7.11**
- **兩段式**　unlockTool: factor
- Stage A（手搜）：n=33, e=3, c=26。`SearchSpec{ forward:試除 d|√33, range 小質數 }`→分解 33=3·11→φ=20→`modinv(3,20)`=7→`modpow(26,7,33)`=5
- Stage B（工具）：n=2623(=43·61), e=2111, c=1141。解鎖 factor 卡一鍵分解
- 目標 inverts（還原明文 M）　par＝Stage A 手搜步數
- 體感：小 n 手分解可行，大 n 要工具；2048-bit 連工具都跪

**2.5 還原之證（王）　證明　| RSA 正確性**
- 參數 n=33, e=3, d=7, M=5
- 盤面 `5(M)` `3(e)` `7(d)` `33(mod)`
- 手牌 modpow
- 目標 tokensEqual(M_起, M_終) → path `modpow(5,3,33)`=26 → `modpow(26,7,33)`=5　par 2
- **whyGate**（Ch2 題）：e=6,φ=20 能否求 d？→不能(gcd=2)，按「回報無解」＝impossible 謂詞

---

## Ch3 黃化 DLP（4 關）　＝proto_dlp 範本章

**3.1 立基元　計算　| Paar 8.5**
- 參數 g=5, a=6, p=23
- 盤面 `5(g)` `6(a)` `23(mod)`
- 手牌 modpow
- 目標 equals → `modpow(5,6,23)`=8　par 1

**3.2 共識之鑰　推導　| Paar 8.5**
- 參數 A=8, B=9, a=6, b=10, p=23
- 盤面 `8(A)` `9(B)` `6(a)` `10(b)` `23(mod)`
- 手牌 modpow, **modmul(誘餌)**
- 目標 tokensEqual(K_A,K_B) → path `modpow(B,a,p)` 與 `modpow(A,b,p)`　par 2
- 自己想到「收到的公開值 ^ 自己私鑰」

**3.3 破 DLP（攻擊）　| Paar 8.12→8.22**
- **兩段式**　unlockTool: dlog（已於 proto_dlp.html 驗證）
- Stage A（手搜）：p=23, g=5, h=gˣ。`SearchSpec{forward:x→5ˣ mod23, range:[1,22]}`　~7–11 步
- Stage B（BSGS）：p=10007, g=5。解鎖 dlog(BSGS)，188 步 vs 手搜 10006
- 目標 inverts（求 x）　par＝Stage A 步數

**3.4 同鑰之證（王）　證明　| DH 正確性**
- 參數 同 3.2
- 目標 tokensEqual(K_A,K_B) 並確立「雙方恆得同鑰」
- **whyGate**（Ch3 題）：2048-bit p 暴搜要幾步？→≈2²⁰⁴⁸

---

## Ch4 紅化 ECC（5 關）　曲線 y²=x³+2x+2 mod17, P=(5,1), #E=19

**4.1 點加之術　計算　| Paar 9.2**
- 參數 P=(13,7), Q=(6,3)
- 盤面 `(13,7)` `(6,3)`（點 token）
- 手牌 ptadd
- 目標 equals → `ptadd(P,Q)`　par 1

**4.2 倍點之術　計算　| Paar 9.2**
- 參數 P=(13,7)
- 盤面 `(13,7)`
- 手牌 ptdbl
- 目標 equals → `ptdbl(P)`　par 1

**4.3 點乘之階　推導　| Paar 9.11**
- 參數 P=(5,1), k=9
- 盤面 `(5,1)` `9(k)`
- 手牌 scalarmul, ptadd, ptdbl（後兩張＝可手動 double-and-add 的誘餌/替代）
- 目標 equals → `scalarmul(9,P)`　par 1（或手動 double-and-add 多步）

**4.4 破 ECDLP（攻擊）　| ECDLP**
- **兩段式**　unlockTool: ecdlog
- Stage A（手搜）：小曲線 P,Q=kP（階 19）。`SearchSpec{forward:k→kP, range:[1,18]}`
- Stage B（工具）：放大曲線，解鎖 ecdlog
- 目標 inverts（求純量 k）　par＝Stage A 步數

**4.5 交鑰之證（王）　證明　| Paar 9.13 EC-DHKE**
- 參數 曲線 y²=x³+x+6 mod11, a=6, B=(5,9)
- 盤面 `(5,9)(B)` `6(a)` …
- 手牌 scalarmul
- 目標 tokensEqual a(bP)=b(aP)
- **whyGate**（Ch4 題）：256-bit ECC≈幾 bit RSA？→3072

---

## Ch5 封印（5 關）　簽章＋雜湊；玩具雜湊 H(x)=x³+x+1 mod19

**5.1 落款　計算　| Paar 10.4**
- 參數 n=55, d=27, m=4
- 盤面 `4(m)` `27(d)` `55(mod)`
- 手牌 hash, modpow
- 目標 equals(sig) → path `hash(4)`=H → `modpow(H,27,55)`　par 2

**5.2 驗印　推導　| Paar 10.5**
- 參數 n=55, e=3, sig（來自 5.1）, m=4
- 盤面 `sig` `3(e)` `4(m)` `55(mod)`
- 手牌 hash, modpow, **modmul(誘餌)**
- 目標 tokensEqual(m', H(m)) → path `modpow(sig,3,55)`=m' 與 `hash(4)`=H　par 2

**5.3 偽造之誘　攻擊　| Paar 10.6（存在性偽造）**
- 參數 n=9797, e=131（無私鑰）
- 盤面 任選 `sig` `131(e)` `9797(mod)`
- 手牌 modpow
- 目標 forges → 選 sig，`modpow(sig,e,n)`=m，則 (m,sig) 必過驗證　par 1
- 教學：簽章未雜湊→可從 sig 反推 m 偽造

**5.4 生日碰撞　攻擊　| Paar 11.6**
- **兩段式**　玩具雜湊（小輸出）
- 參數 H(x)=x³+x+1 mod19（或更短輸出版）
- 機制 `SearchSpec` 找 m₁≠m₂ 使 H(m₁)=H(m₂)
- 目標 tokensEqual（兩 hash 輸出）　par＝生日界 ~√輸出
- **whyGate**（Ch5-乙）：n-bit 雜湊找碰撞約 2^(n/2) 次

**5.5 大功業完成（終王）　證明　| 自簽鏈**
- 參數 p=5,q=11(n=55), e=3, m=4
- 盤面 `5(p)` `11(q)` `3(e)` `4(m)` `55(mod)`
- 手牌 dec, mul, modinv, hash, modpow
- 目標 tokensEqual（驗章 m'==H(m)）＋全鏈 Q.E.D. → 鑄鑰→簽→驗　par ~6
- **whyGate**（Ch5-甲）：無雜湊直接簽，攻擊者隨機 sig 能否偽造？→能（存在性偽造）

---

## 分佈核對（28 關）

| | 計算 | 推導 | 攻擊 | 證明 |
|---|---|---|---|---|
| Ch0 | 0.1 0.2 | 0.3 0.4 | — | 0.5 |
| Ch1 | 1.1 | 1.2 | 1.3 1.4 | — |
| Ch2 | 2.1 2.2 | 2.3 | 2.4 | 2.5 |
| Ch3 | 3.1 | 3.2 | 3.3 | 3.4 |
| Ch4 | 4.1 4.2 | 4.3 | 4.4 | 4.5 |
| Ch5 | 5.1 | 5.2 | 5.3 5.4 | 5.5 |
| **計** | **9 (32%)** | **7 (25%)** | **7 (25%)** | **5 (18%)** |

每章皆含推導＋(攻擊或證明)；無整章全計算。攻擊全兩段式真窮舉（Ch1 例外＝單段，因古典金鑰空間本就小）。王關全為證明關＋whyGate。

---

## 實作備註
- **target 自動**：除少數已標明值，gen 用 `runPath(seeds, path)` 算出 target，沿用 v1 `rollInstance/verifyInstance` 保證可解。
- **新欄位**：每關 def 加 `category`、攻擊關加 `search:SearchSpec`、王關加 `whyGate`（見 GAME_ARCH §3/§5/§10）。
- **誘餌卡**：hand 比 path 所需多 1–2 張，且須是「似是而非」的（modadd vs modsub、modmul vs modpow）。
- **參數微調**：5.1/5.2 的 sig 值、4.x 點座標由引擎算；若 target 落在退化值（如冪等）換 m/d 重 roll。
- 落地序：仍照 GAME_ARCH §9 先做引擎四批，再依本表重寫各章 floors。
