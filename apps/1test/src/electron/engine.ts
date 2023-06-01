import { Engine, PluginManager } from '@remixproject/engine';
import { ipcMain } from 'electron';
import { FSPlugin } from './fsPlugin';
import { GitPlugin } from './gitPlugin';
import { app } from 'electron';

const engine = new Engine()
const appManager = new PluginManager()
const fsPlugin = new FSPlugin()
const gitPlugin = new GitPlugin()
engine.register(appManager)
engine.register(fsPlugin)
engine.register(gitPlugin)

ipcMain.handle('manager:activatePlugin', async (event, arg) => {
  console.log('manager:activatePlugin', arg)
  if(await appManager.isActive(arg)){
    return true
  }
  return await appManager.activatePlugin(arg)
})

app.on('before-quit', async () => {
  await appManager.call('fs', 'closeWatch')
  app.quit()
})