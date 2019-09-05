import React, { Children } from "react";
import PropTypes from "prop-types";

// utils
const slotSize = 1000 * 60;
const prevSlot = () =>
  new Date(Math.floor(new Date().getTime() / slotSize) * slotSize);
const nextSlot = () =>
  new Date(Math.ceil(new Date().getTime() / slotSize) * slotSize);
const untilNextSlot = () => nextSlot() - new Date();

// lifecycle
const initState = (context, props) => {
  const { lng } = props;

  Object.assign(context, {
    state: { date: prevSlot(), lng },
  });
};

const stopTick = context => {
  if (context.tick) window.clearTimeout(context.tick);
};

const startTick = context => {
  stopTick(context);

  Object.assign(context, {
    tick: window.setTimeout(() => startTick(context), untilNextSlot()),
  });

  context.setState({ date: prevSlot() });
};

const StoreContext = React.createContext({});

// The connect function mimics the behaviour of react-redux connect.
// In our case, we just use the react context api, which should be
// enough for small widgets.
//
// before you pull in redux (and tooling around it) think about the
// increased payload and the corresponding loading performance. If you
// still think you need redux (or other state libraries), feel free
// to add it here.
//
// @example Connect a component
//    const Hello = ({ hello }) => <div>${hello}</div>;
//
//    export default connect(
//      state => ({ hello: state.hello }),
//    )(Hello);
export const connect = mapStateToProps => WrappedComponent => props => (
  /* eslint-disable react/jsx-props-no-spreading */
  <StoreContext.Consumer>
    {state => <WrappedComponent {...mapStateToProps(state)} {...props} />}
  </StoreContext.Consumer>
  /* eslint-enable react/jsx-props-no-spreading */
);

export class StoreProvider extends React.Component {
  constructor(props) {
    super(props);

    initState(this, props);
  }

  componentDidMount() {
    startTick(this);
  }

  componentWillUnmount() {
    stopTick(this);
  }

  // There should be no need to change the render function.
  // It simplty passes the context tdown the component tree.
  render() {
    const { children } = this.props;

    return (
      <StoreContext.Provider value={this.state}>
        {Children.only(children)}
      </StoreContext.Provider>
    );
  }
}

// Thise are the only allowed props to pass
//
// In case you want additional stuff, think whether this
// should go into the `state` prop.
StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
