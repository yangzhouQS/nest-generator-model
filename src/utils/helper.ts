const dayjs = require('dayjs');
export const printDataTract = (data = {}) => {
  console.log(JSON.stringify(data, null, 2));
};

export const formatDate = (
  date = new Date(),
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  return dayjs.format();
};
