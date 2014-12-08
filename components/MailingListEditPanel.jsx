var React = require("react");

var BSPanel = require("react-bootstrap/Panel");
var BSGrid  = require("react-bootstrap/Grid");
var BSRow   = require("react-bootstrap/Row");
var BSCol   = require("react-bootstrap/Col");
var BSInput = require("react-bootstrap/Input");

var MKPermissionMixin   = require("mykoop-user/components/PermissionMixin");
var MKListModButtons    = require("mykoop-core/components/ListModButtons");
var MKAlert             = require("mykoop-core/components/Alert");
var MKFeedbacki18nMixin = require("mykoop-core/components/Feedbacki18nMixin");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var valueLinkProps = React.PropTypes.shape({
  value: React.PropTypes.any,
  requestChange: React.PropTypes.func.isRequired
}).isRequired;

var MailingListEditPanel = React.createClass({
  mixins: [
    MKPermissionMixin,
    React.addons.LinkedStateMixin,
    MKFeedbacki18nMixin
  ],

  propTypes: {
    idLink: valueLinkProps,
    nameLink: valueLinkProps,
    descriptionLink: valueLinkProps,
    showAtRegistrationLink: valueLinkProps,
    onDelete: React.PropTypes.func,
    onSave: React.PropTypes.func,
    permissionsLink: valueLinkProps,
    onMailingReset: React.PropTypes.func,
    requestPermissionChanges: React.PropTypes.func
  },

  getInitialState: function(props) {
    props = props || this.props;
    return {
      id: props.idLink.value,
      name: props.nameLink.value,
      description: props.descriptionLink.value,
      showAtRegistration: props.showAtRegistrationLink.value,
      permissions: _.clone(props.permissionsLink.value)
    };
  },

  componentWillReceiveProps: function (nextProps) {
    // update state if a new mailing is taking this spot
    // except this spot was for a new mailing list
    if(
        nextProps.idLink.value !== this.props.idLink.value
    ) {
      this.setState(this.getInitialState(nextProps));
    }
  },

  getValues: function() {
    return {
      id: this.getField("id"),
      name: this.getField("name"),
      description: this.getField("description"),
      showAtRegistration: this.getField("showAtRegistration"),
      permissions: this.getField("permissions")
    };
  },

  getField: function(field) {
    return this.props[field + "Link"].value;
  },

  hasChanges: function() {
    var values = this.getValues();
    var oldValues = _.pick(this.state, _.keys(values));
    return !_.isEqual(values, oldValues);
  },

  isNewMailingList: function() {
    return this.getField("id") < 0;
  },

  saveChanges: function() {
    var self = this;
    var isNew = this.isNewMailingList();
    var action = isNew ?
        actions.mailinglist.add
      : actions.mailinglist.update
    action({
      i18nErrors: {
        keys: ["app"],
        prefix: "mailinglist::errors"
      },
      data: this.getValues()
    }, function(err, res) {
      if(err) {
        console.error(err);
        return self.setFeedback(err.i18n, "danger");
      }

      self.setFeedback({key: "success"}, "success");
      self.setState(_.merge(self.getValues(), {
        id: isNew ? res.id : self.state.id
      }), function() {
        if(isNew) {
          self.props.idLink.requestChange(res.id);
        }
      });
    });
  },

  resetMailingList: function() {
    var newValues = {
      name: this.state.name,
      description: this.state.description,
      showAtRegistration: this.state.showAtRegistration,
      permissions: _.clone(this.state.permissions)
    }
    this.props.onMailingReset && this.props.onMailingReset(newValues);
  },

  deleteMailingList: function() {
    var self = this;
    var isNew = this.isNewMailingList();
    if(isNew) {
      return self.props.onDelete && self.props.onDelete();
    }
    actions.mailinglist.delete({
        i18nErrors: {
          keys: ["app", "validation"],
          prefix: "mailinglist::errors"
        },
        data: {
          id: this.getField("id")
        }
    }, function(err) {
      if(err) {
        console.error(err);
        return self.setFeedback(err.i18n, "danger");
      }
      self.props.onDelete && self.props.onDelete();
    });
  },

  render: function() {
    var self = this;

    var validatePermissions = this.constructor.validateUserPermissions;

    var canEditList = validatePermissions({
      mailinglists: {
        update: true
      }
    });

    var canDeleteList = validatePermissions({
      mailinglists: {
        delete: true
      }
    });

    var showAtRegistration = !!this.props.showAtRegistrationLink.value;
    var hasChanges = this.hasChanges();
    var isNew = this.isNewMailingList();
    var saveButton = canEditList && {
      icon: "save",
      tooltip: {
        text: __("save"),
        overlayProps: {
          placement: "top"
        }
      },
      props: {
        disabled: !hasChanges
      },
      callback: _.bind(this.saveChanges, this)
    };
    var editPermissionsButton = !showAtRegistration && canEditList && {
      icon: "shield",
      tooltip: {
        text: __("mailinglist::editPermissionsTooltip"),
        overlayProps: {placement: "top"}
      },
      callback: this.props.requestPermissionChanges
    };
    var cancelButton = hasChanges && {
      icon: "recycle",
      tooltip: {
        text: __("cancel"),
        overlayProps: {placement: "top"}
      },
      warningMessage: __("areYouSure"),
      callback: this.resetMailingList
    };
    var deleteButton = canDeleteList && !hasChanges && {
      icon: isNew ? "remove" : "trash",
      tooltip: {
        text: __("remove"),
        overlayProps: {placement: "top"}
      },
      warningMessage: isNew ? __("areYouSure") : __("mailinglist::deleteMailingListWarning"),
      callback: this.deleteMailingList
    };
    var buttonsConfig = _.compact([
      saveButton,
      editPermissionsButton,
      deleteButton,
      cancelButton
    ]);

    var registrationButton = canEditList || isNew ? [{
      icon:"check",
      tooltip: {
        text: __("mailinglist::showAtRegistrationTooltip"),
        overlayProps: {
          placement: "top"
        }
      },
      props:{
        className: showAtRegistration ?
          "active"
        : undefined
      },
      callback: function(e) {
        self.props.showAtRegistrationLink.requestChange(!showAtRegistration);
        e.target.blur();
      }
    }] : [];

    return (
      <BSPanel className="mailingList-edit-min-height">
        {this.renderFeedback()}
        <BSGrid className="mailingListPanel" fluid>
          <BSRow>
            <BSCol md={4} className="pull-right mailingList-actions-buttons">
              <MKListModButtons
                className="pull-right"
                buttons={buttonsConfig}
              />
              <MKListModButtons
                className="pull-right mailing-list-registration-action"
                buttons={registrationButton}
              />
            </BSCol>
            <BSCol xs={8} className="mailingList-name-form">
              {canEditList ?
                <BSInput
                  type="text"
                  label={__("name")}
                  valueLink={this.props.nameLink}
                /> :
                <strong>{this.props.nameLink.value}</strong>
              }
            </BSCol>

          </BSRow>
          <BSRow>
            <BSCol md={12}>
              {canEditList ?
                <BSInput
                  type="textarea"
                  className="resize-vertical"
                  label={__("mailinglist::description")}
                  placeholder={__("mailinglist::descriptionPlaceholder")}
                  valueLink={this.props.descriptionLink}
                /> :
                <p>{this.props.descriptionLink.value}</p>
              }
            </BSCol>
          </BSRow>
        </BSGrid>
      </BSPanel>
    );
  }
});

module.exports = MailingListEditPanel;
