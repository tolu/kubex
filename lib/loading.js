const {Spinner} = require('clui');

const spinner = new Spinner('...');
let active = false;

const setLoaderMessage = msg => {
  if (active) {
    spinner.message(msg);
  }
};
const showLoader = (msg = '') => {
  if (!active) {
    spinner.start();
  }
  active = true;
  if (msg) {
    setLoaderMessage(msg);
  }
};
const hideLoader = () => {
  if (active) {
    spinner.stop();
  }
  active = false;
  setLoaderMessage('...');
};

module.exports = {
  showLoader,
  hideLoader,
  setLoaderMessage
};
