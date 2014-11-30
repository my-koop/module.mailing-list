var React = require('react');

var BSCol     = require("react-bootstrap/Col");
var BSRow     = require("react-bootstrap/Row");
var BSPanel   = require("react-bootstrap/Panel");
var BSInput   = require("react-bootstrap/Input");
var BSButton  = require("react-bootstrap/Button");

var MKFeedbackMixin = require("mykoop-core/components/Feedbacki18nMixin");
var MKRichTextBox = require("mykoop-core/components/RichTextBox");
var MKConfirmationTrigger = require("mykoop-core/components/ConfirmationTrigger");

var _ = require("lodash");
var __ = require("language").__;
var actions = require("actions");

var SendEmailPage = React.createClass({
  mixins: [MKFeedbackMixin],

  getInitialState: function() {
    return {
      mailingList: {},
      allMailingLists: {},
      subject: ""
    }
  },

  componentWillMount: function () {
    var self = this;
    actions.mailinglist.list({
      i18nErrors: {}
    }, function(err, res) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }

      self.setState({
        allMailingLists: _.indexBy(res, "id"),
        mailingList: _.first(res)
      });
    });
  },

  sendEmail: function() {
    console.log(this.state.mailingList);
    console.log(this.refs.editor.getText());
    var self = this;
    self.clearFeedback();
    actions.mailinglist.send({
      i18nErrors: {},
      data: {
        id: this.state.mailingList.id,
        content: this.refs.editor.getText(),
        subject: this.state.subject
      }
    }, function(err) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      return self.setFeedback({key: "success"}, "success");
    });
  },

  render: function () {
    var self = this;
    var mailingListLink = {
      value: this.state.mailingList.id || null,
      requestChange: function(newId) {
        var newMailingList = self.state.allMailingLists[newId];
        if(newMailingList) {
          self.setState({
            mailingList: newMailingList
          });
        }
      }
    }

    var subjectLink = {
      value: this.state.subject,
      requestChange: function(newSubject) {
        self.setState({
          subject: newSubject
        });
      }
    };

    var mailingListOptions = _.map(this.state.allMailingLists, function(mailingList) {
      return (
        <option value={mailingList.id} key={mailingList.id}>
          {mailingList.name}
        </option>
      );
    });

    return (
      <BSCol md={12}>
        <h1>
          {__("mailinglist::sendEmailWelcome")}
        </h1>
        {this.renderFeedback()}
        { !_.isEmpty(this.state.allMailingLists) ?
        <BSPanel>
          <BSRow>
            <BSCol xs={8} md={6} lg={4}>
              <BSInput
                type="select"
                label={__("mailinglist::mailingLists")}
                valueLink={mailingListLink}
              >
                {mailingListOptions}
              </BSInput>
            </BSCol>
            <BSCol xs={4}>
                <MKConfirmationTrigger
                  message={__("areYouSure")}
                  onYes={this.sendEmail}
                >
                  <BSButton bsStyle="primary">
                    {__("send")}
                  </BSButton>
                </MKConfirmationTrigger>
            </BSCol>
          </BSRow>
          <BSRow>
            <BSCol xs={12}>
              <BSInput
                type="text"
                label={__("mailinglist::subject")}
                valueLink={subjectLink}
              />
              <MKRichTextBox className="col-xs-12" ref="editor"/>
            </BSCol>
          </BSRow>
        </BSPanel>
        : null }
      </BSCol>
    );
  }
});

module.exports = SendEmailPage;
