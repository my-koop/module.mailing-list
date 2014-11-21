var React = require("react");

var BSCol  = require("react-bootstrap/Col");
var BSRow  = require("react-bootstrap/Row");
var BSGrid = require("react-bootstrap/Grid");
var BSButton = require("react-bootstrap/Button");
var BSInput = require("react-bootstrap/Input");
var BSListGroup = require("react-bootstrap/ListGroup");
var BSListGroupItem = require("react-bootstrap/ListGroupItem");

var MKFeedbacki18nMixin = require("mykoop-core/components/Feedbacki18nMixin");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var MailingListUserInfo = React.createClass({
  mixins: [MKFeedbacki18nMixin],

  propTypes: {
    userId: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      registeredMailingLists: null,
      allMailingLists: null,
      mailingLists: null
    }
  },

  componentDidMount: function () {
    this.updateMailingLists(this.props.userId);
  },

  componentWillReceiveProps: function (nextProps) {
    if(nextProps.userId !== this.props.userId) {
      this.updateMailingLists(nextProps.userId);
    }
  },

  updateMailingLists: function(userId) {
    var self = this;
    this.clearFeedback();
    self.setState({
      registeredMailingLists: null,
      allMailingLists: null
    }, function() {
      actions.user.mailinglist.list({
        i18nErrors: {},
        data: {
          id: this.props.userId
        }
      }, function(err, res) {
        if(err) {
          return self.setFeedback(err.i18n, "danger");
        }
        self.setState({
          registeredMailingLists: res || null,
          mailingLists: null
        }, function() {
          self.combineRegister();
        });
      });

      actions.mailinglist.list({
        i18nErrors: {}
      }, function(err, res) {
        if(err) {
          return self.setFeedback(err.i18n, "danger");
        }
        self.setState({
          allMailingLists: res || null,
          mailingLists: null
        }, function() {
          self.combineRegister();
        });
      });
    });
  },

  saveChanges: function() {

  },

  combineRegister: function() {
    if(this.state.registeredMailingLists && this.state.allMailingLists) {
      var userMailingList = _.indexBy(this.state.registeredMailingLists, "id");
      var mailingLists = _.map(this.state.allMailingLists, function(ml) {
        return _.merge(ml, {registered: !!userMailingList[ml.id]});
      });
      this.setState({
        mailingLists: mailingLists
      });
    }
  },

  render: function() {
    var self = this;

    var mailingListsContent = null;
    if(this.state.mailingLists) {
      mailingListsContent = _.map(this.state.mailingLists, function(ml) {
        var valueLink = {
          value: ml.registered,
          requestChange: function(newRegistered) {
            ml.registered = newRegistered;
            self.setState({
              mailingLists: self.state.mailingLists
            });
          }
        }
        var label = <strong>{ml.name}</strong>;
        var input = (
          <BSInput
            type="checkbox"
            checkedLink={valueLink}
            label={label}
          />
        );
        return (
          <BSListGroupItem header={input} key={ml.id}>
            <i>
              {ml.description}
            </i>
          </BSListGroupItem>
        );
      });
    }

    return (
      <div>
        {this.getFeedback()}
        <BSListGroup>
          {mailingListsContent}
        </BSListGroup>
        <BSButton
          bsStyle="primary"
          onClick={this.saveChanges}
        >
          {__("save")}
        </BSButton>
      </div>
    );
  }
});

module.exports = MailingListUserInfo;
