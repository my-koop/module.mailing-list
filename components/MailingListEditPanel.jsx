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
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    description: React.PropTypes.string
  },

  getInitialState: function() {
    return  {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      feedback: {
        i18n: []
      }
    }
  },

  hasChanges: function() {
    return this.props.name !== this.state.name ||
      this.props.description !== this.state.description;
  },

  saveChanges: function() {
    var isNew = !~this.state.id;
    var self = this;
    var action = isNew ?
        actions.mailinglist.add
      : actions.mailinglist.update
    action({
      i18nErrors: {keys: ["app", "validation"]},
      silent: true,
      data: {
        id: !isNew ? this.state.id : undefined,
        name: this.state.name,
        description: this.state.description
      }
    }, function(err, res) {
      if(err) {
        console.log(err);
        return self.setState({
          feedback: {
            i18n: !_.isEmpty(err.i18n) ?
              _.map(err.i18n, function(i18n) {
                return {
                  key: "mailinglist::updateMailingList." + i18n.key,
                  var: i18n.var
                }
              })
            : [{key: "errors", context: err.context}],
            style: "danger"
          }
        })
      }
      self.setState({
        feedback: {i18n: [{key: "success"}], style: "success"},
        id: isNew ? res.id : self.state.id
      });
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
    var isNew = !~this.state.id;
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
        }
      }
    ];
    if(isNew) {
      // remove delete button if it's a new mailing list
      buttonsConfig.pop();
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
                valueLink={this.linkState("name")}
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
                valueLink={this.linkState("description")}
              />
            </BSCol>
          </BSRow>
        </BSGrid>
      </BSPanel>
    );
  }
});

module.exports = MailingListEditPanel;
