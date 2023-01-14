import msgSave from 'floating-live/plugin/msgSave/msgSave';
import path from 'path';
import Program from '../..';
import moment from 'moment';

export default (ctx: Program) => {
  let fileId = '';
  let filePath = ctx.config.get("save.path");
  // 更新文件id
  const updateFileId = () => {
    fileId = `${
      moment(ctx.timestamp).format("YYYYMMDD_HHmmss")}-${ctx.room.keyList[0]?.replace(':', '-')}`
  };
  // 更新文件路径
  const updateFilePath = () => {
    messageSave.changeFile(path.resolve(ctx.env == "production" ? ctx.appDataPath : ".", filePath, `${fileId}.txt`));
    originSave.changeFile(path.resolve(ctx.env == "production" ? ctx.appDataPath : ".", filePath, `${fileId}-origin.txt`));
  };

  const messageSave = new msgSave(
    ctx,
    'live_message',
    path.join(filePath, `${fileId}.txt`),
    ctx.config.get("save.save_message")
  );
  const originSave = new msgSave(
    ctx,
    'live_origin',
    path.join(filePath, `${fileId}-origin.txt`),
    ctx.config.get("save.save_origin")
  );
  ctx.command.register('saveMessage', (b: boolean = true) => {
    b ? messageSave.start() : messageSave.pause();
    ctx.emit('save_message', !messageSave.paused);
    ctx.config.set("save.save_message", b)
  });
  ctx.command.register('saveOrigin', (b: boolean = true) => {
    b ? originSave.start() : originSave.pause();
    ctx.emit('save_origin', !originSave.paused);
    ctx.config.set("save.save_origin", b)
  });
  ctx.command.register('savePath', (path: string) => {
    filePath = path;
    updateFilePath();
    ctx.emit('save_path', path);
    ctx.config.set("save.save_path", path)
  });

  ctx.initFunction.register('save', () => {
    return {
      save: {
        save_message: !messageSave.paused,
        save_origin: !originSave.paused,
        save_path: filePath
      }
    }
  })

  ctx.on('start', () => {
    // 直播监听重新开启时，文件名将更新
    updateFileId();
    updateFilePath();
  });
}
