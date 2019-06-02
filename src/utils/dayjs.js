import dayjs from "dayjs";
import "dayjs/locale/it";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("it");
dayjs.extend(LocalizedFormat);

export const formatDate = date => dayjs(date).format("LL");

export default dayjs;
