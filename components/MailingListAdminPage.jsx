var React = require("react");

var BSCol  = require("react-bootstrap/Col");
var BSRow  = require("react-bootstrap/Row");
var BSGrid = require("react-bootstrap/Grid");
var BSPanel = require("react-bootstrap/Panel");

var MKAlertTrigger         = require("mykoop-core/components/AlertTrigger");
var MKIcon         = require("mykoop-core/components/Icon");
var MKMailingListEditPanel = require("./MailingListEditPanel");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");

var MailingListAdminPage = React.createClass({
  getInitialState: function() {
    return {
      mailingLists: []
    }
  },

  componentWillMount: function () {
    var self = this;
    actions.mailinglist.list(function(err, res) {
      if(err) {
        console.error(err);
        MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
        return;
      }

      self.setState({
        mailingLists: res
      })
    });
  },

  createNewMailingList: function () {
    var newMl = {
      id: -1,
      name: ""
    };
    this.state.mailingLists.push(newMl);
    this.setState({
      mailingLists: this.state.mailingLists
    });
  },

  render: function() {
    var mailingLists = _.map(this.state.mailingLists, function(ml, i) {
      return (
        <BSCol md={4} sm={6} key={i}>
          <MKMailingListEditPanel {...ml} />
        </BSCol>
      );
    });
    return (
      <BSCol>
        <h1>
          {__("mailinglist::adminEditWelcome")}
        </h1>
        <BSRow>
          {mailingLists}
          <BSCol md={4} sm={6} key={mailingLists.length}>
            <BSPanel className="ml-new-panel" onClick={this.createNewMailingList}>
              <MKIcon glyph="plus-circle" className="ml-new" />
            </BSPanel>
          </BSCol>
        </BSRow>
      </BSCol>
    );
  }
});

module.exports = MailingListAdminPage;
