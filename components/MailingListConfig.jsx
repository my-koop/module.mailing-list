var React = require('react');

var BSCol    = require("react-bootstrap/Col");
var BSInput  = require("react-bootstrap/Input");
var BSButton = require("react-bootstrap/Button");

var MKCollapsablePanel = require("mykoop-core/components/CollapsablePanel");
var MKFeedbacki18nMixin = require("mykoop-core/components/Feedbacki18nMixin");

var actions = require("actions");
var __ = require("language").__;

var MailingListConfig = React.createClass({
  mixins: [React.addons.LinkedStateMixin, MKFeedbacki18nMixin],

  getInitialState: function() {
    return {
      globalSender: ""
    };
  },

  componentWillMount: function () {
    var self = this;
    actions.mailinglist.config.get({
      i18nErrors: {}
    },function(err, res) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      self.setState({
        globalSender: res.globalSender
      });
    });
  },

  saveConfig: function() {
    var self = this;
    self.clearFeedback();
    actions.mailinglist.config.set({
      i18nErrors: {},
      data: {
        globalSender: this.state.globalSender
      }
    },function(err, res) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      self.setFeedback({key: "success"}, "success");
    });
  },

  render: function () {
    return (
      <BSCol md={6}>
        <MKCollapsablePanel header={__("mailinglist::config")}>
          {this.renderFeedback()}
          <BSInput
            type="email"
            label={__("mailinglist::globalEmail")}
            valueLink={this.linkState("globalSender")}
          />
          <BSButton
            bsStyle="primary"
            onClick={this.saveConfig}
          >
            {__("update")}
          </BSButton>
        </MKCollapsablePanel>
      </BSCol>
    );
  }
});

module.exports = MailingListConfig;
