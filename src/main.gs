function main(){
  const channelNameList = [''];  // 削除対象のチャンネル名を設定
  
  const last = 7; // 何日前までの投稿を削除するかを設定
  const date = new Date();
  date.setDate(date.getDate - last);
  
  channelNameList.forEach(channel => clearSlack(channel, date));
}