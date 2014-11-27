var React = require("react");

var BSCol   = require("react-bootstrap/Col");
var BSRow   = require("react-bootstrap/Row");
var BSGrid  = require("react-bootstrap/Grid");
var BSPanel = require("react-bootstrap/Panel");

var MKAlertTrigger         = require("mykoop-core/components/AlertTrigger");
var MKIcon                 = require("mykoop-core/components/Icon");
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
      // sort them by name at least on load. Won't keep order after
      // to avoid seeing the mailing lists move around if their names are changed
      res = _.sortBy(res, function(mailingList) {
        return mailingList.name.toLowerCase();
      })
      self.setState({
        mailingLists: res
      })
    });
  },

  createNewMailingList: function () {
    var newMailingList = {
      id: -1,
      name: ""
    };
    this.state.mailingLists.push(newMailingList);
    this.setState({
      mailingLists: this.state.mailingLists
    });
  },

  mailingListDeleted: function(iMailingList) {
    var mailingLists = this.state.mailingLists;
    // inline remove of an item
    mailingLists.splice(iMailingList, 1);
    this.setState({
      mailingLists: mailingLists
    });
  },

  requestChange: function(mailingList, field, newValue) {
    mailingList[field] = newValue;
    this.setState({
      mailingLists: this.state.mailingLists
    });
  },

  makeValueLink: function(mailingList, field) {
    return {
      value: mailingList[field],
      requestChange: _.bind(this.requestChange, this, mailingList, field)
    }
  },

  render: function() {
    var self = this;
    var mailingLists = _.map(this.state.mailingLists, function(mailingList, i) {
      return (
        <BSCol md={4} sm={6} key={i}>
          <MKMailingListEditPanel
            idLink={self.makeValueLink(mailingList, "id")}
            nameLink={self.makeValueLink(mailingList, "name")}
            descriptionLink={self.makeValueLink(mailingList, "description")}
            onDelete={_.bind(self.mailingListDeleted, self, i)}
          />
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
          <BSCol md={4} sm={6} key="newMailingList">
            <BSPanel className="mailingList-new-panel" onClick={this.createNewMailingList}>
              <MKIcon glyph="plus-circle" className="mailingList-new" />
            </BSPanel>
          </BSCol>
        </BSRow>
      </BSCol>
    );
  }
});

module.exports = MailingListAdminPage;
