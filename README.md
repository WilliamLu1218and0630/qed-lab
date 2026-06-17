# qed-lab

**能「實際驗證」數學推導的證明遊戲引擎。**

把抽象的數學推導變成一場可操作的解謎：盤面是一堆數字 token，手牌是數學運算卡，玩家一步步把目標值「煉」出來——而引擎用 BigInt **真的去算每一步**，由構造法保證每一關都有解、且玩家的每次操作都被即時驗證。不是選擇題、不是動畫，是貨真價實的計算。

> 勝利畫面寫著 **Magnum Opus · Q.E.D.**——證明完畢。這就是這個 lab 的名字由來。

## 為什麼這個引擎有意思

核心是一套 `卡牌 → token → 重放驗證` 架構：

- **生成關卡**：每關隨機 roll 出題面，再用真實 resolve 函式重放一條標準解法路徑，驗證可解才出題（`rollInstance → verifyInstance → runPath`）。
- **泛化 token 型別**：token 的值可以是 BigInt，也可以是**橢圓曲線上的點** `{x, y}`／無窮遠點 `𝒪`。換一種 token 型別，同一套引擎就能驗證新的數學領域——這正是 lab 要展示的事。
- **零外部依賴**：單檔 HTML，純 Web Audio 合成音效，BigInt 計算，可直接開瀏覽器跑。

## 現有領域

### 數論 → 公鑰密碼學（`index.html`）

煉金大功業敘事對齊密碼學課程，6 章 29 關、19 張運算卡：

| 章 | 煉金階段 | 主題 | 關數 |
|----|---------|------|------|
| 0 | 質料準備 _Materia Prima_ | 數論基礎（同餘/gcd/逆元/CRT/φ） | 5 |
| 1 | 黑化 _Nigredo_ | 古典密碼（凱撒/仿射） | 3 |
| 2 | 白化 _Albedo_ | RSA（鑄鑰/加解密/破譯） | 5 |
| 3 | 黃化 _Citrinitas_ | 離散對數 / Diffie–Hellman / ElGamal | 5 |
| 4 | 紅化 _Rubedo_ | 橢圓曲線（點加/倍點/點乘/ECDH/ECDLP） | 6 |
| 5 | 封印 _Sigillum_ | 數位簽章 / 雜湊 / 生日碰撞 | 5 |

章節選單線性解鎖，進度存 localStorage。設計藍圖見 [`LEVEL_BLUEPRINT.md`](LEVEL_BLUEPRINT.md)。

### 規劃中

- **線性代數** — 矩陣 token、列運算卡、行列式/特徵值關卡。
- **微積分** — 函數/極限 token、微分/積分規則卡。

兩者共用同一套驗證引擎，屆時抽出共用 `engine-core`。

## 跑起來

```bash
python -m http.server 8765   # 或任意靜態伺服器
# 開 http://localhost:8765/index.html
```

## 驗證每一關真的可解

```bash
node test/verify.js
```

抽出 `index.html` 的純引擎區段，對全部關卡各 roll 3000 次，逐關以真實引擎 `verifyInstance` 確認 **0 fail / 0 fallback**（fallback＝生成器在 800 次內找不到可解題面才會用的保底固定題；0 fallback 即代表隨機生成永遠有解）。

## 授權

個人作品集專案。
