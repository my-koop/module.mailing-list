var React  = require("react");

var BSInput     = require("react-bootstrap/Input");
var BSListGroup     = require("react-bootstrap/ListGroup");
var BSListGroupItem = require("react-bootstrap/ListGroupItem");

var MKFeedbackMixin = require("mykoop-core/components/Feedbacki18nMixin");

var __ = require("language").__;
var actions = require("actions");

var RegisterMailingList = React.createClass({
  mixins: [React.addons.LinkedStateMixin, MKFeedbackMixin],

  propTypes: {
    checkGoingUpDownKey: React.PropTypes.func.isRequired,
    checkGoingUpKey: React.PropTypes.func.isRequired,
    checkGoingDownKey: React.PropTypes.func.isRequired,
  },

  componentWillMount: function () {
    var self = this;
    actions.mailinglist.registration({
      i18nErrors: {}
    }, function(err, res) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      var mailingLists = _.map(res, function(mailingList) {
        return {
          id: mailingList.id,
          name: mailingList.name,
          description: mailingList.description,
          selected: true
        }
      });
      self.setState({
        mailingLists: mailingLists
      });
    });
  },

  // Initialize state to avoid crashes if nothing is entered
  getInitialState: function() {
    return {
      error: null,
      mailingLists: []
    };
  },

  onUserCreated: function(userId, callback) {
    actions.user.mailinglist.register({
      data: {
        idMailingLists: _(this.state.mailingLists)
          .filter("selected")
          .map("id")
          .value(),
        id: userId
      }
    }, function(err) {
      callback(err && __("mailinglist::registerError"));
    })
  },

  onEnterFocus: function() {
    // FIXME:: ref set to input is not available because it is not a
    // direct child of this component. must find another way to retrieve the dom node
    /*var listGroup = this.refs.listgroup;
    var firstListGroup = listGroup.refs.mailingList0;
    if(firstListGroup) {
      firstListGroup.getInputDOMNode().focus();
    }*/
  },

  render: function() {
    var self = this;

    var length = self.state.mailingLists.length;
    var mailingListsCheckboxes = _.map(
      self.state.mailingLists, function(mailingList, i) {
        var valueLink = {
          value: mailingList.selected,
          requestChange: function(newSelected) {
            mailingList.selected = newSelected;
            self.setState({
              mailingLists: self.state.mailingLists
            });
          }
        }
        var onKeyDown = undefined;
        var isFirst = i === 0;
        var isLast = i === length - 1;
        if(isFirst) {
          onKeyDown = (isLast) ?
            self.props.checkGoingUpDownKey
          : self.props.checkGoingUpKey;
        } else if(isLast) {
          onKeyDown = self.props.checkGoingDownKey;
        }
        var label = <strong>{mailingList.name}</strong>;
        var ref = "mailingList" + i;
        var input = (
          <BSInput
            type="checkbox"
            checkedLink={valueLink}
            label={label}
            onKeyDown={onKeyDown}
            ref={ref}
          />
        );
        return (
          <BSListGroupItem header={input} key={mailingList.id} ref={ref}>
            <i>
              {mailingList.description}
            </i>
          </BSListGroupItem>
        );
      }
    );

    return (
      <div>
        {this.renderFeedback()}
        <BSListGroup ref="listgroup">
          {mailingListsCheckboxes}
        </BSListGroup>
     </div>
    );
  }
});

module.exports = RegisterMailingList;
