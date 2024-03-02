import moment from 'moment';

function isExpired(date) {
  if (!date) return false;
  const dateToCheck = moment(date);
  if (
    !dateToCheck.isValid() ||
    new Date(date).getFullYear() === new Date().getFullYear()
  ) {
    return false;
  }
  return true;
}
export { isExpired };
