import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { defaultClose, type Dialog, type DialogAction, type DialogController, type DialogInit, type DialogType } from '~/types/Dialog'
import type { Optional } from '~/types/Optional';

export const useDialogControlStore = defineStore({
  id: 'dialogControlStore',
  state: (): DialogController => ({
    dialogs: {}
  }),
  actions: {
    openDialog<T>(dialog: DialogInit<T>, closable?: boolean): string {
      const _closable = closable ?? true;

      let close: Optional<DialogAction> = undefined;
      if (_closable && dialog.close !== undefined) {
        close = dialog.close;
      }
      if (_closable && dialog.close === undefined) {
        close = defaultClose;
      }

      const id = uuid();
      this.dialogs[id] = {...dialog, id, close};
      return id;
    },
    closeAllWithTypeThenOpen<T>(dialog: DialogInit<T>, closable?: boolean): string {
      this.closeAllWithType(dialog.dialogType);
      return this.openDialog(dialog, closable);
    },
    closeAllDialogs() {
      this.dialogs = {};
    },
    closeDialog(id: string) {
      delete this.dialogs[id];
    },
    closeAllWithType(dialogType: DialogType) {
      for (const [_, {id, dialogType}] of Object.entries(this.dialogs)){
        (dialogType === dialogType) && this.closeDialog(id);
      }
    },
    getDialog<T>(id: string): Optional<Dialog<T>> {
      return this.dialogs[id];
    },
    updateDialog<T>(id: string, dialog: DialogInit<T>) {
      let close = dialog.close;
      if (close === undefined) {
        close = this.dialogs[id].close;
      }

      this.dialogs[id] = {...dialog, id, close};
    }
  }
})
