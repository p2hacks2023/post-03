# P2HACKS2023 アピールシート 

プロダクト名
  ... 
futocool

コンセプト
  ... 
現金じゃないと体感出来ない「懐がひんやりする」と言う体験を、電子マネーユーザにも体感してもらう

対象ユーザ
  ...  
- 現金じゃないと使った感じがしない人
- 電子マネーにいくら残ってるか確認しない人
- 使ってしまった自分を戒めたい人

利用の流れ
  ...  
実際のお店で決済をします。その後決済をした電子マネーをスマホにかざすと、futocoolデバイスが連動し、懐がひんやりする

推しポイント
  ...  
「懐が寒い」という慣用句を物理的に体感することができる

スクリーンショット(任意)  
| ![Screenshot_2023-12-17-01-11-38-779_com superneko sexydynamite bosom](https://github.com/p2hacks2023/post-03/assets/79957387/3622250a-0fee-4915-8222-27e65e76b639) | ![Screenshot_20231216-222641](https://github.com/p2hacks2023/post-03/assets/79957387/d70bb885-25c7-4503-9770-3c97cb800a8c) | ![Screenshot_20231216-224739](https://github.com/p2hacks2023/post-03/assets/79957387/112da47e-d865-41d2-bcb7-c704ffa8250e) |
| -- | -- | -- |

## 開発体制  

役割分担
  ...  
- 酒井　リーダー、ハードウェア
- 竹田　フロントエンド、バックエンド
- 中川　UI/UXデザイン
- 朝日　動画、プレゼン

開発における工夫した点  ...  
- ロジックとDBと完全に分離した
  - その結果、Firebaseのクライアントサイドで作成したロジックをバックエンドにスムーズに統合することができた
- コードのディレクトリを役割(フック, ロジック, 通信)ではなく機能で分割した
  - これにより、機能間で暗黙の依存が発生することがなくなった

## 開発技術 

利用したプログラミング言語
  ...  
- TypeScript(フロントエンド部分、バックエンド部分)
- Java(Bluetooth, NFC通信部分)
- Python(ハードウェア)

利用したフレームワーク・ライブラリ
  ...  
- バックエンド
  - Node.js
  - Fastify
    - @fastify/cors
    - @fastify/websocket

- フロントエンド
  - Apache Cordova
    - Cordova Plugin for using WebSockets
    - Bluetooth Low Energy (BLE) Central Plugin for Apache Cordova
  - React
    - Jotai
    - SWR
    - react-hot-toast
    - React Router
    - usehooks-ts

- デバイス
  - Kitaca, nimoca
  - systemd
  - Node.js

- プロトタイプ
  - React Native(Expo)
    - React Native Firebase
  - Firebase

その他開発に使用したツール・サービス
  ...
- デザイン・設計
  - Figma
  - FigJam

- ビルド
  - Vite
  - Expo Application Services
  - Android Studio

- コミュニケーション
  - notion
  - Discord

- デプロイ
  - Vultr(VPS)
  - Cloudflare
