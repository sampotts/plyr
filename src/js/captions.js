// ==========================================================================
// Plyr Captions
// TODO: Create as class
// ==========================================================================

import i18n from './utils/i18n';

const captions = {
  setup() {
    return undefined;
  },

  update() {
    throw new Error('captions#update is removed!');
  },

  toggle() {
    throw new Error('captions#toggle is removed!');
  },

  set() {
    throw new Error('captions#set is removed!');
  },

  setLanguage() {
    throw new Error('captions#setLanguage is removed!');
  },

  getTracks() {
    throw new Error('captions#getTracks is removed!');
  },

  findTrack() {
    throw new Error('captions#findTrack is removed!');
  },

  getCurrentTrack() {
    throw new Error('captions#getCurrentTrack is removed!');
  },

  getLabel() {
      return i18n.get('disabled', this.config);
  },

  updateCues() {
    throw new Error('captions#updateCues is removed!');
  },
};

export default captions;
