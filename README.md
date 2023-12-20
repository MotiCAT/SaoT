# Saot

Spotifyで聴いている曲を自動的にTwitterに投稿するDiscordBot

## Setup

Discord Botのセットアップ方法が分からない方、TwitterのAPIKeyの取得方法が分からない方は各自調べてください。
TypeScript何もわからない人は[こっち](https://github.com/MotiCAT/SAOT/tree/master)使ってください。

`.env.example`のファイル名を`.env`に変更してください。

```env
APP_KEY=
APP_SECRET=
ACCESS_TOKEN=
ACCESS_TOKEN_SECRET=
```

この4列には対応するテキスト

```env
USER_ID=
DISCORD_TOKEN=
```

`USER_ID`にはDiscordで使用している自分のアカウントのID、`DISCORD_TOKEN`にはボットのトークンを記入してください。

## Spotify側、Discord側の設定

- Spotify  
  Spotifyの設定から、「**Spotifyで再生状況をシェアする**」を有効化してください。
- Discord  
  Discordの設定から、「アクティビティ設定」の「**現在のアクティビティをステータスに表示する**」を有効化してください。(こっち必要か分からないので有識者求)  
  「ユーザー設定」の「**接続**」を開き、SpotifyをDiscordアカウントに結び付けてください。  
  「**ステータスとしてSpotifyを表示する**」を有効化してください。

## 注意点

UbuntuやLinux等のOSでは、別途  
`npm install --os=linux --cpu=x64 sharp`  
`npm install --force @img/sharp-linux-x64`  
を実行する必要があります。
