var React = require("react");

var BSPanel = require("react-bootstrap/Panel");
var BSGrid  = require("react-bootstrap/Grid");
var BSRow   = require("react-bootstrap/Row");
var BSCol   = require("react-bootstrap/Col");
var BSInput = require("react-bootstrap/Input");

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
  mixins: [React.addons.LinkedStateMixin, MKFeedbacki18nMixin],

  propTypes: {
    idLink: valueLinkProps,
    nameLink: valueLinkProps,
    descriptionLink: valueLinkProps,
    showAtRegistrationLink: valueLinkProps,
    onDelete: React.PropTypes.func,
    onSave: React.PropTypes.func
  },

  getInitialState: function() {
    return this.getValues();
  },

  componentWillReceiveProps: function (nextProps) {
    // update state if a new mailing is taking this spot
    // except this spot was for a new mailing list
    if(
        nextProps.idLink.value !== this.props.idLink.value
    ) {
      // FIXME:: do not modify this.props directly
      this.props = nextProps;
      this.setState(this.getValues());
    }
  },

  getValues: function() {
    return {
      id: this.getField("id"),
      name: this.getField("name"),
      description: this.getField("description"),
      showAtRegistration: this.getField("showAtRegistration")
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
    var isNew = this.isNewMailingList();
    var buttonsConfig = [
      {
        icon: "save",
        tooltip: {
          text: __("save"),
          overlayProps: {
            placement: "top"
          }
        },
        props: {
          disabled: !this.hasChanges()
        },
        callback: _.bind(this.saveChanges, this)
      },
      {
        icon: "trash",
        tooltip: {
          text: __("remove"),
          overlayProps: {
            placement: "top"
          }
        },
        warningMessage: __("mailinglist::deleteMailingListWarning"),
        callback: _.bind(this.deleteMailingList, this)
      }
    ];
    if(isNew) {
      buttonsConfig[1].icon = "remove";
      buttonsConfig[1].warningMessage = __("areYouSure");
    }
    var showAtRegistration = !!this.props.showAtRegistrationLink.value;
    var registrationButton = [{
      icon:"check",
      tooltip: {
        text: __(
          "mailinglist::showAtRegistrationTooltip",
          {context: showAtRegistration ? "unset" : "set"}
        ),
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
    }];

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
                className="pull-right"
                style={{marginRight: "10px"}}
                buttons={registrationButton}
              />
            </BSCol>
            <BSCol xs={8} className="mailingList-name-form">
              <BSInput
                type="text"
                label={__("name")}
                valueLink={this.props.nameLink}
              />
            </BSCol>

          </BSRow>
          <BSRow>
            <BSCol md={12}>
              <BSInput
                type="textarea"
                className="resize-vertical"
                label={__("mailinglist::description")}
                placeholder={__("mailinglist::descriptionPlaceholder")}
                valueLink={this.props.descriptionLink}
              />
            </BSCol>
          </BSRow>
        </BSGrid>
      </BSPanel>
    );
  }
});

module.exports = MailingListEditPanel;
