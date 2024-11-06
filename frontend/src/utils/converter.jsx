import moment from "moment-timezone";

const formatDate = (dateString) => {
  return moment(dateString).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
};

export default formatDate;
