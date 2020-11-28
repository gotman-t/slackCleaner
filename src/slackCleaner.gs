const token = '';
// token �͈ȉ��̌�����^�������̂𔭍s���邱��
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

  // �`�����l�����X�g���擾
  const channelList = getChannelList();

  // �Ώۂ̃`�����l��ID���擾
  const id = channelList.filter(channel => channel.name == channelName).map(channel => channel.id);

  // ���e�����X�ɍ폜
  getMessage(id, unixTimestamp).forEach(ts => {
    deleteMessage(id, ts);
    Utilities.sleep(1000);  // �����Ń��N�G�X�g�𑗂�ƃG���[�ɂȂ�\�������邽�߁A�҂�������ǉ�
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
  // �`�����l��������^�C���X�^���v�̈ꗗ���擾
  const url = "https://slack.com/api/conversations.history?token="+token+"&channel="+channelId+"&latest="+latest+"&limit=2000";
  const response = UrlFetchApp.fetch(url);
  const json = response.getContentText();
  const data = JSON.parse(json);
  const tsList = data.messages.map(x => x["ts"]);
  const replyList = tsList.map(ts => getReply(channelId, ts));
  
  // �S���v���C(�X���b�h���܂�)�̃^�C���X�^���v������
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
