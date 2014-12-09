var React = require("react");

var BSCol           = require("react-bootstrap/Col");
var BSRow           = require("react-bootstrap/Row");
var BSGrid          = require("react-bootstrap/Grid");
var BSButton        = require("react-bootstrap/Button");
var BSInput         = require("react-bootstrap/Input");
var BSListGroup     = require("react-bootstrap/ListGroup");
var BSListGroupItem = require("react-bootstrap/ListGroupItem");

var MKPermissionMixin   = require("mykoop-user/components/PermissionMixin");
var MKFeedbacki18nMixin = require("mykoop-core/components/Feedbacki18nMixin");
var MKAlertTrigger = require("mykoop-core/components/AlertTrigger");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var MailingListUserInfo = React.createClass({
  mixins: [MKPermissionMixin, MKFeedbacki18nMixin],

  propTypes: {
    userId: React.PropTypes.number.isRequired,
    current: React.PropTypes.bool
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
          id: userId
        }
      }, function(err, res) {
        if(err) {
          return self.setFeedback(err.i18n, "danger");
        }
        self.setState({
          registeredMailingLists: (res && _.indexBy(res, "id")) || null,
          mailingLists: null
        }, function() {
          self.combineRegister();
        });
      });

      actions.mailinglist.listAvailable({
        i18nErrors: {},
        data: {
          userId: self.props.current ? undefined : self.props.userId
        }
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

  getChanges: function() {
    var userMailingList = this.state.registeredMailingLists || {};
    // Figure out which mailing list was added
    var newMl = _(this.state.mailingLists).filter(function(mailingList) {
      return mailingList.registered && !userMailingList[mailingList.id];
    }).map(function(mailingList){
      return mailingList.id;
    }).value();

    // Figure out which mailing was removed
    var removedMl = _(this.state.mailingLists).filter(function(mailingList) {
      return !mailingList.registered && userMailingList[mailingList.id];
    }).map(function(mailingList){
      return  mailingList.id;
    }).value();

    return {
      newMl: newMl,
      removedMl: removedMl
    };
  },

  hasChanges: function() {
    var changes = this.getChanges();
    return !_.isEmpty(changes.newMl) || !_.isEmpty(changes.removedMl);
  },

  saveChanges: function() {
    var self = this;
    var changes = this.getChanges();

    // Inital setup to update added and removed mailing list
    var updates = [];
    if(!_.isEmpty(changes.newMl)) {
      updates.push({
        data: changes.newMl,
        action: actions.user.mailinglist.register,
      });
    }
    if(!_.isEmpty(changes.removedMl)) {
      updates.push({
        data: changes.removedMl,
        action: actions.user.mailinglist.unregister,
      });
    }

    // To be called only once after all updates are done
    var successCallback = _.after(updates.length, function() {
      self.setState({
        registeredMailingLists: _(self.state.mailingLists)
          .filter("registered")
          .map(function(mailingList) {
            return {
              id: mailingList.id
            }
          })
          .indexBy("id")
          .value(),
        busy: false
      }, function() {
        // just make sure everything is in order
        self.combineRegister();
        MKAlertTrigger.showAlert(__("success"));
      });
    });

    self.setState({
      busy: true
    }, function() {
      // Execute all updates
      _.each(updates, function(update) {
        var data = update.data;
        update.action({
          data: {
            idMailingLists: data,
            id: self.props.userId
          }
        }, function(err) {
          if(err) {
            return MKAlertTrigger.showAlert(
              __("errors::error", {context: err.context})
            );
          }
          successCallback();
        });
      });
    });
  },

  combineRegister: function() {
    if(this.state.registeredMailingLists && this.state.allMailingLists) {
      var userMailingList = this.state.registeredMailingLists;
      var mailingLists = _.map(this.state.allMailingLists, function(mailingList) {
        return _.merge(mailingList, {registered: !!userMailingList[mailingList.id]});
      });
      this.setState({
        mailingLists: mailingLists
      });
    }
  },

  render: function() {
    var self = this;

    var canAddList = this.constructor.validateUserPermissions({
      mailinglists: {
        users: {
          add: true
        }
      }
    });

    var canRemoveList = this.constructor.validateUserPermissions({
      mailinglists: {
        users: {
          remove: true
        }
      }
    });

    var canEditList = canAddList || canRemoveList;

    var mailingListsContent = null;
    if(this.state.mailingLists) {
      mailingListsContent = _.map(this.state.mailingLists, function(mailingList, i) {
        var valueLink = {
          value: mailingList.registered,
          requestChange: function(newRegistered) {
            mailingList.registered = newRegistered;
            self.setState({
              mailingLists: self.state.mailingLists
            });
          }
        }
        var label = <strong>{mailingList.name}</strong>;
        var registered = self.state.registeredMailingLists[mailingList.id];
        var disabled = registered && !canRemoveList ||
                       !registered && !canAddList;
        var input = (
          <BSInput
            type="checkbox"
            checkedLink={valueLink}
            label={label}
            disabled={disabled}
          />
        );
        return (
          <BSListGroupItem header={input} key={mailingList.id}>
            <i>
              {mailingList.description}
            </i>
          </BSListGroupItem>
        );
      });
    }

    return (
      <div>
        {this.renderFeedback()}
        <BSListGroup>
          {mailingListsContent}
        </BSListGroup>
        {canEditList ?
          <BSButton
            bsStyle="success"
            className="pull-right"
            onClick={this.saveChanges}
            disabled={this.state.busy || !this.hasChanges()}
          >
            {__("save")}
          </BSButton>
        : null}
      </div>
    );
  }
});

module.exports = MailingListUserInfo;
