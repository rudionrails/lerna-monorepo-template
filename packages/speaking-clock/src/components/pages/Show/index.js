import { connect } from "../../../store";
import Show from "./Show";

export default connect(state => ({
  date: state.date,
}))(Show);
