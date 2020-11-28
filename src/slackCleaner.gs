const token = '';
// token は以下の権限を与えたものを発行すること
// * channels:history
// * channels:read
// * chat:write
// * groups:history
// * groups:read
// * im:history
// * im:read
// * mpim:history
// * mpim:read


function clearSlack(channelName, latestDate) {
  const unixTimestamp = Math.round( latestDate.getTime() / 1000 );

  // チャンネルリストを取得
  const channelList = getChannelList();

  // 対象のチャンネルIDを取得
  const id = channelList.filter(channel => channel.name == channelName).map(channel => channel.id);

  // 投稿を順々に削除
  getMessage(id, unixTimestamp).forEach(ts => {
    deleteMessage(id, ts);
    Utilities.sleep(1000);  // 高速でリクエストを送るとエラーになる可能性があるため、待ち処理を追加
  });
}

function getChannelList() {
  const url = "https://slack.com/api/conversations.list?token="+token+"";
  const response = UrlFetchApp.fetch(url);
  const json = response.getContentText();
  const data = JSON.parse(json);
  return data.channels;
}

function getMessage(channelId, latest) {
  // チャンネル内からタイムスタンプの一覧を取得
  const url = "https://slack.com/api/conversations.history?token="+token+"&channel="+channelId+"&latest="+latest+"&limit=2000";
  const response = UrlFetchApp.fetch(url);
  const json = response.getContentText();
  const data = JSON.parse(json);
  const tsList = data.messages.map(x => x["ts"]);
  const replyList = tsList.map(ts => getReply(channelId, ts));
  
  // 全リプライ(スレッド元含む)のタイムスタンプを結合
  const msgTsList = [];
  replyList.forEach(reply => reply.forEach(rep => msgTsList.push(rep["ts"])));
  
  return msgTsList;
}

function getReply(channelId, ts) {
  const url = "https://slack.com/api/conversations.replies?token="+token+"&channel="+channelId+"&ts="+ts+"&limit=100";
  const response = UrlFetchApp.fetch(url);
  const json = response.getContentText();
  const data = JSON.parse(json);
  
  return data.messages;
}

function deleteMessage(channelId, ts) {
  const url = "https://slack.com/api/chat.delete?token="+token+"&channel="+channelId+"&ts="+ts+"";
  const res = UrlFetchApp.fetch(url);
  res.getContentText();
}
