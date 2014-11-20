var React = require("react");

var BSPanel = require("react-bootstrap/Panel");
var BSGrid = require("react-bootstrap/Grid");
var BSRow  = require("react-bootstrap/Row");
var BSCol  = require("react-bootstrap/Col");
var BSInput  = require("react-bootstrap/Input");

var MKListModButtons = require("mykoop-core/components/ListModButtons");
var MKAlert = require("mykoop-core/components/Alert");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var MailingListEditPanel = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    idLink: React.PropTypes.shape({
      value: React.PropTypes.number.isRequired,
      requestChange: React.PropTypes.func.isRequired
    }).isRequired,
    nameLink: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      requestChange: React.PropTypes.func.isRequired
    }).isRequired,
    descriptionLink: React.PropTypes.shape({
      value: React.PropTypes.string,
      requestChange: React.PropTypes.func.isRequired
    }).isRequired,
    onDelete: React.PropTypes.func,
    onSave: React.PropTypes.func
  },

  getInitialState: function() {
    return _.merge(this.getValues(), {
      feedback: {
        i18n: []
      }
    });
  },

  componentWillReceiveProps: function (nextProps) {
    // update state if a new mailing is taking this spot
    // except this spot was for a new mailing list
    if(
        nextProps.idLink.value !== this.props.idLink.value &&
        this.props.idLink.value !== -1
    ) {
      this.props = nextProps;
      this.setState(_.merge(this.getValues(), {feedback: {i18n: []}}));
    }
  },

  getValues: function() {
    return {
      id: this.getField("id"),
      name: this.getField("name"),
      description: this.getField("description")
    };
  },

  getField: function(field) {
    return this.props[field + "Link"].value;
  },

  hasChanges: function() {
    return (this.getField("name") !== this.state.name) ||
      this.getField("description") !== this.state.description;
  },

  saveChanges: function() {
    var isNew = !~this.getField("id");
    var self = this;
    var action = isNew ?
        actions.mailinglist.add
      : actions.mailinglist.update
    action({
      i18nErrors: {
        keys: ["app", "validation"],
        prefix: "mailinglist::updateMailingList."
      },
      data: {
        id: !isNew ? this.getField("id") : undefined,
        name: this.getField("name"),
        description: this.getField("description")
      }
    }, function(err, res) {
      if(err) {
        console.log(err);
        return self.setState({
          feedback: {
            i18n: err.i18n,
            style: "danger"
          }
        });
      }

      self.setState(_.merge(self.getValues(), {
        feedback: {i18n: [{key: "success"}], style: "success"},
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
    var isNew = !~this.getField("id");
    if(isNew) {
      return self.props.onDelete && self.props.onDelete();
    }
    actions.mailinglist.delete({
        i18nErrors: {
          keys: ["app", "validation"],
          prefix: "mailinglist::updateMailingList."
        },
        data: {
          id: this.getField("id")
        }
    }, function(err) {
      if(err) {
        return self.setState({
          feedback: {
            i18n: err.i18n,
            style: "danger"
          }
        });
      }
      self.props.onDelete && self.props.onDelete();
    });
  },

  clearMessage: function() {
    this.setState({
      feedback: {
        i18n: []
      }
    });
  },

  render: function() {
    var isNew = !~this.getField("id");
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
      buttonsConfig[1].icon =  "remove";
      buttonsConfig[1].warningMessage = __("areYouSure");
    }
    var message = !_.isEmpty(this.state.feedback.i18n) ?
      _.map(this.state.feedback.i18n, function(f, i) {
        return <div key={i}>{__(f.key, {context: f.context, var: f.var})}</div>;
      })
    : null;

    return (
      <BSPanel className="ml-edit-min-height">
        <MKAlert bsStyle={this.state.feedback.style} onHide={this.clearMessage}>
          {message}
        </MKAlert>
        <BSGrid className="mailingListPanel" fluid>
          <BSRow>
            <BSCol md={4} className="pull-right ml-actions-buttons">
              <MKListModButtons
                className="pull-right"
                buttons={buttonsConfig}
              />
            </BSCol>
            <BSCol md={8} className="ml-name-form">
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
                className="textarea-resize-vertical"
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
