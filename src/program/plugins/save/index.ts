import msgSave from 'floating-live/plugin/msgSave/msgSave';
import path from 'path';
import Program from '../..';

export default (ctx: Program) => {
  let fileId = '';
  let filePath = '../save';
  // 更新文件id
  const updateFileId = () => {
    const startDate = new Date(ctx.controller.timestamp);
    fileId = `${startDate.getFullYear()}${(startDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${startDate
      .getDate()
      .toString()
      .padStart(2, '0')}_${startDate
      .getHours()
      .toString()
      .padStart(2, '0')}${startDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}${startDate
      .getSeconds()
      .toString()
      .padStart(2, '0')}-${ctx.controller.room.keyList[0]?.replace(':', '-')}`;
  };
  // 更新文件路径
  const updateFilePath = () => {
    messageSave.changeFile(path.join(filePath, `${fileId}.txt`));
    originSave.changeFile(path.join(filePath, `${fileId}-origin.txt`));
  };

  const messageSave = new msgSave(
    ctx,
    'live_message',
    path.join(filePath, `${fileId}.txt`),
  );
  const originSave = new msgSave(
    ctx,
    'live_origin',
    path.join(filePath, `${fileId}-origin.txt`),
  );
  ctx.command.register('saveMessage', (b: boolean = true) => {
    b ? messageSave.start() : messageSave.pause();
    ctx.emit('save_message', !messageSave.paused);
  });
  ctx.command.register('saveOrigin', (b: boolean = true) => {
    b ? originSave.start() : originSave.pause();
    ctx.emit('save_origin', !originSave.paused);
  });
  ctx.command.register('savePath', (path: string) => {
    filePath = path;
    updateFilePath();
    ctx.emit('save_path', path);
  });

  ctx.initFunction.register('save', () => {
    return {
      save: {
        save_message: !messageSave.paused,
        save_origin: !originSave.paused,
        path: filePath
      }
    }
  })

  ctx.on('start', () => {
    // 直播监听重新开启时，文件名将更新
    updateFileId();
    updateFilePath();
  });
}
